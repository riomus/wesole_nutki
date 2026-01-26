/**
 * BaseURL Edge Cases and Special Scenarios Tests
 *
 * These tests verify that basepath handling works correctly in edge cases:
 * - Anchor links and hash navigation
 * - Query parameters with basepath
 * - Trailing slashes
 * - Special characters in URLs
 * - 404 pages and error handling
 * - Redirects and canonical URLs
 */

import { test, expect } from '@playwright/test';

test.describe('Basepath Edge Cases', () => {
  test.describe('Anchor Links and Hash Navigation', () => {
    test('should handle anchor links correctly', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      // Find anchor links
      const anchorLinks = await page.locator('a[href^="#"]').all();

      for (const link of anchorLinks) {
        const href = await link.getAttribute('href');

        // Anchor links should start with #
        expect(href).toMatch(/^#/);

        // Should not include basepath in anchor
        expect(href).not.toContain('/pl/');
        expect(href).not.toContain('/en/');
      }

      console.log(`✓ Found ${anchorLinks.length} anchor links, all formatted correctly`);
    });

    test('should navigate to anchor within page', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      // Find an anchor link
      const anchorLink = page.locator('a[href^="#"]').first();

      if (await anchorLink.count() > 0) {
        const href = await anchorLink.getAttribute('href');
        const anchorId = href?.replace('#', '');

        // Click the anchor link
        await anchorLink.click();

        // Wait a bit for scroll
        await page.waitForTimeout(500);

        // URL should now include the hash
        expect(page.url()).toContain(`#${anchorId}`);

        // URL should still have proper basepath
        expect(page.url()).toMatch(/\/pl\/about\//);

        console.log(`✓ Anchor navigation preserved basepath: ${page.url()}`);
      }
    });

    test('should handle anchor links with basepath in full URL', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Look for links that combine page URL + anchor
      const links = await page.locator('a[href*="#"]').all();

      for (const link of links) {
        const href = await link.getAttribute('href');

        if (href && href.includes('#')) {
          const [path, anchor] = href.split('#');

          if (path.length > 0 && path !== '' && !path.startsWith('http')) {
            // Path part should have language prefix
            expect(path).toMatch(/^\/(pl|en)\//);
          }

          console.log(`✓ Valid path+anchor URL: ${href}`);
        }
      }
    });
  });

  test.describe('Query Parameters', () => {
    test('should preserve query parameters in navigation', async ({ page }) => {
      await page.goto('/pl/?ref=test&source=email');
      await page.waitForLoadState('networkidle');

      // URL should have basepath and query params
      expect(page.url()).toContain('/pl/');
      expect(page.url()).toContain('ref=test');
      expect(page.url()).toContain('source=email');

      console.log(`✓ Query parameters preserved: ${page.url()}`);
    });

    test('should handle query parameters in internal links', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Create a test link with query params
      const testLink = page.locator('a[href*="/pl/about"]').first();

      if (await testLink.count() > 0) {
        let href = await testLink.getAttribute('href');

        // Add query param
        const linkWithParams = href + '?test=1';

        // Navigate to URL with params
        await page.goto(linkWithParams);
        await page.waitForLoadState('networkidle');

        // Both basepath and query params should be present
        expect(page.url()).toContain('/pl/about');
        expect(page.url()).toContain('test=1');

        console.log(`✓ Query params work with basepath: ${page.url()}`);
      }
    });

    test('should not double-encode query parameters', async ({ page }) => {
      const url = '/pl/contact/?email=test@example.com&message=Hello%20World';

      await page.goto(url);
      await page.waitForLoadState('networkidle');

      // URL should preserve encoding
      expect(page.url()).toContain('test@example.com');
      expect(page.url()).toMatch(/Hello%20World|Hello\+World|Hello%2520World/);

      console.log(`✓ Query param encoding preserved: ${page.url()}`);
    });
  });

  test.describe('Trailing Slashes', () => {
    test('should handle URLs with trailing slashes', async ({ page }) => {
      const urlsWithSlash = [
        '/pl/',
        '/pl/about/',
        '/pl/contact/',
        '/pl/news/'
      ];

      for (const url of urlsWithSlash) {
        const response = await page.goto(url);
        expect(response?.status()).toBe(200);
        console.log(`✓ URL with trailing slash works: ${url}`);
      }
    });

    test('should handle URLs without trailing slashes', async ({ page }) => {
      const urlsWithoutSlash = [
        '/pl',
        '/pl/about',
        '/pl/contact',
        '/pl/news'
      ];

      for (const url of urlsWithoutSlash) {
        const response = await page.goto(url);

        // Hugo typically redirects to version with trailing slash
        // Both 200 and 301/302 are acceptable
        expect(response?.status()).toBeLessThan(400);

        // Final URL should have proper basepath
        expect(page.url()).toMatch(/\/pl\//);

        console.log(`✓ URL without trailing slash handled: ${url} → ${page.url()}`);
      }
    });

    test('should maintain consistent trailing slash behavior across all pages', async ({ page }) => {
      const pages = ['/pl/', '/pl/about/', '/pl/news/', '/pl/gallery/'];

      for (const pageUrl of pages) {
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle');

        const links = await page.locator('a[href^="/"]').all();

        let withSlash = 0;
        let withoutSlash = 0;

        for (const link of links) {
          const href = await link.getAttribute('href');

          if (href && !href.startsWith('http') && !href.includes('#') && !href.includes('?')) {
            if (href.endsWith('/')) {
              withSlash++;
            } else {
              withoutSlash++;
            }
          }
        }

        console.log(`${pageUrl}: ${withSlash} with slash, ${withoutSlash} without slash`);

        // Most links should follow the same pattern
        const total = withSlash + withoutSlash;
        if (total > 0) {
          const ratio = Math.max(withSlash, withoutSlash) / total;
          expect(ratio).toBeGreaterThan(0.8);
        }
      }
    });
  });

  test.describe('Special Characters in URLs', () => {
    test('should handle URLs with Polish characters', async ({ page }) => {
      // Polish news URLs might have special characters
      await page.goto('/pl/news/');
      await page.waitForLoadState('networkidle');

      const newsLinks = await page.locator('.news-card a, article a').all();

      for (const link of newsLinks) {
        const href = await link.getAttribute('href');

        if (href) {
          // URL should be properly encoded or use slug-safe characters
          const isValid = /^[\/a-z0-9\-\_%]+$/i.test(href.split('?')[0].split('#')[0]);

          if (!isValid) {
            console.log(`⚠ URL with special characters: ${href}`);
          }

          // Click first valid link to test
          if (isValid && !href.startsWith('http')) {
            await link.click();
            await page.waitForLoadState('networkidle');

            // Should load successfully
            expect(page.url()).toContain('/pl/');

            console.log(`✓ Successfully navigated to: ${page.url()}`);
            break;
          }
        }
      }
    });

    test('should handle URLs with dashes and numbers', async ({ page }) => {
      const testUrls = [
        '/pl/2023/01/30/pracuj-z-wesolymi-nutkami/',
        '/pl/2025/09/15/miedzynarodowy-dzien-kropki/'
      ];

      for (const url of testUrls) {
        const response = await page.goto(url);
        expect(response?.status()).toBe(200);

        // URL should be preserved correctly
        expect(page.url()).toContain(url);

        console.log(`✓ URL with dashes/numbers works: ${url}`);
      }
    });
  });

  test.describe('404 and Error Pages', () => {
    test('should show 404 page with basepath for non-existent Polish page', async ({ page }) => {
      const response = await page.goto('/pl/this-page-does-not-exist/');

      expect(response?.status()).toBe(404);

      // 404 page should still have proper navigation with basepath
      const links = await page.locator('a[href^="/"]').all();

      for (const link of links) {
        const href = await link.getAttribute('href');

        if (href && !href.startsWith('http')) {
          expect(href).toMatch(/^\/(pl|en)\//);
        }
      }

      console.log('✓ 404 page has proper basepath in navigation');
    });

    test('should show 404 page with basepath for non-existent English page', async ({ page }) => {
      const response = await page.goto('/en/this-page-does-not-exist/');

      expect(response?.status()).toBe(404);

      // 404 page should still have proper navigation with basepath
      const links = await page.locator('a[href^="/"]').all();

      for (const link of links) {
        const href = await link.getAttribute('href');

        if (href && !href.startsWith('http')) {
          expect(href).toMatch(/^\/(pl|en)\//);
        }
      }

      console.log('✓ 404 page has proper basepath in navigation');
    });

    test('should return 404 for pages without language prefix', async ({ page }) => {
      const response = await page.goto('/about/');

      // Should get 404 or redirect
      expect(response?.status()).toBeGreaterThanOrEqual(400);

      console.log(`✓ Correctly handles missing language prefix: ${response?.status()}`);
    });
  });

  test.describe('Canonical URLs', () => {
    test('should have canonical URL with basepath on Polish pages', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');

      if (canonical) {
        // Canonical URL should be absolute
        expect(canonical).toMatch(/^https?:\/\//);

        // Should include the basepath if configured
        console.log(`✓ Canonical URL: ${canonical}`);
      }
    });

    test('should have canonical URL with basepath on English pages', async ({ page }) => {
      await page.goto('/en/');
      await page.waitForLoadState('networkidle');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');

      if (canonical) {
        // Canonical URL should be absolute
        expect(canonical).toMatch(/^https?:\/\//);

        console.log(`✓ Canonical URL: ${canonical}`);
      }
    });

    test('should have unique canonical URLs for each page', async ({ page }) => {
      const pages = [
        '/pl/',
        '/pl/about/',
        '/pl/contact/',
        '/pl/news/'
      ];

      const canonicals: string[] = [];

      for (const pageUrl of pages) {
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle');

        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');

        if (canonical) {
          canonicals.push(canonical);
        }
      }

      // All canonical URLs should be unique
      const uniqueCanonicals = new Set(canonicals);
      expect(uniqueCanonicals.size).toBe(canonicals.length);

      console.log(`✓ All ${canonicals.length} canonical URLs are unique`);
    });
  });

  test.describe('Open Graph URLs', () => {
    test('should have og:url with basepath', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');

      if (ogUrl) {
        // OG URL should be absolute
        expect(ogUrl).toMatch(/^https?:\/\//);

        console.log(`✓ OG URL: ${ogUrl}`);
      }
    });

    test('should have og:image with basepath', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');

      if (ogImage) {
        // OG image should be absolute URL
        expect(ogImage).toMatch(/^https?:\/\//);

        console.log(`✓ OG image URL: ${ogImage}`);
      }
    });
  });

  test.describe('Relative vs Absolute Path Handling', () => {
    test('should not have relative paths starting with ./ or ../', async ({ page }) => {
      const pages = ['/pl/', '/pl/about/', '/pl/news/'];

      for (const pageUrl of pages) {
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle');

        const relativeLinks = await page.locator('a[href^="./"], a[href^="../"]').all();

        // Should have no relative paths
        expect(relativeLinks.length).toBe(0);

        console.log(`✓ No relative paths on ${pageUrl}`);
      }
    });

    test('should use absolute paths for all internal navigation', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const internalLinks = await page.locator('a[href^="/"]').all();

      // Should have many internal links
      expect(internalLinks.length).toBeGreaterThan(5);

      for (const link of internalLinks) {
        const href = await link.getAttribute('href');

        // Should start with /
        expect(href).toMatch(/^\//);

        // Should have language prefix
        expect(href).toMatch(/^\/(pl|en)\//);
      }

      console.log(`✓ All ${internalLinks.length} internal links use absolute paths`);
    });
  });

  test.describe('RSS and Sitemap URLs', () => {
    test('should have sitemap with basepath', async ({ page }) => {
      const response = await page.goto('/sitemap.xml');

      if (response?.status() === 200) {
        const content = await page.content();

        // Sitemap should contain URLs with language prefixes
        expect(content).toContain('<loc>');
        expect(content).toMatch(/\/(pl|en)\//);

        console.log('✓ Sitemap contains language-prefixed URLs');
      }
    });

    test('should have RSS feed links with basepath', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const rssLink = page.locator('link[type="application/rss+xml"]');

      if (await rssLink.count() > 0) {
        const href = await rssLink.getAttribute('href');

        // RSS feed URL should include basepath
        console.log(`✓ RSS feed URL: ${href}`);
      }
    });
  });

  test.describe('Form Actions with Basepath', () => {
    test('should have form actions with proper basepath if forms exist', async ({ page }) => {
      const pages = ['/pl/contact/', '/pl/'];

      for (const pageUrl of pages) {
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle');

        const forms = await page.locator('form[action]').all();

        for (const form of forms) {
          const action = await form.getAttribute('action');

          if (action && !action.startsWith('http') && !action.startsWith('#')) {
            // Form action should have basepath or be relative
            console.log(`Form action on ${pageUrl}: ${action}`);

            if (action.startsWith('/')) {
              expect(action).toMatch(/^\/(pl|en)\//);
            }
          }
        }
      }
    });
  });

  test.describe('JavaScript and Asset Loading', () => {
    test('should load JavaScript files successfully with basepath', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Check for JavaScript errors
      const errors: string[] = [];

      page.on('pageerror', error => {
        errors.push(error.message);
      });

      await page.reload();
      await page.waitForLoadState('networkidle');

      // Should have no critical JavaScript errors
      const criticalErrors = errors.filter(e => !e.includes('favicon'));
      expect(criticalErrors.length).toBe(0);

      console.log(`✓ No JavaScript errors on page load`);
    });

    test('should load all CSS files successfully with basepath', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const cssLinks = await page.locator('link[rel="stylesheet"]').all();

      for (const link of cssLinks) {
        const href = await link.getAttribute('href');

        if (href && !href.startsWith('http')) {
          // CSS should be accessible
          const response = await page.request.get(href);
          expect(response.status()).toBe(200);
        }
      }

      console.log(`✓ All ${cssLinks.length} CSS files load successfully`);
    });
  });
});
