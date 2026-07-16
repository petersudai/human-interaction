# Human Interaction

Marketing site for Human Interaction — web and software design/development for ambitious businesses, creatives, and founders.

## Stack

- [Astro](https://astro.build) — static site framework
- React (islands) + [Framer Motion](https://www.framer.com/motion/) for interactive/animated sections
- Tailwind CSS v4
- TypeScript

## Development

```sh
npm install
npm run dev
```

Site runs at `localhost:4321`.

## Commands

| Command           | Action                                      |
| :----------------- | :------------------------------------------ |
| `npm install`       | Install dependencies                        |
| `npm run dev`       | Start the local dev server                  |
| `npm run build`     | Build the production site to `./dist/`      |
| `npm run preview`   | Preview the production build locally        |

## Project structure

- `src/components/` — page sections and UI components
- `src/data/content.ts` — all site copy and contact links in one place
- `src/layouts/Layout.astro` — base HTML shell, meta tags, favicons
- `src/pages/index.astro` — assembles the sections into the home page
- `public/` — static assets (logo, favicons, case study screenshots)
