import { expect, test } from '@playwright/test';

const pageFamilies = [
  { name: 'about', route: '/pl/about/' },
  { name: 'programs', route: '/pl/programs/' },
  { name: 'program detail', route: '/pl/programs/maluszki/' },
  { name: 'news', route: '/pl/news/' },
  { name: 'article', route: '/pl/2025/10/27/koncert/' },
  { name: 'gallery', route: '/pl/gallery/' },
  { name: 'gallery detail', route: '/pl/gallery/jesienny-festyn-2024/' },
  { name: 'documents', route: '/pl/documents/' },
  { name: 'document detail', route: '/pl/documents/karta-zgloszenia/' },
  { name: 'contact', route: '/pl/contact/' },
  { name: 'generic content', route: '/pl/o-przedszkolu/cennik/' },
] as const;

for (const family of pageFamilies) {
  test(`${family.name} uses the shared editorial system`, async ({ page }) => {
    await page.goto(family.route, { waitUntil: 'networkidle' });

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.editorial-page-intro')).toBeVisible();
    await expect(page.locator('.site-contact-band a[href^="tel:"]')).toBeVisible();
  });

  for (const width of [390, 1440]) {
    test(`${family.name} has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      await page.goto(family.route, { waitUntil: 'networkidle' });

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
}

test('Polish typography uses the complete local display face', async ({ page }) => {
  await page.goto('/pl/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const heading = page.getByTestId('hero-headline');
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS('font-family', /Bricolage Grotesque/);

  const supportsPolish = await page.evaluate(() =>
    document.fonts.check('700 32px "Bricolage Grotesque"', 'Zażółć gęślą jaźń'),
  );
  expect(supportsPolish).toBe(true);
});

test('About leads with real preschool imagery instead of the illustrated overlay', async ({ page }) => {
  await page.goto('/pl/about/', { waitUntil: 'networkidle' });
  await expect(page.locator('.about-hero-overlay')).toHaveCount(0);
  await expect(page.locator('main picture img, main img').first()).toBeVisible();
});

test('Contact prioritizes direct actions over an equal icon-card grid', async ({ page }) => {
  await page.goto('/pl/contact/', { waitUntil: 'networkidle' });
  await expect(page.locator('.contact-primary-actions')).toBeVisible();
  await expect(page.locator('.contact-essential-details')).toBeVisible();
  await expect(page.locator('.contact-essential-details dt')).toHaveCount(2);
  await expect(page.locator('.contact-card, .contact-detail, .visit-cta')).toHaveCount(0);
});

test('Programs expose an editorial age path', async ({ page }) => {
  await page.goto('/pl/programs/', { waitUntil: 'networkidle' });
  await expect(page.locator('.program-age-path')).toBeVisible();
  expect(await page.locator('.program-age-row').count()).toBeGreaterThanOrEqual(3);
});

test('Documents use a quiet ruled resource list', async ({ page }) => {
  await page.goto('/pl/documents/', { waitUntil: 'networkidle' });
  await expect(page.locator('.resource-list')).toBeVisible();
});
