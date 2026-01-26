# Menu Data Files Audit Report

**Date:** 2026-01-26
**Task:** T002 - Audit menu data files for hardcoded paths
**Status:** ✅ Complete

## Executive Summary

This audit identifies all hardcoded URL paths in menu and navigation data files. The project uses YAML data files for menu configuration, and all URLs are currently hardcoded with language prefixes and specific paths. This audit catalogs these paths to support future refactoring efforts.

## Files Audited

### Primary Menu Files
1. `data/menus/main_pl.yml` - Polish main navigation menu
2. `data/menus/main_en.yml` - English main navigation menu

### Secondary Navigation Files
3. `data/footer.yml` - Footer navigation links
4. `data/homepage/recruitment.yml` - Recruitment section with document links

### Translation Files (Reference Only)
5. `data/translations/pl/navigation.yml` - Polish navigation labels (no URLs)
6. `data/translations/en/navigation.yml` - English navigation labels (no URLs)

## Detailed Findings

### 1. Main Menu - Polish (`data/menus/main_pl.yml`)

**Total Hardcoded URLs:** 17

#### Top-Level Menu Items
| Identifier | URL | Type |
|------------|-----|------|
| home | `/pl/` | Homepage |
| news | `/pl/news/` | Section |
| about | `/pl/about/` | Section |
| offer | `/pl/programs/` | Section |
| daily-plan | `/pl/programs/schedule` | Section (missing trailing slash) |
| galleries | `/pl/gallery/` | Section |
| more | `#` | Dropdown anchor |
| contact | `/pl/contact/` | Section |

#### Submenu Items - Daily Plan
| Identifier | URL | Path Type |
|------------|-----|-----------|
| daily-plan-weekly | `/pl/plan-zajec/` | Custom path |
| daily-plan-extra | `/pl/plan-dnia/zajecia-dodatkowe/` | Deep nested |
| daily-plan-calendar | `/pl/plan-dnia/imprezy/` | Deep nested |

#### Submenu Items - More Menu
| Identifier | URL | Path Type |
|------------|-----|-----------|
| more-recruitment | `/pl/rekrutacja/` | Custom path |
| more-vision | `/pl/o-przedszkolu/nasza-wizja/` | Deep nested |
| more-pricing | `/pl/o-przedszkolu/cennik/` | Deep nested |
| more-payments | `/pl/o-przedszkolu/platnosci/` | Deep nested |
| more-enrollment | `/pl/o-przedszkolu/zapisy/` | Deep nested |
| more-privacy | `/pl/o-przedszkolu/polityka-prywatnosci/` | Deep nested |
| more-child-protection | `/pl/standardy-ochrony-maloletnich/` | Custom path |

