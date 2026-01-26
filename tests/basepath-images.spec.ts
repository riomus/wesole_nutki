import { test, expect } from '@playwright/test';

/**
 * Basepath Image Path E2E Tests
 *
 * Verifies that images are correctly resolved with basepath configuration.
 * Tests both standard localhost:1313 and basepath localhost:1313/wesole_nutki/
 *
 * Run with basepath: BASEPATH=true npm run test:e2e
 * Run without basepath: npm run test:e2e
 */

// Determine if we're running with basepath from environment or config
const useBasePath = process.env.BASEPATH === 'true';
const basePath = useBasePath ? '/wesole_nutki' : '';

test.describe('Image Paths with Basepath', () => {
  test.describe('Gallery Images', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/gallery/codzienne-zajecia/');
      await page.waitForLoadState('networkidle');
    });

    test('should load gallery images with correct paths', async ({ page }) => {
      // Get all gallery images
      const galleryImages = page.locator('.gallery-image');
      const imageCount = await galleryImages.count();

      expect(imageCount).toBeGreaterThan(0);

      // Check each image has a valid src and loads successfully
      for (let i = 0; i < imageCount; i++) {
        const image = galleryImages.nth(i);

        // Get the src attribute
        const src = await image.getAttribute('src');
        expect(src).toBeTruthy();

        // Verify basepath is included if configured
        if (useBasePath) {
          expect(src).toMatch(new RegExp(`^${basePath}/`));
        }

        // Image should be visible (successfully loaded)
        await expect(image).toBeVisible({ timeout: 10000 });
      }
    });

    test('should have valid srcset attributes on responsive images', async ({ page }) => {
      // Find images with srcset (responsive images)
      const responsiveImages = page.locator('source[srcset]');
      const sourceCount = await responsiveImages.count();

      if (sourceCount > 0) {
        // Check first source element
        const firstSource = responsiveImages.first();
        const srcset = await firstSource.getAttribute('srcset');

        expect(srcset).toBeTruthy();

        // Parse srcset and verify each URL
        const srcsetEntries = srcset!.split(',').map(s => s.trim());

        for (const entry of srcsetEntries) {
          const [url] = entry.split(' ');

          // Verify basepath is included if configured
          if (useBasePath) {
            expect(url).toMatch(new RegExp(`^${basePath}/`));
          }

          // URL should not be a relative path without basepath
          expect(url).toMatch(/^\/[^/]/);
        }
      }
    });

    test('should open lightbox with correctly pathed images', async ({ page }) => {
      // Click first gallery image
      const firstImageLink = page.locator('.glightbox').first();
      const lightboxHref = await firstImageLink.getAttribute('href');

      expect(lightboxHref).toBeTruthy();

      // Verify basepath in lightbox href
      if (useBasePath) {
        expect(lightboxHref).toMatch(new RegExp(`^${basePath}/`));
      }

      // Open lightbox
      await firstImageLink.click();
      await expect(page.locator('.goverlay')).toBeVisible({ timeout: 5000 });

      // Wait for lightbox image to load
      await page.waitForTimeout(1000);

      // Verify lightbox image is loaded
      const lightboxImage = page.locator('.glightbox-container img').first();
      const lightboxSrc = await lightboxImage.getAttribute('src');

      expect(lightboxSrc).toBeTruthy();

      if (useBasePath) {
        expect(lightboxSrc).toMatch(new RegExp(`^${basePath}/`));
      }
    });
  });

  test.describe('Gallery List Images', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/gallery/');
      await page.waitForLoadState('networkidle');
    });

    test('should load gallery card images with correct paths', async ({ page }) => {
      // Get all images in gallery cards
      const cardImages = page.locator('.gallery-card img');
      const imageCount = await cardImages.count();

      if (imageCount > 0) {
        // Check first image
        const firstImage = cardImages.first();
        const src = await firstImage.getAttribute('src');

        expect(src).toBeTruthy();

        // Verify basepath
        if (useBasePath) {
          expect(src).toMatch(new RegExp(`^${basePath}/`));
        }

        // Image should be visible
        await expect(firstImage).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('News Images', () => {
    test('should load news article images with correct paths', async ({ page }) => {
      // Navigate to news list
      await page.goto('/pl/news/');
      await page.waitForLoadState('networkidle');

      // Find news cards with images
      const newsImages = page.locator('.news-card img, .card-img-top');
      const imageCount = await newsImages.count();

      if (imageCount > 0) {
        // Check first news image
        const firstImage = newsImages.first();
        const src = await firstImage.getAttribute('src');

        expect(src).toBeTruthy();

        // Verify basepath
        if (useBasePath) {
          expect(src).toMatch(new RegExp(`^${basePath}/`));
        }

        // Image should be visible
        await expect(firstImage).toBeVisible({ timeout: 10000 });
      }
    });

    test('should load featured image on news single page', async ({ page }) => {
      // Navigate to a specific news article
      await page.goto('/pl/news/');
      await page.waitForLoadState('networkidle');

      // Click first news article if available
      const firstNewsLink = page.locator('.news-card a, .card a').first();
      const hasNews = await firstNewsLink.count() > 0;

      if (hasNews) {
        await firstNewsLink.click();
        await page.waitForLoadState('networkidle');

        // Check for featured images in article
        const articleImages = page.locator('article img, .news-content img');
        const imageCount = await articleImages.count();

        if (imageCount > 0) {
          const firstImage = articleImages.first();
          const src = await firstImage.getAttribute('src');

          expect(src).toBeTruthy();

          // Verify basepath
          if (useBasePath) {
            expect(src).toMatch(new RegExp(`^${basePath}/`));
          }
        }
      }
    });
  });

  test.describe('Hero Background Images', () => {
    test('should load hero background image with correct path', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Check if hero section has background image
      const heroSection = page.locator('[data-testid="hero-section"].hero-bg-image');
      const hasHeroBg = await heroSection.count() > 0;

      if (hasHeroBg) {
        const style = await heroSection.getAttribute('style');

        expect(style).toBeTruthy();

        // Extract background-image URL from style
        const bgImageMatch = style!.match(/background-image:\s*url\(['"]?([^'"()]+)['"]?\)/);

        if (bgImageMatch) {
          const bgImageUrl = bgImageMatch[1];

          // Verify basepath
          if (useBasePath) {
            expect(bgImageUrl).toMatch(new RegExp(`^${basePath}/`));
          }

          // URL should be absolute path
          expect(bgImageUrl).toMatch(/^\//);
        }
      }
    });
  });

  test.describe('About Page Images', () => {
    test('should load team member images with correct paths', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      // Look for team member images or other content images
      const contentImages = page.locator('main img, .about-content img, .team-member img');
      const imageCount = await contentImages.count();

      if (imageCount > 0) {
        const firstImage = contentImages.first();
        const src = await firstImage.getAttribute('src');

        expect(src).toBeTruthy();

        // Verify basepath
        if (useBasePath) {
          expect(src).toMatch(new RegExp(`^${basePath}/`));
        }

        // Image should be visible
        await expect(firstImage).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Image Loading and Error Handling', () => {
    test('should not have broken images on homepage', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Get all images on the page
      const allImages = page.locator('img');
      const imageCount = await allImages.count();

      // Track broken images
      const brokenImages: string[] = [];

      for (let i = 0; i < imageCount; i++) {
        const image = allImages.nth(i);
        const src = await image.getAttribute('src');

        if (!src) continue;

        // Check if image has loaded successfully
        const naturalWidth = await image.evaluate((img: HTMLImageElement) => img.naturalWidth);

        if (naturalWidth === 0) {
          brokenImages.push(src);
        }
      }

      // Report any broken images
      if (brokenImages.length > 0) {
        console.log('Broken images found:', brokenImages);
      }

      // Expect no broken images
      expect(brokenImages.length).toBe(0);
    });

    test('should handle image errors gracefully', async ({ page }) => {
      await page.goto('/pl/gallery/codzienne-zajecia/');
      await page.waitForLoadState('networkidle');

      // Check for error fallback UI (if images fail to load)
      const imageWrappers = page.locator('.responsive-image-wrapper');
      const wrapperCount = await imageWrappers.count();

      for (let i = 0; i < wrapperCount; i++) {
        const wrapper = imageWrappers.nth(i);
        const hasErrorClass = await wrapper.evaluate((el) => el.classList.contains('image-error'));

        // If there's an error class, fallback UI should be present
        if (hasErrorClass) {
          const fallback = wrapper.locator('.responsive-image-fallback');
          await expect(fallback).toBeVisible();
        }
      }
    });
  });

  test.describe('Cross-browser Image Compatibility', () => {
    test('should support WebP images where available', async ({ page, browserName }) => {
      await page.goto('/pl/gallery/codzienne-zajecia/');
      await page.waitForLoadState('networkidle');

      // Look for picture elements with WebP sources
      const webpSources = page.locator('source[type="image/webp"]');
      const webpCount = await webpSources.count();

      if (webpCount > 0) {
        const firstWebpSource = webpSources.first();
        const srcset = await firstWebpSource.getAttribute('srcset');

        expect(srcset).toBeTruthy();

        // All WebP URLs should have correct basepath
        if (useBasePath) {
          const urls = srcset!.split(',').map(s => s.trim().split(' ')[0]);
          for (const url of urls) {
            expect(url).toMatch(new RegExp(`^${basePath}/`));
          }
        }
      }
    });

    test('should fallback to original format when WebP unavailable', async ({ page }) => {
      await page.goto('/pl/gallery/codzienne-zajecia/');
      await page.waitForLoadState('networkidle');

      // Look for picture elements
      const pictures = page.locator('picture');
      const pictureCount = await pictures.count();

      if (pictureCount > 0) {
        const firstPicture = pictures.first();

        // Should have fallback img element
        const fallbackImg = firstPicture.locator('img');
        await expect(fallbackImg).toBeVisible();

        const src = await fallbackImg.getAttribute('src');
        expect(src).toBeTruthy();

        // Verify basepath on fallback
        if (useBasePath) {
          expect(src).toMatch(new RegExp(`^${basePath}/`));
        }
      }
    });
  });

  test.describe('Responsive Image Loading', () => {
    test('should load appropriate image sizes on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/pl/gallery/codzienne-zajecia/');
      await page.waitForLoadState('networkidle');

      // Check images load with mobile viewport
      const images = page.locator('.gallery-image').first();
      await expect(images).toBeVisible({ timeout: 10000 });

      const src = await images.getAttribute('src');
      expect(src).toBeTruthy();

      // Verify basepath
      if (useBasePath) {
        expect(src).toMatch(new RegExp(`^${basePath}/`));
      }
    });

    test('should load appropriate image sizes on desktop viewport', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/pl/gallery/codzienne-zajecia/');
      await page.waitForLoadState('networkidle');

      // Check images load with desktop viewport
      const images = page.locator('.gallery-image').first();
      await expect(images).toBeVisible({ timeout: 10000 });

      const src = await images.getAttribute('src');
      expect(src).toBeTruthy();

      // Verify basepath
      if (useBasePath) {
        expect(src).toMatch(new RegExp(`^${basePath}/`));
      }
    });
  });
});

