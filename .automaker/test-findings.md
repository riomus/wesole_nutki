# Production Build Local Testing - Issue Reproduction Report

## Test Date
January 26, 2026

## Test Objective
Test the production build locally to reproduce the issue with the subdirectory deployment path.

## Test Environment
- **Build command**: `npm run build` (HUGO_ENVIRONMENT=production hugo --minify)
- **Base URL in config**: `https://bartusiak.ai/wesole_nutki/`
- **Test server**: Python HTTP server on port 8080
- **Test URL**: `http://localhost:8080/`

## Issues Reproduced

### 1. Root Redirect Issue
**URL tested**: `http://localhost:8080/`

**Expected behavior**: Redirect to `/pl/` or serve the Polish homepage

**Actual behavior**:
```html
<!doctype html>
<html lang=pl>
<head>
  <title>https://bartusiak.ai/wesole_nutki/pl/</title>
  <link rel=canonical href=https://bartusiak.ai/wesole_nutki/pl/>
  <meta http-equiv=refresh content="0; url=https://bartusiak.ai/wesole_nutki/pl/">
</head>
</html>
```

**Problem**: The root `index.html` contains a meta refresh redirect to the **absolute production URL** (`https://bartusiak.ai/wesole_nutki/pl/`) instead of a relative path. This makes local testing impossible without modifying the build.

### 2. Absolute URL References in HTML
**URL tested**: `http://localhost:8080/pl/`

**Issues found**:
- Logo link: `<a class=navbar-brand href=https://bartusiak.ai/wesole_nutki/pl/>`
- Language switcher: `<a href=https://bartusiak.ai/wesole_nutki/en/>`
- Multiple internal links contain absolute URLs with the production domain

**Impact**: These links redirect users away from localhost to the production site during local testing.

### 3. Resource Path Mismatch
**Test results**:

| Resource Path | HTTP Status | Available |
|--------------|-------------|-----------|
| `/wesole_nutki/css/style.min.[hash].css` | 404 | ❌ No |
| `/css/style.min.[hash].css` | 200 | ✅ Yes |

**Problem**:
- The HTML references resources with the `/wesole_nutki/` prefix (e.g., `href=/wesole_nutki/css/style.min...`)
- However, when serving from the `public/` directory root, these resources are actually at `/css/` (without the basepath)
- This causes all CSS, JS, and image resources to fail loading with 404 errors

### 4. Mixed Path Types
The production build contains both:
- **Absolute URLs**: `https://bartusiak.ai/wesole_nutki/pl/` (in meta tags, language switcher, logo link)
- **Relative URLs with basepath**: `/wesole_nutki/pl/` (in navigation links)

This inconsistency means that even if you serve the site at `http://localhost:8080/wesole_nutki/`, some links will still redirect to the production domain.

## Root Cause Analysis

The issue stems from Hugo's `baseURL` configuration and how it handles subdirectory deployments:

1. **Config setting**: `baseURL = "https://bartusiak.ai/wesole_nutki/"`
2. **Hugo behavior**: When building with this baseURL, Hugo:
   - Uses absolute URLs for certain elements (canonical links, language alternates, Open Graph tags)
   - Uses root-relative URLs with the basepath for resources and navigation
3. **Local testing constraint**: There's no straightforward way to serve the production build locally because:
   - Resources are referenced with `/wesole_nutki/` prefix but exist at `/` in the build output
   - Redirects and some links use the absolute production URL

## Recommended Solutions

### Option 1: Separate Development Build (Recommended)
Use the existing dev script that overrides the baseURL:
```bash
npm run dev  # Uses --baseURL http://localhost:1313/
```

### Option 2: Local Production Build with BaseURL Override
Create a new build command for local production testing:
```bash
hugo --minify --baseURL http://localhost:8080/
```

### Option 3: Proxy Server Setup
Set up a proxy server that:
- Serves the production build
- Rewrites URLs from `/wesole_nutki/` to `/`
- Handles the basepath in requests

## Conclusion

✅ **Issue successfully reproduced**: The production build cannot be tested locally at `http://localhost:8080/` without modifications because:

1. Root redirect uses absolute production URL
2. Resources are referenced with `/wesole_nutki/` prefix but stored at root
3. Some navigation links use absolute production URLs
4. CSS, JS, and images fail to load (404 errors)

The site requires either:
- A development build with localhost baseURL
- A production build served at the correct basepath (`/wesole_nutki/`)
- A proxy/rewrite solution to handle path translation
