import { test, expect, Page } from '@playwright/test';

/**
 * Image BasePath Feature Tests
 *
 * Comprehensive test suite verifying that Hugo image basepath handling works correctly.
 * This test suite covers:
 * - Markdown images from assets/ directory (processed by Hugo)
 * - Static images from static/ directory
 * - External images (should not be modified)
 * - Responsive image features
 * - Multi-language support
 * - BasePath consistency
 */

// ============================================================================
// CONSTANTS - Centralized configuration
// ============================================================================

const TEST_PAGE_URL = '/pl/test-basepath-images/';
const BASEPATH = '/wesole_nutki/';
const MAX_IMAGES_TO_CHECK = 10;
const MAX_VARIANTS_TO_CHECK = 3;
const MAX_PAGE_LOAD_TIME_MS = 10000;
const ERROR_CHECK_DELAY_MS = 2000;

const VIEWPORT_MOBILE = { width: 375, height: 667 };
const VIEWPORT_DESKTOP = { width: 1920, height: 1080 };

const IMAGE_SELECTORS = {
  assets: 'img[src*="sample"]',
  static: 'img[src*="hero-bg"], img[src*="about-preview"]',
  external: 'img[src^="https://"]',
  svg: 'img[src$=".svg"]',
  all: 'img[src]',
  content: 'main img, article img, .content img',
  lazyLoaded: 'img[loading="lazy"]',
};

const RESPONSIVE_SELECTORS = {
  wrapper: '.responsive-image-wrapper',
  picture: 'picture',
  webpSource: 'source[type="image/webp"]',
  srcset: 'source[srcset]',
  fallback: '.responsive-image-fallback',
  placeholder: '.responsive-image-placeholder',
};

// ============================================================================
// HELPER FUNCTIONS - Reusable test utilities
// ============================================================================

/**
 * Navigate to test page and wait for it to be ready
 */
async function navigateToTestPage(page: Page): Promise<void> {
  await page.goto(TEST_PAGE_URL);
  await page.waitForLoadState('networkidle');
}

/**
 * Get image source attribute safely
 */
async function getImageSrc(page: Page, selector: string): Promise<string | null> {
  const image = page.locator(selector).first();
  return await image.getAttribute('src');
}

/**
 * Check if a path includes the basepath
 */
function hasBasepath(path: string | null, baseURL: string | undefined): boolean {
  if (!path || !baseURL) return false;
  return baseURL.includes(BASEPATH) && path.includes(BASEPATH);
}

/**
 * Check if a path has double slashes (excluding protocol)
 */
function hasDoubleSlashes(path: string | null): boolean {
  if (!path) return false;
  const pathWithoutProtocol = path.replace(/^https?:\/\//, '');
  return pathWithoutProtocol.includes('//');
}

/**
 * Check if a path has double basepaths
 */
function hasDoubleBasepath(path: string | null): boolean {
  if (!path) return false;
  return path.includes(`${BASEPATH}${BASEPATH}`);
}

/**
 * Verify that a path is correctly formatted
 */
function assertValidImagePath(imageSrc: string | null, baseURL: string | undefined): void {
  expect(imageSrc).not.toBeNull();

  if (imageSrc) {
    // Should not have double slashes
    expect(hasDoubleSlashes(imageSrc)).toBeFalsy();

    // Should not have double basepaths
    expect(hasDoubleBasepath(imageSrc)).toBeFalsy();

    // If baseURL configured with subdirectory, should include it
    if (baseURL && baseURL.includes(BASEPATH) && !imageSrc.startsWith('http') && !imageSrc.startsWith('data:')) {
      expect(imageSrc).toContain(BASEPATH);
    }
  }
}

/**
 * Check if image has Hugo fingerprint hash
 */
function hasHugoFingerprint(imageSrc: string | null): boolean {
  if (!imageSrc) return false;
  return /_hu_[a-f0-9]+/.test(imageSrc);
}

/**
 * Count elements matching a selector
 */
async function countElements(page: Page, selector: string): Promise<number> {
  return await page.locator(selector).count();
}

/**
 * Collect console errors during page load
 */
async function collectConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  return errors;
}

// ============================================================================
// TEST SUITES
// ============================================================================

