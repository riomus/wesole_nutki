import { test, expect } from '@playwright/test';

/**
 * URL Verification Tests
 *
 * These tests verify that Hugo URL configuration follows best practices:
 * - Canonical URLs use .Permalink (absolute URLs)
 * - Open Graph URLs use .Permalink (absolute URLs)
 * - Internal navigation uses .RelPermalink or relURL
 * - Assets use appropriate URL functions
 * - Multi-language URLs work correctly
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:1313';
const SUBDIRECTORY = '/wesole_nutki';
const EXPECTED_BASE = `${BASE_URL}${SUBDIRECTORY}`;

test.describe('URL Generation - Canonical URLs', () => {
  test('should have correct canonical URL on Polish homepage', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/`);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', `${EXPECTED_BASE}/pl/`);
  });

  test('should have correct canonical URL on English homepage', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/en/`);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', `${EXPECTED_BASE}/en/`);
  });

  test('should have correct canonical URL on Polish news article', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/news/`);

    // Find first article link
    const firstArticle = page.locator('.news-card a').first();
    await firstArticle.click();
    await page.waitForLoadState('networkidle');

    const canonical = page.locator('link[rel="canonical"]');
    const canonicalHref = await canonical.getAttribute('href');

    // Verify it starts with expected base and is an absolute URL
    expect(canonicalHref).toContain(`${EXPECTED_BASE}/pl/news/`);
    expect(canonicalHref).toMatch(/^https?:\/\//);
  });

  test('should have correct canonical URL on English about page', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/en/about/`);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', `${EXPECTED_BASE}/en/about/`);
  });
});

test.describe('URL Generation - Open Graph Meta Tags', () => {
  test('should have absolute og:url on Polish homepage', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/`);

    const ogUrl = page.locator('meta[property="og:url"]');
    const ogUrlContent = await ogUrl.getAttribute('content');

    expect(ogUrlContent).toBe(`${EXPECTED_BASE}/pl/`);
    expect(ogUrlContent).toMatch(/^https?:\/\//);
  });

  test('should have absolute og:url on English homepage', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/en/`);

    const ogUrl = page.locator('meta[property="og:url"]');
    const ogUrlContent = await ogUrl.getAttribute('content');

    expect(ogUrlContent).toBe(`${EXPECTED_BASE}/en/`);
    expect(ogUrlContent).toMatch(/^https?:\/\//);
  });

  test('should have absolute og:image with baseURL', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/`);

    const ogImage = page.locator('meta[property="og:image"]');

    if (await ogImage.count() > 0) {
      const ogImageContent = await ogImage.getAttribute('content');

      // Should be absolute URL
      expect(ogImageContent).toMatch(/^https?:\/\//);

      // Should include baseURL if it's a site asset
      if (!ogImageContent?.startsWith('http://') && !ogImageContent?.startsWith('https://external')) {
        expect(ogImageContent).toContain(EXPECTED_BASE);
      }
    }
  });

  test('should have absolute Twitter Card image with baseURL', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/`);

    const twitterImage = page.locator('meta[name="twitter:image"]');

    if (await twitterImage.count() > 0) {
      const twitterImageContent = await twitterImage.getAttribute('content');

      // Should be absolute URL
      expect(twitterImageContent).toMatch(/^https?:\/\//);

      // Should include baseURL if it's a site asset
      if (!twitterImageContent?.startsWith('http://') && !twitterImageContent?.startsWith('https://external')) {
        expect(twitterImageContent).toContain(EXPECTED_BASE);
      }
    }
  });
});

test.describe('URL Generation - Internal Navigation', () => {
  test('should have correct URLs in main navigation menu', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/`);

    const navLinks = page.locator('header nav a.nav-link');
    const count = await navLinks.count();

    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href');

      // Internal links should start with subdirectory or be relative
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        expect(href).toMatch(/^\/wesole_nutki\//);
      }
    }
  });

  test('should navigate correctly between pages', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/`);

    // Click on About link
    await page.click('a[href*="o-przedszkolu"]');
    await page.waitForLoadState('networkidle');

    // Should be on about page
    expect(page.url()).toContain('/o-przedszkolu');

    // Verify canonical URL is correct
    const canonical = page.locator('link[rel="canonical"]');
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toContain('/o-przedszkolu');
    expect(canonicalHref).toMatch(/^https?:\/\//);
  });

  test('should have correct breadcrumb URLs', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/news/`);

    // Click first article
    const firstArticle = page.locator('.news-card a').first();
    await firstArticle.click();
    await page.waitForLoadState('networkidle');

    // Check breadcrumb links
    const breadcrumbLinks = page.locator('.breadcrumb a');
    const count = await breadcrumbLinks.count();

    for (let i = 0; i < count; i++) {
      const href = await breadcrumbLinks.nth(i).getAttribute('href');

      // Should start with subdirectory
      if (href) {
        expect(href).toMatch(/^\/wesole_nutki\//);
      }
    }
  });
});

test.describe('URL Generation - Asset URLs', () => {
  test('should load CSS assets with correct baseURL', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/`);

    const stylesheets = page.locator('link[rel="stylesheet"]');
    const count = await stylesheets.count();

    for (let i = 0; i < count; i++) {
      const href = await stylesheets.nth(i).getAttribute('href');

      // Site assets should include baseURL
      if (href && !href.startsWith('http')) {
        expect(href).toMatch(/^\/wesole_nutki\//);
      }
    }
  });

  test('should load JavaScript assets with correct baseURL', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/`);

    const scripts = page.locator('script[src]');
    const count = await scripts.count();

    for (let i = 0; i < count; i++) {
      const src = await scripts.nth(i).getAttribute('src');

      // Site assets should include baseURL (exclude external scripts like Google Analytics)
      if (src && !src.startsWith('http')) {
        expect(src).toMatch(/^\/wesole_nutki\//);
      }
    }
  });

  test('should load favicon with correct baseURL', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/`);

    const favicon = page.locator('link[rel="icon"][type="image/svg+xml"]');
    const faviconHref = await favicon.getAttribute('href');

    if (faviconHref) {
      expect(faviconHref).toMatch(/^\/wesole_nutki\//);
    }
  });

  test('should load manifest with correct baseURL', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/`);

    const manifest = page.locator('link[rel="manifest"]');

    if (await manifest.count() > 0) {
      const manifestHref = await manifest.getAttribute('href');

      if (manifestHref) {
        expect(manifestHref).toMatch(/^\/wesole_nutki\//);
      }
    }
  });
});

test.describe('URL Generation - Multi-language Support', () => {
  test('should have correct alternate language links', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/`);

    const alternateLinks = page.locator('link[rel="alternate"][hreflang]');
    const count = await alternateLinks.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const href = await alternateLinks.nth(i).getAttribute('href');
      const hreflang = await alternateLinks.nth(i).getAttribute('hreflang');

      // Should be absolute URLs
      expect(href).toMatch(/^https?:\/\//);

      // Should include baseURL
      expect(href).toContain(EXPECTED_BASE);

      // Language-specific links should include language code
      if (hreflang !== 'x-default') {
        expect(href).toContain(`/${hreflang}/`);
      }
    }
  });

  test('should switch language correctly maintaining URL structure', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/`);

    // Click language switcher to English
    const enLink = page.locator('a[hreflang="en"]').first();
    await enLink.click();
    await page.waitForLoadState('networkidle');

    // Should be on English homepage
    expect(page.url()).toContain('/en/');

    // Verify canonical is correct
    const canonical = page.locator('link[rel="canonical"]');
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toContain('/en/');
    expect(canonicalHref).toMatch(/^https?:\/\//);
  });

  test('should maintain correct URLs when navigating between languages', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/o-przedszkolu/`);

    // Switch to English
    const enLink = page.locator('a[hreflang="en"]').first();
    await enLink.click();
    await page.waitForLoadState('networkidle');

    // Should be on English about page
    expect(page.url()).toContain('/en/about');

    // All navigation links should have /en/ prefix
    const navLinks = page.locator('header nav a.nav-link');
    const count = await navLinks.count();

    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href');

      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        expect(href).toContain('/en/');
      }
    }
  });
});

test.describe('URL Generation - Social Sharing', () => {
  test('should have absolute URLs in social sharing buttons', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/news/`);

    // Click first article
    const firstArticle = page.locator('.news-card a').first();
    await firstArticle.click();
    await page.waitForLoadState('networkidle');

    // Check social share buttons
    const facebookShare = page.locator('a[href*="facebook.com/sharer"]');

    if (await facebookShare.count() > 0) {
      const href = await facebookShare.getAttribute('href');

      // URL parameter should be encoded absolute URL
      expect(href).toContain('http');

      // Decode and check the URL
      const urlMatch = href?.match(/[?&]u=([^&]+)/);
      if (urlMatch) {
        const sharedUrl = decodeURIComponent(urlMatch[1]);
        expect(sharedUrl).toMatch(/^https?:\/\//);
        expect(sharedUrl).toContain(SUBDIRECTORY);
      }
    }
  });
});

test.describe('URL Generation - Gallery', () => {
  test('should have correct URLs in gallery listing', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/gallery/`);

    // Check gallery card links
    const galleryLinks = page.locator('.gallery-card a');
    const count = await galleryLinks.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const href = await galleryLinks.nth(i).getAttribute('href');

        if (href) {
          expect(href).toMatch(/^\/wesole_nutki\//);
          expect(href).toContain('/gallery/');
        }
      }
    }
  });

  test('should have correct image URLs in gallery', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/gallery/`);

    // Click first gallery
    const firstGallery = page.locator('.gallery-card a').first();

    if (await firstGallery.count() > 0) {
      await firstGallery.click();
      await page.waitForLoadState('networkidle');

      // Check gallery images
      const galleryImages = page.locator('.gallery-item img');
      const imageCount = await galleryImages.count();

      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const src = await galleryImages.nth(i).getAttribute('src');

        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
          expect(src).toMatch(/^\/wesole_nutki\//);
        }
      }
    }
  });
});

test.describe('URL Generation - Footer', () => {
  test('should have correct URLs in footer navigation', async ({ page }) => {
    await page.goto(`${BASE_URL}${SUBDIRECTORY}/pl/`);

    const footerLinks = page.locator('footer a[href^="/"]');
    const count = await footerLinks.count();

    for (let i = 0; i < count; i++) {
      const href = await footerLinks.nth(i).getAttribute('href');

      if (href && !href.startsWith('http')) {
        expect(href).toMatch(/^\/wesole_nutki\//);
      }
    }
  });
});
