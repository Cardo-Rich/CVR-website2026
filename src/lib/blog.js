// Build-time blog data layer.
// Fetches published posts from Supabase via PostgREST using the public anon
// key (RLS restricts reads to published rows). Dependency-free; resilient —
// if Supabase is unreachable at build, returns [] so the site still builds.

import { SUPABASE } from "./site-config.js";
import { marked } from "marked";

const REST = `${SUPABASE.url}/rest/v1/blog_posts`;
const HEADERS = { apikey: SUPABASE.anonKey, Authorization: `Bearer ${SUPABASE.anonKey}` };

marked.setOptions({ gfm: true, breaks: false });

async function query(params) {
  try {
    const res = await fetch(`${REST}?${params}`, { headers: HEADERS });
    if (!res.ok) {
      console.warn(`[blog] Supabase responded ${res.status} — skipping.`);
      return [];
    }
    return await res.json();
  } catch (e) {
    console.warn("[blog] Supabase fetch failed — building without posts.", e?.message);
    return [];
  }
}

const SELECT =
  "select=slug,title,excerpt,body,cover_image,cover_grad,author,tags,seo_description,published_at";

export async function getPublishedPosts() {
  return await query(`status=eq.published&${SELECT}&order=published_at.desc`);
}

export async function getPostBySlug(slug) {
  const rows = await query(`status=eq.published&slug=eq.${encodeURIComponent(slug)}&${SELECT}&limit=1`);
  return rows[0] || null;
}

export function renderBody(markdownOrHtml = "") {
  // Stored as markdown; render to HTML at build.
  return marked.parse(markdownOrHtml);
}

export function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function readingTime(body = "") {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
