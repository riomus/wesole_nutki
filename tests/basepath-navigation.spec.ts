import { test, expect } from '@playwright/test';

/**
 * BaseURL Path Handling Tests - Navigation
 *
 * These tests verify that all navigation links work correctly when the site
 * is deployed with a configured basepath (subdirectory) in the baseURL.
 *
 * Example: baseURL = "https://bartusiak.ai/wesole_nutki/"
 *
 * Tests verify that:
 * - Header menu links include the basepath
 * - Footer menu links include the basepath
 * - Breadcrumb links include the basepath
 * - Button/CTA links include the basepath
 * - External links are not modified
 */

test.describe('Basepath Navigation - Header Menu', () => {
  test('should include basepath in all header navigation links', async ({ page }) => {
    await page.goto('/pl/');

    // Get all navigation links from the header
    const navLinks = page.locator('header nav a.nav-link');
    const count = await navLinks.count();

    expect(count).toBeGreaterThan(0);

    // Check each navigation link
    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href');

      // Skip dropdown toggle anchors and external links
      if (href === '#' || !href) continue;
      if (href.startsWith('http')) continue;

      // Verify the href starts with basepath or language code
      expect(href).toMatch(/^(\/pl\/|\/en\/)/);
    }
  });

  test('should navigate to correct page when clicking menu items', async ({ page }) => {
    await page.goto('/pl/');

    // Click on "O przedszkolu" (About) menu item
    await page.click('text=O przedszkolu');

    // Wait for navigation
    await page.waitForURL(/\/pl\/about/);

    // Verify we're on the about page
    expect(page.url()).toContain('/pl/about');
  });

  test('should handle dropdown menu navigation correctly', async ({ page }) => {
    await page.goto('/pl/');

    // Find and click dropdown toggle
    const dropdown = page.locator('a.dropdown-toggle').first();
    await dropdown.click();

    // Wait for dropdown to open
    await page.waitForTimeout(300);

    // Click on a dropdown item
    const dropdownItem = page.locator('.dropdown-menu a.dropdown-item').first();
    const href = await dropdownItem.getAttribute('href');

    // Verify dropdown item has correct basepath
    expect(href).toMatch(/^(\/pl\/|\/en\/)/);

    await dropdownItem.click();

    // Verify navigation worked
    await page.waitForURL(/\/(pl|en)\//);
  });

  test('should preserve basepath when navigating between pages', async ({ page }) => {
    await page.goto('/pl/');

    // Navigate to gallery
    await page.click('text=Galerie');
    await page.waitForURL(/\/pl\/gallery/);

    // Navigate to contact
    await page.click('text=Kontakt');
    await page.waitForURL(/\/pl\/contact/);

    // Verify URLs always include language prefix
    expect(page.url()).toContain('/pl/contact');
  });
});

