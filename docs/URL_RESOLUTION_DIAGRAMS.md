# URL Resolution Visual Diagrams

**Project:** Wesołe Nutki Hugo Site
**Date:** 2026-01-26
**Purpose:** Visual reference for URL resolution flows

---

## Overview

This document provides visual diagrams and flowcharts for understanding how different types of URLs are resolved in the Wesołe Nutki Hugo site.

---

## 1. URL Type Decision Tree

```
┌─────────────────────────────────────────────────┐
│           URL INPUT: Check Type                 │
└───────────────┬─────────────────────────────────┘
                │
                ├─ Empty/Whitespace?
                │  └─→ [TYPE: empty]
                │      └─→ Render as span (no link)
                │
                ├─ Starts with "#"?
                │  └─→ [TYPE: anchor]
                │      └─→ Use as-is (no processing)
                │
                ├─ Starts with "mailto:", "tel:", etc?
                │  └─→ [TYPE: protocol]
                │      └─→ Use as-is (no processing)
                │
                ├─ Starts with "http://", "https://", "//"?
                │  └─→ [TYPE: absolute]
                │      ├─ Same domain as baseURL?
                │      │  ├─ YES → Internal (no rel attribute)
                │      │  └─ NO  → External (add rel="noopener")
                │      └─→ Use as-is (no processing)
                │
                ├─ Starts with "/"?
                │  └─→ [TYPE: root-relative]
                │      └─→ Apply relURL/relLangURL
                │
                └─ Everything else
                   └─→ [TYPE: relative]
                       └─→ Apply relURL/relLangURL
```

---

## 2. Navigation Menu Link Resolution

```
┌────────────────────────────────────────────────────┐
│   MENU DATA: { url: "/pl/about/", name: "O nas" } │
└──────────────────┬─────────────────────────────────┘
                   │
                   ├─ Check if external (http/https/#)
                   │  ├─ YES → Use URL as-is
                   │  │        Add rel="noopener" if external
                   │  │        Add target="_blank" if configured
                   │  │
                   │  └─ NO  → Process internal link ─┐
                   │                                   │
                   └───────────────────────────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │  TrimPrefix "/"     │
                         │  "/pl/about/"       │
                         │      ↓              │
                         │  "pl/about/"        │
                         └──────────┬──────────┘
                                    │
                         ┌──────────▼──────────┐
                         │    Apply relURL     │
                         └──────────┬──────────┘
                                    │
                         ┌──────────▼──────────┐
                         │  Add baseURL path   │
                         │  "/wesole_nutki/"   │
                         └──────────┬──────────┘
                                    │
                         ┌──────────▼──────────────────┐
                         │  FINAL URL:                 │
                         │  "/wesole_nutki/pl/about/"  │
                         └─────────────────────────────┘
```

---

## 3. Page Content Link Resolution

```
┌─────────────────────────────────────┐
│  PAGE OBJECT: News Article          │
│  - Section: news                    │
│  - Language: pl                     │
│  - Slug: spotkanie-z-rodzicami      │
└──────────────┬──────────────────────┘
               │
    ┌──────────▼──────────┐
    │  .RelPermalink      │
    └──────────┬──────────┘
               │
    ┌──────────▼─────────────────────────────────────┐
    │  Hugo automatically constructs URL from:       │
    │  1. baseURL: /wesole_nutki/                    │
    │  2. Language: pl/                              │
    │  3. Section: news/                             │
    │  4. Date (if configured): 2024-01-15-          │
    │  5. Slug: spotkanie-z-rodzicami/               │
    └──────────┬─────────────────────────────────────┘
               │
    ┌──────────▼──────────────────────────────────────────────┐
    │  FINAL URL:                                             │
    │  "/wesole_nutki/pl/news/2024-01-15-spotkanie-z-rodzicami/" │
    └─────────────────────────────────────────────────────────┘
```

---

## 4. Image Asset Resolution Flow

### 4A. Processed Hugo Resource

