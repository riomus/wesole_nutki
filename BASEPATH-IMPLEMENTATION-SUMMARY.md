# BaseURL Path Handling Implementation Summary

## Overview

This document summarizes the implementation of proper BaseURL path handling for internal links and images in the Wesole Nutki Hugo website. The site is configured to work correctly when deployed at `https://bartusiak.ai/wesole_nutki/` (with subdirectory) or any other baseURL configuration.

## Implementation Status

✅ **COMPLETE** - All templates, partials, and data files have been audited and verified to use proper URL handling functions.

## Key Configuration

### Hugo Configuration (`hugo.toml`)

```toml
baseURL = "https://bartusiak.ai/wesole_nutki/"
canonifyURLs = false
```

**Why `canonifyURLs = false`?**
- Modern Hugo best practice (Hugo 0.60+)
- Templates have explicit control over URL generation
- Supports flexible deployment scenarios (root domain, subdirectory, CDN)
- Better performance (no URL rewriting at build time)
- Easier debugging with explicit URL generation

## URL Handling Strategy

### Functions Used

1. **`relURL`** - For internal links and assets
   - Generates relative URLs with baseURL path prefix
   - Example: `/images/logo.png` → `/wesole_nutki/images/logo.png`

2. **`.RelPermalink`** - For page URLs
   - Built-in Hugo function for page-relative permalinks
   - Automatically includes baseURL path

3. **`absURL`** - For absolute URLs (SEO, social sharing)
   - Generates complete absolute URLs
   - Example: `/images/logo.png` → `https://bartusiak.ai/wesole_nutki/images/logo.png`

4. **`absLangURL`** - For language-specific absolute URLs
   - Handles both baseURL path and language prefixes
   - Example: `contact` → `https://bartusiak.ai/wesole_nutki/pl/contact/`

5. **`relLangURL`** - For language-specific relative URLs
   - Handles both baseURL path and language prefixes
   - Example: `contact` → `/wesole_nutki/pl/contact/`

### Pattern: TrimPrefix Before relURL

For menu URLs from data files, we use this pattern:

```go
{{ $href := .url }}
{{ if not (or (hasPrefix .url "http") (hasPrefix .url "#")) }}
  {{ $href = strings.TrimPrefix "/" .url | relURL }}
{{ end }}
```

**Why TrimPrefix?**
- Menu URLs in data files start with language code: `/pl/contact/`
- Hugo's `relURL` expects paths without leading slash
- `TrimPrefix "/" .url` strips the leading slash
- `relURL` then properly adds baseURL prefix: `/wesole_nutki/pl/contact/`

## Files Audited and Verified

### Navigation Templates

- ✅ `layouts/partials/header.html`
  - Menu links use `strings.TrimPrefix "/" .url | relURL`
  - Logo uses `relURL`
  - External link detection with `external: true` flag

- ✅ `layouts/partials/footer.html`
  - Menu links use `strings.TrimPrefix "/" .url | relURL`
  - Useful links use `relURL`

- ✅ `layouts/partials/breadcrumb.html`
  - Uses `.RelPermalink` for internal navigation
  - Uses `absURL` for JSON-LD structured data

- ✅ `layouts/partials/language-switcher.html`
  - Uses `absLangURL` for language switching
  - Preserves page context when switching languages

### Content Partials

- ✅ `layouts/partials/responsive-image.html`
  - Processed images use `.RelPermalink`
  - Fallback images use `relURL`

- ✅ `layouts/partials/homepage/hero.html`
  - Background images use `relURL`
  - Button URLs use `strings.TrimPrefix "/" .url | relURL`

- ✅ `layouts/partials/homepage/cta.html`
  - Button URLs use `relURL`

- ✅ `layouts/partials/homepage/about.html`
  - Button URLs use `relURL`

- ✅ `layouts/partials/homepage/recruitment.html`
  - Download URLs use `relURL`
  - Document links use `relURL`

- ✅ `layouts/partials/about/contact-cta.html`
  - Uses `relLangURL` for language-aware URLs

