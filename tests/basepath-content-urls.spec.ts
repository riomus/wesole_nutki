/**
 * BaseURL Content URL Validation Tests
 *
 * These tests verify that content files (news, pages, etc.) have properly
 * configured URLs that work with the basepath deployment configuration.
 *
 * Tests ensure:
 * - All content URLs include language prefixes (/pl/ or /en/)
 * - URLs in frontmatter are compatible with basepath configuration
 * - Generated URLs match expected patterns
 * - Content is accessible via both permalink and configured URL
 */

import { test, expect } from '@playwright/test';

test.describe('Basepath Content URL Validation', () => {
  test.describe('News Content URLs', () => {
    test('should render news articles with language-prefixed URLs', async ({ page }) => {
      await page.goto('/pl/news/');
      await page.waitForLoadState('networkidle');

      // Get all news card links
      const newsLinks = await page.locator('.news-card a, article a').all();
      expect(newsLinks.length).toBeGreaterThan(0);

      // Check each link has proper language prefix
      for (const link of newsLinks) {
        const href = await link.getAttribute('href');

        if (href && !href.startsWith('http') && !href.startsWith('#')) {
          // Should start with /pl/ or /en/
          expect(href).toMatch(/^\/(pl|en)\//);
          console.log(`✓ Valid URL: ${href}`);
        }
      }
    });

    test('should access news article with hardcoded URL from 2023', async ({ page }) => {
      // This tests the fix for hardcoded URLs without language prefix
      const newsUrl = '/pl/2023/01/30/pracuj-z-wesolymi-nutkami/';

      await page.goto(newsUrl);
      await page.waitForLoadState('networkidle');

      // Verify page loaded successfully
      expect(page.url()).toContain('/pl/2023/01/30/');

      // Verify content is displayed
      const title = await page.locator('h1').first();
      expect(await title.isVisible()).toBe(true);
    });

    test('should access news articles with hardcoded URLs from 2025', async ({ page }) => {
      const testUrls = [
        '/pl/2025/06/03/warsztaty-ekologiczne/',
        '/pl/2025/06/10/muzyka-na-zywo-w-przedszkolu/',
        '/pl/2025/09/15/miedzynarodowy-dzien-kropki/',
        '/pl/2025/09/26/spacer/',
        '/pl/2025/10/07/miedzynarodowy-dzien-muzyki/',
        '/pl/2025/10/27/koncert/'
      ];

      for (const url of testUrls) {
        await page.goto(url);
        await page.waitForLoadState('networkidle');

        // Verify page loaded successfully
        expect(page.url()).toContain(url);

        // Verify content is displayed
        const heading = await page.locator('h1').first();
        expect(await heading.isVisible()).toBe(true);

        console.log(`✓ Successfully accessed: ${url}`);
      }
    });

    test('should handle news URLs without language prefix', async ({ page }) => {
      // Hugo may have aliases for old URLs without language prefix
      const response = await page.goto('/2023/01/30/pracuj-z-wesolymi-nutkami/', {
        waitUntil: 'networkidle'
      });

      // Should either get 404 or redirect to proper URL
      // Both scenarios are acceptable
      const status = response?.status();
      console.log(`Old URL status: ${status}, redirected to: ${page.url()}`);

      // If it loads (200), it should have redirected to proper URL with language prefix
      if (status === 200) {
        expect(page.url()).toMatch(/\/(pl|en)\//);
      }
    });

    test('should have consistent URL format across all news articles', async ({ page }) => {
      await page.goto('/pl/news/');
      await page.waitForLoadState('networkidle');

      const newsLinks = await page.locator('.news-card a, article a').all();
      const urlPattern = /^\/(pl|en)\/\d{4}\/\d{2}\/\d{2}\//;

      let validCount = 0;
      let totalCount = 0;

      for (const link of newsLinks) {
        const href = await link.getAttribute('href');

        if (href && !href.startsWith('http') && !href.startsWith('#')) {
          totalCount++;
          if (urlPattern.test(href)) {
            validCount++;
          } else {
            console.log(`⚠ Non-standard URL format: ${href}`);
          }
        }
      }

      // At least 70% should follow the date-based URL pattern
      const ratio = validCount / totalCount;
      console.log(`URL format compliance: ${validCount}/${totalCount} = ${(ratio * 100).toFixed(1)}%`);
      expect(ratio).toBeGreaterThanOrEqual(0.7);
    });
  });

  test.describe('Page Content URLs', () => {
    test('should access about page with language prefix', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/pl/about');

      const heading = await page.locator('h1').first();
      expect(await heading.isVisible()).toBe(true);
    });

    test('should access contact page with language prefix', async ({ page }) => {
      await page.goto('/pl/contact/');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/pl/contact');

      const heading = await page.locator('h1').first();
      expect(await heading.isVisible()).toBe(true);
    });

    test('should access gallery page with language prefix', async ({ page }) => {
      await page.goto('/pl/gallery/');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/pl/gallery');

      const heading = await page.locator('h1').first();
      expect(await heading.isVisible()).toBe(true);
    });

    test('should have all internal links with language prefix on about page', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const links = await page.locator('a[href^="/"]').all();

      for (const link of links) {
        const href = await link.getAttribute('href');

        if (href && !href.startsWith('http')) {
          // Should have language prefix
          expect(href).toMatch(/^\/(pl|en)\//);
        }
      }
    });
  });

  test.describe('Gallery Content URLs', () => {
    test('should access individual galleries with language prefix', async ({ page }) => {
      await page.goto('/pl/gallery/');
      await page.waitForLoadState('networkidle');

      // Get first gallery link
      const galleryLink = await page.locator('.gallery-card-link, .gallery-card a').first();
      const href = await galleryLink.getAttribute('href');

      expect(href).toMatch(/^\/(pl|en)\/gallery\//);

      // Navigate to gallery
      await galleryLink.click();
      await page.waitForLoadState('networkidle');

      // Verify we're on a gallery page
      expect(page.url()).toMatch(/\/(pl|en)\/gallery\//);
    });

    test('should have all gallery links with language prefix', async ({ page }) => {
      await page.goto('/pl/gallery/');
      await page.waitForLoadState('networkidle');

      const galleryLinks = await page.locator('.gallery-card-link, .gallery-card a').all();

      for (const link of galleryLinks) {
        const href = await link.getAttribute('href');

        if (href && !href.startsWith('http') && !href.startsWith('#')) {
          expect(href).toMatch(/^\/(pl|en)\//);
        }
      }
    });
  });

  test.describe('URL Permalink Consistency', () => {
    test('should generate consistent permalinks for news', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Get a news link from homepage
      const newsLink = await page.locator('.news-card a').first();
      const homepageHref = await newsLink.getAttribute('href');

      // Navigate to news page
      await page.goto('/pl/news/');
      await page.waitForLoadState('networkidle');

      // Find the same article
      const allNewsLinks = await page.locator('.news-card a').all();
      const urls = await Promise.all(
        allNewsLinks.map(link => link.getAttribute('href'))
      );

      // The URL from homepage should match one from news page
      expect(urls).toContain(homepageHref);
    });

    test('should use RelPermalink for internal page links', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      // All internal page links should use absolute paths with language prefix
      const pageLinks = await page.locator('a[href^="/"]').all();

      for (const link of pageLinks) {
        const href = await link.getAttribute('href');

        if (href && !href.startsWith('http')) {
          // Should be absolute path starting with /
          expect(href).toMatch(/^\//);
          // Should include language code
          expect(href).toMatch(/^\/(pl|en)\//);
        }
      }
    });
  });

  test.describe('Content URL Error Handling', () => {
    test('should handle non-existent page URLs gracefully', async ({ page }) => {
      const response = await page.goto('/pl/this-page-does-not-exist/', {
        waitUntil: 'networkidle'
      });

      // Should return 404
      expect(response?.status()).toBe(404);

      // Should show 404 page
      const content = await page.content();
      expect(content.toLowerCase()).toMatch(/404|not found|nie znaleziono/);
    });

    test('should handle invalid URL patterns', async ({ page }) => {
      const invalidUrls = [
        '/pl//double-slash/',
        '/pl/news/invalid/date/format/',
      ];

      for (const url of invalidUrls) {
        const response = await page.goto(url, {
          waitUntil: 'networkidle'
        });

        // Should return error status
        expect(response?.status()).toBeGreaterThanOrEqual(400);
        console.log(`✓ Correctly handled invalid URL: ${url} (${response?.status()})`);
      }
    });
  });
});
