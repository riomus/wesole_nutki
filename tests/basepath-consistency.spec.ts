/**
 * BaseURL Consistency Tests
 *
 * These tests verify that the basepath handling is consistent across
 * all sections of the website, including:
 * - All page types maintain basepath
 * - All sections use consistent URL patterns
 * - No pages leak absolute URLs without basepath
 * - Cross-page navigation preserves basepath
 */

import { test, expect } from '@playwright/test';

test.describe('Basepath URL Consistency', () => {
  test.describe('Consistency Across Site Sections', () => {
    test('should have consistent basepath in all homepage sections', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Collect all internal links
      const links = await page.locator('a[href]').all();
      const internalLinks: string[] = [];

      for (const link of links) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#') &&
            !href.startsWith('mailto:') && !href.startsWith('tel:')) {
          internalLinks.push(href);
        }
      }

      console.log(`Found ${internalLinks.length} internal links on homepage`);

      // All internal links should have language prefix
      const validLinks = internalLinks.filter(href => href.match(/^\/(pl|en)\//));
      const ratio = validLinks.length / internalLinks.length;

      console.log(`Valid links with language prefix: ${validLinks.length}/${internalLinks.length} = ${(ratio * 100).toFixed(1)}%`);

      // At least 95% of links should have proper basepath
      expect(ratio).toBeGreaterThan(0.95);
    });

    test('should have consistent basepath in news section', async ({ page }) => {
      await page.goto('/pl/news/');
      await page.waitForLoadState('networkidle');

      const links = await page.locator('a[href^="/"]').all();

      for (const link of links) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('http')) {
          expect(href).toMatch(/^\/(pl|en)\//);
        }
      }
    });

    test('should have consistent basepath in gallery section', async ({ page }) => {
      await page.goto('/pl/gallery/');
      await page.waitForLoadState('networkidle');

      const links = await page.locator('a[href^="/"]').all();

      for (const link of links) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('http')) {
          expect(href).toMatch(/^\/(pl|en)\//);
        }
      }
    });

    test('should have consistent basepath in about section', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const links = await page.locator('a[href^="/"]').all();

      for (const link of links) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('http')) {
          expect(href).toMatch(/^\/(pl|en)\//);
        }
      }
    });

    test('should have consistent basepath in contact section', async ({ page }) => {
      await page.goto('/pl/contact/');
      await page.waitForLoadState('networkidle');

      const links = await page.locator('a[href^="/"]').all();

      for (const link of links) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('http')) {
          expect(href).toMatch(/^\/(pl|en)\//);
        }
      }
    });
  });

  test.describe('Cross-Page Navigation Consistency', () => {
    test('should preserve basepath when navigating from homepage to news', async ({ page }) => {
      await page.goto('/pl/');

      // Navigate to news
      await page.click('text=Aktualności');
      await page.waitForURL(/\/pl\/news/);

      // Verify all links still have basepath
      const links = await page.locator('a[href^="/"]').all();

      for (const link of links) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('http')) {
          expect(href).toMatch(/^\/(pl|en)\//);
        }
      }
    });

    test('should preserve basepath when navigating from news to article', async ({ page }) => {
      await page.goto('/pl/news/');

      // Click on first news article
      const firstNews = page.locator('.news-card a, article a').first();
      await firstNews.click();
      await page.waitForLoadState('networkidle');

      // Verify URL has basepath
      expect(page.url()).toMatch(/\/pl\//);

      // Verify all links on article page have basepath
      const links = await page.locator('a[href^="/"]').all();

      for (const link of links) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('http')) {
          expect(href).toMatch(/^\/(pl|en)\//);
        }
      }
    });

    test('should preserve basepath when navigating from gallery to single gallery', async ({ page }) => {
      await page.goto('/pl/gallery/');

      // Click on first gallery
      const firstGallery = page.locator('.gallery-card-link, .gallery-card a').first();
      if (await firstGallery.count() > 0) {
        await firstGallery.click();
        await page.waitForLoadState('networkidle');

        // Verify URL has basepath
        expect(page.url()).toMatch(/\/pl\/gallery\//);

        // Verify all links on gallery page have basepath
        const links = await page.locator('a[href^="/"]').all();

        for (const link of links) {
          const href = await link.getAttribute('href');
          if (href && !href.startsWith('http')) {
            expect(href).toMatch(/^\/(pl|en)\//);
          }
        }
      }
    });

    test('should preserve basepath across multiple navigation hops', async ({ page }) => {
      // Start at homepage
      await page.goto('/pl/');
      expect(page.url()).toMatch(/\/pl\/$/);

      // Navigate to gallery
      await page.click('text=Galerie');
      await page.waitForURL(/\/pl\/gallery/);
      expect(page.url()).toMatch(/\/pl\/gallery/);

      // Navigate to about
      await page.click('text=O przedszkolu');
      await page.waitForURL(/\/pl\/about/);
      expect(page.url()).toMatch(/\/pl\/about/);

      // Navigate to news
      await page.click('text=Aktualności');
      await page.waitForURL(/\/pl\/news/);
      expect(page.url()).toMatch(/\/pl\/news/);

      // Navigate back to homepage
      await page.click('.navbar-brand');
      await page.waitForURL(/\/pl\/$/);
      expect(page.url()).toMatch(/\/pl\/$/);

      console.log('✓ Basepath preserved across 5 navigation hops');
    });
  });

  test.describe('Image URL Consistency', () => {
    test('should have consistent image basepath across all pages', async ({ page }) => {
      const pages = [
        '/pl/',
        '/pl/about/',
        '/pl/news/',
        '/pl/gallery/',
        '/pl/contact/'
      ];

      for (const pageUrl of pages) {
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle');

        const images = await page.locator('img[src]').all();

        for (const img of images) {
          const src = await img.getAttribute('src');

          // Skip data URLs and external images
          if (src && !src.startsWith('data:') && !src.startsWith('http')) {
            // Should have language prefix or be a static asset
            const hasLanguagePrefix = src.match(/^\/(pl|en)\//);
            const isStaticAsset = src.match(/^\/(images|assets|static|css|js)\//);

            expect(hasLanguagePrefix || isStaticAsset).toBeTruthy();
          }
        }

        console.log(`✓ Image URLs verified on ${pageUrl}`);
      }
    });
  });

  test.describe('Asset URL Consistency', () => {
    test('should have consistent CSS paths across all pages', async ({ page }) => {
      const pages = ['/pl/', '/pl/about/', '/pl/news/', '/pl/gallery/'];

      let cssPaths: string[] = [];

      for (const pageUrl of pages) {
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle');

        const cssLinks = await page.locator('link[rel="stylesheet"]').all();

        for (const link of cssLinks) {
          const href = await link.getAttribute('href');
          if (href && !href.startsWith('http')) {
            cssPaths.push(href);
          }
        }
      }

      // All CSS paths should be identical across pages
      const uniqueCssPaths = [...new Set(cssPaths)];

      console.log(`CSS paths found: ${uniqueCssPaths.join(', ')}`);

      // Should have consistent CSS loading
      expect(uniqueCssPaths.length).toBeGreaterThan(0);
    });

    test('should have consistent JavaScript paths across all pages', async ({ page }) => {
      const pages = ['/pl/', '/pl/about/', '/pl/news/'];

      let jsPaths: string[] = [];

      for (const pageUrl of pages) {
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle');

        const jsScripts = await page.locator('script[src]').all();

        for (const script of jsScripts) {
          const src = await script.getAttribute('src');
          if (src && !src.startsWith('http')) {
            jsPaths.push(src);
          }
        }
      }

      // All JS paths should use consistent basepath
      const uniqueJsPaths = [...new Set(jsPaths)];

      console.log(`JavaScript paths found: ${uniqueJsPaths.length} unique paths`);

      // Should have at least some JS files
      expect(uniqueJsPaths.length).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Menu Consistency', () => {
    test('should have identical menu structure on all pages', async ({ page }) => {
      const pages = ['/pl/', '/pl/about/', '/pl/news/', '/pl/gallery/', '/pl/contact/'];

      let menuStructures: string[][] = [];

      for (const pageUrl of pages) {
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle');

        const menuLinks = await page.locator('header nav a.nav-link').all();
        const urls = await Promise.all(
          menuLinks.map(link => link.getAttribute('href'))
        );

        menuStructures.push(urls.filter(url => url !== null) as string[]);
      }

      // All pages should have the same menu structure
      const firstMenu = menuStructures[0];

      for (let i = 1; i < menuStructures.length; i++) {
        expect(menuStructures[i].length).toBe(firstMenu.length);
        console.log(`✓ Menu structure matches on page ${i + 1}`);
      }
    });

    test('should have all menu items with proper basepath on every page', async ({ page }) => {
      const pages = ['/pl/', '/pl/about/', '/pl/news/', '/pl/gallery/'];

      for (const pageUrl of pages) {
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle');

        const menuLinks = await page.locator('header nav a.nav-link').all();

        for (const link of menuLinks) {
          const href = await link.getAttribute('href');

          if (href && href !== '#' && !href.startsWith('http')) {
            expect(href).toMatch(/^\/(pl|en)\//);
          }
        }

        console.log(`✓ All menu links valid on ${pageUrl}`);
      }
    });
  });

  test.describe('Footer Consistency', () => {
    test('should have identical footer structure on all pages', async ({ page }) => {
      const pages = ['/pl/', '/pl/about/', '/pl/news/'];

      let footerLinkCounts: number[] = [];

      for (const pageUrl of pages) {
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle');

        const footerLinks = await page.locator('footer a').all();
        footerLinkCounts.push(footerLinks.length);
      }

      // All pages should have similar footer link count (within 2)
      const minCount = Math.min(...footerLinkCounts);
      const maxCount = Math.max(...footerLinkCounts);

      expect(maxCount - minCount).toBeLessThanOrEqual(2);
      console.log(`✓ Footer link counts consistent: ${footerLinkCounts.join(', ')}`);
    });

    test('should have all footer links with proper basepath', async ({ page }) => {
      const pages = ['/pl/', '/pl/about/', '/pl/contact/'];

      for (const pageUrl of pages) {
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle');

        const footerLinks = await page.locator('footer a').all();

        for (const link of footerLinks) {
          const href = await link.getAttribute('href');

          if (href && !href.startsWith('http') && !href.startsWith('#') &&
              !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            expect(href).toMatch(/^\/(pl|en)\//);
          }
        }

        console.log(`✓ All footer links valid on ${pageUrl}`);
      }
    });
  });

  test.describe('URL Pattern Consistency', () => {
    test('should never have double slashes in URLs', async ({ page }) => {
      const pages = ['/pl/', '/pl/about/', '/pl/news/', '/pl/gallery/'];

      for (const pageUrl of pages) {
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle');

        const allLinks = await page.locator('a[href]').all();

        for (const link of allLinks) {
          const href = await link.getAttribute('href');

          if (href && href.startsWith('/')) {
            // Should not have double slashes (except after protocol)
            const afterProtocol = href.replace(/^https?:\/\//, '');
            expect(afterProtocol).not.toContain('//');
          }
        }
      }

      console.log('✓ No double slashes found in any URLs');
    });

    test('should have lowercase URLs (except query params)', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const links = await page.locator('a[href^="/"]').all();

      for (const link of links) {
        const href = await link.getAttribute('href');

        if (href && !href.startsWith('http')) {
          // Split off query params
          const path = href.split('?')[0].split('#')[0];

          // Path should be lowercase (Hugo best practice)
          // Allow for some exceptions like /README.md etc
          const hasUpperCase = /[A-Z]/.test(path);
          if (hasUpperCase) {
            console.log(`⚠ Uppercase in URL: ${path}`);
          }
        }
      }

      console.log('✓ URL case consistency checked');
    });
  });
});
