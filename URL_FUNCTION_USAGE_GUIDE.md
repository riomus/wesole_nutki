# Hugo URL Function Usage Reference Guide

**Wesołe Nutki Hugo Site - Developer Reference**
**Last Updated:** 2025-01-26
**Quick Start Guide for URL Function Usage**

---

## 📚 Table of Contents

1. [Quick Decision Tree](#quick-decision-tree)
2. [Function Reference](#function-reference)
3. [Common Patterns](#common-patterns)
4. [Known Issues & Fixes](#known-issues--fixes)
5. [Testing Checklist](#testing-checklist)
6. [Examples by Context](#examples-by-context)

---

## 🎯 Quick Decision Tree

**"Which URL function should I use?"**

```
┌─ What are you linking to?
│
├─ Hugo Page/Post Content?
│  └─ Use: .RelPermalink
│     Example: <a href="{{ .RelPermalink }}">{{ .Title }}</a>
│
├─ Section (news, gallery, programs)?
│  └─ Use: .Site.GetPage + .RelPermalink
│     Example: {{ with .Site.GetPage "/news" }}{{ .RelPermalink }}{{ end }}
│
├─ Taxonomy (category, tag)?
│  └─ Use: Taxonomy object + .Page.RelPermalink
│     Example: {{ with $.Site.Taxonomies.tags.Get $name }}{{ .Page.RelPermalink }}{{ end }}
│
├─ Processed Asset (CSS, JS, optimized image)?
│  └─ Use: .RelPermalink (enables SRI & fingerprinting)
│     Example: <link href="{{ $style.RelPermalink }}" integrity="{{ $style.Data.Integrity }}">
│
├─ Static Asset (logo, favicon)?
│  └─ Use: relURL
│     Example: <img src="{{ "images/logo.png" | relURL }}">
│
├─ SEO/Social Media (canonical, Open Graph)?
│  └─ Use: .Permalink (absolute URL)
│     Example: <meta property="og:url" content="{{ .Permalink }}">
│
└─ User-generated string needs URL-safe formatting?
   └─ Use: urlize (then apply appropriate URL function)
      Example: {{ printf "tags/%s" (urlize $tagName) | relLangURL }}
```

---

## 📖 Function Reference

### Core Functions

| Function | Type | Use Case | Example Output |
|----------|------|----------|----------------|
| `.Permalink` | Page Property | Absolute URLs for SEO, social sharing | `https://bartusiak.ai/wesole_nutki/pl/news/article/` |
| `.RelPermalink` | Page Property | **Preferred for internal links & assets** | `/pl/news/article/` |
| `relURL` | Function | Static assets, simple relative URLs | `/css/style.css` |
| `absURL` | Function | Force absolute URL for static assets | `https://bartusiak.ai/wesole_nutki/css/style.css` |
| `relLangURL` | Function | **Multilingual content sections** | `/pl/news/` or `/en/news/` |
| `absLangURL` | Function | Absolute multilingual URLs | `https://bartusiak.ai/wesole_nutki/pl/` |
| `urlize` | Function | Sanitize strings for URLs | `"Hello World"` → `"hello-world"` |

### Function Priority (Use in order)

1. **`.RelPermalink`** - Default for all internal content links
2. **`relLangURL`** - For section/taxonomy paths on multilingual sites
3. **`relURL`** - For static assets only
4. **`.Permalink`** - Only for SEO metadata (canonical, OG tags)
5. **`absURL`** - Rarely needed (email, external contexts)

---

## 🔧 Common Patterns

### 1. Page-to-Page Links

```html
<!-- ✅ CORRECT: Use .RelPermalink -->
<a href="{{ .RelPermalink }}">{{ .Title }}</a>

<!-- ❌ AVOID: .Permalink embeds base URL at build time -->
<a href="{{ .Permalink }}">{{ .Title }}</a>
```

**Why `.RelPermalink`?**
- Respects runtime `--baseURL` overrides
- Works with subdirectory deployments
- No unnecessary absolute URLs

---

### 2. Section Links (News, Gallery, Programs)

```html
<!-- ✅ CORRECT: Use GetPage + .RelPermalink -->
{{ with .Site.GetPage "/news" }}
  <a href="{{ .RelPermalink }}">{{ .Title }}</a>
{{ end }}

<!-- ❌ AVOID: Hard-coded string with relLangURL -->
<a href="{{ "news" | relLangURL }}">News</a>
```

**Why GetPage?**
- Uses Hugo's built-in routing
- Respects permalink configuration
- Returns localized section pages
- Breaks if section doesn't exist (safe failure)

---

### 3. Taxonomy Links (Categories, Tags)

```html
<!-- ✅ CORRECT: Use taxonomy object -->
{{ range .Params.tags }}
  {{ with $.Site.Taxonomies.tags.Get (. | urlize) }}
    <a href="{{ .Page.RelPermalink }}">{{ .Page.Title }}</a>
  {{ end }}
{{ end }}

<!-- ❌ AVOID: Manual URL construction -->
{{ range .Params.tags }}
  <a href="{{ printf "tags/%s" (urlize .) | relLangURL }}">{{ . }}</a>
{{ end }}
```

**Why taxonomy objects?**
- Hugo manages the URL structure
- Works with custom taxonomy permalinks
- Provides page object with metadata (count, title, etc.)

---

### 4. Menu Links (from data files)

```html
<!-- ✅ CORRECT: Simple pipe to relURL -->
{{ range site.Menus.main }}
  <a href="{{ .URL | relURL }}">{{ .Name }}</a>
{{ end }}

<!-- ❌ AVOID: Manual string manipulation -->
<a href="{{ strings.TrimPrefix "/" .url | relURL }}">{{ .name }}</a>
```

**Why avoid TrimPrefix?**
- `relURL` already handles leading slashes
- Adds unnecessary complexity
- Creates fragile code

---

### 5. Processed Images (Responsive Images)

```html
<!-- ✅ CORRECT: Use .RelPermalink for Hugo resources -->
{{ $image := resources.Get "images/photo.jpg" }}
{{ $resized := $image.Resize "800x600" }}
<img src="{{ $resized.RelPermalink }}" alt="Photo">

<!-- With srcset -->
<img
  src="{{ $resized.RelPermalink }}"
  srcset="{{ $small.RelPermalink }} 400w, {{ $large.RelPermalink }} 800w"
  sizes="(max-width: 600px) 400px, 800px"
>
```

**Why `.RelPermalink` for resources?**
- Enables Subresource Integrity (SRI)
- Includes content-based fingerprinting
- Required for Hugo Pipes processed files

---

### 6. CSS & JavaScript Assets

```html
<!-- ✅ CORRECT: Processed assets with integrity -->
{{ $styles := resources.Get "scss/main.scss" | resources.ToCSS | resources.Minify | resources.Fingerprint }}
<link
  rel="stylesheet"
  href="{{ $styles.RelPermalink }}"
  integrity="{{ $styles.Data.Integrity }}"
  crossorigin="anonymous"
>

<!-- ✅ CORRECT: Static assets -->
<link rel="icon" href="{{ "favicon.svg" | relURL }}">
```

---

### 7. SEO Metadata

```html
<!-- ✅ CORRECT: Use .Permalink for absolute URLs -->
<link rel="canonical" href="{{ .Permalink }}">
<meta property="og:url" content="{{ .Permalink }}">
<meta name="twitter:url" content="{{ .Permalink }}">

<!-- ✅ CORRECT: Open Graph images need absolute URLs -->
{{ with .Params.image }}
  <meta property="og:image" content="{{ . | absURL }}">
{{ end }}

<!-- ✅ CORRECT: Language alternates -->
{{ range .Translations }}
  <link rel="alternate" hreflang="{{ .Lang }}" href="{{ .Permalink }}">
{{ end }}
```

---

### 8. Language Switcher

```html
<!-- ✅ CORRECT: Translation-aware with fallback -->
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

---

## ⚠️ Known Issues & Fixes

### Issue 1: Menu URLs with TrimPrefix

**Current (Problematic):**
```html
<!-- layouts/partials/header.html:148 -->
<a href="{{ strings.TrimPrefix "/" $menuURL | relURL }}">
```

**Fixed:**
```html
<a href="{{ $menuURL | relURL }}">
```

**Why:** `relURL` already handles leading slashes correctly.

---

### Issue 2: Hard-coded Section Paths

**Current (Fragile):**
```html
<!-- layouts/news/single.html:115 -->
<a href="{{ "news/" | relLangURL }}">Back to News</a>
```

**Fixed:**
```html
{{ with .Site.GetPage "/news" }}
  <a href="{{ .RelPermalink }}">Back to News</a>
{{ end }}
```

**Why:** Respects Hugo's routing and permalink configuration.

---

### Issue 3: Manual Taxonomy URL Construction

**Current (Fragile):**
```html
<!-- layouts/partials/news-category-filter.html:27 -->
<a href="{{ printf "categories/%s" (urlize $name) | relLangURL }}">
  {{ $name }}
</a>
```

**Fixed:**
```html
{{ with $.Site.Taxonomies.categories.Get (urlize $name) }}
  <a href="{{ .Page.RelPermalink }}">{{ .Page.Title }}</a>
{{ end }}
```

**Why:** Uses Hugo's taxonomy system instead of string concatenation.

---

### Issue 4: Gallery URL Concatenation

**Current (Problematic):**
```html
<!-- layouts/gallery/single.html:117 -->
{{ .Site.Home.Permalink }}{{ .Site.Language.Lang }}/gallery/
```

**Fixed:**
```html
{{ with .Site.GetPage "/gallery" }}
  {{ .RelPermalink }}
{{ end }}
```

**Why:** Avoids manual path construction.

---

## ✅ Testing Checklist

After making URL changes, test:

### Local Development
- [ ] `hugo server` - All links work
- [ ] Menu navigation works
- [ ] Active menu states highlight correctly
- [ ] Language switcher maintains context

### Production Builds
- [ ] `hugo --baseURL https://example.com/` (root domain)
- [ ] `hugo --baseURL https://example.com/subdir/` (subdirectory)
- [ ] All internal links work
- [ ] Images load correctly
- [ ] CSS/JS assets load with integrity checks

### Content Tests
- [ ] News articles link correctly
- [ ] Gallery items link correctly
- [ ] Category/tag filters work
- [ ] Pagination works
- [ ] Breadcrumbs display correct hierarchy

### SEO Tests
- [ ] Canonical URLs are absolute
- [ ] Open Graph URLs are absolute
- [ ] Language alternate links work
- [ ] Social sharing includes correct URLs

---

## 📂 Examples by Context

### Navigation Components

#### Header Navigation
```html
<!-- Site logo -->
<a href="{{ .Site.Home.RelPermalink }}" class="navbar-brand">
  <img src="{{ "images/logo.svg" | relURL }}" alt="{{ .Site.Title }}">
</a>

<!-- Menu items -->
{{ range site.Menus.main }}
  <a href="{{ .URL | relURL }}"
     class="{{ if eq $.RelPermalink .URL }}active{{ end }}">
    {{ .Name }}
  </a>
{{ end }}
```

#### Footer Navigation
```html
<nav>
  <h3>{{ i18n "quick_links" }}</h3>
  <ul>
    {{ with .Site.GetPage "/about" }}<li><a href="{{ .RelPermalink }}">{{ .Title }}</a></li>{{ end }}
    {{ with .Site.GetPage "/programs" }}<li><a href="{{ .RelPermalink }}">{{ .Title }}</a></li>{{ end }}
    {{ with .Site.GetPage "/contact" }}<li><a href="{{ .RelPermalink }}">{{ .Title }}</a></li>{{ end }}
  </ul>
</nav>
```

#### Breadcrumbs
```html
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li><a href="{{ .Site.Home.RelPermalink }}">{{ i18n "home" }}</a></li>
    {{ range .Ancestors.Reverse }}
      <li><a href="{{ .RelPermalink }}">{{ .Title }}</a></li>
    {{ end }}
    <li class="active">{{ .Title }}</li>
  </ol>
</nav>
```

---

### Content Components

#### News Card
```html
<article class="news-card">
  {{ with .Params.featured_image }}
    <img src="{{ . | relURL }}" alt="{{ $.Title }}">
  {{ end }}
  <h3><a href="{{ .RelPermalink }}">{{ .Title }}</a></h3>
  <p>{{ .Summary }}</p>
  <a href="{{ .RelPermalink }}" class="read-more">{{ i18n "read_more" }}</a>
</article>
```

#### Gallery Card
```html
<article class="gallery-card">
  {{ with .Resources.GetMatch "*.{jpg,png}" }}
    <img src="{{ .RelPermalink }}" alt="{{ $.Title }}">
  {{ end }}
  <h3><a href="{{ .RelPermalink }}">{{ .Title }}</a></h3>

  <!-- Category tags -->
  {{ range .Params.gallery_categories }}
    {{ with $.Site.Taxonomies.gallery_categories.Get (. | urlize) }}
      <a href="{{ .Page.RelPermalink }}" class="tag">{{ . }}</a>
    {{ end }}
  {{ end }}
</article>
```

#### Related Posts
```html
{{ with .Site.RegularPages.Related . | first 3 }}
  <aside class="related-posts">
    <h3>{{ i18n "related_posts" }}</h3>
    <ul>
      {{ range . }}
        <li><a href="{{ .RelPermalink }}">{{ .Title }}</a></li>
      {{ end }}
    </ul>
  </aside>
{{ end }}
```

---

### Filter Components

#### Category Filter
```html
<nav class="category-filter">
  {{ with .Site.GetPage "/news" }}
    <a href="{{ .RelPermalink }}" class="filter-all">{{ i18n "all" }}</a>
  {{ end }}

  {{ range $name, $taxonomy := .Site.Taxonomies.categories }}
    <a href="{{ $taxonomy.Page.RelPermalink }}" class="filter-item">
      {{ $name }} <span class="count">({{ $taxonomy.Count }})</span>
    </a>
  {{ end }}
</nav>
```

#### Tag Filter
```html
<nav class="tag-filter">
  {{ with .Site.GetPage "/news" }}
    <a href="{{ .RelPermalink }}" class="filter-all">{{ i18n "all" }}</a>
  {{ end }}

  {{ range $name, $taxonomy := .Site.Taxonomies.tags }}
    <a href="{{ $taxonomy.Page.RelPermalink }}" class="filter-item">
      {{ $name }}
    </a>
  {{ end }}
</nav>
```

---

### Page Templates

#### Single News Article
```html
<article class="news-single">
  <header>
    <h1>{{ .Title }}</h1>
    <time datetime="{{ .Date.Format "2006-01-02" }}">
      {{ .Date.Format "January 2, 2006" }}
    </time>

    <!-- Categories -->
    {{ if .Params.categories }}
      <div class="categories">
        {{ range .Params.categories }}
          {{ with $.Site.Taxonomies.categories.Get (. | urlize) }}
            <a href="{{ .Page.RelPermalink }}">{{ . }}</a>
          {{ end }}
        {{ end }}
      </div>
    {{ end }}

    <!-- Tags -->
    {{ if .Params.tags }}
      <div class="tags">
        {{ range .Params.tags }}
          {{ with $.Site.Taxonomies.tags.Get (. | urlize) }}
            <a href="{{ .Page.RelPermalink }}">{{ . }}</a>
          {{ end }}
        {{ end }}
      </div>
    {{ end }}
  </header>

  <div class="content">
    {{ .Content }}
  </div>

  <footer>
    {{ with .Site.GetPage "/news" }}
      <a href="{{ .RelPermalink }}" class="back-link">
        ← {{ i18n "back_to_news" }}
      </a>
    {{ end }}
  </footer>
</article>
```

#### Gallery Single Page
```html
<article class="gallery-single">
  <header>
    <h1>{{ .Title }}</h1>

    <!-- Gallery categories -->
    {{ if .Params.gallery_categories }}
      {{ range .Params.gallery_categories }}
        {{ with $.Site.Taxonomies.gallery_categories.Get (. | urlize) }}
          <a href="{{ .Page.RelPermalink }}" class="category-tag">{{ . }}</a>
        {{ end }}
      {{ end }}
    {{ end }}
  </header>

  <!-- Image gallery -->
  <div class="gallery-images">
    {{ range .Resources.Match "*.{jpg,jpeg,png}" }}
      {{ $thumb := .Fill "400x300" }}
      {{ $full := .Fit "1200x900" }}
      <a href="{{ $full.RelPermalink }}" data-lightbox="gallery">
        <img src="{{ $thumb.RelPermalink }}" alt="{{ .Title }}">
      </a>
    {{ end }}
  </div>

  <div class="content">
    {{ .Content }}
  </div>

  <footer>
    {{ with .Site.GetPage "/gallery" }}
      <a href="{{ .RelPermalink }}" class="back-link">
        ← {{ i18n "back_to_gallery" }}
      </a>
    {{ end }}
  </footer>
</article>
```

---

### SEO & Metadata

#### Complete Head Metadata
```html
<head>
  <!-- Basic meta -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ .Title }} | {{ .Site.Title }}</title>

  <!-- Canonical URL -->
  {{ $canonicalURL := .Permalink }}
  {{ with .Params.canonical }}{{ $canonicalURL = . | absURL }}{{ end }}
  <link rel="canonical" href="{{ $canonicalURL }}">

  <!-- Language alternates -->
  {{ range .Translations }}
    <link rel="alternate" hreflang="{{ .Lang }}" href="{{ .Permalink }}">
  {{ end }}
  <link rel="alternate" hreflang="{{ .Lang }}" href="{{ .Permalink }}">

  <!-- Open Graph -->
  <meta property="og:title" content="{{ .Title }}">
  <meta property="og:description" content="{{ with .Description }}{{ . }}{{ else }}{{ .Summary }}{{ end }}">
  <meta property="og:url" content="{{ .Permalink }}">
  <meta property="og:type" content="{{ if .IsPage }}article{{ else }}website{{ end }}">
  {{ with .Params.image }}
    <meta property="og:image" content="{{ . | absURL }}">
  {{ end }}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{{ .Title }}">
  <meta name="twitter:description" content="{{ with .Description }}{{ . }}{{ else }}{{ .Summary }}{{ end }}">
  {{ with .Params.image }}
    <meta name="twitter:image" content="{{ . | absURL }}">
  {{ end }}

  <!-- Stylesheets -->
  {{ $styles := resources.Get "scss/main.scss" | resources.ToCSS | resources.Minify | resources.Fingerprint }}
  <link rel="stylesheet" href="{{ $styles.RelPermalink }}" integrity="{{ $styles.Data.Integrity }}">

  <!-- Favicon -->
  <link rel="icon" href="{{ "favicon.svg" | relURL }}" type="image/svg+xml">
  <link rel="icon" href="{{ "favicon.png" | relURL }}" type="image/png">
</head>
```

---

## 🔍 URL Function Usage Statistics

| Function | Usage Count | Files Using | Primary Context |
|----------|-------------|-------------|-----------------|
| `relLangURL` | 28 | 15 | Section navigation (multilingual) |
| `.Permalink` | 25 | 22 | SEO metadata, social sharing |
| `.RelPermalink` | 19 | 12 | Internal links, processed assets |
| `relURL` | 18 | 10 | Static assets, menu items |
| `urlize` | 9 | 8 | Taxonomy URL sanitization |
| `absURL` | 6 | 4 | Force absolute (logo, hero) |
| `absLangURL` | 5 | 3 | Language alternates |

**Total:** 110 occurrences across 30 template files

---

## 📝 Key Principles

### 1. **Prefer Relative Over Absolute**
Use `.RelPermalink` instead of `.Permalink` for internal links unless you specifically need an absolute URL (SEO, social sharing).

### 2. **Use Hugo's Object System**
Prefer `.Site.GetPage`, taxonomy objects, and `.RelPermalink` over string concatenation with `relLangURL`.

### 3. **Let Hugo Handle Routing**
Don't manually construct URLs with `printf` and path strings. Use Hugo's built-in page and taxonomy objects.

### 4. **Sanitize User Input**
Always use `urlize` for user-generated strings (category names, tag names) before using them in URLs.

### 5. **Test with Different Base URLs**
Always test with both root domain and subdirectory `baseURL` configurations.

---

## 📚 Additional Resources

- **Full Audit Report:** `URL_FUNCTION_AUDIT.md`
- **Visual Usage Map:** `URL_FUNCTION_USAGE_MAP.txt`
- **Quick Patterns:** `URL_PATTERNS_QUICK_REFERENCE.md`
- **Known Issues:** `URL_GENERATION_INCONSISTENCIES.md`
- **Hugo Docs:** https://gohugo.io/functions/urls/

---

## 🚀 Quick Start Checklist for New Developers

- [ ] Read the Quick Decision Tree (top of this document)
- [ ] Review Common Patterns section
- [ ] Check Known Issues before modifying URL code
- [ ] Test changes with `hugo server` locally
- [ ] Test with production `baseURL` before deploying
- [ ] Run the Testing Checklist after URL changes
- [ ] Update this guide if you discover new patterns

---

**Last Updated:** 2025-01-26
**Maintainer:** Development Team
**Hugo Version:** 0.x+
**Site Type:** Multilingual (Polish/English) with subdirectory deployment
