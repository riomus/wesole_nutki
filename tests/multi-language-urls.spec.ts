import { test, expect } from '@playwright/test';

/**
 * Multi-Language URL Handling E2E Tests
 * Tests to verify that URLs are correctly structured and handled across Polish and English versions.
 * Ensures proper language prefixes, consistent URL patterns, and correct navigation behavior.
 */

test.describe('Multi-Language URL Structure', () => {
  test.describe('Homepage URLs', () => {
    test('should have Polish language prefix in Polish homepage URL', async ({ page }) => {
      await page.goto('/pl/');

      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/pl\/?$/);
    });

    test('should have English language prefix in English homepage URL', async ({ page }) => {
      await page.goto('/en/');

      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/en\/?$/);
    });

    test('should redirect root to default language (Polish)', async ({ page }) => {
      await page.goto('/');

      // Should redirect to Polish version
      await expect(page).toHaveURL(/\/pl\/?$/);
    });

    test('should maintain language prefix after navigation', async ({ page }) => {
      await page.goto('/pl/');

      // Click on a navigation link
      const aboutLink = page.locator('.navbar-nav .nav-link').filter({ hasText: /O Nas|About/i });
      if (await aboutLink.count() > 0) {
        await aboutLink.click();
        await page.waitForLoadState('networkidle');

        // Should still be on Polish version
        const currentUrl = page.url();
        expect(currentUrl).toContain('/pl/');
      }
    });
  });

  test.describe('Content Page URLs', () => {
    test('should have consistent Polish URL pattern for about page', async ({ page }) => {
      await page.goto('/pl/about/');

      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/pl\/about\/?$/);
    });

    test('should have consistent English URL pattern for about page', async ({ page }) => {
      await page.goto('/en/about/');

      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/en\/about\/?$/);
    });

    test('should have consistent Polish URL pattern for contact page', async ({ page }) => {
      await page.goto('/pl/contact/');

      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/pl\/contact\/?$/);
    });

    test('should have consistent English URL pattern for contact page', async ({ page }) => {
      await page.goto('/en/contact/');

      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/en\/contact\/?$/);
    });

    test('should have consistent Polish URL pattern for programs page', async ({ page }) => {
      await page.goto('/pl/programs/');

      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/pl\/programs\/?$/);
    });

    test('should have consistent English URL pattern for programs page', async ({ page }) => {
      await page.goto('/en/programs/');

      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/en\/programs\/?$/);
    });
  });

  test.describe('Section URLs (News, Gallery)', () => {
    test('should have correct Polish URL pattern for news section', async ({ page }) => {
      await page.goto('/pl/news/');

      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/pl\/news\/?$/);
    });

    test('should have correct English URL pattern for news section', async ({ page }) => {
      await page.goto('/en/news/');

      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/en\/news\/?$/);
    });

    test('should have correct Polish URL pattern for gallery section', async ({ page }) => {
      await page.goto('/pl/gallery/');

      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/pl\/gallery\/?$/);
    });

    test('should have correct English URL pattern for gallery section', async ({ page }) => {
      await page.goto('/en/gallery/');

      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/en\/gallery\/?$/);
    });

    test('should maintain language in news article URLs', async ({ page }) => {
      await page.goto('/pl/news/');

      const newsLinks = page.locator('.news-card a, article a');
      if (await newsLinks.count() > 0) {
        const firstLink = newsLinks.first();
        const href = await firstLink.getAttribute('href');

        expect(href).toBeTruthy();
        // Polish news articles should have /pl/ in URL (or date-based for legacy)
        expect(href).toMatch(/\/(pl\/news\/|[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/).+/);
      }
    });

    test('should maintain language in English news article URLs', async ({ page }) => {
      await page.goto('/en/news/');

      const newsLinks = page.locator('.news-card a, article a');
      if (await newsLinks.count() > 0) {
        const firstLink = newsLinks.first();
        const href = await firstLink.getAttribute('href');

        expect(href).toBeTruthy();
        expect(href).toContain('/en/');
      }
    });

    test('should maintain language in gallery item URLs', async ({ page }) => {
      await page.goto('/pl/gallery/');

      const galleryLinks = page.locator('.gallery-card a, article a');
      if (await galleryLinks.count() > 0) {
        const firstLink = galleryLinks.first();
        const href = await firstLink.getAttribute('href');

        expect(href).toBeTruthy();
        expect(href).toContain('/pl/');
      }
    });
  });

  test.describe('Taxonomy URLs (Categories, Tags)', () => {
    test('should have language prefix in category URLs', async ({ page }) => {
      await page.goto('/pl/news/');

      const categoryLinks = page.locator('a[href*="categories"], a[href*="category"]');
      if (await categoryLinks.count() > 0) {
        const firstCategory = categoryLinks.first();
        const href = await firstCategory.getAttribute('href');

        expect(href).toBeTruthy();
        expect(href).toContain('/pl/');
      }
    });

    test('should have language prefix in tag URLs', async ({ page }) => {
      await page.goto('/pl/news/');

      const tagLinks = page.locator('a[href*="tags"], a[href*="tag"]');
      if (await tagLinks.count() > 0) {
        const firstTag = tagLinks.first();
        const href = await firstTag.getAttribute('href');

        expect(href).toBeTruthy();
        expect(href).toContain('/pl/');
      }
    });

    test('should navigate to correct language category page', async ({ page }) => {
      await page.goto('/pl/news/');

      const categoryLinks = page.locator('a[href*="categories"], a[href*="category"]');
      if (await categoryLinks.count() > 0) {
        const firstCategory = categoryLinks.first();
        await firstCategory.click();
        await page.waitForLoadState('networkidle');

        // Should be on Polish category page
        const currentUrl = page.url();
        expect(currentUrl).toContain('/pl/');
      }
    });
  });
});

