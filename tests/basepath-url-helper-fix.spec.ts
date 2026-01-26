import { test, expect } from '@playwright/test';

/**
 * Basepath URL Helper Fix Tests
 *
 * These tests verify the fix for the basepath-url.html helper partial
 * that was causing double basepath issues.
 *
 * Bug Fixed: The helper was stripping the leading slash before calling relURL,
 * which caused Hugo to treat paths as page-relative instead of site-relative.
 *
 * Fix: Ensure paths always start with "/" before passing to relURL.
 *
 * Critical Test Cases:
 * 1. Menu URLs with language prefixes should not get double basepath
 * 2. Menu URLs without leading slash should be normalized correctly
 * 3. URLs from hugo.toml menus should include language prefix
 * 4. Homepage CTA buttons should use correct basepath
 * 5. All internal links should have single basepath only
 */

test.describe('Basepath URL Helper Fix - Double Basepath Prevention', () => {
  test('should not have double basepath in any URLs', async ({ page }) => {
    await page.goto('/pl/');

    // Get ALL links on the page
    const allLinks = page.locator('a[href]');
    const count = await allLinks.count();

    const doubleBasepathUrls: string[] = [];

    for (let i = 0; i < count; i++) {
      const href = await allLinks.nth(i).getAttribute('href');
      
      if (href && href.includes('/wesole_nutki/wesole_nutki/')) {
        doubleBasepathUrls.push(href);
      }
    }

    // Should have NO URLs with double basepath
    expect(doubleBasepathUrls).toEqual([]);
  });

  test('should have correct basepath in homepage about section links', async ({ page }) => {
    await page.goto('/pl/');

    // Find the about section link (this was one of the broken URLs)
    const aboutLinks = page.locator('a[href*="/about"]');
    const count = await aboutLinks.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const href = await aboutLinks.nth(i).getAttribute('href');
        
        if (href && !href.startsWith('http')) {
          // Should have single basepath with language prefix
          expect(href).toMatch(/^\/wesole_nutki\/pl\/about/);
          // Should NOT have double basepath
          expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
        }
      }
    }
  });

  test('should have correct basepath in homepage CTA section links', async ({ page }) => {
    await page.goto('/pl/');

    // Find CTA section links (volunteers category was one of the broken URLs)
    const ctaLinks = page.locator('a[href*="/category/"]');
    const count = await ctaLinks.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const href = await ctaLinks.nth(i).getAttribute('href');
        
        if (href && !href.startsWith('http')) {
          // Should have single basepath with language prefix
          expect(href).toMatch(/^\/wesole_nutki\/pl\//);
          // Should NOT have double basepath
          expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
        }
      }
    }
  });

  test('should have language prefix in all internal navigation links', async ({ page }) => {
    await page.goto('/pl/');

    // Get all internal navigation links
    const navLinks = page.locator('nav a[href^="/"]');
    const count = await navLinks.count();

    const missingLanguagePrefix: string[] = [];

    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href');
      
      if (href && !href.startsWith('http') && href !== '#') {
        // Should have language prefix after basepath
        if (!href.match(/\/wesole_nutki\/(pl|en)\//)) {
          missingLanguagePrefix.push(href);
        }
      }
    }

    // All internal links should have language prefix
    expect(missingLanguagePrefix).toEqual([]);
  });
});

