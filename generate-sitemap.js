const fs = require("fs");
const path = require("path");
const https = require("https");
const { URL } = require("url");
const glob = require("glob");

const BLOG_LIST_URL = "https://infoaidtech.vercel.app/api/blog/get-blog-list";
const SITE_URL = "https://infoaidtech.net";

/**
 * Simple HTTP GET request using built-in modules
 */
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const request = https.get(
      {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        headers: {
          Accept: "application/json",
          "User-Agent": "Sitemap Generator",
        },
      },
      (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (error) {
              reject(new Error(`JSON Parse Error: ${error.message}`));
            }
          } else {
            reject(
              new Error(
                `HTTP Error ${response.statusCode}: ${response.statusMessage}`
              )
            );
          }
        });
      }
    );

    request.on("error", reject);
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error("Request timeout"));
    });
  });
}

/**
 * Fetch blog slugs directly from API using native HTTP
 */
async function getDynamicBlogRoutes() {
  try {
    console.log(`📡 Fetching blog data from: ${BLOG_LIST_URL}`);

    const data = await httpGet(BLOG_LIST_URL);

    // Handle the API response structure
    let blogs = [];
    if (data.body && Array.isArray(data.body)) {
      blogs = data.body;
    } else if (Array.isArray(data)) {
      blogs = data;
    } else {
      console.warn("⚠️ Unexpected API response structure:", Object.keys(data));
      return [];
    }

    console.log(`📊 Total blogs found: ${blogs.length}`);

    // Filter only published blogs
    const publishedBlogs = blogs.filter((blog) => blog.isPublished === true);
    console.log(`📊 Published blogs: ${publishedBlogs.length}`);

    // Sanitize slugs and map to routes
    const blogRoutes = publishedBlogs
      .filter((blog) => blog.slug && blog.slug.trim())
      .map((blog) => {
        const cleanSlug = blog.slug.trim().replace(/\/+$/, "");
        return `/blog/${cleanSlug}`;
      });

    const uniqueBlogRoutes = [...new Set(blogRoutes)];

    if (uniqueBlogRoutes.length > 0) {
      console.log(`📝 Sample blog slugs:`, uniqueBlogRoutes.slice(0, 5));
    }

    return uniqueBlogRoutes;
  } catch (error) {
    console.error("❌ Error fetching blogs:", error.message);
    return [];
  }
}

/**
 * Extract static Angular routes from routing files
 */
function getStaticRoutes() {
  console.log("🔍 Searching for Angular routing files...");

  const routingFiles = glob
    .sync("src/app/**/*.ts")
    .filter((file) => file.includes("routing") || file.includes("routes"));

  if (!routingFiles.length) {
    console.error("❌ No routing files found.");
    return [];
  }

  console.log("📂 Found routing files:", routingFiles);

  const staticRoutes = new Set();
  const routeRegex = /path:\s*['"]([^'"]*)['"]/g;

  for (const file of routingFiles) {
    try {
      const content = fs.readFileSync(file, "utf8");
      let match;
      while ((match = routeRegex.exec(content)) !== null) {
        const route = match[1];
        // Skip empty routes, wildcards, and parameter routes
        if (route && !route.includes("*") && !route.includes(":")) {
          staticRoutes.add(route === "" ? "/" : `/${route}`);
        }
      }
    } catch (error) {
      console.warn(`⚠️ Could not read routing file ${file}:`, error.message);
    }
  }

  // Add essential routes manually if not found
  const essentialRoutes = [
    "/",
    "/login",
    "/register",
    "/dashboard",
    "/about",
    "/contact",
    "/services",
  ];

  essentialRoutes.forEach((route) => staticRoutes.add(route));

  return [...staticRoutes];
}

/**
 * Determine priority based on route type
 */
function getRoutePriority(route) {
  if (route === "/") return "1.0";
  if (route.startsWith("/blog/")) return "0.8";
  if (["/about", "/contact", "/services"].includes(route)) return "0.9";
  if (["/login", "/register"].includes(route)) return "0.6";
  return "0.7";
}

/**
 * Determine change frequency based on route type
 */
