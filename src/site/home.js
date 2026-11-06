import './site-core.js';
const BW = window.BW;
const orb = BW.orb(); document.querySelector('.orbLayer').append(orb.el);
const intro = document.getElementById('intro'), heroTxt = document.querySelector('.heroTxt'), timerTxt = document.querySelector('.timerTxt');
const main = document.getElementById('chapters');
const chaps = [...main.querySelectorAll('.chap')].map(s => {
  const c = BW.CH.find(x => x.k === s.dataset.k), ph = s.querySelector('.ph');
  const imgs = c.k === 'buddy' ? [['buddy-charles.png', 'buddy-rest.png', 'buddy-oyvind.png'], ['buddy-setup.png']] : c.k === 'ex' ? [['exercises.png'], ['new-exercise.png']] : c.k === 'hr' ? [['session-hr.png'], ['timer-work.png']] : [c.imgs];
  const phones = imgs.map(a => { const p = BW.phone(a); ph.append(p); return p; });
  const mo = BW.orb(); s.querySelector('.mOrb').append(mo.el);
  return { s, c, phones, mo };
});
BW.reveal();
let L = {};
function layout() {
  const vw = innerWidth, vh = BW.vh(), mob = vw < 820;
  const pw = mob ? Math.min(vw * .42, 210) : Math.min(vw * .17, vh * .62 * 1179 / 2556, 300);
  chaps.forEach(o => o.phones.forEach((p, i) => p.style.setProperty('--w', (i ? pw * .86 : pw) + 'px')));
  L = { vw, vh, mob, d: Math.min(vw * .2, vh * .18, 150), s: Math.min(vw * .62, vh * .48, 440), dockS: mob ? 92 : Math.min(vw * .27, vh * .5, 380) };
  frame();
}
function frame() {
  const { vw, vh, mob, d, s, dockS } = L;
  const p = BW.prog(intro);
  const m = BW.range(p, .06, .36);
  heroTxt.style.opacity = 1 - BW.range(p, .02, .16);
  heroTxt.style.transform = `translateY(${-BW.range(p, .02, .16) * 40}px)`;
  const tIn = BW.range(p, .36, .46);
  timerTxt.style.opacity = tIn * (1 - BW.range(p, .9, 1));
  timerTxt.style.transform = `translateY(${(1 - tIn) * 24}px)`;
  const tf = BW.range(p, .4, .96);
  // dock: after intro, move orb into the left column
  const cr = main.getBoundingClientRect();
  const dk = BW.ease(BW.clamp((vh - cr.top) / (vh * .7)));
  const yHero = Math.max(80 + d / 2, heroTxt.offsetTop - d / 2 - 36);
  const x0 = vw / 2 - BW.lerp(0, s * .18, BW.ease(m)), y0 = BW.lerp(yHero, Math.max(70 + s / 2, Math.min(vh * .42, timerTxt.offsetTop - s / 2 - 28)), BW.ease(m));
  const x1 = mob ? x0 : vw * .21, y1 = mob ? y0 - vh * .3 : vh / 2;
  const endFade = BW.clamp((document.getElementById('download').getBoundingClientRect().top - vh * .3) / (vh * .4));
  orb.el.style.opacity = mob ? 1 - BW.clamp(dk * 1.6) : endFade;
  orb.layout({ x: BW.lerp(x0, x1, dk), y: BW.lerp(y0, y1, dk), d, s: mob ? s : BW.lerp(s, dockS, dk), m, hidePeek: 0 });
  if (mob) chaps.forEach(o => {
    const r = o.s.getBoundingClientRect(); if (r.bottom < -50 || r.top > vh + 50) return;
    const ms = 168, k2 = o.c.k, f2 = BW.clamp((vh * .75 - r.top) / (r.height * .8));
    o.mo.layout({ x: vw / 2 - 24 - ms * .2, y: 105, d: ms, s: ms, m: 1 });
    o.mo.state(BW.orbState(k2, f2));
    const pk = o.mo.el.querySelector('.peek'); pk.style.opacity = pk.dataset.has === '1' ? '' : 0;
    if (k2 === 'buddy') o.phones[0].show(Math.min(2, Math.floor(f2 * 3)));
  });
  let k = 'timer', f = tf;
  if (dk > .2 && !mob) {
    let best = null, bd = 1e9;
    chaps.forEach(o => { const r = o.s.getBoundingClientRect(); const dd = Math.abs(r.top + r.height / 2 - vh / 2); if (dd < bd) { bd = dd; best = { o, r }; } });
    k = best.o.c.k; f = BW.clamp((vh / 2 - best.r.top) / best.r.height);
    const ph0 = best.o.phones[0]; if (k === 'buddy') ph0.show(Math.min(2, Math.floor(f * 3)));
  }
  orb.state(BW.orbState(k, f));
  orb.el.querySelector('.peek').style.opacity = orb.el.querySelector('.peek').dataset.has === '1' || m < .9 ? '' : 0;
}
let lastW = 0, lastH = 0;
addEventListener('resize', () => { const h = BW.vh(); if (innerWidth !== lastW || h !== lastH) { lastW = innerWidth; lastH = h; layout(); } }); addEventListener('scroll', () => requestAnimationFrame(frame), { passive: true });
layout();
