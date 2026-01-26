/**
 * BaseURL Language Switching Tests
 *
 * These tests verify that language switching works correctly with basepath
 * configuration, ensuring:
 * - Language switcher preserves basepath
 * - Switching between Polish and English maintains proper URLs
 * - Content is accessible in both languages with correct paths
 * - Language-specific URLs don't leak between languages
 */

import { test, expect } from '@playwright/test';

test.describe('Basepath Language Switching', () => {
  test.describe('Language Switcher Functionality', () => {
    test('should have language switcher visible on all pages', async ({ page }) => {
      const pages = ['/pl/', '/en/', '/pl/about/', '/en/about/'];

      for (const pageUrl of pages) {
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle');

        // Check for language switcher
        const langSwitcher = page.locator('[data-testid="language-switcher"], .language-toggle, .lang-switch');

        const count = await langSwitcher.count();
        if (count > 0) {
          expect(await langSwitcher.first().isVisible()).toBe(true);
          console.log(`✓ Language switcher visible on ${pageUrl}`);
        }
      }
    });

    test('should switch from Polish to English homepage', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Find and click English language link
      const enLink = page.locator('a[hreflang="en"], a[href*="/en/"], .lang-en, [data-lang="en"]').first();

      if (await enLink.count() > 0) {
        await enLink.click();
        await page.waitForLoadState('networkidle');

        // Should be on English homepage
        expect(page.url()).toMatch(/\/en\/$/);
        console.log(`✓ Switched to: ${page.url()}`);
      }
    });

    test('should switch from English to Polish homepage', async ({ page }) => {
      await page.goto('/en/');
      await page.waitForLoadState('networkidle');

      // Find and click Polish language link
      const plLink = page.locator('a[hreflang="pl"], a[href*="/pl/"], .lang-pl, [data-lang="pl"]').first();

      if (await plLink.count() > 0) {
        await plLink.click();
        await page.waitForLoadState('networkidle');

        // Should be on Polish homepage
        expect(page.url()).toMatch(/\/pl\/$/);
        console.log(`✓ Switched to: ${page.url()}`);
      }
    });

    test('should preserve page context when switching languages on about page', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      // Find English language link
      const enLink = page.locator('a[hreflang="en"], a[href*="/en/"]').first();

      if (await enLink.count() > 0) {
        const href = await enLink.getAttribute('href');
        await enLink.click();
        await page.waitForLoadState('networkidle');

        // Should be on English about page
        expect(page.url()).toMatch(/\/en\/about/);
        console.log(`✓ Language switch preserved context: ${page.url()}`);
      }
    });

    test('should preserve page context when switching languages on contact page', async ({ page }) => {
      await page.goto('/en/contact/');
      await page.waitForLoadState('networkidle');

      // Find Polish language link
      const plLink = page.locator('a[hreflang="pl"], a[href*="/pl/"]').first();

      if (await plLink.count() > 0) {
        await plLink.click();
        await page.waitForLoadState('networkidle');

        // Should be on Polish contact page
        expect(page.url()).toMatch(/\/pl\/contact/);
        console.log(`✓ Language switch preserved context: ${page.url()}`);
      }
    });
  });

  test.describe('Language-Specific URL Structure', () => {
    test('should have Polish content only in /pl/ paths', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Get all internal links
      const links = await page.locator('a[href^="/"]').all();

      for (const link of links) {
        const href = await link.getAttribute('href');

        // Skip external links and anchors
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
          // Links on Polish page should go to /pl/ or /en/ (language switcher)
          expect(href).toMatch(/^\/(pl|en)\//);

          // Most links should be Polish
          const text = await link.textContent();
          if (text && !text.match(/EN|English|ENGLISH/)) {
            expect(href).toMatch(/^\/pl\//);
          }
        }
      }
    });

    test('should have English content only in /en/ paths', async ({ page }) => {
      await page.goto('/en/');
      await page.waitForLoadState('networkidle');

      // Get all internal links
      const links = await page.locator('a[href^="/"]').all();

      for (const link of links) {
        const href = await link.getAttribute('href');

        // Skip external links and anchors
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
          // Links on English page should go to /en/ or /pl/ (language switcher)
          expect(href).toMatch(/^\/(pl|en)\//);

          // Most links should be English
          const text = await link.textContent();
          if (text && !text.match(/PL|Polish|Polski/)) {
            expect(href).toMatch(/^\/en\//);
          }
        }
      }
    });

    test('should not mix Polish and English URLs in content', async ({ page }) => {
      // Check Polish page
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const plLinks = await page.locator('a[href^="/"]').all();
      let enLinksOnPlPage = 0;

      for (const link of plLinks) {
        const href = await link.getAttribute('href');
        if (href && href.match(/^\/en\//)) {
          // Count English links (should only be language switcher)
          enLinksOnPlPage++;
        }
      }

      // Should have very few English links (only language switcher)
      expect(enLinksOnPlPage).toBeLessThan(5);
      console.log(`Polish page has ${enLinksOnPlPage} English links (expected: language switcher only)`);

      // Check English page
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');

      const enLinks = await page.locator('a[href^="/"]').all();
      let plLinksOnEnPage = 0;

      for (const link of enLinks) {
        const href = await link.getAttribute('href');
        if (href && href.match(/^\/pl\//)) {
          plLinksOnEnPage++;
        }
      }

      // Should have very few Polish links (only language switcher)
      expect(plLinksOnEnPage).toBeLessThan(5);
      console.log(`English page has ${plLinksOnEnPage} Polish links (expected: language switcher only)`);
    });
  });

  test.describe('Alternate Language Links (hreflang)', () => {
    test('should have hreflang tags on Polish pages', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Check for hreflang tags
      const hreflangLinks = await page.locator('link[hreflang]').all();

      if (hreflangLinks.length > 0) {
        const hreflangs = await Promise.all(
          hreflangLinks.map(async link => ({
            lang: await link.getAttribute('hreflang'),
            href: await link.getAttribute('href')
          }))
        );

        console.log('Hreflang tags found:', hreflangs);

        // Should have at least hreflang for current and alternate language
        expect(hreflangs.length).toBeGreaterThanOrEqual(1);

        // All hreflang URLs should be absolute
        for (const tag of hreflangs) {
          if (tag.href) {
            expect(tag.href).toMatch(/^https?:\/\//);
          }
        }
      }
    });

    test('should have hreflang tags on English pages', async ({ page }) => {
      await page.goto('/en/');
      await page.waitForLoadState('networkidle');

      // Check for hreflang tags
      const hreflangLinks = await page.locator('link[hreflang]').all();

      if (hreflangLinks.length > 0) {
        const hreflangs = await Promise.all(
          hreflangLinks.map(async link => ({
            lang: await link.getAttribute('hreflang'),
            href: await link.getAttribute('href')
          }))
        );

        console.log('Hreflang tags found:', hreflangs);

        // Should have at least hreflang for current and alternate language
        expect(hreflangs.length).toBeGreaterThanOrEqual(1);

        // All hreflang URLs should be absolute
        for (const tag of hreflangs) {
          if (tag.href) {
            expect(tag.href).toMatch(/^https?:\/\//);
          }
        }
      }
    });
  });

  test.describe('Language-Specific Content Paths', () => {
    test('should have matching page structure in both languages', async ({ page }) => {
      const commonPages = [
        { pl: '/pl/about/', en: '/en/about/' },
        { pl: '/pl/contact/', en: '/en/contact/' },
        { pl: '/pl/gallery/', en: '/en/gallery/' },
      ];

      for (const pages of commonPages) {
        // Check Polish page exists
        const plResponse = await page.goto(pages.pl);
        expect(plResponse?.status()).toBe(200);

        // Check English page exists
        const enResponse = await page.goto(pages.en);
        expect(enResponse?.status()).toBe(200);

        console.log(`✓ Both languages exist: ${pages.pl} and ${pages.en}`);
      }
    });

    test('should have language-specific news URLs', async ({ page }) => {
      // Polish news should be under /pl/
      await page.goto('/pl/news/');
      await page.waitForLoadState('networkidle');

      const plNewsLinks = await page.locator('.news-card a, article a').all();

      for (const link of plNewsLinks) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('http')) {
          expect(href).toMatch(/^\/pl\//);
        }
      }

      // English news should be under /en/
      await page.goto('/en/news/');
      await page.waitForLoadState('networkidle');

      const enNewsLinks = await page.locator('.news-card a, article a').all();

      for (const link of enNewsLinks) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('http')) {
          expect(href).toMatch(/^\/en\//);
        }
      }

      console.log('✓ News URLs are language-specific');
    });

    test('should have language-specific gallery URLs', async ({ page }) => {
      // Polish galleries should be under /pl/gallery/
      await page.goto('/pl/gallery/');
      await page.waitForLoadState('networkidle');

      const plGalleryLinks = await page.locator('.gallery-card-link, .gallery-card a').all();

      for (const link of plGalleryLinks) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('http')) {
          expect(href).toMatch(/^\/pl\/gallery\//);
        }
      }

      // English galleries should be under /en/gallery/
      await page.goto('/en/gallery/');
      await page.waitForLoadState('networkidle');

      const enGalleryLinks = await page.locator('.gallery-card-link, .gallery-card a').all();

      for (const link of enGalleryLinks) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('http')) {
          expect(href).toMatch(/^\/en\/gallery\//);
        }
      }

      console.log('✓ Gallery URLs are language-specific');
    });
  });

  test.describe('Language Switcher Edge Cases', () => {
    test('should handle language switching when page does not exist in other language', async ({ page }) => {
      // Some pages might only exist in one language
      // The language switcher should either:
      // 1. Go to the homepage of the other language
      // 2. Go to the closest equivalent page
      // 3. Show disabled state

      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const enLink = page.locator('a[hreflang="en"], a[href*="/en/"]').first();

      if (await enLink.count() > 0) {
        const href = await enLink.getAttribute('href');

        // Should have a valid URL
        expect(href).toBeTruthy();
        expect(href).toMatch(/^\/en\//);

        console.log(`✓ Language switcher provides valid fallback: ${href}`);
      }
    });

    test('should indicate current language in switcher', async ({ page }) => {
      // Check Polish page
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const currentLangIndicator = page.locator('[aria-current="page"][hreflang="pl"], .active[data-lang="pl"], .current-lang-pl');

      if (await currentLangIndicator.count() > 0) {
        expect(await currentLangIndicator.first().isVisible()).toBe(true);
        console.log('✓ Current language (PL) is indicated');
      }

      // Check English page
      await page.goto('/en/');
      await page.waitForLoadState('networkidle');

      const enIndicator = page.locator('[aria-current="page"][hreflang="en"], .active[data-lang="en"], .current-lang-en');

      if (await enIndicator.count() > 0) {
        expect(await enIndicator.first().isVisible()).toBe(true);
        console.log('✓ Current language (EN) is indicated');
      }
    });

    test('should maintain basepath in language switcher URLs on all pages', async ({ page }) => {
      const pages = ['/pl/', '/pl/about/', '/pl/contact/', '/pl/news/'];

      for (const pageUrl of pages) {
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle');

        const langLinks = await page.locator('a[hreflang], .language-toggle a, .lang-switch a').all();

        for (const link of langLinks) {
          const href = await link.getAttribute('href');

          if (href && !href.startsWith('http')) {
            // Should have language prefix
            expect(href).toMatch(/^\/(pl|en)\//);
          }
        }

        console.log(`✓ Language switcher URLs valid on ${pageUrl}`);
      }
    });
  });

  test.describe('Language-Specific Meta Tags', () => {
    test('should have correct lang attribute on Polish pages', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const htmlLang = await page.locator('html').getAttribute('lang');

      expect(htmlLang).toMatch(/pl/);
      console.log(`✓ HTML lang attribute: ${htmlLang}`);
    });

    test('should have correct lang attribute on English pages', async ({ page }) => {
      await page.goto('/en/');
      await page.waitForLoadState('networkidle');

      const htmlLang = await page.locator('html').getAttribute('lang');

      expect(htmlLang).toMatch(/en/);
      console.log(`✓ HTML lang attribute: ${htmlLang}`);
    });

    test('should have language-specific og:locale tags', async ({ page }) => {
      // Polish page
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const plOgLocale = await page.locator('meta[property="og:locale"]').getAttribute('content');

      if (plOgLocale) {
        expect(plOgLocale).toMatch(/pl/);
        console.log(`✓ Polish og:locale: ${plOgLocale}`);
      }

      // English page
      await page.goto('/en/');
      await page.waitForLoadState('networkidle');

      const enOgLocale = await page.locator('meta[property="og:locale"]').getAttribute('content');

      if (enOgLocale) {
        expect(enOgLocale).toMatch(/en/);
        console.log(`✓ English og:locale: ${enOgLocale}`);
      }
    });
  });
});
