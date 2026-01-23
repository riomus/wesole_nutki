# Wesole Nutki - Preschool Website

A modern, multilingual preschool website built with Hugo and Bootstrap 5, featuring a content management system for easy updates and management.

## Overview

Wesole Nutki is a professional preschool website that serves the Wroclaw community with a bilingual (Polish/English) presence. The site features a modern responsive design, comprehensive content management capabilities, and an integrated gallery system for showcasing preschool activities and events.

## Key Features

- **Multilingual Support**: Full Polish and English language support with seamless language switching
- **Content Management System**: Decap CMS (formerly Netlify CMS) for easy content editing without technical knowledge
- **Responsive Design**: Mobile-first design using Bootstrap 5 for optimal viewing on all devices
- **Gallery System**: Photo galleries with lightbox viewing using GLightbox
- **News & Events**: Blog-style news section with categories and tags
- **Programs Section**: Detailed information about preschool programs and daily schedules
- **Contact Pages**: Comprehensive contact information with map integration capabilities
- **SEO Optimized**: Built with search engine optimization best practices
- **Fast Performance**: Optimized images and minified assets for quick loading
- **Automated Deployment**: GitHub Actions workflow for continuous deployment to GitHub Pages
- **End-to-End Testing**: Playwright test suite for quality assurance

## Technology Stack