test.describe('Basepath URL Helper Fix - Menu URL Processing', () => {
  test('should process hugo.toml menu URLs correctly', async ({ page }) => {
    await page.goto('/pl/');

    // Get all menu links
    const menuLinks = page.locator('header nav a[href]');
    const count = await menuLinks.count();

    for (let i = 0; i < count; i++) {
      const href = await menuLinks.nth(i).getAttribute('href');
      
      if (href && !href.startsWith('http') && href !== '#') {
        // Verify correct structure: /basepath/language/path
        expect(href).toMatch(/^\/wesole_nutki\/(pl|en)\//);
        
        // Verify no double basepath
        expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
        
        // Verify no missing language prefix
        expect(href).not.toMatch(/^\/wesole_nutki\/[^p][^l]/);
      }
    }
  });

  test('should handle dropdown menu URLs correctly', async ({ page }) => {
    await page.goto('/pl/');

    // Find dropdown menus
    const dropdownToggles = page.locator('a.dropdown-toggle');
    const toggleCount = await dropdownToggles.count();

    if (toggleCount > 0) {
      // Click first dropdown
      await dropdownToggles.first().click();
      await page.waitForTimeout(300);

      // Get dropdown items
      const dropdownItems = page.locator('.dropdown-menu a.dropdown-item');
      const itemCount = await dropdownItems.count();

      for (let i = 0; i < itemCount; i++) {
        const href = await dropdownItems.nth(i).getAttribute('href');
        
        if (href && !href.startsWith('http') && href !== '#') {
          // Verify correct structure
          expect(href).toMatch(/^\/wesole_nutki\/(pl|en)\//);
          
          // Verify no double basepath
          expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
        }
      }
    }
  });

  test('should handle footer menu URLs correctly', async ({ page }) => {
    await page.goto('/pl/');

    // Get footer links
    const footerLinks = page.locator('footer a[href^="/"]');
    const count = await footerLinks.count();

    for (let i = 0; i < count; i++) {
      const href = await footerLinks.nth(i).getAttribute('href');
      
      if (href && !href.startsWith('http') && href !== '#') {
        // Verify correct structure
        expect(href).toMatch(/^\/wesole_nutki\/(pl|en)\//);
        
        // Verify no double basepath
        expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
      }
    }
  });
});

test.describe('Basepath URL Helper Fix - Edge Cases', () => {
  test('should handle URLs with trailing slashes correctly', async ({ page }) => {
    await page.goto('/pl/');

    // Get all internal links
    const links = page.locator('a[href^="/wesole_nutki/"]');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      
      if (href) {
        // Should not have double slashes (except after protocol)
        expect(href).not.toMatch(/\/\//);
      }
    }
  });

  test('should handle URLs without trailing slashes correctly', async ({ page }) => {
    // Hugo typically redirects URLs without trailing slashes to add them
    // Navigate and wait for the redirect
    await page.goto('/pl/about');
    await page.waitForLoadState('networkidle');

    // Verify we're on a valid page (either /pl/about or /pl/about/)
    expect(page.url()).toMatch(/\/wesole_nutki\/pl\/about\/?$/);

    // Navigation should still work
    const navLinks = page.locator('header nav a[href]');
    const count = await navLinks.count();

    // If we got redirected, navigation links should exist
    if (count > 0) {
      // All links should still be properly formatted
      for (let i = 0; i < Math.min(count, 5); i++) {
        const href = await navLinks.nth(i).getAttribute('href');
        
        if (href && !href.startsWith('http') && href !== '#') {
          expect(href).toMatch(/^\/wesole_nutki\/(pl|en)\//);
        }
      }
    }
  });

  test('should handle external links without modification', async ({ page }) => {
    await page.goto('/pl/');

    // Get external links
    const externalLinks = page.locator('a[href^="http"]');
    const count = await externalLinks.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const href = await externalLinks.nth(i).getAttribute('href');
      
      // Should remain absolute URLs
      expect(href).toMatch(/^https?:\/\//);
      
      // Should NOT have basepath added
      expect(href).not.toContain('/wesole_nutki/');
    }
  });

  test('should handle anchor links without modification', async ({ page }) => {
    await page.goto('/pl/');

    // Get anchor links
    const anchorLinks = page.locator('a[href="#"]');
    const count = await anchorLinks.count();

    for (let i = 0; i < count; i++) {
      const href = await anchorLinks.nth(i).getAttribute('href');
      
      // Should remain as "#"
      expect(href).toBe('#');
    }
  });
});

test.describe('Basepath URL Helper Fix - Language Switching', () => {
  test('should handle language switcher URLs correctly', async ({ page }) => {
    await page.goto('/pl/');

    // Find language switcher
    const langSwitcher = page.locator('[data-testid="language-switcher"], .language-switcher, .lang-switch');
    const count = await langSwitcher.count();

    if (count > 0) {
      const langLinks = page.locator('[data-testid="language-switcher"] a, .language-switcher a, .lang-switch a');
      const linkCount = await langLinks.count();

      for (let i = 0; i < linkCount; i++) {
        const href = await langLinks.nth(i).getAttribute('href');
        
        if (href && !href.startsWith('http')) {
          // Should have correct basepath and language prefix
          expect(href).toMatch(/^\/wesole_nutki\/(pl|en)\//);
          
          // Should not have double basepath
          expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
        }
      }
    }
  });

  test('should navigate between languages correctly', async ({ page }) => {
    await page.goto('/pl/');

    // Try to find and click English language link
    const enLink = page.locator('a[href*="/en/"]').first();
    const count = await enLink.count();

    if (count > 0) {
      const href = await enLink.getAttribute('href');
      
      // Verify it has correct structure
      expect(href).toMatch(/^\/wesole_nutki\/en\//);
      
      await enLink.click();
      await page.waitForURL(/\/wesole_nutki\/en\//);
      
      // Verify we're on English version
      expect(page.url()).toContain('/wesole_nutki/en/');
    }
  });
});

test.describe('Basepath URL Helper Fix - Homepage Sections', () => {
  test('should have correct URLs in homepage hero section', async ({ page }) => {
    await page.goto('/pl/');

    // Get hero section links
    const heroLinks = page.locator('[data-testid="hero-section"] a, .hero a, section:first-of-type a').first();
    const count = await heroLinks.count();

    if (count > 0) {
      const href = await heroLinks.getAttribute('href');
      
      if (href && !href.startsWith('http') && href !== '#') {
        // Should have correct structure
        expect(href).toMatch(/^\/wesole_nutki\/(pl|en)\//);
        
        // Should not have double basepath
        expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
      }
    }
  });

  test('should have correct URLs in homepage news section', async ({ page }) => {
    await page.goto('/pl/');

    // Get news section links
    const newsLinks = page.locator('a[href*="/news"], a[href*="/category/"]');
    const count = await newsLinks.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const href = await newsLinks.nth(i).getAttribute('href');
        
        if (href && !href.startsWith('http') && href !== '#') {
          // Should have correct structure
          expect(href).toMatch(/^\/wesole_nutki\/(pl|en)\//);
          
          // Should not have double basepath
          expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
        }
      }
    }
  });

  test('should have correct URLs in homepage gallery section', async ({ page }) => {
    await page.goto('/pl/');

    // Get gallery section links
    const galleryLinks = page.locator('a[href*="/gallery"]');
    const count = await galleryLinks.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const href = await galleryLinks.nth(i).getAttribute('href');
        
        if (href && !href.startsWith('http') && href !== '#') {
          // Should have correct structure
          expect(href).toMatch(/^\/wesole_nutki\/(pl|en)\//);
          
          // Should not have double basepath
          expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
        }
      }
    }
  });
});
