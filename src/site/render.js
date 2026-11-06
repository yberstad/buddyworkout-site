// Markup shared by build.mjs (prerender) and the browser. Pure string functions.
import { CH, T } from './copy.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/** The logo: two overlapping balls. d = diameter of one ball in px. */
export function ballsHtml(d) {
  const gap = Math.max(1.5, d * 0.045);
  const m = `radial-gradient(circle ${d / 2 + gap}px at ${-d * 0.72 + d / 2}px ${d / 2}px, transparent 99%, #000 100%)`;
  return `<span class="balls" aria-hidden="true" style="width:${d * 1.72}px;height:${d}px"><span class="ball r" style="width:${d}px;height:${d}px;left:${d * 0.72}px;top:0;-webkit-mask-image:${m};mask-image:${m}"></span><span class="ball g" style="width:${d}px;height:${d}px;left:0;top:0"></span></span>`;
}

/** Header: brand, theme switch, language links (NO/EN are the two prerendered pages), download button. */
export function navHtml(lang, { noHref, enHref }) {
  const t = T[lang];
  const on = (l) => (l === lang ? ' class="on" aria-current="true"' : '');
  return `<header class="nav"><a class="brand" href="#top" aria-label="BuddyWorkout">${ballsHtml(18)}<span>BuddyWorkout</span></a>
<nav class="seg" aria-label="${t['a11y.lang']}"><a href="${noHref}" lang="nb" hreflang="nb"${on('no')}>NO</a><a href="${enHref}" lang="en" hreflang="en"${on('en')}>EN</a></nav>
<a class="get" href="#download">${t.get}</a></header>`;
}

/**
 * Official store badges, unmodified (black App Store badge; the site is light only).
 * Google Play: its PNG has built-in clear space; per-language height makes the badge body 48 px tall.
 * A badge is left out while its store URL is empty.
 */
export function storesHtml(lang, links, base) {
  const t = T[lang], l = lang === 'no' ? 'nb' : 'en';
  const out = [];
  if (links.ios) {
    out.push(`<a class="sb sb-apple" href="${esc(links.ios)}"><img src="${base}appstore-${l}-black.svg" alt="${t['badge.apple']}" width="143.6" height="48"></a>`);
  }
  if (links.android) {
    out.push(`<a class="sb sb-google sb-google-${l}" href="${esc(links.android)}"><img src="${base}googleplay-${l}.png" alt="${t['badge.google']}" width="646" height="250"></a>`);
  }
  return out.length ? `<div class="stores">${out.join('')}</div>` : '';
}

export function chapterHtml(c, lang) {
  const t = T[lang];
  return `<section class="chap" data-k="${c.k}"><div class="mOrb"></div><div class="copy fadeup"><p class="kick" data-c="${c.c}" style="color:${c.c}">${t[c.k + '.kick']}</p><h2 class="h2">${t[c.k + '.title']}</h2><p class="lead">${t[c.k + '.body']}</p></div><div class="ph fadeup"></div></section>`;
}

export function endHtml(lang, storesHtmlStr) {
  const t = T[lang];
  return `<section class="end" id="download"><div class="fadeup" id="endBalls">${ballsHtml(64)}</div><h2 class="h1 fadeup">${t['cta.title']}</h2><p class="lead fadeup">${t['cta.body']}</p>${storesHtmlStr ? `<div class="fadeup">${storesHtmlStr}</div>` : ''}</section>`;
}

export function footHtml(lang, { privacyHref, supportHref }) {
  const t = T[lang];
  return `<footer class="foot"><span>© 2026 BuddyWorkout</span><nav class="fl" aria-label="Info"><a href="${privacyHref}">${t['foot.privacy']}</a><a href="${supportHref}">${t['foot.support']}</a></nav><span>${t.foot}</span><p class="tm">${t['tm.apple']}<br>${t['tm.google']}</p></footer>`;
}

export { CH };
