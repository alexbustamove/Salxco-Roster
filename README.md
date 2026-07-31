# SALXCO Artist Roster

A responsive, editorial artist-roster experience for SALXCO. The site pairs a searchable and filterable roster with direct Instagram links, cohesive portrait treatment, keyboard-accessible interactions, and responsive layouts for mobile through desktop.

## Local development

Requirements:

- Node.js 22.13 or newer
- pnpm

```bash
pnpm install
pnpm run dev
```

Open `http://localhost:3000/artists`.

## Quality checks

```bash
pnpm run lint
pnpm run build
node --test tests/rendered-html.test.mjs
```

## Project structure

- `app/` — routes, components, roster data, and styling
- `public/artists/` — roster photography
- `public/fonts/` — Neue Stance and Technovier webfonts
- `public/og.png` — social-sharing artwork
- `tests/` — rendered HTML coverage

Artist names, categories, links, ordering, and crop settings are maintained in `app/data/artists.ts`.
