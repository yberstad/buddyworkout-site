import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { before, describe, it } from 'node:test';
import { build, findPlaceholders } from '../build.mjs';

let dist;
let config;
const pages = [
  'index.html',
  'support.html',
  'privacy.html',
  'no/index.html',
  'no/support.html',
  'no/personvern.html',
];

const read = (p) => readFileSync(join(dist, p), 'utf8');

before(() => {
  process.env.SITE_URL = 'https://example.test/base';
  ({ dist, config } = build());
});

describe('pages', () => {
  it('writes all pages in both languages', () => {
    for (const p of pages) assert.ok(existsSync(join(dist, p)), p);
  });

  it('has lang, title, description, canonical and hreflang pairs', () => {
    for (const p of pages) {
      const html = read(p);
      const lang = p.startsWith('no/') ? 'nb' : 'en';
      assert.match(html, new RegExp(`<html lang="${lang}">`), p);
      assert.match(html, /<title>[^<]{10,}<\/title>/, p);
      assert.match(html, /<meta name="description" content="[^"]{50,}">/, p);
      assert.match(html, /<link rel="canonical" href="https:\/\/example\.test\/base\//, p);
      assert.match(html, /hreflang="en" href="https:\/\/example\.test\/base\//, p);
      assert.match(html, /hreflang="nb" href="https:\/\/example\.test\/base\/no\//, p);
      assert.match(html, /hreflang="x-default"/, p);
    }
  });

  it('uses the configured site URL in canonical links, sitemap and robots', () => {
    assert.match(read('privacy.html'), /rel="canonical" href="https:\/\/example\.test\/base\/privacy\.html"/);
    assert.match(read('no/personvern.html'), /rel="canonical" href="https:\/\/example\.test\/base\/no\/personvern\.html"/);
    assert.match(read('sitemap.xml'), /<loc>https:\/\/example\.test\/base\/no\/support\.html<\/loc>/);
    assert.match(read('robots.txt'), /Sitemap: https:\/\/example\.test\/base\/sitemap\.xml/);
  });

  it('shows the owner details on the privacy policy in both languages', () => {
    for (const p of ['privacy.html', 'no/personvern.html']) {
      const html = read(p);
      assert.ok(html.includes(config.owner.name), p);
      assert.ok(html.includes(config.owner.orgNumber), p);
      assert.ok(html.includes('Skylehamaren 21'), p);
      assert.ok(html.includes(config.owner.email), p);
      assert.ok(html.includes(config.updated), p);
    }
  });

  it('hides store badges until the store URLs exist', () => {
    assert.ok(!read('index.html').includes('class="button"'));
  });
});

describe('links and requests', () => {
  const attrs = (html, name) => [...html.matchAll(new RegExp(`\\s${name}="([^"]*)"`, 'g'))].map((m) => m[1]);

  it('resolves every internal link and anchor target', () => {
    for (const p of pages) {
      const html = read(p);
      const targets = [...attrs(html, 'href'), ...attrs(html, 'src')].filter(
        (u) => !/^(https?:|mailto:)/.test(u) && !u.startsWith('#'),
      );
      for (const u of targets) {
        const file = normalize(join(dirname(join(dist, p)), u.split('#')[0] || '.'));
        const target = existsSync(file) && !file.endsWith('/') && readdirSafe(file) === null ? file : join(file, 'index.html');
        assert.ok(existsSync(target), `${p} links to missing ${u}`);
      }
      for (const u of attrs(html, 'href').filter((x) => x.startsWith('#'))) {
        assert.ok(html.includes(`id="${u.slice(1)}"`), `${p} has no ${u}`);
      }
    }
  });

  it('makes no external requests (only mailto and plain links, no scripts, no remote assets)', () => {
    for (const p of [...pages, 'style.css']) {
      const text = read(p);
      assert.ok(!/<script/i.test(text), `${p} has a script`);
      assert.ok(!/<iframe|<img[^>]+src="https?:|url\(\s*['"]?https?:|@import/i.test(text), `${p} loads a remote resource`);
      for (const tag of text.match(/<link [^>]*>/g) ?? []) {
        if (/rel="(stylesheet|icon|preload)"/.test(tag)) assert.ok(!/href="https?:/.test(tag), `${p}: ${tag}`);
      }
    }
  });

  it('switches language between the matching pages', () => {
    assert.match(read('privacy.html'), /href="no\/personvern\.html" lang="nb"/);
    assert.match(read('no/personvern.html'), /href="\.\.\/privacy\.html" lang="en"/);
    assert.match(read('no/index.html'), /href="\.\.\/index\.html" lang="en"/);
  });

  it('sets aria-current on the active nav link and has a skip link and one h1', () => {
    for (const p of pages) {
      const html = read(p);
      assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1, p);
      assert.match(html, /class="skip" href="#content"/, p);
      assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1, p);
    }
  });
});

describe('placeholders', () => {
  it('finds none in the shipped config and output', () => {
    assert.deepEqual(findPlaceholders(dist, config), []);
  });

  it('blocks a production build while a TODO_OWNER: placeholder remains', () => {
    assert.deepEqual(findPlaceholders(dist, { owner: { email: 'TODO_OWNER: e-mail' } }), ['site.config.json']);
  });
});

function readdirSafe(p) {
  try {
    return readdirSync(p);
  } catch {
    return null;
  }
}
