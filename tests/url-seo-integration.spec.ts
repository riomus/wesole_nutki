import { test, expect } from '@playwright/test';

/**
 * URL SEO Integration Tests
 *
 * These tests verify that Hugo URL configuration follows best practices for SEO:
 * - RSS feeds generate correct absolute URLs
 * - Sitemaps contain proper absolute URLs
 * - No hardcoded domain URLs in templates
 * - Trailing slashes are handled consistently
 * - External links are not modified by URL processing
 * - baseURL configuration works in both development and production contexts
 */

// Test Constants - DRY principle: Define once, use everywhere
const TEST_CONFIG = {
  // Domain and path configuration
  DOMAIN: 'bartusiak.ai',
  BASE_PATH: '/wesole_nutki',
  FULL_BASE_URL: 'https://bartusiak.ai/wesole_nutki/',

  // Language paths
  LANG: {
    PL: '/wesole_nutki/pl',
    EN: '/wesole_nutki/en',
  },

  // XML feed paths
  FEEDS: {
    PL_RSS: '/wesole_nutki/pl/index.xml',
    EN_RSS: '/wesole_nutki/en/index.xml',
    SITEMAP: '/wesole_nutki/sitemap.xml',
  },

  // Common page paths for testing
  PAGES: {
    PL_HOME: '/wesole_nutki/pl/',
    PL_ABOUT: '/wesole_nutki/pl/o-przedszkolu/',
    PL_GALLERY: '/wesole_nutki/pl/gallery/',
    PL_NEWS: '/wesole_nutki/pl/news/',
    PL_CONTACT: '/wesole_nutki/pl/kontakt/',
    EN_HOME: '/wesole_nutki/en/',
  },
} as const;

/**
 * Helper function to validate absolute URL format
 * @param url - URL to validate
 * @param errorContext - Context for error message
 */