```
┌────────────────────────────────────────┐
│  IMAGE: "images/hero.jpg"              │
│  Action: Resize to 1200x800            │
└──────────────┬─────────────────────────┘
               │
    ┌──────────▼──────────┐
    │  resources.Get      │
    │  "images/hero.jpg"  │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────┐
    │  .Resize "1200x800" │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────────────────┐
    │  .RelPermalink                  │
    │  - Adds baseURL path            │
    │  - Adds content-based hash      │
    │  - Enables SRI                  │
    └──────────┬──────────────────────┘
               │
    ┌──────────▼────────────────────────────────────┐
    │  FINAL URL:                                   │
    │  "/wesole_nutki/images/hero_1200x800_abc123def456.jpg" │
    └───────────────────────────────────────────────┘
```

### 4B. Static Image

```
┌────────────────────────────────────────┐
│  IMAGE PATH: "uploads/photo.jpg"       │
│  (from content or static folder)       │
└──────────────┬─────────────────────────┘
               │
    ┌──────────▼──────────┐
    │    Apply relURL     │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────┐
    │  Add baseURL path   │
    └──────────┬──────────┘
               │
    ┌──────────▼────────────────────────────┐
    │  FINAL URL:                           │
    │  "/wesole_nutki/uploads/photo.jpg"    │
    └───────────────────────────────────────┘
```

---

## 5. SEO Meta Tag URL Resolution

```
┌────────────────────────────────────────────────┐
│  PAGE OBJECT: News Article                     │
│  Purpose: Generate canonical and OG URLs       │
└──────────────┬─────────────────────────────────┘
               │
               ├─────────────────────────┬─────────────────────────┐
               │                         │                         │
    ┌──────────▼──────────┐   ┌─────────▼──────────┐   ┌─────────▼─────────┐
    │  Canonical URL      │   │  Open Graph URL     │   │  og:image URL     │
    └──────────┬──────────┘   └─────────┬───────────┘   └─────────┬─────────┘
               │                        │                         │
    ┌──────────▼──────────┐   ┌─────────▼───────────┐   ┌─────────▼──────────┐
    │   .Permalink        │   │   .Permalink        │   │  .Params.image     │
    │   (absolute URL)    │   │   (absolute URL)    │   │     | absURL       │
    └──────────┬──────────┘   └─────────┬───────────┘   └─────────┬──────────┘
               │                        │                         │
    ┌──────────▼──────────────────────────────────────────────────▼──────────┐
    │  RESULTS:                                                               │
    │  Canonical: https://wesolenutkiprzemysl.pl/wesole_nutki/pl/news/article/│
    │  og:url:    https://wesolenutkiprzemysl.pl/wesole_nutki/pl/news/article/│
    │  og:image:  https://wesolenutkiprzemysl.pl/wesole_nutki/images/og.jpg   │
    └─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Language Switcher Resolution

```
┌────────────────────────────────────────────────┐
│  CURRENT PAGE: /wesole_nutki/pl/about/        │
│  TARGET LANGUAGE: English (en)                 │
└──────────────┬─────────────────────────────────┘
               │
    ┌──────────▼─────────────┐
    │  Check .IsTranslated   │
    └──────────┬─────────────┘
               │
         ┌─────┴─────┐
         │           │
    YES  │           │  NO
         │           │
         ▼           ▼
┌────────────────┐  ┌─────────────────────┐
│ Find translation│  │ Use language home   │
│ in .Translations│  │ as fallback         │
└────────┬────────┘  └──────────┬──────────┘
         │                      │
         ├─ Loop through        │
         │  .Translations       │
         │  for target lang     │
         │                      │
    ┌────▼─────────┐       ┌────▼─────────┐
    │ Translation  │       │ absLangURL   │
    │ .Permalink   │       │ "en"         │
    └────┬─────────┘       └────┬─────────┘
         │                      │
         ▼                      ▼
┌────────────────────────┐  ┌─────────────────────┐
│ https://.../wesole_    │  │ https://.../wesole_ │
│ nutki/en/about/        │  │ nutki/en/           │
└────────────────────────┘  └─────────────────────┘
         │                      │
         └──────────┬───────────┘
                    │
         ┌──────────▼───────────────────┐
         │  FINAL LANGUAGE SWITCH URL   │
         │  (absolute URL for switching)│
         └──────────────────────────────┘
