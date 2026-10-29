# Bernardo Reyes — Portfolio Identity

A visual identity and guidelines page for Bernardo Reyes, Service Design student at SCAD.

Colombian modernism meets Constructivist graphic design: bold, structured, warm, and a little handmade.

## Folders

| Folder | What lives here |
| --- | --- |
| `moodboard/` | Source moodboard image(s) and the cropped panels |
| `tokens/` | Design tokens as JSON (color, type, spacing, grid) |
| `logo/` | Wordmark SVGs (full color, monochrome, reversed) |
| `src/` | Astro site, including the guidelines page at `src/pages/index.astro` |

## Status

- [x] Project set up
- [x] Color extraction from the moodboard
- [x] Palette approved
- [x] Typefaces approved (Option A)
- [x] Design tokens and Style Dictionary build (npm run tokens)
- [ ] Wordmark draft
- [ ] Grid
- [ ] Guidelines page
- [ ] Print / PDF
- [ ] GitHub Pages deploy

## Stack

- Astro (static site)
- Style Dictionary (tokens to CSS variables)
- node-vibrant or color-thief (palette extraction)
- Fontsource (self-hosted fonts)
- GitHub Pages (hosting, via GitHub Actions)

## Getting started

Requires Node.js 20 or newer. Commands will be added as the project is built.

## Commands

```bash
npm install        # install packages (Node.js 20 or newer)
npm run tokens     # build tokens/*.json into src/styles/tokens.css
```

Fonts come from `@fontsource/anton`, `@fontsource/eb-garamond`, and `@fontsource/ibm-plex-mono`, installed through npm.

## Logo files

- `logo/bernie-color.svg`: the BERNIE logo, red crown and black letters (traced from `logo/source/bernie-logo-original.png`)
- `logo/bernie-mono.svg`: single color, ink
- `logo/bernie-reversed.svg`: cream on an ink background
- `logo/bernie-crown.svg`: the red crown on its own, used as the transition element
- `logo/wordmark-option-*.svg`: the earlier Anton drafts, kept for reference

The logo is traced from a PNG, so check the curves at large sizes. If you have the original vector file, replace these files and keep the names.

## Grid

Defined in `tokens/grid.json`:

- 4 columns below 768px, 8 from 768px, 12 from 1024px
- Gutter 16px on mobile, 24px from 768px
- Margin 16px on mobile, 24px from 768px
- Max width 1200px
- 15° diagonal tilt for dividers and key elements

CSS can't read custom properties inside `@media`, so the two breakpoints are written in `src/styles/grid.css` and must match the tokens.

## Guidelines page

`src/pages/index.astro` holds the full guidelines: intent, logo, color (with a live WCAG contrast matrix), typography, grid, and three applied examples. All values come from `tokens/` and `logo/`.

## PDF export

```bash
npm run pdf
```

Builds the site, then writes `exports/bernardo-reyes-identity.pdf` as one tall page. It needs Google Chrome. If Chrome is installed somewhere else, set `CHROME_PATH` to its binary.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages.

Before the first deploy:

1. In the repository settings, set **Pages → Source** to **GitHub Actions**.
2. Set `site` (and `base`, for a project page) in `astro.config.mjs` to match the Pages URL.
