import fs from 'node:fs/promises';
import path from 'node:path';

const SITE_URL = process.env.SITEMAP_SITE_URL ?? 'https://ak4n1.site';
const PROJECTS_API_URL =
  process.env.SITEMAP_PROJECTS_API_URL ?? `${SITE_URL}/api/projects?visibleOnly=true`;
const OUTPUT_PATH = path.resolve(process.cwd(), 'public', 'sitemap.xml');
const REQUEST_TIMEOUT_MS = 10000;

const STATIC_ROUTES = ['/', '/home', '/about', '/projects', '/contact'];

function toIsoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0];
}

async function fetchProjects() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(PROJECTS_API_URL, {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

function buildUrlEntries(projects) {
  const today = new Date().toISOString().split('T')[0];
  const entries = [];

  for (const route of STATIC_ROUTES) {
    entries.push({
      loc: `${SITE_URL}${route}`,
      lastmod: today
    });
  }

  for (const project of projects) {
    if (!project || typeof project.id !== 'number') continue;
    entries.push({
      loc: `${SITE_URL}/project/${project.id}`,
      lastmod: toIsoDate(project.updatedAt) ?? toIsoDate(project.createdAt) ?? today
    });
  }

  return entries;
}

function renderSitemap(entries) {
  const urlsXml = entries
    .map(
      ({ loc, lastmod }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`;
}

async function main() {
  let projects = [];

  try {
    projects = await fetchProjects();
    console.log(`[sitemap] Proyectos cargados: ${projects.length}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[sitemap] No se pudieron cargar proyectos dinamicos (${message}). Se genera sitemap solo con rutas fijas.`);
  }

  const xml = renderSitemap(buildUrlEntries(projects));
  await fs.writeFile(OUTPUT_PATH, xml, 'utf8');
  console.log(`[sitemap] Generado: ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error('[sitemap] Error al generar sitemap:', error);
  process.exit(1);
});
