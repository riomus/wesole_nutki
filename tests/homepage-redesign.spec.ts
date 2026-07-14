import { expect, test } from '@playwright/test';

const locales = [
  {
    lang: 'pl',
    enrollment: '/pl/documents/karta-zgloszenia/',
    documents: '/pl/documents/',
    callLabel: /zadzwoń/i,
  },
  {
    lang: 'en',
    enrollment: '/en/documents/enrollment-form/',
    documents: '/en/documents/',
    callLabel: /call/i,
  },
];

function parseRgb(color: string): number[] {
  const values = color.match(/[\d.]+/g);
  if (!values || values.length < 3) {
    throw new Error(`Unsupported color: ${color}`);
  }
  return values.slice(0, 3).map(Number);
}

function relativeLuminance(color: string): number {
  const [red, green, blue] = parseRgb(color).map((value) => {
    const channel = value / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string): number {
  const values = [relativeLuminance(foreground), relativeLuminance(background)]
    .sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test.describe('Music-led homepage conversion', () => {
  for (const locale of locales) {
    test(`${locale.lang} homepage uses the canonical direct-call conversion`, async ({ page }) => {
      await page.goto(`/${locale.lang}/`);

      const primaryCall = page.getByTestId('hero-primary-call');
      await expect(primaryCall).toHaveAttribute('href', 'tel:713431899');
      await expect(primaryCall).toContainText('71 343 18 99');
      await expect(primaryCall).toHaveAccessibleName(locale.callLabel);

      await expect(page.getByTestId('enrollment-link')).toHaveAttribute(
        'href',
        locale.enrollment,
      );
      await expect(page.getByTestId('documents-page-link')).toHaveAttribute(
        'href',
        locale.documents,
      );
      await expect(page.getByTestId('final-primary-call')).toHaveAttribute(
        'href',
        'tel:713431899',
      );

      await expect(page.locator('body')).not.toContainText('530 114 202');
    });

    test(`${locale.lang} same-origin homepage links resolve`, async ({ page, request }) => {
      await page.goto(`/${locale.lang}/`);
      const origin = new URL(page.url()).origin;
      const hrefs = await page.locator('a[href]').evaluateAll((links) =>
        [...new Set(links
          .map((link) => (link as HTMLAnchorElement).href)
          .filter((href) => href.startsWith(location.origin))
          .map((href) => href.split('#')[0]))],
      );

      for (const href of hrefs) {
        expect(new URL(href).origin).toBe(origin);
        const response = await request.get(href);
        expect(response.status(), href).toBeLessThan(400);
      }
    });
  }
});

test.describe('Music-led content architecture', () => {
  test('uses evidence instead of the template card and metric sections', async ({ page }) => {
    await page.goto('/pl/');

    await expect(page.locator('.proof-item')).toHaveCount(3);
    await expect(page.locator('.feature-card')).toHaveCount(0);
    await expect(page.locator('.counter-section')).toHaveCount(0);
    await expect(page.locator('.parent-shortcut')).toHaveCount(4);
    await expect(page.locator('#music-experience')).toContainText(/muzyk/i);
  });

  test('keeps English proof and parent resources equivalent', async ({ page }) => {
    await page.goto('/en/');

    await expect(page.locator('.proof-item')).toHaveCount(3);
    await expect(page.locator('.parent-shortcut')).toHaveCount(4);
    await expect(page.locator('#music-experience')).toContainText(/music/i);
    await expect(page.getByRole('heading', { name: /for parents/i })).toBeVisible();
  });
});

test.describe('Responsive conversion and navigation', () => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/pl/');
      const dimensions = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client);
    });
  }

  test('tablet switches navigation before desktop labels wrap', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/pl/');

    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();
    await expect(page.locator('.desktop-nav')).toBeHidden();
  });

  test('mobile exposes a direct call control with a touch-sized target', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/pl/');

    const call = page.getByTestId('mobile-call');
    await expect(call).toHaveAttribute('href', 'tel:713431899');
    const box = await call.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('desktop dropdown and mobile close control remain operable', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/pl/');
    await page.getByRole('button', { name: 'O nas' }).click();
    await expect(page.getByRole('link', { name: 'Nasza wizja' })).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await page.getByRole('button', { name: /menu/i }).click();
    await page.getByRole('button', { name: /close menu/i }).click();
    await expect(page.locator('.desktop-nav')).toBeHidden();
  });
});

test.describe('Visual and accessibility quality', () => {
  test('removes AI-template animation and metric patterns', async ({ page }) => {
    await page.goto('/pl/');

    await expect(page.locator('.animate-pulse')).toHaveCount(0);
    await expect(page.locator('.animate-bounce')).toHaveCount(0);
    await expect(page.locator('.counter-number')).toHaveCount(0);
    await expect(page.locator('[data-testid="music-staff"]')).toHaveAttribute('aria-hidden', 'true');
  });

  test('primary conversion meets WCAG AA contrast', async ({ page }) => {
    await page.goto('/pl/');

    const colors = await page.getByTestId('hero-primary-call').evaluate((element) => {
      const style = getComputedStyle(element);
      return { foreground: style.color, background: style.backgroundColor };
    });
    expect(contrastRatio(colors.foreground, colors.background)).toBeGreaterThanOrEqual(4.5);
  });

  test('reduced motion removes decorative animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/pl/');

    const animatedElements = await page.locator('body').evaluate(() =>
      Array.from(document.querySelectorAll('*')).filter((element) => {
        const style = getComputedStyle(element);
        return style.animationName !== 'none'
          && Number.parseFloat(style.animationDuration) > 0.01;
      }).length,
    );
    expect(animatedElements).toBe(0);
  });

  test('Polish news dates include a month', async ({ page }) => {
    await page.goto('/pl/');
    await expect(page.locator('article time').first()).toContainText(
      /stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|września|października|listopada|grudnia/i,
    );
  });

  test('lazy images do not emit false timeout warnings', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'warning') warnings.push(message.text());
    });
    await page.goto('/pl/');
    await page.waitForTimeout(10_100);
    expect(warnings.filter((warning) => warning.includes('load timeout'))).toEqual([]);
  });

  test('404 offers recovery in the active language', async ({ page }) => {
    const response = await page.goto('/pl/nie-istnieje/');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: /nie znaleźliśmy/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /strona główna/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /71 343 18 99/ })).toHaveAttribute(
      'href',
      'tel:713431899',
    );
  });
});