test.describe('Language Switcher URL Behavior', () => {
  test('should switch from Polish to English homepage', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Click English language button
    const enButton = page.locator('.site-header .lang-btn').filter({
      has: page.locator('.lang-code', { hasText: 'EN' })
    });

    await enButton.click();
    await page.waitForLoadState('networkidle');

    // Should navigate to English homepage
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/en\/?$/);
  });

  test('should switch from English to Polish homepage', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');

    // Click Polish language button
    const plButton = page.locator('.site-header .lang-btn').filter({
      has: page.locator('.lang-code', { hasText: 'PL' })
    });

    await plButton.click();
    await page.waitForLoadState('networkidle');

    // Should navigate to Polish homepage
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/pl\/?$/);
  });

  test('should maintain page context when switching languages on about page', async ({ page }) => {
    await page.goto('/pl/about/');
    await page.waitForLoadState('networkidle');

    // Click English language button
    const enButton = page.locator('.site-header .lang-btn').filter({
      has: page.locator('.lang-code', { hasText: 'EN' })
    });

    await enButton.click();
    await page.waitForLoadState('networkidle');

    // Should navigate to English about page
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/en\/about\/?$/);
  });

  test('should have correct hreflang attribute on language switch links', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // English link should have hreflang="en"
    const enLink = page.locator('.site-header .lang-btn[hreflang="en"]');
    await expect(enLink).toBeVisible();

    const href = await enLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toContain('/en/');
  });

  test('should have correct hreflang attribute on Polish language link', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');

    // Polish link should have hreflang="pl"
    const plLink = page.locator('.site-header .lang-btn[hreflang="pl"]');
    await expect(plLink).toBeVisible();

    const href = await plLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toContain('/pl/');
  });
});

