import { test, expect } from '@playwright/test';

/**
 * Asset URL E2E Tests
 * Tests to verify that all asset URLs (CSS, JS, images, fonts, favicons, etc.)
 * are correctly resolved with the baseURL configuration.
 * This is critical for ensuring the site works when deployed to a subdirectory.
 */

test.describe('Asset URLs with baseURL', () => {
  test.describe('CSS Asset URLs', () => {
    test('should load main stylesheet with correct baseURL', async ({ page }) => {
      await page.goto('/pl/');

      // Find the main stylesheet link
      const stylesheet = page.locator('link[rel="stylesheet"]').first();
      await expect(stylesheet).toHaveCount(1);

      const href = await stylesheet.getAttribute('href');
      expect(href).toBeTruthy();

      // Verify the CSS file loads successfully (status 200)
      const response = await page.request.get(href!);
      expect(response.status()).toBe(200);
    });

    test('should load GLightbox CSS with correct baseURL', async ({ page }) => {
      await page.goto('/pl/gallery/');

      // Find the GLightbox stylesheet
      const glightboxCss = page.locator('link[href*="glightbox"]');

      if (await glightboxCss.count() > 0) {
        const href = await glightboxCss.getAttribute('href');
        expect(href).toBeTruthy();

        // Verify the CSS file loads successfully
        const response = await page.request.get(href!);
        expect(response.status()).toBe(200);
      }
    });

    test('should load all stylesheets successfully', async ({ page }) => {
      await page.goto('/pl/');

      // Get all stylesheet links
      const stylesheets = page.locator('link[rel="stylesheet"]');
      const count = await stylesheets.count();

      expect(count).toBeGreaterThan(0);

      // Verify each stylesheet loads successfully
      for (let i = 0; i < count; i++) {
        const href = await stylesheets.nth(i).getAttribute('href');
        if (href && !href.startsWith('http')) {
          const response = await page.request.get(href);
          expect(response.status()).toBe(200);
        }
      }
    });
  });

  test.describe('JavaScript Asset URLs', () => {
    test('should load GLightbox JS with correct baseURL', async ({ page }) => {
      await page.goto('/pl/gallery/');

      // Wait for page to load completely
      await page.waitForLoadState('networkidle');

      // Check for GLightbox script in the page
      const scripts = await page.locator('script[src*="glightbox"]').all();

      if (scripts.length > 0) {
        for (const script of scripts) {
          const src = await script.getAttribute('src');
          expect(src).toBeTruthy();

          // Verify the JS file loads successfully
          const response = await page.request.get(src!);
          expect(response.status()).toBe(200);
        }
      }
    });

    test('should load footer scripts with correct baseURL', async ({ page }) => {
      await page.goto('/pl/');

      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Get all script tags with src attribute
      const scripts = page.locator('script[src]');
      const count = await scripts.count();

      // Verify local scripts (not external CDN) load successfully
      for (let i = 0; i < count; i++) {
        const src = await scripts.nth(i).getAttribute('src');
        if (src && !src.startsWith('http') && !src.includes('netlify')) {
          const response = await page.request.get(src);
          expect(response.status()).toBe(200);
        }
      }
    });
  });

  test.describe('Favicon and Icon URLs', () => {
    test('should load SVG favicon with correct baseURL', async ({ page }) => {
      await page.goto('/pl/');

      const svgFavicon = page.locator('link[rel="icon"][type="image/svg+xml"]');
      await expect(svgFavicon).toHaveCount(1);

      const href = await svgFavicon.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toContain('favicon.svg');

      // Verify the favicon loads successfully
      const response = await page.request.get(href!);
      expect(response.status()).toBe(200);
    });

    test('should load PNG favicon with correct baseURL', async ({ page }) => {
      await page.goto('/pl/');

      const pngFavicon = page.locator('link[rel="icon"][type="image/png"]');

      if (await pngFavicon.count() > 0) {
        const href = await pngFavicon.getAttribute('href');
        expect(href).toBeTruthy();

        // Verify the favicon loads successfully
        const response = await page.request.get(href!);
        expect(response.status()).toBe(200);
      }
    });

    test('should load apple-touch-icon with correct baseURL', async ({ page }) => {
      await page.goto('/pl/');

      const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
      await expect(appleTouchIcon).toHaveCount(1);

      const href = await appleTouchIcon.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toContain('apple-touch-icon.svg');

      // Verify the icon loads successfully
      const response = await page.request.get(href!);
      expect(response.status()).toBe(200);
    });

    test('should load web manifest with correct baseURL', async ({ page }) => {
      await page.goto('/pl/');

      const manifest = page.locator('link[rel="manifest"]');

      if (await manifest.count() > 0) {
        const href = await manifest.getAttribute('href');
        expect(href).toBeTruthy();

        // Verify the manifest loads successfully
        const response = await page.request.get(href!);
        expect(response.status()).toBe(200);
      }
    });
  });

  test.describe('Logo and Brand Image URLs', () => {
    test('should load site logo with correct baseURL on Polish pages', async ({ page }) => {
      await page.goto('/pl/');

      const logo = page.locator('.navbar-brand img');
      await expect(logo).toBeVisible();

      const src = await logo.getAttribute('src');
      expect(src).toBeTruthy();

      // Verify logo loads successfully
      const response = await page.request.get(src!);
      expect(response.status()).toBe(200);
    });

    test('should load site logo with correct baseURL on English pages', async ({ page }) => {
      await page.goto('/en/');

      const logo = page.locator('.navbar-brand img');
      await expect(logo).toBeVisible();

      const src = await logo.getAttribute('src');
      expect(src).toBeTruthy();

      // Verify logo loads successfully
      const response = await page.request.get(src!);
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Image Asset URLs', () => {
    test('should load hero images with correct baseURL', async ({ page }) => {
      await page.goto('/pl/');

      // Check for hero section images
      const heroImages = page.locator('.hero img, .hero-section img, [class*="hero"] img');

      if (await heroImages.count() > 0) {
        const firstImage = heroImages.first();
        await expect(firstImage).toBeVisible();

        const src = await firstImage.getAttribute('src');
        expect(src).toBeTruthy();

        // Verify image loads successfully
        const response = await page.request.get(src!);
        expect(response.status()).toBe(200);
      }
    });

    test('should load gallery card images with correct baseURL', async ({ page }) => {
      await page.goto('/pl/gallery/');

      // Wait for gallery cards to load
      await page.waitForSelector('.gallery-card, .card', { timeout: 5000 }).catch(() => {});

      const galleryImages = page.locator('.gallery-card img, .card img');
      const imageCount = await galleryImages.count();

      if (imageCount > 0) {
        // Try to find a valid image
        let foundValidImage = false;
        for (let i = 0; i < Math.min(imageCount, 3); i++) {
          const image = galleryImages.nth(i);
          await expect(image).toBeVisible();

          const src = await image.getAttribute('src');
          if (src) {
            const response = await page.request.get(src);
            if (response.status() === 200) {
              foundValidImage = true;
              break;
            }
          }
        }

        // At least one gallery image should load successfully
        expect(foundValidImage).toBe(true);
      }
    });

    test('should load news card images with correct baseURL', async ({ page }) => {
      await page.goto('/pl/news/');

      // Wait for news cards to load
      await page.waitForSelector('.news-card, .card', { timeout: 5000 }).catch(() => {});

      const newsImages = page.locator('.news-card img, .card img').first();

      if (await newsImages.count() > 0) {
        await expect(newsImages).toBeVisible();

        const src = await newsImages.getAttribute('src');
        expect(src).toBeTruthy();

        // Verify image loads successfully
        const response = await page.request.get(src!);
        expect(response.status()).toBe(200);
      }
    });
  });

  test.describe('Font Asset URLs', () => {
    test('should load custom fonts with correct baseURL if present', async ({ page }) => {
      await page.goto('/pl/');

      // Wait for fonts to be loaded
      await page.waitForLoadState('networkidle');

      // Check for font preloads or font-face declarations
      const fontLinks = page.locator('link[rel="preload"][as="font"]');
      const count = await fontLinks.count();

      // Verify local fonts load successfully (if any)
      for (let i = 0; i < count; i++) {
        const href = await fontLinks.nth(i).getAttribute('href');
        if (href && !href.startsWith('http')) {
          const response = await page.request.get(href);
          expect(response.status()).toBe(200);
        }
      }
    });
  });

  test.describe('Asset URL Consistency Across Pages', () => {
    test('should maintain correct asset URLs on homepage', async ({ page }) => {
      await page.goto('/pl/');

      // Check logo
      const logo = page.locator('.navbar-brand img');
      const logoSrc = await logo.getAttribute('src');
      expect(logoSrc).toBeTruthy();

      // Check stylesheet
      const stylesheet = page.locator('link[rel="stylesheet"]').first();
      const cssHref = await stylesheet.getAttribute('href');
      expect(cssHref).toBeTruthy();

      // Verify both load successfully
      const logoResponse = await page.request.get(logoSrc!);
      expect(logoResponse.status()).toBe(200);

      const cssResponse = await page.request.get(cssHref!);
      expect(cssResponse.status()).toBe(200);
    });

    test('should maintain correct asset URLs on about page', async ({ page }) => {
      await page.goto('/pl/about/');

      // Check logo
      const logo = page.locator('.navbar-brand img');
      const logoSrc = await logo.getAttribute('src');
      expect(logoSrc).toBeTruthy();

      // Verify logo loads successfully
      const response = await page.request.get(logoSrc!);
      expect(response.status()).toBe(200);
    });

    test('should maintain correct asset URLs on news page', async ({ page }) => {
      await page.goto('/pl/news/');

      // Check logo
      const logo = page.locator('.navbar-brand img');
      const logoSrc = await logo.getAttribute('src');
      expect(logoSrc).toBeTruthy();

      // Verify logo loads successfully
      const response = await page.request.get(logoSrc!);
      expect(response.status()).toBe(200);
    });

    test('should maintain correct asset URLs on gallery page', async ({ page }) => {
      await page.goto('/pl/gallery/');

      // Check logo
      const logo = page.locator('.navbar-brand img');
      const logoSrc = await logo.getAttribute('src');
      expect(logoSrc).toBeTruthy();

      // Verify logo loads successfully
      const response = await page.request.get(logoSrc!);
      expect(response.status()).toBe(200);
    });

    test('should maintain correct asset URLs on contact page', async ({ page }) => {
      await page.goto('/pl/contact/');

      // Check logo
      const logo = page.locator('.navbar-brand img');
      const logoSrc = await logo.getAttribute('src');
      expect(logoSrc).toBeTruthy();

      // Verify logo loads successfully
      const response = await page.request.get(logoSrc!);
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Asset URL Consistency Across Languages', () => {
    test('should use same asset URLs for Polish and English versions', async ({ page }) => {
      // Get Polish page assets
      await page.goto('/pl/');
      const plLogo = page.locator('.navbar-brand img');
      const plLogoSrc = await plLogo.getAttribute('src');
      const plStylesheet = page.locator('link[rel="stylesheet"]').first();
      const plCssSrc = await plStylesheet.getAttribute('href');

      // Get English page assets
      await page.goto('/en/');
      const enLogo = page.locator('.navbar-brand img');
      const enLogoSrc = await enLogo.getAttribute('src');
      const enStylesheet = page.locator('link[rel="stylesheet"]').first();
      const enCssSrc = await enStylesheet.getAttribute('href');

      // Asset URLs should be the same regardless of language
      expect(plLogoSrc).toBe(enLogoSrc);
      expect(plCssSrc).toBe(enCssSrc);
    });

    test('should maintain asset URLs after language switch', async ({ page }) => {
      await page.goto('/pl/');

      // Get initial logo src
      const initialLogo = page.locator('.navbar-brand img');
      const initialLogoSrc = await initialLogo.getAttribute('src');

      // Switch to English
      const enButton = page.locator('.site-header .lang-btn').filter({
        has: page.locator('.lang-code', { hasText: 'EN' })
      });

      if (await enButton.count() > 0) {
        await enButton.click();
        await page.waitForLoadState('networkidle');

        // Check logo src after language switch
        const newLogo = page.locator('.navbar-brand img');
        const newLogoSrc = await newLogo.getAttribute('src');

        // Logo URL should remain the same
        expect(newLogoSrc).toBe(initialLogoSrc);

        // Verify logo still loads successfully
        const response = await page.request.get(newLogoSrc!);
        expect(response.status()).toBe(200);
      }
    });
  });

  test.describe('Static Asset URLs', () => {
    test('should load static CSS files with correct baseURL', async ({ page }) => {
      await page.goto('/pl/');

      // Check for any static CSS references
      const staticCssLinks = page.locator('link[rel="stylesheet"][href*="/css/"]');

      if (await staticCssLinks.count() > 0) {
        const href = await staticCssLinks.first().getAttribute('href');
        expect(href).toBeTruthy();

        // Verify CSS loads successfully
        const response = await page.request.get(href!);
        expect(response.status()).toBe(200);
      }
    });

    test('should load static JS files with correct baseURL', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Check for any static JS references
      const staticJsScripts = page.locator('script[src*="/js/"]');

      if (await staticJsScripts.count() > 0) {
        const src = await staticJsScripts.first().getAttribute('src');
        expect(src).toBeTruthy();

        // Verify JS loads successfully
        const response = await page.request.get(src!);
        expect(response.status()).toBe(200);
      }
    });

    test('should load static image files with correct baseURL', async ({ page }) => {
      await page.goto('/pl/');

      // Check for static images
      const staticImages = page.locator('img[src*="/images/"]').first();

      if (await staticImages.count() > 0) {
        const src = await staticImages.getAttribute('src');
        expect(src).toBeTruthy();

        // Verify image loads successfully
        const response = await page.request.get(src!);
        expect(response.status()).toBe(200);
      }
    });
  });

  test.describe('Asset URL Format Validation', () => {
    test('should have absolute or root-relative asset URLs', async ({ page }) => {
      await page.goto('/pl/');

      // Check logo URL format
      const logo = page.locator('.navbar-brand img');
      const logoSrc = await logo.getAttribute('src');
      expect(logoSrc).toBeTruthy();

      // Should be absolute (http://) or root-relative (/)
      expect(logoSrc).toMatch(/^(https?:\/\/|\/)/);
    });

    test('should not have relative asset URLs', async ({ page }) => {
      await page.goto('/pl/about/');

      // Check that assets don't use relative paths like ../images/
      const logo = page.locator('.navbar-brand img');
      const logoSrc = await logo.getAttribute('src');
      expect(logoSrc).toBeTruthy();

      // Should not start with ../ or ./
      expect(logoSrc).not.toMatch(/^\.\.?\//);
    });

    test('should have consistent baseURL prefix in asset URLs when using basepath', async ({ page }) => {
      await page.goto('/pl/');

      const currentUrl = page.url();
      const url = new URL(currentUrl);
      const basePath = url.pathname.split('/')[1]; // e.g., 'wesole_nutki' or first path segment

      // Only check if we're using a basepath (not just language code)
      if (basePath && basePath !== 'pl' && basePath !== 'en') {
        // Get logo src
        const logo = page.locator('.navbar-brand img');
        const logoSrc = await logo.getAttribute('src');
        expect(logoSrc).toBeTruthy();

        // If baseURL includes a subdirectory, asset URLs should include it
        if (logoSrc!.startsWith('/') && !logoSrc!.startsWith('//')) {
          // Logo should include the basepath
          expect(logoSrc).toContain(`/${basePath}/`);
        }
      }
    });
  });

  test.describe('Asset Loading Performance', () => {
    test('should load critical assets quickly', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/pl/');
      await page.waitForLoadState('domcontentloaded');

      const loadTime = Date.now() - startTime;

      // Critical assets should load within reasonable time (5 seconds)
      expect(loadTime).toBeLessThan(5000);

      // Verify critical assets are present
      const logo = page.locator('.navbar-brand img');
      await expect(logo).toBeVisible();

      const stylesheet = page.locator('link[rel="stylesheet"]').first();
      await expect(stylesheet).toHaveCount(1);
    });

    test('should not have failed asset requests', async ({ page }) => {
      const failedRequests: string[] = [];

      // Listen for failed requests
      page.on('requestfailed', request => {
        failedRequests.push(request.url());
      });

      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Filter out external resources that might legitimately fail
      const localFailedRequests = failedRequests.filter(url => {
        const urlObj = new URL(url);
        return urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1';
      });

      // Should have no failed local asset requests
      expect(localFailedRequests).toHaveLength(0);
    });
  });
});