```

---

## 7. Taxonomy Link Resolution

### Current Implementation (String Concatenation)

```
┌────────────────────────────────────┐
│  CATEGORY NAME: "Wydarzenia"       │
└──────────────┬─────────────────────┘
               │
    ┌──────────▼──────────┐
    │     urlize          │
    │  "Wydarzenia"       │
    │       ↓             │
    │  "wydarzenia"       │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────────────┐
    │  printf "categories/%s"     │
    │  Result: "categories/       │
    │           wydarzenia"       │
    └──────────┬──────────────────┘
               │
    ┌──────────▼──────────┐
    │   relLangURL        │
    │  - Add baseURL      │
    │  - Add language     │
    └──────────┬──────────┘
               │
    ┌──────────▼─────────────────────────────────┐
    │  FINAL URL:                                │
    │  "/wesole_nutki/pl/categories/wydarzenia/" │
    └────────────────────────────────────────────┘
```

### Better Implementation (Object-Based)

```
┌────────────────────────────────────┐
│  CATEGORY NAME: "Wydarzenia"       │
└──────────────┬─────────────────────┘
               │
    ┌──────────▼──────────┐
    │     urlize          │
    │  "wydarzenia"       │
    └──────────┬──────────┘
               │
    ┌──────────▼────────────────────────┐
    │  $.Site.Taxonomies.categories     │
    │          .Get("wydarzenia")       │
    │  Returns taxonomy object          │
    └──────────┬────────────────────────┘
               │
    ┌──────────▼──────────┐
    │  .Page.RelPermalink │
    │  (from taxonomy obj)│
    └──────────┬──────────┘
               │
    ┌──────────▼─────────────────────────────────┐
    │  FINAL URL:                                │
    │  "/wesole_nutki/pl/categories/wydarzenia/" │
    │  + Access to: .Count, .Title, .Pages       │
    └────────────────────────────────────────────┘
```

---

## 8. Asset Bundle Resolution (CSS/JS)

```
┌────────────────────────────────────────┐
│  SCSS FILE: "scss/main.scss"           │
└──────────────┬─────────────────────────┘
               │
    ┌──────────▼──────────┐
    │  resources.Get      │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────┐
    │  resources.ToCSS    │
    │  (compile SCSS)     │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────┐
    │  resources.Minify   │
    │  (minify CSS)       │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────────┐
    │  resources.Fingerprint  │
    │  (add content hash)     │
    └──────────┬──────────────┘
               │
    ┌──────────▼──────────────┐
    │  .RelPermalink          │
    │  + .Data.Integrity      │
    └──────────┬──────────────┘
               │
    ┌──────────▼─────────────────────────────────┐
    │  FINAL OUTPUT:                             │
    │  href="/wesole_nutki/css/main.min.abc123.css"│
    │  integrity="sha256-..."                    │
    │  crossorigin="anonymous"                   │
    └────────────────────────────────────────────┘
```

---

## 9. Breadcrumb Navigation Resolution

```
┌─────────────────────────────────────────────────────┐
│  CURRENT PAGE: News Article                         │
│  Path: /wesole_nutki/pl/news/2024-01-15-article/    │
└──────────────┬──────────────────────────────────────┘
               │
    ┌──────────▼──────────┐
    │  Generate Crumbs    │
    └──────────┬──────────┘
               │
        ┌──────┴──────┬──────────┬───────────┐
        │             │          │           │
        ▼             ▼          ▼           ▼
┌────────────┐ ┌───────────┐ ┌───────┐ ┌──────────┐
│   Home     │ │  Section  │ │Parent │ │ Current  │
└────┬───────┘ └────┬──────┘ └───┬───┘ └────┬─────┘
     │              │            │          │
     │.Site.Home    │.Ancestor   │.Ancestor │(no link)
     │.RelPermalink │.RelPermalink│.RelPermalink│
     │              │            │          │
     ▼              ▼            ▼          ▼
