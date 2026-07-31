import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

function loadEnvFile() {
  const envPath = join(rootDir, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile();

const SITE_URL = (process.env.VITE_SITE_URL || "https://studiopah.no").replace(/\/$/, "");
const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

function esc(s) {
  if (s == null || s === "") return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function url(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p === "/" ? "/" : p}`;
}

function lastmod(dateIso) {
  if (!dateIso) return "";
  try {
    const d = new Date(dateIso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

function isPublished(row) {
  return row.published_at == null || new Date(row.published_at) <= new Date();
}

function pushUrl(lines, path, dateIso) {
  const lm = lastmod(dateIso);
  lines.push("  <url>");
  lines.push(`    <loc>${esc(url(path))}</loc>`);
  if (lm) lines.push(`    <lastmod>${lm}</lastmod>`);
  lines.push("  </url>");
}

async function fetchPublished(table, select) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];

  const endpoint = `${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(select)}&status=eq.published`;
  const res = await fetch(endpoint, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${table} fetch failed (${res.status}): ${body}`);
  }

  return filterPublished(await res.json());
}

function filterPublished(rows) {
  return (rows ?? []).filter(isPublished);
}

function contentPath(type, slug) {
  if (type === "work") return `/arbeid/${slug}`;
  if (type === "build") return `/na-bygger-jeg/${slug}`;
  return null;
}

async function main() {
  const staticPaths = [
    "/",
    "/tjenester",
    "/prosjekter",
    "/skriver",
    "/arkiv",
    "/musikk",
    "/om",
    "/prat",
    "/arbeid",
    "/na-bygger-jeg",
    "/en",
    "/en/tjenester",
    "/en/prosjekter",
    "/en/skriver",
    "/en/arkiv",
    "/en/musikk",
    "/en/om",
    "/en/prat",
    "/en/arbeid",
    "/en/na-bygger-jeg",
  ];

  let projects = [];
  let posts = [];
  let contentItems = [];

  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      [projects, posts, contentItems] = await Promise.all([
        // Public view (anon cannot SELECT on base projects table).
        fetchPublished("projects_public", "slug,published_at"),
        fetchPublished("posts", "slug,published_at"),
        fetchPublished("content_items", "slug,type,published_at"),
      ]);
    } catch (err) {
      console.warn(`Dynamic sitemap data unavailable, writing static URLs only: ${err.message}`);
    }
  } else {
    console.warn(
      "VITE_SUPABASE_URL / key not set — writing static sitemap only (dynamic URLs omitted)."
    );
  }

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const path of staticPaths) {
    pushUrl(lines, path);
  }

  for (const row of projects) {
    pushUrl(lines, `/prosjekter/${row.slug}`, row.published_at);
    pushUrl(lines, `/en/prosjekter/${row.slug}`, row.published_at);
  }

  for (const row of posts) {
    pushUrl(lines, `/skriver/${row.slug}`, row.published_at);
    pushUrl(lines, `/en/skriver/${row.slug}`, row.published_at);
  }

  for (const row of contentItems) {
    const path = contentPath(row.type, row.slug);
    if (!path) continue;
    pushUrl(lines, path, row.published_at);
    pushUrl(lines, `/en${path}`, row.published_at);
  }

  lines.push("</urlset>");

  const outDir = join(rootDir, "public");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "sitemap.xml");
  writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");

  console.log(
    `Sitemap generated: ${outPath} (${staticPaths.length} static, ${projects.length} projects, ${posts.length} posts, ${contentItems.length} content items)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
