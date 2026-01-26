/**
 * URL Test Helpers
 *
 * Common utilities and constants for URL configuration tests.
 * Reduces code duplication and improves maintainability.
 */

import { Page, Locator } from '@playwright/test';

/**
 * Common CSS selectors for URL-related elements
 */
export const Selectors = {
  // Meta tags
  CANONICAL_LINK: 'link[rel="canonical"]',
  OG_URL: 'meta[property="og:url"]',
  OG_IMAGE: 'meta[property="og:image"]',
  TWITTER_IMAGE: 'meta[name="twitter:image"]',
  ALTERNATE_LINKS: 'link[rel="alternate"][hreflang]',

  // Navigation
  NAV_LINKS: 'nav a[href]',
  NAV_INTERNAL_LINKS: 'nav a[href^="/"]:not([href^="http"]):not([href^="#"])',
  NAVBAR_BRAND: '.navbar-brand',

  // Assets
  STYLESHEETS: 'link[rel="stylesheet"]',
  INTERNAL_STYLESHEETS: 'link[rel="stylesheet"][href^="/"]:not([href^="http"])',
  FAVICON: 'link[rel="icon"]',
  IMAGES: 'img[src]',
  INTERNAL_IMAGES: 'img[src^="/"]:not([src^="http"])',

  // Pagination
  PAGINATION_LINKS: '.pagination a[href], .page-link[href]',

  // Gallery
  GALLERY_LINKS: 'a[href*="/gallery/"]:not([href^="http"])',

  // Breadcrumb
  BREADCRUMB_LINKS: '.breadcrumb a[href]:not([href^="http"])',

  // External links
  EXTERNAL_LINKS: 'a[href^="http"]',
} as const;

/**
 * URL validation patterns
 */
export const Patterns = {
  ABSOLUTE_URL: /^https?:\/\//,
  RELATIVE_URL: /^\//,
  BASEPATH: /\/wesole_nutki\//,
} as const;

/**
 * Helper functions for URL validation
 */
export class URLTestHelpers {
  /**
   * Check if a URL is absolute (starts with http/https)
   */
  static isAbsoluteURL(url: string | null): boolean {
    return url ? Patterns.ABSOLUTE_URL.test(url) : false;
  }

  /**
   * Check if a URL is relative (starts with /)
   */
  static isRelativeURL(url: string | null): boolean {
    return url ? Patterns.RELATIVE_URL.test(url) : false;
  }

  /**
   * Check if a URL contains the baseURL path
   */
  static hasBasePath(url: string | null): boolean {
    return url ? Patterns.BASEPATH.test(url) : false;
  }

  /**
   * Get canonical link href from page
   */
  static async getCanonicalURL(page: Page): Promise<string | null> {
    const canonical = page.locator(Selectors.CANONICAL_LINK);
    if (await canonical.count() > 0) {
      return await canonical.getAttribute('href');
    }
    return null;
  }

  /**
   * Get Open Graph URL from page
   */
  static async getOGURL(page: Page): Promise<string | null> {
    const ogUrl = page.locator(Selectors.OG_URL);
    if (await ogUrl.count() > 0) {
      return await ogUrl.getAttribute('content');
    }
    return null;
  }

  /**
   * Get all alternate language links from page
   */
  static async getAlternateLinks(page: Page): Promise<string[]> {
    const alternateLinks = page.locator(Selectors.ALTERNATE_LINKS);
    const count = await alternateLinks.count();
    const links: string[] = [];

    for (let i = 0; i < count; i++) {
      const href = await alternateLinks.nth(i).getAttribute('href');
      if (href) {
        links.push(href);
      }
    }

    return links;
  }

  /**
   * Get internal navigation links from page
   */
  static async getInternalNavLinks(page: Page): Promise<string[]> {
    const navLinks = page.locator(Selectors.NAV_INTERNAL_LINKS);
    const count = await navLinks.count();
    const links: string[] = [];

    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href');
      if (href) {
        links.push(href);
      }
    }

    return links;
  }

  /**
   * Get internal image sources from page
   */
  static async getInternalImages(page: Page): Promise<string[]> {
    const images = page.locator(Selectors.INTERNAL_IMAGES);
    const count = await images.count();
    const sources: string[] = [];

    for (let i = 0; i < count; i++) {
      const src = await images.nth(i).getAttribute('src');
      if (src) {
        sources.push(src);
      }
    }

    return sources;
  }

  /**
   * Validate that all URLs in array match a pattern
   */
  static allMatch(urls: string[], pattern: RegExp): boolean {
    return urls.every(url => pattern.test(url));
  }

  /**
   * Validate that all URLs in array contain a substring
   */
  static allContain(urls: string[], substring: string): boolean {
    return urls.every(url => url.includes(substring));
  }
}
