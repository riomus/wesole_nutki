# URL Documentation Index

**Project:** Wesołe Nutki Hugo Site
**Date:** 2026-01-26
**Purpose:** Central index for all URL-related documentation

---

## Documentation Overview

This index provides a guide to all URL resolution and link behavior documentation for the Wesołe Nutki Hugo website. The documentation is organized to serve different audiences and use cases.

---

## Documentation Structure

### 📚 Core Documentation

#### 1. **URL Link Resolution Behavior**
**File:** `docs/URL_LINK_RESOLUTION_BEHAVIOR.md`
**Size:** ~25 KB
**Audience:** Developers, Technical Leads

**Contents:**
- Complete URL resolution architecture
- Detailed explanations of each link type
- Implementation details with code examples
- Special case handling
- Testing and validation procedures

**Use this for:**
- Understanding how URLs are resolved in different contexts
- Debugging URL-related issues
- Implementing new features that involve links
- Onboarding new developers

---

#### 2. **URL Resolution Diagrams**
**File:** `docs/URL_RESOLUTION_DIAGRAMS.md`
**Size:** ~35 KB
**Audience:** Visual learners, Quick reference

**Contents:**
- Visual flowcharts for URL resolution
- Decision trees for function selection
- Step-by-step processing diagrams
- Quick reference matrices

**Use this for:**
- Quick visual reference
- Understanding resolution flows at a glance
- Teaching URL concepts to team members
- Troubleshooting URL processing logic

---

#### 3. **URL Configuration Testing**
**File:** `docs/URL_CONFIGURATION_TESTING.md`
**Size:** ~5.5 KB
**Audience:** QA Engineers, Testers

**Contents:**
- Testing procedures for URL resolution
- Validation checklist
- Test scenarios and expected results

**Use this for:**
- Validating URL changes
- Pre-deployment testing
- Regression testing after updates

---

### 📋 Reference Documentation

#### 4. **URL Function Audit**
**File:** `URL_FUNCTION_AUDIT.md` (root)
**Size:** ~24 KB
**Audience:** Technical audit, Comprehensive review

**Contents:**
- File-by-file analysis of URL function usage
- Complete inventory of all URL functions
- Pattern analysis across 56 template files
- 110 URL function occurrences documented

**Use this for:**
- Comprehensive codebase understanding
- Refactoring planning
- Code review reference

---

#### 5. **URL Function Usage Guide**
**File:** `URL_FUNCTION_USAGE_GUIDE.md` (root)
**Size:** ~19 KB
**Audience:** Developers, Daily reference

**Contents:**
- Quick decision tree for function selection
- Common patterns and examples
- Known issues and fixes
- Testing checklist
- Examples by context

**Use this for:**
- Daily development reference
- Quick function selection guidance
- Copy-paste code examples
- Best practices review

---

#### 6. **URL Configuration Audit Report**
**File:** `.automaker/features/url-configuration/audit-report.md`
**Size:** ~11 KB
**Audience:** Compliance, Quality assurance

**Contents:**
- Compliance audit results (100% compliant)
- Phase-by-phase template verification
- URL function usage summary
- Best practices checklist
- Testing recommendations

**Use this for:**
- Verification that templates follow best practices
- Compliance confirmation
- Production readiness validation

---

### 📊 Additional Resources

#### 7. **URL Patterns Quick Reference**
**File:** `URL_PATTERNS_QUICK_REFERENCE.md` (root)
**Size:** ~9.2 KB

Quick lookup for common URL patterns and their usage.

---

#### 8. **URL Audit README**
**File:** `URL_AUDIT_README.md` (root)
**Size:** ~8.7 KB

Overview of URL audit process and methodology.

---

#### 9. **URL Function Usage Map**
**File:** `URL_FUNCTION_USAGE_MAP.txt` (root)
**Size:** ~20 KB

Text-based map of URL function locations across codebase.

---

## Documentation by Use Case

### For New Developers

**Start here:**
1. Read `URL_LINK_RESOLUTION_BEHAVIOR.md` - Overview section
2. Review `URL_RESOLUTION_DIAGRAMS.md` - Decision trees
3. Bookmark `URL_FUNCTION_USAGE_GUIDE.md` for daily reference

**Essential sections:**
- URL Resolution Architecture
- Link Types and Resolution Rules
- Quick Function Selection diagrams

---

### For Feature Implementation

**Reference these:**
1. `URL_FUNCTION_USAGE_GUIDE.md` - Quick Decision Tree
2. `URL_LINK_RESOLUTION_BEHAVIOR.md` - Specific link type you're working with
3. `URL_RESOLUTION_DIAGRAMS.md` - Visual flow for your context

**Focus on:**
- Implementation Details section
- Code examples for similar features
- Testing procedures

---

### For Bug Fixing

**Debug with these:**
1. `URL_RESOLUTION_DIAGRAMS.md` - Find the relevant flow
2. `URL_LINK_RESOLUTION_BEHAVIOR.md` - Understand expected behavior
3. `URL_FUNCTION_AUDIT.md` - Find similar implementations

**Check:**
- Special Cases and Edge Handling
- Known issues and fixes in Usage Guide
- Resolution flow diagrams

---

### For Code Review

**Verify against:**
1. `URL_FUNCTION_USAGE_GUIDE.md` - Best practices section
2. `url-configuration/audit-report.md` - Compliance checklist
3. `URL_FUNCTION_AUDIT.md` - Pattern consistency

