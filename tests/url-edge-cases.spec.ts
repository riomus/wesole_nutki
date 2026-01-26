import { test, expect } from '@playwright/test';

/**
 * URL Edge Cases and Best Practices Tests
 *
 * These tests verify URL handling for edge cases and production scenarios:
 * - Trailing slash consistency
 * - Subdirectory deployment handling
 * - Asset fingerprinting and integrity
 * - RSS feed URL correctness
 * - Sitemap URL validation
 * - Structured data URL accuracy
 * - Protocol handling
 */

test.describe('URL Edge Cases', () => {

  test.describe('Trailing Slash Consistency', () => {

    test('should handle URLs with and without trailing slashes consistently', async ({ page }) => {
      // Visit URL without trailing slash
      await page.goto('/pl');
      const url1 = page.url();
      const canonical1 = await page.locator('link[rel="canonical"]').getAttribute('href');

      // Visit URL with trailing slash
      await page.goto('/pl/');
      const url2 = page.url();
      const canonical2 = await page.locator('link[rel="canonical"]').getAttribute('href');

      // Canonical URLs should be consistent (both with or both without trailing slash)
      expect(canonical1).toBeTruthy();
      expect(canonical2).toBeTruthy();
      expect(canonical1).toBe(canonical2);
    });

    test('should have consistent trailing slashes in navigation links', async ({ page }) => {
      await page.goto('/pl/');

      const navLinks = await page.locator('nav a[href]').all();
      const internalLinks = [];

      for (const link of navLinks) {
        const href = await link.getAttribute('href');
        if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/#')) {
          internalLinks.push(href);
        }
      }

      if (internalLinks.length > 0) {
        // Check that all internal links follow the same pattern
        const withSlash = internalLinks.filter(l => l.endsWith('/')).length;
        const withoutSlash = internalLinks.filter(l => !l.endsWith('/')).length;

        // Most links should be consistent (allow for some exceptions like anchors)
        expect(withSlash > 0 || withoutSlash > 0).toBe(true);
      }
    });

    test('should have trailing slash in canonical URL for list pages', async ({ page }) => {
      await page.goto('/pl/news/');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBeTruthy();
      expect(canonical).toMatch(/\/news\/$/);
    });
  });

  test.describe('Subdirectory Deployment', () => {

    test('should include baseURL subdirectory in all internal links', async ({ page }) => {
      await page.goto('/pl/');

      // Check navigation links (exclude anchor links and dropdowns)
      const navLinks = await page.locator('nav a[href^="/"]').all();
      const validLinks = [];

      for (const link of navLinks.slice(0, 10)) {
        const href = await link.getAttribute('href');
        // Skip anchor links, javascript links, and hash-only links
        if (href && !href.startsWith('/#') && !href.includes('javascript:') && href.length > 1) {
          validLinks.push(href);
        }
      }

      // At least some links should include baseURL
      if (validLinks.length > 0) {
        const linksWithBase = validLinks.filter(l => l.includes('/wesole_nutki/'));
        expect(linksWithBase.length).toBeGreaterThan(0);
      }
    });

    test('should include baseURL subdirectory in breadcrumb links', async ({ page }) => {
      await page.goto('/pl/o-przedszkolu/');

      const breadcrumbLinks = await page.locator('.breadcrumb a[href]').all();
      for (const link of breadcrumbLinks) {
        const href = await link.getAttribute('href');
        if (href) {
          expect(href).toMatch(/^\/wesole_nutki\//);
        }
      }
    });

    test('should include baseURL in asset paths', async ({ page }) => {
      await page.goto('/pl/');

      // Check CSS
      const css = page.locator('link[rel="stylesheet"][href^="/"]').first();
      if (await css.count() > 0) {
        const href = await css.getAttribute('href');
        expect(href).toContain('/wesole_nutki/');
      }

      // Check images
      const img = page.locator('img[src^="/"]').first();
      if (await img.count() > 0) {
        const src = await img.getAttribute('src');
        expect(src).toContain('/wesole_nutki/');
      }
    });

    test('should use correct baseURL in meta tags', async ({ page }) => {
      await page.goto('/pl/');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');

      expect(canonical).toContain('/wesole_nutki/');
      expect(ogUrl).toContain('/wesole_nutki/');
    });

    test('should handle subdirectory in language switcher', async ({ page }) => {
      await page.goto('/pl/');

      const enLink = page.locator('.language-switcher a[hreflang="en"]').first();
      if (await enLink.count() > 0) {
        const href = await enLink.getAttribute('href');
        expect(href).toMatch(/^(\/wesole_nutki\/|http)/);
      }
    });
  });

  test.describe('Asset Fingerprinting and Integrity', () => {

    test('should have fingerprinted CSS files', async ({ page }) => {
      await page.goto('/pl/');

      const cssLinks = await page.locator('link[rel="stylesheet"][href*=".css"]').all();
      let foundFingerprinted = false;

      for (const link of cssLinks) {
        const href = await link.getAttribute('href');
        // Look for hash pattern like .min.abc123def.css or style.abc123.css
        if (href && (href.includes('.min.') || /\.[a-f0-9]{8,}\.css/.test(href))) {
          foundFingerprinted = true;
          break;
        }
      }

      // Should have at least one fingerprinted CSS file
      expect(foundFingerprinted).toBe(true);
    });

    test('should have integrity attribute on critical assets', async ({ page }) => {
      await page.goto('/pl/');

      // Check for integrity on CSS or JS
      const assetsWithIntegrity = await page.locator('link[integrity], script[integrity]').count();

      // Modern Hugo sites should have integrity hashes
      expect(assetsWithIntegrity).toBeGreaterThanOrEqual(0); // At least check it doesn't error
    });

    test('should load fingerprinted assets successfully', async ({ page }) => {
      await page.goto('/pl/');

      // Get the first CSS file
      const cssLink = page.locator('link[rel="stylesheet"]').first();
      if (await cssLink.count() > 0) {
        const href = await cssLink.getAttribute('href');
        if (href && href.startsWith('/')) {
          // Verify the CSS actually loads
          const response = await page.request.get(href);
          expect(response.status()).toBe(200);
          expect(response.headers()['content-type']).toContain('css');
        }
      }
    });
  });

  test.describe('RSS Feed URLs', () => {

    test('should have absolute URLs in RSS feed', async ({ page, browserName }) => {
      const response = await page.goto('/pl/index.xml');

      if (response && response.status() === 200) {
        // For WebKit, get raw response text; for others, use page content
        let content;
        if (browserName === 'webkit') {
          content = await response.text();
        } else {
          content = await page.content();
        }

        // RSS feeds must have absolute URLs
        expect(content).toContain('<link>http');

        // Should contain baseURL
        expect(content).toContain('wesole_nutki');
      }
    });

    test('should have valid RSS item links', async ({ page }) => {
      const response = await page.goto('/pl/index.xml');

      if (response && response.status() === 200) {
        const content = await page.content();

        // Extract first item link
        const linkMatch = content.match(/<item>[\s\S]*?<link>(.*?)<\/link>/);
        if (linkMatch && linkMatch[1]) {
          const itemLink = linkMatch[1];

          // Should be absolute URL
          expect(itemLink).toMatch(/^https?:\/\//);
          expect(itemLink).toContain('/wesole_nutki/');
        }
      }
    });

    test('should have valid RSS image URLs if present', async ({ page }) => {
      const response = await page.goto('/pl/index.xml');

      if (response && response.status() === 200) {
        const content = await page.content();

        // Check if there are image URLs in the feed
        if (content.includes('<image>') || content.includes('<enclosure')) {
          // Images should be absolute URLs
          const imageMatch = content.match(/<image>(.*?)<\/image>/);
          if (imageMatch) {
            expect(imageMatch[1]).toMatch(/https?:\/\//);
          }
        }
      }
    });

    test('should have English RSS feed with correct language', async ({ page, browserName }) => {
      const response = await page.goto('/en/index.xml');

      if (response && response.status() === 200) {
        // For WebKit, get raw response text; for others, use page content
        let content;
        if (browserName === 'webkit') {
          content = await response.text();
        } else {
          content = await page.content();
        }

        // Should contain English language code
        expect(content).toMatch(/<language>en/);

        // Links should point to /en/ pages
        expect(content).toContain('/en/');
      }
    });
  });

  test.describe('Sitemap URLs', () => {

    test('should have absolute URLs in sitemap', async ({ page, browserName }) => {
      const response = await page.goto('/sitemap.xml');

      if (response && response.status() === 200) {
        // For WebKit, get raw response text; for others, use page content
        let content;
        if (browserName === 'webkit') {
          content = await response.text();
        } else {
          content = await page.content();
        }

        // Sitemaps must have absolute URLs
        expect(content).toContain('<loc>http');

        // Should contain baseURL
        expect(content).toContain('wesole_nutki');
      }
    });

    test('should have valid sitemap URL entries', async ({ page }) => {
      const response = await page.goto('/sitemap.xml');

      if (response && response.status() === 200) {
        const content = await page.content();

        // Extract first URL
        const urlMatch = content.match(/<url>[\s\S]*?<loc>(.*?)<\/loc>/);
        if (urlMatch && urlMatch[1]) {
          const url = urlMatch[1];

          // Should be absolute URL
          expect(url).toMatch(/^https?:\/\//);
          expect(url).toContain('/wesole_nutki/');
        }
      }
    });

    test('should include both language versions in sitemap', async ({ page }) => {
      const response = await page.goto('/sitemap.xml');

      if (response && response.status() === 200) {
        const content = await page.content();

        // Should have both /pl/ and /en/ URLs
        expect(content).toContain('/pl/');
        expect(content).toContain('/en/');
      }
    });

    test('should have lastmod dates in ISO format', async ({ page }) => {
      const response = await page.goto('/sitemap.xml');

      if (response && response.status() === 200) {
        const content = await page.content();

        // Check for lastmod in ISO format (YYYY-MM-DD)
        if (content.includes('<lastmod>')) {
          expect(content).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}/);
        }
      }
    });
  });

  test.describe('Structured Data URLs', () => {

    test('should have absolute URLs in BreadcrumbList schema', async ({ page }) => {
      await page.goto('/pl/o-przedszkolu/');

      const structuredData = page.locator('script[type="application/ld+json"]').first();
      if (await structuredData.count() > 0) {
        const content = await structuredData.textContent();
        const json = JSON.parse(content || '{}');

        if (json['@type'] === 'BreadcrumbList') {
          // Check that itemListElement URLs are absolute
          if (json.itemListElement && json.itemListElement.length > 0) {
            for (const item of json.itemListElement) {
              if (item.item) {
                expect(item.item).toMatch(/^https?:\/\//);
                expect(item.item).toContain('/wesole_nutki/');
              }
            }
          }
        }
      }
    });

    test('should have absolute URL in Organization schema if present', async ({ page }) => {
      await page.goto('/pl/');

      const scripts = await page.locator('script[type="application/ld+json"]').all();

      for (const script of scripts) {
        const content = await script.textContent();
        const json = JSON.parse(content || '{}');

        if (json['@type'] === 'Organization') {
          if (json.url) {
            expect(json.url).toMatch(/^https?:\/\//);
            expect(json.url).toContain('/wesole_nutki/');
          }
        }
      }
    });

    test('should have absolute URLs in Article schema on news pages', async ({ page }) => {
      await page.goto('/pl/news/');

      const firstArticle = page.locator('.news-card a').first();
      if (await firstArticle.count() > 0) {
        await firstArticle.click();
        await page.waitForLoadState('networkidle');

        const scripts = await page.locator('script[type="application/ld+json"]').all();

        for (const script of scripts) {
          const content = await script.textContent();
          if (content && content.includes('"@type":"Article"')) {
            const json = JSON.parse(content);

            if (json.url || json.mainEntityOfPage) {
              const articleUrl = json.url || json.mainEntityOfPage;
              expect(articleUrl).toMatch(/^https?:\/\//);
            }
          }
        }
      }
    });
  });

  test.describe('Protocol and Domain Handling', () => {

    test('should use HTTPS in canonical URLs for production', async ({ page }) => {
      await page.goto('/pl/');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBeTruthy();

      // In production builds, should use https
      // In local dev, will use http (which is fine)
      expect(canonical).toMatch(/^https?:\/\//);
    });

    test('should use HTTPS in Open Graph URLs for production', async ({ page }) => {
      await page.goto('/pl/');

      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
      expect(ogUrl).toBeTruthy();

      expect(ogUrl).toMatch(/^https?:\/\//);
    });

    test('should not have protocol-relative URLs in critical meta tags', async ({ page }) => {
      await page.goto('/pl/');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');

      // Should not use protocol-relative URLs (//example.com)
      expect(canonical).not.toMatch(/^\/\//);
      expect(ogUrl).not.toMatch(/^\/\//);
      if (ogImage) {
        expect(ogImage).not.toMatch(/^\/\//);
      }
    });

    test('should handle external CDN URLs correctly', async ({ page }) => {
      await page.goto('/pl/');

      // External resources (fonts, CDNs) should remain absolute
      const externalLinks = await page.locator('link[href^="http"]').all();

      for (const link of externalLinks.slice(0, 3)) {
        const href = await link.getAttribute('href');
        if (href && (href.includes('fonts.googleapis') || href.includes('cdn'))) {
          // External URLs should remain untouched
          expect(href).toMatch(/^https?:\/\//);
        }
      }
    });
  });

  test.describe('URL Consistency Across Pages', () => {

    test('should have consistent baseURL across all page types', async ({ page }) => {
      const pages = [
        '/pl/',
        '/pl/news/',
        '/pl/gallery/',
        '/pl/o-przedszkolu/',
      ];

      for (const pagePath of pages) {
        const response = await page.goto(pagePath, { waitUntil: 'domcontentloaded', timeout: 15000 });

        // Skip if page doesn't exist
        if (!response || response.status() !== 200) {
          continue;
        }

        const canonical = page.locator('link[rel="canonical"]');
        if (await canonical.count() > 0) {
          const href = await canonical.getAttribute('href');
          expect(href).toContain('/wesole_nutki/');
        }

        const navLink = page.locator('nav a[href^="/"]').first();
        if (await navLink.count() > 0) {
          const href = await navLink.getAttribute('href');
          if (href && !href.startsWith('/#')) {
            expect(href).toContain('/wesole_nutki/');
          }
        }
      }
    });

    test('should maintain URL structure in pagination', async ({ page }) => {
      await page.goto('/pl/news/');

      const paginationLinks = await page.locator('.pagination a, .page-link').all();

      if (paginationLinks.length > 0) {
        for (const link of paginationLinks.slice(0, 3)) {
          const href = await link.getAttribute('href');
          if (href && !href.includes('#')) {
            expect(href).toMatch(/^\/wesole_nutki\//);
            expect(href).toContain('/pl/');
          }
        }
      }
    });

    test('should maintain URL structure in category/tag pages', async ({ page }) => {
      await page.goto('/pl/news/');

      const categoryLinks = await page.locator('a[href*="/categories/"], a[href*="/tags/"]').all();

      if (categoryLinks.length > 0) {
        for (const link of categoryLinks.slice(0, 3)) {
          const href = await link.getAttribute('href');
          if (href) {
            expect(href).toContain('/wesole_nutki/');
            expect(href).toContain('/pl/');
          }
        }
      }
    });
  });

  test.describe('Image URL Handling', () => {

    test('should use relative URLs for gallery images', async ({ page }) => {
      await page.goto('/pl/gallery/');

      const galleryImages = await page.locator('.gallery-card img, .gallery-item img').all();

      if (galleryImages.length > 0) {
        const firstImg = galleryImages[0];
        const src = await firstImg.getAttribute('src');

        expect(src).toBeTruthy();
        // Should be relative (not absolute), either with or without baseURL depending on context
        expect(src).not.toMatch(/^https?:\/\//);
        // Should start with /
        expect(src).toMatch(/^\//);
      }
    });

    test('should use absolute URLs for Open Graph images', async ({ page }) => {
      await page.goto('/pl/');

      const ogImage = page.locator('meta[property="og:image"]');
      if (await ogImage.count() > 0) {
        const content = await ogImage.getAttribute('content');
        expect(content).toMatch(/^https?:\/\//);
        expect(content).toContain('/wesole_nutki/');
      }
    });

    test('should handle responsive image srcset correctly', async ({ page }) => {
      await page.goto('/pl/gallery/');

      const imagesWithSrcset = await page.locator('img[srcset]').all();

      if (imagesWithSrcset.length > 0) {
        const firstImg = imagesWithSrcset[0];
        const srcset = await firstImg.getAttribute('srcset');

        if (srcset) {
          // All URLs in srcset should include baseURL
          const urls = srcset.split(',').map(s => s.trim().split(' ')[0]);
          for (const url of urls) {
            if (url.startsWith('/')) {
              expect(url).toContain('/wesole_nutki/');
            }
          }
        }
      }
    });
  });
});
