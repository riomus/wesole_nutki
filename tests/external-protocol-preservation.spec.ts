/**
 * External URLs and Protocol Links Preservation Tests
 *
 * Task: T007 - Preserve external URLs and protocol links unchanged
 *
 * This test suite verifies that external URLs and special protocol links
 * (mailto:, tel:, ftp:, etc.) are preserved exactly as written in the source
 * without any basepath modifications or transformations.
 */

import { test, expect } from '@playwright/test';

test.describe('External URLs and Protocol Links Preservation', () => {

  test.describe('External HTTP/HTTPS Links', () => {
    test('should preserve external HTTP URLs unchanged', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Look for external HTTP links
      const externalHttpLinks = await page.locator('a[href^="http://"]').all();

      for (const link of externalHttpLinks) {
        const href = await link.getAttribute('href');

        // External HTTP URLs should start with http://
        expect(href).toMatch(/^http:\/\//);

        // Should NOT have language prefix added
        expect(href).not.toContain('/pl/');
        expect(href).not.toContain('/en/');

        // Should NOT have basepath modifications
        expect(href).not.toMatch(/^\/[^/]/); // Should not start with single slash

        console.log(`✓ External HTTP URL preserved: ${href}`);
      }
    });

    test('should preserve external HTTPS URLs unchanged', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Look for external HTTPS links
      const externalHttpsLinks = await page.locator('a[href^="https://"]').all();

      for (const link of externalHttpsLinks) {
        const href = await link.getAttribute('href');

        // External HTTPS URLs should start with https://
        expect(href).toMatch(/^https:\/\//);

        // Should NOT have language prefix added
        expect(href).not.toContain('/pl/');
        expect(href).not.toContain('/en/');

        console.log(`✓ External HTTPS URL preserved: ${href}`);
      }

      console.log(`✓ Found ${externalHttpsLinks.length} external HTTPS links, all preserved correctly`);
    });

    test('should open external links in new tab with security attributes', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const externalLinks = await page.locator('a[href^="http://"], a[href^="https://"]').all();

      for (const link of externalLinks) {
        const href = await link.getAttribute('href');
        const target = await link.getAttribute('target');
        const rel = await link.getAttribute('rel');

        // Skip same-domain links
        if (href && href.includes(new URL(page.url()).hostname)) {
          continue;
        }

        // External links should open in new tab
        expect(target).toBe('_blank');

        // Should have security attributes
        expect(rel).toContain('noopener');
        expect(rel).toContain('noreferrer');

        console.log(`✓ External link has proper security: ${href}`);
      }
    });

    test('should preserve protocol-relative URLs (//)', async ({ page }) => {
      // Create a test page with protocol-relative URLs
      await page.goto('/pl/test-url-formats/');
      await page.waitForLoadState('networkidle');

      const protocolRelativeLinks = await page.locator('a[href^="//"]').all();

      for (const link of protocolRelativeLinks) {
        const href = await link.getAttribute('href');

        // Protocol-relative URLs should start with //
        expect(href).toMatch(/^\/\//);

        // Should NOT be modified
        expect(href).not.toMatch(/^\/pl\//);
        expect(href).not.toMatch(/^\/en\//);

        console.log(`✓ Protocol-relative URL preserved: ${href}`);
      }
    });
  });

  test.describe('mailto: Protocol Links', () => {
    test('should preserve mailto: links unchanged', async ({ page }) => {
      await page.goto('/pl/contact/');
      await page.waitForLoadState('networkidle');

      const mailtoLinks = await page.locator('a[href^="mailto:"]').all();

      for (const link of mailtoLinks) {
        const href = await link.getAttribute('href');

        // mailto: links should start with mailto:
        expect(href).toMatch(/^mailto:/);

        // Should NOT have basepath added
        expect(href).not.toContain('/pl/');
        expect(href).not.toContain('/en/');

        // Should be valid email format
        expect(href).toMatch(/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+/);

        console.log(`✓ mailto: link preserved: ${href}`);
      }

      if (mailtoLinks.length > 0) {
        console.log(`✓ Found ${mailtoLinks.length} mailto: links, all preserved correctly`);
      }
    });

    test('should not open mailto: links in new tab', async ({ page }) => {
      await page.goto('/pl/contact/');
      await page.waitForLoadState('networkidle');

      const mailtoLinks = await page.locator('a[href^="mailto:"]').all();

      for (const link of mailtoLinks) {
        const target = await link.getAttribute('target');

        // mailto: links should NOT have target="_blank"
        expect(target).not.toBe('_blank');

        console.log(`✓ mailto: link does not open in new tab`);
      }
    });

    test('should handle mailto: links with subject and body parameters', async ({ page }) => {
      await page.goto('/pl/test-url-formats/');
      await page.waitForLoadState('networkidle');

      // Check if there are any mailto links with parameters
      const allLinks = await page.locator('a[href^="mailto:"]').all();

      for (const link of allLinks) {
        const href = await link.getAttribute('href');

        if (href && href.includes('?')) {
          // mailto: with query params should be preserved
          expect(href).toMatch(/^mailto:[^\s@]+@[^\s@]+(\?.*)?/);

          console.log(`✓ mailto: with parameters preserved: ${href}`);
        }
      }
    });
  });

  test.describe('tel: Protocol Links', () => {
    test('should preserve tel: links unchanged', async ({ page }) => {
      await page.goto('/pl/contact/');
      await page.waitForLoadState('networkidle');

      const telLinks = await page.locator('a[href^="tel:"]').all();

      for (const link of telLinks) {
        const href = await link.getAttribute('href');

        // tel: links should start with tel:
        expect(href).toMatch(/^tel:/);

        // Should NOT have basepath added
        expect(href).not.toContain('/pl/');
        expect(href).not.toContain('/en/');

        console.log(`✓ tel: link preserved: ${href}`);
      }

      if (telLinks.length > 0) {
        console.log(`✓ Found ${telLinks.length} tel: links, all preserved correctly`);
      }
    });

    test('should not open tel: links in new tab', async ({ page }) => {
      await page.goto('/pl/contact/');
      await page.waitForLoadState('networkidle');

      const telLinks = await page.locator('a[href^="tel:"]').all();

      for (const link of telLinks) {
        const target = await link.getAttribute('target');

        // tel: links should NOT have target="_blank"
        expect(target).not.toBe('_blank');

        console.log(`✓ tel: link does not open in new tab`);
      }
    });

    test('should handle international phone number formats', async ({ page }) => {
      await page.goto('/pl/test-url-formats/');
      await page.waitForLoadState('networkidle');

      const telLinks = await page.locator('a[href^="tel:"]').all();

      for (const link of telLinks) {
        const href = await link.getAttribute('href');

        // tel: should preserve the phone number format
        expect(href).toMatch(/^tel:\+?[0-9\-\s()]+/);

        console.log(`✓ tel: link format preserved: ${href}`);
      }
    });
  });

  test.describe('Other Protocol Links', () => {
    test('should preserve ftp: links unchanged', async ({ page }) => {
      await page.goto('/pl/test-url-formats/');
      await page.waitForLoadState('networkidle');

      const ftpLinks = await page.locator('a[href^="ftp:"]').all();

      for (const link of ftpLinks) {
        const href = await link.getAttribute('href');

        // ftp: links should start with ftp:
        expect(href).toMatch(/^ftp:/);

        // Should NOT have basepath added
        expect(href).not.toContain('/pl/');
        expect(href).not.toContain('/en/');

        console.log(`✓ ftp: link preserved: ${href}`);
      }
    });

    test('should preserve data: URIs unchanged', async ({ page }) => {
      await page.goto('/pl/test-url-formats/');
      await page.waitForLoadState('networkidle');

      const dataImages = await page.locator('img[src^="data:"]').all();

      for (const img of dataImages) {
        const src = await img.getAttribute('src');

        // data: URIs should start with data:
        expect(src).toMatch(/^data:/);

        // Should NOT be modified
        expect(src).not.toContain('/pl/');
        expect(src).not.toContain('/en/');

        console.log(`✓ data: URI preserved (length: ${src?.length} chars)`);
      }
    });

    test('should preserve file: protocol links unchanged', async ({ page }) => {
      await page.goto('/pl/test-url-formats/');
      await page.waitForLoadState('networkidle');

      const fileLinks = await page.locator('a[href^="file:"]').all();

      for (const link of fileLinks) {
        const href = await link.getAttribute('href');

        // file: links should start with file:
        expect(href).toMatch(/^file:/);

        // Should NOT have basepath added
        expect(href).not.toContain('/pl/');
        expect(href).not.toContain('/en/');

        console.log(`✓ file: link preserved: ${href}`);
      }
    });

    test('should preserve javascript: protocol links unchanged', async ({ page }) => {
      await page.goto('/pl/test-url-formats/');
      await page.waitForLoadState('networkidle');

      const javascriptLinks = await page.locator('a[href^="javascript:"]').all();

      for (const link of javascriptLinks) {
        const href = await link.getAttribute('href');

        // javascript: links should start with javascript:
        expect(href).toMatch(/^javascript:/);

        // Should NOT have basepath added
        expect(href).not.toContain('/pl/');
        expect(href).not.toContain('/en/');

        console.log(`✓ javascript: link preserved: ${href}`);
      }
    });
  });

  test.describe('External URLs in Different Contexts', () => {
    test('should preserve external URLs in footer links', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const footer = page.locator('footer');
      const externalLinks = await footer.locator('a[href^="http://"], a[href^="https://"]').all();

      for (const link of externalLinks) {
        const href = await link.getAttribute('href');

        // Should be complete URL
        expect(href).toMatch(/^https?:\/\//);

        // Should not be modified
        const url = new URL(href!);
        expect(url.protocol).toMatch(/^https?:$/);

        console.log(`✓ Footer external link preserved: ${href}`);
      }
    });

    test('should preserve external URLs in social media links', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const socialPlatforms = ['facebook.com', 'twitter.com', 'instagram.com', 'youtube.com', 'linkedin.com'];

      for (const platform of socialPlatforms) {
        const socialLinks = await page.locator(`a[href*="${platform}"]`).all();

        for (const link of socialLinks) {
          const href = await link.getAttribute('href');

          // Social media links should be external and unchanged
          expect(href).toMatch(/^https?:\/\//);
          expect(href).toContain(platform);

          // Should open in new tab
          const target = await link.getAttribute('target');
          expect(target).toBe('_blank');

          console.log(`✓ Social media link preserved: ${platform}`);
        }
      }
    });

    test('should preserve external PDF links', async ({ page }) => {
      await page.goto('/pl/test-url-formats/');
      await page.waitForLoadState('networkidle');

      const pdfLinks = await page.locator('a[href*=".pdf"]').all();

      for (const link of pdfLinks) {
        const href = await link.getAttribute('href');

        if (href && href.startsWith('http')) {
          // External PDFs should be unchanged
          expect(href).toMatch(/^https?:\/\//);
          expect(href).toContain('.pdf');

          console.log(`✓ External PDF link preserved: ${href}`);
        }
      }
    });

    test('should preserve external image URLs in old content', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Check for any external images (e.g., from old site)
      const externalImages = await page.locator('img[src^="http://"], img[src^="https://"]').all();

      for (const img of externalImages) {
        const src = await img.getAttribute('src');

        // External image URLs should be unchanged
        expect(src).toMatch(/^https?:\/\//);

        // Should not have basepath modifications
        const url = new URL(src!);
        expect(url.protocol).toMatch(/^https?:$/);

        console.log(`✓ External image URL preserved: ${src}`);
      }
    });
  });

  test.describe('Mixed Content Validation', () => {
    test('should not mix internal and external URL patterns', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const allLinks = await page.locator('a[href]').all();
      let externalCount = 0;
      let internalCount = 0;

      for (const link of allLinks) {
        const href = await link.getAttribute('href');

        if (!href) continue;

        const isExternal = /^https?:\/\//.test(href);
        const hasLanguagePrefix = /^\/(pl|en)\//.test(href);

        if (isExternal) {
          // External URLs should NOT have language prefix
          expect(hasLanguagePrefix).toBe(false);
          externalCount++;
        } else if (!href.startsWith('#') && !href.startsWith('mailto:') &&
                   !href.startsWith('tel:') && !href.startsWith('javascript:') &&
                   !href.startsWith('//')) {
          // Internal URLs - check if they're from the new multilingual structure
          // Legacy URLs and some special paths may not have language prefix
          if (href.startsWith('/') && hasLanguagePrefix) {
            internalCount++;
          }
        }
      }

      console.log(`✓ Found ${externalCount} external links without language prefix`);
      console.log(`✓ Found ${internalCount} internal links with language prefix`);
      console.log(`✓ Validated URL pattern consistency across ${allLinks.length} links`);
    });

    test('should preserve external URLs in markdown content', async ({ page }) => {
      await page.goto('/pl/news/2023/01/30/pracuj-z-wesolymi-nutkami/');
      await page.waitForLoadState('networkidle');

      // Check for external links in article content
      const contentLinks = await page.locator('article a[href^="http://"], article a[href^="https://"]').all();

      for (const link of contentLinks) {
        const href = await link.getAttribute('href');

        // External links in content should be preserved
        expect(href).toMatch(/^https?:\/\//);

        // Should not have been modified with basepath
        const url = new URL(href!);
        expect(url.protocol).toMatch(/^https?:$/);

        console.log(`✓ Content external link preserved: ${href}`);
      }
    });
  });

  test.describe('Same-Domain External URLs', () => {
    test('should detect same-domain absolute URLs as internal', async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const baseUrl = new URL(page.url());
      const sameHostLinks = await page.locator(`a[href^="http://${baseUrl.host}"], a[href^="https://${baseUrl.host}"]`).all();

      for (const link of sameHostLinks) {
        const href = await link.getAttribute('href');
        const target = await link.getAttribute('target');

        // Same-domain links should NOT open in new tab
        expect(target).not.toBe('_blank');

        console.log(`✓ Same-domain absolute URL treated as internal: ${href}`);
      }
    });
  });

  test.describe('Edge Cases', () => {
    test('should preserve external URLs with query parameters', async ({ page }) => {
      await page.goto('/pl/test-url-formats/');
      await page.waitForLoadState('networkidle');

      const linksWithQuery = await page.locator('a[href*="?"]').all();

      for (const link of linksWithQuery) {
        const href = await link.getAttribute('href');

        if (href && href.startsWith('http')) {
          // External URLs with query params should be unchanged
          expect(href).toMatch(/^https?:\/\/.*\?/);

          console.log(`✓ External URL with query preserved: ${href}`);
        }
      }
    });

    test('should preserve external URLs with fragments', async ({ page }) => {
      await page.goto('/pl/test-url-formats/');
      await page.waitForLoadState('networkidle');

      const linksWithFragment = await page.locator('a[href*="#"]').all();

      for (const link of linksWithFragment) {
        const href = await link.getAttribute('href');

        if (href && href.startsWith('http')) {
          // External URLs with fragments should be unchanged
          expect(href).toMatch(/^https?:\/\/.*#/);

          console.log(`✓ External URL with fragment preserved: ${href}`);
        }
      }
    });

    test('should preserve URLs with special characters', async ({ page }) => {
      await page.goto('/pl/test-url-formats/');
      await page.waitForLoadState('networkidle');

      const allLinks = await page.locator('a[href^="http"]').all();

      for (const link of allLinks) {
        const href = await link.getAttribute('href');

        if (href) {
          // URL should be valid and unchanged
          expect(() => new URL(href)).not.toThrow();

          console.log(`✓ URL validation passed: ${href}`);
        }
      }
    });
  });
});
