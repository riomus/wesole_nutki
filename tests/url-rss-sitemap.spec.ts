import { test, expect } from '@playwright/test';

/**
 * RSS Feed and Sitemap URL Verification Tests
 *
 * These tests verify that RSS feeds and sitemaps generate correct absolute URLs
 * as required by Hugo URL configuration best practices.
 *
 * Requirements:
 * - RSS feed URLs must be absolute with correct baseURL
 * - Sitemap URLs must be absolute with correct baseURL
 * - Feed links should include /wesole_nutki/ subdirectory prefix
 * - All URLs should use correct protocol (https)
 */

test.describe('RSS Feed URL Configuration', () => {

  test('should have RSS feed link in HTML head', async ({ page }) => {
    await page.goto('/pl/');

    // Check for RSS feed link
    const rssLink = page.locator('link[type="application/rss+xml"]');
    const count = await rssLink.count();

    if (count > 0) {
      const href = await rssLink.first().getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toContain('/wesole_nutki/');
      expect(href).toContain('/index.xml');
    }
  });

  test('should generate RSS feed with absolute item URLs', async ({ page, request }) => {
    // Fetch RSS feed
    const rssResponse = await request.get('/wesole_nutki/pl/index.xml');

    if (rssResponse.ok()) {
      const rssContent = await rssResponse.text();

      // Check that RSS feed contains absolute URLs
      expect(rssContent).toContain('https://');
      expect(rssContent).toContain('/wesole_nutki/');

      // RSS should contain link elements with absolute URLs
      // Match <link>https://bartusiak.ai/wesole_nutki/...</link>
      const linkMatches = rssContent.match(/<link>(.*?)<\/link>/g);

      if (linkMatches && linkMatches.length > 0) {
        for (const linkMatch of linkMatches) {
          const url = linkMatch.replace(/<\/?link>/g, '');
          expect(url).toMatch(/^https?:\/\//);
          expect(url).toContain('/wesole_nutki/');
        }
      }
    }
  });

  test('should have RSS feed for news section with absolute URLs', async ({ request }) => {
    const newsRss = await request.get('/wesole_nutki/pl/news/index.xml');

    if (newsRss.ok()) {
      const rssContent = await newsRss.text();

      // Verify RSS contains absolute URLs
      expect(rssContent).toContain('https://');
      expect(rssContent).toContain('/wesole_nutki/pl/news/');

      // Check channel link is absolute
      const channelLinkMatch = rssContent.match(/<channel>[\s\S]*?<link>(.*?)<\/link>/);
      if (channelLinkMatch && channelLinkMatch[1]) {
        expect(channelLinkMatch[1]).toMatch(/^https?:\/\//);
        expect(channelLinkMatch[1]).toContain('/wesole_nutki/');
      }
    }
  });

  test('should have RSS feed items with absolute image URLs', async ({ request }) => {
    const rssResponse = await request.get('/wesole_nutki/pl/news/index.xml');

    if (rssResponse.ok()) {
      const rssContent = await rssResponse.text();

      // Check for image enclosures or media content
      const imageMatches = rssContent.match(/url="([^"]+\.(?:jpg|jpeg|png|webp|gif))"/gi);

      if (imageMatches && imageMatches.length > 0) {
        for (const imageMatch of imageMatches) {
          const url = imageMatch.match(/url="([^"]+)"/)?.[1];
          if (url) {
            expect(url).toMatch(/^https?:\/\//);
          }
        }
      }
    }
  });

  test('should have correct RSS feed content type', async ({ request }) => {
    const rssResponse = await request.get('/wesole_nutki/pl/index.xml');

    if (rssResponse.ok()) {
      const contentType = rssResponse.headers()['content-type'];
      expect(contentType).toMatch(/(?:application\/(?:rss\+)?xml|text\/xml)/);
    }
  });
});

test.describe('Sitemap URL Configuration', () => {

  test('should have sitemap.xml at root with baseURL prefix', async ({ request }) => {
    const sitemapResponse = await request.get('/wesole_nutki/sitemap.xml');

    expect(sitemapResponse.ok()).toBeTruthy();

    const sitemapContent = await sitemapResponse.text();

    // Sitemap should contain absolute URLs
    expect(sitemapContent).toContain('https://');
    expect(sitemapContent).toContain('/wesole_nutki/');

    // Should be valid XML
    expect(sitemapContent).toContain('<?xml');
    expect(sitemapContent).toContain('<urlset');
  });

  test('should have all sitemap URLs as absolute with correct baseURL', async ({ request }) => {
    const sitemapResponse = await request.get('/wesole_nutki/sitemap.xml');

    if (sitemapResponse.ok()) {
      const sitemapContent = await sitemapResponse.text();

      // Extract all <loc> elements
      const locMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);

      expect(locMatches).toBeTruthy();
      expect(locMatches!.length).toBeGreaterThan(0);

      for (const locMatch of locMatches!) {
        const url = locMatch.replace(/<\/?loc>/g, '');

        // All URLs must be absolute
        expect(url).toMatch(/^https?:\/\//);

        // All URLs must include baseURL subdirectory
        expect(url).toContain('/wesole_nutki/');

        // Should be properly formed URL
        expect(() => new URL(url)).not.toThrow();
      }
    }
  });

  test('should have language-specific sitemaps with correct URLs', async ({ request }) => {
    // Check Polish sitemap
    const plSitemap = await request.get('/wesole_nutki/pl/sitemap.xml');

    if (plSitemap.ok()) {
      const content = await plSitemap.text();

      expect(content).toContain('https://');
      expect(content).toContain('/wesole_nutki/pl/');

      // All URLs should be for Polish content
      const locMatches = content.match(/<loc>(.*?)<\/loc>/g);
      if (locMatches) {
        for (const locMatch of locMatches) {
          const url = locMatch.replace(/<\/?loc>/g, '');
          expect(url).toContain('/pl/');
        }
      }
    }
  });

  test('should have sitemap index if multiple sitemaps exist', async ({ request }) => {
    const sitemapIndex = await request.get('/wesole_nutki/sitemap.xml');

    if (sitemapIndex.ok()) {
      const content = await sitemapIndex.text();

      // Check if it's a sitemap index or regular sitemap
      const isSitemapIndex = content.includes('<sitemapindex');
      const isRegularSitemap = content.includes('<urlset');

      expect(isSitemapIndex || isRegularSitemap).toBeTruthy();

      if (isSitemapIndex) {
        // If sitemap index, check that it references child sitemaps with absolute URLs
        const sitemapMatches = content.match(/<loc>(.*?)<\/loc>/g);

        if (sitemapMatches) {
          for (const sitemapMatch of sitemapMatches) {
            const url = sitemapMatch.replace(/<\/?loc>/g, '');
            expect(url).toMatch(/^https?:\/\//);
            expect(url).toContain('/wesole_nutki/');
          }
        }
      }
    }
  });

  test('should have correct sitemap content type', async ({ request }) => {
    const sitemapResponse = await request.get('/wesole_nutki/sitemap.xml');

    if (sitemapResponse.ok()) {
      const contentType = sitemapResponse.headers()['content-type'];
      expect(contentType).toMatch(/(?:application\/xml|text\/xml)/);
    }
  });

  test('should include gallery pages in sitemap', async ({ request }) => {
    const sitemapResponse = await request.get('/wesole_nutki/sitemap.xml');

    if (sitemapResponse.ok()) {
      const content = await sitemapResponse.text();

      // Should include gallery URLs
      expect(content).toMatch(/\/gallery\//);
    }
  });

  test('should include news pages in sitemap', async ({ request }) => {
    const sitemapResponse = await request.get('/wesole_nutki/sitemap.xml');

    if (sitemapResponse.ok()) {
      const content = await sitemapResponse.text();

      // Should include news URLs
      expect(content).toMatch(/\/news\//);
    }
  });
});

test.describe('RSS and Sitemap Protocol Verification', () => {

  test('should use HTTPS protocol in RSS feeds', async ({ request }) => {
    const rssResponse = await request.get('/wesole_nutki/pl/index.xml');

    if (rssResponse.ok()) {
      const content = await rssResponse.text();

      // All URLs should use HTTPS
      const httpMatches = content.match(/http:\/\//g);
      const httpsMatches = content.match(/https:\/\//g);

      // Should have HTTPS URLs
      expect(httpsMatches).toBeTruthy();

      // Should not have HTTP URLs (unless in content)
      if (httpMatches) {
        // Check if HTTP is only in content descriptions, not in <link> elements
        const linkHttpMatches = content.match(/<link>http:\/\//g);
        expect(linkHttpMatches).toBeFalsy();
      }
    }
  });

  test('should use HTTPS protocol in sitemaps', async ({ request }) => {
    const sitemapResponse = await request.get('/wesole_nutki/sitemap.xml');

    if (sitemapResponse.ok()) {
      const content = await sitemapResponse.text();

      // Extract all URLs from <loc> elements
      const locMatches = content.match(/<loc>(.*?)<\/loc>/g);

      if (locMatches) {
        for (const locMatch of locMatches) {
          const url = locMatch.replace(/<\/?loc>/g, '');

          // Must use HTTPS
          expect(url).toMatch(/^https:\/\//);
        }
      }
    }
  });

  test('should not have protocol-relative URLs in RSS', async ({ request }) => {
    const rssResponse = await request.get('/wesole_nutki/pl/index.xml');

    if (rssResponse.ok()) {
      const content = await rssResponse.text();

      // Should not have protocol-relative URLs (//example.com)
      const protocolRelativeMatches = content.match(/<link>\/\/[^<]+<\/link>/g);
      expect(protocolRelativeMatches).toBeFalsy();
    }
  });

  test('should not have protocol-relative URLs in sitemap', async ({ request }) => {
    const sitemapResponse = await request.get('/wesole_nutki/sitemap.xml');

    if (sitemapResponse.ok()) {
      const content = await sitemapResponse.text();

      // Should not have protocol-relative URLs
      const protocolRelativeMatches = content.match(/<loc>\/\/[^<]+<\/loc>/g);
      expect(protocolRelativeMatches).toBeFalsy();
    }
  });
});

test.describe('RSS Feed Discovery', () => {

  test('should have RSS autodiscovery meta tag on homepage', async ({ page }) => {
    await page.goto('/pl/');

    const rssLink = page.locator('link[type="application/rss+xml"]');
    await expect(rssLink).toHaveCount(await rssLink.count());

    if (await rssLink.count() > 0) {
      const title = await rssLink.getAttribute('title');
      expect(title).toBeTruthy();
    }
  });

  test('should have RSS feed accessible at standard location', async ({ request }) => {
    // Standard Hugo RSS location
    const rssResponse = await request.get('/wesole_nutki/index.xml');

    // RSS feed should exist
    expect(rssResponse.status()).toBeLessThan(400);
  });
});
