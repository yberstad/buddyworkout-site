# BuddyWorkout website

Static site (English at `/`, Norwegian at `/no/`) with Home, Support and Privacy policy.
No cookies, analytics, third-party scripts or external requests. Inter is self-hosted.

```sh
npm test                 # builds and checks pages, links, hreflang, no external requests
npm run build            # writes dist/
npm run build:production # same, but fails while any TODO_OWNER: placeholder remains
```

Pushes to `main` deploy `dist/` to GitHub Pages (`.github/workflows/pages.yml`).

## Config

Everything the owner may change is in `site.config.json`: `siteUrl`, owner details, "last updated" date and the store links.
Store badges stay hidden while `storeLinks` are empty. `SITE_URL=... npm run build` overrides `siteUrl` for one build.
All internal links are relative, so the site works under any base path.

When you change the text of the privacy policy, update `updated` in `site.config.json`.

## URLs for the stores (default host)

- Privacy policy (en): `https://yberstad.github.io/buddyworkout-site/privacy.html`
- Privacy policy (nb): `https://yberstad.github.io/buddyworkout-site/no/personvern.html`
- Support: `https://yberstad.github.io/buddyworkout-site/support.html`

## Switching to a custom domain

1. Change `siteUrl` in `site.config.json` to the new address (no trailing slash).
2. Set the custom domain under Settings, Pages in this repo.
3. At the DNS provider: a `CNAME` record from the host name to `yberstad.github.io`, or for an apex domain the four GitHub Pages `A` records.
4. Tick "Enforce HTTPS" under Settings, Pages once the certificate is ready.
5. Update the privacy-policy and support URLs in Play Console and App Store Connect, and in the app config.

## Later: https share links

`templates/` holds the files for universal links (not published, not enabled): `apple-app-site-association`,
`assetlinks.json` and a fallback page `s.html`. Fill in the team ID and the signing certificate fingerprint,
copy them into the build output and enable them together with the app change.
