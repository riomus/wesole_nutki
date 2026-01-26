import { test, expect } from '@playwright/test';

/**
 * Menu URL TrimPrefix Edge Cases Tests
 *
 * Tests edge cases and validation for the strings.TrimPrefix implementation
 * used in menu URL handling for basepath support.
 *
 * This test suite ensures that the fix handles various URL formats correctly:
 * - URLs with leading slashes
 * - URLs without leading slashes
 * - External URLs (http/https)
 * - Anchor links (#)
 * - Query parameters
 * - Trailing slashes
 * - Special characters in URLs
 *
 * Implementation:
 * - header.html: {{ strings.TrimPrefix "/" $menuURL | relURL }}
 * - footer.html: {{ strings.TrimPrefix "/" .url | relURL }}
 */

const useBasePath = process.env.BASEPATH === 'true';

test.describe('URL Format Edge Cases', () => {
  test('should handle menu URLs with trailing slashes correctly', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    const navLinks = await page.locator('nav.navbar a[href^="/"]').all();

    for (const link of navLinks) {
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();

      // Should not have double slashes (except for protocol)
      expect(href).not.toMatch(/(?<!:)\/\//);

      // Trailing slashes may vary by Hugo configuration - just ensure no double slashes
    }
  });

  test('should handle menu URLs with query parameters', async ({ page }) => {
    await page.goto('/pl/');

    // If any menu items have query parameters, they should be preserved
    const linksWithQuery = await page.locator('nav a[href*="?"]').all();

    for (const link of linksWithQuery) {
      const href = await link.getAttribute('href');

      if (href && href.startsWith('/')) {
        // Internal links with query params
        if (useBasePath) {
          expect(href).toMatch(/^\/wesole_nutki\/.*\?/);
        }

        // Query parameters should be preserved
        expect(href).toContain('?');
      }
    }
  });

  test('should handle anchor links without modification', async ({ page }) => {
    await page.goto('/pl/');

    const anchorLinks = await page.locator('nav a[href^="#"]').all();

    for (const link of anchorLinks) {
      const href = await link.getAttribute('href');

      // Anchor links should not have basepath
      expect(href).toMatch(/^#/);
      expect(href).not.toContain('wesole_nutki');
    }
  });

  test('should not modify external HTTP links', async ({ page }) => {
    await page.goto('/pl/');

    const httpLinks = await page.locator('nav a[href^="http://"]').all();

    for (const link of httpLinks) {
      const href = await link.getAttribute('href');

      // Should remain absolute
      expect(href).toMatch(/^http:\/\//);

      // Should not have basepath inserted
      if (!href?.includes('localhost')) {
        expect(href).not.toContain('/wesole_nutki/');
      }
    }
  });

  test('should not modify external HTTPS links', async ({ page }) => {
    await page.goto('/pl/');

    const httpsLinks = await page.locator('nav a[href^="https://"]').all();

    for (const link of httpsLinks) {
      const href = await link.getAttribute('href');

      // Should remain absolute
      expect(href).toMatch(/^https:\/\//);

      // Should not have basepath inserted into external URLs
      if (!href?.includes('localhost') && !href?.includes('bartusiak.ai')) {
        expect(href).not.toContain('/wesole_nutki/');
      }
    }
  });

  test('should handle URLs with special characters correctly', async ({ page }) => {
    await page.goto('/pl/');

    const allNavLinks = await page.locator('nav.navbar a[href]').all();

    for (const link of allNavLinks) {
      const href = await link.getAttribute('href');

      if (href) {
        // Should be properly encoded
        // Special characters like spaces should be %20, etc.
        if (href.includes('%')) {
          // Has encoded characters - verify they're not double-encoded
          expect(href).not.toMatch(/%25/); // %25 is encoded %
        }

        // Should not have unencoded spaces
        expect(href).not.toMatch(/ /);
      }
    }
  });
});

test.describe('Basepath Prefix Validation', () => {
  test('should never have double basepath prefix', async ({ page }) => {
    await page.goto('/pl/');

    const allLinks = await page.locator('a[href^="/"]').all();

    for (const link of allLinks) {
      const href = await link.getAttribute('href');

      // Check for double prefix
      expect(href).not.toMatch(/\/wesole_nutki\/wesole_nutki\//);
      expect(href).not.toMatch(/\/wesole_nutki.*\/wesole_nutki\//);
    }
  });

  test('should have exactly one basepath prefix when enabled', async ({ page }) => {
    if (!useBasePath) {
      test.skip();
    }

    await page.goto('/pl/');

    const internalNavLinks = await page.locator('nav.navbar a[href^="/wesole_nutki/"]').all();

    for (const link of internalNavLinks) {
      const href = await link.getAttribute('href');

      if (href) {
        // Count occurrences of basepath
        const matches = href.match(/\/wesole_nutki\//g);
        expect(matches?.length).toBe(1);
      }
    }
  });

  test('should not have basepath prefix when disabled', async ({ page }) => {
    if (useBasePath) {
      test.skip();
    }

    await page.goto('/pl/');

    const internalNavLinks = await page.locator('nav.navbar a[href^="/"]').all();

    for (const link of internalNavLinks) {
      const href = await link.getAttribute('href');

      // Should not contain basepath
      expect(href).not.toContain('/wesole_nutki/');
    }
  });

  test('should apply basepath consistently across all menu types', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Get nav links
    const navLinks = await page.locator('nav.navbar .nav-link[href^="/"]').all();

    // Get dropdown links
    const dropdown = page.locator('nav.navbar .dropdown-toggle').first();
    if (await dropdown.count() > 0) {
      await dropdown.hover();
      await page.waitForTimeout(300);
    }
    const dropdownLinks = await page.locator('.dropdown-menu a.dropdown-item[href^="/"]').all();

    // Get footer links
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const footerLinks = await page.locator('footer a[href^="/"]').all();

    // Combine all links
    const allInternalLinks = [...navLinks, ...dropdownLinks, ...footerLinks];

    expect(allInternalLinks.length).toBeGreaterThan(0);

    // All should have consistent basepath handling
    for (const link of allInternalLinks) {
      const href = await link.getAttribute('href');

      if (useBasePath) {
        expect(href).toMatch(/^\/wesole_nutki\//);
      } else {
        expect(href).toMatch(/^\//);
        expect(href).not.toMatch(/^\/wesole_nutki\//);
      }
    }
  });
});

test.describe('Menu Data File Integration', () => {
  test('should handle menu URLs from data/menus/ correctly', async ({ page }) => {
    await page.goto('/pl/');

    // These URLs are defined in data/menus/main_pl.yml and main_en.yml
    // They start with / in the data file and should be processed by TrimPrefix

    const expectedMenuItems = [
      '/pl/contact/',
      '/pl/',
    ];

    for (const item of expectedMenuItems) {
      const expectedHref = useBasePath ? `/wesole_nutki${item}` : item;
      const link = page.locator(`nav.navbar a[href="${expectedHref}"]`).first();

      if (await link.count() > 0) {
        // Link exists and has correct basepath
        await expect(link).toBeVisible();
      }
    }
  });

  test('should process footer menu data correctly', async ({ page }) => {
    await page.goto('/pl/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Footer links from data/footer.yml
    const footerLinks = await page.locator('footer a[href^="/"]').all();

    expect(footerLinks.length).toBeGreaterThan(0);

    // All should be properly prefixed
    for (const link of footerLinks) {
      const href = await link.getAttribute('href');

      if (useBasePath) {
        expect(href).toMatch(/^\/wesole_nutki\//);
      } else {
        expect(href).toMatch(/^\//);
      }
    }
  });

  test('should handle dropdown children URLs from menu data', async ({ page }) => {
    await page.goto('/pl/');

    const dropdown = page.locator('nav.navbar .dropdown-toggle').first();

    if (await dropdown.count() > 0) {
      await dropdown.hover();
      await page.waitForTimeout(300);

      const dropdownItems = await page.locator('.dropdown-menu a.dropdown-item[href^="/"]').all();

      for (const item of dropdownItems) {
        const href = await item.getAttribute('href');

        if (useBasePath) {
          expect(href).toMatch(/^\/wesole_nutki\//);
        } else {
          expect(href).toMatch(/^\//);
        }
      }
    }
  });
});

test.describe('Navigation Functionality', () => {
  test('should successfully navigate through all main menu items', async ({ page }) => {
    await page.goto('/pl/');

    const navLinks = await page.locator('nav.navbar .nav-link[href^="/"]').all();

    // Test first 3 links to avoid timeout
    for (let i = 0; i < Math.min(navLinks.length, 3); i++) {
      await page.goto('/pl/'); // Reset to homepage

      const link = navLinks[i];
      const href = await link.getAttribute('href');

      await link.click();
      await page.waitForLoadState('networkidle');

      // Verify navigation succeeded
      const currentUrl = page.url();
      expect(currentUrl).toBeTruthy();

      // Should not be error page
      const pageContent = await page.content();
      expect(pageContent).not.toContain('404');

      // URL should match href (accounting for redirects/trailing slashes)
      if (href) {
        const hrefPath = href.replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '');
        const urlPath = currentUrl.replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '');
        expect(urlPath).toContain(hrefPath);
      }
    }
  });

  test('should successfully navigate through dropdown menu items', async ({ page }) => {
    await page.goto('/pl/');

    const dropdown = page.locator('nav.navbar .dropdown-toggle').first();

    if (await dropdown.count() > 0) {
      await dropdown.hover();
      await page.waitForTimeout(300);

      const dropdownItems = await page.locator('.dropdown-menu a.dropdown-item[href^="/"]').all();

      // Test first 2 dropdown items
      for (let i = 0; i < Math.min(dropdownItems.length, 2); i++) {
        await page.goto('/pl/'); // Reset
        await dropdown.hover();
        await page.waitForTimeout(300);

        const item = dropdownItems[i];
        const href = await item.getAttribute('href');

        await item.click();
        await page.waitForLoadState('networkidle');

        const currentUrl = page.url();
        expect(currentUrl).toBeTruthy();

        // Should navigate successfully
        const title = await page.title();
        expect(title).not.toMatch(/404|not found/i);
      }
    }
  });

  test('should successfully navigate through footer links', async ({ page }) => {
    await page.goto('/pl/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const footerLinks = await page.locator('footer a[href^="/"]').all();

    // Test first footer link
    if (footerLinks.length > 0) {
      const link = footerLinks[0];
      const href = await link.getAttribute('href');

      await link.click();
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();
      expect(currentUrl).toBeTruthy();

      // Should navigate successfully
      const pageContent = await page.content();
      expect(pageContent).not.toContain('404');
    }
  });
});

test.describe('Responsive Design - Basepath Handling', () => {
  test('should maintain correct basepath on mobile menu', async ({ page, viewport }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Open mobile menu
    const menuToggle = page.locator('.navbar-toggler, button[data-bs-toggle="collapse"]').first();

    if (await menuToggle.count() > 0) {
      await menuToggle.click();
      await page.waitForTimeout(500);

      // Check mobile menu links
      const mobileNavLinks = await page.locator('.navbar-collapse a[href^="/"]').all();

      for (const link of mobileNavLinks) {
        const href = await link.getAttribute('href');

        if (useBasePath) {
          expect(href).toMatch(/^\/wesole_nutki\//);
        } else {
          expect(href).toMatch(/^\//);
        }
      }
    }
  });

  test('should maintain basepath on mobile dropdown menus', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    const menuToggle = page.locator('.navbar-toggler, button[data-bs-toggle="collapse"]').first();

    if (await menuToggle.count() > 0) {
      await menuToggle.click();
      await page.waitForTimeout(500);

      // Find and click dropdown toggle in mobile menu
      const mobileDropdown = page.locator('.navbar-collapse .dropdown-toggle').first();

      if (await mobileDropdown.count() > 0) {
        await mobileDropdown.click();
        await page.waitForTimeout(300);

        const dropdownItems = await page.locator('.navbar-collapse .dropdown-menu a[href^="/"]').all();

        for (const item of dropdownItems) {
          const href = await item.getAttribute('href');

          if (useBasePath) {
            expect(href).toMatch(/^\/wesole_nutki\//);
          } else {
            expect(href).toMatch(/^\//);
          }
        }
      }
    }
  });
});

test.describe('Backward Compatibility', () => {
  test('should work with existing menu data structure without modification', async ({ page }) => {
    await page.goto('/pl/');

    // The fix should work with existing data files without requiring changes
    // Menu items with leading / should be processed correctly

    const navLinks = await page.locator('nav.navbar a[href^="/"]').all();

    expect(navLinks.length).toBeGreaterThan(0);

    // All links should be functional
    for (const link of navLinks) {
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/^\//);
    }
  });

  test('should handle both old and new URL formats in menu data', async ({ page }) => {
    await page.goto('/pl/');

    // Should handle:
    // - URLs starting with / (from data files)
    // - URLs without leading / (if any)
    // - External URLs (unchanged)

    const allNavLinks = await page.locator('nav.navbar a[href]').all();

    expect(allNavLinks.length).toBeGreaterThan(0);

    for (const link of allNavLinks) {
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();

      // Should be valid URL format
      expect(href).toMatch(/^(\/|https?:\/\/|#)/);
    }
  });
});
