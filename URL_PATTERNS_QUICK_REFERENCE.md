# URL Patterns Quick Reference

**Quick reference guide for URL function usage in Wesołe Nutki Hugo site**

## URL Function Summary

| Function | Count | Primary Use Case |
|----------|-------|------------------|
| `relLangURL` | 28 | Multilingual content section links |
| `.Permalink` | 25 | Page-to-page navigation |
| `.RelPermalink` | 19 | Processed resources (images, CSS, JS) |
| `relURL` | 18 | Static assets, simple relative URLs |
| `urlize` | 9 | Taxonomy URL sanitization |
| `absURL` | 6 | SEO metadata, social sharing |
| `absLangURL` | 5 | Multilingual SEO, language alternates |

**Total:** 110 occurrences across 30 template files

---

## Common URL Patterns

### 1. Section Navigation (Multilingual)
```html
<!-- Link to section -->
<a href="{{ "news" | relLangURL }}">News</a>
<a href="{{ "gallery" | relLangURL }}">Gallery</a>
<a href="{{ "programs" | relLangURL }}">Programs</a>
```

### 2. Taxonomy URLs
```html
<!-- Category link -->
{{ printf "categories/%s" (urlize $categoryName) | relLangURL }}

<!-- Tag link -->
{{ printf "tags/%s" (urlize $tagName) | relLangURL }}

<!-- Gallery category -->
{{ printf "gallery_categories/%s" (urlize $categoryName) | relLangURL }}
```

### 3. Page Links
```html
<!-- Standard page link -->
<a href="{{ .Permalink }}">{{ .Title }}</a>

<!-- Homepage -->
<a href="{{ .Site.Home.Permalink }}">Home</a>
```

### 4. Processed Images
```html
<!-- Single image -->
<img src="{{ $image.RelPermalink }}" alt="{{ .Title }}">

<!-- Responsive srcset -->
<source srcset="{{ $webp.RelPermalink }} {{ $width }}w">
```

### 5. Static Assets
```html
<!-- CSS/JS (processed with fingerprinting) -->
<link rel="stylesheet" href="{{ $style.RelPermalink }}" integrity="{{ $style.Data.Integrity }}">

<!-- Favicon (static) -->
<link rel="icon" href="{{ "favicon.svg" | relURL }}">
```

### 6. Menu Links (with data preprocessing)
```html
<!-- Remove leading slash before relURL -->
<a href="{{ strings.TrimPrefix "/" .url | relURL }}">{{ .name }}</a>
```

### 7. SEO Metadata
```html
<!-- Canonical URL -->
<link rel="canonical" href="{{ .Permalink }}">

<!-- Open Graph -->
<meta property="og:url" content="{{ .Permalink }}">
<meta property="og:image" content="{{ .Params.og_image | absURL }}">

<!-- Language alternates -->
<link rel="alternate" hreflang="{{ .Lang }}" href="{{ .Lang | absLangURL }}">
```

### 8. Language Switching
```html
<!-- Find translated page or fallback to language home -->
{{ $targetURL := "" }}
{{ if .IsTranslated }}
  {{ range .Translations }}
    {{ if eq .Lang $targetLang }}
      {{ $targetURL = .Permalink }}
    {{ end }}
  {{ end }}
{{ end }}
{{ if not $targetURL }}
  {{ $targetURL = $targetLang | absLangURL }}
{{ end }}
<a href="{{ $targetURL }}" hreflang="{{ $targetLang }}">
```

---

## Decision Tree

### "Which URL function should I use?"

```
┌─ Need to link to something?
│
├─ Is it a Hugo page/content?
│  └─ Use: .Permalink
│
├─ Is it a section or taxonomy?
│  ├─ Multilingual site?
│  │  └─ Use: relLangURL (or absLangURL for SEO)
│  └─ Single language?
│     └─ Use: relURL (or absURL for external/email)
│
├─ Is it a processed resource (Hugo Pipes)?
│  └─ Use: .RelPermalink (enables SRI, fingerprinting)
│
├─ Is it a static asset?
│  └─ Use: relURL (or absURL if needed outside site context)
│
└─ Is it a user-generated string that needs to be URL-safe?
   └─ Use: urlize (then pipe to appropriate URL function)
```

---

## Files by Function Category

### Navigation & Menus
- `layouts/partials/header.html` - Main navigation, logo
- `layouts/partials/footer.html` - Footer navigation
- `layouts/partials/breadcrumb.html` - Breadcrumb trail
- `layouts/partials/pagination.html` - Page pagination
- `layouts/partials/language-switcher.html` - Language toggle

### Content Display
- `layouts/partials/news-card.html` - News item card
- `layouts/partials/gallery-card.html` - Gallery item card
- `layouts/partials/program-card.html` - Program card
- `layouts/partials/related-posts.html` - Related content

### Filtering & Taxonomies
- `layouts/partials/news-category-filter.html` - News category filter
- `layouts/partials/news-tag-filter.html` - News tag filter
- `layouts/partials/gallery-category-filter.html` - Gallery category filter

### Images & Media
- `layouts/partials/responsive-image.html` - Responsive image component
- `layouts/shortcodes/gallery.html` - Gallery shortcode

### SEO & Metadata
- `layouts/partials/head.html` - HTML head with SEO metadata
- `layouts/partials/social-share.html` - Social media sharing

