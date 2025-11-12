## Quick orientation for AI coding agents

This repo is an Angular 20 application with Angular Universal (SSR) enabled and a standalone-components style (bootstrapApplication). Focus on these files to understand behavior quickly:

- `package.json` — scripts and Node/Angular versions. Key scripts: `start` (dev ng serve), `build` (production build + sitemap), `build:ssr` (build for SSR), `serve:ssr` (serve built SSR bundle), `dev:ssr` (dev SSR). Node >= 18 required.
- `angular.json` — output path is `dist/infoAidTech` and SSR entry is `src/server.ts`. Dev server defaults to port 4000.
- `src/main.ts` — client bootstrap (uses `appConfig`).
- `src/main.server.ts` and `src/server.ts` — server bootstrap and Express handler used for SSR.
- `src/app/app.config.ts` and `src/app/app.config.server.ts` — application providers differ for client vs server (HTTP hydration, interceptors, animations, etc.).
- `src/app/app.routes.ts` — central route table (lazy-loaded modules and standalone components). Use this to add routes.
- `src/app/core/interceptors` and `src/app/shared/services` — common cross-cutting concerns (auth, http loader, storage, utility functions).

High-level architecture notes

- Standalone component approach: app is bootstrapped with `bootstrapApplication(AppComponent, appConfig)`. DI providers and router are provided in `appConfig` rather than an `NgModule` class.
- SSR: `src/server.ts` serves static files from the built browser bundle and uses `renderApplication` with the `main.server` bootstrap. When editing SSR behavior, check `src/server.ts` for how index files are located (`index.html` vs `index.csr.html`).
- Data flow: HTTP clients are provided using `provideHttpClient(withFetch(), withInterceptors([...]))` and rely on interceptors in `src/app/core/interceptors`. Many services are signal-based (see `src/app/core/services/blog-store.service.ts`) — prefer updating signals with `.set()` / `.update()`.
- Storage and environment: `StorageService` (SSR-safe) provides a no-op fallback server-side — avoid assuming `localStorage` exists without the service.

Project-specific conventions

- Signals & inject(): code uses `inject()` and `signal()` (standalone/functional DI), not constructor-heavy classes in many places. See `BlogStoreService` for a canonical pattern.
- Routing: use lazy-loading for modules (`loadChildren`) and `loadComponent` for standalone pages. Update `src/app/app.routes.ts` for new routes.
- HTTP cache/hydration: client hydration and transfer cache is enabled (`provideClientHydration` in `app.config`) — be careful when changing HTTP request semantics (avoid caching POSTs).
- Sitemap generation: after `ng build` the `npm run map` script runs `generate-sitemap.js`. Keep that in CI if you change routes or slug patterns.

Developer workflows & commands (practical)

- Start dev server: `npm run start` (Angular dev server). Default port 4200 in README; angular.json serve configuration uses port 4000 for `ng serve` in this repo — prefer checking the serve command or use the `--port` flag.
- SSR dev: `npm run dev:ssr` (starts dev SSR configuration).
- Build for production (client): `npm run build` then `npm run map` runs sitemap generation.
- Build + serve SSR: `npm run build:ssr` then `npm run serve:ssr`.
- Tests: `npm test` (Karma + Jasmine) — unit tests live next to components (`*.spec.ts`).

Where to add changes (examples)

- Add a new public page: create a standalone component under `src/app/features/public/...`, then add a route in `src/app/app.routes.ts` using `loadComponent` or bundle into an existing lazy module via `loadChildren`.
- Add an HTTP service: add to `src/app/shared/services/<feature>/*` and register use via `provideHttpClient` (interceptors already configured in `app.config`). For SSR-safe storage use `StorageService`.
- Modify SSR behavior: update `src/server.ts` (how index is chosen & how renderApplication is called) and `src/main.server.ts`/`app.config.server.ts` for server providers.

Quick tips for PRs

- Preserve SSR-safe patterns: use `isPlatformBrowser` checks or `StorageService` for storage access.
- When changing API calls, update interceptors in `src/app/core/interceptors` and verify transfer cache/hydration behavior.
- Run `npm run map` after route changes to keep sitemap in sync.

If anything here is unclear or you want more detail on a specific area (SSR lifecycle, router lazy-loading, or signal-based stores), tell me which area and I will expand or add examples from the exact files.
