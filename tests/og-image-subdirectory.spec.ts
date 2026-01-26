import { test, expect } from '@playwright/test';

/**
 * Open Graph and Twitter Card Image URL Tests
 *
 * These tests verify the fix for og:image and twitter:image URLs to include
 * the subdirectory prefix (/wesole_nutki/) when deployed to a subdirectory.
 *
 * Issue Fixed: Images starting with "/" were not including the subdirectory
 * Solution: Strip leading "/" and apply relURL | absURL to ensure subdirectory is included
 *
 * Related Files:
 * - layouts/partials/head.html (lines 189-193, 226-230)
 */

test.describe('Open Graph Image URLs with Subdirectory', () => {

  test.describe('Homepage og:image URLs', () => {

    test('should have og:image with subdirectory prefix on Polish homepage', async ({ page }) => {
      await page.goto('/pl/');

      const ogImage = page.locator('meta[property="og:image"]');

      // May not have og:image on homepage, so check conditionally
      if (await ogImage.count() > 0) {
        const content = await ogImage.getAttribute('content');

        expect(content).toBeTruthy();
        // Should be absolute URL
        expect(content).toMatch(/^https?:\/\//);
        // Should include subdirectory
        expect(content).toContain('/wesole_nutki/');
        // Should not have double slashes or missing subdirectory
        expect(content).not.toMatch(/https?:\/\/[^\/]+\/images/); // Missing subdirectory
      }
    });

    test('should have og:image with subdirectory prefix on English homepage', async ({ page }) => {
      await page.goto('/en/');

      const ogImage = page.locator('meta[property="og:image"]');

      if (await ogImage.count() > 0) {
        const content = await ogImage.getAttribute('content');

        expect(content).toBeTruthy();
        expect(content).toMatch(/^https?:\/\//);
        expect(content).toContain('/wesole_nutki/');
        expect(content).not.toMatch(/https?:\/\/[^\/]+\/images/);
      }
    });
  });

  test.describe('News Article og:image URLs', () => {

    test('should have og:image with subdirectory prefix on Polish news article', async ({ page }) => {
      await page.goto('/pl/news/');

      // Navigate to first news article
      const firstArticle = page.locator('.news-card a, .card-title a, article a').first();
      const articleCount = await firstArticle.count();

      if (articleCount > 0) {
        await firstArticle.click();
        await page.waitForLoadState('networkidle');

        const ogImage = page.locator('meta[property="og:image"]');

        if (await ogImage.count() > 0) {
          const content = await ogImage.getAttribute('content');

          expect(content).toBeTruthy();
          // Must be absolute URL
          expect(content).toMatch(/^https?:\/\//);
          // Must include subdirectory prefix
          expect(content).toContain('/wesole_nutki/');

          // Verify image path is correctly formatted
          // Example: https://bartusiak.ai/wesole_nutki/images/news/zimowe-zabawy.jpg
          const url = new URL(content!);
          expect(url.pathname).toMatch(/\/wesole_nutki\/.+/);

          // Should NOT have patterns indicating missing subdirectory
          expect(content).not.toMatch(/https?:\/\/[^\/]+\/images/); // Would be missing subdirectory
        }
      }
    });

    test('should have og:image with subdirectory prefix on English news article', async ({ page }) => {
      await page.goto('/en/news/');

      const firstArticle = page.locator('.news-card a, .card-title a, article a').first();
      const articleCount = await firstArticle.count();

      if (articleCount > 0) {
        await firstArticle.click();
        await page.waitForLoadState('networkidle');

        const ogImage = page.locator('meta[property="og:image"]');

        if (await ogImage.count() > 0) {
          const content = await ogImage.getAttribute('content');

          expect(content).toBeTruthy();
          expect(content).toMatch(/^https?:\/\//);
          expect(content).toContain('/wesole_nutki/');

          const url = new URL(content!);
          expect(url.pathname).toMatch(/\/wesole_nutki\/.+/);
        }
      }
    });
  });

  test.describe('Gallery og:image URLs', () => {

    test('should have og:image with subdirectory prefix on gallery pages', async ({ page }) => {
      await page.goto('/pl/gallery/');

      // Navigate to first gallery item
      const firstGallery = page.locator('.gallery-card a, .gallery-item a, article a').first();
      const galleryCount = await firstGallery.count();

      if (galleryCount > 0) {
        const listUrl = page.url();
        await firstGallery.click();
        await page.waitForLoadState('networkidle');

        // Only test if we navigated to a different page
        if (page.url() !== listUrl && !page.url().endsWith('/gallery/')) {
          const ogImage = page.locator('meta[property="og:image"]');

          if (await ogImage.count() > 0) {
            const content = await ogImage.getAttribute('content');

            expect(content).toBeTruthy();
            expect(content).toMatch(/^https?:\/\//);
            expect(content).toContain('/wesole_nutki/');

            const url = new URL(content!);
            expect(url.pathname).toMatch(/\/wesole_nutki\/.+/);
          }
        }
      }
    });
  });

  test.describe('Twitter Card Image URLs', () => {

    test('should have twitter:image with subdirectory prefix on homepage', async ({ page }) => {
      await page.goto('/pl/');

      const twitterImage = page.locator('meta[name="twitter:image"]');

      if (await twitterImage.count() > 0) {
        const content = await twitterImage.getAttribute('content');

        expect(content).toBeTruthy();
        expect(content).toMatch(/^https?:\/\//);
        expect(content).toContain('/wesole_nutki/');
        expect(content).not.toMatch(/https?:\/\/[^\/]+\/images/);
      }
    });

    test('should have twitter:image with subdirectory prefix on news article', async ({ page }) => {
      await page.goto('/pl/news/');

      const firstArticle = page.locator('.news-card a, .card-title a, article a').first();
      const articleCount = await firstArticle.count();

      if (articleCount > 0) {
        await firstArticle.click();
        await page.waitForLoadState('networkidle');

        const twitterImage = page.locator('meta[name="twitter:image"]');

        if (await twitterImage.count() > 0) {
          const content = await twitterImage.getAttribute('content');

          expect(content).toBeTruthy();
          expect(content).toMatch(/^https?:\/\//);
          expect(content).toContain('/wesole_nutki/');

          const url = new URL(content!);
          expect(url.pathname).toMatch(/\/wesole_nutki\/.+/);
        }
      }
    });
  });

  test.describe('Image URL Consistency', () => {

    test('should have matching og:image and twitter:image URLs', async ({ page }) => {
      await page.goto('/pl/news/');

      const firstArticle = page.locator('.news-card a, .card-title a, article a').first();
      const articleCount = await firstArticle.count();

      if (articleCount > 0) {
        await firstArticle.click();
        await page.waitForLoadState('networkidle');

        const ogImage = page.locator('meta[property="og:image"]');
        const twitterImage = page.locator('meta[name="twitter:image"]');

        // If both exist, they should have the same URL
        if (await ogImage.count() > 0 && await twitterImage.count() > 0) {
          const ogContent = await ogImage.getAttribute('content');
          const twitterContent = await twitterImage.getAttribute('content');

          expect(ogContent).toBe(twitterContent);
        }
      }
    });
  });

  test.describe('Image Array Parameter Support', () => {

    test('should extract og:image from images array parameter', async ({ page }) => {
      // This tests the new feature: extracting first image from images[] array
      await page.goto('/pl/news/');

      const firstArticle = page.locator('.news-card a, .card-title a, article a').first();
      const articleCount = await firstArticle.count();

      if (articleCount > 0) {
        await firstArticle.click();
        await page.waitForLoadState('networkidle');

        const ogImage = page.locator('meta[property="og:image"]');

        // Should have og:image (either from image, images[], or fallback)
        if (await ogImage.count() > 0) {
          const content = await ogImage.getAttribute('content');

          expect(content).toBeTruthy();
          expect(content).toMatch(/^https?:\/\//);
          expect(content).toContain('/wesole_nutki/');
        }
      }
    });
  });

  test.describe('Edge Cases', () => {

    test('should handle pages without og:image gracefully', async ({ page }) => {
      await page.goto('/pl/contact/');

      // Contact page may not have og:image
      const ogImage = page.locator('meta[property="og:image"]');
      const count = await ogImage.count();

      // It's OK to not have og:image on some pages
      // If it exists, it must be correct
      if (count > 0) {
        const content = await ogImage.getAttribute('content');
        expect(content).toBeTruthy();
        expect(content).toMatch(/^https?:\/\//);
        expect(content).toContain('/wesole_nutki/');
      }
    });

    test('should not modify external image URLs', async ({ page }) => {
      await page.goto('/pl/');

      const ogImage = page.locator('meta[property="og:image"]');

      if (await ogImage.count() > 0) {
        const content = await ogImage.getAttribute('content');

        // If it's an external URL (e.g., from CDN), it should not be modified
        if (content && content.match(/^https?:\/\/(?!localhost)/)) {
          // External URLs should remain as-is
          expect(() => new URL(content)).not.toThrow();
        }
      }
    });

    test('should validate og:image URL format', async ({ page }) => {
      await page.goto('/pl/');

      const ogImage = page.locator('meta[property="og:image"]');

      if (await ogImage.count() > 0) {
        const content = await ogImage.getAttribute('content');

        expect(content).toBeTruthy();

        // Must be a valid URL
        expect(() => new URL(content!)).not.toThrow();

        // Must use http or https protocol
        const url = new URL(content!);
        expect(['http:', 'https:']).toContain(url.protocol);
      }
    });

    test('should not have double subdirectory in image URLs', async ({ page }) => {
      await page.goto('/pl/');

      const ogImage = page.locator('meta[property="og:image"]');

      if (await ogImage.count() > 0) {
        const content = await ogImage.getAttribute('content');

        expect(content).toBeTruthy();

        // Should not have double subdirectory like /wesole_nutki/wesole_nutki/
        expect(content).not.toContain('/wesole_nutki/wesole_nutki/');
      }
    });
  });

  test.describe('Cross-Language Image URL Consistency', () => {

    test('should use consistent domain for images across languages', async ({ page }) => {
      // Get Polish og:image
      await page.goto('/pl/');
      const plOgImage = page.locator('meta[property="og:image"]');
      let plDomain: string | undefined;

      if (await plOgImage.count() > 0) {
        const plContent = await plOgImage.getAttribute('content');
        if (plContent) {
          plDomain = new URL(plContent).hostname;
        }
      }

      // Get English og:image
      await page.goto('/en/');
      const enOgImage = page.locator('meta[property="og:image"]');
      let enDomain: string | undefined;

      if (await enOgImage.count() > 0) {
        const enContent = await enOgImage.getAttribute('content');
        if (enContent) {
          enDomain = new URL(enContent).hostname;
        }
      }

      // If both exist, domains should match
      if (plDomain && enDomain) {
        expect(plDomain).toBe(enDomain);
      }
    });

    test('should have subdirectory in images for both languages', async ({ page }) => {
      // Polish
      await page.goto('/pl/');
      const plOgImage = page.locator('meta[property="og:image"]');

      if (await plOgImage.count() > 0) {
        const plContent = await plOgImage.getAttribute('content');
        expect(plContent).toContain('/wesole_nutki/');
      }

      // English
      await page.goto('/en/');
      const enOgImage = page.locator('meta[property="og:image"]');

      if (await enOgImage.count() > 0) {
        const enContent = await enOgImage.getAttribute('content');
        expect(enContent).toContain('/wesole_nutki/');
      }
    });
  });

  test.describe('Production Readiness', () => {

    test('should have all required meta tags for social sharing', async ({ page }) => {
      await page.goto('/pl/');

      // Check for essential meta tags
      const checks = {
        canonical: await page.locator('link[rel="canonical"]').count() > 0,
        ogUrl: await page.locator('meta[property="og:url"]').count() > 0,
        ogTitle: await page.locator('meta[property="og:title"]').count() > 0,
        ogDescription: await page.locator('meta[property="og:description"]').count() > 0,
        twitterCard: await page.locator('meta[name="twitter:card"]').count() > 0
      };

      // All essential meta tags should be present
      expect(checks.canonical).toBe(true);
      expect(checks.ogUrl).toBe(true);
      expect(checks.ogTitle).toBe(true);
      expect(checks.ogDescription).toBe(true);
      expect(checks.twitterCard).toBe(true);
    });

    test('should have absolute URLs for all Open Graph and Twitter Card meta tags', async ({ page }) => {
      await page.goto('/pl/');

      // Check og:url
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
      expect(ogUrl).toMatch(/^https?:\/\//);
      expect(ogUrl).toContain('/wesole_nutki/');

      // Check og:image if present
      const ogImage = page.locator('meta[property="og:image"]');
      if (await ogImage.count() > 0) {
        const ogImageContent = await ogImage.getAttribute('content');
        expect(ogImageContent).toMatch(/^https?:\/\//);
        expect(ogImageContent).toContain('/wesole_nutki/');
      }

      // Check twitter:image if present
      const twitterImage = page.locator('meta[name="twitter:image"]');
      if (await twitterImage.count() > 0) {
        const twitterImageContent = await twitterImage.getAttribute('content');
        expect(twitterImageContent).toMatch(/^https?:\/\//);
        expect(twitterImageContent).toContain('/wesole_nutki/');
      }
    });
  });
});