### Page Types
- `layouts/_default/single.html` - Default single page
- `layouts/_default/list.html` - Default list page
- `layouts/news/single.html` - News article page
- `layouts/gallery/single.html` - Gallery page
- `layouts/programs/single.html` - Program page
- `layouts/documents/list.html` - Documents listing

---

## Testing Checklist

### URL Generation
- [ ] Homepage loads with correct assets
- [ ] Navigation menu links work (all languages)
- [ ] Active menu state highlights correctly
- [ ] Footer links work
- [ ] Language switcher maintains page context

### Content URLs
- [ ] News articles link correctly
- [ ] Gallery items link correctly
- [ ] Program pages link correctly
- [ ] Category filter links work
- [ ] Tag filter links work
- [ ] Pagination links work

### Assets & Media
- [ ] Responsive images load all srcset variants
- [ ] WebP format serves with fallback
- [ ] CSS loads with SRI integrity
- [ ] JavaScript loads with SRI integrity
- [ ] Favicon displays correctly

### SEO & Metadata
- [ ] Canonical URLs are correct
- [ ] Open Graph URLs work
- [ ] Twitter Card URLs work
- [ ] Language alternate links are correct
- [ ] Sitemap URLs are valid

### Special Cases
- [ ] 404 page links work
- [ ] Breadcrumbs display correct URLs
- [ ] Social sharing includes correct URLs
- [ ] Document downloads work
- [ ] Gallery shortcode lightbox URLs work

---

## Common Pitfalls & Solutions

### ❌ Problem: Double slashes in URLs
**Cause:** Adding leading slash when data already has it
**Solution:**
```html
<!-- ❌ Wrong -->
<a href="{{ .url | relURL }}">  <!-- if .url = "/about/" -->

<!-- ✅ Right -->
<a href="{{ strings.TrimPrefix "/" .url | relURL }}">
```

### ❌ Problem: Category URLs with special characters break
**Cause:** Not sanitizing category names
**Solution:**
```html
<!-- ❌ Wrong -->
<a href="{{ printf "categories/%s" $name | relLangURL }}">

<!-- ✅ Right -->
<a href="{{ printf "categories/%s" (urlize $name) | relLangURL }}">
```

### ❌ Problem: Language context lost when linking
**Cause:** Using `relURL` instead of `relLangURL`
**Solution:**
```html
<!-- ❌ Wrong (on multilingual site) -->
<a href="{{ "news" | relURL }}">  <!-- always goes to /news/ -->

<!-- ✅ Right -->
<a href="{{ "news" | relLangURL }}">  <!-- goes to /pl/news/ or /en/news/ -->
```

### ❌ Problem: Images not loading in srcset
**Cause:** Using `.Permalink` instead of `.RelPermalink` for resources
**Solution:**
```html
<!-- ❌ Wrong -->
<img srcset="{{ $resized.Permalink }} 600w">

<!-- ✅ Right -->
<img srcset="{{ $resized.RelPermalink }} 600w">
```

### ❌ Problem: Subresource Integrity (SRI) not working
**Cause:** Using `relURL` instead of `.RelPermalink` for processed assets
**Solution:**
```html
<!-- ❌ Wrong -->
<link rel="stylesheet" href="{{ $style | relURL }}">

<!-- ✅ Right -->
<link rel="stylesheet" href="{{ $style.RelPermalink }}" integrity="{{ $style.Data.Integrity }}">
```

---

## URL Examples by Section

### News Section
```html
<!-- News list -->
/pl/news/ or /en/news/

<!-- News article -->
/pl/news/article-slug/ or /en/news/article-slug/

<!-- News category -->
/pl/categories/wydarzenia/ or /en/categories/events/

<!-- News tag -->
/pl/tags/tag-name/ or /en/tags/tag-name/
```

### Gallery Section
```html
<!-- Gallery list -->
/pl/gallery/ or /en/gallery/

<!-- Gallery item -->
/pl/gallery/gallery-slug/ or /en/gallery/gallery-slug/

<!-- Gallery category -->
/pl/gallery_categories/wycieczki/ or /en/gallery_categories/trips/
```

### Programs Section
```html
<!-- Programs list -->
/pl/programs/ or /en/programs/

<!-- Program details -->
/pl/programs/program-slug/ or /en/programs/program-slug/

<!-- Schedule -->
/pl/programs/schedule/ or /en/programs/schedule/
```

### Static Pages
```html
<!-- About -->
/pl/about/ or /en/about/

<!-- Contact -->
/pl/contact/ or /en/contact/

<!-- Documents -->
/pl/documents/ or /en/documents/
```

---

## Quick Tips

### ✅ Always use `relLangURL` for multilingual content
This ensures language context is preserved.

### ✅ Use `.RelPermalink` for Hugo resources
Enables fingerprinting and SRI for security.

### ✅ Sanitize with `urlize` before creating taxonomy URLs
Prevents issues with special characters and spaces.

### ✅ Test language switching thoroughly
Verify fallback behavior when translations don't exist.

### ✅ Check both absolute and relative contexts
Some functions (SEO, email) need absolute URLs.

---

**Last Updated:** 2024
**Hugo Version:** 0.x+
**Site Type:** Multilingual (Polish/English)
