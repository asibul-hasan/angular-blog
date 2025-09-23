import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import {
  ɵsetAngularAppManifest as setAngularAppManifest,
  ɵsetAngularAppEngineManifest as setAngularAppEngineManifest,
} from '@angular/ssr';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

// Initialize SSR manifests so the runtime can resolve them.
// Load them dynamically at runtime without top-level await.
const manifestsLoaded = (async () => {
  const appManifest = (
    await import(
      new URL('./angular-app-manifest.mjs', import.meta.url).pathname
    )
  ).default;
  const appEngineManifest = (
    await import(
      new URL('./angular-app-engine-manifest.mjs', import.meta.url).pathname
    )
  ).default;

  setAngularAppManifest(appManifest as any);
  setAngularAppEngineManifest(appEngineManifest as any);
})();

const app = express();
let angularApp: AngularNodeAppEngine | null = null;

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
// Ensure manifests are loaded before handling requests
app.use((req, _res, next) => {
  manifestsLoaded
    .then(() => {
      if (!angularApp) {
        angularApp = new AngularNodeAppEngine();
      }
      next();
    })
    .catch(next);
});

app.use((req, res, next) => {
  (angularApp as AngularNodeAppEngine)
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  manifestsLoaded
    .then(() => {
      app.listen(port, () => {
        console.log(
          `Node Express server listening on http://localhost:${port}`
        );
      });
    })
    .catch((err) => {
      console.error('Failed to load SSR manifests:', err);
      process.exit(1);
    });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
