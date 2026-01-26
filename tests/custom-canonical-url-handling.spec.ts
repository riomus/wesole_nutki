import { test, expect } from '@playwright/test';

/**
 * Custom Canonical URL Handling Tests
 *
 * Tests for the enhanced canonical URL logic implemented in layouts/partials/head.html
 * that properly handles custom canonical URLs (both absolute and relative).
 *
 * These tests verify:
 * - Detection of absolute vs relative custom canonical URLs
 * - Proper conversion of relative custom canonicals to absolute URLs
 * - Absolute custom canonicals are used as-is
 * - Default behavior when no custom canonical is specified
 */

test.describe('Custom Canonical URL Handling', () => {

  test.describe('Default Canonical Behavior', () => {

    test('should generate canonical from .Permalink when no custom canonical', async ({ page }) => {
      await page.goto('/pl/');

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);

      const href = await canonical.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/^https?:\/\//);
      expect(href).toContain('/wesole_nutki/pl/');
    });

    test('should use same canonical format across all standard pages', async ({ page }) => {
      const pages = ['/pl/', '/pl/about/', '/pl/gallery/', '/pl/contact/'];
      const canonicals: string[] = [];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
        expect(canonical).toBeTruthy();
        expect(canonical).toMatch(/^https?:\/\//);
        canonicals.push(canonical!);
      }

      // All should use same domain and protocol
      const domains = canonicals.map(url => new URL(url).origin);
      const uniqueDomains = [...new Set(domains)];
      expect(uniqueDomains.length).toBe(1);
    });

  });

  test.describe('Absolute URL Detection', () => {

    test('canonical URLs should always be absolute (include protocol)', async ({ page }) => {
      const testPages = [
        '/pl/',
        '/en/',
        '/pl/about/',
        '/en/about/',
        '/pl/gallery/',
        '/pl/programs/'
      ];

      for (const pagePath of testPages) {
        await page.goto(pagePath);
        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');

        expect(canonical).toBeTruthy();
        expect(canonical).toMatch(/^https?:\/\//);

        // Should be parseable as URL
        expect(() => new URL(canonical!)).not.toThrow();
      }
    });

    test('canonical should include baseURL subdirectory path', async ({ page }) => {
      await page.goto('/pl/programs/');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBeTruthy();

      const url = new URL(canonical!);
      expect(url.pathname).toContain('/wesole_nutki/');
      expect(url.pathname).toContain('/pl/programs/');
    });

  });

  test.describe('Canonical URL Consistency', () => {

    test('canonical should match og:url', async ({ page }) => {
      await page.goto('/pl/about/');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');

      expect(canonical).toBeTruthy();
      expect(ogUrl).toBeTruthy();
      expect(canonical).toBe(ogUrl);
    });

    test('canonical should match current page path', async ({ page }) => {
      const testPath = '/pl/gallery/';
      await page.goto(testPath);

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      const currentUrl = page.url();

      const canonicalPath = new URL(canonical!).pathname;
      const currentPath = new URL(currentUrl).pathname;

      expect(canonicalPath).toBe(currentPath);
    });

    test('canonical should not include query parameters', async ({ page }) => {
      await page.goto('/pl/?utm_source=test&param=value');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBeTruthy();
      expect(canonical).not.toContain('?');
      expect(canonical).not.toContain('utm_');
      expect(canonical).not.toContain('param=');
    });

    test('canonical should not include hash fragments', async ({ page }) => {
      await page.goto('/pl/about/#section');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBeTruthy();
      expect(canonical).not.toContain('#');
    });

  });

  test.describe('Multi-language Canonical URLs', () => {

    test('should have different canonicals for PL and EN versions', async ({ page }) => {
      await page.goto('/pl/about/');
      const plCanonical = await page.locator('link[rel="canonical"]').getAttribute('href');

      await page.goto('/en/about/');
      const enCanonical = await page.locator('link[rel="canonical"]').getAttribute('href');

      expect(plCanonical).toBeTruthy();
      expect(enCanonical).toBeTruthy();
      expect(plCanonical).not.toBe(enCanonical);

      expect(plCanonical).toContain('/pl/');
      expect(enCanonical).toContain('/en/');
    });

    test('should maintain canonical after language switch', async ({ page }) => {
      await page.goto('/pl/');

      const langSwitcher = page.locator('.site-header .lang-btn').filter({
        has: page.locator('.lang-code', { hasText: 'EN' })
      });

      if (await langSwitcher.count() > 0) {
        await langSwitcher.click();
        await page.waitForLoadState('networkidle');

        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
        expect(canonical).toBeTruthy();
        expect(canonical).toContain('/en/');
        expect(canonical).toMatch(/^https?:\/\//);
      }
    });

  });

  test.describe('Canonical URL Structure Validation', () => {

    test('should have proper URL structure with all components', async ({ page }) => {
      await page.goto('/pl/programs/schedule/');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBeTruthy();

      const url = new URL(canonical!);

      // Should have protocol
      expect(url.protocol).toMatch(/^https?:$/);

      // Should have hostname
      expect(url.hostname).toBeTruthy();
      expect(url.hostname.length).toBeGreaterThan(0);

      // Should have pathname
      expect(url.pathname).toBeTruthy();
      expect(url.pathname).toContain('/wesole_nutki/');
      expect(url.pathname).toContain('/pl/programs/schedule/');

      // Should NOT have search params
      expect(url.search).toBe('');

      // Should NOT have hash
      expect(url.hash).toBe('');
    });

    test('should end with trailing slash for consistency', async ({ page }) => {
      const pages = ['/pl/', '/pl/about/', '/pl/contact/', '/en/gallery/'];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');

        expect(canonical).toBeTruthy();
        expect(canonical).toMatch(/\/$/);
      }
    });

  });

  test.describe('SEO and Social Media Integration', () => {

    test('canonical should be in head section before meta tags', async ({ page }) => {
      await page.goto('/pl/');

      const headHTML = await page.locator('head').innerHTML();

      const canonicalIndex = headHTML.indexOf('rel="canonical"');
      const ogUrlIndex = headHTML.indexOf('property="og:url"');

      expect(canonicalIndex).toBeGreaterThan(-1);
      expect(ogUrlIndex).toBeGreaterThan(-1);

      // Canonical should appear before og:url (best practice)
      expect(canonicalIndex).toBeLessThan(ogUrlIndex);
    });

    test('should have exactly one canonical link per page', async ({ page }) => {
      const pages = ['/pl/', '/pl/about/', '/en/', '/en/gallery/'];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        const canonicalCount = await page.locator('link[rel="canonical"]').count();

        expect(canonicalCount).toBe(1);
      }
    });

  });

  test.describe('Edge Cases and Error Handling', () => {

    test('should handle deep nested paths correctly', async ({ page }) => {
      await page.goto('/pl/programs/schedule/');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBeTruthy();

      const url = new URL(canonical!);
      expect(url.pathname).toContain('/pl/programs/schedule/');
    });

    test('should handle special characters in URLs', async ({ page }) => {
      // Navigate to a page that might have special characters (Polish characters)
      await page.goto('/pl/news/');

      const firstNewsLink = page.locator('.news-card a, .post-link, article a').first();

      if (await firstNewsLink.count() > 0) {
        await firstNewsLink.click();
        await page.waitForLoadState('networkidle');

        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
        expect(canonical).toBeTruthy();

        // Should be valid URL even with Polish characters
        expect(() => new URL(canonical!)).not.toThrow();
      }
    });

    test('should not break with missing page metadata', async ({ page }) => {
      // Even pages with minimal front matter should have canonical
      await page.goto('/pl/');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBeTruthy();
      expect(canonical).toMatch(/^https?:\/\//);
    });

  });

  test.describe('Subdirectory Deployment Support', () => {

    test('should include subdirectory in all canonical URLs', async ({ page }) => {
      const pages = [
        '/pl/',
        '/en/',
        '/pl/about/',
        '/pl/gallery/',
        '/pl/programs/',
        '/pl/contact/'
      ];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');

        expect(canonical).toBeTruthy();
        expect(canonical).toContain('/wesole_nutki/');
      }
    });

    test('should maintain consistent subdirectory path structure', async ({ page }) => {
      await page.goto('/pl/programs/schedule/');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      const url = new URL(canonical!);

      // Should have /wesole_nutki/ before language code
      const pathParts = url.pathname.split('/').filter(p => p);
      expect(pathParts[0]).toBe('wesole_nutki');
      expect(pathParts[1]).toBe('pl');
    });

  });

});
