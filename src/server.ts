import 'zone.js/node';
import { APP_BASE_HREF } from '@angular/common';
import { renderApplication } from '@angular/platform-server';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
import bootstrap from './main.server';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  // Try to find the correct index file
  let indexHtml: string;
  const indexPath = join(browserDistFolder, 'index.html');
  const indexCsrPath = join(browserDistFolder, 'index.csr.html');

  if (existsSync(indexPath)) {
    indexHtml = readFileSync(indexPath, 'utf-8');
    console.log('Using index.html');
  } else if (existsSync(indexCsrPath)) {
    indexHtml = readFileSync(indexCsrPath, 'utf-8');
    console.log('Using index.csr.html');
  } else {
    throw new Error('Could not find index.html or index.csr.html');
  }

  // Serve static files from /browser
  server.use(
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false,
    })
  );

  // All remaining routes use Angular Universal rendering
  // ✅ Option 1 — simplest and matches everything
  // All remaining routes use Angular Universal rendering
  server.get(/.*/, (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    renderApplication(bootstrap, {
      document: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      platformProviders: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
      .then((html) => res.status(200).send(html))
      .catch((err) => {
        console.error('SSR Error:', err);
        res.status(500).send('Internal Server Error');
      });
  });

  return server;
}

function run(): void {
  const port = parseInt(process.env['PORT'] || '5000', 10); // <- always a number
  const host = '0.0.0.0';
  const server = app();

  server.listen(port, host, () => {
    console.log(`Node Express server listening on http://${host}:${port}`);
  });
}

run();

export default app;
