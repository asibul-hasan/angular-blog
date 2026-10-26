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

  // ✅ SEO Optimization 1: Enforce Canonical URLs by 301-redirecting trailing slashes (except root)
  server.use((req, res, next) => {
    if (req.path.length > 1 && req.path.endsWith('/')) {
      const query = req.url.slice(req.path.length);
      const safePath = req.path.slice(0, -1);
      return res.redirect(301, safePath + query);
    }
    next();
  });

  // ✅ SEO Optimization 2: Serve robots.txt explicitly with text/plain
  server.get('/robots.txt', (req, res) => {
    const candidates = [
      join(browserDistFolder, 'assets/robots.txt'),
      join(browserDistFolder, 'robots.txt'),
      resolve(serverDistFolder, '../../src/assets/robots.txt'),
    ];
    for (const p of candidates) {
      if (existsSync(p)) {
        res.type('text/plain');
        return res.sendFile(p);
      }
    }
    res.type('text/plain').send(
      'User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /api/\nSitemap: https://infoaidtech.net/sitemap.xml\n'
    );
  });

  // ✅ SEO Optimization 3: Dynamic, real-time Google-compliant sitemap.xml
  server.get('/sitemap.xml', async (req, res) => {
    try {
      // Fetch live articles from API
      const apiRes = await fetch('http://localhost:3000/api/blog/get-blog-list');
      if (apiRes.ok) {
        const data: any = await apiRes.json();
        const blogs = Array.isArray(data) ? data : (data.body || []);

        const staticRoutes = [
          { loc: 'https://infoaidtech.net/', changefreq: 'weekly', priority: '1.0' },
          { loc: 'https://infoaidtech.net/about', changefreq: 'monthly', priority: '0.8' },
          { loc: 'https://infoaidtech.net/blog', changefreq: 'daily', priority: '0.9' },
          { loc: 'https://infoaidtech.net/service', changefreq: 'monthly', priority: '0.8' },
          { loc: 'https://infoaidtech.net/careers', changefreq: 'weekly', priority: '0.8' },
          { loc: 'https://infoaidtech.net/contact', changefreq: 'monthly', priority: '0.7' },
          { loc: 'https://infoaidtech.net/image-converter', changefreq: 'monthly', priority: '0.7' },
          { loc: 'https://infoaidtech.net/json-to-ts', changefreq: 'monthly', priority: '0.7' },
          { loc: 'https://infoaidtech.net/conventional-commit-generator', changefreq: 'monthly', priority: '0.7' },
          { loc: 'https://infoaidtech.net/privacy-policy', changefreq: 'yearly', priority: '0.5' },
          { loc: 'https://infoaidtech.net/terms-of-service', changefreq: 'yearly', priority: '0.5' },
          { loc: 'https://infoaidtech.net/disclaimer', changefreq: 'yearly', priority: '0.5' },
        ];

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        const today = new Date().toISOString().split('T')[0];

        for (const route of staticRoutes) {
          xml += `  <url>\n    <loc>${route.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
        }

        for (const blog of blogs) {
          if (blog.isPublished !== false && blog.slug) {
            const lastmod = blog.updatedAt ? new Date(blog.updatedAt).toISOString().split('T')[0] : today;
            xml += `  <url>\n    <loc>https://infoaidtech.net/blog/${encodeURIComponent(blog.slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
          }
        }

        xml += '</urlset>';
        res.type('application/xml');
        return res.send(xml);
      }
    } catch (e) {
      // Fallback below
    }

    const sitemapCandidates = [
      join(browserDistFolder, 'assets/sitemap.xml'),
      join(browserDistFolder, 'sitemap.xml'),
      resolve(serverDistFolder, '../../src/assets/sitemap.xml'),
    ];
    for (const p of sitemapCandidates) {
      if (existsSync(p)) {
        res.type('application/xml');
        return res.sendFile(p);
      }
    }
    res.status(404).send('Sitemap not found');
  });

  // Serve static files from /browser
  server.use(
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false,
    })
  );

  // All remaining routes use Angular Universal rendering
  server.get(/.*/, (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    renderApplication(bootstrap, {
      document: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      platformProviders: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
      .then((html) => {
        // ✅ SEO Optimization 4: Eliminate Soft 404s by responding with true HTTP 404
        if (
          html.includes('app-404') ||
          html.includes('Page Not Found') ||
          html.includes('404 - Page Not Found')
        ) {
          res.status(404).send(html);
        } else {
          res.status(200).send(html);
        }
      })
      .catch((err) => {
        console.error('SSR Error:', err);
        res.status(500).send('Internal Server Error');
      });
  });

  return server;
}

function run(): void {
  const port = parseInt(process.env['PORT'] || '5000', 10);
  const host = '0.0.0.0';
  const server = app();

  server.listen(port, host, () => {
    console.log(`Node Express server listening on http://${host}:${port}`);
  });
}

run();

export default app;
