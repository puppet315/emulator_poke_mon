# Pokémon ROM Emulator (GitHub Pages)

A modern themed static site that runs [EmulatorJS](https://emulatorjs.org/) in the browser.

## Features

- Upload and play your own ROM files directly in browser.
- Provide curated ROMs (hosted by you in this repository) as one-click launch options.
- Works as a static site, so it can be deployed to GitHub Pages.

## Run locally

Because this app fetches JSON and loads assets, run it through a local web server:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Configure curated ROMs

1. Place ROM files in `roms/` (for example, `roms/pokemon-emerald.gba`).
2. Edit `roms/curated-roms.json`:

```json
[
  {
    "name": "Pokémon Emerald",
    "core": "gba",
    "url": "roms/pokemon-emerald.gba"
  }
]
```

`core` should match EmulatorJS core IDs (examples in this project: `gba`, `gb`, `nds`, `nes`, `n64`, `snes`).

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In GitHub: **Settings → Pages**.
3. Set source to **Deploy from a branch** and choose `main` (or your default branch) with `/ (root)`.
4. Save and open the published URL.

## Legal note

Only use ROMs you legally own and are allowed to run.
