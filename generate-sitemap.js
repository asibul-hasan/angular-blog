const fs = require("fs");
const BASE_URL = "http://localhost:5000";

const routes = ["/", "/about", "/contact", "/blog"];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(
      (route) => `
    <url>
      <loc>${BASE_URL}${route}</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${route === "/" ? "1.0" : "0.8"}</priority>
    </url>`
    )
    .join("")}
</urlset>`;

fs.writeFileSync("dist/browser/sitemap.xml", sitemap, "utf8");
console.log("✅ sitemap.xml generated!");
