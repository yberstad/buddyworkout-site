import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { before, describe, it } from 'node:test';
import { appleAppSiteAssociation, assetLinks, build, findPlaceholders } from '../build.mjs';

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
    assert.match(read('privacy.html'), /rel="canonical" href="https:\/\/example\.test\/base\/privacy"/);
    assert.match(read('no/personvern.html'), /rel="canonical" href="https:\/\/example\.test\/base\/no\/personvern"/);
    assert.match(read('no/index.html'), /rel="canonical" href="https:\/\/example\.test\/base\/no\/"/);
    assert.match(read('sitemap.xml'), /<loc>https:\/\/example\.test\/base\/no\/support<\/loc>/);
    assert.ok(!/\.html/.test(read('sitemap.xml')), 'sitemap has .html URLs');
    assert.match(read('robots.txt'), /Sitemap: https:\/\/example\.test\/base\/sitemap\.xml/);
  });

  it('shows the owner details on the privacy policy in both languages', () => {
    for (const p of ['privacy.html', 'no/personvern.html']) {
      const html = read(p);
      assert.ok(html.includes(config.owner.name), p);
      if (config.owner.orgNumber) assert.ok(html.includes(config.owner.orgNumber), p);
      if (config.owner.address) assert.ok(html.includes(config.owner.address), p);
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
        assert.ok(!/\.html(#|$)/.test(u), `${p} links to ${u}: page links have no .html`);
        const file = normalize(join(dirname(join(dist, p)), u.split('#')[0] || '.'));
        // The host serves `x.html` at `x` and `x/index.html` at `x/`.
        const target = [file, `${file}.html`, join(file, 'index.html')].find((f) => existsSync(f) && readdirSafe(f) === null);
        assert.ok(target, `${p} links to missing ${u}`);
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
    assert.match(read('privacy.html'), /href="no\/personvern" lang="nb"/);
    assert.match(read('no/personvern.html'), /href="\.\.\/privacy" lang="en"/);
    assert.match(read('no/index.html'), /href="\.\.\/" lang="en"/);
    assert.match(read('index.html'), /href="no\/" lang="nb"/);
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

describe('share links', () => {
  const app = {
    appleAppIds: ['ABCDE12345.no.example.app'],
    androidPackage: 'no.example.app',
    androidCertFingerprints: [],
  };
  const fingerprint = Array.from({ length: 32 }, (_, i) => (i * 7).toString(16).padStart(2, '0').toUpperCase()).join(':');

  it('publishes apple-app-site-association for /s links, served as JSON', () => {
    const aasa = JSON.parse(read('.well-known/apple-app-site-association'));
    assert.deepEqual(aasa.applinks.details[0].appIDs, config.app.appleAppIds);
    assert.deepEqual(aasa.applinks.details[0].components, [{ '/': '/s' }, { '/': '/s/*' }]);
    assert.match(read('_headers'), /^\/\.well-known\/apple-app-site-association\n {2}Content-Type: application\/json$/m);
  });

  it('uses Team ID and bundle ID in the app ID', () => {
    for (const id of config.app.appleAppIds) assert.match(id, /^[A-Z0-9]{10}\.no\.sharpnet\.buddyworkout$/);
    assert.deepEqual(appleAppSiteAssociation(app).applinks.details[0].appIDs, app.appleAppIds);
  });

  it('leaves out assetlinks.json while no Android fingerprint is configured', () => {
    assert.equal(config.app.androidCertFingerprints.length === 0, !existsSync(join(dist, '.well-known/assetlinks.json')));
  });

  it('writes Android app links for the package and fingerprints', () => {
    const [entry] = assetLinks({ ...app, androidCertFingerprints: [fingerprint] });
    assert.deepEqual(entry.relation, ['delegate_permission/common.handle_all_urls']);
    assert.deepEqual(entry.target, {
      namespace: 'android_app',
      package_name: 'no.example.app',
      sha256_cert_fingerprints: [fingerprint],
    });
  });

  it('rejects a malformed fingerprint', () => {
    assert.throws(() => assetLinks({ ...app, androidCertFingerprints: [fingerprint.toLowerCase()] }));
    assert.throws(() => assetLinks({ ...app, androidCertFingerprints: ['AB:CD'] }));
  });

  it('serves the fallback page at /s and under /s/, in both languages, without scripts', () => {
    assert.match(read('_redirects'), /^\/s\/\* \/s 200$/m);
    const html = read('s.html');
    assert.match(html, /<meta name="robots" content="noindex">/);
    assert.match(html, /<html lang="en">/);
    assert.match(html, /<section lang="nb">/);
    assert.match(html, /href="\/style\.css"/);
    assert.ok(!/<script/i.test(html));
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
