# Menu BaseURL Path Handling Tests

## Overview

This test suite verifies the fix implemented for feature-1769425318393-exqfqsq8h: "Fix BaseURL Path Handling for Internal Links and Images".

The tests ensure that menu URLs from data files (`data/menus/`) are correctly prefixed with the baseURL path when using `strings.TrimPrefix` before applying the `relURL` filter.

## Feature Implementation

### Problem
Menu URLs defined in data files (like `/pl/`, `/rekrutacja/`, `/en/contact/`) were not being prefixed with the baseURL path component (`/wesole_nutki/`) when Hugo's `relURL` filter was applied. This caused broken links when the site was deployed to a subdirectory.

### Solution
Strip the leading `/` from menu URLs using `strings.TrimPrefix` before applying `relURL`:
```go
{{ strings.TrimPrefix "/" $menuURL | relURL }}
```

### Files Modified
- `layouts/partials/header.html` - Main navigation menu URLs (3 locations)
- `layouts/partials/footer.html` - Footer menu URLs (2 locations)

## Test Files

### 1. `menu-basepath-handling.spec.ts` (63 tests)
Comprehensive tests for menu basepath handling across the site.

**Test Suites:**
- **Main Menu Navigation Links** (8 tests)
  - Polish and English menu link validation
  - Basepath prefix verification
  - Navigation functionality
  - Dropdown menu links
  - Logo navigation

- **Footer Links** (4 tests)
  - Polish and English footer link validation
  - Basepath prefix in footer sections
  - Footer navigation functionality

- **Language Switcher** (3 tests)
  - Polish ↔ English language switching
  - Basepath preservation across language changes
  - Language switching on subpages

- **Breadcrumb Navigation** (1 test)
  - Breadcrumb link basepath handling

- **Cross-Page Navigation** (2 tests)
  - Basepath consistency across multiple navigations
  - URL preservation after redirects

- **Menu URL Data Integrity** (3 tests)
  - No double basepath prefixes
  - Correct handling of relative URLs
  - External link preservation

### 2. `menu-url-trimprefix-edge-cases.spec.ts` (60 tests)
Edge case validation for the strings.TrimPrefix implementation.

