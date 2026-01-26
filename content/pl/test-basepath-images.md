---
title: "Test Image BasePath"
date: 2026-01-26T10:00:00+01:00
draft: false
description: "Test page for verifying image basepath handling"
---

# Image BasePath Feature Test Page

This page contains various image types to test that Hugo correctly handles baseURL configuration
for images in markdown content. When deployed to a subdirectory (e.g., `/wesole_nutki/`), all
internal image paths should automatically include the base path prefix.

**Purpose**: Verify that Hugo's `.RelPermalink` and `relURL` functions correctly prepend the
configured baseURL to all internal images while leaving external URLs unchanged.

---

## Test 1: Assets Images (Processed by Hugo)

**What's being tested**: Images from the `assets/images/` directory that Hugo processes.

**Expected behavior**:
- Hugo processes these images (resize, WebP conversion, fingerprinting)
- URLs use `.RelPermalink` which includes baseURL prefix
- Fingerprint hash added to filename (e.g., `_hu_abc123`)
- Responsive srcset generated with multiple sizes
- All URLs in srcset include baseURL prefix

**Test images**:

![Sample Image 1](/images/sample-1.jpg)
*This tests basic asset processing with baseURL*

![Sample Image 2](/images/sample-2.jpg)
*This verifies multiple assets are handled consistently*

---

## Test 2: Static Images (Not Processed)

**What's being tested**: Images from the `static/images/` directory served as-is.

**Expected behavior**:
- Hugo serves these files without processing
- URLs use `relURL` filter which includes baseURL prefix
- No fingerprint hash added (static files not processed)
- No responsive variants generated
- Original file served directly

**Test images**:

![Hero Background](/images/hero-bg.svg)
*SVG files should be served without processing but with baseURL*

![About Preview](/images/about-preview.jpg)
*Static JPEG files should include baseURL but no fingerprinting*

---

## Test 3: External URLs (Should Not Be Modified)

**What's being tested**: Images from external sources (https://).

**Expected behavior**:
- URLs remain completely unchanged
- No baseURL prefix added
- No Hugo processing applied
- External URL passed through as-is

**Test images**:

![External Image](https://via.placeholder.com/300x200)
*External image URL should remain unchanged - no baseURL prefix*

---

## Test 4: Edge Cases

### Relative Path
**What's being tested**: Relative paths that navigate up directories.

**Expected behavior**: Hugo resolves relative paths and applies baseURL correctly.

![About Background](../images/about-hero-bg.svg)
*Relative path should resolve correctly with baseURL*

### Already Absolute URL
**What's being tested**: Another external URL format.

**Expected behavior**: External URLs should pass through unchanged.

![Placeholder](https://example.com/image.jpg)
*Absolute external URL should not be modified*

---

## Test Summary

This page tests the following scenarios:
1. ✅ Assets images processed with `.RelPermalink` (includes baseURL + fingerprint)
2. ✅ Static images served with `relURL` filter (includes baseURL, no fingerprint)
3. ✅ External URLs remain unchanged (no baseURL prefix)
4. ✅ Relative paths resolve correctly (Hugo handles path resolution)
5. ✅ Responsive images include baseURL in all srcset variants
6. ✅ No double slashes or double basepaths in any URLs

**Configuration tested**: `baseURL = "https://bartusiak.ai/wesole_nutki/"`
