# URL Link Resolution Behavior Documentation

**Project:** Wesołe Nutki Hugo Site
**Date:** 2026-01-26
**Version:** 1.0
**Purpose:** Document current URL resolution behavior for all link types in the system

---

## Table of Contents

1. [Overview](#overview)
2. [URL Resolution Architecture](#url-resolution-architecture)
3. [Link Types and Resolution Rules](#link-types-and-resolution-rules)
4. [Implementation Details](#implementation-details)
5. [Resolution Flow Diagrams](#resolution-flow-diagrams)
6. [Special Cases and Edge Handling](#special-cases-and-edge-handling)
7. [Testing and Validation](#testing-and-validation)

---

## Overview

This document describes how URLs and links are resolved throughout the Wesołe Nutki Hugo site. The system handles multiple link types including internal pages, external URLs, static assets, multilingual content, and special protocols.

### Key Characteristics

- **Multilingual Support**: Polish (pl) and English (en) with language-aware URL resolution
- **Subdirectory Deployment**: Site runs at `/wesole_nutki/` subdirectory
- **Hybrid URL Strategy**: Uses both relative and absolute URLs based on context
- **SEO Optimized**: Canonical URLs, Open Graph, and social media metadata

### Base Configuration

```toml
# hugo.toml
baseURL = "https://wesolenutkiprzemysl.pl/wesole_nutki/"
canonifyURLs = false
relativeURLs = false

[languages]
  [languages.pl]
    languageCode = "pl-PL"
    languageName = "Polski"
    weight = 1
  [languages.en]
    languageCode = "en-US"
    languageName = "English"
    weight = 2
```

---

## URL Resolution Architecture

### Resolution Strategy by Context

The site uses different URL resolution strategies based on the link's purpose:

| Context | Hugo Function | Output Type | Example |
|---------|---------------|-------------|---------|
| **SEO Meta Tags** | `.Permalink` | Absolute URL | `https://wesolenutkiprzemysl.pl/wesole_nutki/pl/news/article/` |
| **Internal Navigation** | `.RelPermalink` | Relative URL | `/wesole_nutki/pl/news/article/` |
| **Static Assets** | `relURL` | Relative URL | `/wesole_nutki/images/logo.png` |
| **Social Media Images** | `absURL` | Absolute URL | `https://wesolenutkiprzemysl.pl/wesole_nutki/images/og.png` |
| **Language-Aware Sections** | `relLangURL` | Relative + Lang | `/wesole_nutki/pl/categories/news/` |
| **Processed Resources** | `.RelPermalink` | Relative + Hash | `/wesole_nutki/css/main.abc123.css` |

### URL Type Detection

The system includes a URL type detector partial (`layouts/partials/url-type-detector.html`) that categorizes URLs:

**URL Types:**
1. **Absolute** - Full URLs with protocol (`http://`, `https://`, `//`)
2. **Root-Relative** - Paths starting with `/` (e.g., `/about`, `/en/contact/`)
3. **Relative** - Paths without leading `/` (e.g., `../about`, `contact/info`)
4. **Anchor** - Hash-only URLs (e.g., `#section`, `#top`)
5. **Protocol** - Special protocols (e.g., `mailto:`, `tel:`, `javascript:`)
6. **Empty** - Empty or whitespace-only URLs

**Detection Logic:**

```go
{{- $url := .url | default "" -}}
{{- $urlTrimmed := trim $url " \t\n\r" -}}

{{- if eq $urlTrimmed "" -}}
  {{- $type = "empty" -}}
{{- else if hasPrefix $urlTrimmed "#" -}}
  {{- $type = "anchor" -}}
{{- else if or (hasPrefix $urlTrimmed "mailto:") (hasPrefix $urlTrimmed "tel:") -}}
  {{- $type = "protocol" -}}
{{- else if or (hasPrefix $urlTrimmed "http://") (hasPrefix $urlTrimmed "https://") -}}
  {{- $type = "absolute" -}}
  {{- $isExternal = true -}}
{{- else if hasPrefix $urlTrimmed "/" -}}
  {{- $type = "root-relative" -}}
  {{- $needsRelURL = true -}}
{{- else -}}
  {{- $type = "relative" -}}
  {{- $needsRelURL = true -}}
{{- end -}}
```

---

## Link Types and Resolution Rules

### 1. Navigation Menu Links

**Source:** `layouts/partials/header.html` (lines 148-220)

**Resolution Logic:**

```go
{{ $menuURL := .url }}

{{/* External link detection */}}
{{ $isExternal := or (hasPrefix $menuURL "http") (hasPrefix $menuURL "#") }}

{{/* Apply relURL to internal links only */}}
{{ $navHref := $menuURL }}
{{ if not $isExternal }}
  {{ $navHref = strings.TrimPrefix "/" $menuURL | relURL }}
{{ end }}

<a href="{{ $navHref }}">{{ $menuName }}</a>
```

**Resolution Steps:**
1. Check if URL starts with `http` or `#` → Use as-is (external/anchor)
2. For internal links:
   - Strip leading `/` from URL
   - Apply `relURL` function
   - Result includes baseURL path: `/wesole_nutki/about/`

**Menu Data Format:**

```yaml
# data/menus/main_pl.yaml
items:
  - name: "O nas"
    url: "/pl/about/"  # Leading slash will be stripped
    weight: 1
  - name: "Programy"
    url: "/pl/programs/"
    weight: 2
```

**Active State Detection:**

```go
{{ $pageURL := $currentPage.RelPermalink }}
{{ $menuURL := .url }}

{{/* Strip base path for comparison */}}
{{ $basePath := strings.TrimSuffix "/" site.BaseURL | path.Base }}
{{ $pageURLClean := strings.TrimPrefix (printf "/%s" $basePath) $pageURL }}

{{/* Normalize trailing slashes */}}
{{ $normalizedPageURL := strings.TrimSuffix "/" $pageURLClean }}
{{ $normalizedMenuURL := strings.TrimSuffix "/" $menuURL }}

{{/* Exact match */}}
{{ $isCurrentPage := or (eq $pageURLClean $menuURL) (eq $normalizedPageURL $normalizedMenuURL) }}

{{/* Prefix match for sections */}}
{{ if hasPrefix $pageURLClean $menuURL }}
  {{ $isActive = true }}
{{ end }}
```

### 2. Content Page Links (News, Gallery, Programs)

**Source:** Multiple templates

**Resolution Logic:**

```go
{{/* Page-to-page links */}}
<a href="{{ .RelPermalink }}">{{ .Title }}</a>

{{/* Result: /wesole_nutki/pl/news/article-title/ */}}
```

**Why `.RelPermalink`:**
- Respects Hugo's permalink configuration
- Includes language prefix automatically
- Works with subdirectory deployments
- Returns relative URL from site root

**Examples:**

| Content Type | Hugo Page Object | Resolved URL |
|--------------|------------------|--------------|
| News Article | `.RelPermalink` | `/wesole_nutki/pl/news/2024-01-15-title/` |
| Gallery Item | `.RelPermalink` | `/wesole_nutki/pl/gallery/event-photos/` |
| Program Page | `.RelPermalink` | `/wesole_nutki/pl/programs/music-classes/` |
| Static Page | `.RelPermalink` | `/wesole_nutki/pl/about/` |

### 3. Taxonomy Links (Categories, Tags)

**Source:** `layouts/partials/news-category-filter.html`, `layouts/news/single.html`

**Current Implementation (String Concatenation):**

```go
{{/* Less optimal - manual URL construction */}}
{{ range .Params.categories }}
  <a href="{{ printf "categories/%s" (urlize .) | relLangURL }}">
    {{ . }}
  </a>
{{ end }}
```

**Best Practice (Object-Based):**

```go
{{/* Recommended - uses taxonomy objects */}}
{{ range .Params.categories }}
  {{ with $.Site.Taxonomies.categories.Get (. | urlize) }}
    <a href="{{ .Page.RelPermalink }}">{{ .Page.Title }}</a>
  {{ end }}
{{ end }}
```

**Resolution Functions:**

- `urlize`: Sanitizes category/tag names → `"News & Events"` becomes `"news-events"`
- `relLangURL`: Adds language prefix → `/pl/categories/news-events/`

**Resolved URLs:**

| Taxonomy Type | Input | Resolved URL |
|---------------|-------|--------------|
| Category | `"Wydarzenia"` | `/wesole_nutki/pl/categories/wydarzenia/` |
| Tag | `"Music Classes"` | `/wesole_nutki/en/tags/music-classes/` |
| Gallery Category | `"Festyny"` | `/wesole_nutki/pl/gallery_categories/festyny/` |

### 4. Image URLs

**Source:** `layouts/partials/responsive-image.html`

**Resolution Logic (Processed Images):**

```go
{{ $image := resources.Get "images/photo.jpg" }}
{{ $resized := $image.Resize "800x600" }}

{{/* Processed image with fingerprint */}}
<img src="{{ $resized.RelPermalink }}" alt="Photo">

{{/* Result: /wesole_nutki/images/photo_800x600_abc123def456.jpg */}}
```

**Resolution Logic (Static Images):**

```go
{{/* Static image from content or static folder */}}
{{ $src := .Params.featured_image }}
<img src="{{ $src | relURL }}" alt="{{ .Title }}">

{{/* Result: /wesole_nutki/uploads/news/photo.jpg */}}
```

**Image URL Types:**

| Image Source | Function | Output Example |
|--------------|----------|----------------|
| Hugo Resource (processed) | `.RelPermalink` | `/wesole_nutki/images/hero_1200x800_a1b2c3.jpg` |
| Static folder | `relURL` | `/wesole_nutki/images/logo.png` |
| Content folder (page bundle) | `.RelPermalink` | `/wesole_nutki/pl/news/article/photo.jpg` |
| External CDN | Use as-is | `https://cdn.example.com/image.jpg` |

**Responsive Image Srcset:**

```go
{{ $widths := slice 400 800 1200 1600 }}
{{ range $widths }}
  {{ $resized := $image.Resize (printf "%dx" .) }}
  {{ $srcsetOriginal = $srcsetOriginal | append (printf "%s %dw" $resized.RelPermalink .) }}
{{ end }}

<img
  src="{{ $image.RelPermalink }}"
  srcset="{{ delimit $srcsetOriginal ", " }}"
  sizes="(max-width: 768px) 100vw, 800px"
>

{{/* Result srcset:
/wesole_nutki/images/photo_400x_hash.jpg 400w,
/wesole_nutki/images/photo_800x_hash.jpg 800w,
/wesole_nutki/images/photo_1200x_hash.jpg 1200w
*/}}
```

### 5. Asset URLs (CSS, JavaScript)

**Source:** `layouts/partials/head.html`, `layouts/_default/baseof.html`

**Resolution Logic:**

```go
{{/* CSS Bundle with integrity */}}
{{ $styles := resources.Get "scss/main.scss"
  | resources.ToCSS
  | resources.Minify
  | resources.Fingerprint }}

<link
  rel="stylesheet"
  href="{{ $styles.RelPermalink }}"
  integrity="{{ $styles.Data.Integrity }}"
  crossorigin="anonymous"
>

{{/* Result:
href="/wesole_nutki/css/main.min.abc123def456.css"
integrity="sha256-..."
*/}}
```

**Why `.RelPermalink` for Assets:**
1. Enables Subresource Integrity (SRI)
2. Adds content-based fingerprinting for cache busting
3. Required for Hugo Pipes processed files
4. Works with subdirectory deployments

**Asset URL Examples:**

| Asset Type | Processing | Resolved URL |
|------------|------------|--------------|
| SCSS → CSS | Compile, minify, fingerprint | `/wesole_nutki/css/main.min.a1b2c3.css` |
| JS Bundle | Bundle, minify, fingerprint | `/wesole_nutki/js/main.min.d4e5f6.js` |
| Favicon (static) | None | `/wesole_nutki/favicon.svg` |
| Web Manifest | Process | `/wesole_nutki/site.webmanifest` |

### 6. SEO and Social Media URLs

**Source:** `layouts/partials/head.html`

**Canonical URL:**

```go
{{ $canonicalURL := .Permalink }}
{{ with .Params.canonical }}
  {{ $canonicalURL = . | absURL }}
{{ end }}
<link rel="canonical" href="{{ $canonicalURL }}">

{{/* Result: https://wesolenutkiprzemysl.pl/wesole_nutki/pl/news/article/ */}}
```

**Open Graph URLs:**

```go
<meta property="og:url" content="{{ .Permalink }}">
<meta property="og:image" content="{{ .Params.image | absURL }}">

{{/* Results:
og:url = "https://wesolenutkiprzemysl.pl/wesole_nutki/pl/news/article/"
og:image = "https://wesolenutkiprzemysl.pl/wesole_nutki/images/og-image.jpg"
*/}}
```

**Language Alternates:**

```go
{{ range .Translations }}
  <link rel="alternate" hreflang="{{ .Lang }}" href="{{ .Permalink }}">
{{ end }}
<link rel="alternate" hreflang="{{ .Lang }}" href="{{ .Permalink }}">

{{/* Result:
<link rel="alternate" hreflang="pl" href="https://.../wesole_nutki/pl/news/article/">
<link rel="alternate" hreflang="en" href="https://.../wesole_nutki/en/news/article/">
*/}}
```

**Why Absolute URLs for SEO:**
- Search engines require absolute URLs for canonical links
- Social media platforms need absolute image URLs
- Language alternates must be fully qualified
- External tools (validators, crawlers) expect absolute URLs

### 7. Language Switcher

**Source:** `layouts/partials/language-switcher.html`

**Resolution Logic:**

```go
{{ $targetLang := "en" }}
{{ $targetURL := "" }}

{{/* Try to find translated version of current page */}}
{{ if .IsTranslated }}
  {{ range .Translations }}
    {{ if eq .Lang $targetLang }}
      {{ $targetURL = .Permalink }}
    {{ end }}
  {{ end }}
{{ end }}

{{/* Fallback to language home if no translation exists */}}
{{ if not $targetURL }}
  {{ $targetURL = $targetLang | absLangURL }}
{{ end }}

<a href="{{ $targetURL }}" hreflang="{{ $targetLang }}">
  {{ $targetLang | upper }}
</a>
```

**Resolution Flow:**
1. Check if current page has translation → Use `.Permalink` of translated page
2. No translation exists → Fall back to language home using `absLangURL`
3. Always uses absolute URLs for language switching

**Examples:**

| Current Page | Target Language | Resolved URL |
|--------------|-----------------|--------------|
| `/wesole_nutki/pl/about/` | English (has translation) | `https://.../wesole_nutki/en/about/` |
| `/wesole_nutki/pl/news/local-event/` | English (no translation) | `https://.../wesole_nutki/en/` |
| `/wesole_nutki/en/programs/` | Polish (has translation) | `https://.../wesole_nutki/pl/programs/` |

### 8. Breadcrumb Navigation

**Source:** `layouts/partials/breadcrumb.html`

**Resolution Logic:**

```go
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    {{/* Home breadcrumb */}}
    <li><a href="{{ .Site.Home.RelPermalink }}">{{ i18n "home" }}</a></li>

    {{/* Ancestor pages */}}
    {{ range .Ancestors.Reverse }}
      <li><a href="{{ .RelPermalink }}">{{ .Title }}</a></li>
    {{ end }}

    {{/* Current page (no link) */}}
    <li class="active" aria-current="page">{{ .Title }}</li>
  </ol>
</nav>
```

**Resolved URLs:**

| Breadcrumb Level | Hugo Function | Resolved URL |
|------------------|---------------|--------------|
| Home | `.Site.Home.RelPermalink` | `/wesole_nutki/pl/` |
| Section (News) | `.RelPermalink` | `/wesole_nutki/pl/news/` |
| Subsection | `.RelPermalink` | `/wesole_nutki/pl/news/category/` |
| Current Page | No link | - |

### 9. Footer Links

**Source:** `layouts/partials/footer.html`

**Resolution Logic:**

```go
{{/* Menu-based links */}}
{{ range .site.Data.footer_menu.items }}
  {{ $linkHref := .url | relURL }}
  <a href="{{ $linkHref }}">{{ .name }}</a>
{{ end }}

{{/* Direct page links */}}
{{ with .Site.GetPage "/about" }}
  <a href="{{ .RelPermalink }}">{{ .Title }}</a>
{{ end }}
```

**Resolution Strategies:**

| Link Source | Method | Example |
|-------------|--------|---------|
| Data file (footer menu) | `relURL` | `/wesole_nutki/privacy-policy/` |
| Hugo page object | `.RelPermalink` | `/wesole_nutki/pl/contact/` |
| External link | Use as-is | `https://facebook.com/page` |

---

## Implementation Details

### URL Processing Pipeline

**Step-by-Step URL Resolution:**

```
1. URL Input
   ↓
2. Type Detection (absolute, relative, anchor, protocol, empty)
   ↓
3. External Check (same domain = internal, different = external)
   ↓
4. Language Context (current language, translations)
   ↓
5. Base Path Application (subdirectory prefix)
   ↓
6. Hugo Function Application (relURL, absURL, relLangURL, etc.)
   ↓
7. Output URL
```

### String Manipulation Before URL Functions

**Current Pattern in Menus:**

```go
{{ $menuURL := .url }}
{{ $navHref := strings.TrimPrefix "/" $menuURL | relURL }}
```

**Why TrimPrefix is Used:**
- Menu data includes leading slash: `/pl/about/`
- Hugo's `relURL` expects path without leading slash
- TrimPrefix removes `/` → `pl/about/`
- relURL adds base path → `/wesole_nutki/pl/about/`

**Alternative (Better) Pattern:**

```go
{{ $menuURL := .url }}
{{ $navHref := $menuURL | relURL }}
```

**Note:** Modern Hugo's `relURL` handles leading slashes correctly, so TrimPrefix may be unnecessary.

### BaseURL Path Extraction

```go
{{/* Extract subdirectory from baseURL */}}
{{ $basePath := strings.TrimSuffix "/" site.BaseURL | path.Base }}
{{/* Result: "wesole_nutki" */}}

{{/* Use for URL comparison */}}
{{ $pageURLClean := strings.TrimPrefix (printf "/%s" $basePath) $pageURL }}
```

**Purpose:** Compare page URLs to menu URLs without baseURL path prefix

---

## Resolution Flow Diagrams

### 1. Navigation Link Resolution

```
Menu Data URL: "/pl/about/"
        ↓
   TrimPrefix "/"
        ↓
    "pl/about/"
        ↓
     relURL
        ↓
"/wesole_nutki/pl/about/"
```

### 2. Page Content Link Resolution

```
Page Object: .Page
        ↓
  .RelPermalink
        ↓
"/wesole_nutki/pl/news/article/"
```

### 3. Image Asset Resolution

```
Image Path: "images/photo.jpg"
        ↓
  resources.Get
        ↓
   .Resize "800x"
        ↓
  .RelPermalink
        ↓
"/wesole_nutki/images/photo_800x_abc123.jpg"
```

### 4. Static Asset Resolution

```
Asset Path: "images/logo.png"
        ↓
     relURL
        ↓
"/wesole_nutki/images/logo.png"
```

### 5. SEO Canonical URL Resolution

```
Page Object: .Page
        ↓
   .Permalink
        ↓
"https://wesolenutkiprzemysl.pl/wesole_nutki/pl/news/article/"
```

### 6. Language Switcher Resolution

```
Current Page: /wesole_nutki/pl/about/
Target Language: en
        ↓
  Check .IsTranslated
        ↓
   Translation Found?
   ├─ Yes → .Permalink of translation
   │         ↓
   │  "https://.../wesole_nutki/en/about/"
   │
   └─ No  → absLangURL fallback
             ↓
      "https://.../wesole_nutki/en/"
```

---

## Special Cases and Edge Handling

### 1. External URLs

**Detection:**

```go
{{ $isExternal := or
  (hasPrefix $url "http://")
  (hasPrefix $url "https://")
  (hasPrefix $url "//") }}

{{ if $isExternal }}
  <a href="{{ $url }}" rel="noopener noreferrer" target="_blank">
    Link
  </a>
{{ end }}
```

**Attributes Added:**
- `rel="noopener noreferrer"` - Security measure
- `target="_blank"` - Open in new tab (optional, based on menu config)
- External icon indicator (visual feedback)

### 2. Anchor Links

**Detection and Usage:**

```go
{{ if hasPrefix $url "#" }}
  <a href="{{ $url }}">{{ .name }}</a>
{{ end }}
```

**Examples:**
- `#contact` - Scroll to contact section
- `#` - Scroll to top / placeholder link
- `#features` - Jump to features section

**Note:** Anchor links are used as-is without URL processing

### 3. Special Protocols

**Mail Links:**

```go
{{ $email := site.Params.email }}
<a href="mailto:{{ $email }}">{{ $email }}</a>
```

**Phone Links:**

```go
{{ $phone := site.Params.phone }}
<a href="tel:{{ $phone }}">{{ $phone }}</a>
```

**Other Protocols:**
- `javascript:` - JavaScript execution (generally avoided for security)
- `data:` - Data URLs (base64 encoded content)
- `ftp:` - FTP links (rare in modern sites)

### 4. Empty/Missing URLs

**Handling:**

```go
{{ with .url }}
  <a href="{{ . | relURL }}">{{ $.name }}</a>
{{ else }}
  <span class="no-link">{{ .name }}</span>
{{ end }}
```

**Purpose:** Graceful degradation when menu items don't have URLs

### 5. Pagination URLs

**Source:** `layouts/partials/pagination.html`

**Resolution:**

```go
<nav aria-label="Page navigation">
  <ul class="pagination">
    {{ with $paginator.Prev }}
      <li><a href="{{ .URL }}">Previous</a></li>
    {{ end }}

    {{ range $paginator.Pagers }}
      <li><a href="{{ .URL }}">{{ .PageNumber }}</a></li>
    {{ end }}

    {{ with $paginator.Next }}
      <li><a href="{{ .URL }}">Next</a></li>
    {{ end }}
  </ul>
</nav>
```

**Why Direct `.URL` Usage:**
- Hugo's paginator provides pre-resolved URLs
- URLs already include baseURL path and language prefix
- No additional processing needed

**Resolved URLs:**
- Page 1: `/wesole_nutki/pl/news/`
- Page 2: `/wesole_nutki/pl/news/page/2/`
- Page 3: `/wesole_nutki/pl/news/page/3/`

### 6. Sitemap and RSS URLs

**Hugo Automatically Generates:**
- Sitemap: `/wesole_nutki/sitemap.xml`
- RSS Feeds: `/wesole_nutki/pl/news/index.xml`
- Robots.txt: `/wesole_nutki/robots.txt`

**All use absolute URLs internally for SEO purposes**

---

## Testing and Validation

### 1. Development Testing

**Command:**
```bash
hugo server --baseURL="http://localhost:1313/"
```

**Verify:**
- ✅ All navigation links work
- ✅ Images load correctly
- ✅ CSS/JS assets load with integrity
- ✅ Language switcher maintains context
- ✅ Breadcrumbs show correct hierarchy
- ✅ Menu active states highlight properly

### 2. Production Build Testing

**Command:**
```bash
hugo --baseURL="https://wesolenutkiprzemysl.pl/wesole_nutki/" --minify
```

**Verify:**
- ✅ All URLs include `/wesole_nutki/` prefix
- ✅ Canonical URLs are absolute
- ✅ Open Graph URLs are absolute
- ✅ Internal links are relative
- ✅ Asset fingerprints are generated
- ✅ Language alternates are correct

### 3. URL Structure Validation

**Test Cases:**

| Link Type | Expected Pattern | Test Method |
|-----------|------------------|-------------|
| Internal page | `/wesole_nutki/pl/about/` | Check href attribute |
| External link | `https://external.com` | Check href + rel attribute |
| Anchor | `#section` | Check href starts with # |
| Image | `/wesole_nutki/images/photo.jpg` | Check src attribute |
| CSS | `/wesole_nutki/css/main.min.abc.css` | Check href + integrity |
| Canonical | Absolute URL with baseURL | Check canonical link tag |
| Open Graph | Absolute URL with baseURL | Check og:url meta tag |

### 4. Multi-Language Testing

**Test Scenarios:**

1. **Navigation across languages:**
   - Switch from Polish to English
   - Verify URL changes to `/en/` equivalent
   - Check fallback to language home if no translation

2. **Language-specific taxonomies:**
   - Polish category: `/wesole_nutki/pl/categories/wydarzenia/`
   - English category: `/wesole_nutki/en/categories/events/`

3. **Language alternates in head:**
   ```html
   <link rel="alternate" hreflang="pl" href="https://.../wesole_nutki/pl/about/">
   <link rel="alternate" hreflang="en" href="https://.../wesole_nutki/en/about/">
   ```

### 5. SEO Validation Tools

**Recommended Tools:**

1. **Google Rich Results Test**
   - https://search.google.com/test/rich-results
   - Validates structured data and canonical URLs

2. **Facebook Sharing Debugger**
   - https://developers.facebook.com/tools/debug/
   - Validates og:url and og:image (must be absolute)

3. **Twitter Card Validator**
   - https://cards-dev.twitter.com/validator
   - Validates Twitter Card metadata

4. **LinkedIn Post Inspector**
   - https://www.linkedin.com/post-inspector/
   - Validates LinkedIn sharing metadata

### 6. Automated Testing

**Playwright Tests:**

```typescript
// tests/internal-navigation-links.spec.ts
test('internal links use relative URLs with baseURL', async ({ page }) => {
  await page.goto('/pl/');

  const navLinks = page.locator('nav a[href^="/wesole_nutki/"]');
  expect(await navLinks.count()).toBeGreaterThan(0);

  const firstLink = await navLinks.first().getAttribute('href');
  expect(firstLink).toMatch(/^\/wesole_nutki\//);
});

// tests/url-seo-integration.spec.ts
test('canonical URLs are absolute', async ({ page }) => {
  await page.goto('/pl/about/');

  const canonical = page.locator('link[rel="canonical"]');
  const href = await canonical.getAttribute('href');

  expect(href).toMatch(/^https:\/\//);
  expect(href).toContain('/wesole_nutki/');
});
```

**Coverage:**
- Navigation link structure
- Image URL patterns
- Asset fingerprinting
- SEO meta tag URLs
- Language switcher behavior
- Breadcrumb hierarchy
- External link attributes

---

## Summary

### URL Resolution Principles

1. **Context-Aware:** Different strategies for navigation, SEO, assets, and social media
2. **Multilingual:** Language prefixes and translation-aware switching
3. **Subdirectory Safe:** All URLs work with `/wesole_nutki/` base path
4. **SEO Optimized:** Absolute URLs for meta tags, relative for internal links
5. **Cache-Friendly:** Asset fingerprinting for efficient caching
6. **Type-Safe:** URL type detection prevents incorrect processing

### Key Functions Reference

| Function | Returns | Use For |
|----------|---------|---------|
| `.Permalink` | Absolute URL | SEO, social media, language alternates |
| `.RelPermalink` | Relative URL | Internal links, processed assets |
| `relURL` | Relative URL | Static assets, simple paths |
| `absURL` | Absolute URL | Meta tag images |
| `relLangURL` | Relative + Lang | Language-aware sections |
| `absLangURL` | Absolute + Lang | Language home fallback |
| `urlize` | Sanitized string | Taxonomy names in URLs |

### Best Practices Followed

✅ `canonifyURLs = false` - Let Hugo functions handle URLs
✅ Use `.RelPermalink` for page links
✅ Use `relURL` for static assets
✅ Use `.Permalink` for SEO metadata
✅ Use `absURL` for social media images
✅ URL type detection before processing
✅ Graceful fallbacks for missing translations
✅ Subresource integrity for processed assets
✅ Language-aware taxonomy URLs
✅ Structured breadcrumb navigation

---

**Document Version:** 1.0
**Last Updated:** 2026-01-26
**Maintained By:** Development Team
**Related Docs:**
- `URL_FUNCTION_AUDIT.md` - Comprehensive function usage audit
- `URL_FUNCTION_USAGE_GUIDE.md` - Developer quick reference
- `.automaker/features/url-configuration/audit-report.md` - Compliance audit
