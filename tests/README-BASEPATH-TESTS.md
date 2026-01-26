# Basepath Image Tests

## Overview

The `basepath-images.spec.ts` test file verifies that all images on the website are correctly resolved with both standard and basepath configurations. This is critical for ensuring the site works correctly when deployed to a subdirectory (e.g., `/wesole_nutki/`).

## What This Test Covers

### Image Path Verification
- Gallery images (single and list views)
- News article images
- Hero background images
- About page images
- Responsive image srcsets
- Lightbox image paths

### Cross-Browser Testing
- WebP image support
- Fallback to original format
- Different browsers (Chromium, Firefox, WebKit)

### Responsive Design
- Mobile viewport image loading
- Desktop viewport image loading
- Appropriate image sizes for different viewports

### Multi-Language Support
- Polish page images
- English page images
- Image path consistency when switching languages

### Error Handling
- Broken image detection
- Graceful error fallback UI

## Running the Tests

### Standard Mode (No Basepath)
```bash
npm run test
```
or
```bash
npx playwright test basepath-images.spec.ts
```

This tests images with URLs like: `http://localhost:1313/images/gallery/...`

### Basepath Mode
```bash
npm run test:basepath
```
or
```bash
BASEPATH=true npx playwright test basepath-images.spec.ts
```

This tests images with URLs like: `http://localhost:1313/wesole_nutki/images/gallery/...`

### Run Only Image Tests
```bash
# Standard mode
npx playwright test basepath-images.spec.ts

# Basepath mode
BASEPATH=true npx playwright test basepath-images.spec.ts
```

### Run in Specific Browser
```bash
# Chromium only
npx playwright test basepath-images.spec.ts --project=chromium

# Firefox only
npx playwright test basepath-images.spec.ts --project=firefox

# WebKit (Safari) only
npx playwright test basepath-images.spec.ts --project=webkit
```

### Run in UI Mode
```bash
npx playwright test basepath-images.spec.ts --ui
```

### Run in Debug Mode
```bash
npx playwright test basepath-images.spec.ts --debug
```

## Test Structure

### 1. Image Paths with Basepath
Main test suite covering all image loading scenarios:

#### Gallery Images
- ✅ Load gallery images with correct paths
- ✅ Valid srcset attributes on responsive images
- ✅ Open lightbox with correctly pathed images

#### Gallery List Images
- ✅ Load gallery card images with correct paths

#### News Images
- ✅ Load news article images with correct paths
- ✅ Load featured images on news single pages

#### Hero Background Images
- ✅ Load hero background images with correct paths

#### About Page Images
- ✅ Load team member images with correct paths

#### Image Loading and Error Handling
- ✅ No broken images on homepage
- ✅ Graceful error handling with fallback UI

#### Cross-browser Image Compatibility
- ✅ WebP image support where available
- ✅ Fallback to original format when WebP unavailable

#### Responsive Image Loading
- ✅ Appropriate image sizes on mobile viewport
- ✅ Appropriate image sizes on desktop viewport

### 2. Image Path Consistency Across Languages
- ✅ Load images correctly on Polish pages
- ✅ Load images correctly on English pages
- ✅ Maintain correct paths when switching languages

## Understanding Test Results

### Expected Behavior

**Without Basepath:**
```
Image src: /images/gallery/photo.jpg
Expected: ✅ Starts with /
```

**With Basepath:**
```
Image src: /wesole_nutki/images/gallery/photo.jpg
Expected: ✅ Starts with /wesole_nutki/
```

### Common Issues

#### ❌ Images not loading
- Check if Hugo server is running
- Verify image files exist in `static/images/` or `assets/`
- Check console for 404 errors

#### ❌ Basepath tests failing
- Ensure `BASEPATH=true` environment variable is set
- Verify Hugo server is running with correct baseURL
- Check `playwright.config.ts` basepath configuration

#### ❌ Lightbox images not opening
- Check GLightbox library is loaded
- Verify JavaScript is enabled
- Check browser console for errors

## CI/CD Integration

### Run Both Standard and Basepath Tests
```bash
# Standard mode
npm run test:basepath:off

# Basepath mode
npm run test:basepath

# Or manually:
npx playwright test basepath-images.spec.ts && \
BASEPATH=true npx playwright test basepath-images.spec.ts
```

### GitHub Actions Example
```yaml
- name: Run standard image tests
  run: npm run test basepath-images.spec.ts

- name: Run basepath image tests
  run: npm run test:basepath basepath-images.spec.ts
```

## Debugging Tips

### View Test Report
```bash
npx playwright show-report
```

### Take Screenshots on Failure
Tests automatically take screenshots on failure. Check `test-results/` directory.

### Inspect Network Requests
```bash
npx playwright test basepath-images.spec.ts --debug
```

Then use the Playwright Inspector to:
- Step through test execution
- Inspect network requests
- View loaded images
- Check image URLs

### Check Image Paths Manually
1. Start Hugo server with basepath:
   ```bash
   npm run dev:basepath
   ```

2. Open browser to `http://localhost:1313/wesole_nutki/pl/`

3. Inspect image elements:
   ```javascript
   // In browser console
   document.querySelectorAll('img').forEach(img => {
     console.log(img.src);
   });
   ```

4. Verify all URLs include `/wesole_nutki/` prefix

## Configuration

### Playwright Config
See `playwright.config.ts` for basepath configuration:

```typescript
const useBasePath = process.env.BASEPATH === 'true';
const baseURL = useBasePath
  ? 'http://localhost:1313/wesole_nutki/'
  : 'http://localhost:1313';
```

### Hugo Config
Basepath is configured via command-line `--baseURL` flag:

```bash
# Standard
hugo server --port 1313

# With basepath
hugo server --port 1313 --baseURL http://localhost:1313/wesole_nutki/
```

## Best Practices

1. **Always run tests in both modes** before deploying
2. **Use relURL or absURL** in Hugo templates for all assets
3. **Test on all three browsers** (Chromium, Firefox, WebKit)
4. **Check responsive images** work correctly on mobile
5. **Verify language switching** maintains correct paths
6. **Monitor for broken images** on production

## Contributing

When adding new image features:

1. Add corresponding test cases to `basepath-images.spec.ts`
2. Test both standard and basepath modes
3. Verify cross-browser compatibility
4. Check responsive behavior
5. Update this README if needed

## Related Files

- `tests/basepath-images.spec.ts` - Image path tests
- `playwright.config.ts` - Playwright configuration
- `layouts/partials/responsive-image.html` - Image rendering partial
- `package.json` - Test scripts