┌────────────┐ ┌────────────┐ ┌──────────┐ ┌────────────┐
│/wesole_    │ │/wesole_    │ │(optional)│ │Article     │
│nutki/pl/   │ │nutki/pl/   │ │         │ │Title       │
│            │ │news/       │ │         │ │(text only) │
└────────────┘ └────────────┘ └──────────┘ └────────────┘
```

---

## 10. Complete URL Resolution Matrix

```
┌──────────────────────────────────────────────────────────────────────┐
│                    URL RESOLUTION DECISION MATRIX                    │
└──────────────────────────────────────────────────────────────────────┘

USE CASE              │ INPUT TYPE      │ FUNCTION        │ OUTPUT EXAMPLE
──────────────────────┼─────────────────┼─────────────────┼────────────────────────
Internal Page Link    │ Page Object     │ .RelPermalink   │ /wesole_nutki/pl/about/
External Link         │ Full URL        │ As-is           │ https://example.com
Logo Image (static)   │ Path string     │ relURL          │ /wesole_nutki/images/logo.png
Hero Image (processed)│ Resource        │ .RelPermalink   │ /wesole_nutki/images/hero_800x_hash.jpg
CSS Bundle            │ Resource        │ .RelPermalink   │ /wesole_nutki/css/main.min.hash.css
JS Bundle             │ Resource        │ .RelPermalink   │ /wesole_nutki/js/app.min.hash.js
Canonical URL         │ Page Object     │ .Permalink      │ https://.../wesole_nutki/pl/about/
Open Graph URL        │ Page Object     │ .Permalink      │ https://.../wesole_nutki/pl/about/
OG Image              │ Path string     │ absURL          │ https://.../wesole_nutki/images/og.jpg
Category Page         │ Taxonomy Object │ .Page.RelPermalink│ /wesole_nutki/pl/categories/news/
Tag Page              │ Taxonomy Object │ .Page.RelPermalink│ /wesole_nutki/pl/tags/music/
Language Home         │ Lang code       │ absLangURL      │ https://.../wesole_nutki/en/
Section Link          │ Section path    │ relLangURL      │ /wesole_nutki/pl/programs/
Anchor Link           │ #anchor         │ As-is           │ #contact
Email Link            │ mailto:         │ As-is           │ mailto:info@example.com
Phone Link            │ tel:            │ As-is           │ tel:+48123456789
Breadcrumb Home       │ Site.Home       │ .RelPermalink   │ /wesole_nutki/pl/
Pagination            │ Paginator       │ .URL            │ /wesole_nutki/pl/news/page/2/
Menu Link (data)      │ URL string      │ relURL          │ /wesole_nutki/pl/contact/
Download Link         │ File path       │ relURL          │ /wesole_nutki/documents/form.pdf
```

---

## 11. Active Menu State Detection Flow

```
┌─────────────────────────────────────────────────┐
│  CURRENT PAGE: /wesole_nutki/pl/news/article   │
│  MENU ITEM: url = "/pl/news/"                  │
└──────────────┬──────────────────────────────────┘
               │
    ┌──────────▼──────────────────┐
    │  Get page RelPermalink      │
    │  Result: /wesole_nutki/     │
    │          pl/news/article/   │
    └──────────┬──────────────────┘
               │
    ┌──────────▼──────────────────┐
    │  Extract basePath from      │
    │  baseURL                    │
    │  Result: "wesole_nutki"     │
    └──────────┬──────────────────┘
               │
    ┌──────────▼──────────────────┐
    │  Strip basePath from        │
    │  page URL                   │
    │  Result: /pl/news/article/  │
    └──────────┬──────────────────┘
               │
    ┌──────────▼──────────────────┐
    │  Normalize both URLs        │
    │  (remove trailing slash)    │
    │  Page: /pl/news/article     │
    │  Menu: /pl/news             │
    └──────────┬──────────────────┘
               │
         ┌─────┴─────┐
         │           │
         ▼           ▼
    ┌────────┐  ┌────────────┐
    │ Exact  │  │  Prefix    │
    │ Match? │  │  Match?    │
    └───┬────┘  └─────┬──────┘
        │             │
        NO            │
                      ▼
              ┌───────────────┐
              │ hasPrefix?    │
              │ /pl/news/     │
              │ article       │
              │ starts with   │
              │ /pl/news      │
              └───┬───────────┘
                  │
                  YES
                  │
                  ▼
        ┌─────────────────────┐
        │  Set Active State   │
        │  Add "active" class │
        └─────────────────────┘
