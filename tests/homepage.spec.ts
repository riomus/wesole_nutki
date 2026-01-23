import { test, expect } from '@playwright/test';

/**
 * Homepage E2E Tests
 * Tests for hero section rendering, features display, navigation links,
 * and language switching in both Polish and English.
 */

test.describe('Hero Section Rendering', () => {
  test.describe('Polish Homepage', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/');
    });

    test('should display hero section', async ({ page }) => {
      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toBeVisible();
    });

    test('should display hero headline in Polish', async ({ page }) => {
      const headline = page.locator('[data-testid="hero-headline"]');
      await expect(headline).toBeVisible();
      await expect(headline).toContainText('Wesole Nutki - Przedszkole we Wroclawiu');
    });

    test('should display hero subheadline in Polish', async ({ page }) => {
      const subheadline = page.locator('[data-testid="hero-subheadline"]');
      await expect(subheadline).toBeVisible();
      await expect(subheadline).toContainText('Miejsce, gdzie kazde dziecko odkrywa radosc nauki');
    });

    test('should display hero CTA buttons', async ({ page }) => {
      const buttonsContainer = page.locator('[data-testid="hero-buttons"]');
      await expect(buttonsContainer).toBeVisible();

      const ctaButtons = page.locator('[data-testid="hero-cta-button"]');
      const count = await ctaButtons.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have hero CTA buttons with correct text', async ({ page }) => {
      const ctaButtons = page.locator('[data-testid="hero-cta-button"]');

      // Check for "Learn more" button
      const learnMoreButton = ctaButtons.filter({ hasText: 'Dowiedz sie wiecej' });
      await expect(learnMoreButton).toBeVisible();

      // Check for "Contact us" button
      const contactButton = ctaButtons.filter({ hasText: 'Skontaktuj sie' });
      await expect(contactButton).toBeVisible();
    });

    test('should have clickable hero CTA buttons', async ({ page }) => {
      const firstButton = page.locator('[data-testid="hero-cta-button"]').first();
      await expect(firstButton).toBeEnabled();

      const href = await firstButton.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).not.toBe('#');
    });
  });

  test.describe('English Homepage', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/');
    });

    test('should display hero section', async ({ page }) => {
      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toBeVisible();
    });

    test('should display hero headline in English', async ({ page }) => {
      const headline = page.locator('[data-testid="hero-headline"]');
      await expect(headline).toBeVisible();
      await expect(headline).toContainText('Wesole Nutki - Preschool in Wroclaw');
    });

    test('should display hero subheadline in English', async ({ page }) => {
      const subheadline = page.locator('[data-testid="hero-subheadline"]');
      await expect(subheadline).toBeVisible();
      await expect(subheadline).toContainText('A place where every child discovers the joy of learning');
    });

    test('should display hero CTA buttons in English', async ({ page }) => {
      const ctaButtons = page.locator('[data-testid="hero-cta-button"]');

      // Check for "Learn More" button
      const learnMoreButton = ctaButtons.filter({ hasText: 'Learn More' });
      await expect(learnMoreButton).toBeVisible();

      // Check for "Contact Us" button
      const contactButton = ctaButtons.filter({ hasText: 'Contact Us' });
      await expect(contactButton).toBeVisible();
    });
  });
});

