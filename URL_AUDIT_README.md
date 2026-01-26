# URL Function Audit - Documentation Index

**Audit Date:** January 26, 2025
**Project:** Wesołe Nutki Hugo Site
**Audit Scope:** All HTML template files in `layouts/` directory

## 📚 Documentation Files

This audit produced three comprehensive documents to help understand and maintain URL function usage across the Hugo template files:

### 1. 📋 URL_FUNCTION_AUDIT.md (24 KB)
**The Complete Audit Report**

This is the main comprehensive document containing:
- Executive summary with statistics
- Hugo URL functions overview
- Detailed file-by-file analysis of all 56 template files
- URL pattern analysis and common patterns
- Decision matrix for choosing URL functions
- Best practices observed in the codebase
- Migration considerations
- Testing checklist
- File reference index organized by category

**Use this when you need:**
- Comprehensive understanding of all URL usage
- Detailed analysis of specific template files
- Background on Hugo URL functions
- Migration planning information

### 2. 🚀 URL_PATTERNS_QUICK_REFERENCE.md (9.2 KB)
**Quick Reference Guide**

A condensed reference document containing:
- URL function summary table
- Common URL patterns with code examples
- Decision tree flowchart
- Files organized by function category
- Testing checklist
- Common pitfalls and solutions
- URL examples by section
- Quick tips

**Use this when you need:**
- Quick lookup of URL patterns
- Code examples to copy/paste
- Decision on which URL function to use
- Common problem solutions

### 3. 🗺️ URL_FUNCTION_USAGE_MAP.txt (20 KB)
**Visual Map of URL Usage**

An ASCII art visual representation showing:
- Tree structure of all template files
- Which URL functions each file uses
- Grouped by functional area (navigation, content, SEO, etc.)
- Usage statistics with bar charts
- Complexity levels of different files
- Key patterns highlighted

**Use this when you need:**
- Visual overview of the codebase structure
- Quick identification of which files use which functions
- Understanding the relationship between template files
- Complexity assessment of different areas

---

## 📊 Audit Summary

### Key Statistics

- **Total Template Files Analyzed:** 56
- **Files with URL Functions:** 30
- **Total URL Function Occurrences:** 110

### Top URL Functions Used

| Rank | Function | Count | Primary Use |
|------|----------|-------|-------------|
| 1 | `relLangURL` | 28 | Multilingual section navigation |
| 2 | `.Permalink` | 25 | Page-to-page links |
| 3 | `.RelPermalink` | 19 | Processed resources (images, CSS, JS) |
| 4 | `relURL` | 18 | Static assets |
| 5 | `urlize` | 9 | Taxonomy URL sanitization |
| 6 | `absURL` | 6 | SEO metadata |
| 7 | `absLangURL` | 5 | Multilingual SEO |

### Most Complex Files (by URL function usage)

1. **head.html** - 8 occurrences (SEO metadata, assets, internationalization)
2. **responsive-image.html** - 8 occurrences (image processing pipeline)
3. **header.html** - 6 occurrences (navigation, active state detection)
4. **news/single.html** - 6 occurrences (content page navigation)
5. **gallery/single.html** - 5 occurrences (gallery with images)

---

## 🎯 Quick Start Guide

### If you're new to the codebase:
1. Start with **URL_PATTERNS_QUICK_REFERENCE.md** to learn common patterns
2. Use **URL_FUNCTION_USAGE_MAP.txt** to visualize the structure
3. Refer to **URL_FUNCTION_AUDIT.md** for detailed analysis

### If you're adding a new feature:
1. Check **URL_PATTERNS_QUICK_REFERENCE.md** for the decision tree
2. Find similar functionality in **URL_FUNCTION_USAGE_MAP.txt**
3. Review the detailed analysis in **URL_FUNCTION_AUDIT.md**

### If you're debugging URL issues:
1. Use **URL_FUNCTION_USAGE_MAP.txt** to locate the relevant file
2. Check **URL_PATTERNS_QUICK_REFERENCE.md** for common pitfalls
3. Review detailed patterns in **URL_FUNCTION_AUDIT.md**

### If you're planning a migration:
1. Read the "Migration Considerations" section in **URL_FUNCTION_AUDIT.md**
2. Use the testing checklist from **URL_PATTERNS_QUICK_REFERENCE.md**
3. Reference **URL_FUNCTION_USAGE_MAP.txt** to ensure all areas are covered

---

## 🔍 Common URL Patterns in This Codebase

### 1. Section Navigation (Most Common)
```html
<a href="{{ "news" | relLangURL }}">News</a>
```
**Used in:** Navigation, filters, homepage sections