function getChangeFreq(route) {
  if (route === "/") return "weekly";
  if (route.startsWith("/blog/")) return "monthly";
  if (["/about", "/contact", "/services"].includes(route)) return "monthly";
  if (["/login", "/register", "/dashboard"].includes(route)) return "yearly";
  return "yearly";
}

/**
 * Generate robots.txt content
 */
function generateRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

/**
 * Generate and save sitemap
 */
async function generateSitemap() {
  console.log("⚙️ Generating sitemap...");

  const staticRoutes = getStaticRoutes();
  const blogRoutes = await getDynamicBlogRoutes();

  const allRoutes = [...new Set([...staticRoutes, ...blogRoutes])];

  console.log(`📌 Static routes: ${staticRoutes.length}`);
  console.log(`📌 Blog routes: ${blogRoutes.length}`);
  console.log(`📌 Total unique routes: ${allRoutes.length}`);

  const today = new Date().toISOString().split("T")[0];

  // Build XML with proper formatting
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .sort()
  .map((route) => {
    const priority = getRoutePriority(route);
    const changefreq = getChangeFreq(route);

    return `  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  // Generate robots.txt
  const robotsTxt = generateRobotsTxt();

  // Ensure the output directory exists
  const sitemapPath = path.join(
    __dirname,
    "dist",
    "infoAidTech",
    "browser",
    "sitemap.xml"
  );
  const robotsPath = path.join(
    __dirname,
    "dist",
    "infoAidTech",
    "browser",
    "robots.txt"
  );
  const outputDir = path.dirname(sitemapPath);

  try {
    fs.mkdirSync(outputDir, { recursive: true });

    // Write sitemap
    fs.writeFileSync(sitemapPath, sitemapXml, "utf8");
    console.log("✅ Sitemap successfully generated at:", sitemapPath);
    console.log(
      `📄 Sitemap file size: ${(fs.statSync(sitemapPath).size / 1024).toFixed(
        2
      )} KB`
    );

    // Write robots.txt
    fs.writeFileSync(robotsPath, robotsTxt, "utf8");
    console.log("✅ Robots.txt successfully generated at:", robotsPath);

    // Also save a copy to the src/assets folder for development
    const devSitemapPath = path.join(__dirname, "src", "assets", "sitemap.xml");
    const devRobotsPath = path.join(__dirname, "src", "assets", "robots.txt");

    try {
      fs.mkdirSync(path.dirname(devSitemapPath), { recursive: true });
      fs.writeFileSync(devSitemapPath, sitemapXml, "utf8");
      fs.writeFileSync(devRobotsPath, robotsTxt, "utf8");
      console.log("📄 Development copies saved to src/assets/");
    } catch (devError) {
      console.warn("⚠️ Could not save development copies:", devError.message);
    }
  } catch (error) {
    console.error("❌ Error saving files:", error.message);
    process.exit(1);
  }
}

/**
 * Validate the generated sitemap
 */
function validateSitemap(sitemapPath) {
  try {
    const content = fs.readFileSync(sitemapPath, "utf8");
    const urlCount = (content.match(/<url>/g) || []).length;
    const locCount = (content.match(/<loc>/g) || []).length;

    if (urlCount !== locCount) {
      console.warn(
        "⚠️ Sitemap validation warning: URL and LOC counts don't match"
      );
    } else {
      console.log(`✅ Sitemap validation passed: ${urlCount} URLs found`);
    }

    // Check for valid XML structure
    if (
      !content.includes('<?xml version="1.0"') ||
      !content.includes("<urlset")
    ) {
      console.warn("⚠️ Sitemap may have invalid XML structure");
    }
  } catch (error) {
    console.error("❌ Sitemap validation failed:", error.message);
  }
}

// Execute the sitemap generation
async function main() {
  try {
    await generateSitemap();

    // Validate the generated sitemap
    const sitemapPath = path.join(
      __dirname,
      "dist",
      "infoAidTech",
      "browser",
      "sitemap.xml"
    );
    if (fs.existsSync(sitemapPath)) {
      validateSitemap(sitemapPath);
    }
  } catch (error) {
    console.error("❌ Sitemap generation failed:", error.message);
    process.exit(1);
  }
}

main();
