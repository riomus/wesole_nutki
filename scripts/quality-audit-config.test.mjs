import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readText = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const routes = [
  '/pl/',
  '/en/',
  '/pl/contact/',
  '/en/contact/',
  '/pl/documents/',
  '/en/documents/',
  '/pl/documents/karta-zgloszenia/',
  '/en/documents/enrollment-form/',
];

test('local audit commands and dependencies are available', async () => {
  const packageJson = JSON.parse(await readText('package.json'));
  assert.equal(packageJson.scripts['audit:lighthouse'], 'npm run sync:translations && lhci autorun');
  assert.equal(packageJson.scripts['audit:wcag'], 'npm run sync:translations && playwright test --config playwright.audit.config.ts');
  assert.equal(packageJson.scripts['audit:quality'], 'npm run audit:lighthouse && npm run audit:wcag');
  assert.ok(packageJson.devDependencies['@lhci/cli']);
  assert.ok(packageJson.devDependencies['@axe-core/playwright']);
});

test('both audit systems share the complete bilingual route matrix', async () => {
  assert.deepEqual(JSON.parse(await readText('audit/routes.json')), routes);
  const lighthouse = await readText('lighthouserc.cjs');
  const axe = await readText('tests/audits/wcag.spec.ts');
  assert.match(lighthouse, /require\(['"]\.\/audit\/routes\.json['"]\)/);
  assert.match(axe, /audit\/routes\.json/);
  assert.match(axe, /wcag22aa/);
});

test('Lighthouse targets perfect category scores across three runs', async () => {
  const config = await readText('lighthouserc.cjs');
  assert.match(config, /numberOfRuns:\s*3/);
  for (const category of ['performance', 'accessibility', 'best-practices', 'seo']) {
    assert.match(config, new RegExp(`categories:${category}['"]?: \\['error', \\{ minScore: 1 \\}\\]`));
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
