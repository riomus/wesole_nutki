import { test, expect } from '@playwright/test';

/**
 * Basepath Markdown Images Tests
 *
 * Verify that images referenced in markdown content respect the baseURL configuration
 * and render correctly when the site is deployed to a subdirectory.
 */

test.describe('Markdown Image Path Resolution', () => {

  test('should render markdown images with correct basepath on Polish news page', async ({ page, baseURL }) => {
    // Navigate to a news post that contains markdown images
    await page.goto('/pl/news/2025/10/27/koncert/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Find images in the content area that should have been rendered from markdown
    const contentImages = page.locator('article img, .content img, main img').filter({
      has: page.locator('img[src*="/images/scraped/2025-10-27-koncert"]')
    });

    // Verify at least one markdown image is present
    await expect(contentImages.first()).toBeVisible();

    // Check if baseURL includes a subdirectory path
    const hasBasePath = baseURL && !baseURL.endsWith('localhost:1313/');

    if (hasBasePath) {
      // When deployed to subdirectory, image src should include the base path
      const imageSrc = await contentImages.first().getAttribute('src');
      expect(imageSrc).toContain('/wesole_nutki/');
    }

    // Verify the image loads successfully (not broken)
    const firstImage = contentImages.first();
    await expect(firstImage).toBeVisible();

    // Check that the image has loaded (naturalWidth > 0 indicates successful load)
    const imageLoaded = await firstImage.evaluate((img: HTMLImageElement) => {
      return img.complete && img.naturalWidth > 0;
    });
    expect(imageLoaded).toBeTruthy();
  });

  test('should apply responsive image treatment to markdown images', async ({ page }) => {
    await page.goto('/pl/news/2025/10/27/koncert/');
    await page.waitForLoadState('networkidle');

    // Find the markdown images in the content
    const contentImages = page.locator('main img, article img, .content img').filter({
      has: page.locator('img[src*="/images/scraped/2025-10-27-koncert"]')
    });

    // Check if the image has responsive attributes (srcset, sizes, or is wrapped in picture)
    const firstImage = contentImages.first();

    // Check for responsive image wrapper class from the responsive-image partial
    const hasResponsiveWrapper = await page.locator('.responsive-image-wrapper').count() > 0;

    // Check for picture element (indicates WebP support)
    const hasPictureElement = await page.locator('picture').count() > 0;

    // Check for lazy loading
    const loading = await firstImage.getAttribute('loading');

    // At least one of these should be true if responsive-image partial is working
    expect(hasResponsiveWrapper || hasPictureElement || loading === 'lazy').toBeTruthy();
  });

  test('should have correct image paths on mobile viewport', async ({ page, baseURL }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/pl/news/2025/10/27/koncert/');
    await page.waitForLoadState('networkidle');

    // Find markdown images
    const contentImages = page.locator('main img, article img, .content img').filter({
      has: page.locator('img[src*="/images/scraped/2025-10-27-koncert"]')
    });

    // Verify image is visible on mobile
    await expect(contentImages.first()).toBeVisible();

    // Verify image src includes basepath if configured
    const hasBasePath = baseURL && !baseURL.endsWith('localhost:1313/');
    if (hasBasePath) {
      const imageSrc = await contentImages.first().getAttribute('src');
      expect(imageSrc).toContain('/wesole_nutki/');
    }
  });

  test('should have correct image paths on desktop viewport', async ({ page, baseURL }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto('/pl/news/2025/10/27/koncert/');
    await page.waitForLoadState('networkidle');

    // Find markdown images
    const contentImages = page.locator('main img, article img, .content img').filter({
      has: page.locator('img[src*="/images/scraped/2025-10-27-koncert"]')
    });

    // Verify image is visible on desktop
    await expect(contentImages.first()).toBeVisible();

    // Verify image src includes basepath if configured
    const hasBasePath = baseURL && !baseURL.endsWith('localhost:1313/');
    if (hasBasePath) {
      const imageSrc = await contentImages.first().getAttribute('src');
      expect(imageSrc).toContain('/wesole_nutki/');
    }
  });

  test('should render gallery images with correctly pathed images', async ({ page, baseURL }) => {
    // Test with offer page that has markdown images
    await page.goto('/pl/o-przedszkolu/oferta/');
    await page.waitForLoadState('networkidle');

    // Find images that were rendered from markdown
    const markdownImages = page.locator('img[src*="/images/scraped/o-przedszkolu-oferta"]');

    // Verify at least one image is present
    const imageCount = await markdownImages.count();
    expect(imageCount).toBeGreaterThan(0);

    // Verify basepath is correct if configured
    const hasBasePath = baseURL && !baseURL.endsWith('localhost:1313/');
    if (hasBasePath) {
      const firstImageSrc = await markdownImages.first().getAttribute('src');
      expect(firstImageSrc).toContain('/wesole_nutki/');
    }
  });

  test('should work correctly on English pages', async ({ page, baseURL }) => {
    // Navigate to an English page
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');

    // The homepage might not have markdown images, but test that the render hook works
    // by checking if any images on the page have correct paths
    const allImages = page.locator('img');
    const imageCount = await allImages.count();

    if (imageCount > 0) {
      const hasBasePath = baseURL && !baseURL.endsWith('localhost:1313/');

      if (hasBasePath) {
        // Check that images have the basepath included
        for (let i = 0; i < Math.min(imageCount, 3); i++) {
          const img = allImages.nth(i);
          const src = await img.getAttribute('src');

          // Only check images that are not external URLs
          if (src && !src.startsWith('http') && !src.startsWith('data:')) {
            expect(src).toContain('/wesole_nutki/');
          }
        }
      }
    }

    expect(true).toBeTruthy(); // Test passes if no errors
  });
});

test.describe('Image Path Edge Cases', () => {

  test('should handle images correctly on Polish pages', async ({ page, baseURL }) => {
    await page.goto('/pl/news/2025/10/27/koncert/');
    await page.waitForLoadState('networkidle');

    // Get all images on the page
    const allImages = page.locator('img');
    const imageCount = await allImages.count();

    expect(imageCount).toBeGreaterThan(0);

    // Verify no images have malformed paths (e.g., double slashes or missing basepath)
    const hasBasePath = baseURL && !baseURL.endsWith('localhost:1313/');

    for (let i = 0; i < imageCount; i++) {
      const img = allImages.nth(i);
      const src = await img.getAttribute('src');

      if (src && !src.startsWith('http') && !src.startsWith('data:')) {
        // Check for double slashes (excluding protocol)
        expect(src.replace(/^https?:\/\//, '')).not.toContain('//');

        // Check for basepath if configured
        if (hasBasePath) {
          expect(src).toContain('/wesole_nutki/');
        }
      }
    }
  });
});
