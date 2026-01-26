import { test, expect } from '@playwright/test';

/**
 * Canonical URL E2E Tests
 * Tests to verify that canonical URLs are properly set on all pages
 * to help search engines understand the preferred URL for content.
 */

test.describe('Canonical URLs', () => {
  test.describe('Homepage Canonical URLs', () => {
    test('should have canonical URL on Polish homepage', async ({ page }) => {
      await page.goto('/pl/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      await expect(canonicalLink).toHaveCount(1);

      const href = await canonicalLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/\/pl\/$/);
    });

    test('should have canonical URL on English homepage', async ({ page }) => {
      await page.goto('/en/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      await expect(canonicalLink).toHaveCount(1);

      const href = await canonicalLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/\/en\/$/);
    });
  });

  test.describe('About Page Canonical URLs', () => {
    test('should have canonical URL on Polish about page', async ({ page }) => {
      await page.goto('/pl/about/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      await expect(canonicalLink).toHaveCount(1);

      const href = await canonicalLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/\/pl\/about\/$/);
    });

    test('should have canonical URL on English about page', async ({ page }) => {
      await page.goto('/en/about/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      await expect(canonicalLink).toHaveCount(1);

      const href = await canonicalLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/\/en\/about\/$/);
    });
  });

  test.describe('News Page Canonical URLs', () => {
    test('should have canonical URL on Polish news list page', async ({ page }) => {
      await page.goto('/pl/news/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      await expect(canonicalLink).toHaveCount(1);

      const href = await canonicalLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/\/pl\/news\/$/);
    });

    test('should have canonical URL on English news list page', async ({ page }) => {
      await page.goto('/en/news/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      await expect(canonicalLink).toHaveCount(1);

      const href = await canonicalLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/\/en\/news\/$/);
    });

    test('should have canonical URL on individual Polish news post', async ({ page }) => {
      await page.goto('/pl/news/');

      // Find and click on the first news article link
      const firstNewsLink = page.locator('.news-card a, .post-link, article a').first();

      // Check if there are any news articles
      const newsCount = await firstNewsLink.count();
      if (newsCount > 0) {
        await firstNewsLink.click();

        const canonicalLink = page.locator('link[rel="canonical"]');
        await expect(canonicalLink).toHaveCount(1);

        const href = await canonicalLink.getAttribute('href');
        expect(href).toBeTruthy();
        // Accept either /pl/news/ or date-based URLs (for legacy posts)
        expect(href).toMatch(/\/(pl\/news\/|[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/).+/);
      }
    });

    test('should have canonical URL on individual English news post', async ({ page }) => {
      await page.goto('/en/news/');

      // Find and click on the first news article link
      const firstNewsLink = page.locator('.news-card a, .post-link, article a').first();

      // Check if there are any news articles
      const newsCount = await firstNewsLink.count();
      if (newsCount > 0) {
        await firstNewsLink.click();

        const canonicalLink = page.locator('link[rel="canonical"]');
        await expect(canonicalLink).toHaveCount(1);

        const href = await canonicalLink.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).toMatch(/\/en\/news\/.+/);
      }
    });
  });

  test.describe('Gallery Page Canonical URLs', () => {
    test('should have canonical URL on Polish gallery page', async ({ page }) => {
      await page.goto('/pl/gallery/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      await expect(canonicalLink).toHaveCount(1);

      const href = await canonicalLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/\/pl\/gallery\/$/);
    });

    test('should have canonical URL on English gallery page', async ({ page }) => {
      await page.goto('/en/gallery/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      await expect(canonicalLink).toHaveCount(1);

      const href = await canonicalLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/\/en\/gallery\/$/);
    });

    test('should have canonical URL on individual Polish gallery item', async ({ page }) => {
      await page.goto('/pl/gallery/');

      // Find and click on the first gallery item link
      const firstGalleryLink = page.locator('.gallery-card a, .gallery-item a, article a').first();

      // Check if there are any gallery items
      const galleryCount = await firstGalleryLink.count();
      if (galleryCount > 0) {
        const listPageURL = page.url();
        await firstGalleryLink.click();

        // Only test if we navigated to a different page (individual gallery item)
        const itemPageURL = page.url();
        if (itemPageURL !== listPageURL && !itemPageURL.endsWith('/gallery/')) {
          const canonicalLink = page.locator('link[rel="canonical"]');
          await expect(canonicalLink).toHaveCount(1);

          const href = await canonicalLink.getAttribute('href');
          expect(href).toBeTruthy();
          expect(href).toMatch(/\/pl\/gallery\/.+/);
        }
      }
    });

    test('should have canonical URL on individual English gallery item', async ({ page }) => {
      await page.goto('/en/gallery/');

      // Find and click on the first gallery item link
      const firstGalleryLink = page.locator('.gallery-card a, .gallery-item a, article a').first();

      // Check if there are any gallery items
      const galleryCount = await firstGalleryLink.count();
      if (galleryCount > 0) {
        const listPageURL = page.url();
        await firstGalleryLink.click();

        // Only test if we navigated to a different page (individual gallery item)
        const itemPageURL = page.url();
        if (itemPageURL !== listPageURL && !itemPageURL.endsWith('/gallery/')) {
          const canonicalLink = page.locator('link[rel="canonical"]');
          await expect(canonicalLink).toHaveCount(1);

          const href = await canonicalLink.getAttribute('href');
          expect(href).toBeTruthy();
          expect(href).toMatch(/\/en\/gallery\/.+/);
        }
      }
    });
  });

  test.describe('Programs Page Canonical URLs', () => {
    test('should have canonical URL on Polish programs page', async ({ page }) => {
      await page.goto('/pl/programs/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      await expect(canonicalLink).toHaveCount(1);

      const href = await canonicalLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/\/pl\/programs\/$/);
    });

    test('should have canonical URL on English programs page', async ({ page }) => {
      await page.goto('/en/programs/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      await expect(canonicalLink).toHaveCount(1);

      const href = await canonicalLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/\/en\/programs\/$/);
    });

    test('should have canonical URL on Polish programs schedule page', async ({ page }) => {
      await page.goto('/pl/programs/schedule/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      await expect(canonicalLink).toHaveCount(1);

      const href = await canonicalLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/\/pl\/programs\/schedule\/$/);
    });

    test('should have canonical URL on English programs schedule page', async ({ page }) => {
      await page.goto('/en/programs/schedule/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      await expect(canonicalLink).toHaveCount(1);

      const href = await canonicalLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/\/en\/programs\/schedule\/$/);
    });
  });

  test.describe('Contact Page Canonical URLs', () => {
    test('should have canonical URL on Polish contact page', async ({ page }) => {
      await page.goto('/pl/contact/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      await expect(canonicalLink).toHaveCount(1);

      const href = await canonicalLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/\/pl\/contact\/$/);
    });

    test('should have canonical URL on English contact page', async ({ page }) => {
      await page.goto('/en/contact/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      await expect(canonicalLink).toHaveCount(1);

      const href = await canonicalLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/\/en\/contact\/$/);
    });
  });

  test.describe('Canonical URL Format Validation', () => {
    test('should have absolute URL in canonical link', async ({ page }) => {
      await page.goto('/pl/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      const href = await canonicalLink.getAttribute('href');

      expect(href).toBeTruthy();
      // Should be an absolute URL (starts with http:// or https://)
      expect(href).toMatch(/^https?:\/\//);
    });

    test('should match current page URL structure', async ({ page }) => {
      await page.goto('/pl/about/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      const href = await canonicalLink.getAttribute('href');
      const currentUrl = page.url();

      expect(href).toBeTruthy();
      // Canonical URL should include the same path as current URL
      expect(href).toContain('/pl/about/');

      // Check that canonical URL and current URL have the same base structure
      const canonicalPath = new URL(href!).pathname;
      const currentPath = new URL(currentUrl).pathname;
      expect(canonicalPath).toBe(currentPath);
    });

    test('should not have query parameters in canonical URL', async ({ page }) => {
      await page.goto('/pl/?test=123');

      const canonicalLink = page.locator('link[rel="canonical"]');
      const href = await canonicalLink.getAttribute('href');

      expect(href).toBeTruthy();
      // Canonical URL should not contain query parameters
      expect(href).not.toContain('?');
      expect(href).not.toContain('test=');
    });

    test('should not have hash fragments in canonical URL', async ({ page }) => {
      await page.goto('/pl/#section');

      const canonicalLink = page.locator('link[rel="canonical"]');
      const href = await canonicalLink.getAttribute('href');

      expect(href).toBeTruthy();
      // Canonical URL should not contain hash fragments
      expect(href).not.toContain('#');
    });

    test('should have only one canonical link per page', async ({ page }) => {
      await page.goto('/pl/');

      const canonicalLinks = page.locator('link[rel="canonical"]');
      const count = await canonicalLinks.count();

      // Should have exactly one canonical link
      expect(count).toBe(1);
    });
  });

  test.describe('Canonical URL Consistency Across Languages', () => {
    test('should have different canonical URLs for Polish and English versions', async ({ page }) => {
      // Get Polish canonical URL
      await page.goto('/pl/about/');
      const plCanonical = await page.locator('link[rel="canonical"]').getAttribute('href');

      // Get English canonical URL
      await page.goto('/en/about/');
      const enCanonical = await page.locator('link[rel="canonical"]').getAttribute('href');

      expect(plCanonical).toBeTruthy();
      expect(enCanonical).toBeTruthy();

      // They should be different
      expect(plCanonical).not.toBe(enCanonical);

      // Polish should contain /pl/, English should contain /en/
      expect(plCanonical).toContain('/pl/');
      expect(enCanonical).toContain('/en/');
    });

    test('should maintain canonical URL after language switch', async ({ page }) => {
      await page.goto('/pl/about/');

      // Switch to English
      const enButton = page.locator('.site-header .lang-btn').filter({
        has: page.locator('.lang-code', { hasText: 'EN' })
      });
      await enButton.click();

      // Check canonical URL is now for English version
      const canonicalLink = page.locator('link[rel="canonical"]');
      const href = await canonicalLink.getAttribute('href');

      expect(href).toBeTruthy();
      expect(href).toContain('/en/');
    });
  });

  test.describe('Canonical URL in Head Section', () => {
    test('should place canonical URL in head section', async ({ page }) => {
      await page.goto('/pl/');

      // Check that canonical link is within the head tag
      const canonicalInHead = page.locator('head link[rel="canonical"]');
      await expect(canonicalInHead).toHaveCount(1);
    });

    test('should have canonical URL before Open Graph tags', async ({ page }) => {
      await page.goto('/pl/');

      // Get all meta and link tags in head
      const headContent = await page.locator('head').innerHTML();

      // Check that canonical appears before og:url
      const canonicalIndex = headContent.indexOf('rel="canonical"');
      const ogUrlIndex = headContent.indexOf('property="og:url"');

      expect(canonicalIndex).toBeGreaterThan(-1);
      expect(ogUrlIndex).toBeGreaterThan(-1);
      // Canonical should appear before og:url (though order doesn't affect functionality)
      expect(canonicalIndex).toBeLessThan(ogUrlIndex);
    });
  });
});