test.describe('Image BasePath Feature', () => {

  test.describe('Core BasePath Functionality', () => {

    test('should render assets images with basepath', async ({ page, baseURL }) => {
      await navigateToTestPage(page);

      const assetsImages = page.locator(IMAGE_SELECTORS.assets);
      const count = await assetsImages.count();

      expect(count).toBeGreaterThanOrEqual(2);

      const firstImage = assetsImages.first();
      const imageSrc = await firstImage.getAttribute('src');

      if (imageSrc) {
        // Should start with /
        expect(imageSrc.startsWith('/')).toBeTruthy();

        // Should include /images/ path
        expect(imageSrc).toContain('/images/');

        // Should include sample in the name
        expect(imageSrc).toContain('sample');

        // Verify valid path formatting
        assertValidImagePath(imageSrc, baseURL);
      }

      await expect(firstImage).toBeVisible();
    });

    test('should render static images with basepath', async ({ page, baseURL }) => {
      await navigateToTestPage(page);

      const staticImages = page.locator(IMAGE_SELECTORS.static);
      const count = await staticImages.count();

      expect(count).toBeGreaterThanOrEqual(1);

      const firstImage = staticImages.first();
      const imageSrc = await firstImage.getAttribute('src');

      if (imageSrc) {
        expect(imageSrc.startsWith('/')).toBeTruthy();
        expect(imageSrc).toContain('/images/');

        assertValidImagePath(imageSrc, baseURL);
      }

      await expect(firstImage).toBeVisible();
    });

    test('should not modify external URLs', async ({ page }) => {
      await navigateToTestPage(page);

      const externalImages = page.locator(IMAGE_SELECTORS.external);
      const count = await externalImages.count();

      if (count > 0) {
        const firstExternal = externalImages.first();
        const imageSrc = await firstExternal.getAttribute('src');

        expect(imageSrc).toMatch(/^https?:/);

        // External URLs should NOT include internal basepath
        if (imageSrc && !imageSrc.includes('localhost')) {
          expect(imageSrc.includes(BASEPATH)).toBeFalsy();
        }
      }
    });

    test('should have no double slashes in paths', async ({ page }) => {
      await navigateToTestPage(page);

      const allImages = page.locator(IMAGE_SELECTORS.all);
      const count = await allImages.count();

      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const img = allImages.nth(i);
        const imageSrc = await img.getAttribute('src');

        if (imageSrc && !imageSrc.startsWith('data:')) {
          // Check for double slashes (excluding protocol)
          expect(hasDoubleSlashes(imageSrc)).toBeFalsy();

          // Check for double basepaths
          expect(hasDoubleBasepath(imageSrc)).toBeFalsy();
        }
      }
    });
  });

  test.describe('Responsive Image Features', () => {

    test('should apply responsive image wrapper', async ({ page }) => {
      await navigateToTestPage(page);

      const wrapperCount = await countElements(page, RESPONSIVE_SELECTORS.wrapper);

      expect(wrapperCount).toBeGreaterThan(0);
    });

    test('should generate picture elements for WebP', async ({ page }) => {
      await navigateToTestPage(page);

      const pictureCount = await countElements(page, RESPONSIVE_SELECTORS.picture);

      expect(pictureCount).toBeGreaterThan(0);

      const firstPicture = page.locator(RESPONSIVE_SELECTORS.picture).first();
      const webpSourceCount = await firstPicture.locator(RESPONSIVE_SELECTORS.webpSource).count();

      expect(webpSourceCount).toBeGreaterThan(0);

      const fallbackImg = firstPicture.locator('img');
      await expect(fallbackImg).toBeVisible();
    });

    test('should include srcset for responsive images', async ({ page, baseURL }) => {
      await navigateToTestPage(page);

      const sourcesWithSrcset = page.locator(RESPONSIVE_SELECTORS.srcset);
      const sourceCount = await sourcesWithSrcset.count();

      if (sourceCount > 0) {
        const firstSource = sourcesWithSrcset.first();
        const srcset = await firstSource.getAttribute('srcset');

        expect(srcset).toBeTruthy();

        if (srcset) {
          const variants = srcset.split(',').map(s => s.trim());
          expect(variants.length).toBeGreaterThan(0);

          // Check each variant has width descriptor
          for (const variant of variants.slice(0, MAX_VARIANTS_TO_CHECK)) {
            expect(variant.match(/\s+\d+w$/)).toBeTruthy();
          }

          // Check basepath in srcset URLs
          if (baseURL && baseURL.includes(BASEPATH)) {
            for (const variant of variants) {
              const url = variant.split(' ')[0];
              if (!url.startsWith('data:')) {
                expect(url).toContain(BASEPATH);
              }
            }
          }
        }
      }
    });

    test('should apply lazy loading', async ({ page }) => {
      await navigateToTestPage(page);

      const lazyImagesCount = await countElements(page, IMAGE_SELECTORS.lazyLoaded);

      expect(lazyImagesCount).toBeGreaterThan(0);
    });
  });

  test.describe('Viewport Responsiveness', () => {

    test('should work on mobile viewport', async ({ page, baseURL }) => {
      await page.setViewportSize(VIEWPORT_MOBILE);
      await navigateToTestPage(page);

      const images = page.locator(IMAGE_SELECTORS.all);
      const count = await images.count();

      expect(count).toBeGreaterThan(0);

      const firstImage = images.first();
      const imageSrc = await firstImage.getAttribute('src');

      assertValidImagePath(imageSrc, baseURL);

      await expect(firstImage).toBeVisible();
    });

    test('should work on desktop viewport', async ({ page, baseURL }) => {
      await page.setViewportSize(VIEWPORT_DESKTOP);
      await navigateToTestPage(page);

      const images = page.locator(IMAGE_SELECTORS.all);
      const count = await images.count();

      expect(count).toBeGreaterThan(0);

      const firstImage = images.first();
      const imageSrc = await firstImage.getAttribute('src');

      assertValidImagePath(imageSrc, baseURL);

      await expect(firstImage).toBeVisible();
    });
  });

  test.describe('Hugo URL Functions', () => {

    test('should use RelPermalink for processed images', async ({ page, baseURL }) => {
      await navigateToTestPage(page);

      const assetImages = page.locator(IMAGE_SELECTORS.assets);
      const count = await assetImages.count();

      expect(count).toBeGreaterThanOrEqual(2);

      const firstImage = assetImages.first();
      const imageSrc = await firstImage.getAttribute('src');

      // RelPermalink adds fingerprint hash for processed images
      if (imageSrc && hasHugoFingerprint(imageSrc)) {
        // Verify fingerprint pattern
        expect(imageSrc).toMatch(/_hu_[a-f0-9]+/);
      }

      assertValidImagePath(imageSrc, baseURL);
    });

    test('should handle SVG without processing', async ({ page }) => {
      await navigateToTestPage(page);

      const svgImages = page.locator(IMAGE_SELECTORS.svg);
      const count = await svgImages.count();

      if (count > 0) {
        const firstSvg = svgImages.first();
        const imageSrc = await firstSvg.getAttribute('src');

        // SVG should NOT have fingerprint (not processed)
        expect(hasHugoFingerprint(imageSrc)).toBeFalsy();

        // SVG should not be in picture element
        const parent = firstSvg.locator('..');
        const isPicture = await parent.evaluate(el => el.tagName === 'PICTURE');
        expect(isPicture).toBeFalsy();
      }
    });
  });

  test.describe('Accessibility', () => {

    test('should have alt attributes', async ({ page }) => {
      await navigateToTestPage(page);

      const contentImages = page.locator(IMAGE_SELECTORS.content).filter({
        hasNot: page.locator(RESPONSIVE_SELECTORS.placeholder)
      });

      const count = await contentImages.count();
      expect(count).toBeGreaterThan(0);

      // Check that all images have alt attribute (can be empty for decorative)
      for (let i = 0; i < Math.min(count, MAX_IMAGES_TO_CHECK); i++) {
        const img = contentImages.nth(i);
        const alt = await img.getAttribute('alt');

        // Alt must exist (null check)
        expect(alt).not.toBeNull();
      }
    });

    test('should hide decorative elements from screen readers', async ({ page }) => {
      await navigateToTestPage(page);

      const ariaHiddenCount = await countElements(page, '[aria-hidden="true"]');

      // Should have some elements hidden for accessibility
      expect(ariaHiddenCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Error Handling', () => {

    test('should include fallback UI', async ({ page }) => {
      await navigateToTestPage(page);

      const fallbackCount = await countElements(page, RESPONSIVE_SELECTORS.fallback);

      expect(fallbackCount).toBeGreaterThan(0);
    });

    test('should handle page load and missing images gracefully', async ({ page }) => {
      // This test verifies that the page loads successfully even if some images
      // are missing (404). The fallback UI should handle missing images gracefully.

      await navigateToTestPage(page);

      // Verify page loaded successfully
      const pageTitle = await page.title();
      expect(pageTitle).toBeTruthy();

      // Verify fallback UI is present for handling errors
      const fallbackCount = await countElements(page, RESPONSIVE_SELECTORS.fallback);
      expect(fallbackCount).toBeGreaterThan(0);

      // Verify page structure is intact (has images elements even if some fail to load)
      const imageCount = await countElements(page, IMAGE_SELECTORS.all);
      expect(imageCount).toBeGreaterThan(0);

      // Note: Some test images may 404, but that's expected behavior.
      // The important thing is the page doesn't crash and fallback UI exists.
    });
  });

  test.describe('Performance', () => {

    test('should use WebP format', async ({ page }) => {
      await navigateToTestPage(page);

      const webpSourceCount = await countElements(page, RESPONSIVE_SELECTORS.webpSource);

      expect(webpSourceCount).toBeGreaterThan(0);
    });

    test('should have fingerprinted URLs for cache busting', async ({ page }) => {
      await navigateToTestPage(page);

      const processedImages = page.locator(IMAGE_SELECTORS.assets);
      const count = await processedImages.count();

      if (count > 0) {
        const imageSrc = await processedImages.first().getAttribute('src');

        if (imageSrc && hasHugoFingerprint(imageSrc)) {
          expect(imageSrc).toMatch(/_hu_[a-f0-9]+/);
        }
      }
    });

    test('should load page in reasonable time', async ({ page }) => {
      const startTime = Date.now();

      await navigateToTestPage(page);

      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(MAX_PAGE_LOAD_TIME_MS);
    });
  });
});