- **Static Site Generator**: [Hugo](https://gohugo.io/) v0.140.2 (Extended)
- **CSS Framework**: [Bootstrap](https://getbootstrap.com/) 5.3.3
- **JavaScript Libraries**:
  - [@popperjs/core](https://popper.js.org/) 2.11.8 (Bootstrap dependency)
  - [GLightbox](https://biati-digital.github.io/glightbox/) 3.3.1 (Image gallery lightbox)
- **Content Management**: [Decap CMS](https://decapcms.org/) (GitHub backend)
- **Testing**: [Playwright](https://playwright.dev/) 1.49.0
- **Deployment**: GitHub Pages with GitHub Actions

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 18.0.0 or higher
  - Check version: `node --version`
  - Download: https://nodejs.org/
- **npm**: Comes with Node.js
  - Check version: `npm --version`
- **Hugo Extended**: Version 0.140.2 or compatible
  - Check version: `hugo version` (must include "extended")
  - Download: https://github.com/gohugoio/hugo/releases
  - **Important**: Must be the Extended version for SCSS support
- **Git**: For version control
  - Check version: `git --version`
  - Download: https://git-scm.com/

### Installing Hugo Extended

**macOS** (using Homebrew):
```bash
brew install hugo
```

**Linux**:
```bash
wget https://github.com/gohugoio/hugo/releases/download/v0.140.2/hugo_extended_0.140.2_linux-amd64.deb
sudo dpkg -i hugo_extended_0.140.2_linux-amd64.deb
```

**Windows** (using Chocolatey):
```bash
choco install hugo-extended
```

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/riomus/wesole_nutki.git
cd wesole_nutki
```

### 2. Install Dependencies

Install all Node.js dependencies (Bootstrap, GLightbox, Playwright, etc.):

```bash
npm install
```

This will install:
- Bootstrap 5.3.3 and Popper.js
- GLightbox for image galleries
- Playwright for testing
- YAML parser for configuration

### 3. Start Development Server

Start the Hugo development server with live reload:

```bash
npm run dev
```

Or directly with Hugo:
```bash
hugo server --buildDrafts --buildFuture --baseURL http://localhost:1313/
```

**Important**: The `--baseURL` flag is required for local development to override the production baseURL configured in `hugo.toml`. Without it, the site will only be accessible at http://localhost:1313/wesole_nutki/ instead of the root path.

The site will be available at: **http://localhost:1313**

The development server features:
- **Live reload**: Changes to files automatically refresh the browser
- **Draft content**: View draft posts and pages with `--buildDrafts`
- **Future posts**: View scheduled content with `--buildFuture`
- **Fast rebuild**: Hugo rebuilds only changed files
- **Local baseURL override**: Uses http://localhost:1313/ for convenient local development

### 4. Access the Site

When using the standard `npm run dev` command:
- **Homepage (Polish)**: http://localhost:1313/pl/
- **Homepage (English)**: http://localhost:1313/en/
- **CMS Admin Panel**: http://localhost:1313/admin/ (requires authentication)

**Alternative**: To test with the production URL structure (with `/wesole_nutki/` base path):
```bash
npm run dev:basepath
```
Then access:
- **Homepage (Polish)**: http://localhost:1313/wesole_nutki/pl/
- **Homepage (English)**: http://localhost:1313/wesole_nutki/en/

## Available Scripts

The following npm scripts are available for development and testing:

### Development

```bash
npm run dev
```
Starts Hugo development server with drafts and future content enabled. Includes live reload at http://localhost:1313

### Production Build

```bash
npm run build
```
Builds the site for production with minification enabled. Output directory: `public/`

### Clean Build Artifacts

```bash
npm run clean
```
Removes the `public/` and `resources/` directories to ensure a fresh build

### Testing

```bash
# Run all tests
npm test

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in specific browser
npm run test:chrome    # Chromium only
npm run test:firefox   # Firefox only
npm run test:safari    # WebKit (Safari) only

# Run tests in headed mode (see browser)
npm run test:headed

# Debug tests (step through)
npm run test:debug
```

## Testing Documentation

The project uses [Playwright](https://playwright.dev/) for end-to-end testing to ensure all features work correctly across different browsers.

### Running the Test Suite

**Prerequisites**: The Hugo development server must be running before tests execute. The test configuration automatically starts the server if it's not already running.

#### Run All Tests

```bash
npm test
```

This runs the complete test suite across all configured browsers (Chromium, Firefox, WebKit).

#### Run Tests in Specific Browser

```bash
npm run test:chrome    # Test in Chromium only
npm run test:firefox   # Test in Firefox only
npm run test:safari    # Test in WebKit (Safari) only
```

#### Interactive Testing

```bash
npm run test:ui
```

Opens Playwright's interactive UI where you can:
- Select specific tests to run
- Watch tests execute in real-time
- Debug failed tests
- View test reports and traces

#### Debugging Tests

```bash
npm run test:debug
```

Runs tests in debug mode with the Playwright Inspector, allowing you to:
- Step through test actions
- Pause and resume execution
- Inspect page elements
- View console logs

#### Headed Mode (Visual Testing)

```bash
npm run test:headed
```

Runs tests with browser windows visible, useful for:
- Watching test execution
- Understanding test failures
- Developing new tests

### Test Coverage

The test suite currently includes:
- Homepage functionality tests (navigation, language switching)
- Gallery page tests (image display, lightbox functionality)
- Responsive design tests across different viewport sizes
- Cross-browser compatibility tests

### Test Configuration

Test configuration is in `playwright.config.ts`:
- **Base URL**: http://localhost:1313
- **Timeout**: 120 seconds for server startup
- **Retries**: 2 retries in CI, 0 in local development
- **Screenshots**: Captured on failure
- **Videos**: Retained on failure
- **Traces**: Recorded on first retry

### Viewing Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

The report includes:
- Test results summary
- Failed test details with screenshots
- Execution traces for debugging
- Performance metrics

### Writing New Tests

Tests are located in the `tests/` directory. Example test structure:

```typescript
import { test, expect } from '@playwright/test';

test('test description', async ({ page }) => {
  await page.goto('/pl/');
  await expect(page).toHaveTitle(/Expected Title/);
  // Add more test steps...
});
```

Refer to [Playwright documentation](https://playwright.dev/docs/intro) for detailed testing guides.

## CMS Usage

The site uses **Decap CMS** (formerly Netlify CMS) for content management, allowing non-technical users to create and edit content through a user-friendly interface.

### Accessing the CMS

1. **Navigate to the admin panel**:
   - Production: https://wesolenutki.pl/admin/
   - Local development: http://localhost:1313/admin/

2. **Authentication**:
   - The CMS uses **GitHub OAuth** for authentication
   - You must have a GitHub account with write access to the `riomus/wesole_nutki` repository
   - Click "Login with GitHub" and authorize the application

3. **First-time setup**:
   - If prompted, grant the CMS permission to access the repository
   - The authentication is handled through Netlify's GitHub OAuth gateway

### Editorial Workflow

The CMS is configured with **Editorial Workflow** enabled, which provides a three-stage publishing process:

1. **Draft**: Work in progress, not visible on the site
2. **In Review**: Ready for review by editors
3. **Ready**: Approved and ready to publish

To publish content:
- Create or edit content in the CMS
- Move through the workflow stages
- Click "Publish" when ready - this creates a git commit to the master branch
- GitHub Actions automatically deploys the changes within 2-3 minutes

### Content Types and Management

The CMS provides editors for the following content types:

#### 1. **News Articles (Aktualnosci / News)**

Create and manage news posts and announcements.

**Fields**:
- Title, publish date, draft status
- Categories and tags for organization
- Featured image (recommended: 1200x630px)
- Summary for list view
- Full markdown content with rich text editor

**Location in repository**:
- Polish: `content/pl/news/`
- English: `content/en/news/`

#### 2. **Gallery Albums (Galeria / Gallery)**

Upload and organize photo galleries of preschool activities and events.

**Fields**:
- Album title and description
- Date and categories
- Featured image (album thumbnail, 800x600px recommended)
- Image list with captions and alt text
- Each image: 1600x1200px recommended, max 5MB

**Location in repository**:
- Polish: `content/pl/gallery/`
- English: `content/en/gallery/`

#### 3. **Programs (Programy / Programs)**

Manage information about preschool programs and age groups.

**Fields**:
- Program name, description, weight (display order)
- Icon/emoji, age group, group size, hours
- Featured image (800x600px)
- Key features list
- Activities list with icons
- Daily schedule
- Full markdown content

**Location in repository**:
- Polish: `content/pl/programs/`
- English: `content/en/programs/`

#### 4. **Static Pages**

Edit core pages like About Us and Contact.

**About Page**:
- Main content
- Team members with photos (400x400px recommended)
- Multiple content sections with images

**Contact Page**:
- Contact information (phone, email, address, hours)
- Map coordinates and Google Maps link
- Additional markdown content

**Location in repository**:
- Polish: `content/pl/about/_index.md`, `content/pl/contact/_index.md`
- English: `content/en/about/_index.md`, `content/en/contact/_index.md`

#### 5. **Navigation Menu (Menu nawigacji)**

Customize the site's navigation menu structure.

**Features**:
- Add, remove, and reorder menu items
- Create dropdown submenus
- Set external links and new tab options
- Manage Polish and English menus separately

**Location in repository**: `data/menus/main_pl.yml`, `data/menus/main_en.yml`

#### 6. **Site Settings (Ustawienia strony)**

Configure global site settings.

**Branding**:
- Logo and alternative logo
- Favicon
- Social sharing image (Open Graph)

**Global Settings**:
- Site title, description, tagline
- Contact information
- Opening hours
- Social media links
- Homepage sections toggle
- SEO settings (meta description, keywords, Google Analytics)
- Footer settings

**Location in repository**: `data/branding.yml`, `data/settings.yml`

### Media Library

The CMS includes a media library for managing images:

- **Access**: Click "Media" in the top navigation
- **Upload**: Drag and drop or click to upload images
- **Organization**: Folder support enabled for organizing images
- **File size limit**: 5MB maximum per file
- **Supported formats**: JPG, PNG, SVG, GIF, WebP
- **Naming convention**: Use lowercase with hyphens (e.g., `spring-event-2024.jpg`)
- **Avoid**: Polish characters and special symbols in filenames

**Image Guidelines**:
- Featured images: 1200x630px (2:1 ratio) for social sharing
- Gallery images: 1600x1200px (4:3 ratio)
- Team photos: 400x400px (1:1 square)
- Program images: 800x600px (4:3 ratio)
- Logos: 200x60px PNG with transparency
- Always use descriptive alt text for accessibility

### Tips for Content Editors

1. **Save frequently**: Use the "Save" button to save drafts without publishing
2. **Preview changes**: Use the preview pane to see how content will appear
3. **Markdown formatting**: Learn basic markdown for formatting text:
   - `**bold**` for **bold text**
   - `*italic*` for *italic text*
   - `[link text](url)` for links
   - `## Heading` for headings
4. **Image optimization**: Compress images before upload to keep the site fast
5. **Alt text**: Always add descriptive alt text for images (accessibility and SEO)
6. **Categories and tags**: Use consistent naming for better organization
7. **URL slugs**: Keep them short, descriptive, and in English characters

## Project Structure

```
wesole_nutki/
├── archetypes/          # Content templates for Hugo
│   ├── default.md
│   ├── gallery.md
│   └── news.md
├── assets/              # Source files for processing
│   ├── scss/            # SCSS stylesheets (compiled by Hugo)
│   └── js/              # JavaScript source files
├── content/             # Markdown content files
│   ├── en/              # English content
│   │   ├── about/
│   │   ├── contact/
│   │   ├── gallery/
│   │   ├── news/
│   │   └── programs/
│   ├── pl/              # Polish content (default)
│   │   ├── about/
│   │   ├── contact/
│   │   ├── gallery/
│   │   ├── news/
│   │   └── programs/
│   ├── gallery/         # Shared gallery content
│   ├── news/            # Shared news content
│   └── programs/        # Shared programs content
├── data/                # Data files (YAML/JSON/TOML)
│   ├── branding.yml     # Logo and branding settings
│   ├── settings.yml     # Global site settings
│   └── menus/           # Navigation menu configuration
├── i18n/                # Translation strings
│   ├── en.yaml
│   └── pl.yaml
├── layouts/             # HTML templates
│   ├── _default/        # Default templates
│   ├── partials/        # Reusable template components
│   └── shortcodes/      # Custom shortcodes
├── static/              # Static assets (copied as-is)
│   ├── admin/           # Decap CMS configuration
│   │   ├── index.html
│   │   └── config.yml   # CMS configuration
│   ├── images/          # Image files
│   └── CNAME            # Custom domain configuration
├── tests/               # Playwright test files
├── .github/             # GitHub configuration
│   └── workflows/       # GitHub Actions workflows
│       └── deploy.yml   # Deployment workflow
├── hugo.toml            # Hugo configuration
├── package.json         # Node.js dependencies and scripts
├── playwright.config.ts # Playwright test configuration
└── README.md            # This file
```

### Key Directories

- **`content/`**: All site content in Markdown format, organized by language
- **`layouts/`**: HTML templates that define how content is rendered
- **`static/`**: Files served directly without processing (images, CMS, etc.)
- **`assets/`**: Source files that Hugo processes (SCSS, JS)
- **`data/`**: Structured data files used by templates
- **`i18n/`**: Translation strings for multilingual support
- **`public/`**: Generated site output (gitignored, created by `hugo` command)

## Environment Variables and Configuration

### Hugo Configuration (`hugo.toml`)

Key configuration settings:

- **baseURL**: Production URL (https://wesolenutki.pl/)
- **defaultContentLanguage**: "pl" (Polish)
- **Languages**: Polish (pl) and English (en)
- **Theme**: Custom theme (no external theme)
- **Image processing**: Quality 85, Lanczos resampling, WebP generation enabled
- **Build**: Write stats enabled for asset optimization

### Decap CMS Configuration (`static/admin/config.yml`)

Key settings:

- **Backend**: GitHub (repo: riomus/wesole_nutki, branch: master)
- **Media folder**: `static/images` (public path: `/images`)
- **Publish mode**: Editorial workflow enabled
- **Locale**: Polish (pl)
- **Max file size**: 5MB

### GitHub Actions Environment

The deployment workflow uses these environment variables:

- **HUGO_VERSION**: 0.140.2
- **HUGO_ENVIRONMENT**: production
- **TZ**: Europe/Warsaw (timezone)
- **Node version**: 20

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the master branch.

### Automatic Deployment

1. **Push changes** to the master branch:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin master
   ```

2. **GitHub Actions** automatically:
   - Installs Hugo Extended and Node.js dependencies
   - Builds the site with minification
   - Deploys to GitHub Pages

3. **Site goes live** within 2-3 minutes at https://wesolenutki.pl/

### Manual Deployment

To trigger a manual deployment:

1. Go to the GitHub repository: https://github.com/riomus/wesole_nutki
2. Click on the "Actions" tab
3. Select "Deploy Hugo site to Pages" workflow
4. Click "Run workflow" button
5. Select the branch (master) and click "Run workflow"

### Deployment Requirements

- **GitHub Pages** must be enabled for the repository
- **Source**: GitHub Actions (configured in Settings > Pages)
- **Custom domain**: wesolenutki.pl (configured via `static/CNAME`)
- **HTTPS**: Enforced by GitHub Pages
- **Branch**: master (or main)

### Local Production Build

Test the production build locally:

```bash
# Clean previous build
npm run clean

# Build for production
npm run build

# The output is in the public/ directory
```

To serve the production build locally:

```bash
# Using Hugo's server
hugo server --environment production

# Or using a simple HTTP server
npx http-server public/
```

## Troubleshooting

### Common Issues and Solutions

#### Hugo Server Won't Start

**Problem**: `command not found: hugo` or Hugo version is incorrect

**Solutions**:
```bash
# Check if Hugo is installed and is Extended version
hugo version

# Should output something like: "hugo v0.140.2+extended..."

# If not installed or wrong version, reinstall:
# macOS
brew install hugo

# Linux
wget https://github.com/gohugoio/hugo/releases/download/v0.140.2/hugo_extended_0.140.2_linux-amd64.deb
sudo dpkg -i hugo_extended_0.140.2_linux-amd64.deb

# Verify installation
hugo version
```

#### SCSS Compilation Errors

**Problem**: Error about SCSS/SASS processing

**Solution**: Ensure you have Hugo **Extended** version (not the standard version):
```bash
hugo version
# Must show "extended" in the output
```

#### Port Already in Use

**Problem**: `Port 1313 already in use`

**Solutions**:
```bash
# Option 1: Kill the process using the port
lsof -ti:1313 | xargs kill -9

# Option 2: Use a different port
hugo server --port 1314
```

#### Node Dependencies Issues

**Problem**: Missing dependencies or version conflicts

**Solutions**:
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use npm ci for clean install
npm ci
```

#### Playwright Tests Failing

**Problem**: Browser binaries not installed or tests timeout

**Solutions**:
```bash
# Install Playwright browsers
npx playwright install

# Install with system dependencies (Linux)
npx playwright install --with-deps

# Increase timeout if tests are slow
npx playwright test --timeout=60000
```

#### CMS Authentication Issues

**Problem**: Can't log in to CMS or "Error: Not Found"

**Solutions**:
1. Verify you have write access to the GitHub repository
2. Check that you're accessing the correct URL (`/admin/`)
3. Clear browser cache and cookies
4. Try a different browser or incognito mode
5. Check GitHub OAuth app permissions in your GitHub settings

#### Images Not Displaying

**Problem**: Images show broken links

**Solutions**:
1. Check image path starts with `/` (e.g., `/images/photo.jpg`)
2. Verify image exists in `static/images/` directory
3. Check filename doesn't have spaces or special characters
4. Rebuild the site: `npm run clean && npm run build`
5. Clear browser cache

#### Build Fails in GitHub Actions

**Problem**: Deployment workflow fails

**Solutions**:
1. Check the Actions tab for error details
2. Verify all files are committed and pushed
3. Check for YAML syntax errors in content files
4. Ensure no draft content is blocking the build
5. Review hugo.toml for configuration errors

#### Language/Translation Issues

**Problem**: Missing translations or wrong language displays

**Solutions**:
1. Check `i18n/` files have all required translation keys
2. Verify content files are in correct language directories
3. Check `defaultContentLanguage` in hugo.toml
4. Clear Hugo cache: `hugo --cleanDestinationDir`

#### Performance Issues

**Problem**: Site loads slowly

**Solutions**:
1. Optimize images before upload (compress, resize)
2. Check image sizes are appropriate (not too large)
3. Run production build with minification: `npm run build`
4. Use WebP format for images when possible
5. Check browser console for errors

### Getting Help

If you encounter issues not covered here:

1. **Check Hugo documentation**: https://gohugo.io/documentation/
2. **Playwright documentation**: https://playwright.dev/docs/intro
3. **Decap CMS documentation**: https://decapcms.org/docs/intro/
4. **GitHub Issues**: Search or create an issue in the repository
5. **Hugo Discourse**: https://discourse.gohugo.io/
6. **Stack Overflow**: Tag questions with `hugo`, `playwright`, or `decap-cms`

### Debug Mode

Enable Hugo's verbose output for troubleshooting:

```bash
# Development server with verbose logging
hugo server --verbose --debug

# Build with verbose logging
hugo --verbose --debug
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Follow existing code style** and conventions
3. **Test your changes** thoroughly with `npm test`
4. **Update documentation** if adding new features
5. **Create a pull request** with a clear description

## License

Copyright © 2024 Wesole Nutki. All rights reserved.

## Contact

**Wesole Nutki Preschool**

- **Website**: https://wesolenutki.pl/
- **Repository**: https://github.com/riomus/wesole_nutki
- **Location**: Wroclaw, Poland

For technical support or questions about this project, please open an issue on GitHub.
