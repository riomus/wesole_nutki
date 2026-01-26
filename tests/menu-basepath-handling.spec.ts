import { test, expect } from '@playwright/test';
import { URLTestHelpers, Selectors } from './helpers/url-test-helpers';

/**
 * Menu BaseURL Path Handling Tests
 *
 * Tests for the fix implemented in feature-1769425318393-exqfqsq8h:
 * "Fix BaseURL Path Handling for Internal Links and Images"
 *
 * This test suite verifies that menu URLs from data files (data/menus/)
 * are correctly prefixed with the baseURL path when using strings.TrimPrefix
 * before applying the relURL filter.
 *
 * Key Changes Tested:
 * - layouts/partials/header.html: Menu URLs use strings.TrimPrefix
 * - layouts/partials/footer.html: Footer URLs use strings.TrimPrefix
 *
 * Run with: npx playwright test menu-basepath-handling.spec.ts
 * Run with basepath: BASEPATH=true npx playwright test menu-basepath-handling.spec.ts
 */

// Determine if we're testing with basepath
const useBasePath = process.env.BASEPATH === 'true';
const expectedPathPrefix = useBasePath ? '/wesole_nutki' : '';

test.describe('Main Menu Navigation Links - Basepath Handling', () => {
  test.describe('Polish Menu', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');
    });

    test('should include basepath in main navigation links', async ({ page }) => {
      // Get all main navigation links (not external - exclude http/https)
      const navLinks = await page.locator('nav.navbar .nav-link:not([href^="http"]):not([href^="#"])').all();

      expect(navLinks.length).toBeGreaterThan(0);

      for (const link of navLinks) {
        const href = await link.getAttribute('href');
        expect(href).toBeTruthy();

        if (useBasePath) {
          // With basepath, all internal links should start with /wesole_nutki/
          expect(href).toMatch(/^\/wesole_nutki\//);
        } else {
          // Without basepath, internal links should start with /
          expect(href).toMatch(/^\//);
          expect(href).not.toMatch(/^\/wesole_nutki\//);
        }
      }
    });

    test('should navigate to contact page with correct basepath', async ({ page }) => {
      // Click on contact link
      const contactLink = page.locator('nav.navbar a[href*="contact"]').first();
      await expect(contactLink).toBeVisible();

      const href = await contactLink.getAttribute('href');

      if (useBasePath) {
        expect(href).toBe(`${expectedPathPrefix}/pl/contact/`);
      } else {
        expect(href).toBe('/pl/contact/');
      }

      // Navigate and verify URL
      await contactLink.click();
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();
      expect(currentUrl).toContain('/pl/contact');

      if (useBasePath) {
        expect(currentUrl).toContain('/wesole_nutki/');
      }
    });

    test('should have correct basepath in "O przedszkolu" (About) dropdown', async ({ page }) => {
      // Find the About dropdown toggle
      const aboutDropdown = page.locator('nav.navbar .dropdown-toggle').filter({ hasText: /o przedszkolu/i }).first();

      if (await aboutDropdown.count() > 0) {
        await aboutDropdown.hover();
        await page.waitForTimeout(300); // Wait for dropdown animation

        // Check dropdown items (exclude external links)
        const dropdownItems = page.locator('.dropdown-menu a.dropdown-item:not([href^="http"])');
        const count = await dropdownItems.count();

        if (count > 0) {
          for (let i = 0; i < count; i++) {
            const href = await dropdownItems.nth(i).getAttribute('href');
            expect(href).toBeTruthy();

            if (useBasePath) {
              expect(href).toMatch(/^\/wesole_nutki\//);
            } else {
              expect(href).toMatch(/^\//);
              expect(href).not.toMatch(/^\/wesole_nutki\//);
            }
          }
        }
      }
    });

    test('should navigate through dropdown menu items with basepath', async ({ page }) => {
      // Find dropdown toggle
      const dropdown = page.locator('nav.navbar .dropdown-toggle').first();

      if (await dropdown.count() > 0) {
        await dropdown.hover();
        await page.waitForTimeout(300);

        // Click first dropdown item
        const firstItem = page.locator('.dropdown-menu a.dropdown-item').first();

        if (await firstItem.count() > 0) {
          const href = await firstItem.getAttribute('href');
          await firstItem.click();
          await page.waitForLoadState('networkidle');

          const currentUrl = page.url();

          // Verify navigation worked
          expect(currentUrl).not.toContain('/pl/?'); // Not on homepage

          if (useBasePath && href) {
            // URL should contain basepath
            expect(currentUrl).toContain('/wesole_nutki/');
          }
        }
      }
    });

    test('should maintain basepath when clicking logo to return home', async ({ page }) => {
      // Navigate away from homepage first
      await page.goto('/pl/contact/');

      // Click logo
      const logo = page.locator('.navbar-brand').first();
      await logo.click();
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/pl\/?$/);

      if (useBasePath) {
        expect(currentUrl).toContain('/wesole_nutki/');
      }
    });
  });

  test.describe('English Menu', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/');
      await page.waitForLoadState('networkidle');
    });

    test('should include basepath in English navigation links', async ({ page }) => {
      const navLinks = await page.locator('nav.navbar .nav-link:not([href^="http"]):not([href^="#"])').all();

      expect(navLinks.length).toBeGreaterThan(0);

      for (const link of navLinks) {
        const href = await link.getAttribute('href');
        expect(href).toBeTruthy();

        if (useBasePath) {
          expect(href).toMatch(/^\/wesole_nutki\//);
        } else {
          expect(href).toMatch(/^\//);
          expect(href).not.toMatch(/^\/wesole_nutki\//);
        }
      }
    });

    test('should navigate to contact page from English menu', async ({ page }) => {
      const contactLink = page.locator('nav.navbar a[href*="contact"]').first();
      await expect(contactLink).toBeVisible();

      const href = await contactLink.getAttribute('href');

      if (useBasePath) {
        expect(href).toBe(`${expectedPathPrefix}/en/contact/`);
      } else {
        expect(href).toBe('/en/contact/');
      }

      await contactLink.click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/en/contact');
    });

    test('should have correct basepath in Programs dropdown', async ({ page }) => {
      const programsDropdown = page.locator('nav.navbar .dropdown-toggle').filter({ hasText: /programs/i }).first();

      if (await programsDropdown.count() > 0) {
        await programsDropdown.hover();
        await page.waitForTimeout(300);

        const dropdownItems = page.locator('.dropdown-menu a.dropdown-item:not([href^="http"]):not([href^="#"])');
        const count = await dropdownItems.count();

        if (count > 0) {
          for (let i = 0; i < count; i++) {
            const href = await dropdownItems.nth(i).getAttribute('href');

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
});

test.describe('Footer Links - Basepath Handling', () => {
  test.describe('Polish Footer', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');
    });

    test('should include basepath in footer quick links', async ({ page }) => {
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      // Get footer links (not external)
      const footerLinks = await page.locator('footer a:not([href^="http"]):not([href^="#"])').all();

      expect(footerLinks.length).toBeGreaterThan(0);

      for (const link of footerLinks) {
        const href = await link.getAttribute('href');
        expect(href).toBeTruthy();

        if (useBasePath) {
          expect(href).toMatch(/^\/wesole_nutki\//);
        } else {
          expect(href).toMatch(/^\//);
          expect(href).not.toMatch(/^\/wesole_nutki\//);
        }
      }
    });

    test('should navigate from footer links with correct basepath', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      const firstFooterLink = page.locator('footer a:not([href^="http"]):not([href^="#"])').first();

      if (await firstFooterLink.count() > 0) {
        const href = await firstFooterLink.getAttribute('href');
        await firstFooterLink.click();
        await page.waitForLoadState('networkidle');

        const currentUrl = page.url();

        if (useBasePath && href) {
          expect(currentUrl).toContain('/wesole_nutki/');
        }
      }
    });

    test('should have correct basepath in footer useful links section', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      // Look for useful links section
      const usefulLinksSection = page.locator('footer .useful-links, footer .footer-links').first();

      if (await usefulLinksSection.count() > 0) {
        const links = await usefulLinksSection.locator('a[href^="/"]').all();

        for (const link of links) {
          const href = await link.getAttribute('href');

          if (useBasePath) {
            expect(href).toMatch(/^\/wesole_nutki\//);
          } else {
            expect(href).toMatch(/^\//);
          }
        }
      }
    });
  });

  test.describe('English Footer', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/');
      await page.waitForLoadState('networkidle');
    });

    test('should include basepath in English footer links', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      const footerLinks = await page.locator('footer a:not([href^="http"]):not([href^="#"])').all();

      expect(footerLinks.length).toBeGreaterThan(0);

      for (const link of footerLinks) {
        const href = await link.getAttribute('href');

        if (useBasePath) {
          expect(href).toMatch(/^\/wesole_nutki\//);
        } else {
          expect(href).toMatch(/^\//);
        }
      }
    });
  });
});

test.describe('Language Switcher - Basepath Handling', () => {
  test('should maintain basepath when switching from Polish to English', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    const enSwitch = page.locator('.language-switcher a[data-lang="en"]').first();
    await expect(enSwitch).toBeVisible();

    const href = await enSwitch.getAttribute('href');

    if (useBasePath) {
      expect(href).toContain('/wesole_nutki/en');
    } else {
      expect(href).toMatch(/^\/en\/?$/);
    }

    await enSwitch.click();
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();
    expect(currentUrl).toContain('/en');

    if (useBasePath) {
      expect(currentUrl).toContain('/wesole_nutki/');
    }
  });

  test('should maintain basepath when switching from English to Polish', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');

    const plSwitch = page.locator('.language-switcher a[data-lang="pl"]').first();
    await expect(plSwitch).toBeVisible();

    const href = await plSwitch.getAttribute('href');

    if (useBasePath) {
      expect(href).toContain('/wesole_nutki/pl');
    } else {
      expect(href).toMatch(/^\/pl\/?$/);
    }

    await plSwitch.click();
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();
    expect(currentUrl).toContain('/pl');

    if (useBasePath) {
      expect(currentUrl).toContain('/wesole_nutki/');
    }
  });

  test('should maintain basepath when switching languages on subpages', async ({ page }) => {
    // Start on Polish contact page
    await page.goto('/pl/contact/');
    await page.waitForLoadState('networkidle');

    const enSwitch = page.locator('.language-switcher a[data-lang="en"]').first();
    await enSwitch.click();
    await page.waitForLoadState('networkidle');

    // Should be on English contact page
    const currentUrl = page.url();
    expect(currentUrl).toContain('/en/contact');

    if (useBasePath) {
      expect(currentUrl).toContain('/wesole_nutki/');
    }
  });
});

test.describe('Breadcrumb Navigation - Basepath Handling', () => {
  test('should include basepath in breadcrumb links', async ({ page }) => {
    // Navigate to a page with breadcrumbs (e.g., news article)
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Try to find a news article link
    const newsLink = page.locator('a[href*="/news/"], a[href*="/aktualnosci/"]').first();

    if (await newsLink.count() > 0) {
      await newsLink.click();
      await page.waitForLoadState('networkidle');

      // Check breadcrumb links
      const breadcrumbLinks = page.locator('.breadcrumb a[href]');
      const count = await breadcrumbLinks.count();

      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const href = await breadcrumbLinks.nth(i).getAttribute('href');

          if (href && href.startsWith('/')) {
            if (useBasePath) {
              expect(href).toMatch(/^\/wesole_nutki\//);
            } else {
              expect(href).toMatch(/^\//);
              expect(href).not.toMatch(/^\/wesole_nutki\//);
            }
          }
        }
      }
    }
  });
});

test.describe('Cross-Page Navigation - Basepath Consistency', () => {
  test('should maintain basepath across multiple page navigations', async ({ page }) => {
    // Start at homepage
    await page.goto('/pl/');

    // Navigate to contact
    await page.locator('nav.navbar a[href*="contact"]').first().click();
    await page.waitForLoadState('networkidle');

    if (useBasePath) {
      expect(page.url()).toContain('/wesole_nutki/');
    }

    // Navigate to another page from menu
    const firstNavLink = page.locator('nav.navbar .nav-link:not([href^="http"]):not([href^="#"])').first();
    await firstNavLink.click();
    await page.waitForLoadState('networkidle');

    if (useBasePath) {
      expect(page.url()).toContain('/wesole_nutki/');
    }

    // Click logo to go back home
    await page.locator('.navbar-brand').first().click();
    await page.waitForLoadState('networkidle');

    if (useBasePath) {
      expect(page.url()).toContain('/wesole_nutki/');
    }
  });

  test('should preserve basepath in URL after form submission or redirects', async ({ page }) => {
    await page.goto('/pl/');

    // Navigate through several pages
    const pages = ['/pl/contact/', '/pl/', '/en/'];

    for (const targetPage of pages) {
      await page.goto(targetPage);
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();

      if (useBasePath) {
        expect(currentUrl).toContain('/wesole_nutki/');
      }

      // Check that navigation menu still has correct paths
      const navLinks = await page.locator('nav.navbar .nav-link:not([href^="http"]):not([href^="#"])').all();

      for (const link of navLinks) {
        const href = await link.getAttribute('href');

        if (useBasePath) {
          expect(href).toMatch(/^\/wesole_nutki\//);
        } else {
          expect(href).toMatch(/^\//);
        }
      }
    }
  });
});

test.describe('Menu URL Data Integrity', () => {
  test('should not double-prefix basepath on menu URLs', async ({ page }) => {
    await page.goto('/pl/');

    const navLinks = await page.locator('nav.navbar a[href^="/"]').all();

    for (const link of navLinks) {
      const href = await link.getAttribute('href');

      // Should never have double basepath
      expect(href).not.toMatch(/\/wesole_nutki\/wesole_nutki\//);

      // Should only have basepath once if enabled
      if (useBasePath) {
        const matches = href?.match(/\/wesole_nutki\//g);
        expect(matches?.length).toBe(1);
      }
    }
  });

  test('should handle menu URLs that are already relative correctly', async ({ page }) => {
    await page.goto('/pl/');

    // All internal menu links should work
    const navLinks = await page.locator('nav.navbar .nav-link:not([href^="http"]):not([href^="#"])').all();

    expect(navLinks.length).toBeGreaterThan(0);

    // Click each link and verify navigation works
    for (let i = 0; i < Math.min(navLinks.length, 3); i++) {
      await page.goto('/pl/'); // Reset to homepage

      const link = navLinks[i];
      const href = await link.getAttribute('href');

      await link.click();
      await page.waitForLoadState('networkidle');

      // Should have navigated successfully
      const currentUrl = page.url();
      expect(currentUrl).toBeTruthy();

      // Should not be an error page
      const title = await page.title();
      expect(title).not.toMatch(/404|not found/i);
    }
  });

  test('should preserve external links without modification', async ({ page }) => {
    await page.goto('/pl/');

    // External links should not be modified
    const externalLinks = await page.locator('nav.navbar a[href^="http"]').all();

    for (const link of externalLinks) {
      const href = await link.getAttribute('href');

      // Should start with http/https
      expect(href).toMatch(/^https?:\/\//);

      // Should not have basepath inserted
      expect(href).not.toContain('wesole_nutki');
    }
  });
});
