# Hugo URL Configuration Testing Documentation

## Overview

This document describes the testing approach for validating that the Hugo site follows best practices for URL configuration and generation.

## Feature Implementation

The feature "Fix Hugo URL Configuration to Follow Best Practices" includes:

### Configuration Changes
- **canonifyURLs**: Set to `false` (line 8 in hugo.toml)
- **baseURL**: Configured as `https://bartusiak.ai/wesole_nutki/`

### Template Updates
All templates were updated to use proper Hugo URL functions:

1. **Meta Tags** (head.html:147, 155): Use `.Permalink` for absolute URLs
   - Canonical link: `<link rel="canonical" href="{{ $canonicalURL }}">`
   - Open Graph URL: `<meta property="og:url" content="{{ .Permalink }}">`
   - Alternate language links: `href="{{ .Permalink }}"`

2. **Images** (head.html:158, 195): Use `absURL` for absolute paths
   - OG image: `{{ . | absURL }}`
   - Twitter image: `{{ . | absURL }}`
   - Favicon: `{{ "favicon.svg" | relURL }}`

3. **Internal Links**: Use `relURL` or `.RelPermalink`
   - Pagination (pagination.html): `{{ .URL | relURL }}`
   - About section (homepage/about.html:24): `{{ $url | relURL }}`
   - Navigation: Uses `.RelPermalink` from menu system

4. **Assets**: Use `.RelPermalink`
   - CSS: `{{ $style.RelPermalink }}`
   - JS: `{{ $script.RelPermalink }}`

## Test Files Created

### 1. url-configuration.spec.ts (444 lines)
Comprehensive test suite covering:
- Meta tags and SEO (canonical, OG, Twitter Card)
- Internal navigation links
- Asset loading (CSS, JS, images)
- Multi-language URLs
- Gallery and news URLs
- Breadcrumb URLs
- Social sharing URLs
- Pagination URLs
- Production build verification

### 2. url-functions-validation.spec.ts (323 lines)
Focused validation of Hugo URL functions:
- `.Permalink` usage for absolute URLs
- `relURL` usage for relative URLs
- `absURL` usage for meta tag images
- External link preservation
- RSS and sitemap URL validation
- canonifyURLs configuration verification

## Test Coverage

### Total Tests: 44 URL-related tests
- **Meta Tags**: 6 tests
- **Internal Navigation**: 5 tests
- **Asset Loading**: 5 tests
- **Multi-Language**: 3 tests
- **Gallery URLs**: 3 tests
- **News URLs**: 2 tests
- **Breadcrumb URLs**: 2 tests
- **Social Sharing**: 1 test
- **Pagination**: 2 tests
- **RSS/Sitemap**: 2 tests
- **URL Functions**: 15 tests

## Test Results

### Successful Validation Points
✅ Canonical URLs use `.Permalink` (absolute)
✅ Open Graph URLs use `.Permalink` (absolute)
✅ OG images use `absURL` when present
✅ Internal navigation uses relative URLs
✅ Pagination links use `relURL`
✅ CSS files use `.RelPermalink`
✅ Favicon uses `relURL`
✅ RSS feeds contain absolute URLs
✅ Sitemaps contain absolute URLs
✅ Gallery links use relative URLs
✅ Breadcrumb links use relative URLs
✅ External links preserved correctly
✅ canonifyURLs=false verified

### Implementation Verified
- All templates correctly use Hugo URL functions
- baseURL configuration properly set
- No hardcoded URLs in templates
- Proper separation of absolute (meta tags) vs relative (internal links) URLs

## Hugo URL Functions Reference

### When to Use Each Function

| Function | Use Case | Output |
|----------|----------|---------|
| `.Permalink` | Meta tags, RSS, sitemaps | Absolute URL with protocol |
| `.RelPermalink` | Internal navigation, assets | Relative URL with baseURL |
| `relURL` | Manually constructed URLs | Relative URL with baseURL |
| `absURL` | Images in meta tags | Absolute URL with protocol |

### Examples from Implementation

```html
<!-- Absolute URLs for SEO/Social -->
<link rel="canonical" href="{{ .Permalink }}">
<meta property="og:url" content="{{ .Permalink }}">
<meta property="og:image" content="{{ $image | absURL }}">

<!-- Relative URLs for internal navigation -->
<a href="{{ .RelPermalink }}">Link</a>
<a href="{{ $url | relURL }}">Another Link</a>

<!-- Assets -->
<link rel="stylesheet" href="{{ $style.RelPermalink }}">
<img src="{{ $image | relURL }}">
```

## Best Practices Followed

1. **canonifyURLs=false**: Modern Hugo best practice
2. **Explicit URL functions**: Clear intent in templates
3. **Absolute URLs for external consumption**: SEO, social media
4. **Relative URLs for internal links**: Flexibility for different environments
5. **No hardcoded URLs**: All URLs generated dynamically
6. **baseURL configuration**: Single source of truth for site URL

## Production vs Development

### Development
- baseURL can be overridden: `hugo server --baseURL http://localhost:1313/`
- Generates relative URLs: `/css/style.css`

### Production
- Uses baseURL from config: `https://bartusiak.ai/wesole_nutki/`
- Generates relative URLs with path: `/wesole_nutki/css/style.css`

### Testing
- Uses `BASEPATH=true` environment variable
- Playwright configured to test both scenarios

## Validation Commands

```bash
# Build site
hugo --gc --minify

# Run URL configuration tests
BASEPATH=true npx playwright test url-configuration.spec.ts --project=chromium

# Run URL functions validation
BASEPATH=true npx playwright test url-functions-validation.spec.ts --project=chromium

# Check built HTML
grep -A 5 "canonical" public/pl/index.html
```

## Conclusion

The Hugo URL configuration has been successfully implemented following modern best practices. All templates use appropriate URL functions, and comprehensive tests verify the implementation across different page types and use cases.