```

---

## 12. Responsive Image Srcset Generation

```
┌────────────────────────────────────────┐
│  IMAGE: "images/photo.jpg"             │
│  WIDTHS: [400, 800, 1200, 1600]        │
└──────────────┬─────────────────────────┘
               │
    ┌──────────▼──────────────────┐
    │  resources.Get              │
    │  "images/photo.jpg"         │
    └──────────┬──────────────────┘
               │
    ┌──────────▼──────────────────┐
    │  Loop through widths:       │
    │                             │
    │  400  →  .Resize "400x"  ───┼──→ /wesole_nutki/images/photo_400x_hash.jpg
    │  800  →  .Resize "800x"  ───┼──→ /wesole_nutki/images/photo_800x_hash.jpg
    │  1200 →  .Resize "1200x" ───┼──→ /wesole_nutki/images/photo_1200x_hash.jpg
    │  1600 →  .Resize "1600x" ───┼──→ /wesole_nutki/images/photo_1600x_hash.jpg
    │                             │
    │  Each: .RelPermalink        │
    └──────────┬──────────────────┘
               │
    ┌──────────▼─────────────────────────────────────────────────┐
    │  SRCSET ATTRIBUTE:                                         │
    │  /wesole_nutki/images/photo_400x_hash.jpg 400w,            │
    │  /wesole_nutki/images/photo_800x_hash.jpg 800w,            │
    │  /wesole_nutki/images/photo_1200x_hash.jpg 1200w,          │
    │  /wesole_nutki/images/photo_1600x_hash.jpg 1600w           │
    └────────────────────────────────────────────────────────────┘
```

---

## 13. URL Processing Priority Flow

```
┌─────────────────────────────────────────────┐
│  START: Need to generate a URL for link    │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│  1. Is it a Hugo Page Object?                        │
│     ├─ YES → Use .RelPermalink for internal links   │
│     │         Use .Permalink for SEO metadata       │
│     └─ NO  → Continue to next check                 │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│  2. Is it a Hugo Processed Resource (CSS/JS/Image)?  │
│     ├─ YES → MUST use .RelPermalink                 │
│     │         (enables fingerprinting + integrity)   │
│     └─ NO  → Continue to next check                 │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│  3. Is it a Taxonomy (Category/Tag)?                 │
│     ├─ YES → Get taxonomy object, use .Page.RelPermalink│
│     └─ NO  → Continue to next check                 │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│  4. Is it a static asset path (string)?              │
│     ├─ YES → Use relURL (images, icons, etc)        │
│     │         Use absURL for SEO images only         │
│     └─ NO  → Continue to next check                 │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│  5. Is it an external URL, anchor, or protocol?      │
│     ├─ External (http/https) → Use as-is            │
│     ├─ Anchor (#section) → Use as-is                │
│     ├─ Protocol (mailto/tel) → Use as-is            │
│     └─ Unknown → Default to relURL                  │
└──────────────────────────────────────────────────────┘
```

---

## Summary Reference

### Quick Function Selection

```
╔════════════════════════════════════════════════════╗
║              URL FUNCTION QUICK GUIDE              ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║  .RelPermalink  →  Page links, processed assets   ║
║  .Permalink     →  SEO metadata (canonical, OG)   ║
║  relURL         →  Static assets, simple paths    ║
║  absURL         →  Meta tag images (og:image)     ║
║  relLangURL     →  Language-aware sections        ║
║  absLangURL     →  Language home fallback         ║
║  urlize         →  Sanitize taxonomy names        ║
║  As-is          →  External, anchor, protocol     ║
║                                                    ║
╚════════════════════════════════════════════════════╝
```

### Output Patterns

```
Relative URLs:  /wesole_nutki/pl/about/
Absolute URLs:  https://wesolenutkiprzemysl.pl/wesole_nutki/pl/about/
Anchors:        #contact
Protocols:      mailto:info@example.com
External:       https://external-site.com/page
```

---

**Document Version:** 1.0
**Last Updated:** 2026-01-26
**See Also:** `URL_LINK_RESOLUTION_BEHAVIOR.md` for detailed explanations
