# BuddyWorkout website

Static site (English at `/`, Norwegian at `/no/`) with Home, Support and Privacy policy.
No cookies, analytics, third-party scripts or external requests. Inter is self-hosted.

```sh
npm test                 # builds and checks pages, links, hreflang, no external requests
npm run build            # writes dist/
npm run build:production # same, but fails while any TODO_OWNER: placeholder remains
```

## Hosting

The site runs on Cloudflare Workers (static assets only, no Worker code) at <https://buddyworkout.com>.
Cloudflare Workers Builds is connected to this repo: every push to `main` runs `npm run build` and
`npx wrangler deploy` (settings in `wrangler.jsonc`). GitHub Actions (`.github/workflows/ci.yml`) runs the tests and
the production build on pull requests and on `main`.

Set up in the Cloudflare dashboard (2026-10-29):

- DNS for `buddyworkout.com` is on Cloudflare (nameservers set at the registrar, Uniweb). DNSSEC is off at the registrar.
- Worker `buddyworkout-site`, custom domains `buddyworkout.com` and `www.buddyworkout.com`; `workers.dev` and preview URLs off.
- Redirect rule "Redirect from WWW to root" (301), and "Always Use HTTPS" on.
- Keep Email Address Obfuscation, Bot Fight Mode and Web Analytics off: they inject scripts or can block the
  app-link checks.

The host serves `privacy.html` at `/privacy` and redirects the `.html` URL there (307), so links, canonical URLs and
the sitemap use URLs without `.html`.

## Config

Everything the owner may change is in `site.config.json`: `siteUrl`, owner details, "last updated" date, store links
and the app IDs for share links. Store badges stay hidden while `storeLinks` are empty. `SITE_URL=... npm run build`
overrides `siteUrl` for one build. All internal page links are relative.

When you change the text of the privacy policy, update `updated` in `site.config.json`.

## URLs for the stores

- Privacy policy (en): `https://buddyworkout.com/privacy`
- Privacy policy (nb): `https://buddyworkout.com/no/personvern`
- Support (en): `https://buddyworkout.com/support`
- Support (nb): `https://buddyworkout.com/no/support`

## Share links (universal links and app links)

Share links have the form `https://buddyworkout.com/s/…`. The build writes:

- `/.well-known/apple-app-site-association` for iOS, from `app.appleAppIds` (`<Team ID>.<bundle ID>`), matching `/s`
  and `/s/*`. `_headers` serves it as `application/json`. It must answer 200 without a redirect.
- `/.well-known/assetlinks.json` for Android, from `app.androidPackage` and `app.androidCertFingerprints`. It is left
  out while the fingerprint list is empty. Add the SHA-256 of the app signing key from Play Console, Test and release,
  App integrity, App signing (upper case, `AA:BB:…`); add the upload or debug key too if local builds should open links.
- `/s` (`s.html`), the page a share link shows on a device without the app; `_redirects` serves it for `/s/*` too.

Neither file does anything until the app declares the domain (`associatedDomains` on iOS, an `autoVerify` intent
filter on Android). Apple fetches the file through its CDN, so a change can take a while to reach devices.
