# Leonida Trophy Guide — GTA VI (PS5)

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/dmonziee/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/dmonziee/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

A complete, offline guide and tracker for the **55 PlayStation 5 trophies of Grand Theft Auto VI** — built for the [make.fun bounty](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

- **Checklist** — all 55 trophies with their official name, description and grade, a tick box for each, and progress saved in your browser (localStorage).
- **Guides** — every trophy has a guide written for this app, with its sources cited (PowerPyx, PlanetGTA6). Two trophies whose methods were still unconfirmed when this was written are marked “not yet confirmed” rather than guessed.
- **Filters & search** — by grade, kind (story / missable / collectibles / activities / completion), status and free text. There are 0 online trophies, so the Online filter says so.
- **Spoiler setting** — on by default, it hides the name, description and guide of the 12 story trophies until you earn them.
- **Export / import** — download your progress as JSON and restore it later.
- **Platinum roadmap** — 3 stages (~200 hours total), the full 100% checklist numbers, the one potentially missable trophy and the save advice that goes with it.
- **Offline** — plain static files under `app/`, no build step, no webfonts, no network at runtime. Open `app/index.html` in a desktop browser, or run `node serve.ts` and visit http://localhost:8080.

## Deep links

- `?view=roadmap` — the platinum roadmap
- `?view=sources` — the sources page
- `?trophy=28` — jump to one trophy (Positive Mental Attitude)
- `?spoiler=on|off`, `?kind=missable`, `?grade=silver`, `?status=earned`

## Files

- `app/index.html`, `app/style.css`, `app/app.js` — the guide itself
- `app/data/trophies.json` — the 55 trophies (official names/descriptions/grades, own-words guides, sources)
- `screenshots/` — 4 captures of the running app
- `main.ts` — the entry program: copies `app/` + `screenshots/` to the output directory and writes `dossier.json`
- `serve.ts` — a small static server for local development

## Sources

- [PowerPyx — GTA 6 Trophy Guide & Roadmap](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/)
- [PowerPyx — GTA 6 100% Completion Checklist](https://www.powerpyx.com/gta-6-100-completion-checklist-guide/)
- [PlanetGTA6 — GTA 6 Trophies](https://www.planetgta6.com/en/gta-6-trophies/)

Unofficial fan guide. Not affiliated with Rockstar Games, Take-Two Interactive or Sony Interactive Entertainment. No game art, logos or screenshots are used.

## License

MIT — see [LICENSE](LICENSE).
