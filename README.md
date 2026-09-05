# AT-Frontend

A dark-themed, responsive flight-search booking UI built with **React 19**, **TypeScript**, **Vite** and **Tailwind CSS v4**.

The app lets you search flights, compare round-trip options and refine results with filters — designed mobile-first with a sticky search bar and a persistent bottom summary bar.

## Features

- Flight search widget (From / To / Departure / Return / Travellers & Class)
- Onward & return flight selection with round-trip summary
- Refine-results sidebar with filters (stops, airline, time, price, duration, baggage, refundability)
- Responsive layout: mobile, tablet and desktop
- Golden hover/section-glow styling with dark navy theme

## Pages

| Path | Description |
| --- | --- |
| `src/components/Pages/SearchPage.tsx` | Main flight search & results view |
| `src/components/Pages/LoginPage2.tsx` | Login page (typing animation) |
| `src/components/LoginPage.tsx` | Simple login page |
| `src/components/LoginPage3.tsx` | Login page with background image |

> The active page is controlled in `src/App.tsx` — flip the imports/comments to switch between pages.

## Getting Started

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# build for production
npm run build

# run the linter
npm run lint

# preview the production build
npm run preview
```

## Tech Stack

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) (`~6.0`)
- [Vite](https://vite.dev/) (`^8`)
- [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) for linting

## Project Structure

```
src/
├── App.tsx                 # Root component (page switcher)
├── assets/                 # Images used across pages
└── components/
    ├── Pages/              # Main views (SearchPage, LoginPage2)
    ├── LoginPage.tsx       # Login variant 1
    └── LoginPage3.tsx      # Login variant 2
```