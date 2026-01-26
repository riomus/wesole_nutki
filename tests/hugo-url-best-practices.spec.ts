import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Hugo URL Configuration Best Practices Tests
 *
 * This test suite verifies that the Hugo site implements URL configuration
 * best practices as documented in Hugo documentation:
 * - Proper use of URL template functions (.Permalink, .RelPermalink, relURL, absURL)
 * - Correct baseURL configuration
 * - canonifyURLs setting (should be false for modern Hugo)
 * - No hardcoded domain URLs in templates
 * - Proper URL generation in production vs development
 */

test.describe('Hugo URL Best Practices Implementation', () => {

  test.describe('Hugo Configuration Validation', () => {

    test('should have baseURL configured in hugo.toml', async () => {
      const configPath = path.join(process.cwd(), 'hugo.toml');
      const configExists = fs.existsSync(configPath);

      expect(configExists).toBe(true);

      if (configExists) {
        const configContent = fs.readFileSync(configPath, 'utf-8');

        // Should have baseURL defined
        expect(configContent).toMatch(/baseURL\s*=\s*["'].+["']/);

        // BaseURL should not be empty
        expect(configContent).not.toContain('baseURL = ""');
        expect(configContent).not.toContain("baseURL = ''");
      }
    });

    test('should have canonifyURLs set to false or not set (defaults to false)', async () => {
      const configPath = path.join(process.cwd(), 'hugo.toml');

      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, 'utf-8');

        // If canonifyURLs is explicitly set, it should be false
        if (configContent.includes('canonifyURLs')) {
          expect(configContent).toMatch(/canonifyURLs\s*=\s*(false|"false")/);
          expect(configContent).not.toMatch(/canonifyURLs\s*=\s*(true|"true")/);
        }

        // Not having canonifyURLs is fine (defaults to false in modern Hugo)
      }
    });

    test('should use multilingual configuration correctly', async () => {
      const configPath = path.join(process.cwd(), 'hugo.toml');

      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, 'utf-8');

        // Should define languages
        expect(configContent).toContain('[languages');

        // Should have at least Polish and English
        expect(configContent).toMatch(/\[languages\.pl\]/);
        expect(configContent).toMatch(/\[languages\.en\]/);
      }
    });
  });

  test.describe('Template Function Usage Verification', () => {

    test('head.html should use .Permalink for canonical and OG URLs', async () => {
      const templatePath = path.join(process.cwd(), 'layouts', 'partials', 'head.html');

      if (fs.existsSync(templatePath)) {
        const templateContent = fs.readFileSync(templatePath, 'utf-8');

        // Should use .Permalink for canonical URL
        expect(templateContent).toContain('.Permalink');

        // Should not use relURL for canonical (that would be wrong)
        const canonicalLine = templateContent.match(/rel="canonical".*href=["']([^"']+)["']/);
        if (canonicalLine) {
          // The href value should reference .Permalink, not relURL
          expect(templateContent).toMatch(/rel="canonical"[\s\S]*?\.Permalink/);
        }
      }
    });

    test('navigation templates should use relURL or .RelPermalink', async () => {
      const headerPath = path.join(process.cwd(), 'layouts', 'partials', 'header.html');

      if (fs.existsSync(headerPath)) {
        const templateContent = fs.readFileSync(headerPath, 'utf-8');

        // Should use proper URL functions for internal links
        // Looking for relURL, .RelPermalink, or .URL usage
        const hasProperURLFunctions =
          templateContent.includes('relURL') ||
          templateContent.includes('.RelPermalink') ||
          templateContent.includes('.URL') ||
          templateContent.includes('absLangURL') ||
          templateContent.includes('relLangURL');

        expect(hasProperURLFunctions).toBe(true);

        // Should NOT have hardcoded absolute URLs
        expect(templateContent).not.toMatch(/href=["']https?:\/\/bartusiak\.ai/);
        expect(templateContent).not.toMatch(/href=["']https?:\/\/wesoelnutki/);
      }
    });

    test('image templates should use relURL for asset paths', async () => {
      const responsiveImagePath = path.join(process.cwd(), 'layouts', 'partials', 'responsive-image.html');

      if (fs.existsSync(responsiveImagePath)) {
        const templateContent = fs.readFileSync(responsiveImagePath, 'utf-8');

        // Should use relURL for image paths
        const hasRelURL = templateContent.includes('relURL');
        const hasResourceGetRemote = templateContent.includes('resources.GetRemote');

        // Either uses relURL or Hugo's resource pipeline
        expect(hasRelURL || hasResourceGetRemote).toBe(true);
      }
    });

    test('social share templates should use .Permalink for share URLs', async () => {
      const socialSharePath = path.join(process.cwd(), 'layouts', 'partials', 'social-share.html');

      if (fs.existsSync(socialSharePath)) {
        const templateContent = fs.readFileSync(socialSharePath, 'utf-8');

        // Social share buttons need absolute URLs
        expect(templateContent).toContain('.Permalink');

        // Should not use relative URLs for social sharing
        expect(templateContent).not.toMatch(/facebook\.com\/sharer.*relURL/);
        expect(templateContent).not.toMatch(/twitter\.com\/intent.*relURL/);
      }
    });

    test('breadcrumb templates should use proper URL functions', async () => {
      const breadcrumbPath = path.join(process.cwd(), 'layouts', 'partials', 'breadcrumb.html');

      if (fs.existsSync(breadcrumbPath)) {
        const templateContent = fs.readFileSync(breadcrumbPath, 'utf-8');

        // Breadcrumbs should use .RelPermalink or similar for links
        const hasProperURLFunctions =
          templateContent.includes('.RelPermalink') ||
          templateContent.includes('.Permalink') ||
          templateContent.includes('relURL');

        expect(hasProperURLFunctions).toBe(true);

        // Structured data in breadcrumbs should use .Permalink (absolute)
        if (templateContent.includes('application/ld+json')) {
          expect(templateContent).toContain('.Permalink');
        }
      }
    });

    test('no templates should have hardcoded domain URLs', async () => {
      const layoutsDir = path.join(process.cwd(), 'layouts');
      const hardcodedDomains: string[] = [];

      const checkDirectory = (dir: string) => {
        if (!fs.existsSync(dir)) return;

        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            checkDirectory(fullPath);
          } else if (entry.isFile() && entry.name.endsWith('.html')) {
            const content = fs.readFileSync(fullPath, 'utf-8');

            // Check for hardcoded domains (excluding comments and external links)
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];

              // Skip comments
              if (line.trim().startsWith('{{/*') || line.trim().startsWith('<!--')) {
                continue;
              }

              // Check for hardcoded internal domain URLs
              if (
                (line.includes('href=') || line.includes('src=')) &&
                (line.match(/["']https?:\/\/(bartusiak\.ai|wesolenutki\.pl)/))
              ) {
                hardcodedDomains.push(`${fullPath}:${i + 1}: ${line.trim()}`);
              }
            }
          }
        }
      };

      checkDirectory(layoutsDir);

      // Should have no hardcoded internal domain URLs
      if (hardcodedDomains.length > 0) {
        console.log('Found hardcoded domain URLs in:');
        hardcodedDomains.forEach(line => console.log(`  ${line}`));
      }

      expect(hardcodedDomains).toHaveLength(0);
    });
  });

  test.describe('Production Build URL Generation', () => {

    test('should generate absolute canonical URLs in production HTML', async ({ page }) => {
      await page.goto('/pl/');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');

      // Must be absolute URL
      expect(canonical).toBeTruthy();
      expect(canonical).toMatch(/^https?:\/\//);

      // Must include domain
      expect(canonical).toMatch(/^https?:\/\/[^/]+\//);
    });

    test('should generate absolute Open Graph URLs in production HTML', async ({ page }) => {
      await page.goto('/pl/');

      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');

      // og:url must be absolute
      expect(ogUrl).toBeTruthy();
      expect(ogUrl).toMatch(/^https?:\/\//);

      // og:image must be absolute if present
      if (ogImage) {
        expect(ogImage).toMatch(/^https?:\/\//);
      }
    });

    test('should generate relative internal navigation links', async ({ page }) => {
      await page.goto('/pl/');

      const navLinks = await page.locator('nav a[href^="/"]').all();

      // Should have internal navigation links
      expect(navLinks.length).toBeGreaterThan(0);

      // All should be relative (start with /)
      for (const link of navLinks) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('/#')) {
          expect(href).toMatch(/^\//);
          expect(href).not.toMatch(/^https?:\/\//);
        }
      }
    });

    test('should generate relative asset URLs', async ({ page }) => {
      await page.goto('/pl/');

      // CSS should be relative
      const css = page.locator('link[rel="stylesheet"]').first();
      if (await css.count() > 0) {
        const href = await css.getAttribute('href');
        if (href && !href.startsWith('http')) {
          expect(href).toMatch(/^\//);
        }
      }

      // Logo should be relative
      const logo = page.locator('.navbar-brand img');
      if (await logo.count() > 0) {
        const src = await logo.getAttribute('src');
        if (src && !src.startsWith('http')) {
          expect(src).toMatch(/^\//);
        }
      }
    });

    test('should include baseURL subdirectory in all URLs when configured', async ({ page }) => {
      await page.goto('/pl/');

      const currentURL = page.url();
      const url = new URL(currentURL);

      // Extract baseURL subdirectory from current URL
      const pathParts = url.pathname.split('/').filter(p => p);

      if (pathParts.length > 1) {
        const basePath = pathParts[0]; // e.g., 'wesole_nutki'

        // Skip if it's just the language code
        if (basePath !== 'pl' && basePath !== 'en') {
          // All internal links should include the basePath
          const navLinks = await page.locator('nav a[href^="/"]').all();

          for (const link of navLinks.slice(0, 5)) {
            const href = await link.getAttribute('href');
            if (href && !href.startsWith('/#')) {
              expect(href).toContain(`/${basePath}/`);
            }
          }

          // Canonical should include basePath
          const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
          expect(canonical).toContain(`/${basePath}/`);
        }
      }
    });
  });

  test.describe('RSS and Sitemap URL Validation', () => {

    test('should generate RSS feed with absolute URLs', async ({ page }) => {
      const response = await page.goto('/pl/index.xml');

      if (response && response.status() === 200) {
        const content = await page.content();

        // RSS feed must use absolute URLs per RSS spec
        expect(content).toContain('<link>http');

        // Should have channel link
        expect(content).toMatch(/<channel>[\s\S]*<link>https?:\/\//);

        // Item links should be absolute
        if (content.includes('<item>')) {
          expect(content).toMatch(/<item>[\s\S]*<link>https?:\/\//);
        }

        // Should not have relative URLs
        expect(content).not.toMatch(/<link>\/pl\//);
        expect(content).not.toMatch(/<link>\/en\//);
      }
    });

    test('should generate sitemap with absolute URLs', async ({ page }) => {
      const response = await page.goto('/sitemap.xml');

      if (response && response.status() === 200) {
        const content = await page.content();

        // Sitemap must use absolute URLs per sitemap protocol
        expect(content).toContain('<loc>http');

        // All <loc> tags should have absolute URLs
        expect(content).toMatch(/<loc>https?:\/\/[^<]+<\/loc>/);

        // Should not have relative URLs
        expect(content).not.toMatch(/<loc>\/pl\//);
        expect(content).not.toMatch(/<loc>\/en\//);

        // Should include baseURL in all URLs
        const locMatches = content.match(/<loc>([^<]+)<\/loc>/g);
        if (locMatches) {
          for (const match of locMatches.slice(0, 5)) {
            expect(match).toMatch(/^<loc>https?:\/\//);
          }
        }
      }
    });

    test('should have robots.txt with absolute sitemap URL', async ({ page }) => {
      const response = await page.goto('/robots.txt');

      if (response && response.status() === 200) {
        const content = await page.content();

        // If sitemap is referenced, it should be absolute
        if (content.toLowerCase().includes('sitemap:')) {
          expect(content).toMatch(/[Ss]itemap:\s*https?:\/\//);
        }
      }
    });

    test('should have alternate language links in RSS feeds', async ({ page }) => {
      const response = await page.goto('/pl/index.xml');

      if (response && response.status() === 200) {
        const content = await page.content();

        // Polish RSS should have Polish content
        expect(content).toContain('/pl/');

        // Check English RSS
        const enResponse = await page.goto('/en/index.xml');
        if (enResponse && enResponse.status() === 200) {
          const enContent = await page.content();

          // English RSS should have English content
          expect(enContent).toContain('/en/');

          // They should be different
          expect(enContent).not.toBe(content);
        }
      }
    });
  });

  test.describe('404 Error Page URLs', () => {

    test('should have correct URLs on 404 page', async ({ page }) => {
      // Try to navigate to a non-existent page
      await page.goto('/pl/this-page-does-not-exist-12345/', { waitUntil: 'networkidle' });

      // Should show 404 page
      const content = await page.content();
      const is404 = content.includes('404') || content.includes('Not Found') || content.includes('Nie znaleziono');

      if (is404) {
        // Navigation should still work on 404 page
        const homeLink = page.locator('a[href*="/pl"]').first();
        if (await homeLink.count() > 0) {
          const href = await homeLink.getAttribute('href');
          expect(href).toBeTruthy();
          expect(href).toContain('/pl');
        }

        // Assets should still load
        const logo = page.locator('.navbar-brand img, img[alt*="logo"]').first();
        if (await logo.count() > 0) {
          const src = await logo.getAttribute('src');
          if (src && !src.startsWith('http')) {
            expect(src).toMatch(/^\//);

            // Verify logo loads
            const response = await page.request.get(src);
            expect(response.status()).toBe(200);
          }
        }
      }
    });
  });

  test.describe('Structured Data URL Validation', () => {

    test('should use absolute URLs in all structured data', async ({ page }) => {
      await page.goto('/pl/');

      const scripts = await page.locator('script[type="application/ld+json"]').all();

      for (const script of scripts) {
        const content = await script.textContent();
        if (content) {
          const json = JSON.parse(content);

          // Check for URLs in common fields
          const checkURLField = (obj: any, path: string = '') => {
            if (typeof obj === 'string' && (path.endsWith('url') || path.endsWith('URL') || path.includes('item'))) {
              // URLs in structured data should be absolute
              if (obj.startsWith('/') && !obj.startsWith('//')) {
                throw new Error(`Found relative URL in structured data at ${path}: ${obj}`);
              }
            } else if (typeof obj === 'object' && obj !== null) {
              for (const key in obj) {
                checkURLField(obj[key], path ? `${path}.${key}` : key);
              }
            } else if (Array.isArray(obj)) {
              obj.forEach((item, index) => {
                checkURLField(item, `${path}[${index}]`);
              });
            }
          };

          try {
            checkURLField(json);
          } catch (error) {
            // If we find a relative URL in structured data, the test should fail
            if (error instanceof Error && error.message.includes('relative URL')) {
              throw error;
            }
          }
        }
      }
    });

    test('should have correct @id fields in structured data', async ({ page }) => {
      await page.goto('/pl/about/');

      const scripts = await page.locator('script[type="application/ld+json"]').all();

      for (const script of scripts) {
        const content = await script.textContent();
        if (content) {
          const json = JSON.parse(content);

          // @id should be absolute URL if present
          if (json['@id']) {
            expect(json['@id']).toMatch(/^https?:\/\//);
          }

          // @context should be a valid schema.org URL
          if (json['@context']) {
            expect(json['@context']).toMatch(/^https?:\/\/schema\.org/);
          }
        }
      }
    });
  });

  test.describe('Multi-Language URL Consistency', () => {

    test('should maintain URL structure across language versions', async ({ page }) => {
      // Get Polish about page
      await page.goto('/pl/about/');
      const plCanonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      const plURL = new URL(plCanonical!);

      // Get English about page
      await page.goto('/en/about/');
      const enCanonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      const enURL = new URL(enCanonical!);

      // Should have same protocol and domain
      expect(plURL.protocol).toBe(enURL.protocol);
      expect(plURL.hostname).toBe(enURL.hostname);

      // Should have same path structure (except language code)
      const plPath = plURL.pathname.replace('/pl/', '/');
      const enPath = enURL.pathname.replace('/en/', '/');
      expect(plPath).toBe(enPath);
    });

    test('should have proper hreflang tags for all language versions', async ({ page }) => {
      await page.goto('/pl/about/');

      const alternateLinks = await page.locator('link[rel="alternate"][hreflang]').all();

      // Should have at least 2 (pl and en)
      expect(alternateLinks.length).toBeGreaterThanOrEqual(2);

      const hreflangs: { [key: string]: string } = {};

      for (const link of alternateLinks) {
        const hreflang = await link.getAttribute('hreflang');
        const href = await link.getAttribute('href');

        if (hreflang && href) {
          hreflangs[hreflang] = href;

          // All alternate links should be absolute
          expect(href).toMatch(/^https?:\/\//);
        }
      }

      // Should have Polish version
      expect(hreflangs['pl'] || hreflangs['pl-PL']).toBeTruthy();

      // Should have English version
      expect(hreflangs['en'] || hreflangs['en-US']).toBeTruthy();

      // Polish link should point to /pl/ URL
      const plLink = hreflangs['pl'] || hreflangs['pl-PL'];
      expect(plLink).toContain('/pl/');

      // English link should point to /en/ URL
      const enLink = hreflangs['en'] || hreflangs['en-US'];
      expect(enLink).toContain('/en/');
    });
  });

  test.describe('URL Security and Best Practices', () => {

    test('should use HTTPS in production canonical URLs', async ({ page }) => {
      await page.goto('/pl/');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');

      // In production, should use HTTPS
      // In development (localhost), HTTP is acceptable
      if (canonical && !canonical.includes('localhost') && !canonical.includes('127.0.0.1')) {
        expect(canonical).toMatch(/^https:\/\//);
      }
    });

    test('should not expose development URLs in production', async ({ page }) => {
      await page.goto('/pl/');

      const content = await page.content();

      // Should not have localhost URLs
      expect(content).not.toContain('localhost:1313');
      expect(content).not.toContain('http://localhost');
      expect(content).not.toContain('127.0.0.1');

      // Exception: Allow in comments or as examples
      const htmlWithoutComments = content.replace(/<!--[\s\S]*?-->/g, '');
      expect(htmlWithoutComments).not.toContain('localhost:1313');
    });

    test('should not have mixed content warnings', async ({ page }) => {
      const mixedContentWarnings: string[] = [];

      page.on('console', msg => {
        if (msg.type() === 'warning' && msg.text().toLowerCase().includes('mixed content')) {
          mixedContentWarnings.push(msg.text());
        }
      });

      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Should have no mixed content warnings (HTTP assets on HTTPS page)
      expect(mixedContentWarnings).toHaveLength(0);
    });

    test('should have consistent trailing slashes policy', async ({ page }) => {
      // Test without trailing slash
      await page.goto('/pl');
      const url1 = page.url();
      const canonical1 = await page.locator('link[rel="canonical"]').getAttribute('href');

      // Test with trailing slash
      await page.goto('/pl/');
      const url2 = page.url();
      const canonical2 = await page.locator('link[rel="canonical"]').getAttribute('href');

      // Canonical URLs should be consistent
      expect(canonical1).toBe(canonical2);

      // Both should redirect to same normalized URL or both should work
      // Check that trailing slash policy is consistent
      const url1HasSlash = url1.endsWith('/');
      const url2HasSlash = url2.endsWith('/');

      // Either both have slash or both don't (consistent policy)
      // OR one redirects to the other (also consistent)
      const isConsistent =
        (url1HasSlash === url2HasSlash) ||
        (url1 === url2);

      expect(isConsistent).toBe(true);
    });
  });
});
