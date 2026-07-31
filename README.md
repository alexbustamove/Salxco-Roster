# SALXCO Artist Roster

A responsive, editorial artist-roster experience for SALXCO. The site pairs a searchable and filterable roster with direct Instagram links, cohesive portrait treatment, keyboard-accessible interactions, and responsive layouts for mobile through desktop.

Built as a standard Next.js application for deployment on Vercel.

## Local development

Requirements:

- Node.js 22.13 or newer
- npm

```bash
npm install
npm run dev
```

Open `http://localhost:3000/artists`.

## Quality checks

```bash
npm run lint
npm test
```

## Project structure

- `app/` — routes, components, roster data, and styling
- `public/artists/` — roster photography
- `public/fonts/` — Neue Stance and Technovier webfonts
- `public/og.png` — social-sharing artwork
- `tests/` — rendered HTML coverage

Artist names, categories, links, ordering, and crop settings are maintained in `app/data/artists.ts`.

## Deploying to Vercel

Import this repository into Vercel and keep the detected framework preset set to Next.js. No custom build or output-directory settings are required.

Set `NEXT_PUBLIC_SITE_URL` to the canonical production URL if the project uses a custom domain.
