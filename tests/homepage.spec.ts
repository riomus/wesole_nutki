import { test, expect } from '@playwright/test';

/**
 * Homepage E2E Tests
 * Tests for hero section rendering, the "proof" reasons section, navigation
 * links and language switching in both Polish and English.
 *
 * The homepage follows the music-led redesign: an editorial hero, a
 * three-item "Co słychać / What sets the rhythm" proof section (id
 * "features-section"), and a data-driven navigation menu.
 */

test.describe('Hero Section Rendering', () => {
  test.describe('Polish Homepage', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/');
    });

    test('should display hero section', async ({ page }) => {
      await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    });

    test('should display hero headline in Polish', async ({ page }) => {
      const headline = page.locator('[data-testid="hero-headline"]');
      await expect(headline).toBeVisible();
      await expect(headline).toContainText('Dzieci rosną w rytmie muzyki');
    });

    test('should display hero subheadline in Polish', async ({ page }) => {
      const subheadline = page.locator('[data-testid="hero-subheadline"]');
      await expect(subheadline).toBeVisible();
      await expect(subheadline).toContainText('Kameralne przedszkole w sercu Wrocławia');
    });

    test('should display hero CTA buttons', async ({ page }) => {
      await expect(page.locator('[data-testid="hero-buttons"]')).toBeVisible();
      const ctaButtons = page.locator('[data-testid="hero-cta-button"]');
      expect(await ctaButtons.count()).toBeGreaterThan(0);
    });

    test('should have hero CTA actions with correct text', async ({ page }) => {
      // Primary call action (phone) + email + "meet us" link
      await expect(page.locator('[data-testid="hero-primary-call"]')).toContainText(/zadzwoń/i);
      await expect(
        page.locator('[data-testid="hero-cta-button"]').filter({ hasText: 'Napisz do nas' }),
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="hero-cta-button"]').filter({ hasText: 'Poznaj Wesołe Nutki' }),
      ).toBeVisible();
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
      await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    });

    test('should display hero headline in English', async ({ page }) => {
      const headline = page.locator('[data-testid="hero-headline"]');
      await expect(headline).toBeVisible();
      await expect(headline).toContainText('Children grow through music');
    });

    test('should display hero subheadline in English', async ({ page }) => {
      const subheadline = page.locator('[data-testid="hero-subheadline"]');
      await expect(subheadline).toBeVisible();
      await expect(subheadline).toContainText('intimate preschool in the heart of Wrocław');
    });

    test('should display hero CTA actions in English', async ({ page }) => {
      await expect(page.locator('[data-testid="hero-primary-call"]')).toContainText(/call/i);
      await expect(
        page.locator('[data-testid="hero-cta-button"]').filter({ hasText: 'Email us' }),
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="hero-cta-button"]').filter({ hasText: 'Meet Wesole Nutki' }),
      ).toBeVisible();
    });
  });
});

test.describe('Proof Section Display', () => {
  test.describe('Polish Homepage', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/');
    });

    test('should display the proof section', async ({ page }) => {
      await expect(page.locator('#features-section')).toBeVisible();
    });

    test('should display the section heading in Polish', async ({ page }) => {
      const heading = page.locator('#features-section h2');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('Co słychać w Wesołych Nutkach?');
    });

    test('should display the section subtitle in Polish', async ({ page }) => {
      const subtitle = page.locator('#features-section .music-section-heading > p').last();
      await expect(subtitle).toBeVisible();
      await expect(subtitle).toContainText('Trzy rzeczy, które naprawdę kształtują codzienność dzieci');
    });

    test('should display three proof cards', async ({ page }) => {
      await expect(page.locator('#features-section .proof-item')).toHaveCount(3);
    });

    test('should display a numbered bead on every card', async ({ page }) => {
      await expect(page.locator('#features-section .proof-number')).toHaveCount(3);
    });

    test('should display proof titles in Polish', async ({ page }) => {
      const titles = page.locator('#features-section .proof-item h3');
      await expect(titles.filter({ hasText: 'Muzyka na co dzień' })).toBeVisible();
      await expect(titles.filter({ hasText: 'Języki w naturalnym rytmie' })).toBeVisible();
      await expect(titles.filter({ hasText: 'Kameralna, bliska opieka' })).toBeVisible();
    });

    test('should display non-empty proof descriptions', async ({ page }) => {
      const descriptions = page.locator('#features-section .proof-item p');
      await expect(descriptions).toHaveCount(3);
      const text = await descriptions.first().textContent();
      expect(text?.length).toBeGreaterThan(10);
    });
  });

  test.describe('English Homepage', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/');
    });

    test('should display the section heading in English', async ({ page }) => {
      const heading = page.locator('#features-section h2');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('What sets the rhythm at Wesole Nutki?');
    });

    test('should display the section subtitle in English', async ({ page }) => {
      const subtitle = page.locator('#features-section .music-section-heading > p').last();
      await expect(subtitle).toBeVisible();
      await expect(subtitle).toContainText("Three things that genuinely shape every child's day");
    });

    test('should display proof titles in English', async ({ page }) => {
      const titles = page.locator('#features-section .proof-item h3');
      await expect(titles.filter({ hasText: 'Music every day' })).toBeVisible();
      await expect(titles.filter({ hasText: 'Languages in a natural rhythm' })).toBeVisible();
      await expect(titles.filter({ hasText: 'Small-scale, attentive care' })).toBeVisible();
    });
  });
});

