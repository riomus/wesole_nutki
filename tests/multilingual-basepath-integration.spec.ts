import { test, expect } from '@playwright/test';

/**
 * Multilingual Basepath URL Tests
 *
 * These tests verify that multilingual URL handling works correctly
 * with the configured basepath.
 *
 * The site uses:
 * - defaultContentLanguageInSubdir = true
 * - Languages: pl (default), en
 * - baseURL with subdirectory: /wesole_nutki/
 *
 * Critical Test Cases:
 * 1. Language switcher should work correctly with basepath
 * 2. Translated content should have correct language prefix
 * 3. Fallback behavior for missing translations
 * 4. Language-specific URLs should be independent
 * 5. Cross-language navigation should preserve basepath
 */

test.describe('Multilingual Basepath - Language Switcher', () => {
  test('should switch from Polish to English correctly', async ({ page }) => {
    await page.goto('/pl/');

    // Find English language link
    const enLink = page.locator('a[href*="/en/"], a[hreflang="en"]').first();
    const count = await enLink.count();

    if (count > 0) {
      const href = await enLink.getAttribute('href');
      
      // Should have basepath and English prefix
      expect(href).toMatch(/\/wesole_nutki\/en\//);
      
      // Should NOT have double basepath
      expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
      
      // Click and verify navigation
      await enLink.click();
      await page.waitForURL(/\/wesole_nutki\/en\//);
      
      expect(page.url()).toContain('/wesole_nutki/en/');
    }
  });

  test('should switch from English to Polish correctly', async ({ page }) => {
    await page.goto('/en/');

    // Find Polish language link
    const plLink = page.locator('a[href*="/pl/"], a[hreflang="pl"]').first();
    const count = await plLink.count();

    if (count > 0) {
      const href = await plLink.getAttribute('href');
      
      // Should have basepath and Polish prefix
      expect(href).toMatch(/\/wesole_nutki\/pl\//);
      
      // Should NOT have double basepath
      expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
      
      // Click and verify navigation
      await plLink.click();
      await page.waitForURL(/\/wesole_nutki\/pl\//);
      
      expect(page.url()).toContain('/wesole_nutki/pl/');
    }
  });

  test('should maintain page context when switching languages', async ({ page }) => {
    // Go to Polish about page
    await page.goto('/pl/about/');

    // Find English language link
    const enLink = page.locator('a[href*="/en/"], a[hreflang="en"]').first();
    const count = await enLink.count();

    if (count > 0) {
      const href = await enLink.getAttribute('href');
      
      // Should point to English about page (or English home if translation doesn't exist)
      expect(href).toMatch(/\/wesole_nutki\/en\//);
      
      await enLink.click();
      await page.waitForURL(/\/wesole_nutki\/en\//);
      
      // Should be on English version
      expect(page.url()).toContain('/wesole_nutki/en/');
    }
  });
});

test.describe('Multilingual Basepath - Alternate Links', () => {
  test('should have correct alternate links in Polish pages', async ({ page }) => {
    await page.goto('/pl/');

    // Get alternate language links
    const alternateLinks = page.locator('link[rel="alternate"][hreflang]');
    const count = await alternateLinks.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const href = await alternateLinks.nth(i).getAttribute('href');
        const hreflang = await alternateLinks.nth(i).getAttribute('hreflang');
        
        if (href && hreflang) {
          // Should be absolute URLs
          expect(href).toMatch(/^https?:\/\//);
          
          // Should contain basepath
          expect(href).toContain('/wesole_nutki/');
          
          // Should NOT have double basepath
          expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
          
          // Should have correct language in URL
          if (hreflang === 'pl') {
            expect(href).toContain('/pl/');
          } else if (hreflang === 'en') {
            expect(href).toContain('/en/');
          }
        }
      }
    }
  });

  test('should have correct alternate links in English pages', async ({ page }) => {
    await page.goto('/en/');

    // Get alternate language links
    const alternateLinks = page.locator('link[rel="alternate"][hreflang]');
    const count = await alternateLinks.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const href = await alternateLinks.nth(i).getAttribute('href');
        const hreflang = await alternateLinks.nth(i).getAttribute('hreflang');
        
        if (href && hreflang) {
          // Should be absolute URLs
          expect(href).toMatch(/^https?:\/\//);
          
          // Should contain basepath
          expect(href).toContain('/wesole_nutki/');
          
          // Should NOT have double basepath
          expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
        }
      }
    }
  });
});

test.describe('Multilingual Basepath - Language-Specific Content', () => {
  test('should have Polish content URLs with /pl/ prefix', async ({ page }) => {
    await page.goto('/pl/');

    // Get all content links (news, galleries, etc.)
    const contentLinks = page.locator('a[href*="/pl/news"], a[href*="/pl/gallery"], a[href*="/pl/category"]');
    const count = await contentLinks.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 10); i++) {
        const href = await contentLinks.nth(i).getAttribute('href');
        
        if (href) {
          // Should have basepath and Polish prefix
          expect(href).toMatch(/\/wesole_nutki\/pl\//);
          
          // Should NOT have English prefix
          expect(href).not.toContain('/en/');
        }
      }
    }
  });

  test('should have English content URLs with /en/ prefix', async ({ page }) => {
    await page.goto('/en/');

    // Get all content links
    const contentLinks = page.locator('a[href*="/en/news"], a[href*="/en/gallery"], a[href*="/en/category"]');
    const count = await contentLinks.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 10); i++) {
        const href = await contentLinks.nth(i).getAttribute('href');
        
        if (href) {
          // Should have basepath and English prefix
          expect(href).toMatch(/\/wesole_nutki\/en\//);
          
          // Should NOT have Polish prefix
          expect(href).not.toContain('/pl/');
        }
      }
    }
  });
});

