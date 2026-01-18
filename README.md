# WearWhat — Frontend

A Next.js + TypeScript frontend for the WearWhat application: an outfit planning and styling web app. This repository contains the UI, pages, and components used by the WearWhat product.

## Key Features

- Pages: Home, Dashboard (Community, Planning, Saved, StyleChat, Styling, Wardrobe), Login, Signup
- Component library under `components/` for reusable UI (Header, Footer, dashboard widgets, modals)
- API clients and context utilities in `lib/` for auth, wardrobe, styling, saved images, and calendar outfits

## Tech Stack

- Next.js
- React + TypeScript
- Tailwind CSS
- MUI (Material UI) + Emotion
- Framer Motion

## Prerequisites

- Node.js 18+ recommended
- npm, pnpm or yarn

## Quick Start

Clone the repo, install dependencies and run the dev server:

```bash
git clone <your-repo-url>
cd WearWhat-frontend
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

Available npm scripts (see `package.json`):

- `dev` — run development server
- `build` — build for production
- `start` — start production server
- `lint` — run ESLint

## Environment

Create a `.env.local` in the project root for any runtime configuration the app needs. Common variables you may need to set (add as required by your backend):

- `NEXT_PUBLIC_API_URL` — base URL for the API
- `NEXT_PUBLIC_SOME_KEY` — example public key

Do not commit secrets to the repository.

## Project Structure

- `app/` — Next.js app routes and pages
- `components/` — reusable React components
- `lib/` — API clients, utilities, and context providers
- `public/` — static assets

## Deploy

This app is optimized for deployment on Vercel, but can be deployed to any platform that supports Node.js:

```bash
npm run build
npm run start
```

## Contributing

- Open issues for bugs and feature requests.
- Send PRs for improvements; include a short description of the change and motivation.

## Next steps / suggestions

- Add example `.env.local.example` with required env vars.
- Add a `CONTRIBUTING.md` and `LICENSE` if you plan to accept contributions.

---

If you want, I can also:

- add a `.env.local.example` file,
- run the dev server to confirm everything starts, or
- create a short `CONTRIBUTING.md` template.

Updated README for developer onboarding.
