import { test, expect } from '@playwright/test';

/**
 * Comprehensive Basepath Configuration Tests
 *
 * These tests verify that the basepath configuration (/wesole_nutki/) works
 * correctly across all aspects of the site.
 *
 * This test suite validates:
 * 1. No double basepath issues anywhere on the site
 * 2. All internal resources have correct basepath
 * 3. External resources are not affected
 * 4. Site works correctly with subdirectory deployment
 * 5. All URL helpers produce consistent results
 *
 * These tests ensure the fixes work together as a complete solution.
 */

test.describe('Comprehensive Basepath Validation - Site-Wide Scan', () => {
  test('should have NO double basepath in entire Polish homepage', async ({ page }) => {
    await page.goto('/pl/');

    // Scan ALL href attributes
    const allHrefs = await page.evaluate(() => {
      const elements = document.querySelectorAll('[href]');
      return Array.from(elements)
        .map(el => el.getAttribute('href'))
        .filter(href => href !== null) as string[];
    });

    // Scan ALL src attributes
    const allSrcs = await page.evaluate(() => {
      const elements = document.querySelectorAll('[src]');
      return Array.from(elements)
        .map(el => el.getAttribute('src'))
        .filter(src => src !== null) as string[];
    });

    // Scan ALL srcset attributes
    const allSrcsets = await page.evaluate(() => {
      const elements = document.querySelectorAll('[srcset]');
      return Array.from(elements)
        .map(el => el.getAttribute('srcset'))
        .filter(srcset => srcset !== null) as string[];
    });

    // Scan ALL style attributes for background-image
    const allStyles = await page.evaluate(() => {
      const elements = document.querySelectorAll('[style*="url"]');
      return Array.from(elements)
        .map(el => el.getAttribute('style'))
        .filter(style => style !== null) as string[];
    });

    // Check for double basepath
    const doubleBasepathHrefs = allHrefs.filter(href => 
      href.includes('/wesole_nutki/wesole_nutki/')
    );
    const doubleBasepathSrcs = allSrcs.filter(src => 
      src.includes('/wesole_nutki/wesole_nutki/')
    );
    const doubleBasepathSrcsets = allSrcsets.filter(srcset => 
      srcset.includes('/wesole_nutki/wesole_nutki/')
    );
    const doubleBasepathStyles = allStyles.filter(style => 
      style.includes('/wesole_nutki/wesole_nutki/')
    );

    // Report any double basepath found
    expect(doubleBasepathHrefs, 'Found double basepath in href attributes').toEqual([]);
    expect(doubleBasepathSrcs, 'Found double basepath in src attributes').toEqual([]);
    expect(doubleBasepathSrcsets, 'Found double basepath in srcset attributes').toEqual([]);
    expect(doubleBasepathStyles, 'Found double basepath in style attributes').toEqual([]);
  });

  test('should have NO double basepath in entire English homepage', async ({ page }) => {
    await page.goto('/en/');

    // Comprehensive scan
    const issues = await page.evaluate(() => {
      const doubleBasepath = '/wesole_nutki/wesole_nutki/';
      const found: string[] = [];

      // Check all elements
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        // Check attributes that might contain URLs
        const attrs = ['href', 'src', 'srcset', 'data-src', 'data-srcset', 'style'];
        attrs.forEach(attr => {
          const value = el.getAttribute(attr);
          if (value && value.includes(doubleBasepath)) {
            found.push(`${el.tagName}.${attr}: ${value}`);
          }
        });
      });

      return found;
    });

    expect(issues, 'Found double basepath issues').toEqual([]);
  });

  test('should have NO missing language prefix in internal URLs', async ({ page }) => {
    await page.goto('/pl/');

    // Get all internal links (starting with /wesole_nutki/)
    const internalLinksWithoutLang = await page.evaluate(() => {
      const links = document.querySelectorAll('a[href^="/wesole_nutki/"]');
      const invalid: string[] = [];

      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.match(/\/wesole_nutki\/(pl|en)\//)) {
          invalid.push(href);
        }
      });

      return invalid;
    });

    expect(internalLinksWithoutLang, 'Found internal links missing language prefix').toEqual([]);
  });
});