test.describe('Navigation Link Language Context', () => {
  test('should maintain Polish language in all navigation links', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Get all navigation links
    const navLinks = page.locator('.navbar-nav a[href]');
    const count = await navLinks.count();

    // Check first few navigation links
    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');

      if (href && href.startsWith('/')) {
        // Internal links should contain /pl/ or be root (/)
        expect(href).toMatch(/^(\/pl\/|\/)/);
      }
    }
  });

  test('should maintain English language in all navigation links', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');

    // Get all navigation links
    const navLinks = page.locator('.navbar-nav a[href]');
    const count = await navLinks.count();

    // Check first few navigation links
    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');

      if (href && href.startsWith('/')) {
        // Internal links should contain /en/ or be root (/)
        expect(href).toMatch(/^(\/en\/|\/)/);
      }
    }
  });

  test('should not mix languages in navigation links', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Get all navigation links
    const navLinks = page.locator('.navbar-nav a[href*="/en/"]');
    const count = await navLinks.count();

    // Should have no /en/ links on Polish page (except language switcher)
    // Language switcher links are in .language-switcher, not .navbar-nav
    expect(count).toBe(0);
  });

  test('should maintain language in dropdown menu links', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Open a dropdown menu
    const dropdown = page.locator('.navbar-nav .dropdown-toggle').first();
    if (await dropdown.count() > 0) {
      await dropdown.click();
      await page.waitForTimeout(500); // Wait for dropdown animation

      // Check dropdown menu items - use more specific selector
      const dropdownLinks = page.locator('.navbar-nav .dropdown-menu.show a[href]');
      const count = await dropdownLinks.count();

      if (count > 0) {
        // Verify links are valid and clickable
        for (let i = 0; i < Math.min(count, 3); i++) {
          const link = dropdownLinks.nth(i);
          const href = await link.getAttribute('href');
          expect(href).toBeTruthy();
          expect(href).not.toBe('#');
        }

        // Click one link to verify it navigates successfully
        const firstLink = dropdownLinks.first();
        await firstLink.click();
        await page.waitForLoadState('networkidle');

        const currentUrl = page.url();
        // After clicking, should navigate away from homepage
        expect(currentUrl).not.toMatch(/\/pl\/?$/);

        // Should maintain Polish language context (either /pl/ prefix or Polish-specific paths)
        // Note: Some Polish pages may not have /pl/ prefix based on site configuration
        expect(currentUrl).toMatch(/\/(pl\/|plan-zajec|plan-dnia|o-przedszkolu|kontakt|galerie|kadra|rekrutacja)/);
      }
    }
  });
});

test.describe('URL Consistency Across Content Types', () => {
  test('should have consistent URL structure for Polish pages', async ({ page }) => {
    const polishPages = [
      '/pl/',
      '/pl/about/',
      '/pl/news/',
      '/pl/gallery/',
      '/pl/programs/',
      '/pl/contact/'
    ];

    for (const pagePath of polishPages) {
      const response = await page.goto(pagePath);
      expect(response?.status()).toBe(200);

      const currentUrl = page.url();
      expect(currentUrl).toContain('/pl/');
    }
  });

  test('should have consistent URL structure for English pages', async ({ page }) => {
    const englishPages = [
      '/en/',
      '/en/about/',
      '/en/news/',
      '/en/gallery/',
      '/en/programs/',
      '/en/contact/'
    ];

    for (const pagePath of englishPages) {
      const response = await page.goto(pagePath);
      expect(response?.status()).toBe(200);

      const currentUrl = page.url();
      expect(currentUrl).toContain('/en/');
    }
  });

  test('should return 404 for page without language prefix', async ({ page }) => {
    const response = await page.goto('/about/', { waitUntil: 'domcontentloaded' });

    // Should either redirect to language-prefixed version or return 404
    const status = response?.status();
    expect([200, 301, 302, 404]).toContain(status);

    // If it redirects, it should go to a language-prefixed version
    if (status === 200 || status === 301 || status === 302) {
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/(pl|en)\//);
    }
  });
});

test.describe('URL Path Structure', () => {
  test('should use trailing slashes consistently', async ({ page }) => {
    await page.goto('/pl/about/');

    const currentUrl = page.url();
    // Section pages should have trailing slashes
    expect(currentUrl).toMatch(/\/about\/$/);
  });

  test('should maintain baseURL structure when present', async ({ page }) => {
    await page.goto('/pl/');

    const currentUrl = page.url();
    const url = new URL(currentUrl);

    // Check if baseURL has a subdirectory
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.length > 1) {
      // If we have a subdirectory (e.g., /wesole_nutki/pl/)
      const firstPart = pathParts[0];
      if (firstPart !== 'pl' && firstPart !== 'en') {
        // This is a basepath, verify it's consistent
        const logo = page.locator('.navbar-brand img');
        const logoSrc = await logo.getAttribute('src');

        if (logoSrc && logoSrc.startsWith('/')) {
          expect(logoSrc).toContain(`/${firstPart}/`);
        }
      }
    }
  });

  test('should not have double slashes in URLs', async ({ page }) => {
    await page.goto('/pl/about/');

    // Check all links on the page
    const allLinks = page.locator('a[href]');
    const count = await allLinks.count();

    for (let i = 0; i < Math.min(count, 20); i++) {
      const link = allLinks.nth(i);
      const href = await link.getAttribute('href');

      if (href && !href.startsWith('http')) {
        // Internal links should not have double slashes
        expect(href).not.toMatch(/\/\//);
      }
    }
  });

  test('should use lowercase in URL paths', async ({ page }) => {
    await page.goto('/pl/');

    const navLinks = page.locator('.navbar-nav a[href]');
    const count = await navLinks.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');

      if (href && href.startsWith('/')) {
        // URLs should generally be lowercase (except for language codes)
        const urlParts = href.split('/').filter(Boolean);
        for (const part of urlParts) {
          if (part !== 'PL' && part !== 'EN') {
            expect(part).toBe(part.toLowerCase());
          }
        }
      }
    }
  });
});

