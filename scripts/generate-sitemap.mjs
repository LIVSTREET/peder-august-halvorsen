import { createClient } from "@supabase/supabase-js";
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

const SITE_URL = process.env.VITE_SITE_URL || "https://altjegskaper.no";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing env: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY must be set.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function esc(s) {
  if (s == null || s === "") return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function url(path) {
  const base = SITE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
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

const filterPublished = (rows) =>
  (rows ?? []).filter(
    (r) => r.published_at == null || new Date(r.published_at) <= new Date()
  );

async function main() {
  const [projectsRes, postsRes] = await Promise.all([
    supabase.from("projects").select("slug, published_at").eq("status", "published"),
    supabase.from("posts").select("slug, published_at").eq("status", "published"),
  ]);

  if (projectsRes.error) {
    console.error("Projects fetch error:", projectsRes.error.message);
    process.exit(1);
  }
  if (postsRes.error) {
    console.error("Posts fetch error:", postsRes.error.message);
    process.exit(1);
  }

  const projects = filterPublished(projectsRes.data);
  const posts = filterPublished(postsRes.data);

  const staticPaths = [
    "/",
    "/tjenester",
    "/prosjekter",
    "/skriver",
    "/arkiv",
    "/musikk",
  ];

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const path of staticPaths) {
    lines.push("  <url>");
    lines.push(`    <loc>${esc(url(path))}</loc>`);
    lines.push("  </url>");
  }

  for (const row of projects) {
    const loc = url(`/prosjekter/${row.slug}`);
    const lm = lastmod(row.published_at);
    lines.push("  <url>");
    lines.push(`    <loc>${esc(loc)}</loc>`);
    if (lm) lines.push(`    <lastmod>${lm}</lastmod>`);
    lines.push("  </url>");
  }

  for (const row of posts) {
    const loc = url(`/skriver/${row.slug}`);
    const lm = lastmod(row.published_at);
    lines.push("  <url>");
    lines.push(`    <loc>${esc(loc)}</loc>`);
    if (lm) lines.push(`    <lastmod>${lm}</lastmod>`);
    lines.push("  </url>");
  }

  lines.push("</urlset>");

  const outDir = join(rootDir, "public");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "sitemap.xml");
  writeFileSync(outPath, lines.join("\n"), "utf8");

  console.log(`Sitemap generated: ${outPath} (${projects.length} projects, ${posts.length} posts)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