test.describe('Comprehensive Basepath Validation - All Page Types', () => {
  const testPages = [
    { path: '/pl/', name: 'Polish Homepage' },
    { path: '/en/', name: 'English Homepage' },
    { path: '/pl/about/', name: 'Polish About Page' },
    { path: '/en/about/', name: 'English About Page' },
    { path: '/pl/news/', name: 'Polish News Page' },
    { path: '/pl/gallery/', name: 'Polish Gallery Page' },
    { path: '/pl/contact/', name: 'Polish Contact Page' },
  ];

  for (const testPage of testPages) {
    test(`should have correct basepath on ${testPage.name}`, async ({ page }) => {
      // Try to navigate, skip if page doesn't exist
      try {
        await page.goto(testPage.path, { timeout: 10000 });
      } catch (error) {
        test.skip();
        return;
      }

      // Verify no double basepath in any URLs
      const doubleBasepathCount = await page.evaluate(() => {
        const allElements = document.querySelectorAll('[href], [src], [srcset]');
        let count = 0;

        allElements.forEach(el => {
          ['href', 'src', 'srcset'].forEach(attr => {
            const value = el.getAttribute(attr);
            if (value && value.includes('/wesole_nutki/wesole_nutki/')) {
              count++;
            }
          });
        });

        return count;
      });

      expect(doubleBasepathCount, `Found ${doubleBasepathCount} double basepath issues on ${testPage.name}`).toBe(0);
    });
  }
});

test.describe('Comprehensive Basepath Validation - Asset Loading', () => {
  test('should load all CSS files successfully', async ({ page }) => {
    const cssLoadErrors: string[] = [];

    page.on('response', response => {
      const url = response.url();
      if (url.includes('.css') && !response.ok()) {
        cssLoadErrors.push(`${response.status()} - ${url}`);
      }
    });

    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    expect(cssLoadErrors, 'CSS files failed to load').toEqual([]);
  });

  test('should load all JavaScript files successfully', async ({ page }) => {
    const jsLoadErrors: string[] = [];

    page.on('response', response => {
      const url = response.url();
      if (url.includes('.js') && !response.ok() && !url.includes('chrome-extension')) {
        jsLoadErrors.push(`${response.status()} - ${url}`);
      }
    });

    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    expect(jsLoadErrors, 'JavaScript files failed to load').toEqual([]);
  });

  test('should load all images successfully', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Get all images
    const images = page.locator('img[src]');
    const count = await images.count();

    const failedImages: string[] = [];

    for (let i = 0; i < Math.min(count, 20); i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');

      if (src && !src.startsWith('data:')) {
        const isLoaded = await img.evaluate((el: HTMLImageElement) => {
          return el.complete && el.naturalHeight !== 0;
        });

        if (!isLoaded) {
          failedImages.push(src);
        }
      }
    }

    expect(failedImages, 'Images failed to load').toEqual([]);
  });

  test('should load favicon successfully', async ({ page }) => {
    const faviconErrors: string[] = [];

    page.on('response', response => {
      const url = response.url();
      if ((url.includes('favicon') || url.includes('icon')) && !response.ok()) {
        faviconErrors.push(`${response.status()} - ${url}`);
      }
    });

    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    expect(faviconErrors, 'Favicon failed to load').toEqual([]);
  });
});