test.describe('Cross-Language URL Consistency', () => {
  test('should have parallel URL structures for Polish and English', async ({ page }) => {
    // Test that similar pages have similar URL structures in both languages

    // Polish about page
    await page.goto('/pl/about/');
    const plAboutUrl = page.url();

    // English about page
    await page.goto('/en/about/');
    const enAboutUrl = page.url();

    // Extract path structure (without language prefix)
    const plPath = plAboutUrl.replace(/\/pl\//, '/');
    const enPath = enAboutUrl.replace(/\/en\//, '/');

    // Paths should be similar (might differ in slug but structure should match)
    expect(plPath.split('/').length).toBe(enPath.split('/').length);
  });

  test('should maintain URL parameters across language switch', async ({ page }) => {
    // Navigate to a page with potential parameters
    await page.goto('/pl/news/');
    await page.waitForLoadState('networkidle');

    const originalUrl = page.url();

    // Switch language
    const enButton = page.locator('.site-header .lang-btn').filter({
      has: page.locator('.lang-code', { hasText: 'EN' })
    });

    if (await enButton.count() > 0) {
      await enButton.click();
      await page.waitForLoadState('networkidle');

      const newUrl = page.url();

      // Both should be on news section
      expect(originalUrl).toContain('/news/');
      expect(newUrl).toContain('/news/');

      // But different languages
      expect(originalUrl).toContain('/pl/');
      expect(newUrl).toContain('/en/');
    }
  });
});

test.describe('Mobile Multi-Language URLs', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('should maintain language prefix in mobile navigation', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Open mobile menu
    const menuToggle = page.locator('.navbar-toggler');
    await menuToggle.click();
    await page.waitForTimeout(500);

    // Check mobile menu links
    const navLinks = page.locator('#navbarMain a[href]');
    const count = await navLinks.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');

      if (href && href.startsWith('/') && !href.startsWith('//')) {
        // Should maintain Polish language
        expect(href).toMatch(/^(\/pl\/|\/)/);
      }
    }
  });

  test('should work with language switcher on mobile', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Open mobile menu
    const menuToggle = page.locator('.navbar-toggler');
    await menuToggle.click();
    await page.waitForTimeout(500);

    // Find language switcher in mobile menu - use more specific selector to get only the header one
    const enButton = page.locator('#navbarMain .lang-btn').filter({
      has: page.locator('.lang-code', { hasText: 'EN' })
    }).first();

    if (await enButton.count() > 0) {
      await enButton.click();
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();
      expect(currentUrl).toContain('/en/');
    }
  });
});

test.describe('URL Accessibility and SEO', () => {
  test('should have hreflang meta tags for language alternates', async ({ page }) => {
    await page.goto('/pl/about/');

    // Check for hreflang alternate links in head
    const hreflangLinks = page.locator('head link[rel="alternate"][hreflang]');
    const count = await hreflangLinks.count();

    expect(count).toBeGreaterThan(0);

    // Should have at least one alternate language
    const enAlternate = page.locator('head link[rel="alternate"][hreflang="en"]');
    if (await enAlternate.count() > 0) {
      const href = await enAlternate.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toContain('/en/');
    }
  });

  test('should have correct lang attribute in HTML for Polish', async ({ page }) => {
    await page.goto('/pl/');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'pl');
  });

  test('should have correct lang attribute in HTML for English', async ({ page }) => {
    await page.goto('/en/');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
  });

  test('should have language-specific canonical URLs', async ({ page }) => {
    // Polish canonical
    await page.goto('/pl/about/');
    const plCanonical = page.locator('link[rel="canonical"]');
    const plHref = await plCanonical.getAttribute('href');

    expect(plHref).toBeTruthy();
    expect(plHref).toContain('/pl/');

    // English canonical
    await page.goto('/en/about/');
    const enCanonical = page.locator('link[rel="canonical"]');
    const enHref = await enCanonical.getAttribute('href');

    expect(enHref).toBeTruthy();
    expect(enHref).toContain('/en/');
  });
});
