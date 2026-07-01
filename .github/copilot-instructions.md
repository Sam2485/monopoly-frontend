## Purpose

This file gives concise, actionable guidance for AI coding agents working on this repository so they can become productive quickly.

**Project Overview**
- **Type:**: React app created with Vite (see `vite.config.js`).
- **Entry:**: `index.html` -> `/src/main.jsx` mounts `App` from `src/App.jsx`.
- **UI:**: Plain React + CSS files under `src/` (no framework-specific components in code yet).

**Build & Dev Commands**
- **Install:**: run `npm install` (or use the project's preferred package manager if present).
- **Dev server:**: `npm run dev` (starts Vite with HMR).
- **Build:**: `npm run build` (Vite production build).
- **Preview build:**: `npm run preview` (serve the production build locally).
- **Lint:**: `npm run lint` (runs `eslint .` — see `eslint.config.js`).

**Key Files to Inspect First**
- **`package.json`**: lists dependencies such as `@reduxjs/toolkit`, `react-router-dom`, `@stomp/stompjs`, `sockjs-client`, `tailwindcss`.
- **`vite.config.js`**: Vite plugins and build configuration.
- **`index.html`** and **`src/main.jsx`**: application bootstrap and HMR entry.
- **`src/App.jsx`**: main example component, demonstrates asset imports (`src/assets/*`) and UI layout.
- **`src/*.css`**: global styles and component styles (`index.css`, `App.css`).

**Project-Specific Patterns & Notes**
- **Assets imported in JS/JSX:**: images and icons live under `src/assets` and are imported with ES module imports (example: `import heroImg from './assets/hero.png'` in `src/App.jsx`).
- **CSS style usage:**: `src/App.css` uses nested selector syntax (e.g., `&:hover`) which is not plain browser CSS — verify PostCSS/Sass tooling before editing CSS.
- **State & Real-time libraries present:**: `@reduxjs/toolkit`, `react-redux` (state), and `@stomp/stompjs` + `sockjs-client` (STOMP/WebSocket) are included — look for integration points when adding features that need state or realtime updates.
- **Routing available:**: `react-router-dom` is in deps — add routes in `src/` and wire them into `App.jsx` or a `Router` wrapper in `main.jsx` when implementing pages.

**What To Do When Making Changes**
- **Local validation:**: run `npm run dev` and verify HMR reloads `src/App.jsx` edits (the app is small — this is the fastest feedback loop).
- **Linting:**: run `npm run lint` to surface style and potential issues; respect `eslint.config.js` rules.
- **CSS changes:**: because nested rules are used, confirm PostCSS or other tooling will process them; if you introduce plain CSS features, ensure compatibility with current setup.
- **Adding dependencies:**: update `package.json` and prefer only necessary libs; run `npm install` and verify `npm run dev` still works.

**Examples / Quick References**
- **Mount point:**: `createRoot(document.getElementById('root')).render(...)` in `src/main.jsx`.
- **Importing an image:**: `import heroImg from './assets/hero.png'` then `<img src={heroImg} />` in `src/App.jsx`.
- **Start dev server:**: run `npm run dev` from project root.

If anything important is missing or you want agent guidance tailored to a particular feature (routing, Redux slices, WebSocket integration, Tailwind setup), tell me which area to expand and I'll update this file.