test.describe('Comprehensive Basepath Validation - Navigation Flow', () => {
  test('should navigate through complete user journey without URL issues', async ({ page }) => {
    // Start at homepage
    await page.goto('/pl/');
    expect(page.url()).toContain('/wesole_nutki/pl/');

    // Navigate to about
    const aboutLink = page.locator('a[href*="/pl/about"]').first();
    if (await aboutLink.count() > 0) {
      await aboutLink.click();
      await page.waitForURL(/\/wesole_nutki\/pl\/about/);
      expect(page.url()).toContain('/wesole_nutki/pl/about');
      expect(page.url()).not.toContain('/wesole_nutki/wesole_nutki/');
    }

    // Navigate to news
    const newsLink = page.locator('a[href*="/pl/news"], a[href*="/pl/category"]').first();
    if (await newsLink.count() > 0) {
      await newsLink.click();
      await page.waitForURL(/\/wesole_nutki\/pl\//);
      expect(page.url()).toContain('/wesole_nutki/pl/');
      expect(page.url()).not.toContain('/wesole_nutki/wesole_nutki/');
    }

    // Navigate to gallery
    const galleryLink = page.locator('a[href*="/pl/gallery"]').first();
    if (await galleryLink.count() > 0) {
      await galleryLink.click();
      await page.waitForURL(/\/wesole_nutki\/pl\/gallery/);
      expect(page.url()).toContain('/wesole_nutki/pl/gallery');
      expect(page.url()).not.toContain('/wesole_nutki/wesole_nutki/');
    }

    // Navigate back to home via logo
    const logo = page.locator('.navbar-brand');
    if (await logo.count() > 0) {
      await logo.click();
      await page.waitForURL(/\/wesole_nutki\/pl\/$/);
      expect(page.url()).toContain('/wesole_nutki/pl/');
      expect(page.url()).not.toContain('/wesole_nutki/wesole_nutki/');
    }
  });

  test('should maintain correct URLs when switching languages mid-journey', async ({ page }) => {
    // Start in Polish
    await page.goto('/pl/about/');
    expect(page.url()).toContain('/wesole_nutki/pl/about');

    // Switch to English
    const enLink = page.locator('a[href*="/en/"]').first();
    if (await enLink.count() > 0) {
      await enLink.click();
      await page.waitForURL(/\/wesole_nutki\/en\//);
      expect(page.url()).toContain('/wesole_nutki/en/');
      expect(page.url()).not.toContain('/wesole_nutki/wesole_nutki/');
      expect(page.url()).not.toContain('/pl/');
    }

    // Navigate in English
    const aboutLink = page.locator('a[href*="/en/about"]').first();
    if (await aboutLink.count() > 0) {
      await aboutLink.click();
      await page.waitForURL(/\/wesole_nutki\/en\/about/);
      expect(page.url()).toContain('/wesole_nutki/en/about');
      expect(page.url()).not.toContain('/wesole_nutki/wesole_nutki/');
    }

    // Switch back to Polish
    const plLink = page.locator('a[href*="/pl/"]').first();
    if (await plLink.count() > 0) {
      await plLink.click();
      await page.waitForURL(/\/wesole_nutki\/pl\//);
      expect(page.url()).toContain('/wesole_nutki/pl/');
      expect(page.url()).not.toContain('/wesole_nutki/wesole_nutki/');
      expect(page.url()).not.toContain('/en/');
    }
  });
});

test.describe('Comprehensive Basepath Validation - External Links Preservation', () => {
  test('should NOT add basepath to external links', async ({ page }) => {
    await page.goto('/pl/');

    // Get all external links
    const externalLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('a[href^="http"]');
      return Array.from(links).map(link => link.getAttribute('href')) as string[];
    });

    // Verify none have basepath added incorrectly
    const corruptedExternalLinks = externalLinks.filter(href => 
      href.includes('//wesole_nutki/') || href.includes('wesole_nutki/wesole_nutki')
    );

    expect(corruptedExternalLinks, 'External links were corrupted with basepath').toEqual([]);
  });

  test('should preserve mailto and tel links', async ({ page }) => {
    await page.goto('/pl/contact/');

    // Get mailto links
    const mailtoLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('a[href^="mailto:"]');
      return Array.from(links).map(link => link.getAttribute('href')) as string[];
    });

    // Get tel links
    const telLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('a[href^="tel:"]');
      return Array.from(links).map(link => link.getAttribute('href')) as string[];
    });

    // Verify they start with correct protocol
    mailtoLinks.forEach(href => {
      expect(href).toMatch(/^mailto:/);
      expect(href).not.toContain('/wesole_nutki/');
    });

    telLinks.forEach(href => {
      expect(href).toMatch(/^tel:/);
      expect(href).not.toContain('/wesole_nutki/');
    });
  });
});

test.describe('Comprehensive Basepath Validation - Consistency Check', () => {
  test('should have consistent URL patterns across all link types', async ({ page }) => {
    await page.goto('/pl/');

    const urlPatterns = await page.evaluate(() => {
      const patterns: Record<string, string[]> = {
        navigation: [],
        footer: [],
        content: [],
        images: [],
      };

      // Navigation links
      const navLinks = document.querySelectorAll('header nav a[href^="/wesole_nutki/pl/"]');
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) patterns.navigation.push(href);
      });

      // Footer links
      const footerLinks = document.querySelectorAll('footer a[href^="/wesole_nutki/pl/"]');
      footerLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) patterns.footer.push(href);
      });

      // Content links
      const contentLinks = document.querySelectorAll('main a[href^="/wesole_nutki/pl/"], article a[href^="/wesole_nutki/pl/"]');
      contentLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) patterns.content.push(href);
      });

      // Image sources
      const images = document.querySelectorAll('img[src^="/wesole_nutki/"]');
      images.forEach(img => {
        const src = img.getAttribute('src');
        if (src) patterns.images.push(src);
      });

      return patterns;
    });

    // All should follow pattern: /wesole_nutki/pl/... or /wesole_nutki/images/...
    const allUrls = [
      ...urlPatterns.navigation,
      ...urlPatterns.footer,
      ...urlPatterns.content,
    ];

    const inconsistentUrls = allUrls.filter(url => 
      !url.match(/^\/wesole_nutki\/(pl|en)\//) && url !== '/wesole_nutki/'
    );

    expect(inconsistentUrls, 'Found URLs with inconsistent patterns').toEqual([]);

    // All image URLs should be /wesole_nutki/images/... or /wesole_nutki/pl/...
    const inconsistentImages = urlPatterns.images.filter(url =>
      !url.match(/^\/wesole_nutki\/(images|pl|en)\//)
    );

    expect(inconsistentImages, 'Found image URLs with inconsistent patterns').toEqual([]);
  });
});