test.describe('Navigation Links', () => {
  test.describe('Polish Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/');
    });

    test('should display navigation header', async ({ page }) => {
      await expect(page.locator('.site-header')).toBeVisible();
    });

    test('should display navbar brand/logo linking home', async ({ page }) => {
      const brand = page.locator('.navbar-brand');
      await expect(brand).toBeVisible();
      await expect(brand).toHaveAttribute('href', /\/pl\/?$/);
    });

    test('should display main navigation menu', async ({ page }) => {
      await expect(page.locator('.navbar-nav')).toBeVisible();
    });

    test('should display navigation links in Polish', async ({ page }) => {
      const navLinks = page.locator('.navbar-nav .nav-link');
      await expect(navLinks.filter({ hasText: 'O nas' })).toBeVisible();
      await expect(navLinks.filter({ hasText: 'Oferta' })).toBeVisible();
      await expect(navLinks.filter({ hasText: 'Dla rodziców' })).toBeVisible();
      await expect(navLinks.filter({ hasText: 'Aktualności' })).toBeVisible();
      await expect(navLinks.filter({ hasText: 'Kontakt' })).toBeVisible();
    });

    test('should navigate to News page when clicking Aktualności', async ({ page }) => {
      await page.locator('.navbar-nav .nav-link').filter({ hasText: 'Aktualności' }).click();
      await expect(page).toHaveURL(/\/pl\/news\/?$/);
    });

    test('should navigate to Contact page when clicking Kontakt', async ({ page }) => {
      await page.locator('.navbar-nav .nav-link').filter({ hasText: 'Kontakt' }).click();
      await expect(page).toHaveURL(/\/pl\/contact\/?$/);
    });

    test('should open the "O nas" dropdown and reach the gallery', async ({ page }) => {
      const toggle = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'O nas' });
      await expect(toggle).toBeVisible();
      await toggle.click();

      const gallery = page.locator('.dropdown-item').filter({ hasText: 'Galerie' });
      await expect(gallery).toBeVisible();
      await gallery.click();
      await expect(page).toHaveURL(/\/pl\/gallery\/?$/);
    });

    test('should display the Oferta dropdown items', async ({ page }) => {
      const toggle = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Oferta' });
      await expect(toggle).toBeVisible();
      await toggle.click();

      await expect(page.locator('.dropdown-item').filter({ hasText: 'Plan dnia' })).toBeVisible();
      await expect(page.locator('.dropdown-item').filter({ hasText: 'Zajęcia dodatkowe' })).toBeVisible();
    });
  });

  test.describe('English Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/');
    });

    test('should display navigation links in English', async ({ page }) => {
      const navLinks = page.locator('.navbar-nav .nav-link');
      await expect(navLinks.filter({ hasText: 'About' })).toBeVisible();
      await expect(navLinks.filter({ hasText: 'Offer' })).toBeVisible();
      await expect(navLinks.filter({ hasText: 'For parents' })).toBeVisible();
      await expect(navLinks.filter({ hasText: 'News' })).toBeVisible();
      await expect(navLinks.filter({ hasText: 'Contact' })).toBeVisible();
    });

    test('should display navbar brand linking to English home', async ({ page }) => {
      await expect(page.locator('.navbar-brand')).toHaveAttribute('href', /\/en\/?$/);
    });

    test('should navigate to English News page', async ({ page }) => {
      await page.locator('.navbar-nav .nav-link').filter({ hasText: 'News' }).click();
      await expect(page).toHaveURL(/\/en\/news\/?$/);
    });

    test('should display the Offer dropdown items', async ({ page }) => {
      const toggle = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Offer' });
      await expect(toggle).toBeVisible();
      await toggle.click();

      await expect(page.locator('.dropdown-item').filter({ hasText: 'Daily plan' })).toBeVisible();
      await expect(page.locator('.dropdown-item').filter({ hasText: 'Extra activities' })).toBeVisible();
    });
  });
});

