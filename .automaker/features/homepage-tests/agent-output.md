
🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Explore codebase structure and existing patterns",
      "status": "in_progress",
      "activeForm": "Exploring codebase structure and existing patterns"
    },
    {
      "content": "Understand homepage functionality to test",
      "status": "pending",
      "activeForm": "Understanding homepage functionality to test"
    },
    {
      "content": "Write Playwright tests for homepage",
      "status": "pending",
      "activeForm": "Writing Playwright tests for homepage"
    },
    {
      "content": "Run and verify tests pass",
      "status": "pending",
      "activeForm": "Running and verifying tests pass"
    }
  ]
}

🔧 Tool: Task
Input: {
  "description": "Explore homepage codebase structure",
  "prompt": "I need to write Playwright tests for homepage functionality including hero section rendering, features display, navigation links, and language switching in Polish and English.\n\nPlease explore the codebase to understand:\n1. The project structure (it appears to be a Hugo site based on hugo.toml)\n2. The homepage content and layout files\n3. Any existing Playwright configuration and tests\n4. The navigation structure and language switching mechanism\n5. The hero section and features section implementation\n\nFocus on finding:\n- Content files for Polish and English versions\n- Layout templates for the homepage\n- Any existing test patterns\n- How i18n/multilingual is configured\n\nThis is a Hugo static site. Provide detailed findings about the homepage structure so I can write comprehensive Playwright tests.",
  "subagent_type": "Explore"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/hugo.toml"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/package.json"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/playwright.config.ts"
}

🔧 Tool: Bash
Input: {
  "command": "find /Users/romanbartusiak/git/riomus/wesole_nutki -type f -name \"*.ts\" -o -name \"*.js\" | head -20",
  "description": "List TypeScript and JavaScript files in project"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /Users/romanbartusiak/git/riomus/wesole_nutki/content/",
  "description": "List content directory structure"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /Users/romanbartusiak/git/riomus/wesole_nutki/layouts/",
  "description": "List layouts directory structure"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /Users/romanbartusiak/git/riomus/wesole_nutki/i18n/",
  "description": "List i18n directory structure"
}

🔧 Tool: Bash
Input: {
  "command": "find /Users/romanbartusiak/git/riomus/wesole_nutki/tests -type f 2>/dev/null | head -20",
  "description": "Find existing test files"
}

🔧 Tool: Bash
Input: {
  "command": "find /Users/romanbartusiak/git/riomus/wesole_nutki/content/pl -type f -name \"*\" | head -20",
  "description": "List Polish content files"
}

🔧 Tool: Bash
Input: {
  "command": "find /Users/romanbartusiak/git/riomus/wesole_nutki/content/en -type f -name \"*\" | head -20",
  "description": "List English content files"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /Users/romanbartusiak/git/riomus/wesole_nutki/layouts/_default/",
  "description": "List default layouts"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /Users/romanbartusiak/git/riomus/wesole_nutki/layouts/partials/",
  "description": "List partials directory"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/content/pl/_index.md"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/content/en/_index.md"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /Users/romanbartusiak/git/riomus/wesole_nutki/layouts/partials/homepage/",
  "description": "List homepage partials"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/layouts/_default/baseof.html"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/layouts/partials/homepage/hero.html"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/layouts/partials/homepage/features.html"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/layouts/partials/header.html"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/layouts/partials/language-switcher.html"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/i18n/pl.toml",
  "limit": 100
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/i18n/en.toml",
  "limit": 100
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /Users/romanbartusiak/git/riomus/wesole_nutki/data/",
  "description": "List data files directory"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /Users/romanbartusiak/git/riomus/wesole_nutki/data/homepage/",
  "description": "List homepage data files"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /Users/romanbartusiak/git/riomus/wesole_nutki/data/menus/",
  "description": "List menu data files"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/data/homepage/hero.yml"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/data/homepage/features.yml"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/data/menus/main_pl.yml"
}

🔧 Tool: Bash
Input: {
  "command": "find /Users/romanbartusiak/git/riomus/wesole_nutki/layouts -name \"*home*\" -o -name \"*index*\"",
  "description": "Find homepage-related layout files"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/layouts/index.html"
}

🔧 Tool: Bash
Input: {
  "command": "find /Users/romanbartusiak/git/riomus/wesole_nutki -name \"*test*\" -o -name \"*spec*\" 2>/dev/null | head -20",
  "description": "Find test files"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /Users/romanbartusiak/git/riomus/wesole_nutki/tests/ 2>/dev/null || echo \"Tests directory does not exist\"",
  "description": "Check tests directory"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/tests/gallery.spec.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/data/menus/main_en.yml"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/layouts/partials/footer.html",
  "limit": 50
}

🔧 Tool: Bash
Input: {
  "command": "grep -r \"data-testid\" /Users/romanbartusiak/git/riomus/wesole_nutki/layouts/ 2>/dev/null | head -20",
  "description": "Find existing test IDs in layouts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/data/homepage/about.yml"
}

🔧 Tool: Bash
Input: {
  "command": "grep -E \"(hero_headline|hero_subheadline|why_choose_us|loving_care|quality_education|community|safe_environment|play_based_learning|qualified_teachers)\" /Users/romanbartusiak/git/riomus/wesole_nutki/i18n/pl.toml",
  "description": "Search for hero and features i18n keys in Polish"
}

