// Builds the static site into dist/. No dependencies: `node build.mjs`.
//   SITE_URL=https://example.com node build.mjs   overrides siteUrl from site.config.json
//   node build.mjs --production                    also fails while any TODO_OWNER: placeholder remains
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { files, pages, sharePage, storeText, ui } from './content.mjs';
import { CH, T } from './src/site/copy.js';
import { chapterHtml, endHtml, footHtml, navHtml, storesHtml } from './src/site/render.js';

const root = dirname(fileURLToPath(import.meta.url));
const langs = ['en', 'nb'];
const slugs = ['home', 'support', 'privacy'];
const dirOf = (lang) => (lang === 'en' ? '' : 'no/');
/** Norwegian is the default: the home page is at `/`, English at `/en/`. Support and privacy URLs are published in the stores and stay put. */
const homeDirOf = (lang) => (lang === 'en' ? 'en/' : '');

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/** File of a page from the site root, e.g. `no/personvern.html`. */
const pathOf = (lang, slug) => (slug === 'home' ? homeDirOf(lang) : dirOf(lang)) + files[lang][slug];

/** Page name in URLs: no `.html` (the host redirects `.html` to it), and '' for the home page. */
const nameOf = (lang, slug) => (slug === 'home' ? '' : files[lang][slug].replace(/\.html$/, ''));

/** Public URL of a page, e.g. `https://buddyworkout.com/no/personvern`. */
function urlOf(siteUrl, lang, slug) {
  return `${siteUrl}/${slug === 'home' ? homeDirOf(lang) : dirOf(lang)}${nameOf(lang, slug)}`;
}

const fingerprintPattern = /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/;

/** iOS universal links: share links under /s open the app. */
export function appleAppSiteAssociation(app) {
  return {
    applinks: {
      details: [{ appIDs: app.appleAppIds, components: [{ '/': '/s' }, { '/': '/s/*' }] }],
    },
  };
}

/** Android app links. Each fingerprint is the SHA-256 of a signing certificate, e.g. Play's app signing key. */
export function assetLinks(app) {
  for (const f of app.androidCertFingerprints) {
    if (!fingerprintPattern.test(f)) throw new Error(`Not a SHA-256 certificate fingerprint (AA:BB:… upper case): ${f}`);
  }
  return [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: app.androidPackage,
        sha256_cert_fingerprints: app.androidCertFingerprints,
      },
    },
  ];
}

function badgesOf(config, lang) {
  const badges = [
    config.storeLinks.appStore && `<a class="button" href="${escapeHtml(config.storeLinks.appStore)}">${storeText[lang].appStore}</a>`,
    config.storeLinks.googlePlay && `<a class="button" href="${escapeHtml(config.storeLinks.googlePlay)}">${storeText[lang].googlePlay}</a>`,
  ].filter(Boolean);
  return badges.length ? `  <div class="badges">${badges.join('')}</div>` : '';
}

/** Icon and Open Graph tags for link previews. No og:image: it makes iMessage show a large card; the touch icon gives a small icon beside the title. */
function previewTags(config, title, description, base) {
  return `<link rel="icon" href="${base}favicon.png">
<link rel="apple-touch-icon" href="${base}apple-touch-icon.png">
<meta property="og:site_name" content="${escapeHtml(config.appName)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">`;
}

/** Fallback for share links (/s and /s/…) on a device without the app. Paths are root-absolute: it is served under /s/. */
function renderSharePage(config) {
  const { en, nb } = sharePage;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(en.title)}</title>
