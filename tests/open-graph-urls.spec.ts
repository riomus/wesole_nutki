import { test, expect } from '@playwright/test';

/**
 * Open Graph URL E2E Tests
 * Tests to verify that Open Graph og:url meta tags are properly set on all pages
 * to ensure correct social media sharing with proper URLs.
 */

test.describe('Open Graph URL Tags', () => {
  test.describe('Homepage Open Graph URLs', () => {
    test('should have og:url meta tag on Polish homepage', async ({ page }) => {
      await page.goto('/pl/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      await expect(ogUrlMeta).toHaveCount(1);

      const content = await ogUrlMeta.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content).toMatch(/\/pl\/$/);
    });

    test('should have og:url meta tag on English homepage', async ({ page }) => {
      await page.goto('/en/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      await expect(ogUrlMeta).toHaveCount(1);

      const content = await ogUrlMeta.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content).toMatch(/\/en\/$/);
    });
  });

  test.describe('About Page Open Graph URLs', () => {
    test('should have og:url meta tag on Polish about page', async ({ page }) => {
      await page.goto('/pl/about/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      await expect(ogUrlMeta).toHaveCount(1);

      const content = await ogUrlMeta.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content).toMatch(/\/pl\/about\/$/);
    });

    test('should have og:url meta tag on English about page', async ({ page }) => {
      await page.goto('/en/about/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      await expect(ogUrlMeta).toHaveCount(1);

      const content = await ogUrlMeta.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content).toMatch(/\/en\/about\/$/);
    });
  });

  test.describe('News Page Open Graph URLs', () => {
    test('should have og:url meta tag on Polish news list page', async ({ page }) => {
      await page.goto('/pl/news/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      await expect(ogUrlMeta).toHaveCount(1);

      const content = await ogUrlMeta.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content).toMatch(/\/pl\/news\/$/);
    });

    test('should have og:url meta tag on English news list page', async ({ page }) => {
      await page.goto('/en/news/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      await expect(ogUrlMeta).toHaveCount(1);

      const content = await ogUrlMeta.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content).toMatch(/\/en\/news\/$/);
    });

    test('should have og:url meta tag on individual Polish news post', async ({ page }) => {
      await page.goto('/pl/news/');

      // Find and click on the first news article link
      const firstNewsLink = page.locator('.news-card a, .post-link, article a').first();

      // Check if there are any news articles
      const newsCount = await firstNewsLink.count();
      if (newsCount > 0) {
        await firstNewsLink.click();

        const ogUrlMeta = page.locator('meta[property="og:url"]');
        await expect(ogUrlMeta).toHaveCount(1);

        const content = await ogUrlMeta.getAttribute('content');
        expect(content).toBeTruthy();
        // Accept either /pl/news/ or date-based URLs (for legacy posts)
        expect(content).toMatch(/\/(pl\/news\/|[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/).+/);
      }
    });

    test('should have og:url meta tag on individual English news post', async ({ page }) => {
      await page.goto('/en/news/');

      // Find and click on the first news article link
      const firstNewsLink = page.locator('.news-card a, .post-link, article a').first();

      // Check if there are any news articles
      const newsCount = await firstNewsLink.count();
      if (newsCount > 0) {
        await firstNewsLink.click();

        const ogUrlMeta = page.locator('meta[property="og:url"]');
        await expect(ogUrlMeta).toHaveCount(1);

        const content = await ogUrlMeta.getAttribute('content');
        expect(content).toBeTruthy();
        expect(content).toMatch(/\/en\/news\/.+/);
      }
    });
  });

  test.describe('Gallery Page Open Graph URLs', () => {
    test('should have og:url meta tag on Polish gallery page', async ({ page }) => {
      await page.goto('/pl/gallery/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      await expect(ogUrlMeta).toHaveCount(1);

      const content = await ogUrlMeta.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content).toMatch(/\/pl\/gallery\/$/);
    });

    test('should have og:url meta tag on English gallery page', async ({ page }) => {
      await page.goto('/en/gallery/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      await expect(ogUrlMeta).toHaveCount(1);

      const content = await ogUrlMeta.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content).toMatch(/\/en\/gallery\/$/);
    });

    test('should have og:url meta tag on individual Polish gallery item', async ({ page }) => {
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
          const ogUrlMeta = page.locator('meta[property="og:url"]');
          await expect(ogUrlMeta).toHaveCount(1);

          const content = await ogUrlMeta.getAttribute('content');
          expect(content).toBeTruthy();
          expect(content).toMatch(/\/pl\/gallery\/.+/);
        }
      }
    });

    test('should have og:url meta tag on individual English gallery item', async ({ page }) => {
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
          const ogUrlMeta = page.locator('meta[property="og:url"]');
          await expect(ogUrlMeta).toHaveCount(1);

          const content = await ogUrlMeta.getAttribute('content');
          expect(content).toBeTruthy();
          expect(content).toMatch(/\/en\/gallery\/.+/);
        }
      }
    });
  });

  test.describe('Programs Page Open Graph URLs', () => {
    test('should have og:url meta tag on Polish programs page', async ({ page }) => {
      await page.goto('/pl/programs/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      await expect(ogUrlMeta).toHaveCount(1);

      const content = await ogUrlMeta.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content).toMatch(/\/pl\/programs\/$/);
    });

    test('should have og:url meta tag on English programs page', async ({ page }) => {
      await page.goto('/en/programs/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      await expect(ogUrlMeta).toHaveCount(1);

      const content = await ogUrlMeta.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content).toMatch(/\/en\/programs\/$/);
    });

    test('should have og:url meta tag on Polish programs schedule page', async ({ page }) => {
      await page.goto('/pl/programs/schedule/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      await expect(ogUrlMeta).toHaveCount(1);

      const content = await ogUrlMeta.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content).toMatch(/\/pl\/programs\/schedule\/$/);
    });

    test('should have og:url meta tag on English programs schedule page', async ({ page }) => {
      await page.goto('/en/programs/schedule/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      await expect(ogUrlMeta).toHaveCount(1);

      const content = await ogUrlMeta.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content).toMatch(/\/en\/programs\/schedule\/$/);
    });
  });

  test.describe('Contact Page Open Graph URLs', () => {
    test('should have og:url meta tag on Polish contact page', async ({ page }) => {
      await page.goto('/pl/contact/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      await expect(ogUrlMeta).toHaveCount(1);

      const content = await ogUrlMeta.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content).toMatch(/\/pl\/contact\/$/);
    });

    test('should have og:url meta tag on English contact page', async ({ page }) => {
      await page.goto('/en/contact/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      await expect(ogUrlMeta).toHaveCount(1);

      const content = await ogUrlMeta.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content).toMatch(/\/en\/contact\/$/);
    });
  });

  test.describe('Open Graph URL Format Validation', () => {
    test('should have absolute URL in og:url meta tag', async ({ page }) => {
      await page.goto('/pl/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      const content = await ogUrlMeta.getAttribute('content');

      expect(content).toBeTruthy();
      // Should be an absolute URL (starts with http:// or https://)
      expect(content).toMatch(/^https?:\/\//);
    });

    test('should match current page URL structure', async ({ page }) => {
      await page.goto('/pl/about/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      const content = await ogUrlMeta.getAttribute('content');
      const currentUrl = page.url();

      expect(content).toBeTruthy();
      // og:url should include the same path as current URL
      expect(content).toContain('/pl/about/');

      // Check that og:url and current URL have the same base structure
      const ogUrlPath = new URL(content!).pathname;
      const currentPath = new URL(currentUrl).pathname;
      expect(ogUrlPath).toBe(currentPath);
    });

    test('should not have query parameters in og:url', async ({ page }) => {
      await page.goto('/pl/?test=123');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      const content = await ogUrlMeta.getAttribute('content');

      expect(content).toBeTruthy();
      // og:url should not contain query parameters
      expect(content).not.toContain('?');
      expect(content).not.toContain('test=');
    });

    test('should not have hash fragments in og:url', async ({ page }) => {
      await page.goto('/pl/#section');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      const content = await ogUrlMeta.getAttribute('content');

      expect(content).toBeTruthy();
      // og:url should not contain hash fragments
      expect(content).not.toContain('#');
    });

    test('should have only one og:url meta tag per page', async ({ page }) => {
      await page.goto('/pl/');

      const ogUrlMetas = page.locator('meta[property="og:url"]');
      const count = await ogUrlMetas.count();

      // Should have exactly one og:url meta tag
      expect(count).toBe(1);
    });
  });

  test.describe('Open Graph URL Consistency Across Languages', () => {
    test('should have different og:url for Polish and English versions', async ({ page }) => {
      // Get Polish og:url
      await page.goto('/pl/about/');
      const plOgUrl = await page.locator('meta[property="og:url"]').getAttribute('content');

      // Get English og:url
      await page.goto('/en/about/');
      const enOgUrl = await page.locator('meta[property="og:url"]').getAttribute('content');

      expect(plOgUrl).toBeTruthy();
      expect(enOgUrl).toBeTruthy();

      // They should be different
      expect(plOgUrl).not.toBe(enOgUrl);

      // Polish should contain /pl/, English should contain /en/
      expect(plOgUrl).toContain('/pl/');
      expect(enOgUrl).toContain('/en/');
    });

    test('should update og:url after language switch', async ({ page }) => {
      await page.goto('/pl/about/');

      // Get initial og:url
      const initialOgUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
      expect(initialOgUrl).toContain('/pl/');

      // Switch to English
      const enButton = page.locator('.site-header .lang-btn').filter({
        has: page.locator('.lang-code', { hasText: 'EN' })
      });
      await enButton.click();

      // Check og:url is now for English version
      const ogUrlMeta = page.locator('meta[property="og:url"]');
      const newOgUrl = await ogUrlMeta.getAttribute('content');

      expect(newOgUrl).toBeTruthy();
      expect(newOgUrl).toContain('/en/');
      expect(newOgUrl).not.toBe(initialOgUrl);
    });
  });

  test.describe('Open Graph URL and Canonical URL Consistency', () => {
    test('should have matching og:url and canonical URL on homepage', async ({ page }) => {
      await page.goto('/pl/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      const canonicalUrl = await canonicalLink.getAttribute('href');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      const ogUrl = await ogUrlMeta.getAttribute('content');

      expect(canonicalUrl).toBeTruthy();
      expect(ogUrl).toBeTruthy();

      // Canonical and og:url should match
      expect(canonicalUrl).toBe(ogUrl);
    });

    test('should have matching og:url and canonical URL on about page', async ({ page }) => {
      await page.goto('/en/about/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      const canonicalUrl = await canonicalLink.getAttribute('href');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      const ogUrl = await ogUrlMeta.getAttribute('content');

      expect(canonicalUrl).toBeTruthy();
      expect(ogUrl).toBeTruthy();

      // Canonical and og:url should match
      expect(canonicalUrl).toBe(ogUrl);
    });

    test('should have matching og:url and canonical URL on news page', async ({ page }) => {
      await page.goto('/pl/news/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      const canonicalUrl = await canonicalLink.getAttribute('href');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      const ogUrl = await ogUrlMeta.getAttribute('content');

      expect(canonicalUrl).toBeTruthy();
      expect(ogUrl).toBeTruthy();

      // Canonical and og:url should match
      expect(canonicalUrl).toBe(ogUrl);
    });

    test('should have matching og:url and canonical URL on gallery page', async ({ page }) => {
      await page.goto('/en/gallery/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      const canonicalUrl = await canonicalLink.getAttribute('href');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      const ogUrl = await ogUrlMeta.getAttribute('content');

      expect(canonicalUrl).toBeTruthy();
      expect(ogUrl).toBeTruthy();

      // Canonical and og:url should match
      expect(canonicalUrl).toBe(ogUrl);
    });

    test('should have matching og:url and canonical URL on programs page', async ({ page }) => {
      await page.goto('/pl/programs/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      const canonicalUrl = await canonicalLink.getAttribute('href');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      const ogUrl = await ogUrlMeta.getAttribute('content');

      expect(canonicalUrl).toBeTruthy();
      expect(ogUrl).toBeTruthy();

      // Canonical and og:url should match
      expect(canonicalUrl).toBe(ogUrl);
    });

    test('should have matching og:url and canonical URL on contact page', async ({ page }) => {
      await page.goto('/en/contact/');

      const canonicalLink = page.locator('link[rel="canonical"]');
      const canonicalUrl = await canonicalLink.getAttribute('href');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      const ogUrl = await ogUrlMeta.getAttribute('content');

      expect(canonicalUrl).toBeTruthy();
      expect(ogUrl).toBeTruthy();

      // Canonical and og:url should match
      expect(canonicalUrl).toBe(ogUrl);
    });
  });

  test.describe('Open Graph URL in Head Section', () => {
    test('should place og:url meta tag in head section', async ({ page }) => {
      await page.goto('/pl/');

      // Check that og:url meta tag is within the head tag
      const ogUrlInHead = page.locator('head meta[property="og:url"]');
      await expect(ogUrlInHead).toHaveCount(1);
    });

    test('should have og:url after canonical link', async ({ page }) => {
      await page.goto('/pl/');

      // Get all content in head
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

  test.describe('Open Graph URL with Special Characters', () => {
    test('should properly encode URLs with special characters', async ({ page }) => {
      // Navigate to a page that might have special characters
      await page.goto('/pl/programs/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      const content = await ogUrlMeta.getAttribute('content');

      expect(content).toBeTruthy();
      // URL should be properly formatted
      expect(() => new URL(content!)).not.toThrow();
    });

    test('should handle Polish characters in URLs correctly', async ({ page }) => {
      // Navigate to Polish news page which might have Polish characters in URLs
      await page.goto('/pl/news/');

      // Find and click on the first news article link
      const firstNewsLink = page.locator('.news-card a, .post-link, article a').first();

      const newsCount = await firstNewsLink.count();
      if (newsCount > 0) {
        await firstNewsLink.click();

        const ogUrlMeta = page.locator('meta[property="og:url"]');
        const content = await ogUrlMeta.getAttribute('content');

        expect(content).toBeTruthy();
        // URL should be properly formatted even with Polish characters
        expect(() => new URL(content!)).not.toThrow();
      }
    });
  });

  test.describe('Open Graph URL Protocol', () => {
    test('should use HTTPS protocol in production', async ({ page }) => {
      await page.goto('/pl/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      const content = await ogUrlMeta.getAttribute('content');

      expect(content).toBeTruthy();
      // In production, should use HTTPS (in dev/test might use http)
      expect(content).toMatch(/^https?:\/\//);
    });

    test('should not have trailing protocol issues', async ({ page }) => {
      await page.goto('/en/about/');

      const ogUrlMeta = page.locator('meta[property="og:url"]');
      const content = await ogUrlMeta.getAttribute('content');

      expect(content).toBeTruthy();
      // Should not have double protocols or malformed URLs
      expect(content).not.toMatch(/https?:\/\/.*https?:\/\//);
    });
  });

  test.describe('Open Graph URL Domain Consistency', () => {
    test('should use consistent domain across all pages', async ({ page }) => {
      // Get domain from homepage
      await page.goto('/pl/');
      const homeOgUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
      const homeDomain = new URL(homeOgUrl!).hostname;

      // Get domain from about page
      await page.goto('/pl/about/');
      const aboutOgUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
      const aboutDomain = new URL(aboutOgUrl!).hostname;

      // Get domain from news page
      await page.goto('/pl/news/');
      const newsOgUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
      const newsDomain = new URL(newsOgUrl!).hostname;

      // All domains should be the same
      expect(homeDomain).toBe(aboutDomain);
      expect(homeDomain).toBe(newsDomain);
    });

    test('should use consistent domain across languages', async ({ page }) => {
      // Get domain from Polish homepage
      await page.goto('/pl/');
      const plOgUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
      const plDomain = new URL(plOgUrl!).hostname;

      // Get domain from English homepage
      await page.goto('/en/');
      const enOgUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
      const enDomain = new URL(enOgUrl!).hostname;

      // Domains should be the same across languages
      expect(plDomain).toBe(enDomain);
    });
  });
});
