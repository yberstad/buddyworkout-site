/* BuddyWorkout site: phone, logo balls, orb (ring + next-phase peek), nav wiring. Copy lives in copy.js; markup is prerendered by build.mjs. */
import { G, R, O, A, T, CH } from './copy.js';
import { ballsHtml } from './render.js';

const IMG = new URL('./img/', import.meta.url).href;
function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
const BW = {
  G, R, O, A, CH,
  TRAIN: [2, 4, 6, 9, 11, 12, 16, 18, 20, 23, 25, 27, 30],
  INK: { [G]: '#047857', [R]: '#B91C1C', [O]: '#C2410C', [A]: '#92400E' },
  // Language is fixed by the URL (/ = English, /no/ = Norwegian); the NO/EN switch is a link between the two pages.
  lang: document.documentElement.lang === 'nb' ? 'no' : 'en',
  theme: store('bw-site-theme') || 'light',
  setTheme(t) { BW.theme = t; store('bw-site-theme', t); document.documentElement.dataset.theme = t; document.querySelectorAll('button[data-th]').forEach(b => b.classList.toggle('on', b.dataset.th === t)); },
  t(k) { return T[BW.lang][k] ?? k; },
  o() { return T[BW.lang].o; },
  clamp: (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)),
  lerp: (a, b, t) => a + (b - a) * t,
  ease: t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  range(p, a, b) { return BW.clamp((p - a) / (b - a)); },
  // Height of the small viewport (100svh). Constant while the iOS address bar collapses, so sticky stage and orb layout do not jump.
  vh() { const e = document.getElementById('svh'); return (e && e.offsetHeight) || innerHeight; },
  prog(el) { const r = el.getBoundingClientRect(); return BW.clamp(-r.top / (r.height - BW.vh())); },
  balls(d) { const t = document.createElement('template'); t.innerHTML = ballsHtml(d); return t.content.firstElementChild; },
  LINKS: { ios: document.body.dataset.ios || '', android: document.body.dataset.android || '' },
  /** Wire the prerendered nav: theme switch, and on a phone the "Last ned" button goes to that device's store. */
  initNav() {
    document.querySelectorAll('button[data-th]').forEach(b => b.onclick = () => BW.setTheme(b.dataset.th));
    BW.setTheme(BW.theme);
    const get = document.querySelector('.nav .get'), ua = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const store = ios ? BW.LINKS.ios : /Android/.test(ua) ? BW.LINKS.android : '';
    if (get && store) get.href = store;
  },
  phone(imgs, w) {
    const p = document.createElement('div'); p.className = 'phone'; if (w) p.style.setProperty('--w', w + 'px');
    p.innerHTML = `<div class="scr">${imgs.map((s, i) => `<picture><source type="image/webp" srcset="${IMG}${s.replace('.png', '.webp')}"><img src="${IMG}${s}" alt="" width="900" height="1951" class="${i ? '' : 'on'}" loading="${i ? 'lazy' : 'eager'}" decoding="async"></picture>`).join('')}</div>`;
    p.show = i => p.querySelectorAll('img').forEach((im, j) => im.classList.toggle('on', j === i));
    return p;
  },
  reveal() {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('in')), { threshold: .2 });
    document.querySelectorAll('.fadeup').forEach(el => io.observe(el));
  },
  /* Orb: green ball → timer ring; red ball → "next" peek. m: 0 = logo, 1 = timer. */
  orb() {
    const el = document.createElement('div'); el.className = 'orb';
    el.innerHTML = `<div class="peek"><div class="pale"></div><div class="ball r"></div><span class="pl"></span><span class="pv"></span><span class="ps"></span></div>
      <div class="main"><div class="ripple"></div><div class="ripple b"></div><div class="ripple c"></div><div class="face"></div>
      <svg viewBox="0 0 200 200"><circle class="trk" cx="100" cy="100" r="92"/><circle class="arc" cx="100" cy="100" r="92" stroke-dasharray="578.05" stroke-dashoffset="0"/><circle class="knob" cx="192" cy="100" r="7"/></svg>
      <div class="ball g"></div><div class="txt"><span class="ol"></span><span class="ov"></span><span class="os"></span></div>
      <div class="heart"><div class="hb"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/><ellipse cx="7.4" cy="7.2" rx="2.4" ry="1.3" transform="rotate(-32 7.4 7.2)" fill="#fff" opacity=".28"/></svg><div class="hv"><b></b><span>bpm</span></div></div>
      <div class="zones">${[1,2,3,4,5].map(z => `<i data-z="${z}">Z${z}</i>`).join('')}</div></div>
      <div class="cal"><div class="cm"></div><div class="cg">${'<i class="w"></i>'.repeat(7)}${'<i></i>'.repeat(6)}${Array.from({ length: 30 }, (_, i) => `<i class="d" data-d="${i + 1}">${i + 1}</i>`).join('')}</div></div></div>`;
    const q = s => el.querySelector(s);
    const main = q('.main'), peek = q('.peek'), gb = q('.main .ball'), rb = q('.peek .ball'), pale = q('.peek .pale'), face = q('.face'), svg = q('svg'), txt = q('.txt'), arc = q('.arc'), knob = q('.knob');
    let st = {};
    const api = {
      el,
      layout({ x, y, d, s, m, hidePeek = 0 }) {
        const e = BW.ease(BW.clamp(m));
        const gd = BW.lerp(d, s, e), rd = BW.lerp(d, s * .56, e);
        const gx = BW.lerp(-.36 * d, 0, e), rx = BW.lerp(.36 * d, s * .64, e);
        el.style.transform = `translate(${x}px,${y}px)`;
        Object.assign(main.style, { width: gd + 'px', height: gd + 'px', left: gx - gd / 2 + 'px', top: -gd / 2 + 'px', fontSize: gd + 'px' });
        Object.assign(peek.style, { width: rd + 'px', height: rd + 'px', left: rx - rd / 2 + 'px', top: -rd / 2 + BW.lerp(0, s * .06, e) + 'px', fontSize: rd + 'px', opacity: 1 - hidePeek });
        const hole = BW.clamp((e - .05) / .8) * 92;
        gb.style.webkitMaskImage = gb.style.maskImage = `radial-gradient(circle closest-side, transparent ${hole}%, #000 ${hole + .6}%)`;
        gb.style.opacity = BW.clamp(1 - (e - .82) / .18);
        gb.style.boxShadow = 'none';
        const gap = Math.max(1.5, gd * .045) * (1 - e), cxr = gx - (rx - rd / 2), cyr = rd / 2 - BW.lerp(0, s * .06, e);
        const rm = e > .98 ? 'none' : `radial-gradient(circle ${gd / 2 + gap}px at ${cxr}px ${cyr}px, transparent 99%, #000 100%)`;
        rb.style.webkitMaskImage = rb.style.maskImage = rm;
        rb.style.opacity = 1 - e; pale.style.opacity = e;
        face.style.opacity = svg.style.opacity = BW.clamp((e - .55) / .35);
        txt.style.opacity = BW.clamp((e - .8) / .2);
        peek.querySelectorAll('span').forEach(s => s.style.opacity = BW.clamp((e - .8) / .2));
      },
      state(o) {
        const set = (sel, v) => { const n = q(sel); if (n.textContent !== (v ?? '')) n.textContent = v ?? ''; };
        set('.ol', o.l); set('.ov', o.v); set('.os', o.s); set('.pl', o.pl); set('.pv', o.pv); set('.ps', o.ps);
        el.style.setProperty('--c', o.c); el.style.setProperty('--pc', o.pc || o.c); el.style.setProperty('--ck', BW.INK[o.c] || '#1D1D1F');
        el.classList.toggle('pulse', !!o.pulse);
        el.classList.toggle('hrMode', !!o.heart);
        el.classList.toggle('calMode', !!o.cal);
        if (o.cal) {
          const oo = BW.o(), cm = q('.cm'); if (cm.textContent !== oo.month) cm.textContent = oo.month;
          el.querySelectorAll('.cg .w').forEach((w, i) => { w.textContent = oo.wd[i]; });
          el.querySelectorAll('.cg .d').forEach(d => { const n = +d.dataset.d; d.classList.toggle('done', BW.TRAIN.includes(n) && n <= o.upto); d.classList.toggle('cur', n === o.upto); d.classList.toggle('fut', n > o.upto); });
        }
        if (o.heart) {
          el.style.setProperty('--hz', `var(--z${o.zone})`); el.style.setProperty('--beat', (60 / o.v).toFixed(3) + 's');
          const hv = q('.hv b'); if (hv.textContent !== o.v) hv.textContent = o.v;
          el.querySelectorAll('.zones i').forEach(i => i.classList.toggle('on', +i.dataset.z === o.zone));
        }
        const a = BW.clamp(o.arc ?? 1), off = 578.05 * (1 - a);
        arc.setAttribute('stroke-dashoffset', off);
        const ang = a * Math.PI * 2; knob.setAttribute('cx', 100 + 92 * Math.cos(ang)); knob.setAttribute('cy', 100 + 92 * Math.sin(ang));
        knob.style.opacity = a > .01 && a < .999 ? 1 : 0;
        peek.dataset.has = o.pv ? 1 : 0; st = o;
      },
    };
    return api;
  },
  /* Orb state per chapter. f = progress inside the chapter (0..1) */
  orbState(k, f = 0) {
    const o = BW.o();
    const mmss = s => `00:${String(Math.max(0, Math.round(s))).padStart(2, '0')}`;
    switch (k) {
      case 'work': return { l: o.work, v: mmss(45 * (1 - f)), s: '', c: G, pc: R, pl: o.next, pv: o.restW, ps: '15 s', arc: 1 - f };
      case 'rest': return { l: o.rest, v: mmss(15 * (1 - f)), s: '', c: R, pc: G, pl: o.next, pv: o.workW, ps: '45 s', arc: 1 - f };
      case 'timer': return f < .62 ? BW.orbState('work', f / .62) : BW.orbState('rest', (f - .62) / .38);
      case 'buddy': return f < .5 ? { l: 'CHARLES', v: mmss(10 * (1 - f * 2)), c: G, pc: R, pl: o.next, pv: 'Øyvind', ps: '10 s', arc: 1 - f * 2 } : { l: 'ØYVIND', v: mmss(10 * (1 - (f - .5) * 2)), c: R, pc: G, pl: o.next, pv: 'Charles', ps: '10 s', arc: 1 - (f - .5) * 2 };
      case 'hr': { const b = Math.round(92 + 88 * BW.clamp(f * 1.15)); const z = b < 114 ? 1 : b < 133 ? 2 : b < 152 ? 3 : b < 171 ? 4 : 5; return { heart: true, v: String(b), zone: z, c: O }; }
      case 'audio': return { l: o.count, v: String(3 - Math.min(2, Math.floor(f * 3))), s: '', c: A, pulse: true, arc: 1 - f };
      case 'hist': return { cal: true, upto: Math.min(30, 1 + Math.floor(BW.clamp(f * 1.15) * 29)), c: G };
      case 'ex': return { l: o.run, v: '45×15', s: '× 30', c: R, arc: 1 };
    }
  },
};
document.documentElement.dataset.theme = BW.theme;
let __st; addEventListener('scroll', () => { document.querySelectorAll('.orb').forEach(o => o.classList.add('scrolling')); clearTimeout(__st); __st = setTimeout(() => document.querySelectorAll('.orb').forEach(o => o.classList.remove('scrolling')), 180); }, { passive: true });
window.BW = BW;