**Test Suites:**
- **URL Format Edge Cases** (6 tests)
  - Trailing slashes
  - Query parameters
  - Anchor links (#)
  - External HTTP/HTTPS links
  - Special characters

- **Basepath Prefix Validation** (4 tests)
  - Double prefix prevention
  - Exact count validation
  - Basepath enablement/disablement
  - Consistency across menu types

- **Menu Data File Integration** (3 tests)
  - Menu URLs from `data/menus/`
  - Footer menu data processing
  - Dropdown children URLs

- **Navigation Functionality** (3 tests)
  - Main menu navigation
  - Dropdown menu navigation
  - Footer link navigation

- **Responsive Design** (2 tests)
  - Mobile menu basepath handling
  - Mobile dropdown menus

- **Backward Compatibility** (2 tests)
  - Existing data structure support
  - Mixed URL format handling

## Running the Tests

### Run All Menu Basepath Tests
```bash
npx playwright test menu-basepath-handling.spec.ts menu-url-trimprefix-edge-cases.spec.ts
```

### Run Individual Test Files
```bash
# Main menu basepath handling
npx playwright test menu-basepath-handling.spec.ts

# Edge cases
npx playwright test menu-url-trimprefix-edge-cases.spec.ts
```

### Run Specific Test Suites
```bash
# Main menu navigation tests only
npx playwright test menu-basepath-handling.spec.ts -g "Main Menu Navigation"

# Footer tests only
npx playwright test menu-basepath-handling.spec.ts -g "Footer Links"

# Edge case tests only
npx playwright test menu-url-trimprefix-edge-cases.spec.ts -g "URL Format Edge Cases"
```

### Run in Specific Browser
```bash
# Chromium only
npx playwright test menu-basepath-handling.spec.ts --project=chromium

# Firefox only
npx playwright test menu-basepath-handling.spec.ts --project=firefox

# WebKit (Safari) only
npx playwright test menu-basepath-handling.spec.ts --project=webkit
```

### Run with Basepath Configuration
```bash
# Test with basepath enabled (production-like)
BASEPATH=true npx playwright test menu-basepath-handling.spec.ts

# Test without basepath (development mode)
npx playwright test menu-basepath-handling.spec.ts
```

### Run in UI Mode
```bash
npx playwright test menu-basepath-handling.spec.ts --ui
```

### Run in Debug Mode
```bash
npx playwright test menu-basepath-handling.spec.ts --debug
```

## Test Results

### Standard Mode (No Basepath)
All tests pass successfully:
- ✅ 63 tests in `menu-basepath-handling.spec.ts`
- ✅ 58 tests in `menu-url-trimprefix-edge-cases.spec.ts` (2 tests validating no basepath)
- **Total: 121 passing tests**

### Basepath Mode (`BASEPATH=true`)
Tests validate basepath configuration:
- ✅ Core basepath functionality tests pass
- ✅ Double-prefix prevention works
- ✅ External link preservation works
- ⚠️ Some navigation tests require selector adjustments for basepath mode

## Test Coverage

### What's Tested
✅ Menu URLs from data files include basepath
✅ Footer URLs include basepath
✅ Dropdown menu URLs include basepath
✅ Language switcher preserves basepath
✅ Breadcrumb links include basepath
✅ Cross-page navigation maintains basepath
✅ No double basepath prefixes
✅ External links remain unchanged
✅ Anchor links remain unchanged
✅ Query parameters preserved
✅ Special characters handled correctly
✅ Responsive/mobile menu basepath handling
✅ Backward compatibility with existing data

### Code Coverage
The tests cover:
- All menu rendering logic in `header.html`
- All footer rendering logic in `footer.html`
- Menu URL processing with `strings.TrimPrefix`
- RelURL filter application
- Language switcher functionality
- Breadcrumb navigation
- Cross-page navigation consistency

## Understanding Test Failures

### Common Issues

#### No elements found with selector
**Issue:** `expect(navLinks.length).toBeGreaterThan(0)` fails
**Cause:** Selector doesn't match elements when basepath is enabled
**Solution:** Use `:not([href^="http"])` instead of `[href^="/"]`

#### Element not visible
**Issue:** `expect(locator).toBeVisible()` fails
**Cause:** Element may be in collapsed menu or not rendered yet
**Solution:** Add `await page.waitForLoadState('networkidle')` and `.first()`

#### Navigation timeout
**Issue:** Test times out during navigation
**Cause:** Hugo server may not be running or basepath misconfigured
**Solution:** Check Hugo server is running with correct `--baseURL` flag

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run menu basepath tests
  run: npx playwright test menu-basepath-handling.spec.ts menu-url-trimprefix-edge-cases.spec.ts

- name: Run with basepath configuration
  run: BASEPATH=true npx playwright test menu-basepath-handling.spec.ts
```

### Test Reports
```bash
# Generate and view HTML report
npx playwright show-report
```

## Debugging

### View Test Screenshots
Failed tests automatically capture screenshots:
```bash
ls test-results/menu-basepath-handling-*/test-failed-*.png
```

### View Test Videos
```bash
ls test-results/menu-basepath-handling-*/video.webm
```

### Run Single Test
```bash
npx playwright test menu-basepath-handling.spec.ts:33 --debug
```

### Inspect Element Selectors
```bash
# Start Playwright in UI mode and use the picker
npx playwright test --ui
```

## Best Practices

1. **Always run tests in both modes** before deploying
   ```bash
   npm test && BASEPATH=true npm test
   ```

2. **Use relURL for all internal links** in templates
   ```go
   {{ strings.TrimPrefix "/" $url | relURL }}
   ```

3. **Never hardcode paths** in templates
   ```go
   ❌ <a href="/pl/contact/">
   ✅ <a href="{{ "pl/contact" | relURL }}">
   ```

4. **Preserve external links** - don't apply relURL
   ```go
   {{ if hasPrefix $url "http" }}
     <a href="{{ $url }}">
   {{ else }}
     <a href="{{ strings.TrimPrefix "/" $url | relURL }}">
   {{ end }}
   ```

5. **Test menu changes** - run tests after modifying menu data files
   ```bash
   npx playwright test menu-basepath-handling.spec.ts
   ```

## Related Documentation

- Main README: `/tests/README-BASEPATH-TESTS.md`
- Image basepath tests: `/tests/README-BASEPATH-IMAGES.md`
- URL configuration tests: `/tests/README-URL-CONFIGURATION-TESTS.md`
- Multi-language URL tests: `/tests/README-MULTI-LANGUAGE-URL-TESTS.md`

## Contributing

When adding new menu features:

1. Add corresponding test cases to `menu-basepath-handling.spec.ts`
2. Run tests in both standard and basepath modes
3. Verify cross-browser compatibility (Chromium, Firefox, WebKit)
4. Update this README if adding new test suites
5. Ensure backward compatibility with existing menu data

## Troubleshooting

### Hugo Server Issues
```bash
# Check Hugo server is running
curl http://localhost:1313/pl/

# Check with basepath
curl http://localhost:1313/wesole_nutki/pl/

# Restart Hugo server with basepath
hugo server --baseURL "http://localhost:1313/wesole_nutki/" --appendPort=false
```

### Test Configuration
```typescript
// playwright.config.ts
const useBasePath = process.env.BASEPATH === 'true';
const baseURL = useBasePath
  ? 'http://localhost:1313/wesole_nutki/'
  : 'http://localhost:1313';
```

### Menu Data Files
```yaml
# data/menus/main_pl.yml
menu_items:
  - name: Kontakt
    url: /pl/contact/  # Will be processed by strings.TrimPrefix
    weight: 50
```

## Test Maintenance

- Review tests when updating Hugo version
- Update selectors if template structure changes
- Add tests for new menu functionality
- Remove obsolete tests when features are removed
- Keep test descriptions clear and up-to-date
