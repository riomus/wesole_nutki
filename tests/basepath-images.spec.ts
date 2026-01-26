import { test, expect } from '@playwright/test';

/**
 * Basepath Image Tests
 *
 * These tests verify that all images load correctly when the site
 * is deployed with a configured basepath (subdirectory).
 *
 * Run with: BASEPATH=true npx playwright test basepath-images.spec.ts
 */

const useBasePath = process.env.BASEPATH === 'true';
const basePath = useBasePath ? '/wesole_nutki' : '';

test.describe('Basepath Images', () => {
  test.describe('Image Path Handling', () => {
    test('should load logo image with correct path', async ({ page }) => {
      await page.goto(`${basePath}/pl/`);

      // Check logo image
      const logo = page.locator('.navbar-brand img');
      if (await logo.count() > 0) {
        const logoSrc = await logo.getAttribute('src');
        expect(logoSrc).toContain(basePath);

        // Verify image loads successfully
        const response = await page.goto(logoSrc!);
        expect(response?.status()).toBe(200);
      }
    });

    test('should load hero background images with correct path', async ({ page }) => {
      await page.goto(`${basePath}/pl/`);

      // Check for hero section with background image
      const heroSection = page.locator('.hero-section[style*="background-image"]');
      if (await heroSection.count() > 0) {
        const style = await heroSection.getAttribute('style');
        if (style && style.includes('url')) {
          // Extract URL from style
          const urlMatch = style.match(/url\(['"]?([^'"()]+)['"]?\)/);
          if (urlMatch) {
            const bgImageUrl = urlMatch[1];
            expect(bgImageUrl).toContain(basePath);
          }
        }
      }
    });

    test('should load gallery images with correct paths', async ({ page }) => {
      await page.goto(`${basePath}/pl/gallery/`);

      // Wait for gallery cards to load
      await page.waitForSelector('.gallery-card', { timeout: 10000 });

      // Check gallery card images
      const galleryImages = page.locator('.gallery-card img');
      const count = await galleryImages.count();

      expect(count).toBeGreaterThan(0);

      // Check first few images
      for (let i = 0; i < Math.min(count, 3); i++) {
        const img = galleryImages.nth(i);
        const src = await img.getAttribute('src');
        if (src && !src.startsWith('data:')) {
          expect(src).toContain(basePath);
        }
      }
    });

    test('should load news article images with correct paths', async ({ page }) => {
      await page.goto(`${basePath}/pl/news/`);

      // Wait for news cards to load
      await page.waitForSelector('.news-card', { timeout: 10000 });

      // Check news card images
      const newsImages = page.locator('.news-card img, .post-card img');
      const count = await newsImages.count();

      if (count > 0) {
        // Check first image
        const firstImg = newsImages.first();
        const src = await firstImg.getAttribute('src');
        if (src && !src.startsWith('data:')) {
          expect(src).toContain(basePath);
        }
      }
    });

    test('should load responsive image sources correctly', async ({ page }) => {
      await page.goto(`${basePath}/pl/`);

      // Check for picture elements with source tags
      const sources = page.locator('picture source[srcset]');
      const count = await sources.count();

      if (count > 0) {
        for (let i = 0; i < Math.min(count, 3); i++) {
          const source = sources.nth(i);
          const srcset = await source.getAttribute('srcset');
          if (srcset) {
            // All URLs in srcset should contain basepath
            const urls = srcset.split(',').map(s => s.trim().split(' ')[0]);
            for (const url of urls) {
              if (!url.startsWith('data:')) {
                expect(url).toContain(basePath);
              }
            }
          }
        }
      }
    });
  });

  test.describe('Image Loading', () => {
    test('should successfully load images on Polish pages', async ({ page, context }) => {
      await page.goto(`${basePath}/pl/`);

      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Check for failed image requests
      const failedImages: string[] = [];

      page.on('response', response => {
        const url = response.url();
        if (
          (url.includes('.jpg') || url.includes('.png') || url.includes('.webp') || url.includes('.svg')) &&
          response.status() >= 400
        ) {
          failedImages.push(url);
        }
      });

      // Reload page to capture image requests
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Should have no failed images
      expect(failedImages.length).toBe(0);
    });

    test('should successfully load images on English pages', async ({ page }) => {
      await page.goto(`${basePath}/en/`);

      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Check for failed image requests
      const failedImages: string[] = [];

      page.on('response', response => {
        const url = response.url();
        if (
          (url.includes('.jpg') || url.includes('.png') || url.includes('.webp') || url.includes('.svg')) &&
          response.status() >= 400
        ) {
          failedImages.push(url);
        }
      });

      // Reload page to capture image requests
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Should have no failed images
      expect(failedImages.length).toBe(0);
    });
  });

  test.describe('Responsive Image Sizes', () => {
    test('should use correct image sizes on mobile viewport', async ({ page, viewport }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${basePath}/pl/`);

      // Check that images use appropriate sizes for mobile
      const images = page.locator('img[srcset]');
      const count = await images.count();

      if (count > 0) {
        const firstImg = images.first();
        const srcset = await firstImg.getAttribute('srcset');
        expect(srcset).toBeTruthy();
        if (srcset) {
          expect(srcset).toContain('w');
        }
      }
    });

    test('should use correct image sizes on desktop viewport', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${basePath}/pl/`);

      // Check that images use appropriate sizes for desktop
      const images = page.locator('img[srcset]');
      const count = await images.count();

      if (count > 0) {
        const firstImg = images.first();
        const srcset = await firstImg.getAttribute('srcset');
        expect(srcset).toBeTruthy();
        if (srcset) {
          expect(srcset).toContain('w');
        }
      }
    });
  });

  test.describe('Favicon and Icons', () => {
    test('should load favicon with correct path', async ({ page }) => {
      await page.goto(`${basePath}/pl/`);

      // Check favicon link
      const faviconLink = page.locator('link[rel="icon"]').first();
      const href = await faviconLink.getAttribute('href');
      expect(href).toContain(basePath);
    });

    test('should load apple-touch-icon with correct path', async ({ page }) => {
      await page.goto(`${basePath}/pl/`);

      // Check apple-touch-icon link
      const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
      if (await appleTouchIcon.count() > 0) {
        const href = await appleTouchIcon.getAttribute('href');
        expect(href).toContain(basePath);
      }
    });
  });

  test.describe('CSS and Asset Loading', () => {
    test('should load CSS files with correct path', async ({ page }) => {
      await page.goto(`${basePath}/pl/`);

      // Check for CSS files
      const cssLinks = page.locator('link[rel="stylesheet"]');
      const count = await cssLinks.count();

      expect(count).toBeGreaterThan(0);

      // Verify CSS files load successfully
      for (let i = 0; i < count; i++) {
        const link = cssLinks.nth(i);
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('http')) {
          expect(href).toContain(basePath);
        }
      }
    });
  });

  test.describe('Open Graph Images', () => {
    test('should have correct OG image URL with basepath', async ({ page }) => {
      await page.goto(`${basePath}/pl/`);

      // Check og:image meta tag
      const ogImage = page.locator('meta[property="og:image"]');
      if (await ogImage.count() > 0) {
        const content = await ogImage.getAttribute('content');
        if (content) {
          // OG images should be absolute URLs
          expect(content).toMatch(/^https?:\/\//);
          // And should include the basepath
          if (useBasePath) {
            expect(content).toContain('/wesole_nutki/');
          }
        }
      }
    });

    test('should have correct Twitter image URL with basepath', async ({ page }) => {
      await page.goto(`${basePath}/pl/`);

      // Check twitter:image meta tag
      const twitterImage = page.locator('meta[name="twitter:image"]');
      if (await twitterImage.count() > 0) {
        const content = await twitterImage.getAttribute('content');
        if (content) {
          // Twitter images should be absolute URLs
          expect(content).toMatch(/^https?:\/\//);
          // And should include the basepath
          if (useBasePath) {
            expect(content).toContain('/wesole_nutki/');
          }
        }
      }
    });
  });
});