**Issues Identified:**
- ⚠️ Line 39: Missing trailing slash on `/pl/programs/schedule` (inconsistent with other URLs)
- ⚠️ Inconsistent path structures (some use `/o-przedszkolu/` prefix, some don't)
- ⚠️ URL `/pl/plan-zajec/` doesn't follow the same pattern as other schedule URLs

---

### 2. Main Menu - English (`data/menus/main_en.yml`)

**Total Hardcoded URLs:** 17

#### Top-Level Menu Items
| Identifier | URL | Type |
|------------|-----|------|
| home | `/en/` | Homepage |
| news | `/en/news/` | Section |
| about | `/en/about/` | Section |
| offer | `/en/programs/` | Section |
| daily-plan | `/en/programs/schedule/` | Section |
| galleries | `/en/gallery/` | Section |
| more | `#` | Dropdown anchor |
| contact | `/en/contact/` | Section |

#### Submenu Items - Daily Plan
| Identifier | URL | Path Type |
|------------|-----|-----------|
| daily-plan-weekly | `/en/schedule/` | Simplified path |
| daily-plan-extra | `/en/daily-plan/extra-activities/` | Deep nested |
| daily-plan-calendar | `/en/daily-plan/events/` | Deep nested |

#### Submenu Items - More Menu
| Identifier | URL | Path Type |
|------------|-----|-----------|
| more-recruitment | `/en/recruitment/` | Simple path |
| more-vision | `/en/about/vision/` | Nested |
| more-pricing | `/en/about/pricing/` | Nested |
| more-payments | `/en/about/payments/` | Nested |
| more-enrollment | `/en/about/enrollment/` | Nested |
| more-privacy | `/en/documents/privacy-policy/` | Different structure |
| more-child-protection | `/en/child-protection-standards/` | Custom path |

**Issues Identified:**
- ⚠️ Inconsistent nesting: some items use `/en/about/` prefix (vision, pricing, payments, enrollment), some don't
- ⚠️ Privacy policy uses `/en/documents/` prefix instead of `/en/about/`
- ⚠️ Different path structure for schedule items compared to Polish version

---

### 3. Footer Configuration (`data/footer.yml`)

**Total Hardcoded URLs:** 8

**Status:** Currently NOT in use (line 8: `use_main_menu: true`)

These URLs in `custom_links` are defined but not currently active:

| Name (EN) | URL | Language Prefix |
|-----------|-----|-----------------|
| Home | `/` | ❌ Missing |
| About Us | `/about/` | ❌ Missing |
| Programs | `/programs/` | ❌ Missing |
| Gallery | `/gallery/` | ❌ Missing |
| Contact | `/contact/` | ❌ Missing |
| Privacy Policy | `/privacy/` | ❌ Missing |
| Terms of Service | `/terms/` | ❌ Missing |
| FAQ | `/faq/` | ❌ Missing |

**Critical Issues:**
- 🔴 **All footer custom URLs are missing language prefixes** (`/pl/` or `/en/`)
- 🔴 These URLs would break if activated (currently disabled)
- 🔴 Paths don't match the actual site structure

---

### 4. Homepage Recruitment Section (`data/homepage/recruitment.yml`)

**Total Hardcoded URLs:** 2

| Field | URL | Type |
|-------|-----|------|
| download_url | `/documents/karta-zgloszenia.pdf` | Direct file link |
| documents_page_url | `/pl/documents/` | Polish-specific page |

**Issues Identified:**
- ⚠️ `documents_page_url` is hardcoded to Polish language
- ⚠️ No English equivalent path configured
- ⚠️ PDF path doesn't include language prefix (may be intentional for static files)

---

## Summary Statistics

| File | Total URLs | Hardcoded Paths | Language-Specific | Issues Found |
|------|------------|-----------------|-------------------|--------------|
| `data/menus/main_pl.yml` | 17 | 17 | 17 (PL) | 3 |
| `data/menus/main_en.yml` | 17 | 17 | 17 (EN) | 3 |
| `data/footer.yml` | 8 | 8 | 0 (broken) | 8 |
| `data/homepage/recruitment.yml` | 2 | 2 | 1 (PL only) | 2 |
| **TOTAL** | **44** | **44** | **35** | **16** |

---

## Path Pattern Analysis

### Inconsistencies Between Polish and English Versions

| Purpose | Polish Path | English Path | Consistent? |
|---------|-------------|--------------|-------------|
| Home | `/pl/` | `/en/` | ✅ |
| News | `/pl/news/` | `/en/news/` | ✅ |
| About | `/pl/about/` | `/en/about/` | ✅ |
| Programs | `/pl/programs/` | `/en/programs/` | ✅ |
| Schedule (main) | `/pl/programs/schedule` ⚠️ | `/pl/programs/schedule/` | ❌ Trailing slash |
| Weekly plan | `/pl/plan-zajec/` | `/en/schedule/` | ❌ Different structure |
| Extra activities | `/pl/plan-dnia/zajecia-dodatkowe/` | `/en/daily-plan/extra-activities/` | ❌ Different base path |
| Calendar/Events | `/pl/plan-dnia/imprezy/` | `/en/daily-plan/events/` | ❌ Different base path |
| Gallery | `/pl/gallery/` | `/en/gallery/` | ✅ |
| Contact | `/pl/contact/` | `/en/contact/` | ✅ |
| Recruitment | `/pl/rekrutacja/` | `/en/recruitment/` | ⚠️ Similar but translated |
| Vision | `/pl/o-przedszkolu/nasza-wizja/` | `/en/about/vision/` | ❌ Different structure |
| Pricing | `/pl/o-przedszkolu/cennik/` | `/en/about/pricing/` | ❌ Different structure |
| Payments | `/pl/o-przedszkolu/platnosci/` | `/en/about/payments/` | ❌ Different structure |
| Enrollment | `/pl/o-przedszkolu/zapisy/` | `/en/about/enrollment/` | ❌ Different structure |
| Privacy Policy | `/pl/o-przedszkolu/polityka-prywatnosci/` | `/en/documents/privacy-policy/` | ❌ Completely different |
| Child Protection | `/pl/standardy-ochrony-maloletnich/` | `/en/child-protection-standards/` | ⚠️ Similar but translated |

**Key Findings:**
- ✅ **6 paths are consistent** between languages
- ❌ **10 paths have structural differences** between languages
- ⚠️ **2 paths have minor inconsistencies** (translated slugs, trailing slashes)

---

## Critical Issues Requiring Attention

### High Priority
1. **Missing trailing slash** in Polish menu: `/pl/programs/schedule` (line 39 of main_pl.yml)
2. **Footer URLs completely broken** - all missing language prefixes (lines 13-46 of footer.yml)
3. **Structural inconsistency** - Polish uses `/o-przedszkolu/` for about pages, English uses `/about/`

### Medium Priority
4. **Recruitment page URL hardcoded to Polish** in recruitment.yml
5. **Path structure divergence** between PL and EN for daily plan items
6. **Privacy policy path inconsistency** - uses `/documents/` in EN but `/o-przedszkolu/` in PL

### Low Priority
7. **Translated slugs in URLs** - makes cross-language navigation mapping complex
8. **Deep nesting inconsistency** - some paths go 3+ levels deep, others stay shallow

---

## Recommendations for Future Refactoring

### Phase 1: Fix Critical Issues
1. ✅ Add trailing slash to `/pl/programs/schedule`
2. ✅ Fix all footer URLs to include proper language prefixes
3. ✅ Add English version support to recruitment section URLs

### Phase 2: Standardize URL Structure
1. 🎯 Create consistent path patterns between languages
2. 🎯 Either use translated slugs everywhere OR use English slugs everywhere
3. 🎯 Standardize nesting depth (max 2-3 levels)

### Phase 3: Implement URL Helper System
1. 🎯 Create URL helper functions that construct URLs from identifiers
2. 🎯 Use menu identifiers instead of hardcoded paths where possible
3. 🎯 Implement URL mapping system for language-specific paths

### Phase 4: Content Structure Alignment
1. 🎯 Ensure every Polish path has an English equivalent
2. 🎯 Map content files to menu items for automated URL generation
3. 🎯 Consider using Hugo's built-in menu system with page bundles

---

## Menu Data File Structure Reference

All menu items follow this structure:

```yaml
- identifier: unique-id        # Used for identification
  name: Display Name          # Shown in menu
  url: /lang/path/            # HARDCODED PATH ⚠️
  weight: 1                   # Sort order
  i18n_key: translation_key   # Translation reference
  external: false             # External link flag
  open_in_new_tab: false     # Target behavior
  children:                   # Optional submenu
    - identifier: child-id
      name: Child Name
      url: /lang/path/child/  # HARDCODED PATH ⚠️
      # ... same structure
```

**Note:** Some newer components use `url_menu_identifier` instead of hardcoded URLs (e.g., hero.yml), which is the preferred approach.

---

## Files Without Hardcoded URLs (Good Examples)

These files use dynamic references instead of hardcoded paths:
- ✅ `data/homepage/cta.yml` - uses `url_menu_index: 5`
- ✅ `data/homepage/hero.yml` - uses `url_menu_identifier: about` and `url_menu_identifier: contact`
- ✅ `data/homepage/features.yml` - no URLs, purely content-based
- ✅ `data/translations/*/navigation.yml` - only translation labels, no paths

---

## Conclusion

This audit has identified **44 hardcoded URL paths** across **4 data files**, with **16 specific issues** requiring attention. The most critical finding is the inconsistent URL structure between Polish and English versions, which makes maintenance difficult and error-prone.

The recommended approach for future refactoring is to:
1. Fix immediate issues (trailing slashes, footer URLs)
2. Standardize URL patterns across languages
3. Transition to identifier-based URL references (like hero.yml already does)
4. Implement automated URL generation from content structure

This will make the site more maintainable and reduce the risk of broken links during content updates.

---

**Audit Completed By:** Claude (Anthropic)
**Next Steps:** Review findings and prioritize refactoring tasks
