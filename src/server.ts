import 'zone.js/node';
import { APP_BASE_HREF } from '@angular/common';
import { renderApplication } from '@angular/platform-server';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { readFileSync, existsSync, statSync } from 'node:fs';
import bootstrap from './main.server';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  // Try to find the correct index file dynamically with mtime cache
  const indexPath = join(browserDistFolder, 'index.html');
  const indexCsrPath = join(browserDistFolder, 'index.csr.html');
  let cachedIndexHtml = '';
  let lastIndexMtime = 0;

  function getIndexHtml(): string {
    const targetPath = existsSync(indexPath) ? indexPath : indexCsrPath;
    try {
      const stats = statSync(targetPath);
      if (stats.mtimeMs !== lastIndexMtime || !cachedIndexHtml) {
        cachedIndexHtml = readFileSync(targetPath, 'utf-8');
        lastIndexMtime = stats.mtimeMs;
      }
      return cachedIndexHtml;
    } catch {
      return cachedIndexHtml || (existsSync(targetPath) ? readFileSync(targetPath, 'utf-8') : '');
    }
  }

  // ✅ SEO & Security Optimization 1: Enforce HTTPS & Canonical URLs
  server.use((req, res, next) => {
    // Redirect HTTP traffic to HTTPS
    const proto = (req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http')).toString().toLowerCase();
    if (proto === 'http') {
      return res.redirect(301, `https://infoaidtech.net${req.originalUrl}`);
    }

    // Force non-www host
    const host = (req.headers.host || '').toLowerCase();
    if (host.startsWith('www.')) {
      return res.redirect(301, `https://infoaidtech.net${req.originalUrl}`);
    }

    // Global AI Agent Discoverability Link headers (RFC 8288 / ARD Spec)
    res.setHeader('Link', '</llms.txt>; rel="describedby", </ai-catalog.json>; rel="ai-catalog"');

    const rawPath = req.path;
    let decodedPath = rawPath;
    try {
      decodedPath = decodeURIComponent(rawPath);
    } catch {
      // ignore malformed URI
    }

    // Exact path redirects map
    const exactRedirects: Record<string, string> = {
      '/home': '/',
      '/services': '/service',
      '/products': '/service',
      '/products/': '/service',

      '/products/conventional-commit-generator': '/conventional-commit-generator',
      '/commit-generator': '/conventional-commit-generator',
      '/products/image-converter': '/image-converter',
      '/products/json-to-ts': '/json-to-ts',
      '/blog/html-spacing-andamp;-whitespace-how-to-add-space-in-html-like-a-pro': '/blog/html-spacing-whitespace-guide',
      '/blog/iot-standards-protocols': '/blog/iot-standards-protocols-guide',
      '/blog/iot-standards-and-protocols': '/blog/iot-standards-protocols-guide',
      '/blog/startup-incubators-catalysts-early-stage-business-success': '/blog/startup-incubators-early-stage-business-success',
      '/blog/organic-social-media-marketing-2024-guide-authentic-connections': '/blog/organic-social-media-marketing-2026-guide-authentic-connections',
      '/blog/on-page-seo-complete-guide-2026': '/blog/on-page-seo-complete-guide-2025',
      '/blog/object-oriented-programming-oop-javascript': '/blog/comprehensive-guide-object-oriented-programming-oop-javascript',
    };

    const target = exactRedirects[rawPath] || exactRedirects[decodedPath];
    if (target) {
      return res.redirect(301, target);
    }

    // WordPress taxonomy and feed redirects
    if (
      rawPath === '/category' || rawPath.startsWith('/category/') ||
      rawPath === '/tag' || rawPath.startsWith('/tag/') ||
      rawPath === '/feed' || rawPath.startsWith('/feed/') ||
      rawPath === '/rss' || rawPath.startsWith('/rss/')
    ) {
      return res.redirect(301, '/blog');
    }

    if (rawPath === '/author' || rawPath.startsWith('/author/')) {
      return res.redirect(301, '/about');
    }

    if (rawPath.startsWith('/wp-content/') || rawPath.startsWith('/wp-includes/')) {
      return res.status(410).send('Gone');
    }

    if (rawPath.endsWith('.php')) {
      return res.status(404).send('Not Found');
    }

    // Trailing slash normalization: 301-redirect /path/ to /path
    if (rawPath.length > 1 && rawPath.endsWith('/')) {
      const query = req.url.slice(rawPath.length);
      const safePath = rawPath.slice(0, -1);
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
        try {
          res.type('text/plain; charset=utf-8').send(readFileSync(p, 'utf-8'));
          return;
        } catch {}
      }
    }
    res.type('text/plain; charset=utf-8').send(
      'User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /api/\nSitemap: https://infoaidtech.net/sitemap.xml\n'
    );
    return;
  });

  // ✅ AI Agent Discoverability: Serve llms.txt as text/markdown adhering to llmstxt.org spec
  server.get('/llms.txt', (req, res) => {
    const candidates = [
      join(browserDistFolder, 'llms.txt'),
      join(browserDistFolder, 'assets/llms.txt'),
      resolve(serverDistFolder, '../../src/assets/llms.txt'),
    ];
    for (const p of candidates) {
      if (existsSync(p)) {
        try {
          res.type('text/markdown; charset=utf-8').send(readFileSync(p, 'utf-8'));
          return;
        } catch {}
      }
    }
    res.type('text/markdown; charset=utf-8').send(
      '# InfoAidTech\n> Professional IT services, custom software engineering, scalable cloud solutions, and enterprise SME ERP development.\n\n## Core Services\n- [Custom Software Development](https://infoaidtech.net/service): Enterprise software engineering and scalable applications.\n- [Engineering Blog](https://infoaidtech.net/blog): In-depth articles covering software architecture and engineering.\n'
    );
    return;
  });

  // ✅ AI Agent Discoverability: Serve ai-catalog.json adhering to Agentic Resource Discovery (ARD) spec
  server.get(['/ai-catalog.json', '/.well-known/ai-catalog.json'], (req, res) => {
    const candidates = [
      join(browserDistFolder, '.well-known/ai-catalog.json'),
      join(browserDistFolder, 'ai-catalog.json'),
      join(browserDistFolder, 'assets/ai-catalog.json'),
      resolve(serverDistFolder, '../../src/assets/ai-catalog.json'),
    ];
    for (const p of candidates) {
      if (existsSync(p)) {
        try {
          const content = readFileSync(p, 'utf-8');
          res.type('application/json; charset=utf-8').send(content);
          return;
        } catch {}
      }
    }
    // Spec-compliant fallback in-memory JSON manifest so autonomous agents never receive 404 or HTML
    res.type('application/json; charset=utf-8').send(JSON.stringify({
      specVersion: "1.0",
      host: {
        displayName: "InfoAidTech",
        identifier: "https://infoaidtech.net"
      },
      entries: [
        {
          identifier: "urn:air:infoaidtech.net:tools:conventional-commit-generator",
          displayName: "Conventional Commit Generator",
          type: "application/json",
          url: "https://infoaidtech.net/conventional-commit-generator",
          description: "Interactive developer utility to construct standard Conventional Commits with scopes, types, breaking changes, and git-compliant formatting.",
          representativeQueries: ["Generate conventional commit message", "Conventional commits helper tool"],
          tags: ["git", "developer-tools", "productivity", "commits"]
        },
        {
          identifier: "urn:air:infoaidtech.net:tools:image-converter",
          displayName: "Image Converter & Optimizer",
          type: "application/json",
          url: "https://infoaidtech.net/image-converter",
          description: "Client-side high-performance image converter and compressor supporting WebP, PNG, JPEG, and batch conversions without uploading images to external servers.",
          representativeQueries: ["Convert image to WebP format", "Compress images client-side", "Batch image optimizer online"],
          tags: ["image-conversion", "compression", "webp", "tools"]
        },
        {
          identifier: "urn:air:infoaidtech.net:tools:json-to-typescript",
          displayName: "JSON to TypeScript Converter",
          type: "application/json",
          url: "https://infoaidtech.net/json-to-ts",
          description: "Generates clean, strongly-typed TypeScript interfaces and type definitions from JSON payloads.",
          representativeQueries: ["Convert JSON to TypeScript interfaces", "Generate TypeScript types from JSON payload"],
          tags: ["typescript", "json", "types", "code-generator"]
        }
      ]
    }, null, 2));
    return;
  });

  // ✅ SEO Optimization 3: Dynamic, real-time Google-compliant sitemap.xml
  server.get('/sitemap.xml', async (req, res) => {
    const apiEndpoints = [
      process.env['API_URL'] ? `${process.env['API_URL']}/blog/get-blog-list` : null,
      'https://infoaidtech.vercel.app/api/blog/get-blog-list',
      'http://localhost:3000/api/blog/get-blog-list',
    ].filter(Boolean) as string[];

    let blogs: any[] = [];
    for (const endpoint of apiEndpoints) {
      try {
        const apiRes = await fetch(endpoint, { signal: AbortSignal.timeout(4000) });
        if (apiRes.ok) {
          const data: any = await apiRes.json();
          blogs = Array.isArray(data) ? data : (data.body || []);
          if (blogs.length > 0) break;
        }
      } catch {
        // try next endpoint
      }
    }

    if (blogs.length > 0) {
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

      const seenSlugs = new Set<string>();
      for (const blog of blogs) {
        if (blog.isPublished !== false && blog.slug && !seenSlugs.has(blog.slug)) {
          seenSlugs.add(blog.slug);
          const lastmod = blog.updatedAt ? new Date(blog.updatedAt).toISOString().split('T')[0] : today;
          xml += `  <url>\n    <loc>https://infoaidtech.net/blog/${encodeURIComponent(blog.slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        }
      }

      xml += '</urlset>';
      res.type('application/xml');
      res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=3600');
      return res.send(xml);
    }

    const sitemapCandidates = [
      join(browserDistFolder, 'assets/sitemap.xml'),
      join(browserDistFolder, 'sitemap.xml'),
      resolve(serverDistFolder, '../../src/assets/sitemap.xml'),
    ];
    for (const p of sitemapCandidates) {
      if (existsSync(p)) {
        res.type('application/xml');
        res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=3600');
        return res.sendFile(p);
      }
    }
    res.status(404).send('Sitemap not found');
  });

  // ✅ Serve prerendered static routes directly without trailing-slash redirects to prevent 301 loops
  const PRERENDERED_STATIC_ROUTES = new Set([
    '/',
    '/about',
    '/service',
    '/contact',
    '/careers',
    '/terms-of-service',
    '/privacy-policy',
    '/disclaimer',
  ]);

  server.use((req, res, next) => {
    if (req.method === 'GET' || req.method === 'HEAD') {
      if (PRERENDERED_STATIC_ROUTES.has(req.path)) {
        const targetFile = req.path === '/'
          ? join(browserDistFolder, 'index.html')
          : join(browserDistFolder, req.path, 'index.html');
        if (existsSync(targetFile)) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
          res.type('text/html; charset=utf-8');
          if (req.method === 'HEAD') {
            return res.status(200).end();
          }
          return res.sendFile(targetFile);
        }
      }
    }
    next();
  });

  // Serve static assets from /browser
  // redirect: false prevents express.static from issuing directory trailing-slash 301 redirects
  server.use(
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false,
      redirect: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        }
      },
    })
  );

  // All remaining routes use Angular Universal rendering
  server.get(/.*/, (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    renderApplication(bootstrap, {
      document: getIndexHtml(),
      url: `${protocol}://${headers.host}${originalUrl}`,
      platformProviders: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
      .then((html) => {
        // ✅ SEO Optimization 4: Eliminate Soft 404s by responding with true HTTP 404
        if (
          html.includes('app-404') ||
          html.includes('Page Not Found') ||
          html.includes('404 - Page Not Found') ||
          html.includes('Article Not Found') ||
          html.includes('Something\'s missing') ||
          html.includes('not-found-page')
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
