// Builds the static site into dist/. No dependencies: `node build.mjs`.
//   SITE_URL=https://example.com node build.mjs   overrides siteUrl from site.config.json
//   node build.mjs --production                    also fails while any TODO_OWNER: placeholder remains
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { files, pages, storeText, ui } from './content.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const langs = ['en', 'nb'];
const slugs = ['home', 'support', 'privacy'];
const dirOf = (lang) => (lang === 'en' ? '' : 'no/');

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/** Path of a page from the site root, e.g. `no/personvern.html`. */
const pathOf = (lang, slug) => dirOf(lang) + files[lang][slug];

/** Public URL of a page. The home pages use the folder URL. */
function urlOf(siteUrl, lang, slug) {
  return slug === 'home' ? `${siteUrl}/${dirOf(lang)}` : `${siteUrl}/${pathOf(lang, slug)}`;
}

export function loadConfig() {
  const config = JSON.parse(readFileSync(join(root, 'site.config.json'), 'utf8'));
  const siteUrl = (process.env.SITE_URL || config.siteUrl).replace(/\/+$/, '');
  return { ...config, siteUrl };
}

function renderPage(config, lang, slug) {
  const t = ui[lang];
  const other = lang === 'en' ? 'nb' : 'en';
  const up = lang === 'en' ? '' : '../';
  const page = pages[lang][slug];

  // Links relative to the current folder, so the site works under any base path.
  const href = (toSlug) => files[lang][toSlug];
  const switchTarget = lang === 'en' ? `no/${files.nb[slug]}` : `../${files.en[slug]}`;

  const badges = [
    config.storeLinks.appStore && `<a class="button" href="${escapeHtml(config.storeLinks.appStore)}">${storeText[lang].appStore}</a>`,
    config.storeLinks.googlePlay && `<a class="button" href="${escapeHtml(config.storeLinks.googlePlay)}">${storeText[lang].googlePlay}</a>`,
  ].filter(Boolean);
  const links = badges.length ? `  <div class="badges">${badges.join('')}</div>` : '';

  const body = page.body({ owner: config.owner, updated: config.updated, links });
  const alt = (l) => `<link rel="alternate" hreflang="${ui[l].htmlLang}" href="${urlOf(config.siteUrl, l, slug)}">`;

  const nav = slugs
    .map((s) => {
      const current = s === slug ? ' aria-current="page"' : '';
      return `<li><a href="${href(s)}"${current}>${t.nav[s]}</a></li>`;
    })
    .join('');

  return `<!doctype html>
<html lang="${t.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(page.title)}</title>
<meta name="description" content="${escapeHtml(page.description)}">
<meta name="color-scheme" content="light dark">
<link rel="canonical" href="${urlOf(config.siteUrl, lang, slug)}">
${alt('en')}
${alt('nb')}
<link rel="alternate" hreflang="x-default" href="${urlOf(config.siteUrl, 'en', slug)}">
<link rel="icon" href="${up}favicon.png">
<link rel="stylesheet" href="${up}style.css">
</head>
<body>
<a class="skip" href="#content">${t.skip}</a>
<header class="site"><div class="wrap">
<a class="brand" href="${href('home')}">${config.appName}</a>
<nav aria-label="${t.navLabel}"><ul>${nav}<li><a href="${switchTarget}" lang="${ui[other].htmlLang}" hreflang="${ui[other].htmlLang}">${t.switchTo}</a></li></ul></nav>
</div></header>
<main id="content"><div class="wrap">${body}
</div></main>
<footer class="site"><div class="wrap">
<p>${t.footerOwner} ${config.owner.name} · <a href="mailto:${config.owner.email}">${config.owner.email}</a></p>
<p>${t.footerNoTracking}</p>
</div></footer>
</body>
</html>
`;
}

export function build({ production = false } = {}) {
  const config = loadConfig();
  const dist = join(root, 'dist');
  rmSync(dist, { recursive: true, force: true });
  mkdirSync(join(dist, 'no'), { recursive: true });

  cpSync(join(root, 'src', 'style.css'), join(dist, 'style.css'));
  cpSync(join(root, 'src', 'fonts'), join(dist, 'fonts'), { recursive: true });
  cpSync(join(root, 'src', 'favicon.png'), join(dist, 'favicon.png'));
  writeFileSync(join(dist, '.nojekyll'), '');

  const urls = [];
  for (const lang of langs) {
    for (const slug of slugs) {
      writeFileSync(join(dist, pathOf(lang, slug)), renderPage(config, lang, slug));
      urls.push(urlOf(config.siteUrl, lang, slug));
    }
  }

  writeFileSync(
    join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => `  <url><loc>${u}</loc></url>`)
      .join('\n')}\n</urlset>\n`,
  );
  writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
  writeFileSync(
    join(dist, '404.html'),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found</title><meta name="robots" content="noindex"><link rel="stylesheet" href="style.css"></head><body><main><div class="wrap"><h1>Page not found</h1><p><a href="./">BuddyWorkout</a></p></div></main></body></html>\n`,
  );

  if (production) {
    const left = findPlaceholders(dist, config);
    if (left.length) {
      throw new Error(`Production build blocked, TODO_OWNER: placeholders remain:\n${left.join('\n')}`);
    }
  }
  return { dist, config };
}

/** Every `TODO_OWNER:` left in the config or in the generated HTML. */
export function findPlaceholders(dist, config) {
  const hits = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(html|xml|txt|json)$/.test(e.name) && readFileSync(p, 'utf8').includes('TODO_OWNER:')) hits.push(p);
    }
  };
  if (existsSync(dist)) walk(dist);
  if (JSON.stringify(config).includes('TODO_OWNER:')) hits.push('site.config.json');
  return hits;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { dist, config } = build({ production: process.argv.includes('--production') });
  console.log(`Built ${dist} for ${config.siteUrl}`);
}