test.describe('Multilingual Basepath - Navigation Consistency', () => {
  test('should maintain language when navigating within Polish site', async ({ page }) => {
    await page.goto('/pl/');

    // Navigate to different pages
    const navigationSteps = [
      { selector: 'a[href*="/pl/about"]', expectedLang: 'pl' },
      { selector: 'a[href*="/pl/news"], a[href*="/pl/category"]', expectedLang: 'pl' },
      { selector: 'a[href*="/pl/contact"]', expectedLang: 'pl' },
    ];

    for (const step of navigationSteps) {
      const link = page.locator(step.selector).first();
      const count = await link.count();

      if (count > 0) {
        await link.click();
        await page.waitForURL(/\/wesole_nutki\/pl\//);
        
        // Should still be in Polish
        expect(page.url()).toContain('/wesole_nutki/pl/');
        expect(page.url()).not.toContain('/en/');
      }
    }
  });

  test('should maintain language when navigating within English site', async ({ page }) => {
    await page.goto('/en/');

    // Navigate to different pages
    const navigationSteps = [
      { selector: 'a[href*="/en/about"]', expectedLang: 'en' },
      { selector: 'a[href*="/en/news"], a[href*="/en/category"]', expectedLang: 'en' },
      { selector: 'a[href*="/en/contact"]', expectedLang: 'en' },
    ];

    for (const step of navigationSteps) {
      const link = page.locator(step.selector).first();
      const count = await link.count();

      if (count > 0) {
        await link.click();
        await page.waitForURL(/\/wesole_nutki\/en\//);
        
        // Should still be in English
        expect(page.url()).toContain('/wesole_nutki/en/');
        expect(page.url()).not.toContain('/pl/');
      }
    }
  });
});

test.describe('Multilingual Basepath - SEO Meta Tags', () => {
  test('should have correct canonical URL in Polish pages', async ({ page }) => {
    await page.goto('/pl/');

    const canonical = page.locator('link[rel="canonical"]');
    const count = await canonical.count();

    if (count > 0) {
      const href = await canonical.getAttribute('href');
      
      if (href) {
        // Should be absolute URL
        expect(href).toMatch(/^https?:\/\//);
        
        // Should contain basepath and language
        expect(href).toContain('/wesole_nutki/pl/');
        
        // Should NOT have double basepath
        expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
      }
    }
  });

  test('should have correct canonical URL in English pages', async ({ page }) => {
    await page.goto('/en/');

    const canonical = page.locator('link[rel="canonical"]');
    const count = await canonical.count();

    if (count > 0) {
      const href = await canonical.getAttribute('href');
      
      if (href) {
        // Should be absolute URL
        expect(href).toMatch(/^https?:\/\//);
        
        // Should contain basepath and language
        expect(href).toContain('/wesole_nutki/en/');
        
        // Should NOT have double basepath
        expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
      }
    }
  });

  test('should have correct og:url in Polish pages', async ({ page }) => {
    await page.goto('/pl/');

    const ogUrl = page.locator('meta[property="og:url"]');
    const count = await ogUrl.count();

    if (count > 0) {
      const content = await ogUrl.getAttribute('content');
      
      if (content) {
        // Should be absolute URL
        expect(content).toMatch(/^https?:\/\//);
        
        // Should contain basepath and language
        expect(content).toContain('/wesole_nutki/pl/');
        
        // Should NOT have double basepath
        expect(content).not.toContain('/wesole_nutki/wesole_nutki/');
      }
    }
  });

  test('should have correct og:url in English pages', async ({ page }) => {
    await page.goto('/en/');

    const ogUrl = page.locator('meta[property="og:url"]');
    const count = await ogUrl.count();

    if (count > 0) {
      const content = await ogUrl.getAttribute('content');
      
      if (content) {
        // Should be absolute URL
        expect(content).toMatch(/^https?:\/\//);
        
        // Should contain basepath and language
        expect(content).toContain('/wesole_nutki/en/');
        
        // Should NOT have double basepath
        expect(content).not.toContain('/wesole_nutki/wesole_nutki/');
      }
    }
  });
});

test.describe('Multilingual Basepath - RSS and Sitemap', () => {
  test('should have language-specific RSS feeds with correct URLs', async ({ page }) => {
    await page.goto('/pl/');

    // Look for RSS feed links
    const rssLink = page.locator('link[type="application/rss+xml"]');
    const count = await rssLink.count();

    if (count > 0) {
      const href = await rssLink.getAttribute('href');
      
      if (href) {
        // Should contain basepath
        expect(href).toMatch(/\/wesole_nutki\//);
        
        // Should NOT have double basepath
        expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
      }
    }
  });
});

test.describe('Multilingual Basepath - Translation Fallback', () => {
  test('should handle missing English translations gracefully', async ({ page }) => {
    await page.goto('/pl/');

    // Try to switch to English
    const enLink = page.locator('a[href*="/en/"]').first();
    const count = await enLink.count();

    if (count > 0) {
      await enLink.click();
      await page.waitForURL(/\/wesole_nutki\/en\//);
      
      // Should navigate to English version (either same page or home)
      expect(page.url()).toContain('/wesole_nutki/en/');
      
      // Should not show error
      const errorText = await page.locator('body').textContent();
      expect(errorText?.toLowerCase()).not.toContain('404');
      expect(errorText?.toLowerCase()).not.toContain('not found');
    }
  });

  test('should use absLangURL for language home fallback', async ({ page }) => {
    // This tests the language-switcher.html logic
    await page.goto('/pl/about/');

    const enLink = page.locator('a[hreflang="en"]').first();
    const count = await enLink.count();

    if (count > 0) {
      const href = await enLink.getAttribute('href');
      
      // Should point to English version (could be translated page or home)
      expect(href).toMatch(/\/wesole_nutki\/en\//);
      
      // Should be properly formatted
      expect(href).not.toContain('/wesole_nutki/wesole_nutki/');
    }
  });
});

test.describe('Multilingual Basepath - Language Detection', () => {
  test('should show Polish content when accessing /pl/', async ({ page }) => {
    await page.goto('/pl/');

    // Page should be in Polish
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('pl');

    // Should have Polish text in navigation
    const navText = await page.locator('header nav').textContent();
    expect(navText).toMatch(/Strona główna|O przedszkolu|Kontakt/);
  });

  test('should show English content when accessing /en/', async ({ page }) => {
    await page.goto('/en/');

    // Page should be in English
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('en');

    // Should have English text in navigation
    const navText = await page.locator('header nav').textContent();
    expect(navText).toMatch(/Home|About|Contact/);
  });
});
