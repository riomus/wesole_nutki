import { test, expect } from '@playwright/test';
import { Selectors, Patterns, URLTestHelpers } from './helpers/url-test-helpers';

/**
 * Hugo URL Functions Validation Tests
 *
 * These tests verify that the Hugo site correctly implements URL best practices:
 * - Meta tags (canonical, og:url) use .Permalink (absolute URLs)
 * - Internal navigation uses relURL or .RelPermalink (relative with baseURL)
 * - Images use relURL (relative with baseURL)
 * - External links are not modified
 * - Pagination uses relURL
 *
 * The tests work with any baseURL configuration (root or subdirectory).
 */

test.describe('Hugo URL Functions Implementation', () => {

  test('should successfully load the homepage', async ({ page }) => {
    const response = await page.goto('/pl/');
    expect(response?.status()).toBe(200);
  });

  test('canonical URL should use .Permalink (absolute URL)', async ({ page }) => {
    await page.goto('/pl/');

    const canonicalURL = await URLTestHelpers.getCanonicalURL(page);

    expect(canonicalURL).toBeTruthy();
    expect(URLTestHelpers.isAbsoluteURL(canonicalURL)).toBe(true);
  });

  test('og:url meta tag should use .Permalink (absolute URL)', async ({ page }) => {
    await page.goto('/pl/');

    const ogURL = await URLTestHelpers.getOGURL(page);

    expect(ogURL).toBeTruthy();
    expect(URLTestHelpers.isAbsoluteURL(ogURL)).toBe(true);
  });

  test('og:image should use absURL when present', async ({ page }) => {
    await page.goto('/pl/');

    const ogImage = page.locator(Selectors.OG_IMAGE);
    const count = await ogImage.count();

    if (count > 0) {
      const content = await ogImage.getAttribute('content');
      expect(URLTestHelpers.isAbsoluteURL(content)).toBe(true);
    }
  });

  test('alternate language links should use .Permalink (absolute URLs)', async ({ page }) => {
    await page.goto('/pl/');

    const alternateLinks = await URLTestHelpers.getAlternateLinks(page);

    // Should have at least self-reference
    expect(alternateLinks.length).toBeGreaterThan(0);

    // All should be absolute URLs
    expect(URLTestHelpers.allMatch(alternateLinks, Patterns.ABSOLUTE_URL)).toBe(true);
  });

  test('internal navigation links should be relative (relURL)', async ({ page }) => {
    await page.goto('/pl/');

    const navLinks = await URLTestHelpers.getInternalNavLinks(page);

    if (navLinks.length > 0) {
      // All should be relative URLs
      expect(URLTestHelpers.allMatch(navLinks, Patterns.RELATIVE_URL)).toBe(true);

      // None should be fully qualified
      navLinks.forEach(link => {
        expect(URLTestHelpers.isAbsoluteURL(link)).toBe(false);
      });
    }
  });

  test('internal images should use relURL (relative paths)', async ({ page }) => {
    await page.goto('/pl/');

    const images = await URLTestHelpers.getInternalImages(page);

    if (images.length > 0) {
      // All should be relative URLs
      expect(URLTestHelpers.allMatch(images, Patterns.RELATIVE_URL)).toBe(true);
    }
  });

  test('CSS files should use .RelPermalink (relative paths)', async ({ page }) => {
    await page.goto('/pl/');

    const cssLinks = page.locator(Selectors.INTERNAL_STYLESHEETS);
    const count = await cssLinks.count();

    if (count > 0) {
      const firstHref = await cssLinks.first().getAttribute('href');
      expect(URLTestHelpers.isRelativeURL(firstHref)).toBe(true);
    }
  });

  test('favicon should use relURL (relative path)', async ({ page }) => {
    await page.goto('/pl/');

    const favicon = page.locator(Selectors.FAVICON);
    const count = await favicon.count();

    if (count > 0) {
      const href = await favicon.first().getAttribute('href');

      if (href && !href.startsWith('http')) {
        expect(URLTestHelpers.isRelativeURL(href)).toBe(true);
      }
    }
  });

  test('pagination links should use relURL (relative paths)', async ({ page }) => {
    const response = await page.goto('/pl/news/');

    if (response && response.status() === 200) {
      const paginationLinks = page.locator(Selectors.PAGINATION_LINKS);
      const count = await paginationLinks.count();

      if (count > 0) {
        for (let i = 0; i < Math.min(count, 3); i++) {
          const href = await paginationLinks.nth(i).getAttribute('href');

          if (href && !href.startsWith('#')) {
            expect(URLTestHelpers.isRelativeURL(href)).toBe(true);
          }
        }
      }
    }
  });

  test('RSS feed should contain absolute URLs (.Permalink)', async ({ page }) => {
    const response = await page.goto('/pl/index.xml');

    if (response && response.status() === 200) {
      const content = await page.content();

      // RSS feeds must use absolute URLs per RSS specification
      expect(content).toContain('<link>http');
    }
  });

  test('sitemap should contain absolute URLs (.Permalink)', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');

    if (response && response.status() === 200) {
      const content = await page.content();

      // Sitemaps must use absolute URLs per sitemap spec
      expect(content).toContain('<loc>http');
    }
  });

  test('gallery card links should use correct URL functions', async ({ page }) => {
    const response = await page.goto('/pl/gallery/');

    if (response && response.status() === 200) {
      const galleryLinks = page.locator(Selectors.GALLERY_LINKS);
      const count = await galleryLinks.count();

      if (count > 0) {
        const firstHref = await galleryLinks.first().getAttribute('href');
        expect(URLTestHelpers.isRelativeURL(firstHref)).toBe(true);
      }
    }
  });

  test('breadcrumb links should use correct URL functions', async ({ page }) => {
    const response = await page.goto('/pl/o-przedszkolu/');

    if (response && response.status() === 200) {
      const breadcrumbLinks = page.locator(Selectors.BREADCRUMB_LINKS);
      const count = await breadcrumbLinks.count();

      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const href = await breadcrumbLinks.nth(i).getAttribute('href');

          if (href) {
            expect(URLTestHelpers.isRelativeURL(href)).toBe(true);
          }
        }
      }
    }
  });

  test('external links should not be modified', async ({ page }) => {
    await page.goto('/pl/');

    const externalLinks = page.locator(Selectors.EXTERNAL_LINKS);
    const count = await externalLinks.count();

    if (count > 0) {
      const firstHref = await externalLinks.first().getAttribute('href');
      expect(URLTestHelpers.isAbsoluteURL(firstHref)).toBe(true);
    }
  });
});

test.describe('URL Configuration Validation', () => {

  test('verify canonifyURLs is set to false', async ({ page }) => {
    await page.goto('/pl/');

    // With canonifyURLs=false, internal links should be relative
    const internalLink = page.locator(Selectors.NAV_INTERNAL_LINKS).first();

    if (await internalLink.count() > 0) {
      const href = await internalLink.getAttribute('href');

      // Should be relative (not absolute)
      expect(URLTestHelpers.isRelativeURL(href)).toBe(true);
      expect(URLTestHelpers.isAbsoluteURL(href)).toBe(false);
    }
  });

  test('verify baseURL is used in meta tags', async ({ page }) => {
    await page.goto('/pl/');

    const canonicalURL = await URLTestHelpers.getCanonicalURL(page);
    const ogURL = await URLTestHelpers.getOGURL(page);

    // Both should use absolute URLs (baseURL)
    expect(URLTestHelpers.isAbsoluteURL(canonicalURL)).toBe(true);
    expect(URLTestHelpers.isAbsoluteURL(ogURL)).toBe(true);

    // They should match
    expect(canonicalURL).toBe(ogURL);
  });
});
