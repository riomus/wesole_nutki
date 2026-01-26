import { test, expect } from '@playwright/test';

/**
 * Image URL Helper Fix Tests
 *
 * These tests verify the fix for the image-url.html helper partial
 * that was causing inconsistent image path handling.
 *
 * Bug Fixed: The helper was inconsistently handling paths with/without leading slashes,
 * which could cause incorrect basepath application.
 *
 * Fix: Ensure all image paths are normalized with leading slashes before passing to relURL.
 *
 * Critical Test Cases:
 * 1. Logo images should have correct basepath
 * 2. Hero section background images should have correct basepath
 * 3. Gallery images should have correct basepath
 * 4. News/post featured images should have correct basepath
 * 5. No image URLs should have double basepath
 * 6. Inline style background-image URLs should be correct
 */

test.describe('Image URL Helper Fix - Logo and Header Images', () => {
  test('should have correct basepath in logo image', async ({ page }) => {
    await page.goto('/pl/');

    // Find logo image
    const logo = page.locator('img[alt*="logo"], img[class*="logo"], .navbar-brand img').first();
    const count = await logo.count();

    if (count > 0) {
      const src = await logo.getAttribute('src');
      
      if (src) {
        // Should have basepath
        expect(src).toMatch(/^\/wesole_nutki\//);
        
        // Should NOT have double basepath
        expect(src).not.toContain('/wesole_nutki/wesole_nutki/');
        
        // Should point to images directory
        expect(src).toMatch(/\/images\//);
      }
    }
  });

  test('should load logo image successfully', async ({ page }) => {
    await page.goto('/pl/');

    const logo = page.locator('img[alt*="logo"], img[class*="logo"], .navbar-brand img').first();
    const count = await logo.count();

    if (count > 0) {
      // Wait for image to load
      await logo.waitFor({ state: 'visible' });
      
      // Check if image loaded (has natural width/height)
      const isLoaded = await logo.evaluate((img: HTMLImageElement) => {
        return img.complete && img.naturalHeight !== 0;
      });
      
      expect(isLoaded).toBe(true);
    }
  });
});

test.describe('Image URL Helper Fix - Hero Section Images', () => {
  test('should have correct basepath in hero background images', async ({ page }) => {
    await page.goto('/pl/');

    // Check inline background-image styles
    const heroSection = page.locator('[data-testid="hero-section"], .hero, section:first-of-type');
    const count = await heroSection.count();

    if (count > 0) {
      const style = await heroSection.first().getAttribute('style');
      
      if (style && style.includes('background-image')) {
        // Extract URL from style
        const urlMatch = style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
        
        if (urlMatch && urlMatch[1]) {
          const bgUrl = urlMatch[1];
          
          // Should have basepath
          expect(bgUrl).toMatch(/^\/wesole_nutki\//);
          
          // Should NOT have double basepath
          expect(bgUrl).not.toContain('/wesole_nutki/wesole_nutki/');
        }
      }
    }
  });

  test('should have correct basepath in hero image elements', async ({ page }) => {
    await page.goto('/pl/');

    const heroImages = page.locator('[data-testid="hero-section"] img, .hero img, section:first-of-type img');
    const count = await heroImages.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const src = await heroImages.nth(i).getAttribute('src');
        
        if (src && !src.startsWith('data:')) {
          // Should have basepath
          expect(src).toMatch(/^\/wesole_nutki\//);
          
          // Should NOT have double basepath
          expect(src).not.toContain('/wesole_nutki/wesole_nutki/');
        }
      }
    }
  });
});

test.describe('Image URL Helper Fix - Gallery Images', () => {
  test('should have correct basepath in gallery page images', async ({ page }) => {
    await page.goto('/pl/gallery/');

    const galleryImages = page.locator('.gallery-item img, .gallery img, img[class*="gallery"]');
    const count = await galleryImages.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 10); i++) {
        const src = await galleryImages.nth(i).getAttribute('src');
        const srcset = await galleryImages.nth(i).getAttribute('srcset');
        
        // Check src attribute
        if (src && !src.startsWith('data:')) {
          expect(src).toMatch(/^\/wesole_nutki\//);
          expect(src).not.toContain('/wesole_nutki/wesole_nutki/');
        }
        
        // Check srcset attribute
        if (srcset) {
          const srcsetUrls = srcset.split(',').map(s => s.trim().split(' ')[0]);
          
          for (const url of srcsetUrls) {
            if (!url.startsWith('data:')) {
              expect(url).toMatch(/^\/wesole_nutki\//);
              expect(url).not.toContain('/wesole_nutki/wesole_nutki/');
            }
          }
        }
      }
    }
  });

  test('should load gallery images successfully', async ({ page }) => {
    await page.goto('/pl/gallery/');

    const galleryImages = page.locator('.gallery-item img, .gallery img').first();
    const count = await galleryImages.count();

    if (count > 0) {
      // Wait for first image to load
      await galleryImages.waitFor({ state: 'visible', timeout: 5000 });
      
      const isLoaded = await galleryImages.evaluate((img: HTMLImageElement) => {
        return img.complete && img.naturalHeight !== 0;
      });
      
      expect(isLoaded).toBe(true);
    }
  });
});

test.describe('Image URL Helper Fix - News and Post Images', () => {
  test('should have correct basepath in news page featured images', async ({ page }) => {
    await page.goto('/pl/news/');

    const newsImages = page.locator('.news-card img, .post-card img, article img');
    const count = await newsImages.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 10); i++) {
        const src = await newsImages.nth(i).getAttribute('src');
        
        if (src && !src.startsWith('data:')) {
          expect(src).toMatch(/^\/wesole_nutki\//);
          expect(src).not.toContain('/wesole_nutki/wesole_nutki/');
        }
      }
    }
  });

  test('should have correct basepath in post content images', async ({ page }) => {
    // Navigate to first news post if available
    await page.goto('/pl/news/');
    
    const firstPost = page.locator('.news-card a, .post-card a, article a').first();
    const count = await firstPost.count();

    if (count > 0) {
      await firstPost.click();
      await page.waitForLoadState('networkidle');

      // Check images in post content
      const contentImages = page.locator('article img, .content img, .post-content img');
      const imageCount = await contentImages.count();

      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const src = await contentImages.nth(i).getAttribute('src');
        
        if (src && !src.startsWith('data:')) {
          expect(src).toMatch(/^\/wesole_nutki\//);
          expect(src).not.toContain('/wesole_nutki/wesole_nutki/');
        }
      }
    }
  });
});

