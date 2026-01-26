import { test, expect } from '@playwright/test';

/**
 * Hugo URL Best Practices Validation Tests
 *
 * These tests verify that the Hugo site implements URL best practices:
 * - canonifyURLs is disabled (set to false)
 * - .Permalink used for SEO/social meta tags (absolute URLs)
 * - .RelPermalink or relURL used for internal navigation (relative URLs)
 * - absURL used for meta images and structured data
 * - External links remain untouched
 * - No hardcoded domain URLs in output
 */

test.describe('Hugo URL Best Practices', () => {

  test.describe('Configuration Validation', () => {

    test('should have canonifyURLs disabled (internal links are relative)', async ({ page }) => {
      await page.goto('/pl/');

      // With canonifyURLs=false, internal navigation links should be relative
      const internalLink = page.locator('nav a[href^="/"]').first();

      if (await internalLink.count() > 0) {
        const href = await internalLink.getAttribute('href');

        // Should be relative path starting with /
        expect(href).toBeTruthy();
        expect(href).toMatch(/^\/wesole_nutki\//);

        // Should NOT be an absolute URL
        expect(href).not.toMatch(/^https?:\/\//);
      }
    });

    test('should have baseURL configured correctly', async ({ page }) => {
      await page.goto('/pl/');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');

      // Canonical should include the baseURL
      expect(canonical).toBeTruthy();
      expect(canonical).toContain('/wesole_nutki/');

      // Should be absolute
      expect(canonical).toMatch(/^https?:\/\//);
    });

    test('should not have hardcoded domain URLs in HTML', async ({ page }) => {
      await page.goto('/pl/');

      const html = await page.content();

      // Check that there are no hardcoded localhost URLs in production
      // (except in meta tags where they should be absolute)
      const navSection = html.match(/<nav[\s\S]*?<\/nav>/);
      if (navSection && navSection[0]) {
        // Navigation should not have absolute URLs to same domain
        expect(navSection[0]).not.toMatch(/href="https?:\/\/localhost/);
      }
    });
  });

  test.describe('.Permalink Usage Validation', () => {

    test('canonical link should use .Permalink (absolute URL)', async ({ page }) => {
      await page.goto('/pl/');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');

      expect(canonical).toBeTruthy();
      expect(canonical).toMatch(/^https?:\/\//);

      // Parse URL to check structure
      const url = new URL(canonical!);
      expect(url.protocol).toMatch(/^https?:$/);
      expect(url.pathname).toContain('/wesole_nutki/');
      expect(url.pathname).toContain('/pl/');
    });

    test('og:url should use .Permalink (absolute URL)', async ({ page }) => {
      await page.goto('/pl/');

      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');

      expect(ogUrl).toBeTruthy();
      expect(ogUrl).toMatch(/^https?:\/\//);

      const url = new URL(ogUrl!);
      expect(url.pathname).toContain('/wesole_nutki/');
    });

    test('alternate language links should use .Permalink (absolute URLs)', async ({ page }) => {
      await page.goto('/pl/');

      const alternateLinks = await page.locator('link[rel="alternate"][hreflang]').all();

      expect(alternateLinks.length).toBeGreaterThan(0);

      for (const link of alternateLinks) {
        const href = await link.getAttribute('href');
        expect(href).toMatch(/^https?:\/\//);
      }
    });

    test('RSS feed item links should be absolute (.Permalink)', async ({ page }) => {
      const response = await page.goto('/pl/index.xml');

      if (response && response.status() === 200) {
        const content = await page.content();

        // Extract item links - should all be absolute
        const linkMatches = content.matchAll(/<item>[\s\S]*?<link>(.*?)<\/link>/g);
        for (const match of linkMatches) {
          const link = match[1];
          expect(link).toMatch(/^https?:\/\//);
        }
      }
    });
  });

  test.describe('.RelPermalink Usage Validation', () => {

    test('navigation menu links should use .RelPermalink (relative paths)', async ({ page }) => {
      await page.goto('/pl/');

      const menuLinks = await page.locator('.navbar-nav .nav-link[href]').all();

      for (const link of menuLinks) {
        const href = await link.getAttribute('href');

        if (href && href.startsWith('/') && !href.startsWith('//')) {
          // Should be relative
          expect(href).not.toMatch(/^https?:\/\//);

          // Should include baseURL path
          if (!href.startsWith('/#')) {
            expect(href).toMatch(/^\/wesole_nutki\//);
          }
        }
      }
    });

    test('breadcrumb links should use .RelPermalink (relative paths)', async ({ page }) => {
      await page.goto('/pl/o-przedszkolu/');

      const breadcrumbLinks = await page.locator('.breadcrumb a[href]').all();

      for (const link of breadcrumbLinks) {
        const href = await link.getAttribute('href');

        if (href) {
          expect(href).not.toMatch(/^https?:\/\//);
          expect(href).toMatch(/^\/wesole_nutki\//);
        }
      }
    });

    test('news card links should use .RelPermalink (relative paths)', async ({ page }) => {
      await page.goto('/pl/news/');

      const newsLinks = await page.locator('.news-card a[href]').all();

      for (const link of newsLinks.slice(0, 5)) {
        const href = await link.getAttribute('href');

        if (href && href.includes('/news/')) {
          expect(href).not.toMatch(/^https?:\/\//);
          expect(href).toMatch(/^\/wesole_nutki\//);
        }
      }
    });

    test('gallery card links should use .RelPermalink (relative paths)', async ({ page }) => {
      await page.goto('/pl/gallery/');

      const galleryLinks = await page.locator('.gallery-card a[href], a[href*="/gallery/"]').all();

      for (const link of galleryLinks.slice(0, 5)) {
        const href = await link.getAttribute('href');

        if (href && !href.endsWith('/gallery/')) {
          expect(href).not.toMatch(/^https?:\/\//);
          expect(href).toMatch(/^\/wesole_nutki\//);
        }
      }
    });

    test('pagination links should use .RelPermalink (relative paths)', async ({ page }) => {
      await page.goto('/pl/news/');

      const paginationLinks = await page.locator('.pagination a[href], .page-link[href]').all();

      for (const link of paginationLinks) {
        const href = await link.getAttribute('href');

        if (href && !href.startsWith('#')) {
          expect(href).not.toMatch(/^https?:\/\//);
        }
      }
    });
  });

  test.describe('relURL Usage Validation', () => {

    test('logo image should use relURL (relative path)', async ({ page }) => {
      await page.goto('/pl/');

      const logo = page.locator('.navbar-brand img').first();

      if (await logo.count() > 0) {
        const src = await logo.getAttribute('src');

        expect(src).toBeTruthy();
        expect(src).not.toMatch(/^https?:\/\//);
        expect(src).toMatch(/^\/wesole_nutki\//);
      }
    });

    test('favicon should use relURL (relative path)', async ({ page }) => {
      await page.goto('/pl/');

      const favicon = page.locator('link[rel="icon"]').first();

      if (await favicon.count() > 0) {
        const href = await favicon.getAttribute('href');

        if (href && !href.startsWith('http')) {
          expect(href).not.toMatch(/^https?:\/\//);
          expect(href).toMatch(/^\/wesole_nutki\//);
        }
      }
    });

    test('CSS files should use relURL or .RelPermalink', async ({ page }) => {
      await page.goto('/pl/');

      const cssLinks = await page.locator('link[rel="stylesheet"][href^="/"]').all();

      for (const link of cssLinks) {
        const href = await link.getAttribute('href');

        if (href) {
          expect(href).not.toMatch(/^https?:\/\//);
          expect(href).toMatch(/^\/wesole_nutki\//);
        }
      }
    });

    test('JavaScript files should use relURL or .RelPermalink', async ({ page }) => {
      await page.goto('/pl/');

      const scripts = await page.locator('script[src^="/"]').all();

      for (const script of scripts) {
        const src = await script.getAttribute('src');

        if (src) {
          expect(src).not.toMatch(/^https?:\/\//);
          expect(src).toMatch(/^\/wesole_nutki\//);
        }
      }
    });
  });

  test.describe('absURL Usage Validation', () => {

    test('og:image should use absURL (absolute URL)', async ({ page }) => {
      await page.goto('/pl/');

      const ogImage = page.locator('meta[property="og:image"]');

      if (await ogImage.count() > 0) {
        const content = await ogImage.getAttribute('content');

        expect(content).toBeTruthy();
        expect(content).toMatch(/^https?:\/\//);
        expect(content).toContain('/wesole_nutki/');
      }
    });

    test('twitter:image should use absURL (absolute URL)', async ({ page }) => {
      await page.goto('/pl/');

      const twitterImage = page.locator('meta[name="twitter:image"]');

      if (await twitterImage.count() > 0) {
        const content = await twitterImage.getAttribute('content');

        expect(content).toBeTruthy();
        expect(content).toMatch(/^https?:\/\//);
        expect(content).toContain('/wesole_nutki/');
      }
    });

    test('structured data images should use absURL', async ({ page }) => {
      await page.goto('/pl/');

      const structuredData = await page.locator('script[type="application/ld+json"]').all();

      for (const script of structuredData) {
        const content = await script.textContent();
        if (content) {
          const json = JSON.parse(content);

          // Check for image URLs in schema
          if (json.image) {
            const imageUrl = typeof json.image === 'string' ? json.image : json.image.url;
            if (imageUrl) {
              expect(imageUrl).toMatch(/^https?:\/\//);
            }
          }

          if (json.logo) {
            const logoUrl = typeof json.logo === 'string' ? json.logo : json.logo.url;
            if (logoUrl) {
              expect(logoUrl).toMatch(/^https?:\/\//);
            }
          }
        }
      }
    });
  });

  test.describe('External Links Validation', () => {

    test('external links should remain absolute and untouched', async ({ page }) => {
      await page.goto('/pl/');

      const externalLinks = await page.locator('a[href^="http"]').all();

      for (const link of externalLinks.slice(0, 5)) {
        const href = await link.getAttribute('href');

        if (href) {
          // Should be absolute
          expect(href).toMatch(/^https?:\/\//);

          // Should not be modified by Hugo URL functions
          // (external links keep their original URLs)
          const url = new URL(href);
          expect(url.protocol).toMatch(/^https?:$/);
        }
      }
    });

    test('external CDN links should not be modified', async ({ page }) => {
      await page.goto('/pl/');

      // Check for common CDN patterns
      const cdnLinks = await page.locator('link[href*="cdn"], link[href*="googleapis"]').all();

      for (const link of cdnLinks) {
        const href = await link.getAttribute('href');

        if (href) {
          expect(href).toMatch(/^https?:\/\//);
          // Should not contain our baseURL
          expect(href).not.toContain('/wesole_nutki/');
        }
      }
    });

    test('social share links should preserve external URLs', async ({ page }) => {
      await page.goto('/pl/news/');

      const firstArticle = page.locator('.news-card a').first();
      if (await firstArticle.count() > 0) {
        await firstArticle.click();
        await page.waitForLoadState('networkidle');

        // Check Facebook share link
        const fbShare = page.locator('a[href*="facebook.com"]');
        if (await fbShare.count() > 0) {
          const href = await fbShare.getAttribute('href');
          expect(href).toMatch(/^https?:\/\/.*facebook\.com/);
        }

        // Check Twitter share link
        const twitterShare = page.locator('a[href*="twitter.com"], a[href*="x.com"]');
        if (await twitterShare.count() > 0) {
          const href = await twitterShare.getAttribute('href');
          expect(href).toMatch(/^https?:\/\/.*(twitter|x)\.com/);
        }
      }
    });
  });

  test.describe('Multi-Language URL Functions', () => {

    test('language switcher should maintain URL functions across languages', async ({ page }) => {
      await page.goto('/pl/news/');

      // Get canonical on Polish page
      const plCanonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(plCanonical).toContain('/pl/');

      // Switch to English
      const enLink = page.locator('.language-switcher a[hreflang="en"]').first();
      if (await enLink.count() > 0) {
        await enLink.click();
        await page.waitForLoadState('networkidle');

        // Get canonical on English page
        const enCanonical = await page.locator('link[rel="canonical"]').getAttribute('href');
        expect(enCanonical).toContain('/en/');

        // Both should be absolute
        expect(plCanonical).toMatch(/^https?:\/\//);
        expect(enCanonical).toMatch(/^https?:\/\//);
      }
    });

    test('alternate links should reference other language versions correctly', async ({ page }) => {
      await page.goto('/pl/');

      const alternateLinks = await page.locator('link[rel="alternate"][hreflang]').all();

      let hasPolish = false;
      let hasEnglish = false;

      for (const link of alternateLinks) {
        const hreflang = await link.getAttribute('hreflang');
        const href = await link.getAttribute('href');

        if (hreflang === 'pl' && href) {
          hasPolish = true;
          expect(href).toContain('/pl/');
          expect(href).toMatch(/^https?:\/\//);
        }

        if (hreflang === 'en' && href) {
          hasEnglish = true;
          expect(href).toContain('/en/');
          expect(href).toMatch(/^https?:\/\//);
        }
      }

      // Should have references to both languages
      expect(hasPolish || hasEnglish).toBe(true);
    });

    test('RSS feeds should be language-specific', async ({ page }) => {
      // Polish RSS
      let response = await page.goto('/pl/index.xml');
      if (response && response.status() === 200) {
        const plContent = await page.content();
        expect(plContent).toContain('/pl/');
      }

      // English RSS
      response = await page.goto('/en/index.xml');
      if (response && response.status() === 200) {
        const enContent = await page.content();
        expect(enContent).toContain('/en/');
      }
    });
  });

  test.describe('Asset Optimization with URL Functions', () => {

    test('processed images should use .RelPermalink', async ({ page }) => {
      await page.goto('/pl/gallery/');

      const images = await page.locator('.gallery-card img[src]').all();

      if (images.length > 0) {
        const firstImg = images[0];
        const src = await firstImg.getAttribute('src');

        expect(src).toBeTruthy();

        // Processed images should be relative
        if (src && src.startsWith('/')) {
          expect(src).toMatch(/^\/wesole_nutki\//);
        }
      }
    });

    test('bundled CSS should use .RelPermalink with fingerprinting', async ({ page }) => {
      await page.goto('/pl/');

      const cssLinks = await page.locator('link[rel="stylesheet"][href*="css"]').all();
      let foundBundle = false;

      for (const link of cssLinks) {
        const href = await link.getAttribute('href');

        if (href && (href.includes('bundle') || href.includes('.min.'))) {
          foundBundle = true;

          // Should be relative
          expect(href).not.toMatch(/^https?:\/\//);
          expect(href).toMatch(/^\/wesole_nutki\//);

          // Should be fingerprinted
          expect(href).toMatch(/\.[a-f0-9]{8,}\.css/);
        }
      }

      expect(foundBundle).toBe(true);
    });

    test('bundled JS should use .RelPermalink with fingerprinting', async ({ page }) => {
      await page.goto('/pl/');

      const scripts = await page.locator('script[src*="js"]').all();

      for (const script of scripts) {
        const src = await script.getAttribute('src');

        if (src && (src.includes('bundle') || src.includes('.min.')) && src.startsWith('/')) {
          // Should be relative
          expect(src).not.toMatch(/^https?:\/\//);
          expect(src).toMatch(/^\/wesole_nutki\//);
        }
      }
    });
  });

  test.describe('URL Function Consistency', () => {

    test('same URL function should produce consistent output', async ({ page }) => {
      await page.goto('/pl/');

      // Get canonical URL
      const canonical1 = await page.locator('link[rel="canonical"]').getAttribute('href');

      // Reload page
      await page.reload();

      // Get canonical URL again
      const canonical2 = await page.locator('link[rel="canonical"]').getAttribute('href');

      // Should be identical
      expect(canonical1).toBe(canonical2);
    });

    test('navigation links should be consistent across pages', async ({ page }) => {
      await page.goto('/pl/');

      const homeLink1 = await page.locator('.navbar-brand').getAttribute('href');

      await page.goto('/pl/news/');

      const homeLink2 = await page.locator('.navbar-brand').getAttribute('href');

      // Home link should be the same on all pages
      expect(homeLink1).toBe(homeLink2);
    });

    test('baseURL should be consistent in all meta tags', async ({ page }) => {
      await page.goto('/pl/');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');

      // Both should use the same baseURL
      const canonicalBase = new URL(canonical!).origin + '/wesole_nutki/';
      const ogUrlBase = new URL(ogUrl!).origin + '/wesole_nutki/';

      expect(canonicalBase).toBe(ogUrlBase);
    });
  });
});
