# T007: External URLs and Protocol Links Preservation

## Task Summary

Task T007 ensures that external URLs and special protocol links (mailto:, tel:, ftp:, etc.) are preserved exactly as written in the source without any basepath modifications or transformations.

## Implementation Status

✅ **COMPLETE** - The existing implementation in `layouts/_default/_markup/render-link.html` already handles this correctly.

## What Was Done

### 1. Verification of Existing Implementation

The markdown link render hook (`layouts/_default/_markup/render-link.html`) already contains comprehensive URL type detection and preservation logic:

**Lines 68-71: Protocol URL Detection**
```go
{{- else if or (hasPrefix $url "mailto:") (hasPrefix $url "tel:") (hasPrefix $url "javascript:") (hasPrefix $url "data:") (hasPrefix $url "ftp:") (hasPrefix $url "file:") -}}
  {{- $urlType = "protocol" -}}
  {{/* Protocol URLs: no processing needed, preserve as-is */}}
```

**Lines 74-95: External URL Detection with Smart Same-Domain Handling**
```go
{{- else if or (hasPrefix $url "http://") (hasPrefix $url "https://") (hasPrefix $url "//") -}}
  {{- $urlType = "absolute" -}}
  {{- $isExternal = true -}}

  {{/* Smart External Detection: Check if URL points to same domain */}}
  {{- $siteHost := "" -}}
  {{- with urls.Parse site.BaseURL -}}
    {{- $siteHost = .Host -}}
  {{- end -}}

  {{- if $siteHost -}}
    {{- with urls.Parse $url -}}
      {{- if eq .Host $siteHost -}}
        {{/* Same domain: treat as internal, not external */}}
        {{- $isExternal = false -}}
      {{- end -}}
    {{- end -}}
  {{- end -}}
```

This implementation:
- ✅ Preserves all protocol-based URLs unchanged (mailto:, tel:, ftp:, file:, javascript:, data:)
- ✅ Preserves external HTTP/HTTPS URLs unchanged
- ✅ Preserves protocol-relative URLs (//) unchanged
- ✅ Intelligently detects same-domain absolute URLs and treats them as internal
- ✅ Does NOT apply basepath transformations to any of these URL types

### 2. Comprehensive Test Coverage

Created `tests/external-protocol-preservation.spec.ts` with 72 test cases covering:

#### External HTTP/HTTPS Links (4 tests)
- ✅ Preserves external HTTP URLs unchanged
- ✅ Preserves external HTTPS URLs unchanged
- ✅ Opens external links in new tab with security attributes (target="_blank", rel="noopener noreferrer")
- ✅ Preserves protocol-relative URLs (//)

#### mailto: Protocol Links (3 tests)
- ✅ Preserves mailto: links unchanged
- ✅ Does not open mailto: links in new tab
- ✅ Handles mailto: links with subject and body parameters

#### tel: Protocol Links (3 tests)
- ✅ Preserves tel: links unchanged
- ✅ Does not open tel: links in new tab
- ✅ Handles international phone number formats

#### Other Protocol Links (4 tests)
- ✅ Preserves ftp: links unchanged
- ✅ Preserves data: URIs unchanged
- ✅ Preserves file: protocol links unchanged
- ✅ Preserves javascript: protocol links unchanged

#### External URLs in Different Contexts (4 tests)
- ✅ Preserves external URLs in footer links
- ✅ Preserves external URLs in social media links
- ✅ Preserves external PDF links
- ✅ Preserves external image URLs in old content

#### Mixed Content Validation (2 tests)
- ✅ Does not mix internal and external URL patterns
- ✅ Preserves external URLs in markdown content

#### Same-Domain External URLs (1 test)
- ✅ Detects same-domain absolute URLs as internal (does not open in new tab)

#### Edge Cases (3 tests)
- ✅ Preserves external URLs with query parameters
- ✅ Preserves external URLs with fragments
- ✅ Preserves URLs with special characters

### 3. Test Results

All 72 tests pass across all browsers (Chromium, Firefox, WebKit):
```
72 passed (25.3s)
```

## URL Type Categories

The implementation correctly handles these URL types:

| URL Type | Example | Processing | Opens in New Tab? |
|----------|---------|------------|-------------------|
| Empty URLs | `""` | No processing | No |
| Anchor URLs | `#section` | No processing | No |
| Protocol URLs | `mailto:`, `tel:`, `ftp:`, etc. | **Preserved as-is** | No |
| External URLs | `http://`, `https://` | **Preserved as-is** | Yes (if different domain) |
| Protocol-relative | `//example.com` | **Preserved as-is** | Yes |
| Root-relative | `/en/about/` | Base path applied | No |
| Relative | `./page` | Base path applied | No |

## Key Features

### 1. Protocol Preservation
All special protocol links are preserved exactly as written:
- ✅ `mailto:contact@example.com` → unchanged
- ✅ `tel:+48123456789` → unchanged
- ✅ `ftp://files.example.com/doc.pdf` → unchanged
- ✅ `data:image/svg+xml;base64,...` → unchanged
- ✅ `javascript:void(0)` → unchanged
- ✅ `file:///path/to/file` → unchanged

### 2. External URL Preservation
All external URLs are preserved unchanged:
- ✅ `https://www.facebook.com/page` → unchanged
- ✅ `http://example.com` → unchanged
- ✅ `//cdn.example.com/file.js` → unchanged

### 3. Smart Same-Domain Detection
Absolute URLs pointing to the same domain are treated as internal:
- If site is hosted at `wesolenutki.eu`
- Link `https://wesolenutki.eu/pl/about/` → treated as internal (no new tab)
- Link `https://google.com` → treated as external (opens in new tab)

### 4. Security Attributes
External links automatically get security attributes:
- `target="_blank"` - Opens in new tab
- `rel="noopener noreferrer"` - Prevents security vulnerabilities

## Files Modified/Created

### Created Files
1. `tests/external-protocol-preservation.spec.ts` - Comprehensive test suite (72 tests)
2. `docs/T007-EXTERNAL-URL-PRESERVATION.md` - This documentation

### No Code Changes Required
The existing implementation in `layouts/_default/_markup/render-link.html` already handles all requirements correctly. No modifications were needed.

## Verification

To verify the implementation:

```bash
# Run all external protocol preservation tests
npm test -- tests/external-protocol-preservation.spec.ts

# Run tests for specific protocol
npm test -- tests/external-protocol-preservation.spec.ts --grep "mailto"
npm test -- tests/external-protocol-preservation.spec.ts --grep "tel:"
npm test -- tests/external-protocol-preservation.spec.ts --grep "external"
```

## Examples from Live Site

### Contact Page
The contact page (`/pl/contact/`) correctly preserves:
- Email: `mailto:przedszkole@wesolenutki.eu` ✅
- Phone: `tel:530114202` ✅
- External links to social media ✅

### Footer
The footer correctly preserves:
- Facebook: `https://www.facebook.com/NutkiWroclaw/` ✅
- Opens in new tab with security attributes ✅

### Markdown Content
Articles correctly preserve:
- External links in content ✅
- Protocol links for email/phone ✅
- External PDF downloads ✅

## Conclusion

Task T007 is **COMPLETE**. The existing Hugo markdown link render hook already implements comprehensive URL type detection and correctly preserves external URLs and protocol links unchanged. The implementation has been verified with 72 comprehensive tests covering all edge cases and scenarios.

No code changes were required - only test coverage was added to verify and document the existing correct behavior.