test.describe('Image URL Helper Fix - Responsive Images', () => {
  test('should have correct basepath in picture source elements', async ({ page }) => {
    await page.goto('/pl/');

    const pictureSources = page.locator('picture source[srcset]');
    const count = await pictureSources.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 10); i++) {
        const srcset = await pictureSources.nth(i).getAttribute('srcset');
        
        if (srcset) {
          const srcsetUrls = srcset.split(',').map(s => s.trim().split(' ')[0]);
          
          for (const url of srcsetUrls) {
            if (!url.startsWith('data:')) {
              expect(url).toMatch(/^\/wesole_nutki\//);
              expect(url).not.toContain('/wesole_nutki/wesole_nutki/');
            }
          }
        }
      }
    }
  });

  test('should have correct basepath in img srcset attributes', async ({ page }) => {
    await page.goto('/pl/');

    const images = page.locator('img[srcset]');
    const count = await images.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 10); i++) {
        const srcset = await images.nth(i).getAttribute('srcset');
        
        if (srcset) {
          const srcsetUrls = srcset.split(',').map(s => s.trim().split(' ')[0]);
          
          for (const url of srcsetUrls) {
            if (!url.startsWith('data:')) {
              expect(url).toMatch(/^\/wesole_nutki\//);
              expect(url).not.toContain('/wesole_nutki/wesole_nutki/');
            }
          }
        }
      }
    }
  });
});

