Shared folder conventions

- Purpose: `src/app/shared` holds reusable UI components, directives, and utility services used across the app.
- Structure recommended:
  - components/ — standalone components grouped by feature (barrel at components/index.ts)
  - directives/ — small structural/attribute directives (barrel at directives/index.ts)
  - services/ — grouped service folders + top-level services (barrel at services/index.ts)
  - shared-imports.ts — exported `SHARED_IMPORTS` array for standalone components

Guidelines

- Keep shared components fully standalone (they already are) so they can be imported with `loadComponent` or directly in `imports`.
- Use the barrels created here to import from a single path:

  - `import { NotFoundComponent } from 'src/app/shared/components';`
  - `import { StorageService } from 'src/app/shared/services';`
  - `import SHARED_IMPORTS from 'src/app/shared';`

- Avoid adding large, rarely-used UI modules to `SHARED_IMPORTS` (bundle size). Prefer per-component imports.
