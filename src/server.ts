import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { environment } from './environments/environment';

const browserDistFolder = join(import.meta.dirname, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine();

// Serve static assets
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

// Sitemap.xml example
app.get('/sitemap.xml', (req, res) => {
  const siteUrl = environment.SITE_URL || 'http://localhost:5000';
  const posts = [
    { slug: 'angular-seo-service', updatedAt: '2025-08-20' },
    { slug: 'seo-friendly-angular', updatedAt: '2025-08-15' },
  ];
  const urls = posts
    .map(
      (post) => `
    <url>
      <loc>${siteUrl}/blog/${post.slug}</loc>
      <lastmod>${post.updatedAt}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `
    )
    .join('');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${siteUrl}/</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
    ${urls}
  </urlset>`;
  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

// Handle Angular SSR
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () =>
    console.log(`Node Express server listening on http://localhost:${port}`)
  );
}

export const reqHandler = createNodeRequestHandler(app);