### 2. Taxonomy URLs
```html
{{ printf "categories/%s" (urlize $name) | relLangURL }}
```
**Used in:** Category filters, tag filters, gallery categories

### 3. Page Links
```html
<a href="{{ .Permalink }}">{{ .Title }}</a>
```
**Used in:** Cards, listings, breadcrumbs

### 4. Processed Images
```html
<img src="{{ $image.RelPermalink }}" srcset="...">
```
**Used in:** Responsive images, galleries

### 5. Menu URLs (with preprocessing)
```html
{{ strings.TrimPrefix "/" .url | relURL }}
```
**Used in:** Header, footer navigation

---

## ✅ Best Practices Found

The codebase demonstrates several best practices:

1. **Consistent Multilingual Support**: Uses `relLangURL`/`absLangURL` throughout
2. **Proper Resource Handling**: Uses `.RelPermalink` for processed assets
3. **URL Sanitization**: Consistently applies `urlize` to taxonomy names
4. **SEO-Friendly**: Proper canonical URLs, Open Graph, and Twitter Card metadata
5. **Graceful Fallbacks**: Language switcher handles missing translations elegantly

---

## ⚠️ Areas to Watch

1. **Complex URL Comparison Logic** in `header.html` for active menu states
2. **String Manipulation** before URL functions (necessary but adds complexity)
3. **Mixed URL Sources** (`.url` vs `.URL` vs `.Permalink`) depending on context

These are not problems, but areas that require careful attention when modifying.

---

## 🧪 Testing URL Changes

When making URL-related changes, test these critical areas:

**Navigation:**
- [ ] Main menu links work in both languages
- [ ] Active menu state highlights correctly
- [ ] Footer links are valid

**Content:**
- [ ] News article links work
- [ ] Gallery links work
- [ ] Category/tag filters generate correct URLs
- [ ] Pagination works

**Assets:**
- [ ] Images load with correct srcset
- [ ] CSS loads with integrity checking
- [ ] JavaScript loads correctly

**SEO:**
- [ ] Canonical URLs are correct
- [ ] Open Graph metadata has valid URLs
- [ ] Language alternate links work

**Special Cases:**
- [ ] Language switcher maintains context
- [ ] 404 page links work
- [ ] Document downloads resolve

See **URL_PATTERNS_QUICK_REFERENCE.md** for the complete testing checklist.

---

## 📖 Hugo Documentation References

- [URLs in Hugo](https://gohugo.io/content-management/urls/)
- [URL Management](https://gohugo.io/content-management/urls/)
- [Multilingual Mode](https://gohugo.io/content-management/multilingual/)
- [Hugo Pipes (Asset Processing)](https://gohugo.io/hugo-pipes/)
- [urlize Function](https://gohugo.io/functions/urlize/)

---

## 🤝 Contributing

When adding new templates or modifying existing ones:

1. **Follow established patterns** documented in this audit
2. **Use `relLangURL`** for all section navigation on this multilingual site
3. **Use `.RelPermalink`** for processed Hugo resources
4. **Apply `urlize`** to any user-generated content in URLs (taxonomy names, etc.)
5. **Test in both languages** (Polish and English)
6. **Update this documentation** if introducing new URL patterns

---

## 📝 Document Versions

- **URL_FUNCTION_AUDIT.md**: v1.0 (January 26, 2025)
- **URL_PATTERNS_QUICK_REFERENCE.md**: v1.0 (January 26, 2025)
- **URL_FUNCTION_USAGE_MAP.txt**: v1.0 (January 26, 2025)

---

## 🔗 Related Files

- `config.toml` or `hugo.toml` - Site configuration with baseURL
- `data/menus/` - Menu configuration files
- `data/settings.yml` - Site settings including URLs
- `layouts/` - All template files analyzed in this audit

---

## 💡 Quick Decision Guide

**Need to link to:**

| Target | Use This | Example |
|--------|----------|---------|
| Another page | `.Permalink` | `{{ .Permalink }}` |
| A section | `relLangURL` | `{{ "news" | relLangURL }}` |
| A category/tag | `urlize` + `relLangURL` | `{{ printf "categories/%s" (urlize $name) | relLangURL }}` |
| An image (processed) | `.RelPermalink` | `{{ $image.RelPermalink }}` |
| A static file | `relURL` | `{{ "favicon.svg" | relURL }}` |
| For SEO/sharing | `absURL` or `.Permalink` | `{{ .Params.og_image | absURL }}` |

---

**For questions or updates to this documentation, please refer to the individual audit documents or contact the development team.**

---

**Audit completed:** January 26, 2025
**Audited by:** Claude (Anthropic AI Assistant)
**Hugo Version:** 0.x+ (compatible with modern Hugo releases)
**Site Languages:** Polish (pl), English (en)