test.describe('Image URL Helper Fix - All Images Scan', () => {
  test('should NOT have double basepath in ANY image on homepage', async ({ page }) => {
    await page.goto('/pl/');

    // Get ALL images
    const allImages = page.locator('img[src]');
    const count = await allImages.count();

    const doubleBasepathImages: string[] = [];

    for (let i = 0; i < count; i++) {
      const src = await allImages.nth(i).getAttribute('src');
      
      if (src && src.includes('/wesole_nutki/wesole_nutki/')) {
        doubleBasepathImages.push(src);
      }
    }

    expect(doubleBasepathImages).toEqual([]);
  });

  test('should NOT have double basepath in ANY background image on homepage', async ({ page }) => {
    await page.goto('/pl/');

    // Get all elements with inline background-image styles
    const allElements = page.locator('[style*="background-image"]');
    const count = await allElements.count();

    const doubleBasepathBgImages: string[] = [];

    for (let i = 0; i < count; i++) {
      const style = await allElements.nth(i).getAttribute('style');
      
      if (style) {
        const urlMatch = style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
        
        if (urlMatch && urlMatch[1]) {
          const bgUrl = urlMatch[1];
          
          if (bgUrl.includes('/wesole_nutki/wesole_nutki/')) {
            doubleBasepathBgImages.push(bgUrl);
          }
        }
      }
    }

    expect(doubleBasepathBgImages).toEqual([]);
  });

  test('should have basepath in all internal images on homepage', async ({ page }) => {
    await page.goto('/pl/');

    // Get all images that should have basepath (not external or data URIs)
    const internalImages = page.locator('img[src^="/"]');
    const count = await internalImages.count();

    const missingBasepath: string[] = [];

    for (let i = 0; i < count; i++) {
      const src = await internalImages.nth(i).getAttribute('src');
      
      if (src && !src.startsWith('/wesole_nutki/')) {
        missingBasepath.push(src);
      }
    }

    expect(missingBasepath).toEqual([]);
  });
});

test.describe('Image URL Helper Fix - Favicon and Icons', () => {
  test('should have correct basepath in favicon', async ({ page }) => {
    await page.goto('/pl/');

    const favicon = page.locator('link[rel="icon"], link[rel="shortcut icon"]');
    const count = await favicon.count();

    if (count > 0) {
      const href = await favicon.first().getAttribute('href');
      
      if (href && !href.startsWith('data:')) {
        expect(href).toMatch(/^\/wesole_nutki\//);
        expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
      }
    }
  });

  test('should have correct basepath in apple-touch-icon', async ({ page }) => {
    await page.goto('/pl/');

    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
    const count = await appleTouchIcon.count();

    if (count > 0) {
      const href = await appleTouchIcon.first().getAttribute('href');
      
      if (href && !href.startsWith('data:')) {
        expect(href).toMatch(/^\/wesole_nutki\//);
        expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
      }
    }
  });

  test('should have correct basepath in manifest icons', async ({ page }) => {
    await page.goto('/pl/');

    const manifest = page.locator('link[rel="manifest"]');
    const count = await manifest.count();

    if (count > 0) {
      const href = await manifest.getAttribute('href');
      
      if (href) {
        expect(href).toMatch(/^\/wesole_nutki\//);
        expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
      }
    }
  });
});

test.describe('Image URL Helper Fix - Open Graph Images', () => {
  test('should have correct basepath in og:image meta tag', async ({ page }) => {
    await page.goto('/pl/');

    const ogImage = page.locator('meta[property="og:image"]');
    const count = await ogImage.count();

    if (count > 0) {
      const content = await ogImage.getAttribute('content');
      
      if (content) {
        // OG images should be absolute URLs
        expect(content).toMatch(/^https?:\/\//);
        
        // Should contain basepath in the full URL
        expect(content).toContain('/wesole_nutki/');
        
        // Should NOT have double basepath
        expect(content).not.toContain('/wesole_nutki/wesole_nutki/');
      }
    }
  });

  test('should have correct basepath in twitter:image meta tag', async ({ page }) => {
    await page.goto('/pl/');

    const twitterImage = page.locator('meta[name="twitter:image"]');
    const count = await twitterImage.count();

    if (count > 0) {
      const content = await twitterImage.getAttribute('content');
      
      if (content) {
        // Twitter images should be absolute URLs
        expect(content).toMatch(/^https?:\/\//);
        
        // Should contain basepath in the full URL
        expect(content).toContain('/wesole_nutki/');
        
        // Should NOT have double basepath
        expect(content).not.toContain('/wesole_nutki/wesole_nutki/');
      }
    }
  });
});
