# Menu Data Audit - Action Items

**Related to:** T002 - Audit menu data files for hardcoded paths
**Full Audit Report:** See `MENU_DATA_AUDIT.md`

## Quick Summary

- **Total Hardcoded URLs Found:** 44
- **Files with Issues:** 4
- **Critical Issues:** 8
- **Medium Priority Issues:** 3
- **Low Priority Issues:** 2

---

## Immediate Action Required (Critical Issues)

### 1. Fix Missing Trailing Slash in Polish Menu
**File:** `data/menus/main_pl.yml`
**Line:** 39
**Current:** `url: /pl/programs/schedule`
**Should be:** `url: /pl/programs/schedule/`
**Impact:** May cause routing issues or inconsistent behavior

---

### 2. Fix All Footer URLs (Currently Broken)
**File:** `data/footer.yml`
**Lines:** 13-46
**Status:** Footer currently uses main menu (line 8: `use_main_menu: true`), but custom links are broken
**Issue:** All 8 custom footer URLs are missing language prefixes

**URLs that need fixing:**
```yaml
# Current (BROKEN if enabled)
url: "/"                # Should be: "/pl/" or "/en/"
url: "/about/"          # Should be: "/pl/about/" or "/en/about/"
url: "/programs/"       # Should be: "/pl/programs/" or "/en/programs/"
url: "/gallery/"        # Should be: "/pl/gallery/" or "/en/gallery/"
url: "/contact/"        # Should be: "/pl/contact/" or "/en/contact/"
url: "/privacy/"        # Should be: "/pl/o-przedszkolu/polityka-prywatnosci/" or "/en/documents/privacy-policy/"
url: "/terms/"          # No matching page exists - needs creation or removal
url: "/faq/"            # No matching page exists - needs creation or removal
```

**Action Required:**
- Either fix these URLs with proper language prefixes and correct paths
- Or remove them since `use_main_menu: true` means they're not being used

---

### 3. Fix Recruitment Section URLs
**File:** `data/homepage/recruitment.yml`
**Line:** 24
**Current:** `documents_page_url: "/pl/documents/"`
**Issue:** Hardcoded to Polish language only

**Action Required:**
- Make this language-aware OR
- Use a menu identifier reference instead

---

## Medium Priority Issues

### 4. Inconsistent URL Structure Between Languages
**Files:** `data/menus/main_pl.yml` and `data/menus/main_en.yml`

**Examples of inconsistencies:**

| Purpose | Polish | English | Issue |
|---------|--------|---------|-------|
| Weekly Plan | `/pl/plan-zajec/` | `/en/schedule/` | Completely different paths |
| Vision | `/pl/o-przedszkolu/nasza-wizja/` | `/en/about/vision/` | Different structure (o-przedszkolu vs about) |
| Privacy | `/pl/o-przedszkolu/polityka-prywatnosci/` | `/en/documents/privacy-policy/` | Different sections entirely |

**Action Required:**
- Decide on a consistent URL structure strategy
- Either use: `/pl/about/vision/` and `/en/about/vision/` (consistent structure)
- Or use: `/pl/o-przedszkolu/wizja/` and `/en/about/vision/` (localized slugs)

---

### 5. Path Structure Standardization Needed
**All menu files**

**Current situation:**
- Some paths use translated slugs (e.g., `/pl/rekrutacja/`, `/en/recruitment/`)
- Some paths have different nesting levels between languages
- Inconsistent use of parent path prefixes

**Action Required:**
- Create a URL structure standard document
- Define nesting rules (max depth, required prefixes)
- Decide on slug localization strategy

---

### 6. Missing Cross-Language Path Mapping
**All menu files**

**Issue:** No clear mapping between equivalent pages in different languages

**Action Required:**
- Create a mapping document showing PL ↔ EN path equivalents
- Consider adding `cross_language_ref` field to menu items
- Implement language switcher logic based on this mapping

---

## Low Priority (Maintenance)

### 7. Deep Nesting in Some Menu Items
**Example:** `/pl/plan-dnia/zajecia-dodatkowe/` (3 levels deep)

**Action Required:**
- Consider flattening structure where possible
- Balance between URL readability and SEO

---

### 8. Inconsistent Trailing Slashes
**Most URLs have trailing slashes, but found at least one without**

**Action Required:**
- Audit for any other missing trailing slashes
- Establish rule: always use trailing slashes for directory-style URLs

---

## Future Refactoring Opportunities

### A. Implement URL Helper Functions
Instead of hardcoded URLs, use:
```yaml
# Current
url: /pl/about/

# Future
url_type: page_reference
page_identifier: about
# URL generated dynamically based on current language
```

**Benefits:**
- Single source of truth for paths
- Automatic language switching
- Easier to refactor URL structure

---

### B. Leverage Hugo's Built-in Menu System
Consider using Hugo's native menu system with content files:
```yaml
# In content file front matter
menu:
  main:
    identifier: about
    weight: 3
```

**Benefits:**
- URLs automatically generated from content location
- No manual URL maintenance
- Built-in language handling

---

### C. Create Menu Management UI Improvements
**For CMS admin interface:**
- Add URL validation
- Show warnings for language-inconsistent paths
- Provide URL preview based on identifier
- Auto-suggest URLs based on content structure

---

## Testing Checklist (Before Any Changes)

Before implementing fixes, verify:
- [ ] All current menu URLs actually work (test both PL and EN)
- [ ] Identify any URLs that point to non-existent pages
- [ ] Check if any content pages are NOT linked in menus (orphaned pages)
- [ ] Test language switcher functionality with current URLs
- [ ] Document any special URL handling in custom templates

---

## Files Analyzed in Audit

### Menu & Navigation Files
1. ✅ `data/menus/main_pl.yml` - 17 URLs
2. ✅ `data/menus/main_en.yml` - 17 URLs
3. ✅ `data/footer.yml` - 8 URLs (broken, not in use)
4. ✅ `data/translations/pl/navigation.yml` - No URLs (labels only)
5. ✅ `data/translations/en/navigation.yml` - No URLs (labels only)

### Component Files with URLs
6. ✅ `data/homepage/recruitment.yml` - 2 URLs
7. ✅ `data/homepage/hero.yml` - Uses identifiers ✨ (good example)
8. ✅ `data/homepage/cta.yml` - Uses menu index ✨ (good example)

### Files Without URLs (Clean)
- ✅ `data/homepage/features.yml`
- ✅ `data/homepage/about.yml`
- ✅ `data/homepage/stats.yml`
- ✅ `data/homepage/news.yml`
- ✅ `data/about/*` (all files)

---

## Recommended Approach

### Phase 1 (Immediate - This Week)
1. ✅ Fix trailing slash in main_pl.yml
2. ✅ Decide on footer.yml strategy (fix or remove custom links)
3. ✅ Make recruitment URLs language-aware

### Phase 2 (Short-term - Next Sprint)
4. 📋 Standardize URL structure between PL and EN
5. 📋 Create cross-language URL mapping document
6. 📋 Audit all URLs to ensure they point to existing content

### Phase 3 (Long-term - Future Enhancement)
7. 🔮 Implement URL helper system
8. 🔮 Migrate to identifier-based URL references
9. 🔮 Consider Hugo built-in menu system migration

---

**Note:** See `MENU_DATA_AUDIT.md` for complete detailed analysis and findings.