test.describe('Features Section Display', () => {
  test.describe('Polish Homepage', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/');
    });

    test('should display features section', async ({ page }) => {
      const featuresSection = page.locator('#features-section');
      await expect(featuresSection).toBeVisible();
    });

    test('should display features section heading in Polish', async ({ page }) => {
      const heading = page.locator('#features-section .section-heading');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('Dlaczego my?');
    });

    test('should display features section subtitle in Polish', async ({ page }) => {
      const subtitle = page.locator('#features-section .section-subtitle');
      await expect(subtitle).toBeVisible();
      await expect(subtitle).toContainText('Odkryj, co sprawia, ze nasze przedszkole jest wyjatkowe');
    });

    test('should display feature cards', async ({ page }) => {
      const featureCards = page.locator('#features-section .feature-card');
      const count = await featureCards.count();
      expect(count).toBe(6);
    });

    test('should display feature icons', async ({ page }) => {
      const featureIcons = page.locator('#features-section .feature-icon');
      const count = await featureIcons.count();
      expect(count).toBe(6);
    });

    test('should display feature titles in Polish', async ({ page }) => {
      const featureTitles = page.locator('#features-section .feature-card h3');

      // Check for expected feature titles
      await expect(featureTitles.filter({ hasText: 'Serdeczna opieka' })).toBeVisible();
      await expect(featureTitles.filter({ hasText: 'Edukacja na najwyzszym poziomie' })).toBeVisible();
      await expect(featureTitles.filter({ hasText: 'Spolecznosc' })).toBeVisible();
      await expect(featureTitles.filter({ hasText: 'Bezpieczne Srodowisko' })).toBeVisible();
      await expect(featureTitles.filter({ hasText: 'Nauka przez Zabawe' })).toBeVisible();
      await expect(featureTitles.filter({ hasText: 'Wykwalifikowani Nauczyciele' })).toBeVisible();
    });

    test('should display feature descriptions', async ({ page }) => {
      const featureDescriptions = page.locator('#features-section .feature-card p');
      const count = await featureDescriptions.count();
      expect(count).toBe(6);

      // Verify descriptions are not empty
      const firstDescription = featureDescriptions.first();
      const text = await firstDescription.textContent();
      expect(text?.length).toBeGreaterThan(10);
    });
  });

  test.describe('English Homepage', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/');
    });

    test('should display features section heading in English', async ({ page }) => {
      const heading = page.locator('#features-section .section-heading');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('Why Choose Us?');
    });

    test('should display features section subtitle in English', async ({ page }) => {
      const subtitle = page.locator('#features-section .section-subtitle');
      await expect(subtitle).toBeVisible();
      await expect(subtitle).toContainText('Discover what makes our preschool special');
    });

    test('should display feature titles in English', async ({ page }) => {
      const featureTitles = page.locator('#features-section .feature-card h3');

      // Check for expected feature titles in English
      await expect(featureTitles.filter({ hasText: 'Loving Care' })).toBeVisible();
      await expect(featureTitles.filter({ hasText: 'Quality Education' })).toBeVisible();
      await expect(featureTitles.filter({ hasText: 'Community' })).toBeVisible();
      await expect(featureTitles.filter({ hasText: 'Safe Environment' })).toBeVisible();
      await expect(featureTitles.filter({ hasText: 'Play-Based Learning' })).toBeVisible();
      await expect(featureTitles.filter({ hasText: 'Qualified Teachers' })).toBeVisible();
    });
  });
});

