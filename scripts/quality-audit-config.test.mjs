import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readText = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
test('local audit commands and dependencies are available', async () => {
  const packageJson = JSON.parse(await readText('package.json'));
  assert.equal(packageJson.scripts['audit:routes'], 'node scripts/generate-audit-routes.mjs');
  assert.match(packageJson.scripts['audit:lighthouse'], /npm run audit:routes/);
  assert.equal(packageJson.scripts['audit:lighthouse:critical'], 'lhci autorun');
  assert.match(packageJson.scripts['audit:lighthouse:coverage'], /lighthouserc\.coverage\.cjs/);
  assert.match(packageJson.scripts['audit:wcag'], /npm run audit:routes/);
  assert.equal(packageJson.scripts['audit:quality'], 'npm run audit:lighthouse && npm run audit:wcag');
  assert.ok(packageJson.devDependencies['@lhci/cli']);
  assert.ok(packageJson.devDependencies['@axe-core/playwright']);
});

test('audits use distinct critical, representative, and complete route matrices', async () => {
  const critical = JSON.parse(await readText('audit/critical-routes.json'));
  const coverage = JSON.parse(await readText('audit/coverage-routes.json'));
  const allRoutes = JSON.parse(await readText('audit/all-routes.json'));
  assert.equal(critical.length, 8);
  assert.ok(coverage.length >= 30);
  assert.ok(allRoutes.length >= 100);
  assert.notDeepEqual(critical, coverage);
  assert.ok(allRoutes.some((route) => route.startsWith('/pl/')));
  assert.ok(allRoutes.some((route) => route.startsWith('/en/')));
  for (const family of ['/about/', '/programs/', '/news/', '/gallery/', '/documents/', '/contact/']) {
    assert.ok(coverage.some((route) => route.includes(family)), `missing ${family}`);
  }
  for (const taxonomy of ['/categories/', '/tags/', '/gallery_categories/']) {
    assert.ok(coverage.some((route) => route.includes(taxonomy)), `coverage missing ${taxonomy}`);
    assert.ok(allRoutes.some((route) => route.includes(taxonomy)), `missing ${taxonomy}`);
  }
  for (const route of ['/pl/o-przedszkolu/cennik/', '/en/about/pricing/', '/pl/plan-zajec/', '/en/schedule/']) {
    assert.ok(coverage.includes(route), `coverage missing ${route}`);
  }
  const generator = await readText('scripts/generate-audit-routes.mjs');
  assert.match(generator, /hugo.*list.*all/s);
  const lighthouse = await readText('lighthouserc.cjs');
  const lighthouseCoverage = await readText('lighthouserc.coverage.cjs');
  const axe = await readText('tests/audits/wcag.spec.ts');
  assert.match(lighthouse, /critical-routes\.json/);
  assert.match(lighthouseCoverage, /coverage-routes\.json/);
  assert.match(axe, /all-routes\.json/);
  const playwrightConfig = await readText('playwright.audit.config.ts');
  assert.match(playwrightConfig, /node scripts\/serve-audit\.mjs/);
  assert.match(axe, /wcag22aa/);
});

test('Lighthouse targets perfect scores with stable critical and broad coverage runs', async () => {
  const config = await readText('lighthouserc.cjs');
  const coverageConfig = await readText('lighthouserc.coverage.cjs');
  const auditServer = await readText('scripts/serve-audit.mjs');
  assert.match(config, /numberOfRuns:\s*3/);
  assert.match(coverageConfig, /numberOfRuns:\s*1/);
  assert.match(config, /node scripts\/serve-audit\.mjs/);
  assert.match(auditServer, /--environment/);
  assert.match(auditServer, /production/);
  assert.match(auditServer, /--minify/);
  assert.match(auditServer, /brotliCompress/);
  for (const category of ['performance', 'accessibility', 'best-practices', 'seo']) {
    assert.match(config, new RegExp(`categories:${category}['"]?: \\['error', \\{ minScore: 1 \\}\\]`));
    assert.match(coverageConfig, new RegExp(`categories:${category}['"]?: \\['error', \\{ minScore: 1 \\}\\]`));
  }
});

test('GitHub audits run everywhere, retain evidence, and never gate deployment', async () => {
  const workflow = await readText('.github/workflows/quality-audit.yml');
  assert.match(workflow, /pull_request:/);
  assert.match(workflow, /push:/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /continue-on-error:\s*true/g);
  assert.match(workflow, /if:\s*always\(\)/g);
  assert.match(workflow, /actions\/upload-artifact@v4/g);
  assert.doesNotMatch(workflow, /deploy-pages/);
});

test('public pages avoid known render-blocking audit regressions', async () => {
  const head = await readText('layouts/partials/head.html');
  const customStyles = await readText('assets/scss/_custom.scss');
  const sitewideStyles = await readText('assets/scss/_sitewide.scss');
  const tailwind = await readText('tailwind.config.js');
  const base = await readText('layouts/_default/baseof.html');
  const responsiveImage = await readText('layouts/partials/responsive-image.html');
  const renderImage = await readText('layouts/_default/_markup/render-image.html');
  const renderLink = await readText('layouts/_default/_markup/render-link.html');
  assert.doesNotMatch(head, /identity\.netlify\.com/);
  assert.doesNotMatch(base, /netlifyIdentity/);
  assert.doesNotMatch(head, /fonts\.googleapis\.com/);
  assert.doesNotMatch(head, /as="font"/);
  assert.doesNotMatch(customStyles, /@font-face/);
  assert.match(sitewideStyles, /@font-face/);
  assert.match(sitewideStyles, /bricolage-grotesque-pl-700\.woff2/);
  assert.match(tailwind, /Bricolage Grotesque/);
  assert.match(tailwind, /system-ui/);
  assert.match(head, /\$needsLightbox/);
  assert.match(responsiveImage, /fetchpriority/);
  assert.match(renderImage, /\.Ordinal/);
  assert.match(renderLink, /\$resourceName/);
  assert.match(renderLink, /\$accessibleLabel/);
  assert.doesNotMatch(renderLink, /Open linked resource|Otwórz powiązany materiał/);
});
