const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const { URL } = require("url");

const SITE_URL = "https://infoaidtech.net";

/**
 * Perform HTTP/HTTPS GET request
 */
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === "https:" ? https : http;

    const request = client.get(
      {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === "https:" ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        headers: {
          Accept: "application/json",
          "User-Agent": "InfoAidTech Sitemap Generator",
        },
      },
      (response) => {
        let data = "";
        response.on("data", (chunk) => (data += chunk));
        response.on("end", () => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (err) {
              reject(new Error(`JSON Parse Error: ${err.message}`));
            }
          } else {
            reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          }
        });
      }
    );

    request.on("error", reject);
    request.setTimeout(6000, () => {
      request.destroy();
      reject(new Error("Request timeout"));
    });
  });
}

/**
 * Fetch published blog slugs from local or remote API
 */
async function getDynamicBlogRoutes() {
  const endpoints = [
    "http://localhost:3000/api/blog/get-blog-list",
    "https://infoaidtech.vercel.app/api/blog/get-blog-list",
  ];

  for (const url of endpoints) {
    try {
      console.log(`📡 Attempting blog fetch from: ${url}`);
      const data = await fetchJson(url);
      const blogs = Array.isArray(data) ? data : data.body || [];

      if (Array.isArray(blogs) && blogs.length > 0) {
        console.log(`📊 Retrieved ${blogs.length} articles from ${url}`);
        return blogs
          .filter((b) => b.isPublished !== false && b.slug && b.slug.trim())
          .map((b) => ({
            route: `/blog/${b.slug.trim().replace(/\/+$/, "")}`,
            updatedAt: b.updatedAt || b.publishedAt || b.createdAt,
          }));
      }
    } catch (err) {
      console.warn(`⚠️ Could not reach ${url}: ${err.message}`);
    }
  }

  console.warn("⚠️ API endpoints unreachable, falling back to static article list.");
  return [];
}

/**
 * Essential, indexable public routes
 */
function getPublicStaticRoutes() {
  return [
    { route: "/", priority: "1.0", changefreq: "weekly" },
    { route: "/blog", priority: "0.9", changefreq: "daily" },
    { route: "/about", priority: "0.8", changefreq: "monthly" },
    { route: "/service", priority: "0.8", changefreq: "monthly" },
    { route: "/careers", priority: "0.8", changefreq: "weekly" },
    { route: "/contact", priority: "0.7", changefreq: "monthly" },
    { route: "/image-converter", priority: "0.7", changefreq: "monthly" },
    { route: "/json-to-ts", priority: "0.7", changefreq: "monthly" },
    { route: "/conventional-commit-generator", priority: "0.7", changefreq: "monthly" },
    { route: "/internship/apply", priority: "0.7", changefreq: "weekly" },
    { route: "/privacy-policy", priority: "0.5", changefreq: "yearly" },
    { route: "/terms-of-service", priority: "0.5", changefreq: "yearly" },
    { route: "/disclaimer", priority: "0.5", changefreq: "yearly" },
  ];
}

/**
 * Generate robots.txt
 */
function generateRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /api/
Disallow: /login
Disallow: /register

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

/**
 * Generate sitemap XML
 */
async function generateSitemap() {
  console.log("⚙️ Generating production Google-compliant sitemap...");

  const staticRoutes = getPublicStaticRoutes();
  const blogRoutes = await getDynamicBlogRoutes();
  const today = new Date().toISOString().split("T")[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 1. Static Pages
  for (const item of staticRoutes) {
    xml += `  <url>\n    <loc>${SITE_URL}${item.route}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${item.changefreq}</changefreq>\n    <priority>${item.priority}</priority>\n  </url>\n`;
  }

  // 2. Published Blog Posts (de-duplicated)
  const seenSlugs = new Set();
  for (const blog of blogRoutes) {
    if (!seenSlugs.has(blog.route)) {
      seenSlugs.add(blog.route);
      const lastmod = blog.updatedAt ? new Date(blog.updatedAt).toISOString().split("T")[0] : today;
      xml += `  <url>\n    <loc>${SITE_URL}${blog.route}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }
  }

  xml += "</urlset>\n";

  // Destinations: dist/infoAidTech/browser and src/assets
  const destinations = [
    path.join(__dirname, "dist", "infoAidTech", "browser", "sitemap.xml"),
    path.join(__dirname, "src", "assets", "sitemap.xml"),
  ];

  const robotsDestinations = [
    path.join(__dirname, "dist", "infoAidTech", "browser", "robots.txt"),
    path.join(__dirname, "src", "assets", "robots.txt"),
  ];

  const robotsTxt = generateRobotsTxt();

  for (const sitemapFile of destinations) {
    try {
      fs.mkdirSync(path.dirname(sitemapFile), { recursive: true });
      fs.writeFileSync(sitemapFile, xml, "utf8");
      console.log(`✅ Sitemap written to: ${sitemapFile}`);
    } catch (e) {
      console.warn(`Could not write to ${sitemapFile}: ${e.message}`);
    }
  }

  for (const robotsFile of robotsDestinations) {
    try {
      fs.mkdirSync(path.dirname(robotsFile), { recursive: true });
      fs.writeFileSync(robotsFile, robotsTxt, "utf8");
      console.log(`✅ Robots.txt written to: ${robotsFile}`);
    } catch (e) {
      console.warn(`Could not write to ${robotsFile}: ${e.message}`);
    }
  }

  console.log(`🎉 Total indexable public URLs in sitemap: ${staticRoutes.length + seenSlugs.size}`);
}

generateSitemap().catch((err) => {
  console.error("❌ Sitemap script failed:", err);
});
