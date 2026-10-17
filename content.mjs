// All page text, per language. {owner} fields are filled in from site.config.json by build.mjs.
// Keep both languages in step: every page has the same slugs and sections.

export const ui = {
  en: {
    htmlLang: 'en',
    skip: 'Skip to content',
    nav: { home: 'Home', support: 'Support', privacy: 'Privacy policy' },
    navLabel: 'Main',
    switchTo: 'Norsk',
    switchLabel: 'Norsk bokmål',
    footerOwner: 'BuddyWorkout is made by',
    footerUpdated: 'Last updated',
    footerNoTracking: 'This site uses no cookies, analytics or third-party scripts.',
  },
  nb: {
    htmlLang: 'nb',
    skip: 'Hopp til innhold',
    nav: { home: 'Hjem', support: 'Support', privacy: 'Personvern' },
    navLabel: 'Hovedmeny',
    switchTo: 'English',
    switchLabel: 'English',
    footerOwner: 'BuddyWorkout er laget av',
    footerUpdated: 'Sist oppdatert',
    footerNoTracking: 'Dette nettstedet bruker ingen cookies, analyse eller tredjepartsskript.',
  },
};

export const pages = {
  en: {
    home: {
      title: 'BuddyWorkout: interval timer for training together',
      description:
        'BuddyWorkout is an interval timer for exercise. Build exercises and sessions, run them with clear Ready, Work and Rest phases, and share them with a friend by link. No account, no tracking.',
      body: ({ owner, links }) => `
<section class="hero">
  <h1>Interval timer for training together</h1>
  <p class="lead">Build your own exercises and sessions, run them with clear Ready, Work and Rest phases, and send a session to a friend as a link. Works fully offline. No account, no tracking.</p>
  <div class="phases" aria-hidden="true"><span class="ready"></span><span class="work"></span><span class="rest"></span></div>
${links}
</section>
<div class="cards">
  <div class="card"><h3>A timer you can trust</h3><p>Time is kept by the clock, so it stays correct when the screen locks or the app is in the background. Sound and haptic cues mark each phase.</p></div>
  <div class="card"><h3>Share by link</h3><p>Send an exercise or a whole session by SMS, e-mail or any messaging app. The friend opens the link in the app and chooses what to keep.</p></div>
  <div class="card"><h3>Private by design</h3><p>Exercises, history and contacts stay on your phone. There is no server and no account. <a href="privacy.html">Read the privacy policy</a>.</p></div>
</div>
<p>Questions or feedback? See <a href="support.html">Support</a> or write to <a href="mailto:${owner.email}">${owner.email}</a>.</p>`,
    },
    support: {
      title: 'Support: BuddyWorkout',
      description: 'Get help with BuddyWorkout: contact details and answers to common questions about sharing, language and restoring exercises.',
      body: ({ owner }) => `
<h1>Support</h1>
<p class="lead">Need help with BuddyWorkout? Write to <a href="mailto:${owner.email}">${owner.email}</a> and include your phone model and the app version. You normally get a reply within a few working days.</p>
<h2>Common questions</h2>
<details><summary>How does sharing work?</summary>
<p>Open an exercise or a session and choose Share. The app builds a link on your phone and opens the share sheet, so you choose how to send it: SMS, e-mail or a messaging app. The link contains the exercise or session you chose, nothing else. Your friend taps the link, sees the content, and decides whether to save it. Nothing is saved automatically.</p></details>
<details><summary>My friend does not have the app. Can they open the link?</summary>
<p>Not yet. The link opens in the app, so your friend needs BuddyWorkout installed first. Some Android messaging apps do not make the link tappable: use Copy link in the share sheet and paste it into the message.</p></details>
<details><summary>The link is too long to send by SMS.</summary>
<p>Long sessions make long links. The app warns you and trims comments first. If it is still too long, send it by e-mail or copy and paste it into a messaging app.</p></details>
<details><summary>How do I change the language or the colours?</summary>
<p>The app follows your phone: English or Norwegian text, and light or dark mode, depending on your phone's settings. Change them in your phone's system settings.</p></details>
<details><summary>I deleted an exercise. Can I get it back?</summary>
<p>Exercises you make are stored only on your phone, and there is no backup or server copy, so a deleted exercise cannot be restored by us. If you or a friend shared it as a link earlier, open that link again to save it. Reinstalling the app also brings back the sample exercises that come with it.</p></details>
<details><summary>Do I need to create an account?</summary>
<p>No. There are no accounts. Everything is stored on your phone.</p></details>
<details><summary>How do I delete all my data?</summary>
<p>Uninstall the app. Everything it stored goes with it. See the <a href="privacy.html">privacy policy</a> for details.</p></details>`,
    },
    privacy: {
      title: 'Privacy policy: BuddyWorkout',
      description: 'BuddyWorkout has no accounts, no analytics and no server. Your exercises, history and contacts stay on your phone. Read the full privacy policy.',
      body: ({ owner, updated }) => `
<h1>Privacy policy</h1>
<p class="lead">In short: BuddyWorkout collects no personal data. Everything you create stays on your phone.</p>
<p class="muted">Last updated: ${updated}</p>

<h2>Who is responsible</h2>
<dl class="facts">
  <dt>Company</dt><dd>${owner.name}</dd>
  <dt>Org. no.</dt><dd>${owner.orgNumber}</dd>
  <dt>Address</dt><dd>${owner.address}</dd>
  <dt>E-mail</dt><dd><a href="mailto:${owner.email}">${owner.email}</a></dd>
</dl>

<h2>What the app stores</h2>
<p>The app stores the following on your phone only, in a local database: your exercises and sessions, your workout history, the contacts you add (names you type yourself, used to remember who you shared with), and your settings (language, appearance, sound and haptics). We cannot see this data. It is not sent to us or to anyone else.</p>
<p>The app does not ask for access to your phone's contact list, location, camera, microphone or photos.</p>

<h2>What the app does not do</h2>
<ul>
  <li>No accounts or sign-in.</li>
  <li>No analytics, crash reporting, advertising or tracking.</li>
  <li>No server of our own. Nothing you create is uploaded.</li>
  <li>Nothing is sold or shared with third parties.</li>
</ul>

<h2>Sharing with a friend</h2>
<p>When you share an exercise or session, the app builds a link on your phone. The link contains the data you chose to share (for example exercise names, times and comments). You send the link yourself through your phone's share sheet, using the SMS, e-mail or messaging app you pick. That app and its provider handle the message under their own privacy policies. We never receive the link. A friend who opens it sees the content and decides whether to save it; nothing is saved automatically. Do not put information in comments that you do not want the recipient, or the messaging service, to see.</p>

<h2>Updates</h2>
<p>The only network connection the app makes by itself is a check for app updates, through Expo's update service (expo-updates). Like any internet request, this reveals your IP address to the update service, together with technical details needed to pick the right update: the app version, the platform (iOS or Android) and the update channel. No personal data and no content from the app is sent. The app's own code does not make other network requests, so the app works fully offline.</p>

<h2>App stores</h2>
<p>You download the app from Apple's App Store or Google Play. Apple and Google process information about your download and device under their own policies. We do not receive personal data from them.</p>

<h2>Children</h2>
<p>The app is a general fitness timer and is not directed at children. It collects no data from anyone, including children.</p>

<h2>Your rights and deleting your data</h2>
<p>Because we hold no personal data about you, there is nothing for us to access, correct or delete. To remove everything the app stored, uninstall it. You have the right to complain to the Norwegian Data Protection Authority (Datatilsynet) at <a href="https://www.datatilsynet.no">datatilsynet.no</a>.</p>

<h2>Changes</h2>
<p>If the app's behaviour changes in a way that affects this policy, we update this page and the date above before the change is released.</p>

<h2>Contact</h2>
<p>Questions about privacy: <a href="mailto:${owner.email}">${owner.email}</a>.</p>`,
    },
  },
  nb: {
    home: {
      title: 'BuddyWorkout: intervalltimer for å trene sammen',
      description:
        'BuddyWorkout er en intervalltimer for trening. Lag øvelser og økter, kjør dem med tydelige faser for Klar, Jobb og Hvile, og del dem med en venn via lenke. Ingen konto, ingen sporing.',
      body: ({ owner, links }) => `
<section class="hero">
  <h1>Intervalltimer for å trene sammen</h1>
  <p class="lead">Lag dine egne øvelser og økter, kjør dem med tydelige faser for Klar, Jobb og Hvile, og send en økt til en venn som lenke. Fungerer helt uten nett. Ingen konto, ingen sporing.</p>
  <div class="phases" aria-hidden="true"><span class="ready"></span><span class="work"></span><span class="rest"></span></div>
${links}
</section>
<div class="cards">
  <div class="card"><h3>En timer du kan stole på</h3><p>Tiden regnes ut fra klokka, så den holder riktig selv om skjermen låses eller appen er i bakgrunnen. Lyd og haptikk markerer hver fase.</p></div>
  <div class="card"><h3>Del med lenke</h3><p>Send en øvelse eller en hel økt på SMS, e-post eller i en meldingsapp. Vennen åpner lenken i appen og velger hva som skal lagres.</p></div>
  <div class="card"><h3>Personvern fra grunnen</h3><p>Øvelser, historikk og kontakter blir på telefonen din. Ingen server og ingen konto. <a href="personvern.html">Les personvernerklæringen</a>.</p></div>
</div>
<p>Spørsmål eller tilbakemelding? Se <a href="support.html">Support</a> eller skriv til <a href="mailto:${owner.email}">${owner.email}</a>.</p>`,
    },
    support: {
      title: 'Support: BuddyWorkout',
      description: 'Få hjelp med BuddyWorkout: kontaktinformasjon og svar på vanlige spørsmål om deling, språk og gjenoppretting av øvelser.',
      body: ({ owner }) => `
<h1>Support</h1>
<p class="lead">Trenger du hjelp med BuddyWorkout? Skriv til <a href="mailto:${owner.email}">${owner.email}</a> og ta med telefonmodell og appversjon. Du får vanligvis svar innen noen få virkedager.</p>
<h2>Vanlige spørsmål</h2>
<details><summary>Hvordan fungerer deling?</summary>
<p>Åpne en øvelse eller en økt og velg Del. Appen lager en lenke på telefonen din og åpner delingsmenyen, så du velger selv hvordan den sendes: SMS, e-post eller en meldingsapp. Lenken inneholder øvelsen eller økten du valgte, ikke noe annet. Vennen din trykker på lenken, ser innholdet og bestemmer om det skal lagres. Ingenting lagres automatisk.</p></details>
<details><summary>Vennen min har ikke appen. Kan de åpne lenken?</summary>
<p>Ikke ennå. Lenken åpnes i appen, så vennen din må ha BuddyWorkout installert først. Noen meldingsapper på Android gjør ikke lenken trykkbar: bruk Kopier lenke i delingsmenyen og lim den inn i meldingen.</p></details>
<details><summary>Lenken er for lang til SMS.</summary>
<p>Lange økter gir lange lenker. Appen advarer deg og fjerner kommentarer først. Hvis den fortsatt er for lang, send den på e-post eller kopier og lim den inn i en meldingsapp.</p></details>
<details><summary>Hvordan bytter jeg språk eller farger?</summary>
<p>Appen følger telefonen din: norsk eller engelsk tekst, og lys eller mørk modus, etter telefonens innstillinger. Endre dem i systeminnstillingene på telefonen.</p></details>
<details><summary>Jeg slettet en øvelse. Kan jeg få den tilbake?</summary>
<p>Øvelser du lager lagres bare på telefonen din, uten sikkerhetskopi eller serverkopi, så vi kan ikke gjenopprette en slettet øvelse. Hvis du eller en venn delte den som lenke tidligere, åpne lenken igjen for å lagre den. Ved ny installasjon kommer også eksempeløvelsene som følger med appen tilbake.</p></details>
<details><summary>Må jeg opprette en konto?</summary>
<p>Nei. Det finnes ingen kontoer. Alt lagres på telefonen din.</p></details>
<details><summary>Hvordan sletter jeg alle dataene mine?</summary>
<p>Avinstaller appen. Alt den har lagret forsvinner sammen med den. Se <a href="personvern.html">personvernerklæringen</a> for detaljer.</p></details>`,
    },
    privacy: {
      title: 'Personvernerklæring: BuddyWorkout',
      description: 'BuddyWorkout har ingen kontoer, ingen analyse og ingen server. Øvelser, historikk og kontakter blir på telefonen din. Les hele personvernerklæringen.',
      body: ({ owner, updated }) => `
<h1>Personvernerklæring</h1>
<p class="lead">Kort fortalt: BuddyWorkout samler ikke inn personopplysninger. Alt du lager blir på telefonen din.</p>
<p class="muted">Sist oppdatert: ${updated}</p>

<h2>Behandlingsansvarlig</h2>
<dl class="facts">
  <dt>Selskap</dt><dd>${owner.name}</dd>
  <dt>Org.nr.</dt><dd>${owner.orgNumber}</dd>
  <dt>Adresse</dt><dd>${owner.address}</dd>
  <dt>E-post</dt><dd><a href="mailto:${owner.email}">${owner.email}</a></dd>
</dl>

<h2>Hva appen lagrer</h2>
<p>Appen lagrer følgende bare på telefonen din, i en lokal database: øvelsene og øktene dine, treningshistorikken, kontaktene du legger til (navn du skriver inn selv, brukt for å huske hvem du har delt med) og innstillingene dine (språk, utseende, lyd og haptikk). Vi kan ikke se disse dataene. De sendes ikke til oss eller til noen andre.</p>
<p>Appen ber ikke om tilgang til telefonens kontaktliste, posisjon, kamera, mikrofon eller bilder.</p>

<h2>Hva appen ikke gjør</h2>
<ul>
  <li>Ingen kontoer eller innlogging.</li>
  <li>Ingen analyse, feilrapportering, reklame eller sporing.</li>
  <li>Ingen egen server. Ingenting du lager lastes opp.</li>
  <li>Ingenting selges eller deles med tredjeparter.</li>
</ul>

<h2>Deling med en venn</h2>
<p>Når du deler en øvelse eller økt, lager appen en lenke på telefonen din. Lenken inneholder dataene du valgte å dele (for eksempel øvelsesnavn, tider og kommentarer). Du sender lenken selv via telefonens delingsmeny, med SMS-, e-post- eller meldingsappen du velger. Den appen og leverandøren av den behandler meldingen etter sine egne personvernregler. Vi mottar aldri lenken. En venn som åpner den, ser innholdet og bestemmer om det skal lagres. Ingenting lagres automatisk. Ikke skriv opplysninger i kommentarer som du ikke vil at mottakeren eller meldingstjenesten skal se.</p>

<h2>Oppdateringer</h2>
<p>Den eneste nettverksforbindelsen appen oppretter selv, er en sjekk etter appoppdateringer via Expos oppdateringstjeneste (expo-updates). Som alle internettforespørsler viser dette IP-adressen din til oppdateringstjenesten, sammen med tekniske opplysninger som trengs for å velge riktig oppdatering: appversjon, plattform (iOS eller Android) og oppdateringskanal. Ingen personopplysninger og intet innhold fra appen sendes. Appens egen kode gjør ingen andre nettverksforespørsler, så appen fungerer helt uten nett.</p>

<h2>Appbutikkene</h2>
<p>Du laster ned appen fra Apples App Store eller Google Play. Apple og Google behandler opplysninger om nedlastingen og enheten din etter sine egne regler. Vi mottar ingen personopplysninger fra dem.</p>

<h2>Barn</h2>
<p>Appen er en generell treningstimer og er ikke rettet mot barn. Den samler ikke inn data fra noen, heller ikke fra barn.</p>

<h2>Dine rettigheter og sletting av data</h2>
<p>Fordi vi ikke har noen personopplysninger om deg, finnes det ingenting vi kan gi innsyn i, rette eller slette. For å fjerne alt appen har lagret, avinstaller den. Du har rett til å klage til Datatilsynet på <a href="https://www.datatilsynet.no">datatilsynet.no</a>.</p>

<h2>Endringer</h2>
<p>Hvis appens oppførsel endres på en måte som påvirker denne erklæringen, oppdaterer vi denne siden og datoen over før endringen slippes.</p>

<h2>Kontakt</h2>
<p>Spørsmål om personvern: <a href="mailto:${owner.email}">${owner.email}</a>.</p>`,
    },
  },
};

// File name of each page per language. English files live in the site root, Norwegian in /no/.
export const files = {
  en: { home: 'index.html', support: 'support.html', privacy: 'privacy.html' },
  nb: { home: 'index.html', support: 'support.html', privacy: 'personvern.html' },
};

export const storeText = {
  en: { appStore: 'Download on the App Store', googlePlay: 'Get it on Google Play' },
  nb: { appStore: 'Last ned i App Store', googlePlay: 'Hent på Google Play' },
};