test.describe('Language Switching', () => {
  test('should display language switcher in header', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.site-header .language-switcher')).toBeVisible();
  });

  test('should display language toggle with flags', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.site-header .lang-toggle')).toBeVisible();
    await expect(page.locator('.site-header .lang-flag').filter({ hasText: '🇵🇱' })).toBeVisible();
    await expect(page.locator('.site-header .lang-flag').filter({ hasText: '🇬🇧' })).toBeVisible();
  });

  test('should display language codes PL and EN', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.site-header .lang-code').filter({ hasText: 'PL' })).toBeVisible();
    await expect(page.locator('.site-header .lang-code').filter({ hasText: 'EN' })).toBeVisible();
  });

  test('should have Polish as active language on Polish homepage', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    const activeLang = page.locator('.site-header .lang-btn.active');
    await expect(activeLang).toBeVisible();
    await expect(activeLang.locator('.lang-code')).toContainText('PL');
  });

  test('should have English as active language on English homepage', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');

    const activeLang = page.locator('.site-header .lang-btn.active');
    await expect(activeLang).toBeVisible();
    await expect(activeLang.locator('.lang-code')).toContainText('EN');
  });

  test('should switch from Polish to English homepage', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    const enButton = page.locator('.site-header .lang-btn').filter({ has: page.locator('.lang-code', { hasText: 'EN' }) });
    await enButton.click();

    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(page.locator('[data-testid="hero-headline"]')).toContainText('Children grow through music');
  });

  test('should switch from English to Polish homepage', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');

    const plButton = page.locator('.site-header .lang-btn').filter({ has: page.locator('.lang-code', { hasText: 'PL' }) });
    await plButton.click();

    await expect(page).toHaveURL(/\/pl\/?$/);
    await expect(page.locator('[data-testid="hero-headline"]')).toContainText('Dzieci rosną w rytmie muzyki');
  });

  test('should have hreflang attribute on language links', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.site-header .lang-btn[hreflang="en"]')).toBeVisible();
  });

  test('should have aria-current on active language', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.site-header .lang-btn.active')).toHaveAttribute('aria-current', 'true');
  });
});

test.describe('Responsive Navigation', () => {
  test('should display mobile menu toggle on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pl/');
    await expect(page.locator('.navbar-toggler')).toBeVisible();
  });

  test('should hide desktop navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pl/');
    await expect(page.locator('#navbarMain')).not.toBeVisible();
  });

  test('should open mobile menu when clicking toggle', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pl/');

    await page.locator('.navbar-toggler').click();
    await expect(page.locator('#navbarMain')).toBeVisible({ timeout: 5000 });
  });

  test('should display navigation links in mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pl/');

    await page.locator('.navbar-toggler').click();

    await expect(
      page.locator('.navbar-nav .nav-link').filter({ hasText: 'O nas' }),
    ).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: 'Kontakt' })).toBeVisible();
  });

  test('should display language switcher in mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    await page.locator('.navbar-toggler').click();
    await expect(page.locator('#navbarMain .language-switcher')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Homepage Accessibility', () => {
  test('should have proper document language attribute for Polish', async ({ page }) => {
    await page.goto('/pl/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
  });

  test('should have proper document language attribute for English', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('should have heading hierarchy starting with h1', async ({ page }) => {
    await page.goto('/pl/');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should have only one h1 on the page', async ({ page }) => {
    await page.goto('/pl/');
    expect(await page.locator('h1').count()).toBe(1);
  });

  test('should have navigation role on language switcher', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.site-header .language-switcher')).toHaveAttribute('role', 'navigation');
  });

  test('should have aria-label on mobile menu toggle', async ({ page }) => {
    await page.goto('/pl/');
    const ariaLabel = await page.locator('.navbar-toggler').getAttribute('aria-label');
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
    await expect(page).toHaveURL(/\/pl\/?$/);
  });
});
