const fs = require("fs");
const path = require("path");

// ✅ Decide BASE_URL dynamically
const BASE_URL =
  process.env.BASE_URL || "https://infoaidtech.net" || "http://localhost:5000";

// Try both routing styles
const possibleFiles = [
  // path.join(__dirname, "src", "app", "app-routing.module.ts"),
  path.join(__dirname, "src", "app", "app.routes.ts"),
  path.join(__dirname, "src", "app", "app.routes.server.ts"),
  path.join(
    __dirname,
    "src",
    "app",
    "components",
    "public",
    "public-routing-module.ts"
  ),
  path.join(
    __dirname,
    "src",
    "app",
    "components",
    "dashboard",
    "dashboard-routing-module.ts"
  ),
];

let routingFile = null;

for (const file of possibleFiles) {
  if (fs.existsSync(file)) {
    routingFile = file;
    break;
  }
}

if (!routingFile) {
  console.error(
    "❌ No routing file found (app-routing.module.ts or app.routes.ts)."
  );
  process.exit(1);
}

console.log("📂 Using routing file:", routingFile);

// Read routing content
const routingContent = fs.readFileSync(routingFile, "utf8");

// ✅ Extract routes
const routeRegex = /path:\s*['"]([^'"]*)['"]/g;
const routes = [];
let match;

while ((match = routeRegex.exec(routingContent)) !== null) {
  routes.push(match[1] === "" ? "/" : `/${match[1]}`);
}

const uniqueRoutes = [...new Set(routes)];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${uniqueRoutes
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

// ✅ Ensure dist exists (adjust to your build output folder!)
const sitemapPath = path.join(
  __dirname,
  "dist",
  "infoAidTech",
  "browser",
  "sitemap.xml"
);
fs.mkdirSync(path.dirname(sitemapPath), { recursive: true });

// Write sitemap
fs.writeFileSync(sitemapPath, sitemap, "utf8");

console.log("✅ sitemap.xml generated at:", sitemapPath);