🔧 Tool: Bash
Input: {
  "command": "grep -E \"(hero_headline|hero_subheadline|why_choose_us|loving_care|quality_education|community|safe_environment|play_based_learning|qualified_teachers)\" /Users/romanbartusiak/git/riomus/wesole_nutki/i18n/en.toml",
  "description": "Search for hero and features i18n keys in English"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/i18n/pl.toml",
  "offset": 100,
  "limit": 100
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Explore codebase structure and existing patterns",
      "status": "completed",
      "activeForm": "Exploring codebase structure and existing patterns"
    },
    {
      "content": "Understand homepage functionality to test",
      "status": "completed",
      "activeForm": "Understanding homepage functionality to test"
    },
    {
      "content": "Write Playwright tests for homepage",
      "status": "in_progress",
      "activeForm": "Writing Playwright tests for homepage"
    },
    {
      "content": "Run and verify tests pass",
      "status": "pending",
      "activeForm": "Running and verifying tests pass"
    }
  ]
}
Let me read the existing gallery test to follow the same patterns:

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/tests/gallery.spec.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/i18n/pl.toml"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/i18n/en.toml"
}
Now let me read the homepage partials to understand the exact structure:

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/layouts/partials/homepage/hero.html"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/layouts/partials/homepage/features.html"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/layouts/partials/header.html"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/layouts/partials/language-switcher.html"
}
Now I have all the information needed to write comprehensive Playwright tests for the homepage. Let me create the test file:

🔧 Tool: Write
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/tests/homepage.spec.ts",
  "content": "import { test, expect } from '@playwright/test';\n\n/**\n * Homepage E2E Tests\n * Tests for hero section rendering, features display, navigation links,\n * and language switching in both Polish and English.\n */\n\ntest.describe('Hero Section Rendering', () => {\n  test.describe('Polish Homepage', () => {\n    test.beforeEach(async ({ page }) => {\n      await page.goto('/pl/');\n    });\n\n    test('should display hero section', async ({ page }) => {\n      const heroSection = page.locator('[data-testid=\"hero-section\"]');\n      await expect(heroSection).toBeVisible();\n    });\n\n    test('should display hero headline in Polish', async ({ page }) => {\n      const headline = page.locator('[data-testid=\"hero-headline\"]');\n      await expect(headline).toBeVisible();\n      await expect(headline).toContainText('Wesole Nutki - Przedszkole we Wroclawiu');\n    });\n\n    test('should display hero subheadline in Polish', async ({ page }) => {\n      const subheadline = page.locator('[data-testid=\"hero-subheadline\"]');\n      await expect(subheadline).toBeVisible();\n      await expect(subheadline).toContainText('Miejsce, gdzie kazde dziecko odkrywa radosc nauki');\n    });\n\n    test('should display hero CTA buttons', async ({ page }) => {\n      const buttonsContainer = page.locator('[data-testid=\"hero-buttons\"]');\n      await expect(buttonsContainer).toBeVisible();\n\n      const ctaButtons = page.locator('[data-testid=\"hero-cta-button\"]');\n      const count = await ctaButtons.count();\n      expect(count).toBeGreaterThan(0);\n    });\n\n    test('should have hero CTA buttons with correct text', async ({ page }) => {\n      const ctaButtons = page.locator('[data-testid=\"hero-cta-button\"]');\n\n      // Check for \"Learn more\" button\n      const learnMoreButton = ctaButtons.filter({ hasText: 'Dowiedz sie wiecej' });\n      await expect(learnMoreButton).toBeVisible();\n\n      // Check for \"Contact us\" button\n      const contactButton = ctaButtons.filter({ hasText: 'Skontaktuj sie' });\n      await expect(contactButton).toBeVisible();\n    });\n\n    test('should have clickable hero CTA buttons', async ({ page }) => {\n      const firstButton = page.locator('[data-testid=\"hero-cta-button\"]').first();\n      await expect(firstButton).toBeEnabled();\n\n      const href = await firstButton.getAttribute('href');\n      expect(href).toBeTruthy();\n      expect(href).not.toBe('#');\n    });\n  });\n\n  test.describe('English Homepage', () => {\n    test.beforeEach(async ({ page }) => {\n      await page.goto('/en/');\n    });\n\n    test('should display hero section', async ({ page }) => {\n      const heroSection = page.locator('[data-testid=\"hero-section\"]');\n      await expect(heroSection).toBeVisible();\n    });\n\n    test('should display hero headline in English', async ({ page }) => {\n      const headline = page.locator('[data-testid=\"hero-headline\"]');\n      await expect(headline).toBeVisible();\n      await expect(headline).toContainText('Wesole Nutki - Preschool in Wroclaw');\n    });\n\n    test('should display hero subheadline in English', async ({ page }) => {\n      const subheadline = page.locator('[data-testid=\"hero-subheadline\"]');\n      await expect(subheadline).toBeVisible();\n      await expect(subheadline).toContainText('A place where every child discovers the joy of learning');\n    });\n\n    test('should display hero CTA buttons in English', async ({ page }) => {\n      const ctaButtons = page.locator('[data-testid=\"hero-cta-button\"]');\n\n      // Check for \"Learn More\" button\n      const learnMoreButton = ctaButtons.filter({ hasText: 'Learn More' });\n      await expect(learnMoreButton).toBeVisible();\n\n      // Check for \"Contact Us\" button\n      const contactButton = ctaButtons.filter({ hasText: 'Contact Us' });\n      await expect(contactButton).toBeVisible();\n    });\n  });\n});\n\ntest.describe('Features Section Display', () => {\n  test.describe('Polish Homepage', () => {\n    test.beforeEach(async ({ page }) => {\n      await page.goto('/pl/');\n    });\n\n    test('should display features section', async ({ page }) => {\n      const featuresSection = page.locator('#features-section');\n      await expect(featuresSection).toBeVisible();\n    });\n\n    test('should display features section heading in Polish', async ({ page }) => {\n      const heading = page.locator('#features-section .section-heading');\n      await expect(heading).toBeVisible();\n      await expect(heading).toContainText('Dlaczego my?');\n    });\n\n    test('should display features section subtitle in Polish', async ({ page }) => {\n      const subtitle = page.locator('#features-section .section-subtitle');\n      await expect(subtitle).toBeVisible();\n      await expect(subtitle).toContainText('Odkryj, co sprawia, ze nasze przedszkole jest wyjatkowe');\n    });\n\n    test('should display feature cards', async ({ page }) => {\n      const featureCards = page.locator('#features-section .feature-card');\n      const count = await featureCards.count();\n      expect(count).toBe(6);\n    });\n\n    test('should display feature icons', async ({ page }) => {\n      const featureIcons = page.locator('#features-section .feature-icon');\n      const count = await featureIcons.count();\n      expect(count).toBe(6);\n    });\n\n    test('should display feature titles in Polish', async ({ page }) => {\n      const featureTitles = page.locator('#features-section .feature-card h3');\n\n      // Check for expected feature titles\n      await expect(featureTitles.filter({ hasText: 'Serdeczna opieka' })).toBeVisible();\n      await expect(featureTitles.filter({ hasText: 'Edukacja na najwyzszym poziomie' })).toBeVisible();\n      await expect(featureTitles.filter({ hasText: 'Spolecznosc' })).toBeVisible();\n      await expect(featureTitles.filter({ hasText: 'Bezpieczne Srodowisko' })).toBeVisible();\n      await expect(featureTitles.filter({ hasText: 'Nauka przez Zabawe' })).toBeVisible();\n      await expect(featureTitles.filter({ hasText: 'Wykwalifikowani Nauczyciele' })).toBeVisible();\n    });\n\n    test('should display feature descriptions', async ({ page }) => {\n      const featureDescriptions = page.locator('#features-section .feature-card p');\n      const count = await featureDescriptions.count();\n      expect(count).toBe(6);\n\n      // Verify descriptions are not empty\n      const firstDescription = featureDescriptions.first();\n      const text = await firstDescription.textContent();\n      expect(text?.length).toBeGreaterThan(10);\n    });\n  });\n\n  test.describe('English Homepage', () => {\n    test.beforeEach(async ({ page }) => {\n      await page.goto('/en/');\n    });\n\n    test('should display features section heading in English', async ({ page }) => {\n      const heading = page.locator('#features-section .section-heading');\n      await expect(heading).toBeVisible();\n      await expect(heading).toContainText('Why Choose Us?');\n    });\n\n    test('should display features section subtitle in English', async ({ page }) => {\n      const subtitle = page.locator('#features-section .section-subtitle');\n      await expect(subtitle).toBeVisible();\n      await expect(subtitle).toContainText('Discover what makes our preschool special');\n    });\n\n    test('should display feature titles in English', async ({ page }) => {\n      const featureTitles = page.locator('#features-section .feature-card h3');\n\n      // Check for expected feature titles in English\n      await expect(featureTitles.filter({ hasText: 'Loving Care' })).toBeVisible();\n      await expect(featureTitles.filter({ hasText: 'Quality Education' })).toBeVisible();\n      await expect(featureTitles.filter({ hasText: 'Community' })).toBeVisible();\n      await expect(featureTitles.filter({ hasText: 'Safe Environment' })).toBeVisible();\n      await expect(featureTitles.filter({ hasText: 'Play-Based Learning' })).toBeVisible();\n      await expect(featureTitles.filter({ hasText: 'Qualified Teachers' })).toBeVisible();\n    });\n  });\n});\n\ntest.describe('Navigation Links', () => {\n  test.describe('Polish Navigation', () => {\n    test.beforeEach(async ({ page }) => {\n      await page.goto('/pl/');\n    });\n\n    test('should display navigation header', async ({ page }) => {\n      const header = page.locator('.site-header');\n      await expect(header).toBeVisible();\n    });\n\n    test('should display navbar brand/logo', async ({ page }) => {\n      const brand = page.locator('.navbar-brand');\n      await expect(brand).toBeVisible();\n    });\n\n    test('should display main navigation menu', async ({ page }) => {\n      const navMenu = page.locator('.navbar-nav');\n      await expect(navMenu).toBeVisible();\n    });\n\n    test('should display navigation links in Polish', async ({ page }) => {\n      const navLinks = page.locator('.navbar-nav .nav-link');\n\n      // Check for expected navigation items\n      await expect(navLinks.filter({ hasText: 'Strona Glowna' })).toBeVisible();\n      await expect(navLinks.filter({ hasText: 'O Nas' })).toBeVisible();\n      await expect(navLinks.filter({ hasText: 'Oferta' })).toBeVisible();\n      await expect(navLinks.filter({ hasText: 'Aktualnosci' })).toBeVisible();\n      await expect(navLinks.filter({ hasText: 'Galeria' })).toBeVisible();\n      await expect(navLinks.filter({ hasText: 'Kontakt' })).toBeVisible();\n    });\n\n    test('should have active state on home link', async ({ page }) => {\n      const homeLink = page.locator('.navbar-nav .nav-link').filter({ hasText: 'Strona Glowna' });\n      await expect(homeLink).toHaveClass(/active/);\n    });\n\n    test('should navigate to About page when clicking O Nas', async ({ page }) => {\n      const aboutLink = page.locator('.navbar-nav .nav-link').filter({ hasText: 'O Nas' });\n      await aboutLink.click();\n      await expect(page).toHaveURL(/\\/pl\\/about\\/?$/);\n    });\n\n    test('should navigate to News page when clicking Aktualnosci', async ({ page }) => {\n      const newsLink = page.locator('.navbar-nav .nav-link').filter({ hasText: 'Aktualnosci' });\n      await newsLink.click();\n      await expect(page).toHaveURL(/\\/pl\\/news\\/?$/);\n    });\n\n    test('should navigate to Gallery page when clicking Galeria', async ({ page }) => {\n      const galleryLink = page.locator('.navbar-nav .nav-link').filter({ hasText: 'Galeria' });\n      await galleryLink.click();\n      await expect(page).toHaveURL(/\\/pl\\/gallery\\/?$/);\n    });\n\n    test('should navigate to Contact page when clicking Kontakt', async ({ page }) => {\n      const contactLink = page.locator('.navbar-nav .nav-link').filter({ hasText: 'Kontakt' });\n      await contactLink.click();\n      await expect(page).toHaveURL(/\\/pl\\/contact\\/?$/);\n    });\n\n    test('should display dropdown menu for Oferta', async ({ page }) => {\n      const programsDropdown = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Oferta' });\n      await expect(programsDropdown).toBeVisible();\n\n      // Click to open dropdown\n      await programsDropdown.click();\n\n      // Check dropdown menu is visible\n      const dropdownMenu = page.locator('.dropdown-menu').filter({ has: page.locator('text=Nasza Oferta') });\n      await expect(dropdownMenu).toBeVisible();\n\n      // Check dropdown items\n      await expect(page.locator('.dropdown-item').filter({ hasText: 'Nasza Oferta' })).toBeVisible();\n      await expect(page.locator('.dropdown-item').filter({ hasText: 'Plan Dnia' })).toBeVisible();\n    });\n  });\n\n  test.describe('English Navigation', () => {\n    test.beforeEach(async ({ page }) => {\n      await page.goto('/en/');\n    });\n\n    test('should display navigation links in English', async ({ page }) => {\n      const navLinks = page.locator('.navbar-nav .nav-link');\n\n      // Check for expected navigation items in English\n      await expect(navLinks.filter({ hasText: 'Home' })).toBeVisible();\n      await expect(navLinks.filter({ hasText: 'About Us' })).toBeVisible();\n      await expect(navLinks.filter({ hasText: 'Programs' })).toBeVisible();\n      await expect(navLinks.filter({ hasText: 'News' })).toBeVisible();\n      await expect(navLinks.filter({ hasText: 'Gallery' })).toBeVisible();\n      await expect(navLinks.filter({ hasText: 'Contact' })).toBeVisible();\n    });\n\n    test('should have active state on home link', async ({ page }) => {\n      const homeLink = page.locator('.navbar-nav .nav-link').filter({ hasText: 'Home' });\n      await expect(homeLink).toHaveClass(/active/);\n    });\n\n    test('should navigate to English About page', async ({ page }) => {\n      const aboutLink = page.locator('.navbar-nav .nav-link').filter({ hasText: 'About Us' });\n      await aboutLink.click();\n      await expect(page).toHaveURL(/\\/en\\/about\\/?$/);\n    });\n\n    test('should display dropdown menu for Programs', async ({ page }) => {\n      const programsDropdown = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Programs' });\n      await expect(programsDropdown).toBeVisible();\n\n      // Click to open dropdown\n      await programsDropdown.click();\n\n      // Check dropdown menu is visible with English items\n      await expect(page.locator('.dropdown-item').filter({ hasText: 'Our Programs' })).toBeVisible();\n      await expect(page.locator('.dropdown-item').filter({ hasText: 'Daily Schedule' })).toBeVisible();\n    });\n  });\n});\n\ntest.describe('Language Switching', () => {\n  test('should display language switcher', async ({ page }) => {\n    await page.goto('/pl/');\n\n    const languageSwitcher = page.locator('.language-switcher');\n    await expect(languageSwitcher).toBeVisible();\n  });\n\n  test('should display language toggle with flags', async ({ page }) => {\n    await page.goto('/pl/');\n\n    const langToggle = page.locator('.lang-toggle');\n    await expect(langToggle).toBeVisible();\n\n    // Check for flag emojis\n    const plFlag = page.locator('.lang-flag').filter({ hasText: '🇵🇱' });\n    const enFlag = page.locator('.lang-flag').filter({ hasText: '🇬🇧' });\n\n    await expect(plFlag).toBeVisible();\n    await expect(enFlag).toBeVisible();\n  });\n\n  test('should display language codes PL and EN', async ({ page }) => {\n    await page.goto('/pl/');\n\n    const plCode = page.locator('.lang-code').filter({ hasText: 'PL' });\n    const enCode = page.locator('.lang-code').filter({ hasText: 'EN' });\n\n    await expect(plCode).toBeVisible();\n    await expect(enCode).toBeVisible();\n  });\n\n  test('should have Polish as active language on Polish homepage', async ({ page }) => {\n    await page.goto('/pl/');\n\n    const activeLang = page.locator('.lang-btn.active');\n    await expect(activeLang).toBeVisible();\n    await expect(activeLang.locator('.lang-code')).toContainText('PL');\n  });\n\n  test('should have English as active language on English homepage', async ({ page }) => {\n    await page.goto('/en/');\n\n    const activeLang = page.locator('.lang-btn.active');\n    await expect(activeLang).toBeVisible();\n    await expect(activeLang.locator('.lang-code')).toContainText('EN');\n  });\n\n  test('should switch from Polish to English homepage', async ({ page }) => {\n    await page.goto('/pl/');\n\n    // Click on English language button\n    const enButton = page.locator('.lang-btn').filter({ has: page.locator('.lang-code', { hasText: 'EN' }) });\n    await enButton.click();\n\n    // Should navigate to English homepage\n    await expect(page).toHaveURL(/\\/en\\/?$/);\n\n    // Verify content is in English\n    const headline = page.locator('[data-testid=\"hero-headline\"]');\n    await expect(headline).toContainText('Preschool in Wroclaw');\n  });\n\n  test('should switch from English to Polish homepage', async ({ page }) => {\n    await page.goto('/en/');\n\n    // Click on Polish language button\n    const plButton = page.locator('.lang-btn').filter({ has: page.locator('.lang-code', { hasText: 'PL' }) });\n    await plButton.click();\n\n    // Should navigate to Polish homepage\n    await expect(page).toHaveURL(/\\/pl\\/?$/);\n\n    // Verify content is in Polish\n    const headline = page.locator('[data-testid=\"hero-headline\"]');\n    await expect(headline).toContainText('Przedszkole we Wroclawiu');\n  });\n\n  test('should have hreflang attribute on language links', async ({ page }) => {\n    await page.goto('/pl/');\n\n    // English link should have hreflang=\"en\"\n    const enLink = page.locator('.lang-btn[hreflang=\"en\"]');\n    await expect(enLink).toBeVisible();\n  });\n\n  test('should have proper aria-label on language switcher', async ({ page }) => {\n    await page.goto('/pl/');\n\n    const languageSwitcher = page.locator('.language-switcher');\n    await expect(languageSwitcher).toHaveAttribute('aria-label', /wybor jezyka|language selection/i);\n  });\n\n  test('should have aria-current on active language', async ({ page }) => {\n    await page.goto('/pl/');\n\n    const activeLang = page.locator('.lang-btn.active');\n    await expect(activeLang).toHaveAttribute('aria-current', 'true');\n  });\n});\n\ntest.describe('Responsive Navigation', () => {\n  test('should display mobile menu toggle on small screens', async ({ page }) => {\n    await page.setViewportSize({ width: 375, height: 667 });\n    await page.goto('/pl/');\n\n    const menuToggle = page.locator('.navbar-toggler');\n    await expect(menuToggle).toBeVisible();\n  });\n\n  test('should hide desktop navigation on mobile', async ({ page }) => {\n    await page.setViewportSize({ width: 375, height: 667 });\n    await page.goto('/pl/');\n\n    // Navigation should be collapsed\n    const navCollapse = page.locator('#navbarMain');\n    await expect(navCollapse).not.toBeVisible();\n  });\n\n  test('should open mobile menu when clicking toggle', async ({ page }) => {\n    await page.setViewportSize({ width: 375, height: 667 });\n    await page.goto('/pl/');\n\n    const menuToggle = page.locator('.navbar-toggler');\n    await menuToggle.click();\n\n    // Wait for menu to expand\n    const navCollapse = page.locator('#navbarMain');\n    await expect(navCollapse).toBeVisible({ timeout: 5000 });\n  });\n\n  test('should display navigation links in mobile menu', async ({ page }) => {\n    await page.setViewportSize({ width: 375, height: 667 });\n    await page.goto('/pl/');\n\n    // Open mobile menu\n    const menuToggle = page.locator('.navbar-toggler');\n    await menuToggle.click();\n\n    // Check navigation links are visible\n    await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: 'Strona Glowna' })).toBeVisible({ timeout: 5000 });\n    await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: 'O Nas' })).toBeVisible();\n  });\n\n  test('should display language switcher in mobile menu', async ({ page }) => {\n    await page.setViewportSize({ width: 375, height: 667 });\n    await page.goto('/pl/');\n\n    // Open mobile menu\n    const menuToggle = page.locator('.navbar-toggler');\n    await menuToggle.click();\n\n    // Language switcher should be visible\n    const languageSwitcher = page.locator('.language-switcher');\n    await expect(languageSwitcher).toBeVisible({ timeout: 5000 });\n  });\n});\n\ntest.describe('Homepage Accessibility', () => {\n  test('should have proper document language attribute for Polish', async ({ page }) => {\n    await page.goto('/pl/');\n\n    const html = page.locator('html');\n    await expect(html).toHaveAttribute('lang', 'pl');\n  });\n\n  test('should have proper document language attribute for English', async ({ page }) => {\n    await page.goto('/en/');\n\n    const html = page.locator('html');\n    await expect(html).toHaveAttribute('lang', 'en');\n  });\n\n  test('should have heading hierarchy starting with h1', async ({ page }) => {\n    await page.goto('/pl/');\n\n    // Check h1 exists\n    const h1 = page.locator('h1').first();\n    await expect(h1).toBeVisible();\n  });\n\n  test('should have only one h1 on the page', async ({ page }) => {\n    await page.goto('/pl/');\n\n    const h1Count = await page.locator('h1').count();\n    expect(h1Count).toBe(1);\n  });\n\n  test('should have navigation role on language switcher', async ({ page }) => {\n    await page.goto('/pl/');\n\n    const languageSwitcher = page.locator('.language-switcher');\n    await expect(languageSwitcher).toHaveAttribute('role', 'navigation');\n  });\n\n  test('should have aria-label on mobile menu toggle', async ({ page }) => {\n    await page.goto('/pl/');\n\n    const menuToggle = page.locator('.navbar-toggler');\n    const ariaLabel = await menuToggle.getAttribute('aria-label');\n    expect(ariaLabel).toBeTruthy();\n  });\n});\n\ntest.describe('Page Load and Performance', () => {\n  test('should load Polish homepage successfully', async ({ page }) => {\n    const response = await page.goto('/pl/');\n    expect(response?.status()).toBe(200);\n  });\n\n  test('should load English homepage successfully', async ({ page }) => {\n    const response = await page.goto('/en/');\n    expect(response?.status()).toBe(200);\n  });\n\n  test('should redirect root to default language', async ({ page }) => {\n    await page.goto('/');\n\n    // Should redirect to Polish (default language)\n    await expect(page).toHaveURL(/\\/pl\\/?$/);\n  });\n});\n"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Explore codebase structure and existing patterns",
      "status": "completed",
      "activeForm": "Exploring codebase structure and existing patterns"
    },
    {
      "content": "Understand homepage functionality to test",
      "status": "completed",
      "activeForm": "Understanding homepage functionality to test"
    },
    {
      "content": "Write Playwright tests for homepage",
      "status": "completed",
      "activeForm": "Writing Playwright tests for homepage"
    },
    {
      "content": "Run and verify tests pass",
      "status": "in_progress",
      "activeForm": "Running and verifying tests pass"
    }
  ]
}
Now let me run the tests to verify they pass:

🔧 Tool: Bash
Input: {
  "command": "npx playwright test tests/homepage.spec.ts --reporter=list 2>&1 | head -200",
  "description": "Run homepage Playwright tests",
  "timeout": 300000
}
I see there are some issues. The language switcher appears twice on the page (in navbar and footer), and WebKit tests are failing. Let me fix the tests:

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/tests/homepage.spec.ts"
}
I see the issues - the language switcher appears both in the header and footer. Also, WebKit tests are failing due to Hugo server timing issues. Let me fix the tests to use `.first()` to target the header language switcher specifically, and add proper wait states:

🔧 Tool: Edit
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/tests/homepage.spec.ts",
  "old_string": "test.describe('Language Switching', () => {\n  test('should display language switcher', async ({ page }) => {\n    await page.goto('/pl/');\n\n    const languageSwitcher = page.locator('.language-switcher');\n    await expect(languageSwitcher).toBeVisible();\n  });\n\n  test('should display language toggle with flags', async ({ page }) => {\n    await page.goto('/pl/');\n\n    const langToggle = page.locator('.lang-toggle');\n    await expect(langToggle).toBeVisible();\n\n    // Check for flag emojis\n    const plFlag = page.locator('.lang-flag').filter({ hasText: '🇵🇱' });\n    const enFlag = page.locator('.lang-flag').filter({ hasText: '🇬🇧' });\n\n    await expect(plFlag).toBeVisible();\n    await expect(enFlag).toBeVisible();\n  });\n\n  test('should display language codes PL and EN', async ({ page }) => {\n    await page.goto('/pl/');\n\n    const plCode = page.locator('.lang-code').filter({ hasText: 'PL' });\n    const enCode = page.locator('.lang-code').filter({ hasText: 'EN' });\n\n    await expect(plCode).toBeVisible();\n    await expect(enCode).toBeVisible();\n  });\n\n  test('should have Polish as active language on Polish homepage', async ({ page }) => {\n    await page.goto('/pl/');\n\n    const activeLang = page.locator('.lang-btn.active');\n    await expect(activeLang).toBeVisible();\n    await expect(activeLang.locator('.lang-code')).toContainText('PL');\n  });\n\n  test('should have English as active language on English homepage', async ({ page }) => {\n    await page.goto('/en/');\n\n    const activeLang = page.locator('.lang-btn.active');\n    await expect(activeLang).toBeVisible();\n    await expect(activeLang.locator('.lang-code')).toContainText('EN');\n  });\n\n  test('should switch from Polish to English homepage', async ({ page }) => {\n    await page.goto('/pl/');\n\n    // Click on English language button\n    const enButton = page.locator('.lang-btn').filter({ has: page.locator('.lang-code', { hasText: 'EN' }) });\n    await enButton.click();\n\n    // Should navigate to English homepage\n    await expect(page).toHaveURL(/\\/en\\/?$/);\n\n    // Verify content is in English\n    const headline = page.locator('[data-testid=\"hero-headline\"]');\n    await expect(headline).toContainText('Preschool in Wroclaw');\n  });\n\n  test('should switch from English to Polish homepage', async ({ page }) => {\n    await page.goto('/en/');\n\n    // Click on Polish language button\n    const plButton = page.locator('.lang-btn').filter({ has: page.locator('.lang-code', { hasText: 'PL' }) });\n    await plButton.click();\n\n    // Should navigate to Polish homepage\n    await expect(page).toHaveURL(/\\/pl\\/?$/);\n\n    // Verify content is in Polish\n    const headline = page.locator('[data-testid=\"hero-headline\"]');\n    await expect(headline).toContainText('Przedszkole we Wroclawiu');\n  });\n\n  test('should have hreflang attribute on language links', async ({ page }) => {\n    await page.goto('/pl/');\n\n    // English link should have hreflang=\"en\"\n    const enLink = page.locator('.lang-btn[hreflang=\"en\"]');\n    await expect(enLink).toBeVisible();\n  });\n\n  test('should have proper aria-label on language switcher', async ({ page }) => {\n    await page.goto('/pl/');\n\n    const languageSwitcher = page.locator('.language-switcher');\n    await expect(languageSwitcher).toHaveAttribute('aria-label', /wybor jezyka|language selection/i);\n  });\n\n  test('should have aria-current on active language', async ({ page }) => {\n    await page.goto('/pl/');\n\n    const activeLang = page.locator('.lang-btn.active');\n    await expect(activeLang).toHaveAttribute('aria-current', 'true');\n  });\n});",
  "new_string": "test.describe('Language Switching', () => {\n  test('should display language switcher in header', async ({ page }) => {\n    await page.goto('/pl/');\n    await page.waitForLoadState('networkidle');\n\n    // Target the language switcher in the header/navbar area\n    const headerLanguageSwitcher = page.locator('.site-header .language-switcher');\n    await expect(headerLanguageSwitcher).toBeVisible();\n  });\n\n  test('should display language toggle with flags', async ({ page }) => {\n    await page.goto('/pl/');\n    await page.waitForLoadState('networkidle');\n\n    // Target the first lang-toggle (in header)\n    const langToggle = page.locator('.site-header .lang-toggle');\n    await expect(langToggle).toBeVisible();\n\n    // Check for flag emojis in header\n    const plFlag = page.locator('.site-header .lang-flag').filter({ hasText: '🇵🇱' });\n    const enFlag = page.locator('.site-header .lang-flag').filter({ hasText: '🇬🇧' });\n\n    await expect(plFlag).toBeVisible();\n    await expect(enFlag).toBeVisible();\n  });\n\n  test('should display language codes PL and EN', async ({ page }) => {\n    await page.goto('/pl/');\n    await page.waitForLoadState('networkidle');\n\n    // Target lang-codes in header\n    const plCode = page.locator('.site-header .lang-code').filter({ hasText: 'PL' });\n    const enCode = page.locator('.site-header .lang-code').filter({ hasText: 'EN' });\n\n    await expect(plCode).toBeVisible();\n    await expect(enCode).toBeVisible();\n  });\n\n  test('should have Polish as active language on Polish homepage', async ({ page }) => {\n    await page.goto('/pl/');\n    await page.waitForLoadState('networkidle');\n\n    // Target active language in header\n    const activeLang = page.locator('.site-header .lang-btn.active');\n    await expect(activeLang).toBeVisible();\n    await expect(activeLang.locator('.lang-code')).toContainText('PL');\n  });\n\n  test('should have English as active language on English homepage', async ({ page }) => {\n    await page.goto('/en/');\n    await page.waitForLoadState('networkidle');\n\n    // Target active language in header\n    const activeLang = page.locator('.site-header .lang-btn.active');\n    await expect(activeLang).toBeVisible();\n    await expect(activeLang.locator('.lang-code')).toContainText('EN');\n  });\n\n  test('should switch from Polish to English homepage', async ({ page }) => {\n    await page.goto('/pl/');\n    await page.waitForLoadState('networkidle');\n\n    // Click on English language button in header\n    const enButton = page.locator('.site-header .lang-btn').filter({ has: page.locator('.lang-code', { hasText: 'EN' }) });\n    await enButton.click();\n\n    // Should navigate to English homepage\n    await expect(page).toHaveURL(/\\/en\\/?$/);\n\n    // Verify content is in English\n    const headline = page.locator('[data-testid=\"hero-headline\"]');\n    await expect(headline).toContainText('Preschool in Wroclaw');\n  });\n\n  test('should switch from English to Polish homepage', async ({ page }) => {\n    await page.goto('/en/');\n    await page.waitForLoadState('networkidle');\n\n    // Click on Polish language button in header\n    const plButton = page.locator('.site-header .lang-btn').filter({ has: page.locator('.lang-code', { hasText: 'PL' }) });\n    await plButton.click();\n\n    // Should navigate to Polish homepage\n    await expect(page).toHaveURL(/\\/pl\\/?$/);\n\n    // Verify content is in Polish\n    const headline = page.locator('[data-testid=\"hero-headline\"]');\n    await expect(headline).toContainText('Przedszkole we Wroclawiu');\n  });\n\n  test('should have hreflang attribute on language links', async ({ page }) => {\n    await page.goto('/pl/');\n    await page.waitForLoadState('networkidle');\n\n    // English link in header should have hreflang=\"en\"\n    const enLink = page.locator('.site-header .lang-btn[hreflang=\"en\"]');\n    await expect(enLink).toBeVisible();\n  });\n\n  test('should have proper aria-label on language switcher', async ({ page }) => {\n    await page.goto('/pl/');\n    await page.waitForLoadState('networkidle');\n\n    // Target header language switcher\n    const languageSwitcher = page.locator('.site-header .language-switcher');\n    await expect(languageSwitcher).toHaveAttribute('aria-label', /wybor jezyka|language selection/i);\n  });\n\n  test('should have aria-current on active language', async ({ page }) => {\n    await page.goto('/pl/');\n    await page.waitForLoadState('networkidle');\n\n    // Target active language in header\n    const activeLang = page.locator('.site-header .lang-btn.active');\n    await expect(activeLang).toHaveAttribute('aria-current', 'true');\n  });\n});"
}
Now let me also fix the mobile menu test that checks the language switcher:

