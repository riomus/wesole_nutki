import { test, expect } from '@playwright/test';

/**
 * Contact Page - Contact CTA band ("site-contact-band")
 *
 * The music-led redesign replaced the old gradient ".visit-cta" block with a
 * solid, high-contrast ".site-contact-band" (white text on burnt orange) that
 * offers the two simplest next steps: call or email. These tests verify that
 * band is present, readable (white text on a non-white background) and exposes
 * working call + email actions in both languages.
 */

const WHITE = /rgb\(255,?\s*255,?\s*255\)|rgba\(255,?\s*255,?\s*255,?\s*1\)/;

test.describe('Contact Page - Contact CTA band', () => {
  test.describe('Polish Contact Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/contact/');
      await page.waitForLoadState('networkidle');
    });

    test('should have the contact band visible', async ({ page }) => {
      await expect(page.locator('.site-contact-band')).toBeVisible();
    });

    test('should render the band as a labelled landmark', async ({ page }) => {
      const band = page.locator('.site-contact-band');
      await expect(band).toHaveAttribute('aria-labelledby', 'site-contact-band-title');
      await expect(page.locator('#site-contact-band-title')).toBeVisible();
    });

    test('should have white heading text on a non-white background', async ({ page }) => {
      const heading = page.locator('#site-contact-band-title');
      await expect(heading).toBeVisible();

      const color = await heading.evaluate((el) => window.getComputedStyle(el).color);
      expect(color).toMatch(WHITE);

      const bgColor = await page.locator('.site-contact-band').evaluate(
        (el) => window.getComputedStyle(el).backgroundColor,
      );
      expect(bgColor).not.toMatch(WHITE);
    });

    test('should display the "call us" heading in Polish', async ({ page }) => {
      const heading = page.locator('#site-contact-band-title');
      await expect(heading).toBeVisible();
      const text = await heading.textContent();
      expect(text).toMatch(/zadzwoń|zadzwon/i);
    });

    test('should show an eyebrow prompt in Polish', async ({ page }) => {
      const eyebrow = page.locator('.site-contact-band__eyebrow');
      await expect(eyebrow).toBeVisible();
      await expect(eyebrow).toContainText(/dziecka/i);
    });

    test('should have a phone action with the number', async ({ page }) => {
      const phone = page.locator('.site-contact-band__phone[href^="tel:"]');
      await expect(phone).toBeVisible();
      await expect(phone).toContainText(/zadzwoń|zadzwon/i);
      await expect(phone).toContainText(/\d/);
    });

    test('should have an email action', async ({ page }) => {
      const email = page.locator('.site-contact-band__email[href^="mailto:"]');
      await expect(email).toBeVisible();
      await expect(email).toContainText(/napisz/i);
    });
  });

  test.describe('English Contact Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/contact/');
      await page.waitForLoadState('networkidle');
    });

    test('should have the contact band visible', async ({ page }) => {
      await expect(page.locator('.site-contact-band')).toBeVisible();
    });

    test('should have white heading text on a non-white background', async ({ page }) => {
      const heading = page.locator('#site-contact-band-title');
      await expect(heading).toBeVisible();

      const color = await heading.evaluate((el) => window.getComputedStyle(el).color);
      expect(color).toMatch(WHITE);

      const bgColor = await page.locator('.site-contact-band').evaluate(
        (el) => window.getComputedStyle(el).backgroundColor,
      );
      expect(bgColor).not.toMatch(WHITE);
    });

    test('should display the "call us" heading in English', async ({ page }) => {
      const heading = page.locator('#site-contact-band-title');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(/call us/i);
    });

    test('should have a phone action in English', async ({ page }) => {
      const phone = page.locator('.site-contact-band__phone[href^="tel:"]');
      await expect(phone).toBeVisible();
      await expect(phone).toContainText(/call/i);
    });

    test('should have an email action in English', async ({ page }) => {
      const email = page.locator('.site-contact-band__email[href^="mailto:"]');
      await expect(email).toBeVisible();
      await expect(email).toContainText(/email/i);
    });
  });

  test.describe('Contact band text colour consistency', () => {
    test('heading stays white across viewports', async ({ page }) => {
      await page.goto('/en/contact/');
      await page.waitForLoadState('networkidle');

      const heading = page.locator('#site-contact-band-title');

      for (const viewport of [
        { width: 1280, height: 800 },
        { width: 768, height: 1024 },
        { width: 375, height: 667 },
      ]) {
        await page.setViewportSize(viewport);
        const color = await heading.evaluate((el) => window.getComputedStyle(el).color);
        expect(color).toMatch(WHITE);
      }
    });
  });
});
