# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/marugamiii/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/marugamiii/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Legend — an offline trophy guide and tracker for all 55 GTA VI
trophies on PS5 (1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden).
Every trophy gets a guide written in our own words with its source cited
next to it, a checklist that saves progress in localStorage, filters
(story, missable, collectibles, activities, online), a spoiler mode that
hides hidden-trophy names and descriptions until earned, and a roadmap to
the platinum with the missable trophy flagged.

## Run it

Serve `app/` with any static server and open `index.html`:

```sh
cd app && python3 -m http.server 8080   # then open http://localhost:8080
```

## Use it

1. Work through the roadmap: story first, then the 100% completion
   checklist, then Strangers & Freaks and clean-up (about 200 hours,
   one playthrough, no mission replay).
2. Tick trophies off as you earn them — progress is stored in your
   browser (localStorage) and survives reloads. Export it to a JSON file
   or import it back any time.
3. Filter by kind or grade, search by name, or hide earned trophies.
   Spoiler mode is on by default: hidden trophies show as "Hidden Trophy"
   until you mark them earned.
4. Watch the missable banner: only one trophy can be missed —
   Positive Mental Attitude (meditate on Lucia's balcony in Chapter 1).

Five trophies (In The Beginning…, Capital Offense, Bad Luck I Guess,
The Truth Is Out There, Ten Pin) have no confirmed method yet at launch;
their guides say so explicitly instead of guessing, and name what the
description points to.

## Originality

No Rockstar Games logo, wordmark, official artwork, character art or
screenshot is used. Trophy names, descriptions and grades are the
official list (Exophase / PSNProfiles); every guide is written in our
own words and cites its source (PowerPyx Trophy Guide & Roadmap,
Output Lag Trophy List, Exophase, PSNProfiles, GTABase). The design,
colours and code are original.

## Layout

- `app/` — the guide: `index.html`, `style.css`, `app.js`,
  `data/trophies.json` (all 55 trophies: official name, description and
  grade, plus kind, missable flag and a sourced guide each).
- `screenshots/` — 4 screenshots: (1) cover — tracker with a guide open,
  (2) roadmap and progress, (3) spoiler mode on, (4) missable filter.
- `main.ts` — the make.fun entrypoint: copies `app/` + `screenshots/` to
  `/output` and writes `/output/dossier.json`.
- `vendor/makefun-frontend.ts` — make.fun's dossier library, unchanged
  from the kit.

## License

MIT — see `LICENSE`.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