🔧 Tool: Edit
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/tests/homepage.spec.ts",
  "old_string": "  test('should display language switcher in mobile menu', async ({ page }) => {\n    await page.setViewportSize({ width: 375, height: 667 });\n    await page.goto('/pl/');\n\n    // Open mobile menu\n    const menuToggle = page.locator('.navbar-toggler');\n    await menuToggle.click();\n\n    // Language switcher should be visible\n    const languageSwitcher = page.locator('.language-switcher');\n    await expect(languageSwitcher).toBeVisible({ timeout: 5000 });\n  });",
  "new_string": "  test('should display language switcher in mobile menu', async ({ page }) => {\n    await page.setViewportSize({ width: 375, height: 667 });\n    await page.goto('/pl/');\n    await page.waitForLoadState('networkidle');\n\n    // Open mobile menu\n    const menuToggle = page.locator('.navbar-toggler');\n    await menuToggle.click();\n\n    // Language switcher in the mobile nav should be visible\n    const languageSwitcher = page.locator('#navbarMain .language-switcher');\n    await expect(languageSwitcher).toBeVisible({ timeout: 5000 });\n  });"
}

🔧 Tool: Edit
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/tests/homepage.spec.ts",
  "old_string": "  test('should have navigation role on language switcher', async ({ page }) => {\n    await page.goto('/pl/');\n\n    const languageSwitcher = page.locator('.language-switcher');\n    await expect(languageSwitcher).toHaveAttribute('role', 'navigation');\n  });",
  "new_string": "  test('should have navigation role on language switcher', async ({ page }) => {\n    await page.goto('/pl/');\n    await page.waitForLoadState('networkidle');\n\n    // Target header language switcher\n    const languageSwitcher = page.locator('.site-header .language-switcher');\n    await expect(languageSwitcher).toHaveAttribute('role', 'navigation');\n  });"
}
Now let me run the tests again to check the status:

🔧 Tool: Bash
Input: {
  "command": "npx playwright test tests/homepage.spec.ts --reporter=list 2>&1 | tail -100",
  "description": "Run homepage tests again",
  "timeout": 300000
}
All 174 tests pass now. Let me update the todo list and provide a summary:

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Explore codebase structure and existing patterns",
      "status": "completed",
      "activeForm": "Exploring codebase structure and existing patterns"
    },
    {
      "content": "Understand homepage functionality to test",
      "status": "completed",
      "activeForm": "Understanding homepage functionality to test"
    },
    {
      "content": "Write Playwright tests for homepage",
      "status": "completed",
      "activeForm": "Writing Playwright tests for homepage"
    },
    {
      "content": "Run and verify tests pass",
      "status": "completed",
      "activeForm": "Running and verifying tests pass"
    }
  ]
}
<summary>
## Summary: Write Playwright tests for homepage functionality

### Changes Implemented
- Created comprehensive Playwright E2E tests for homepage functionality covering:
  - **Hero Section Rendering** (Polish & English): Tests for hero section visibility, headline, subheadline, and CTA buttons with correct localized text
  - **Features Section Display** (Polish & English): Tests for features section heading, subtitle, feature cards (6 cards), icons, titles, and descriptions
  - **Navigation Links** (Polish & English): Tests for header, navbar brand, navigation menu, active states, page navigation, and dropdown menus
  - **Language Switching**: Tests for language switcher display, flags, language codes, active language state, switching between languages, hreflang attributes, and accessibility attributes
  - **Responsive Navigation**: Tests for mobile menu toggle, collapsed navigation, menu opening, and language switcher in mobile menu
  - **Homepage Accessibility**: Tests for document language attribute, heading hierarchy, h1 count, navigation roles, and aria labels
  - **Page Load and Performance**: Tests for successful page load (200 status) and root URL redirect to default language

### Files Modified
- `/Users/romanbartusiak/git/riomus/wesole_nutki/tests/homepage.spec.ts` (new file)

### Test Coverage
- **174 total tests** across 3 browsers (Chromium, Firefox, WebKit)
- 58 unique test cases covering both Polish and English homepages
- All tests passing in 26.1 seconds

### Notes for Developer
- Tests follow the existing patterns established in `gallery.spec.ts`
- Uses data-testid attributes already present in hero section templates
- Language switcher tests target `.site-header .language-switcher` to avoid conflicts with footer language switcher
- Tests include `waitForLoadState('networkidle')` for stability across browsers
- Tests verify i18n content for key homepage elements (hero headline, subheadline, feature titles, navigation links)

### Verification Status
- All 174 tests pass across Chromium, Firefox, and WebKit browsers
- Tests verified homepage rendering, navigation functionality, language switching, responsive behavior, and accessibility features
- Tests are permanent additions to the test suite (not temporary verification tests as this was the feature request itself)
</summary>