test.describe('Navigation Links', () => {
  test.describe('Polish Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/');
    });

    test('should display navigation header', async ({ page }) => {
      const header = page.locator('.site-header');
      await expect(header).toBeVisible();
    });

    test('should display navbar brand/logo', async ({ page }) => {
      const brand = page.locator('.navbar-brand');
      await expect(brand).toBeVisible();
    });

    test('should display main navigation menu', async ({ page }) => {
      const navMenu = page.locator('.navbar-nav');
      await expect(navMenu).toBeVisible();
    });

    test('should display navigation links in Polish', async ({ page }) => {
      const navLinks = page.locator('.navbar-nav .nav-link');

      // Check for expected navigation items
      await expect(navLinks.filter({ hasText: 'Strona Glowna' })).toBeVisible();
      await expect(navLinks.filter({ hasText: 'O Nas' })).toBeVisible();
      await expect(navLinks.filter({ hasText: 'Oferta' })).toBeVisible();
      await expect(navLinks.filter({ hasText: 'Aktualnosci' })).toBeVisible();
      await expect(navLinks.filter({ hasText: 'Galeria' })).toBeVisible();
      await expect(navLinks.filter({ hasText: 'Kontakt' })).toBeVisible();
    });

    test('should have active state on home link', async ({ page }) => {
      const homeLink = page.locator('.navbar-nav .nav-link').filter({ hasText: 'Strona Glowna' });
      await expect(homeLink).toHaveClass(/active/);
    });

    test('should navigate to About page when clicking O Nas', async ({ page }) => {
      const aboutLink = page.locator('.navbar-nav .nav-link').filter({ hasText: 'O Nas' });
      await aboutLink.click();
      await expect(page).toHaveURL(/\/pl\/about\/?$/);
    });

    test('should navigate to News page when clicking Aktualnosci', async ({ page }) => {
      const newsLink = page.locator('.navbar-nav .nav-link').filter({ hasText: 'Aktualnosci' });
      await newsLink.click();
      await expect(page).toHaveURL(/\/pl\/news\/?$/);
    });

    test('should navigate to Gallery page when clicking Galeria', async ({ page }) => {
      const galleryLink = page.locator('.navbar-nav .nav-link').filter({ hasText: 'Galeria' });
      await galleryLink.click();
      await expect(page).toHaveURL(/\/pl\/gallery\/?$/);
    });

    test('should navigate to Contact page when clicking Kontakt', async ({ page }) => {
      const contactLink = page.locator('.navbar-nav .nav-link').filter({ hasText: 'Kontakt' });
      await contactLink.click();
      await expect(page).toHaveURL(/\/pl\/contact\/?$/);
    });

    test('should display dropdown menu for Oferta', async ({ page }) => {
      const programsDropdown = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Oferta' });
      await expect(programsDropdown).toBeVisible();

      // Click to open dropdown
      await programsDropdown.click();

      // Check dropdown menu is visible
      const dropdownMenu = page.locator('.dropdown-menu').filter({ has: page.locator('text=Nasza Oferta') });
      await expect(dropdownMenu).toBeVisible();

      // Check dropdown items
      await expect(page.locator('.dropdown-item').filter({ hasText: 'Nasza Oferta' })).toBeVisible();
      await expect(page.locator('.dropdown-item').filter({ hasText: 'Plan Dnia' })).toBeVisible();
    });
  });

  test.describe('English Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/');
    });

    test('should display navigation links in English', async ({ page }) => {
      const navLinks = page.locator('.navbar-nav .nav-link');

      // Check for expected navigation items in English
      await expect(navLinks.filter({ hasText: 'Home' })).toBeVisible();
      await expect(navLinks.filter({ hasText: 'About Us' })).toBeVisible();
      await expect(navLinks.filter({ hasText: 'Programs' })).toBeVisible();
      await expect(navLinks.filter({ hasText: 'News' })).toBeVisible();
      await expect(navLinks.filter({ hasText: 'Gallery' })).toBeVisible();
      await expect(navLinks.filter({ hasText: 'Contact' })).toBeVisible();
    });

    test('should have active state on home link', async ({ page }) => {
      const homeLink = page.locator('.navbar-nav .nav-link').filter({ hasText: 'Home' });
      await expect(homeLink).toHaveClass(/active/);
    });

    test('should navigate to English About page', async ({ page }) => {
      const aboutLink = page.locator('.navbar-nav .nav-link').filter({ hasText: 'About Us' });
      await aboutLink.click();
      await expect(page).toHaveURL(/\/en\/about\/?$/);
    });

    test('should display dropdown menu for Programs', async ({ page }) => {
      const programsDropdown = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Programs' });
      await expect(programsDropdown).toBeVisible();

      // Click to open dropdown
      await programsDropdown.click();

      // Check dropdown menu is visible with English items
      await expect(page.locator('.dropdown-item').filter({ hasText: 'Our Programs' })).toBeVisible();
      await expect(page.locator('.dropdown-item').filter({ hasText: 'Daily Schedule' })).toBeVisible();
    });
  });
});