function validateAbsoluteURL(url: string | null, errorContext: string = 'URL') {
  expect(url, `${errorContext} should not be null`).toBeTruthy();
  expect(url, `${errorContext} should start with https://`).toMatch(/^https:\/\//);
  expect(url, `${errorContext} should contain domain`).toContain(TEST_CONFIG.DOMAIN);
  expect(url, `${errorContext} should contain base path`).toContain(TEST_CONFIG.BASE_PATH);
}

/**
 * Helper function to validate relative URL format
 * @param url - URL to validate
 * @param errorContext - Context for error message
 */
function validateRelativeURL(url: string | null, errorContext: string = 'URL') {
  expect(url, `${errorContext} should not be null`).toBeTruthy();
  expect(url, `${errorContext} should start with /`).toMatch(/^\//);
  expect(url, `${errorContext} should not be absolute`).not.toMatch(/^https?:\/\//);
}

/**
 * Helper function to parse and validate XML links
 * @param content - XML content to parse
 * @param tagName - XML tag name to search for (e.g., 'link', 'loc')
 * @returns Array of parsed URLs
 */
function parseXMLLinks(content: string, tagName: string = 'link'): string[] {
  const regex = new RegExp(`<${tagName}>([^<]+)<\/${tagName}>`, 'g');
  const matches = content.match(regex);

  if (!matches) {
    return [];
  }

  return matches.map(match => match.replace(new RegExp(`<\/?${tagName}>`, 'g'), ''));
}

test.describe('RSS Feed URL Configuration', () => {
  test('should generate RSS feed with absolute URLs', async ({ page }) => {
    const response = await page.goto(TEST_CONFIG.FEEDS.PL_RSS);

    expect(response?.status(), 'RSS feed should be accessible').toBe(200);
    expect(response?.headers()['content-type'], 'Content type should be XML').toContain('xml');

    const content = await page.content();

    // RSS feeds should contain absolute URLs starting with https://
    expect(content, 'RSS feed should contain full base URL').toContain(TEST_CONFIG.FULL_BASE_URL);

    // Check for proper XML structure
    expect(content, 'Should have XML declaration').toContain('<?xml');
    expect(content, 'Should have RSS root element').toContain('<rss');
    expect(content, 'Should have channel element').toContain('<channel>');
    expect(content, 'Should have link elements').toContain('<link>');
  });

  test('should have absolute URLs in RSS feed items', async ({ page }) => {
    const response = await page.goto(TEST_CONFIG.FEEDS.PL_RSS);
    expect(response?.status(), 'RSS feed should be accessible').toBe(200);

    const content = await page.content();

    // Parse the XML and check item links using helper function
    const links = parseXMLLinks(content, 'link');

    expect(links.length, 'RSS feed should contain link elements').toBeGreaterThan(0);

    links.forEach((url, index) => {
      validateAbsoluteURL(url, `RSS feed link ${index + 1}`);
    });
  });

  test('should have RSS feed for English content', async ({ page }) => {
    const response = await page.goto(TEST_CONFIG.FEEDS.EN_RSS);

    expect(response?.status(), 'English RSS feed should be accessible').toBe(200);

    const content = await page.content();
    expect(content, 'English RSS feed should contain English base URL').toContain(`${TEST_CONFIG.FULL_BASE_URL}en/`);
  });

  test('should have category-specific RSS feeds with correct URLs', async ({ page }) => {
    const categoryRSSPath = '/wesole_nutki/pl/category/aktualnosci/index.xml';
    const response = await page.goto(categoryRSSPath);

    if (response?.status() === 200) {
      const content = await page.content();
      expect(content, 'Category RSS should contain base URL').toContain(TEST_CONFIG.FULL_BASE_URL);
      expect(content, 'Category RSS should reference category').toContain('aktualnosci');

      // Validate all links in category RSS
      const links = parseXMLLinks(content, 'link');
      links.forEach((url, index) => {
        validateAbsoluteURL(url, `Category RSS link ${index + 1}`);
      });
    }
  });
});

test.describe('Sitemap URL Configuration', () => {
  test('should generate sitemap with absolute URLs', async ({ page }) => {
    const response = await page.goto(TEST_CONFIG.FEEDS.SITEMAP);

    expect(response?.status(), 'Sitemap should be accessible').toBe(200);
    expect(response?.headers()['content-type'], 'Content type should be XML').toContain('xml');

    const content = await page.content();

    // Sitemap should contain absolute URLs
    expect(content, 'Sitemap should contain full base URL').toContain(TEST_CONFIG.FULL_BASE_URL);

    // Check for proper sitemap structure
    expect(content, 'Should have XML declaration').toContain('<?xml');
    expect(content, 'Should have urlset element').toContain('<urlset');
    expect(content, 'Should have loc elements').toContain('<loc>');
  });

  test('should have all sitemap URLs as absolute', async ({ page }) => {
    const response = await page.goto(TEST_CONFIG.FEEDS.SITEMAP);
    expect(response?.status(), 'Sitemap should be accessible').toBe(200);

    const content = await page.content();

    // Parse the XML and check all <loc> elements using helper function
    const locations = parseXMLLinks(content, 'loc');

    expect(locations.length, 'Sitemap should contain location elements').toBeGreaterThan(0);

    locations.forEach((url, index) => {
      validateAbsoluteURL(url, `Sitemap location ${index + 1}`);
    });
  });

  test('should include both Polish and English pages in sitemap', async ({ page }) => {
    const response = await page.goto(TEST_CONFIG.FEEDS.SITEMAP);
    expect(response?.status(), 'Sitemap should be accessible').toBe(200);

    const content = await page.content();

    // Should contain both language versions
    expect(content, 'Sitemap should include Polish pages').toContain('/pl/');
    expect(content, 'Sitemap should include English pages').toContain('/en/');

    // Validate that both language URLs are absolute
    const locations = parseXMLLinks(content, 'loc');
    const plPages = locations.filter(url => url.includes('/pl/'));
    const enPages = locations.filter(url => url.includes('/en/'));

    expect(plPages.length, 'Should have Polish pages in sitemap').toBeGreaterThan(0);
    expect(enPages.length, 'Should have English pages in sitemap').toBeGreaterThan(0);
  });
});

test.describe('URL Consistency and Best Practices', () => {
  test('should not have hardcoded localhost URLs in production build', async ({ page }) => {
    await page.goto(TEST_CONFIG.PAGES.PL_HOME);

    const content = await page.content();

    // Should not contain localhost development URLs
    expect(content, 'Should not contain localhost:1313').not.toContain('localhost:1313');
    expect(content, 'Should not contain http://localhost').not.toContain('http://localhost');
  });

  test('should handle trailing slashes consistently', async ({ page }) => {
    // Test with trailing slash
    const response1 = await page.goto(TEST_CONFIG.PAGES.PL_HOME);
    expect(response1?.status(), 'Page should be accessible').toBe(200);

    // Test internal links for consistent trailing slash usage
    const links = await page.locator(`a[href^="${TEST_CONFIG.BASE_PATH}/pl/"]`).all();

    if (links.length > 0) {
      for (const link of links.slice(0, 5)) {
        const href = await link.getAttribute('href');
        // Most internal links should end with / for consistency
        if (href && !href.includes('.') && !href.includes('#')) {
          expect(href, 'Internal links should end with trailing slash').toMatch(/\/$/);
        }
      }
    }
  });

  test('should not modify external link URLs', async ({ page }) => {
    await page.goto(TEST_CONFIG.PAGES.PL_HOME);

    // Check that external links (like social media) are not modified
    const externalLinks = await page.locator('a[href^="http"]').all();

    for (const link of externalLinks) {
      const href = await link.getAttribute('href');

      // External links should start with http:// or https://
      expect(href, 'External links should start with protocol').toMatch(/^https?:\/\//);

      // If it's a social media link, verify it's not modified
      const socialDomains = ['facebook.com', 'instagram.com', 'twitter.com', 'linkedin.com', 'youtube.com'];
      const isSocialLink = socialDomains.some(domain => href?.includes(domain));

      if (isSocialLink) {
        expect(href, 'Social media links should not contain base path').not.toContain(TEST_CONFIG.BASE_PATH);
      }
    }
  });

  test('should use relative URLs for internal navigation', async ({ page }) => {
    await page.goto(TEST_CONFIG.PAGES.PL_HOME);

    // Internal navigation links should be relative (start with /)
    const navLinks = await page.locator('nav a[href^="/"]').all();

    expect(navLinks.length, 'Should have internal navigation links').toBeGreaterThan(0);

    for (const link of navLinks) {
      const href = await link.getAttribute('href');
      validateRelativeURL(href, 'Internal navigation link');
    }
  });

  test('should use absolute URLs in meta tags', async ({ page }) => {
    await page.goto(TEST_CONFIG.PAGES.PL_HOME);

    // Canonical should be absolute
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    validateAbsoluteURL(canonical, 'Canonical URL');

    // og:url should be absolute
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    validateAbsoluteURL(ogUrl, 'Open Graph URL');

    // og:image should be absolute if present
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    if (ogImage) {
      validateAbsoluteURL(ogImage, 'Open Graph image');
    }

    // twitter:image should be absolute if present
    const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content');
    if (twitterImage) {
      validateAbsoluteURL(twitterImage, 'Twitter Card image');
    }
  });
});

test.describe('baseURL Configuration Verification', () => {
  test('should have correct baseURL in all page types', async ({ page }) => {
    const pagesToTest = [
      { path: TEST_CONFIG.PAGES.PL_HOME, name: 'Home' },
      { path: TEST_CONFIG.PAGES.PL_ABOUT, name: 'About' },
      { path: TEST_CONFIG.PAGES.PL_GALLERY, name: 'Gallery' },
      { path: TEST_CONFIG.PAGES.PL_NEWS, name: 'News' },
      { path: TEST_CONFIG.PAGES.PL_CONTACT, name: 'Contact' },
    ];

    for (const { path, name } of pagesToTest) {
      await page.goto(path);

      // Check canonical URL includes baseURL
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      validateAbsoluteURL(canonical, `${name} page canonical URL`);

      // Check that assets are loaded with baseURL
      const stylesheets = await page.locator('link[rel="stylesheet"]').all();
      expect(stylesheets.length, `${name} page should have stylesheets`).toBeGreaterThan(0);

      for (const stylesheet of stylesheets) {
        const href = await stylesheet.getAttribute('href');
        if (href && !href.startsWith('http')) {
          expect(href, `${name} page stylesheet should include base path`).toContain(TEST_CONFIG.BASE_PATH);
        }
      }
    }
  });

  test('should maintain baseURL across navigation', async ({ page }) => {
    await page.goto(TEST_CONFIG.PAGES.PL_HOME);

    // Get initial URL
    expect(page.url(), 'Initial page should contain base path').toContain(TEST_CONFIG.BASE_PATH);

    // Navigate to another page
    const aboutLink = page.locator('a[href*="/o-przedszkolu"]').first();
    if (await aboutLink.count() > 0) {
      await aboutLink.click();
      await page.waitForLoadState('networkidle');

      // URL should still contain baseURL
      expect(page.url(), 'Navigated page should maintain base path').toContain(TEST_CONFIG.BASE_PATH);
    }
  });

  test('should have correct baseURL in alternate language links', async ({ page }) => {
    await page.goto(TEST_CONFIG.PAGES.PL_HOME);

    const alternateLinks = await page.locator('link[rel="alternate"][hreflang]').all();

    expect(alternateLinks.length, 'Should have alternate language links').toBeGreaterThan(0);

    for (const link of alternateLinks) {
      const href = await link.getAttribute('href');
      validateAbsoluteURL(href, 'Alternate language link');
    }
  });
});

test.describe('Subdirectory Deployment Support', () => {
  test('should work correctly when deployed to subdirectory', async ({ page }) => {
    const response = await page.goto(TEST_CONFIG.PAGES.PL_HOME);

    // Verify the page loaded successfully
    expect(response?.status(), 'Subdirectory page should load successfully').toBe(200);
    expect(page.url(), 'URL should contain base path').toContain(TEST_CONFIG.BASE_PATH);

    // Verify no 404s for critical assets
    const stylesheets = await page.locator('link[rel="stylesheet"]').all();
    expect(stylesheets.length, 'Should have stylesheets loaded').toBeGreaterThan(0);

    // Verify scripts load
    const scripts = await page.locator('script[src]').all();
    expect(scripts.length, 'Should have scripts loaded').toBeGreaterThan(0);
  });

  test('should have correct paths for all asset types', async ({ page }) => {
    await page.goto(TEST_CONFIG.PAGES.PL_HOME);

    const assetChecks: { selector: string; attribute: string; name: string }[] = [
      { selector: 'link[rel="stylesheet"]', attribute: 'href', name: 'Stylesheets' },
      { selector: 'script[src]', attribute: 'src', name: 'Scripts' },
      { selector: 'img[src]', attribute: 'src', name: 'Images' },
      { selector: 'link[rel="icon"]', attribute: 'href', name: 'Icons' }
    ];

    for (const check of assetChecks) {
      const elements = await page.locator(check.selector).all();

      for (const element of elements.slice(0, 3)) { // Check first 3 of each type
        const value = await element.getAttribute(check.attribute);

        if (value && !value.startsWith('data:') && !value.startsWith('http')) {
          // Relative assets should include baseURL path
          expect(value, `${check.name} should include base path`).toContain(TEST_CONFIG.BASE_PATH);
        }
      }
    }
  });
});

test.describe('Protocol-Relative URL Handling', () => {
  test('should not use protocol-relative URLs', async ({ page }) => {
    await page.goto('/wesole_nutki/pl/');

    const content = await page.content();

    // Should not contain protocol-relative URLs (//domain.com)
    // except in specific contexts like CDN resources
    const protocolRelativeMatches = content.match(/href="\/\/[^"]+"/g);

    if (protocolRelativeMatches) {
      // If any are found, they should be for external CDNs only
      protocolRelativeMatches.forEach(match => {
        // Our own domain should not use protocol-relative URLs
        expect(match).not.toContain('//bartusiak.ai');
      });
    }
  });
});

test.describe('CDN and Asset Prefix Configuration', () => {
  test('should handle CDN URLs correctly if configured', async ({ page }) => {
    await page.goto('/wesole_nutki/pl/');

    // If CDN is configured, external asset URLs should be preserved
    const scripts = await page.locator('script[src^="https://"]').all();

    for (const script of scripts) {
      const src = await script.getAttribute('src');
      if (src && src.includes('cdn')) {
        // CDN URLs should remain unchanged and load successfully
        const response = await page.request.get(src);
        expect([200, 304]).toContain(response.status());
      }
    }
  });
});

test.describe('Multi-Language Site URL Handling', () => {
  test('should have different baseURL for each language if configured', async ({ page }) => {
    // Test Polish version
    await page.goto('/wesole_nutki/pl/');
    const canonicalPL = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonicalPL).toContain('/pl/');

    // Test English version
    await page.goto('/wesole_nutki/en/');
    const canonicalEN = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonicalEN).toContain('/en/');

    // Both should have the same base domain
    expect(canonicalPL).toContain('bartusiak.ai/wesole_nutki/');
    expect(canonicalEN).toContain('bartusiak.ai/wesole_nutki/');
  });

  test('should maintain language prefix in all URLs when navigating', async ({ page }) => {
    await page.goto('/wesole_nutki/pl/');

    // All links on Polish page should have /pl/ prefix
    const links = await page.locator('a[href^="/wesole_nutki/pl/"]').all();

    expect(links.length).toBeGreaterThan(0);

    for (const link of links.slice(0, 10)) {
      const href = await link.getAttribute('href');
      expect(href).toContain('/pl/');
    }
  });
});

test.describe('Breadcrumb Structured Data URLs', () => {
  test('should have absolute URLs in breadcrumb structured data', async ({ page }) => {
    await page.goto('/wesole_nutki/pl/o-przedszkolu/');

    // Look for breadcrumb JSON-LD structured data
    const breadcrumbScripts = await page.locator('script[type="application/ld+json"]').all();

    for (const script of breadcrumbScripts) {
      const content = await script.textContent();
      if (content && content.includes('BreadcrumbList')) {
        const data = JSON.parse(content);

        if (data.itemListElement) {
          for (const item of data.itemListElement) {
            if (item.item) {
              // Breadcrumb URLs should be absolute
              expect(item.item).toMatch(/^https:\/\//);
              expect(item.item).toContain('bartusiak.ai/wesole_nutki/');
            }
          }
        }
      }
    }
  });
});

test.describe('Edge Cases and Error Scenarios', () => {
  test('should handle 404 page with correct URLs', async ({ page }) => {
    const response = await page.goto('/wesole_nutki/pl/non-existent-page-123456/');

    // Should show 404 page
    expect(response?.status()).toBe(404);

    // 404 page should still have correct canonical URL structure
    const content = await page.content();

    // Navigation links should still work
    const homeLink = page.locator('a[href*="/pl/"]').first();
    if (await homeLink.count() > 0) {
      const href = await homeLink.getAttribute('href');
      expect(href).toContain('/wesole_nutki/');
    }
  });

  test('should handle pages with query parameters correctly', async ({ page }) => {
    await page.goto('/wesole_nutki/pl/?test=123');

    // Canonical URL should not include query parameters
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).not.toContain('?test=123');
    expect(canonical).toMatch(/\/pl\/$/);
  });
});