<meta name="robots" content="noindex">
<meta name="color-scheme" content="light dark">
${previewTags(config, en.title, en.text, '/')}
<link rel="stylesheet" href="/style.css">
</head>
<body>
<main id="content"><div class="wrap">
<h1>${en.heading}</h1>
<p>${en.text}</p>
<section lang="nb">
<h2>${nb.heading}</h2>
<p>${nb.text}</p>
</section>
${badgesOf(config, 'en')}
<p><a href="/">${config.appName}</a></p>
</div></main>
</body>
</html>
`;
}

export function loadConfig() {
  const config = JSON.parse(readFileSync(join(root, 'site.config.json'), 'utf8'));
  const siteUrl = (process.env.SITE_URL || config.siteUrl).replace(/\/+$/, '');
  return { ...config, siteUrl };
}

/** The animated home page: markup and copy are prerendered per language; src/site/home.js only adds the motion. */
function renderHome(config, lang) {
  const t = ui[lang];
  const k = lang === 'en' ? 'en' : 'no';
  const up = lang === 'en' ? '../' : '';
  const copy = T[k];
  const links = { ios: config.storeLinks.appStore, android: config.storeLinks.googlePlay };
  const stores = storesHtml(k, links, `${up}site/badges/`);
  const alt = (l) => `<link rel="alternate" hreflang="${ui[l].htmlLang}" href="${urlOf(config.siteUrl, l, 'home')}">`;
  const values = {
    htmlLang: t.htmlLang,
    title: escapeHtml(copy['meta.title']),
    description: escapeHtml(copy['meta.desc']),
    canonical: urlOf(config.siteUrl, lang, 'home'),
    alternates: `${alt('en')}\n${alt('nb')}\n<link rel="alternate" hreflang="x-default" href="${urlOf(config.siteUrl, 'nb', 'home')}">`,
    preview: previewTags(config, copy['meta.title'], copy['meta.desc'], up),
    up,
    skip: copy['a11y.skip'],
    nav: navHtml(k, { noHref: lang === 'en' ? '../' : './', enHref: lang === 'en' ? './' : 'en/' }),
    heroStores: stores,
    chapters: CH.map((c) => chapterHtml(c, k)).join('\n'),
    end: endHtml(k, stores),
    foot: footHtml(k, {
      privacyHref: (lang === 'en' ? '../' : 'no/') + nameOf(lang, 'privacy'),
      supportHref: (lang === 'en' ? '../' : 'no/') + nameOf(lang, 'support'),
    }),
    'hero.kick': copy['hero.kick'], 'hero.title': copy['hero.title'], 'hero.sub': copy['hero.sub'],
    'timer.kick': copy['timer.kick'], 'timer.title': copy['timer.title'], 'timer.body': copy['timer.body'],
  };
  return readFileSync(join(root, 'src', 'home.html'), 'utf8').replace(/\{\{([\w.]+)\}\}/g, (_, key) => values[key]);
}

function renderPage(config, lang, slug) {
  const t = ui[lang];
  const other = lang === 'en' ? 'nb' : 'en';
  const up = lang === 'en' ? '' : '../';
  const page = pages[lang][slug];

  // Links relative to the current folder, without `.html`, so the site works under any base path.
  const href = (toSlug) => (toSlug === 'home' ? (lang === 'en' ? 'en/' : '../') : nameOf(lang, toSlug));
  const switchTarget = (lang === 'en' ? 'no/' : '../') + nameOf(other, slug);
  const links = badgesOf(config, lang);

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
${previewTags(config, page.title, page.description, up)}
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
  mkdirSync(join(dist, 'en'), { recursive: true });

  cpSync(join(root, 'src', 'style.css'), join(dist, 'style.css'));
  cpSync(join(root, 'src', 'fonts'), join(dist, 'fonts'), { recursive: true });
  cpSync(join(root, 'src', 'site'), join(dist, 'site'), { recursive: true });
  cpSync(join(root, 'src', 'favicon.png'), join(dist, 'favicon.png'));
  // The full app icon, for link previews and the home-screen icon.
  cpSync(join(root, 'src', 'apple-touch-icon.png'), join(dist, 'apple-touch-icon.png'));

  const urls = [];
  for (const lang of langs) {
    for (const slug of slugs) {
      writeFileSync(join(dist, pathOf(lang, slug)), slug === 'home' ? renderHome(config, lang) : renderPage(config, lang, slug));
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
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found</title><meta name="robots" content="noindex"><link rel="stylesheet" href="/style.css"></head><body><main><div class="wrap"><h1>Page not found</h1><p><a href="/">BuddyWorkout</a></p></div></main></body></html>\n`,
  );

  // Share link fallback, and the files that let the app open https://<site>/s links (universal links, app links).
  writeFileSync(join(dist, 's.html'), renderSharePage(config));
  writeFileSync(join(dist, '_redirects'), '/s/* /s 200\n/no / 301\n/no/ / 301\n');
  mkdirSync(join(dist, '.well-known'));
  writeFileSync(
    join(dist, '.well-known', 'apple-app-site-association'),
    `${JSON.stringify(appleAppSiteAssociation(config.app), null, 2)}\n`,
  );
  // Without a fingerprint the file would verify nothing, so it is left out until one is configured.
  if (config.app.androidCertFingerprints.length) {
    writeFileSync(join(dist, '.well-known', 'assetlinks.json'), `${JSON.stringify(assetLinks(config.app), null, 2)}\n`);
  }
  writeFileSync(
    join(dist, '_headers'),
    '/.well-known/apple-app-site-association\n  Content-Type: application/json\n',
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
