import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const routes: string[] = JSON.parse(
  readFileSync(path.join(process.cwd(), 'audit/routes.json'), 'utf8'),
);

for (const route of routes) {
  test(`${route} has no automated WCAG A/AA violations`, async ({ page }, testInfo) => {
    await page.goto(route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    await testInfo.attach('axe-results', {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json',
    });

    expect(results.violations).toEqual([]);
  });
}
