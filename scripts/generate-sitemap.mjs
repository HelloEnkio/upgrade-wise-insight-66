import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseUrl = "https://domaine.com";

const pkg = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf-8"));
const routes = Array.isArray(pkg.reactSnap?.include) ? pkg.reactSnap.include : [];

const urls = routes
  .map((route) => `  <url>\n    <loc>${baseUrl}${route}</loc>\n  </url>`)
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

writeFileSync(join(__dirname, "..", "public", "sitemap.xml"), sitemap);