test.describe('Image Path Consistency Across Languages', () => {
  test('should load images correctly on Polish pages', async ({ page }) => {
    await page.goto('/pl/gallery/codzienne-zajecia/');
    await page.waitForLoadState('networkidle');

    const images = page.locator('.gallery-image');
    const imageCount = await images.count();

    expect(imageCount).toBeGreaterThan(0);

    const firstImageSrc = await images.first().getAttribute('src');
    expect(firstImageSrc).toBeTruthy();

    // Verify basepath
    if (useBasePath) {
      expect(firstImageSrc).toMatch(new RegExp(`^${basePath}/`));
    }
  });

  test('should load images correctly on English pages', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');

    // Check for any images on English homepage
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      const firstImage = images.first();
      const src = await firstImage.getAttribute('src');

      if (src) {
        // Verify basepath
        if (useBasePath) {
          expect(src).toMatch(new RegExp(`^${basePath}/`));
        }
      }
    }
  });

  test('should maintain correct image paths when switching languages', async ({ page }) => {
    // Start on Polish page
    await page.goto('/pl/gallery/');
    await page.waitForLoadState('networkidle');

    // Get image src on Polish page
    const plImage = page.locator('.gallery-card img').first();
    const hasImages = await plImage.count() > 0;

    if (hasImages) {
      const plSrc = await plImage.getAttribute('src');

      // Switch to English
      const enButton = page.locator('.site-header .lang-btn').filter({
        has: page.locator('.lang-code', { hasText: 'EN' })
      });
      await enButton.click();
      await page.waitForLoadState('networkidle');

      // Check image paths are still correct on English page
      const enImage = page.locator('img').first();
      const enImageCount = await enImage.count();

      if (enImageCount > 0) {
        const enSrc = await enImage.getAttribute('src');

        if (enSrc) {
          // Both should have same basepath
          if (useBasePath) {
            expect(plSrc).toMatch(new RegExp(`^${basePath}/`));
            expect(enSrc).toMatch(new RegExp(`^${basePath}/`));
          }
        }
      }
    }
  });
});