test.describe('Language Switching', () => {
  test('should display language switcher in header', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Target the language switcher in the header/navbar area
    const headerLanguageSwitcher = page.locator('.site-header .language-switcher');
    await expect(headerLanguageSwitcher).toBeVisible();
  });

  test('should display language toggle with flags', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Target the first lang-toggle (in header)
    const langToggle = page.locator('.site-header .lang-toggle');
    await expect(langToggle).toBeVisible();

    // Check for flag emojis in header
    const plFlag = page.locator('.site-header .lang-flag').filter({ hasText: '🇵🇱' });
    const enFlag = page.locator('.site-header .lang-flag').filter({ hasText: '🇬🇧' });

    await expect(plFlag).toBeVisible();
    await expect(enFlag).toBeVisible();
  });

  test('should display language codes PL and EN', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Target lang-codes in header
    const plCode = page.locator('.site-header .lang-code').filter({ hasText: 'PL' });
    const enCode = page.locator('.site-header .lang-code').filter({ hasText: 'EN' });

    await expect(plCode).toBeVisible();
    await expect(enCode).toBeVisible();
  });

  test('should have Polish as active language on Polish homepage', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Target active language in header
    const activeLang = page.locator('.site-header .lang-btn.active');
    await expect(activeLang).toBeVisible();
    await expect(activeLang.locator('.lang-code')).toContainText('PL');
  });

  test('should have English as active language on English homepage', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');

    // Target active language in header
    const activeLang = page.locator('.site-header .lang-btn.active');
    await expect(activeLang).toBeVisible();
    await expect(activeLang.locator('.lang-code')).toContainText('EN');
  });

  test('should switch from Polish to English homepage', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Click on English language button in header
    const enButton = page.locator('.site-header .lang-btn').filter({ has: page.locator('.lang-code', { hasText: 'EN' }) });
    await enButton.click();

    // Should navigate to English homepage
    await expect(page).toHaveURL(/\/en\/?$/);

    // Verify content is in English
    const headline = page.locator('[data-testid="hero-headline"]');
    await expect(headline).toContainText('Preschool in Wroclaw');
  });

  test('should switch from English to Polish homepage', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');

    // Click on Polish language button in header
    const plButton = page.locator('.site-header .lang-btn').filter({ has: page.locator('.lang-code', { hasText: 'PL' }) });
    await plButton.click();

    // Should navigate to Polish homepage
    await expect(page).toHaveURL(/\/pl\/?$/);

    // Verify content is in Polish
    const headline = page.locator('[data-testid="hero-headline"]');
    await expect(headline).toContainText('Przedszkole we Wroclawiu');
  });

  test('should have hreflang attribute on language links', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // English link in header should have hreflang="en"
    const enLink = page.locator('.site-header .lang-btn[hreflang="en"]');
    await expect(enLink).toBeVisible();
  });

  test('should have proper aria-label on language switcher', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Target header language switcher
    const languageSwitcher = page.locator('.site-header .language-switcher');
    await expect(languageSwitcher).toHaveAttribute('aria-label', /wybor jezyka|language selection/i);
  });

  test('should have aria-current on active language', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Target active language in header
    const activeLang = page.locator('.site-header .lang-btn.active');
    await expect(activeLang).toHaveAttribute('aria-current', 'true');
  });
});

test.describe('Responsive Navigation', () => {
  test('should display mobile menu toggle on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pl/');

    const menuToggle = page.locator('.navbar-toggler');
    await expect(menuToggle).toBeVisible();
  });

  test('should hide desktop navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pl/');

    // Navigation should be collapsed
    const navCollapse = page.locator('#navbarMain');
    await expect(navCollapse).not.toBeVisible();
  });

  test('should open mobile menu when clicking toggle', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pl/');

    const menuToggle = page.locator('.navbar-toggler');
    await menuToggle.click();

    // Wait for menu to expand
    const navCollapse = page.locator('#navbarMain');
    await expect(navCollapse).toBeVisible({ timeout: 5000 });
  });

  test('should display navigation links in mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pl/');

    // Open mobile menu
    const menuToggle = page.locator('.navbar-toggler');
    await menuToggle.click();

    // Check navigation links are visible
    await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: 'Strona Glowna' })).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: 'O Nas' })).toBeVisible();
  });

  test('should display language switcher in mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Open mobile menu
    const menuToggle = page.locator('.navbar-toggler');
    await menuToggle.click();

    // Language switcher in the mobile nav should be visible
    const languageSwitcher = page.locator('#navbarMain .language-switcher');
    await expect(languageSwitcher).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Homepage Accessibility', () => {
  test('should have proper document language attribute for Polish', async ({ page }) => {
    await page.goto('/pl/');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'pl');
  });

  test('should have proper document language attribute for English', async ({ page }) => {
    await page.goto('/en/');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
  });

  test('should have heading hierarchy starting with h1', async ({ page }) => {
    await page.goto('/pl/');

    // Check h1 exists
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('should have only one h1 on the page', async ({ page }) => {
    await page.goto('/pl/');

    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('should have navigation role on language switcher', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Target header language switcher
    const languageSwitcher = page.locator('.site-header .language-switcher');
    await expect(languageSwitcher).toHaveAttribute('role', 'navigation');
  });

  test('should have aria-label on mobile menu toggle', async ({ page }) => {
    await page.goto('/pl/');

    const menuToggle = page.locator('.navbar-toggler');
    const ariaLabel = await menuToggle.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });
});

test.describe('Page Load and Performance', () => {
  test('should load Polish homepage successfully', async ({ page }) => {
    const response = await page.goto('/pl/');
    expect(response?.status()).toBe(200);
  });

  test('should load English homepage successfully', async ({ page }) => {
    const response = await page.goto('/en/');
    expect(response?.status()).toBe(200);
  });

  test('should redirect root to default language', async ({ page }) => {
    await page.goto('/');

    // Should redirect to Polish (default language)
    await expect(page).toHaveURL(/\/pl\/?$/);
  });
});
