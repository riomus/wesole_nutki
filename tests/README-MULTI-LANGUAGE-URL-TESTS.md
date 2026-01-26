# Multi-Language URL Tests

## Overview

The `multi-language-urls.spec.ts` test file contains comprehensive E2E tests that verify the correct handling and structure of URLs across Polish (`/pl/`) and English (`/en/`) language versions of the Wesole Nutki website.

## Test Coverage

### 1. Multi-Language URL Structure (20 tests)
- **Homepage URLs**: Verifies language prefixes (`/pl/` and `/en/`) in homepage URLs
- **Content Page URLs**: Ensures consistent URL patterns for about, contact, and programs pages
- **Section URLs**: Tests news and gallery section URL patterns and navigation
- **Taxonomy URLs**: Validates category and tag URL structures with language prefixes

### 2. Language Switcher URL Behavior (5 tests)
- Tests switching between Polish and English versions
- Verifies page context is maintained when switching languages
- Checks `hreflang` attributes on language switch links
- Validates correct URLs are generated for each language

### 3. Navigation Link Language Context (4 tests)
- Ensures all navigation links maintain the current language context
- Verifies no language mixing in navigation menus
- Tests dropdown menu language consistency
- Validates links lead to correct language versions

### 4. URL Consistency Across Content Types (3 tests)
- Tests consistent URL structure across multiple page types
- Verifies proper handling of pages with/without language prefixes
- Ensures all pages load successfully with correct status codes

### 5. URL Path Structure (4 tests)
- Validates trailing slash consistency
- Checks baseURL structure when subdirectories are used
- Ensures no double slashes in URLs
- Verifies lowercase URL conventions

### 6. Cross-Language URL Consistency (2 tests)
- Compares URL structures between Polish and English versions
- Ensures URL parameters are maintained across language switches

### 7. Mobile Multi-Language URLs (2 tests)
- Tests language prefix maintenance in mobile navigation
- Verifies language switcher functionality on mobile devices

### 8. URL Accessibility and SEO (4 tests)
- Validates `hreflang` meta tags for language alternates
- Checks HTML `lang` attribute correctness
- Ensures language-specific canonical URLs
- Tests proper SEO metadata for multi-language support

## Total Test Count

**132 tests** across 8 test suites, covering 3 browsers (Chromium, Firefox, WebKit)

## Running the Tests

### Run all multi-language URL tests:
```bash
npx playwright test tests/multi-language-urls.spec.ts
```

### Run with specific browser:
```bash
npx playwright test tests/multi-language-urls.spec.ts --project=chromium
```

### Run with UI:
```bash
npx playwright test tests/multi-language-urls.spec.ts --ui
```

### Run specific test suite:
```bash
npx playwright test tests/multi-language-urls.spec.ts -g "Language Switcher"
```

## Key Validations

1. **Language Prefix Consistency**: All pages maintain correct language prefix (`/pl/` or `/en/`)
2. **Navigation Context**: Internal navigation preserves language context
3. **Cross-Language Switching**: Language switcher correctly maps between Polish and English pages
4. **URL Structure**: URLs follow consistent patterns across content types
5. **SEO Compliance**: Proper `hreflang`, `lang` attributes, and canonical URLs
6. **Mobile Compatibility**: Language handling works correctly on mobile devices
7. **Path Conventions**: URLs follow best practices (lowercase, trailing slashes, no double slashes)

## Configuration Notes

The site has a multilingual setup with:
- **Default language**: Polish (`pl`)
- **Alternate language**: English (`en`)
- **baseURL**: Supports both root and subdirectory deployments
- **Language in subdirectory**: Both languages use subdirectory paths

Some Polish menu items may use paths without the `/pl/` prefix (e.g., `/plan-zajec/`, `/o-przedszkolu/`) based on the Hugo configuration. The tests account for these special cases.

## Related Documentation

- **Hugo Configuration**: `hugo.toml` (lines 44-405 contain multilingual setup)
- **URL Function Guide**: `URL_FUNCTION_USAGE_GUIDE.md`
- **Canonical URL Tests**: `tests/canonical-urls.spec.ts`
- **Internal Navigation Tests**: `tests/internal-navigation-links.spec.ts`

## Maintenance

When adding new pages or sections:
1. Add corresponding URL tests to verify language prefix handling
2. Test both Polish and English versions
3. Verify language switcher behavior for new pages
4. Check canonical and hreflang meta tags

## Test Framework

- **Framework**: Playwright
- **Language**: TypeScript
- **Browsers**: Chromium, Firefox, WebKit
- **Test Pattern**: Page Object Model (implicit)
- **Assertions**: Playwright expect API

---

**Last Updated**: 2025-01-26
**Total Tests**: 132 (44 test cases × 3 browsers)
**Test File**: `tests/multi-language-urls.spec.ts`
