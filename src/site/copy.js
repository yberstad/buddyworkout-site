// All copy for the home page, in Norwegian (no) and English (en). Used by build.mjs (prerender) and the browser (orb text).
export const G = '#34D399', R = '#F87171', O = '#FB923C', A = '#FBBF24';
export const T = {
  no: {
    get: 'Last ned', pre: 'Last ned på',
    'hero.kick': 'Intervalltimer for løping og klatring',
    'hero.title': 'Intervaller, sammen.',
    'hero.sub': 'Bytt på med en treningskompis, følg pulsen, og hør når neste drag starter.',
    'timer.kick': 'Timer', 'timer.title': 'Du ser alltid hva som kommer.', 'timer.body': 'Neste fase ligger klar bak klokken, så du vet hva som venter før det skjer. Dra i den lille sirkelen på ringen for å spole frem eller tilbake.',
    'buddy.kick': 'Buddytrening', 'buddy.title': 'To på én timer.', 'buddy.body': 'Slå på buddytrening, skriv inn to navn og velg byttetid. Timeren viser hvem som er i gang, og holder tellingen for dere begge.',
    'hr.kick': 'Puls', 'hr.title': 'Pulsen, sone for sone.', 'hr.body': 'Koble til et pulsbelte og se pulsen live mens du løper. Sett en målsone, og se tid i hver sone etter økten.',
    'audio.kick': 'Lyd', 'audio.title': 'Hør hvor du er.', 'audio.body': 'Bip før hvert bytte, nedtelling de siste sekundene, og musikken dempes mens timeren piper. Du trenger ikke se på skjermen.',
    'hist.kick': 'Historikk', 'hist.title': 'Hver økt, lagret.', 'hist.body': 'Kalenderen viser dagene du har trent. Trykk på en dag for tid, puls og kommentar.',
    'ex.kick': 'Øvelser', 'ex.title': 'Løping, klatring, tøying.', 'ex.body': 'Lag egne øvelser eller importer ferdige. Konstant, pyramide eller egendefinert, sortert etter kategori.',
    'promise.title': 'Ingen konto. Ingen sky.', 'promise.body': 'Øvelser, økter og puls lagres bare på telefonen din.',
    'cta.title': 'Klar for neste drag?', 'cta.body': 'BuddyWorkout for iPhone og Android.',
    foot: 'Laget i Norge', scroll: 'Scroll', light: 'Lys', dark: 'Mørk',
    o: { work: 'ARBEID', rest: 'HVILE', next: 'NESTE', workW: 'Arbeid', restW: 'Hvile', hr: 'PULS', zone: 'bpm · målsone 4', count: 'NEDTELLING', wed: 'ONSDAG', date: '4. november', month: 'November 2026', wd: 'MTOTFLS', run: 'LØPING' },
  },
  en: {
    get: 'Download', pre: 'Download on',
    'hero.kick': 'Interval timer for running and climbing',
    'hero.title': 'Intervals, together.',
    'hero.sub': 'Take turns with a training buddy, follow your heart rate, and hear when the next rep starts.',
    'timer.kick': 'Timer', 'timer.title': 'Always see what’s next.', 'timer.body': 'The next phase waits behind the clock, so you know what’s coming before it does. Drag the small circle on the ring to skip forward or back.',
    'buddy.kick': 'Buddy training', 'buddy.title': 'Two people, one timer.', 'buddy.body': 'Turn on buddy training, add two names and set the changeover. The timer shows whose turn it is and keeps count for both of you.',
    'hr.kick': 'Heart rate', 'hr.title': 'Heart rate, zone by zone.', 'hr.body': 'Connect a heart rate strap and see your pulse live while you run. Set a target zone and see time in each zone after the workout.',
    'audio.kick': 'Audio', 'audio.title': 'Hear where you are.', 'audio.body': 'A beep before each change, a countdown in the last seconds, and your music dips while the timer beeps. No need to look at the screen.',
    'hist.kick': 'History', 'hist.title': 'Every workout, saved.', 'hist.body': 'The calendar shows the days you trained. Tap a day to see time, heart rate and your note.',
    'ex.kick': 'Exercises', 'ex.title': 'Running, climbing, stretching.', 'ex.body': 'Build your own exercises or import ready-made ones. Constant, pyramid or custom, sorted by category.',
    'promise.title': 'No account. No cloud.', 'promise.body': 'Exercises, workouts and heart rate are stored only on your phone.',
    'cta.title': 'Ready for the next rep?', 'cta.body': 'BuddyWorkout for iPhone and Android.',
    foot: 'Made in Norway', scroll: 'Scroll', light: 'Light', dark: 'Dark',
    o: { work: 'WORK', rest: 'REST', next: 'NEXT', workW: 'Work', restW: 'Rest', hr: 'HEART RATE', zone: 'bpm · target zone 4', count: 'COUNTDOWN', wed: 'WEDNESDAY', date: '4 November', month: 'November 2026', wd: 'MTWTFSS', run: 'RUNNING' },
  },
};
export const CH = [
  { k: 'timer', c: G, imgs: ['timer-work.png'] },
  { k: 'buddy', c: R, imgs: ['buddy-charles.png', 'buddy-rest.png', 'buddy-oyvind.png'] },
  { k: 'hr', c: O, imgs: ['session-hr.png'] },
  // { k: 'audio', c: A, imgs: ['settings-audio.png'] },  // Lyd: hidden until the audio feature is done
  { k: 'hist', c: G, imgs: ['history.png'] },
  { k: 'ex', c: R, imgs: ['exercises.png', 'new-exercise.png'] },
];

Object.assign(T.no, {
  'meta.title': 'BuddyWorkout: Intervalltimer for løping og klatring',
  'meta.desc': 'Intervalltimer for løping og klatring. Bytt på med en treningskompis, følg pulsen, og hør når neste drag starter.',
  'badge.apple': 'Last ned på App Store', 'badge.google': 'Få den på Google Play',
  'tm.apple': 'Apple og App Store er varemerker for Apple Inc.',
  'tm.google': 'Google Play og Google Play-logoen er varemerker for Google LLC.',
  'foot.privacy': 'Personvern', 'foot.support': 'Support',
  'a11y.theme': 'Tema', 'a11y.lang': 'Språk', 'a11y.skip': 'Hopp til innhold',
});
Object.assign(T.en, {
  'meta.title': 'BuddyWorkout: Interval timer for running and climbing',
  'meta.desc': 'Interval timer for running and climbing. Take turns with a training buddy, follow your heart rate, and hear when the next rep starts.',
  'badge.apple': 'Download on the App Store', 'badge.google': 'Get it on Google Play',
  'tm.apple': 'Apple and the App Store are trademarks of Apple Inc.',
  'tm.google': 'Google Play and the Google Play logo are trademarks of Google LLC.',
  'foot.privacy': 'Privacy policy', 'foot.support': 'Support',
  'a11y.theme': 'Theme', 'a11y.lang': 'Language', 'a11y.skip': 'Skip to content',
});