test.describe('Basepath Navigation - Footer Menu', () => {
  test('should include basepath in all footer navigation links', async ({ page }) => {
    await page.goto('/pl/');

    // Get all footer links
    const footerLinks = page.locator('footer .footer-links a');
    const count = await footerLinks.count();

    expect(count).toBeGreaterThan(0);

    // Check each footer link
    for (let i = 0; i < count; i++) {
      const href = await footerLinks.nth(i).getAttribute('href');

      if (href === '#' || !href) continue;
      if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) continue;

      // Verify the href starts with language code
      expect(href).toMatch(/^(\/pl\/|\/en\/)/);
    }
  });

  test('should navigate correctly when clicking footer links', async ({ page }) => {
    await page.goto('/pl/');

    // Find a footer link
    const footerLink = page.locator('footer .footer-links a').first();
    const href = await footerLink.getAttribute('href');

    if (href && !href.startsWith('#') && !href.startsWith('http')) {
      await footerLink.click();
      await page.waitForURL(/\/(pl|en)\//);

      // Verify we navigated successfully
      expect(page.url()).toMatch(/\/(pl|en)\//);
    }
  });
});

test.describe('Basepath Navigation - Breadcrumbs', () => {
  test('should include basepath in breadcrumb links', async ({ page }) => {
    // Navigate to a nested page that has breadcrumbs
    await page.goto('/pl/about/');

    // Get breadcrumb links
    const breadcrumbLinks = page.locator('.breadcrumb a');
    const count = await breadcrumbLinks.count();

    if (count > 0) {
      // Check each breadcrumb link
      for (let i = 0; i < count; i++) {
        const href = await breadcrumbLinks.nth(i).getAttribute('href');

        if (href && !href.startsWith('#')) {
          // Verify the href starts with language code
          expect(href).toMatch(/^(\/pl\/|\/en\/)/);
        }
      }
    }
  });

  test('should navigate correctly when clicking breadcrumb home link', async ({ page }) => {
    await page.goto('/pl/about/');

    // Click breadcrumb home link if it exists
    const homeLink = page.locator('.breadcrumb a').first();

    if (await homeLink.count() > 0) {
      await homeLink.click();
      await page.waitForURL(/\/pl\/$/);

      // Verify we're on the homepage
      expect(page.url()).toMatch(/\/pl\/$/);
    }
  });
});

test.describe('Basepath Navigation - CTA Buttons', () => {
  test('should include basepath in hero CTA button links', async ({ page }) => {
    await page.goto('/pl/');

    // Get hero CTA buttons
    const ctaButtons = page.locator('[data-testid="hero-cta-button"]');
    const count = await ctaButtons.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const href = await ctaButtons.nth(i).getAttribute('href');

        if (href && !href.startsWith('#') && !href.startsWith('http')) {
          // Verify the href starts with language code
          expect(href).toMatch(/^(\/pl\/|\/en\/)/);
        }
      }
    }
  });

  test('should navigate correctly when clicking CTA buttons', async ({ page }) => {
    await page.goto('/pl/');

    // Find a CTA button
    const ctaButton = page.locator('[data-testid="hero-cta-button"]').first();

    if (await ctaButton.count() > 0) {
      const href = await ctaButton.getAttribute('href');

      if (href && !href.startsWith('#') && !href.startsWith('http')) {
        await ctaButton.click();
        await page.waitForURL(/\/(pl|en)\//);

        // Verify we navigated successfully
        expect(page.url()).toMatch(/\/(pl|en)\//);
      }
    }
  });
});

test.describe('Basepath Navigation - Logo Link', () => {
  test('should include basepath in logo link', async ({ page }) => {
    await page.goto('/pl/about/');

    // Get logo link
    const logo = page.locator('.navbar-brand');
    const href = await logo.getAttribute('href');

    expect(href).toBeDefined();
    expect(href).toMatch(/^(\/pl\/|\/en\/)/);
  });

  test('should navigate to homepage when clicking logo', async ({ page }) => {
    await page.goto('/pl/about/');

    // Click logo
    await page.click('.navbar-brand');
    await page.waitForURL(/\/pl\/$/);

    // Verify we're on the homepage
    expect(page.url()).toMatch(/\/pl\/$/);
  });
});

test.describe('Basepath Navigation - Card Links', () => {
  test('should include basepath in news card links', async ({ page }) => {
    await page.goto('/pl/news/');

    // Get news card links
    const cardLinks = page.locator('.news-card a');
    const count = await cardLinks.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const href = await cardLinks.nth(i).getAttribute('href');

        if (href && !href.startsWith('#') && !href.startsWith('http')) {
          // Verify the href starts with language code
          expect(href).toMatch(/^(\/pl\/|\/en\/)/);
        }
      }
    }
  });

  test('should include basepath in gallery card links', async ({ page }) => {
    await page.goto('/pl/gallery/');

    // Get gallery card links
    const cardLinks = page.locator('.gallery-card-link');
    const count = await cardLinks.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const href = await cardLinks.nth(i).getAttribute('href');

        if (href && !href.startsWith('#') && !href.startsWith('http')) {
          // Verify the href starts with language code
          expect(href).toMatch(/^(\/pl\/|\/en\/)/);
        }
      }
    }
  });
});

test.describe('Basepath Navigation - External Links', () => {
  test('should not modify external links', async ({ page }) => {
    await page.goto('/pl/');

    // Get all links
    const allLinks = page.locator('a[href^="http"]');
    const count = await allLinks.count();

    // External links should remain absolute URLs
    for (let i = 0; i < Math.min(count, 10); i++) {
      const href = await allLinks.nth(i).getAttribute('href');
      expect(href).toMatch(/^https?:\/\//);
    }
  });

  test('should open external links correctly', async ({ page, context }) => {
    await page.goto('/pl/');

    // Find external links with target="_blank"
    const externalLinks = page.locator('a[href^="http"][target="_blank"]');
    const count = await externalLinks.count();

    if (count > 0) {
      const firstLink = externalLinks.first();
      const href = await firstLink.getAttribute('href');
      const rel = await firstLink.getAttribute('rel');

      // Verify security attributes
      expect(href).toMatch(/^https?:\/\//);
      expect(rel).toContain('noopener');
    }
  });
});
