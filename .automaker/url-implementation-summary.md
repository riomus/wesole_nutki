# Hugo URL Configuration Implementation Summary

## Date: 2026-01-26

## Overview
Comprehensive audit and implementation of Hugo URL best practices for the Wesole Nutki preschool website, ensuring proper URL generation for subdirectory deployment (`/wesole_nutki/`), multi-language support, and SEO requirements.

## Key Findings

### Pre-Implementation Status
The Hugo site was **already following Hugo URL best practices** in most templates:
- ✅ `.Permalink` used for absolute URLs (canonical, og:url, social sharing)
- ✅ `.RelPermalink` used for internal page links and processed resources
- ✅ `absURL` used for static assets in Open Graph/Twitter meta tags
- ✅ `relURL` used for static assets and navigation
- ✅ `relLangURL` used for multi-language internal links
- ✅ `canonifyURLs = false` (best practice configuration)

### Issues Identified and Fixed

#### Issue #1: Open Graph Image URLs Missing Subdirectory
**Problem:** Open Graph (`og:image`) and Twitter Card (`twitter:image`) URLs were not including the `/wesole_nutki/` subdirectory when image paths started with `/`.

**Example:**
- **Before:** `https://bartusiak.ai/images/news/zimowe-zabawy.jpg`
- **After:** `https://bartusiak.ai/wesole_nutki/images/news/zimowe-zabawy.jpg` ✓

**Root Cause:** Hugo's `absURL` function has inconsistent behavior with subdirectory deployments when paths start with `/`. The function doesn't automatically prepend the baseURL subdirectory to root-relative paths.

**Solution Implemented:**
1. Strip leading `/` from image paths using `strings.TrimPrefix`
2. Apply `relURL` to add the subdirectory
3. Apply `absURL` to create the full absolute URL

**Code Change in `layouts/partials/head.html`:**
```hugo
{{/* Before */}}
{{ with $ogImage }}
<meta property="og:image" content="{{ . | absURL }}">
{{ end }}

{{/* After */}}
{{ with $ogImage }}
{{/* Ensure subdirectory is included: strip leading slash, then apply relURL and absURL */}}
{{ $imageURL := . }}
{{ if hasPrefix $imageURL "/" }}{{ $imageURL = strings.TrimPrefix "/" $imageURL }}{{ end }}
<meta property="og:image" content="{{ $imageURL | relURL | absURL }}">
{{ end }}
```

#### Issue #2: Missing Support for `images` Array in Front Matter
**Problem:** News articles using the `images` array parameter weren't having their first image extracted for Open Graph tags.

**Solution:** Added support for extracting the first image from the `images` array parameter, with support for both object format (`{url: "...", alt: "..."}`) and string format.

**Code Change in `layouts/partials/head.html`:**
```hugo
{{/* Added this cascading check */}}
{{ if not $ogImage }}{{ with .Params.images }}{{ if gt (len .) 0 }}{{ $firstImage := index . 0 }}{{ if reflect.IsMap $firstImage }}{{ $ogImage = $firstImage.url }}{{ else }}{{ $ogImage = $firstImage }}{{ end }}{{ end }}{{ end }}{{ end }}
```

## Files Modified

### 1. `layouts/partials/head.html`
- **Lines 113-120:** Added support for extracting images from `images` array parameter
- **Lines 189-193:** Fixed og:image URL to strip leading slash and apply relURL + absURL
- **Lines 226-230:** Fixed twitter:image URL with same pattern

## Verification Results

### Production Build Test
```bash
hugo --gc --minify
# Results: 81 pages (PL) + 69 pages (EN) = 150 pages built successfully
# Build time: ~900ms
```

### URL Verification

#### Homepage (public/pl/index.html)
```html
<link rel="canonical" href="https://bartusiak.ai/wesole_nutki/pl/">
<meta property="og:url" content="https://bartusiak.ai/wesole_nutki/pl/">
<meta property="og:image" content="https://bartusiak.ai/wesole_nutki/images/og-default.jpg">
<meta name="twitter:image" content="https://bartusiak.ai/wesole_nutki/images/og-default.jpg">
```
✅ All URLs correctly include `/wesole_nutki/` subdirectory

#### News Article (public/pl/news/2025/01/zimowe-zabawy-na-śniegu/index.html)
```html
<link rel="canonical" href="https://bartusiak.ai/wesole_nutki/pl/news/2025/01/zimowe-zabawy-na-śniegu/">
<meta property="og:url" content="https://bartusiak.ai/wesole_nutki/pl/news/2025/01/zimowe-zabawy-na-śniegu/">
<meta property="og:image" content="https://bartusiak.ai/wesole_nutki/images/news/zimowe-zabawy.jpg">
<meta name="twitter:image" content="https://bartusiak.ai/wesole_nutki/images/news/zimowe-zabawy.jpg">
```
✅ All URLs correctly include `/wesole_nutki/` subdirectory

## Template Audit Summary

All audited templates are following Hugo URL best practices:

### Core Templates ✅
- `layouts/_default/baseof.html` - Uses `.RelPermalink` for JS bundles
- `layouts/partials/head.html` - Uses `.Permalink`, `absURL`, `relURL` correctly
- `layouts/partials/header.html` - Uses `.RelPermalink`, `relURL` for navigation
- `layouts/partials/footer.html` - Uses `relURL` for footer links
- `layouts/partials/breadcrumb.html` - Uses `.RelPermalink`, `relURL`, `absURL` (JSON-LD)

### Content Partials ✅
- `layouts/partials/social-share.html` - Uses `.Permalink` for sharing (absolute URLs needed)
- `layouts/partials/news-card.html` - Uses `.RelPermalink`, `relURL`
- `layouts/partials/responsive-image.html` - Uses `.RelPermalink` for processed images, `relURL` for fallbacks
- `layouts/partials/program-card.html` - Uses `.RelPermalink`

### Homepage Partials ✅
- `layouts/partials/homepage/hero.html` - Uses `relURL`
- `layouts/partials/homepage/recruitment.html` - Uses `relURL`

### Gallery Templates ✅
- `layouts/gallery/single.html` - Uses `relURL`, `.RelPermalink`, `relLangURL`
- `layouts/shortcodes/gallery.html` - Uses `relURL`, `.RelPermalink`

### List and Single Pages ✅
- `layouts/_default/list.html` - Uses `.RelPermalink`
- `layouts/_default/single.html` - Uses `.RelPermalink`, `relLangURL`
- `layouts/news/single.html` - Uses `.RelPermalink`, `relLangURL`

## Best Practices Applied

### 1. Canonical URLs
```hugo
<link rel="canonical" href="{{ $canonicalURL }}">
<!-- $canonicalURL uses .Permalink for absolute URL -->
```

### 2. Open Graph URLs
```hugo
<meta property="og:url" content="{{ $pagePermalink }}">
<!-- Uses .Permalink cached for reuse -->
```

### 3. Image URLs in Meta Tags
```hugo
{{/* Strip leading slash, apply relURL then absURL */}}
{{ $imageURL := . }}
{{ if hasPrefix $imageURL "/" }}{{ $imageURL = strings.TrimPrefix "/" $imageURL }}{{ end }}
<meta property="og:image" content="{{ $imageURL | relURL | absURL }}">
```

### 4. Internal Navigation Links
```hugo
<a href="{{ .RelPermalink }}">{{ .Title }}</a>
<!-- Uses .RelPermalink for page resources -->
```

### 5. Static Assets
```hugo
<img src="{{ $imagePath | relURL }}" alt="...">
<!-- Uses relURL for static assets -->
```

### 6. Processed Resources
```hugo
{{ $js = $js | fingerprint "sha256" }}
<script src="{{ $js.RelPermalink }}" integrity="{{ $js.Data.Integrity }}">
<!-- Uses .RelPermalink for Hugo-processed resources -->
```

### 7. Multi-language Links
```hugo
<a href="{{ "news" | relLangURL }}">All News</a>
<!-- Uses relLangURL for language-aware links -->
```

## Configuration

### Hugo Configuration (`hugo.toml`)
```toml
baseURL = "https://bartusiak.ai/wesole_nutki/"
canonifyURLs = false  # Best practice for Hugo 0.60+
defaultContentLanguageInSubdir = true
```

### Benefits of `canonifyURLs = false`
1. ✅ Templates have explicit control over URL generation
2. ✅ Supports flexible deployment (root domain, subdirectory, CDN)
3. ✅ Better performance (Hugo doesn't rewrite all URLs at build time)
4. ✅ Easier debugging (URL generation is explicit in templates)

## Success Metrics

- ✅ All canonical URLs use `.Permalink` and generate absolute URLs with correct baseURL
- ✅ All Open Graph and Twitter Card URLs use absolute paths and include subdirectory
- ✅ All internal navigation links use `.RelPermalink` or `relURL`
- ✅ All asset references (CSS, JS, images) use appropriate URL functions
- ✅ No hardcoded domain URLs or paths exist in templates
- ✅ Production build generates correct URLs for subdirectory deployment
- ✅ Multi-language URLs maintain correct language prefixes

## Deployment Compatibility

The implementation correctly supports:
- ✅ Subdirectory deployment (`/wesole_nutki/`)
- ✅ Multi-language sites (`/pl/`, `/en/`)
- ✅ Asset fingerprinting with integrity hashes
- ✅ Responsive images with srcset
- ✅ SEO meta tags (canonical, Open Graph, Twitter Cards)
- ✅ Social media sharing (absolute URLs)
- ✅ JSON-LD structured data (absolute URLs)

## Conclusion

The Hugo site was already following best practices with only one critical issue: Open Graph images not including the subdirectory prefix. This has been fixed by preprocessing image paths to strip leading slashes before applying `relURL` and `absURL`.

All URL generation now follows Hugo best practices and correctly handles:
- Subdirectory deployments
- Multi-language content
- SEO requirements
- Social media sharing
- Asset optimization

No further URL-related changes are required.
