import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);

function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      fields.push(current);
      current = '';
    } else {
      current += character;
    }
  }
  fields.push(current);
  return fields;
}

const output = execFileSync('hugo', ['list', 'all'], { cwd: root, encoding: 'utf8' });
const [header, ...lines] = output.trim().split(/\r?\n/);
const columns = parseCsvLine(header);
const rows = lines.map((line) => {
  const fields = parseCsvLine(line);
  return Object.fromEntries(columns.map((column, index) => [column, fields[index]]));
});

const contentRoutes = rows
  .filter(({ draft, permalink }) => draft === 'false' && permalink)
  .map(({ permalink }) => {
    const path = new URL(permalink).pathname.replace(/^\/wesole_nutki/, '');
    return path.endsWith('/') ? path : `${path}/`;
  });

const structuralRoutes = [
  '/pl/', '/en/', '/pl/about/', '/en/about/', '/pl/programs/', '/en/programs/',
  '/pl/news/', '/en/news/', '/pl/gallery/', '/en/gallery/', '/pl/documents/',
  '/en/documents/', '/pl/contact/', '/en/contact/',
];

const buildDirectory = await mkdtemp(join(tmpdir(), 'wesole-audit-routes-'));
execFileSync('hugo', ['--destination', buildDirectory, '--environment', 'production', '--minify', '--quiet'], {
  cwd: root,
  stdio: 'inherit',
});
const sitemapRoutes = [];
for (const language of ['pl', 'en']) {
  const sitemap = await readFile(join(buildDirectory, language, 'sitemap.xml'), 'utf8');
  for (const [, location] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const path = new URL(location).pathname.replace(/^\/wesole_nutki/, '');
    sitemapRoutes.push(path.endsWith('/') ? path : `${path}/`);
  }
}
await rm(buildDirectory, { recursive: true, force: true });

const allRoutes = [...new Set([...structuralRoutes, ...contentRoutes, ...sitemapRoutes])].sort();

const representatives = [
  ...structuralRoutes,
  '/pl/programs/maluszki/', '/en/programs/toddlers/',
  '/pl/documents/karta-zgloszenia/', '/en/documents/enrollment-form/',
  '/pl/o-przedszkolu/cennik/', '/en/about/pricing/',
  '/pl/plan-zajec/', '/en/schedule/',
  '/pl/categories/', '/en/categories/',
  '/pl/tags/', '/en/tags/',
  '/pl/gallery_categories/', '/en/gallery_categories/',
];
for (const language of ['pl', 'en']) {
  for (const section of ['news', 'gallery']) {
    const route = allRoutes.find((candidate) => {
      if (!candidate.startsWith(`/${language}/`) || candidate === `/${language}/${section}/`) return false;
      return rows.some(({ permalink, section: rowSection }) =>
        rowSection === section && permalink && new URL(permalink).pathname.endsWith(candidate),
      );
    });
    if (route) representatives.push(route);
  }
}
const coverageRoutes = [...new Set(representatives)].sort();
const criticalRoutes = [
  '/pl/', '/en/',
  '/pl/contact/', '/en/contact/',
  '/pl/documents/', '/en/documents/',
  '/pl/documents/karta-zgloszenia/', '/en/documents/enrollment-form/',
].sort();

await mkdir(new URL('../audit/', import.meta.url), { recursive: true });
for (const [filename, routes] of [
  ['critical-routes.json', criticalRoutes],
  ['coverage-routes.json', coverageRoutes],
  ['all-routes.json', allRoutes],
]) {
  await writeFile(new URL(`../audit/${filename}`, import.meta.url), `${JSON.stringify(routes, null, 2)}\n`);
}

console.log(`Generated ${allRoutes.length} WCAG routes, ${criticalRoutes.length} critical Lighthouse routes, and ${coverageRoutes.length} coverage routes.`);
