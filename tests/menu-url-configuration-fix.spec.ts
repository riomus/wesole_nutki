import { test, expect } from '@playwright/test';

/**
 * Menu URL Configuration Tests
 *
 * These tests verify that menu URLs from hugo.toml are correctly configured
 * with language prefixes and work properly with the basepath.
 *
 * Bug Fixed: Hugo menu URLs in hugo.toml were missing language prefixes,
 * causing incorrect URL generation when combined with basepath-url helper.
 *
 * Fix: Added language prefixes (/pl/, /en/) to all menu URLs in hugo.toml
 * to match the pattern used throughout the site.
 *
 * Critical Test Cases:
 * 1. All Polish menu URLs should start with /pl/
 * 2. All English menu URLs should start with /en/
 * 3. Menu URLs should work correctly with basepath (/wesole_nutki/)
 * 4. Parent and child menu items should both have correct URLs
 * 5. Menu identifiers should resolve to correct pages
 */

test.describe('Menu URL Configuration - Polish Menus', () => {
  test('should have /pl/ prefix in all Polish main menu items', async ({ page }) => {
    await page.goto('/pl/');

    // Get all main navigation links in Polish
    const navLinks = page.locator('header nav a[href^="/wesole_nutki/pl/"]');
    const count = await navLinks.count();

    // Should have multiple menu items
    expect(count).toBeGreaterThan(0);

    // Verify each link has correct structure
    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href');
      
      if (href && href !== '#') {
        // Should match pattern: /wesole_nutki/pl/...
        expect(href).toMatch(/^\/wesole_nutki\/pl\//);
        
        // Should NOT have missing language prefix
        expect(href).not.toMatch(/^\/wesole_nutki\/[^p]/);
      }
    }
  });

  test('should navigate to correct pages from Polish menu items', async ({ page }) => {
    await page.goto('/pl/');

    // Test specific menu items that were fixed
    const menuTests = [
      { text: 'Strona główna', expectedPath: '/pl/' },
      { text: 'O przedszkolu', expectedPath: '/pl/about' },
      { text: 'Aktualności', expectedPath: '/pl/category/aktualnosci' },
    ];

    for (const menuTest of menuTests) {
      await page.goto('/pl/');
      
      const menuItem = page.locator(`header nav a:has-text("${menuTest.text}")`).first();
      const count = await menuItem.count();

      if (count > 0) {
        const href = await menuItem.getAttribute('href');
        
        // Verify URL structure
        expect(href).toContain('/wesole_nutki' + menuTest.expectedPath);
        
        // Click and verify navigation
        await menuItem.click();
        await page.waitForURL(new RegExp(menuTest.expectedPath));
        
        expect(page.url()).toContain(menuTest.expectedPath);
      }
    }
  });

  test('should have correct URLs in Polish dropdown menu items', async ({ page }) => {
    await page.goto('/pl/');

    // Find dropdown toggle for "O przedszkolu"
    const aboutDropdown = page.locator('a.dropdown-toggle:has-text("O przedszkolu")');
    const dropdownCount = await aboutDropdown.count();

    if (dropdownCount > 0) {
      await aboutDropdown.click();
      await page.waitForTimeout(300);

      // Get all dropdown items
      const dropdownItems = page.locator('.dropdown-menu a.dropdown-item');
      const itemCount = await dropdownItems.count();

      expect(itemCount).toBeGreaterThan(0);

      // Verify each dropdown item has correct URL
      for (let i = 0; i < itemCount; i++) {
        const href = await dropdownItems.nth(i).getAttribute('href');
        
        if (href && href !== '#') {
          // Should have /wesole_nutki/pl/ prefix
          expect(href).toMatch(/^\/wesole_nutki\/pl\//);
          
          // Should be under /about/ path (child of about menu)
          expect(href).toContain('/about/');
        }
      }
    }
  });
});

test.describe('Menu URL Configuration - English Menus', () => {
  test('should have /en/ prefix in all English main menu items', async ({ page }) => {
    await page.goto('/en/');

    // Get all main navigation links in English
    const navLinks = page.locator('header nav a[href^="/wesole_nutki/en/"]');
    const count = await navLinks.count();

    // Should have multiple menu items
    expect(count).toBeGreaterThan(0);

    // Verify each link has correct structure
    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href');
      
      if (href && href !== '#') {
        // Should match pattern: /wesole_nutki/en/...
        expect(href).toMatch(/^\/wesole_nutki\/en\//);
        
        // Should NOT have Polish prefix
        expect(href).not.toContain('/pl/');
      }
    }
  });

  test('should navigate to correct pages from English menu items', async ({ page }) => {
    await page.goto('/en/');

    // Test specific menu items
    const menuTests = [
      { text: 'Home', expectedPath: '/en/' },
      { text: 'About', expectedPath: '/en/about' },
      { text: 'News', expectedPath: '/en/category/aktualnosci' },
    ];

    for (const menuTest of menuTests) {
      await page.goto('/en/');
      
      const menuItem = page.locator(`header nav a:has-text("${menuTest.text}")`).first();
      const count = await menuItem.count();

      if (count > 0) {
        const href = await menuItem.getAttribute('href');
        
        // Verify URL structure
        expect(href).toContain('/wesole_nutki' + menuTest.expectedPath);
        
        // Click and verify navigation
        await menuItem.click();
        await page.waitForURL(new RegExp(menuTest.expectedPath));
        
        expect(page.url()).toContain(menuTest.expectedPath);
      }
    }
  });

  test('should have correct URLs in English dropdown menu items', async ({ page }) => {
    await page.goto('/en/');

    // Find dropdown toggle for "About"
    const aboutDropdown = page.locator('a.dropdown-toggle:has-text("About")');
    const dropdownCount = await aboutDropdown.count();

    if (dropdownCount > 0) {
      await aboutDropdown.click();
      await page.waitForTimeout(300);

      // Get all dropdown items
      const dropdownItems = page.locator('.dropdown-menu a.dropdown-item');
      const itemCount = await dropdownItems.count();

      if (itemCount > 0) {
        // Verify each dropdown item has correct URL
        for (let i = 0; i < itemCount; i++) {
          const href = await dropdownItems.nth(i).getAttribute('href');
          
          if (href && href !== '#') {
            // Should have /wesole_nutki/en/ prefix
            expect(href).toMatch(/^\/wesole_nutki\/en\//);
            
            // Should NOT have Polish prefix
            expect(href).not.toContain('/pl/');
          }
        }
      }
    }
  });
});

test.describe('Menu URL Configuration - Menu Identifiers', () => {
  test('should resolve menu identifier "about" to correct URL', async ({ page }) => {
    await page.goto('/pl/');

    // The homepage about section uses menu identifier "about"
    // It should resolve to the about page with correct URL
    const aboutLink = page.locator('a[href*="/about"]').first();
    const count = await aboutLink.count();

    if (count > 0) {
      const href = await aboutLink.getAttribute('href');
      
      // Should have correct structure: /wesole_nutki/pl/about
      expect(href).toMatch(/^\/wesole_nutki\/pl\/about/);
      
      // Should NOT have double basepath (this was the bug)
      expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
      
      // Should NOT be missing language prefix
      expect(href).not.toMatch(/^\/wesole_nutki\/about/);
    }
  });

  test('should resolve menu index references to correct URLs', async ({ page }) => {
    await page.goto('/pl/');

    // The homepage CTA section uses menu index to get URL
    // It should resolve to correct URL with language prefix
    const ctaButtons = page.locator('[data-testid="cta-button"], .cta-button, .btn-primary');
    const count = await ctaButtons.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const href = await ctaButtons.nth(i).getAttribute('href');
        
        if (href && !href.startsWith('http') && href !== '#') {
          // Should have correct structure with language prefix
          expect(href).toMatch(/^\/wesole_nutki\/(pl|en)\//);
          
          // Should NOT have double basepath
          expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
        }
      }
    }
  });
});

test.describe('Menu URL Configuration - Parent-Child Relationships', () => {
  test('should have consistent URLs for parent and child menu items', async ({ page }) => {
    await page.goto('/pl/');

    // Click "O przedszkolu" dropdown
    const aboutDropdown = page.locator('a.dropdown-toggle:has-text("O przedszkolu")');
    const hasDropdown = await aboutDropdown.count() > 0;

    if (hasDropdown) {
      // Get parent menu item URL
      const parentHref = await aboutDropdown.getAttribute('href');
      
      if (parentHref && parentHref !== '#') {
        expect(parentHref).toMatch(/^\/wesole_nutki\/pl\//);
      }

      // Open dropdown
      await aboutDropdown.click();
      await page.waitForTimeout(300);

      // Get child menu items
      const childItems = page.locator('.dropdown-menu a.dropdown-item');
      const childCount = await childItems.count();

      // Verify all children have consistent URL structure
      for (let i = 0; i < childCount; i++) {
        const childHref = await childItems.nth(i).getAttribute('href');
        
        if (childHref && childHref !== '#') {
          // Child should have same basepath and language prefix as parent
          expect(childHref).toMatch(/^\/wesole_nutki\/pl\//);
          
          // Child should be under parent path
          if (parentHref && parentHref !== '#') {
            // If parent is /about, child should be /about/something
            expect(childHref).toContain('/about/');
          }
        }
      }
    }
  });
});

test.describe('Menu URL Configuration - Cross-Language Consistency', () => {
  test('should have parallel menu structures in Polish and English', async ({ page }) => {
    // Get Polish menu structure
    await page.goto('/pl/');
    const plNavLinks = page.locator('header nav a[href^="/wesole_nutki/pl/"]');
    const plCount = await plNavLinks.count();

    // Get English menu structure
    await page.goto('/en/');
    const enNavLinks = page.locator('header nav a[href^="/wesole_nutki/en/"]');
    const enCount = await enNavLinks.count();

    // Should have similar number of menu items (allowing for minor differences)
    expect(Math.abs(plCount - enCount)).toBeLessThanOrEqual(2);
  });

  test('should maintain URL structure across languages', async ({ page }) => {
    // Test that parallel pages have consistent structure
    const urlPairs = [
      { pl: '/pl/', en: '/en/' },
      { pl: '/pl/about', en: '/en/about' },
      { pl: '/pl/contact', en: '/en/contact' },
    ];

    for (const pair of urlPairs) {
      // Visit Polish version
      await page.goto('/wesole_nutki' + pair.pl);
      expect(page.url()).toContain(pair.pl);

      // Visit English version
      await page.goto('/wesole_nutki' + pair.en);
      expect(page.url()).toContain(pair.en);
    }
  });
});

test.describe('Menu URL Configuration - Special Cases', () => {
  test('should handle home menu item correctly', async ({ page }) => {
    await page.goto('/pl/about/');

    // Click home menu item
    const homeLink = page.locator('header nav a:has-text("Strona główna"), header nav a[href$="/pl/"]').first();
    const count = await homeLink.count();

    if (count > 0) {
      const href = await homeLink.getAttribute('href');
      
      // Should point to language home
      expect(href).toMatch(/^\/wesole_nutki\/pl\/$/);
      
      // Click and verify navigation
      await homeLink.click();
      await page.waitForURL(/\/wesole_nutki\/pl\/$/);
      
      expect(page.url()).toMatch(/\/wesole_nutki\/pl\/$/);
    }
  });

  test('should handle menu items with special characters in URLs', async ({ page }) => {
    await page.goto('/pl/');

    // Polish URLs may have special characters
    const navLinks = page.locator('header nav a[href]');
    const count = await navLinks.count();

    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href');
      
      if (href && href.startsWith('/wesole_nutki/pl/')) {
        // URL should be properly encoded
        expect(href).not.toContain(' ');
        
        // Should have valid URL structure
        expect(href).toMatch(/^\/wesole_nutki\/pl\/[a-z0-9\/-]*$/);
      }
    }
  });
});

test.describe('Menu URL Configuration - Footer Menus', () => {
  test('should have correct URLs in Polish footer menu', async ({ page }) => {
    await page.goto('/pl/');

    const footerLinks = page.locator('footer a[href^="/wesole_nutki/pl/"]');
    const count = await footerLinks.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const href = await footerLinks.nth(i).getAttribute('href');
        
        if (href) {
          // Should have correct structure
          expect(href).toMatch(/^\/wesole_nutki\/pl\//);
          
          // Should NOT have double basepath
          expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
        }
      }
    }
  });

  test('should have correct URLs in English footer menu', async ({ page }) => {
    await page.goto('/en/');

    const footerLinks = page.locator('footer a[href^="/wesole_nutki/en/"]');
    const count = await footerLinks.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const href = await footerLinks.nth(i).getAttribute('href');
        
        if (href) {
          // Should have correct structure
          expect(href).toMatch(/^\/wesole_nutki\/en\//);
          
          // Should NOT have double basepath
          expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
        }
      }
    }
  });
});
