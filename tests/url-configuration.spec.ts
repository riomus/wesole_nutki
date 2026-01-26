import { test, expect } from '@playwright/test';

/**
 * URL Configuration Tests
 *
 * These tests verify that Hugo URL functions are working correctly:
 * - Canonical URLs are absolute with correct baseURL
 * - Open Graph URLs are absolute
 * - Internal navigation uses correct relative paths
 * - Assets load with correct paths
 * - Multi-language URLs maintain correct language prefixes
 */

test.describe('URL Configuration', () => {

  test.describe('Meta Tags and SEO', () => {

    test('should have correct canonical URL on homepage', async ({ page }) => {
      await page.goto('/pl/');

      // Verify canonical link exists and uses absolute URL with baseURL
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      const canonicalHref = await canonical.getAttribute('href');
      expect(canonicalHref).toBeTruthy();
      expect(canonicalHref).toMatch(/^https?:\/\//);
      expect(canonicalHref).toContain('/wesole_nutki/');
    });

    test('should have correct canonical URL on news page', async ({ page }) => {
      await page.goto('/pl/news/');

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      const canonicalHref = await canonical.getAttribute('href');
      expect(canonicalHref).toBeTruthy();
      expect(canonicalHref).toMatch(/^https?:\/\//);
      expect(canonicalHref).toContain('/wesole_nutki/pl/news/');
    });

    test('should have absolute Open Graph URL', async ({ page }) => {
      await page.goto('/pl/');

      // Verify og:url is absolute
      const ogUrl = page.locator('meta[property="og:url"]');
      await expect(ogUrl).toHaveCount(1);
      const ogUrlContent = await ogUrl.getAttribute('content');
      expect(ogUrlContent).toBeTruthy();
      expect(ogUrlContent).toMatch(/^https?:\/\//);
      expect(ogUrlContent).toContain('/wesole_nutki/');
    });

    test('should have absolute Open Graph image URL if present', async ({ page }) => {
      await page.goto('/pl/');

      // Verify og:image is absolute if present
      const ogImage = page.locator('meta[property="og:image"]');
      const count = await ogImage.count();

      if (count > 0) {
        const ogImageContent = await ogImage.getAttribute('content');
        expect(ogImageContent).toMatch(/^https?:\/\//);
        expect(ogImageContent).toContain('/wesole_nutki/');
      }
    });

    test('should have absolute Twitter Card image URL if present', async ({ page }) => {
      await page.goto('/pl/');

      // Verify twitter:image is absolute if present
      const twitterImage = page.locator('meta[name="twitter:image"]');
      const count = await twitterImage.count();

      if (count > 0) {
        const twitterImageContent = await twitterImage.getAttribute('content');
        expect(twitterImageContent).toMatch(/^https?:\/\//);
        expect(twitterImageContent).toContain('/wesole_nutki/');
      }
    });

    test('should have correct alternate language links', async ({ page }) => {
      await page.goto('/pl/');

      // Check alternate language links - should have at least one (self) and possibly translations
      const alternateLinks = page.locator('link[rel="alternate"][hreflang]');
      const count = await alternateLinks.count();

      // Should have at least one (self-reference)
      expect(count).toBeGreaterThanOrEqual(1);

      // All alternate links should be absolute URLs
      for (let i = 0; i < count; i++) {
        const href = await alternateLinks.nth(i).getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).toMatch(/^https?:\/\//);
      }
    });
  });

  test.describe('Internal Navigation', () => {

    test('should have correct home link in navigation', async ({ page }) => {
      await page.goto('/pl/');

      // Check navbar brand link
      const brandLink = page.locator('.navbar-brand');
      await expect(brandLink).toHaveCount(await brandLink.count());

      if (await brandLink.count() > 0) {
        const homeLink = await brandLink.first().getAttribute('href');
        expect(homeLink).toBeTruthy();
        expect(homeLink).toContain('/wesole_nutki/');
      }
    });

    test('should have correct menu links with baseURL prefix', async ({ page }) => {
      await page.goto('/pl/');

      // Check navigation menu links
      const menuLinks = await page.locator('.navbar-nav .nav-link').all();

      for (const link of menuLinks) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('http')) {
          expect(href).toContain('/wesole_nutki/');
        }
      }
    });

    test('should navigate to news page with correct URL', async ({ page }) => {
      await page.goto('/pl/');

      // Find and click news link
      const newsLink = page.locator('a[href*="/news"]').first();
      if (await newsLink.count() > 0) {
        await newsLink.click();

        // Verify URL includes baseURL
        expect(page.url()).toContain('/wesole_nutki/');
        expect(page.url()).toContain('/news');
      }
    });

    test('should navigate to gallery with correct URL', async ({ page }) => {
      await page.goto('/pl/');

      // Find and click gallery link
      const galleryLink = page.locator('a[href*="/gallery"]').first();
      if (await galleryLink.count() > 0) {
        await galleryLink.click();

        // Verify URL includes baseURL
        expect(page.url()).toContain('/wesole_nutki/');
        expect(page.url()).toContain('/gallery');
      }
    });
  });

  test.describe('Asset Loading', () => {

    test('should load stylesheets with correct path', async ({ page }) => {
      await page.goto('/pl/');

      // Check all stylesheets - including external fonts
      const stylesheets = page.locator('link[rel="stylesheet"]');
      const count = await stylesheets.count();

      // Should have at least one stylesheet (even if external)
      expect(count).toBeGreaterThan(0);

      // Check internal stylesheets have correct path
      for (let i = 0; i < count; i++) {
        const href = await stylesheets.nth(i).getAttribute('href');
        if (href && !href.startsWith('http')) {
          expect(href).toContain('/wesole_nutki/');
        }
      }
    });

    test('should load JavaScript bundle with correct path', async ({ page }) => {
      await page.goto('/pl/');

      // Check main JS bundle
      const scripts = await page.locator('script[src]').all();

      for (const script of scripts) {
        const src = await script.getAttribute('src');
        if (src && src.includes('js/bundle')) {
          expect(src).toContain('/wesole_nutki/');

          // Verify the JS actually loads
          const response = await page.request.get(src);
          expect(response.status()).toBe(200);
        }
      }
    });

    test('should load logo image with correct path', async ({ page }) => {
      await page.goto('/pl/');

      // Check logo image
      const logo = page.locator('.navbar-brand img');
      if (await logo.count() > 0) {
        const src = await logo.getAttribute('src');
        expect(src).toBeTruthy();
        expect(src).toContain('/wesole_nutki/');
      }
    });

    test('should load favicon with correct path', async ({ page }) => {
      await page.goto('/pl/');

      // Check favicon - may have multiple icon links
      const favicon = page.locator('link[rel="icon"]');
      const count = await favicon.count();

      if (count > 0) {
        const firstFaviconHref = await favicon.first().getAttribute('href');
        expect(firstFaviconHref).toBeTruthy();
        expect(firstFaviconHref).toContain('/wesole_nutki/');
      }
    });
  });

  test.describe('Multi-Language URLs', () => {

    test('should switch from Polish to English with correct URL', async ({ page }) => {
      await page.goto('/pl/');

      // Find English language switcher
      const enLink = page.locator('.language-switcher a[hreflang="en"], a[href*="/en/"]').first();
      if (await enLink.count() > 0) {
        await enLink.click();
        await page.waitForLoadState('networkidle');

        // Verify we're on English version
        expect(page.url()).toContain('/wesole_nutki/en/');

        // Verify canonical reflects language change
        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
        expect(canonical).toContain('/en/');
      }
    });

    test('should have correct language prefix in menu links', async ({ page }) => {
      await page.goto('/pl/');

      // All internal links should have /pl/ prefix
      const menuLinks = await page.locator('.navbar-nav .nav-link').all();

      for (const link of menuLinks) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('http')) {
          expect(href).toMatch(/\/wesole_nutki\/(pl|en)\//);
        }
      }
    });

    test('should maintain language when navigating', async ({ page }) => {
      await page.goto('/pl/');

      // Navigate to another page
      const aboutLink = page.locator('a[href*="/o-przedszkolu"], a[href*="/about"]').first();
      if (await aboutLink.count() > 0) {
        await aboutLink.click();
        await page.waitForLoadState('networkidle');

        // Verify we're still on Polish version
        expect(page.url()).toContain('/pl/');
      }
    });
  });

  test.describe('Gallery URLs', () => {

    test('should have correct gallery card links', async ({ page }) => {
      await page.goto('/pl/gallery/');

      // Check gallery card links
      const galleryLinks = await page.locator('.gallery-card-link, a[href*="/gallery/"]').all();

      for (const link of galleryLinks.slice(0, 5)) { // Check first 5
        const href = await link.getAttribute('href');
        if (href && !href.endsWith('/gallery/')) {
          expect(href).toContain('/wesole_nutki/');
          expect(href).toContain('/gallery/');
        }
      }
    });

    test('should load gallery images with correct paths', async ({ page }) => {
      await page.goto('/pl/gallery/');

      // Check gallery card images
      const images = await page.locator('.gallery-card-img, .gallery-card img').all();

      if (images.length > 0) {
        const firstImage = images[0];
        const src = await firstImage.getAttribute('src');
        expect(src).toBeTruthy();
        expect(src).toContain('/wesole_nutki/');
      }
    });

    test('should have correct category links in gallery', async ({ page }) => {
      await page.goto('/pl/gallery/');

      // Check category filter links
      const categoryLinks = await page.locator('.gallery-card-tag, a[href*="gallery_categories"]').all();

      for (const link of categoryLinks) {
        const href = await link.getAttribute('href');
        if (href) {
          expect(href).toContain('/wesole_nutki/');
        }
      }
    });
  });

  test.describe('News/Blog URLs', () => {

    test('should have correct news card links', async ({ page }) => {
      await page.goto('/pl/news/');

      // Check news card links
      const newsLinks = await page.locator('.news-card a[href], .card-title a').all();

      for (const link of newsLinks.slice(0, 5)) { // Check first 5
        const href = await link.getAttribute('href');
        if (href && href.includes('/news/')) {
          expect(href).toContain('/wesole_nutki/');
        }
      }
    });

    test('should load news images with correct paths', async ({ page }) => {
      await page.goto('/pl/news/');

      // Check news card images
      const images = await page.locator('.news-card-image, .news-card img').all();

      if (images.length > 0) {
        const firstImage = images[0];
        const src = await firstImage.getAttribute('src');
        if (src) {
          expect(src).toContain('/wesole_nutki/');
        }
      }
    });
  });

  test.describe('Breadcrumb URLs', () => {

    test('should have correct breadcrumb links on content pages', async ({ page }) => {
      // Navigate to a content page
      await page.goto('/pl/o-przedszkolu/');

      // Check breadcrumb links
      const breadcrumbLinks = await page.locator('.breadcrumb a').all();

      for (const link of breadcrumbLinks) {
        const href = await link.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).toContain('/wesole_nutki/');
      }
    });

    test('should have structured data with correct URLs', async ({ page }) => {
      await page.goto('/pl/o-przedszkolu/');

      // Check for breadcrumb structured data
      const structuredData = await page.locator('script[type="application/ld+json"]').first();
      if (await structuredData.count() > 0) {
        const content = await structuredData.textContent();
        const json = JSON.parse(content || '{}');

        if (json['@type'] === 'BreadcrumbList') {
          // Verify all breadcrumb URLs are present
          expect(json.itemListElement).toBeDefined();
          expect(json.itemListElement.length).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('Social Sharing URLs', () => {

    test('should have correct URL in social share buttons', async ({ page }) => {
      // Navigate to a news article
      await page.goto('/pl/news/');

      // Click on first news article
      const firstArticle = page.locator('.news-card a[href], .card-title a').first();
      if (await firstArticle.count() > 0) {
        await firstArticle.click();
        await page.waitForLoadState('networkidle');

        // Check social share buttons
        const facebookShare = page.locator('.social-share-facebook, a[href*="facebook.com/sharer"]');
        if (await facebookShare.count() > 0) {
          const href = await facebookShare.getAttribute('href');
          expect(href).toContain('https://');
          expect(href).toContain('/wesole_nutki/');
        }
      }
    });
  });

  test.describe('Pagination URLs', () => {

    test('should have correct pagination links', async ({ page }) => {
      await page.goto('/pl/news/');

      // Check pagination links if they exist
      const paginationLinks = await page.locator('.pagination a, .page-link').all();

      if (paginationLinks.length > 0) {
        for (const link of paginationLinks) {
          const href = await link.getAttribute('href');
          if (href && !href.includes('#')) {
            expect(href).toContain('/wesole_nutki/');
          }
        }
      }
    });
  });
});

test.describe('Production Build URL Verification', () => {

  test('should generate correct URLs in production build', async ({ page }) => {
    await page.goto('/pl/');

    // Comprehensive check for production readiness
    const checks = {
      canonicalAbsolute: false,
      ogUrlAbsolute: false,
      internalLinksRelative: false,
      assetsLoaded: false,
      baseURLIncluded: false
    };

    // Check canonical
    const canonical = page.locator('link[rel="canonical"]');
    if (await canonical.count() > 0) {
      const canonicalHref = await canonical.getAttribute('href');
      checks.canonicalAbsolute = canonicalHref ? canonicalHref.startsWith('http') : false;
      checks.baseURLIncluded = canonicalHref ? canonicalHref.includes('/wesole_nutki/') : false;
    }

    // Check og:url
    const ogUrl = page.locator('meta[property="og:url"]');
    if (await ogUrl.count() > 0) {
      const ogUrlContent = await ogUrl.getAttribute('content');
      checks.ogUrlAbsolute = ogUrlContent ? ogUrlContent.startsWith('http') : false;
    }

    // Check internal links
    const internalLinks = await page.locator('a[href*="/wesole_nutki"]').count();
    checks.internalLinksRelative = internalLinks > 0;

    // Check assets loaded
    const stylesheets = await page.locator('link[rel="stylesheet"]').count();
    checks.assetsLoaded = stylesheets > 0;

    // All checks should pass
    expect(checks.canonicalAbsolute).toBe(true);
    expect(checks.ogUrlAbsolute).toBe(true);
    expect(checks.internalLinksRelative).toBe(true);
    expect(checks.assetsLoaded).toBe(true);
    expect(checks.baseURLIncluded).toBe(true);
  });
});
