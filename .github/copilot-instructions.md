# Copilot Instructions for InfoAidTech (Angular Blog)

## Project Overview

- **Framework:** Angular 20 (standalone components, SSR enabled)
- **Main entry:** `src/main.ts` (browser), `src/main.server.ts` (SSR)
- **App config:** `src/app/app.config.ts` (browser), `src/app/app.config.server.ts` (SSR)
- **Routing:**
  - Public routes: `src/app/features/public/public-routing-module.ts`
  - Auth routes: `src/app/features/auth/`
  - Dashboard routes: `src/app/features/dashboard/dashboard-routing.module.ts`
  - Wildcard/404: `src/app/shared/components/404.component.ts`
- **Guards:** AuthGuard in `src/app/core/guards/auth.guard.ts` (checks login and role)
- **Interceptors:** HTTP loader in `src/app/core/interceptors/http-loader.interceptor.ts` (shows/hides loader)
- **Services:**
  - Auth: `src/app/shared/services/auth/auth.service.ts`
  - Loader: `src/app/shared/services/loader/loader.service.ts`
  - Others: `src/app/shared/services/`

## Build & Run

- **Dev server:** `npm start` or `ng serve` (default port 5000, see `angular.json`)
- **SSR dev:** `npm run dev:ssr` (Angular Universal)
- **Production build:** `npm run build` or `ng build`
- **SSR serve:** `npm run serve:ssr` (serves SSR build from `dist/infoAidTech/server/server.mjs`)
- **Unit tests:** `npm test` or `ng test` (Karma)
- **Sitemap:** `npm run map` (runs `generate-sitemap.js`)

## Key Patterns & Conventions

- **Standalone Angular components** (no NgModules for most features)
- **Lazy loading** for feature modules/components via route definitions
- **Role-based access**: Use `canActivate` with `AuthGuard` and route `data.roles` for protected routes
- **Loader pattern:** HTTP requests trigger loader via interceptor
- **User state:** Managed via `AuthService` (localStorage for token/user)
- **404 handling:** Wildcard route loads `NotFoundComponent`
- **Environment config:** API URLs and other env vars in `src/environments/`
- **Styling:** Global styles in `src/styles.css`, custom theme in `src/custom-theme.scss`, Tailwind/PostCSS supported

## External Integrations

- **Charting:** Chart.js (`NgxChartsModule`), see `app.config.ts`
- **PrimeNG:** UI components, see `package.json` dependencies
- **Express:** SSR server in `src/server.ts`
- **Semantic Release:** Automated changelog/release (see `package.json` devDependencies)

## Examples

- **Add a new dashboard page:**
  1. Create component in `src/app/features/dashboard/`
  2. Add route in `dashboard-routing.module.ts`
- **Protect a route:**
  1. Add `canActivate: [AuthGuard]` and `data: { roles: ['admin'] }` to route
- **Add a service:**
  1. Place in `src/app/shared/services/`
  2. Provide in `app.config.ts` if needed

## Tips for AI Agents

- Always use standalone components unless legacy code requires NgModule
- Prefer lazy loading for new features
- Reference `app.config.ts` for global providers and SSR compatibility
- For SSR, check both `main.server.ts` and `server.ts` for entry and rendering logic
- Use environment files for API endpoints
- Follow existing folder structure for features, shared, and core logic

---

_Last updated: 2025-10-15_