- ✅ `layouts/partials/program-card.html`
  - Card links use `.RelPermalink`

- ✅ `layouts/partials/related-posts.html`
  - Post links use `.RelPermalink`

- ✅ `layouts/partials/head.html`
  - Favicon uses `relURL`
  - OG images use `relURL | absURL`
  - Twitter images use `relURL | absURL`
  - CSS/JS assets use `.RelPermalink`
  - Canonical URL uses `.Permalink`

### Menu Data Files

- ✅ `data/menus/main_pl.yml`
  - URLs start with language code: `/pl/`
  - External links marked with `external: true`

- ✅ `data/menus/main_en.yml`
  - URLs start with language code: `/en/`
  - External links marked with `external: true`

## External Link Handling

External links are properly detected and left unmodified:

```yaml
items:
  - identifier: example
    name: External Link
    url: https://example.com
    external: true
    open_in_new_tab: true
```

Template handling:

```go
{{ $href := .url }}
{{ if not (or (hasPrefix .url "http") (hasPrefix .url "#")) }}
  {{ $href = strings.TrimPrefix "/" .url | relURL }}
{{ end }}
```

## Testing

### Playwright Test Suites

1. **`menu-basepath-handling.spec.ts`**
   - Verifies menu URLs include basepath
   - Tests navigation with basepath
   - Checks dropdown menus

2. **`image-basepath-feature.spec.ts`**
   - Verifies image URLs include basepath
   - Tests responsive images
   - Checks static vs processed images

3. **`basepath-markdown-images.spec.ts`**
   - Tests images in markdown content
   - Verifies asset processing

4. **`hugo-url-best-practices.spec.ts`**
   - Validates URL function usage
   - Tests edge cases

### Running Tests

**With basepath:**
```bash
BASEPATH=true npx playwright test menu-basepath-handling.spec.ts
BASEPATH=true npx playwright test image-basepath-feature.spec.ts
```

**Without basepath (root domain):**
```bash
npx playwright test menu-basepath-handling.spec.ts
npx playwright test image-basepath-feature.spec.ts
```

## Edge Cases Handled

1. **External Links** - Not modified, no relURL applied
2. **Anchor Links (#)** - Left as-is for dropdown parents
3. **Double Slashes** - Prevented by TrimPrefix before relURL
4. **Language Switching** - Uses absLangURL to preserve context
5. **Root Domain** - Works correctly with baseURL = "/"
6. **SEO/Social** - Uses absolute URLs for og:image, canonical, etc.

## Success Metrics

- ✅ All navigation links work with basepath configuration
- ✅ All images load with basepath configuration
- ✅ Language switching preserves page context
- ✅ External links remain unmodified
- ✅ Site works identically at root domain or subdirectory
- ✅ No double slashes in URLs
- ✅ No missing baseURL prefixes

## Best Practices Applied

1. **Explicit URL Functions** - Every URL uses appropriate Hugo function
2. **Conditional Processing** - External links and anchors skip relURL
3. **Data-Driven Configuration** - Menu flags control URL processing
4. **Comprehensive Testing** - Multiple test suites cover all scenarios
5. **Documentation** - Clear comments explain URL handling strategy

## Maintenance Notes

### Adding New Links

When adding new internal links to templates:

```go
{{ $url | relURL }}
```

When adding menu items to data files:

```yaml
- name: New Page
  url: /en/new-page/
  external: false  # Set to true for external URLs
```

### Troubleshooting

**Links missing basepath prefix:**
- Check if relURL is applied
- Verify canonifyURLs = false in hugo.toml
- Ensure leading slash is trimmed before relURL

**Double basepath in URLs:**
- Check if relURL is applied twice
- Verify TrimPrefix is used before relURL

**External links broken:**
- Check if external: true flag is set
- Verify conditional logic skips relURL for external URLs

## References

- Hugo URL Management: https://gohugo.io/functions/urls/
- Hugo Configuration: https://gohugo.io/getting-started/configuration/
- Hugo Best Practices: https://gohugo.io/hosting-and-deployment/hugo-deploy/