**Checklist:**
- Function selection matches decision tree
- Follows established patterns
- Handles edge cases properly

---

### For Testing/QA

**Use these:**
1. `URL_CONFIGURATION_TESTING.md` - Test procedures
2. `URL_LINK_RESOLUTION_BEHAVIOR.md` - Expected behaviors
3. `url-configuration/audit-report.md` - Compliance verification

**Test:**
- Development testing procedures
- Production build testing
- Multi-language testing scenarios

---

## Key Concepts Summary

### URL Types Handled

1. **Internal Page Links** - Page-to-page navigation
2. **External Links** - Links to other websites
3. **Static Assets** - Images, icons, downloads
4. **Processed Resources** - Optimized CSS, JS, images
5. **Taxonomy Links** - Categories, tags, gallery categories
6. **SEO Metadata** - Canonical URLs, Open Graph
7. **Language Switching** - Multilingual navigation
8. **Breadcrumbs** - Hierarchical navigation
9. **Special Protocols** - mailto:, tel:, etc.
10. **Anchor Links** - In-page navigation

### Hugo Functions Reference

| Function | Purpose | Documentation |
|----------|---------|---------------|
| `.RelPermalink` | Internal links, assets | All docs |
| `.Permalink` | SEO metadata | Link Resolution Behavior |
| `relURL` | Static assets | Function Usage Guide |
| `absURL` | Absolute asset URLs | Function Usage Guide |
| `relLangURL` | Language-aware links | Link Resolution Behavior |
| `absLangURL` | Language home fallback | Link Resolution Behavior |
| `urlize` | Sanitize strings | Function Usage Guide |

### Configuration Settings

```toml
# hugo.toml
baseURL = "https://wesolenutkiprzemysl.pl/wesole_nutki/"
canonifyURLs = false  # Let Hugo functions handle URLs
relativeURLs = false  # Use baseURL-relative paths
```

See: `URL_LINK_RESOLUTION_BEHAVIOR.md` - Base Configuration

---

## Quick Reference by Context

### Need to add a page link?
→ Use `.RelPermalink`
→ See: Function Usage Guide, page 87-92

### Need to add an image?
→ Processed: `.RelPermalink`
→ Static: `relURL`
→ See: Link Resolution Behavior - Section 4

### Need to add SEO metadata?
→ Canonical: `.Permalink`
→ OG Image: `absURL`
→ See: Link Resolution Behavior - Section 6

### Need to add category/tag links?
→ Use taxonomy objects + `.Page.RelPermalink`
→ See: Link Resolution Behavior - Section 3

### Need to add menu links?
→ Internal: `relURL`
→ External: use as-is
→ See: Link Resolution Behavior - Section 1

---

## Documentation Maintenance

### When to Update

Update documentation when:
- Adding new URL resolution patterns
- Changing Hugo configuration
- Implementing new link types
- Fixing URL-related bugs (document the fix)
- Migrating to new Hugo version

### How to Update

1. Update primary documentation:
   - `URL_LINK_RESOLUTION_BEHAVIOR.md` for new behaviors
   - `URL_RESOLUTION_DIAGRAMS.md` for new flows
   - `URL_FUNCTION_USAGE_GUIDE.md` for new patterns

2. Update reference documentation:
   - Re-run audit if major changes
   - Update audit report for compliance changes

3. Update this index if structure changes

---

## Related Documentation

### Hugo Official Docs
- [Hugo URL Management](https://gohugo.io/content-management/urls/)
- [Hugo Functions: relURL](https://gohugo.io/functions/relurl/)
- [Hugo Functions: absURL](https://gohugo.io/functions/absurl/)
- [Hugo Permalinks](https://gohugo.io/content-management/urls/#permalinks)

### Project-Specific
- `README.md` - Project overview
- `hugo.toml` - Configuration file
- `layouts/partials/url-type-detector.html` - URL type detection partial

---

## Troubleshooting Guide

### Common Issues

#### Issue: Links not working in subdirectory deployment
**Solution:** Verify `baseURL` includes `/wesole_nutki/` path
**See:** Link Resolution Behavior - Base Configuration

#### Issue: Active menu states not highlighting
**Solution:** Check URL comparison logic strips base path correctly
**See:** Resolution Diagrams - Active Menu State Detection Flow

#### Issue: Images not loading
**Solution:** Check if using `.RelPermalink` for processed images, `relURL` for static
**See:** Link Resolution Behavior - Section 4 (Image URLs)

#### Issue: Social sharing shows wrong images
**Solution:** Use `absURL` for Open Graph images (not `relURL`)
**See:** Link Resolution Behavior - Section 6 (SEO and Social Media)

#### Issue: Language switcher goes to wrong page
**Solution:** Check translation detection and fallback logic
**See:** Resolution Diagrams - Language Switcher Resolution

---

## Version History

### Version 1.0 (2026-01-26)
- Initial documentation creation
- Comprehensive URL resolution behavior documented
- Visual diagrams added
- Testing procedures documented
- All existing URL patterns catalogued

---

## Contact & Contributions

For questions or improvements to this documentation:
- Review existing docs first
- Check troubleshooting guide
- Document any new patterns discovered
- Keep examples current with codebase

---

**Index Version:** 1.0
**Last Updated:** 2026-01-26
**Maintained By:** Development Team
**Total Documentation:** 9 files, ~150 KB of URL documentation
