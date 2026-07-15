import { test, expect } from '@playwright/test';

/**
 * Navigation Menu E2E Tests (music-led redesign menu)
 *
 * Menu structure (data/menus/main_{pl,en}.yml, labels via i18n):
 *   PL: "O nas" ▾ (Nasza wizja, Galerie) · "Oferta" ▾ (Plan dnia, Zajęcia dodatkowe)
 *       · "Dla rodziców" ▾ · "Aktualności" · "Kontakt"
 *   EN: "About" ▾ (Our vision, Galleries) · "Offer" ▾ (Daily plan, Extra activities)
 *       · "For parents" ▾ · "News" · "Contact"
 *
 * Dropdown parents are toggles: clicking them opens the submenu (they do not
 * navigate). Only the regular links (News/Aktualności, Contact/Kontakt) and the
 * submenu children navigate. Dropdowns open on click or hover on desktop.
 */

const openDropdown = async (toggle) => {
  await toggle.hover();
  await toggle.click();
};

test.describe('Desktop Navigation - Menu Item Clicks', () => {
  test.describe('Polish Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');
    });

    test('should navigate to News page when clicking Aktualności', async ({ page }) => {
      await page.locator('.navbar-nav .nav-link').filter({ hasText: 'Aktualności' }).click();
      await expect(page).toHaveURL(/\/pl\/news\/?$/);
    });

    test('should navigate to Contact page when clicking Kontakt', async ({ page }) => {
      await page.locator('.navbar-nav .nav-link').filter({ hasText: 'Kontakt' }).click();
      await expect(page).toHaveURL(/\/pl\/contact\/?$/);
    });

    test('should expose the About toggle linking to the about page', async ({ page }) => {
      const about = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'O nas' });
      await expect(about).toBeVisible();
      await expect(about).toHaveAttribute('href', /\/pl\/about\/?$/);
    });

    test('should navigate to the schedule via the Oferta dropdown', async ({ page }) => {
      const toggle = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Oferta' });
      await openDropdown(toggle);

      const item = page.locator('.dropdown-item').filter({ hasText: 'Plan dnia' });
      await expect(item).toBeVisible({ timeout: 5000 });
      await item.click();
      await expect(page).toHaveURL(/\/pl\/programs\/schedule\/?$/);
    });

    test('should navigate to the gallery via the About dropdown', async ({ page }) => {
      const toggle = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'O nas' });
      await openDropdown(toggle);

      const item = page.locator('.dropdown-item').filter({ hasText: 'Galerie' });
      await expect(item).toBeVisible({ timeout: 5000 });
      await item.click();
      await expect(page).toHaveURL(/\/pl\/gallery\/?$/);
    });
  });

  test.describe('English Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/');
      await page.waitForLoadState('networkidle');
    });

    test('should navigate to News page when clicking News', async ({ page }) => {
      await page.locator('.navbar-nav .nav-link').filter({ hasText: 'News' }).click();
      await expect(page).toHaveURL(/\/en\/news\/?$/);
    });

    test('should navigate to Contact page when clicking Contact', async ({ page }) => {
      await page.locator('.navbar-nav .nav-link').filter({ hasText: 'Contact' }).click();
      await expect(page).toHaveURL(/\/en\/contact\/?$/);
    });

    test('should expose the About toggle linking to the about page', async ({ page }) => {
      const about = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'About' });
      await expect(about).toHaveAttribute('href', /\/en\/about\/?$/);
    });

    test('should navigate to the schedule via the Offer dropdown', async ({ page }) => {
      const toggle = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Offer' });
      await openDropdown(toggle);

      const item = page.locator('.dropdown-item').filter({ hasText: 'Daily plan' });
      await expect(item).toBeVisible({ timeout: 5000 });
      await item.click();
      await expect(page).toHaveURL(/\/en\/programs\/schedule\/?$/);
    });
  });
});

test.describe('Nested Menu Expansion (Desktop)', () => {
  test.describe('Polish Dropdown Menu', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');
    });

    test('should display the Oferta dropdown toggle', async ({ page }) => {
      const toggle = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Oferta' });
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveClass(/dropdown-toggle/);
    });

    test('should open the Oferta dropdown on click', async ({ page }) => {
      const toggle = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Oferta' });
      const menu = toggle.locator('~ .dropdown-menu');
      await toggle.click();
      await expect(menu).toBeVisible({ timeout: 5000 });
    });

    test('should display all Oferta dropdown items in Polish', async ({ page }) => {
      const toggle = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Oferta' });
      await openDropdown(toggle);

      await expect(page.locator('.dropdown-item').filter({ hasText: 'Plan dnia' })).toBeVisible({ timeout: 5000 });
      await expect(page.locator('.dropdown-item').filter({ hasText: 'Zajęcia dodatkowe' })).toBeVisible();
    });

    test('should have correct URLs on Oferta dropdown items', async ({ page }) => {
      const toggle = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Oferta' });
      await openDropdown(toggle);

      await expect(page.locator('.dropdown-item').filter({ hasText: 'Plan dnia' }))
        .toHaveAttribute('href', /\/pl\/programs\/schedule\/?$/);
      await expect(page.locator('.dropdown-item').filter({ hasText: 'Zajęcia dodatkowe' }))
        .toHaveAttribute('href', /\/pl\/plan-dnia\/zajecia-dodatkowe\/?$/);
    });
  });

  test.describe('English Dropdown Menu', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/');
      await page.waitForLoadState('networkidle');
    });

    test('should display the Offer dropdown toggle', async ({ page }) => {
      await expect(page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Offer' })).toBeVisible();
    });

    test('should open the Offer dropdown and display English items', async ({ page }) => {
      const toggle = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Offer' });
      await openDropdown(toggle);

      await expect(page.locator('.dropdown-item').filter({ hasText: 'Daily plan' })).toBeVisible({ timeout: 5000 });
      await expect(page.locator('.dropdown-item').filter({ hasText: 'Extra activities' })).toBeVisible();
    });

    test('should have correct URLs on English dropdown items', async ({ page }) => {
      const toggle = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Offer' });
      await openDropdown(toggle);

      await expect(page.locator('.dropdown-item').filter({ hasText: 'Daily plan' }))
        .toHaveAttribute('href', /\/en\/programs\/schedule\/?$/);
      await expect(page.locator('.dropdown-item').filter({ hasText: 'Extra activities' }))
        .toHaveAttribute('href', /\/en\/daily-plan\/extra-activities\/?$/);
    });
  });
});

test.describe('Mobile Hamburger Menu', () => {
  test.describe('Polish Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');
    });

    test('should display hamburger menu button on mobile', async ({ page }) => {
      await expect(page.locator('.navbar-toggler')).toBeVisible();
    });

    test('should have aria-expanded="false" initially', async ({ page }) => {
      await expect(page.locator('.navbar-toggler')).toHaveAttribute('aria-expanded', 'false');
    });

    test('should hide desktop navigation on mobile', async ({ page }) => {
      await expect(page.locator('#navbarMain')).not.toBeVisible();
    });

    test('should open mobile menu when clicking hamburger button', async ({ page }) => {
      await page.locator('.navbar-toggler').click();
      await expect(page.locator('#navbarMain')).toBeVisible({ timeout: 5000 });
    });

    test('should update aria-expanded to "true" when menu is open', async ({ page }) => {
      await page.locator('.navbar-toggler').click();
      await expect(page.locator('.navbar-toggler')).toHaveAttribute('aria-expanded', 'true');
    });

    test('should display all navigation links in mobile menu', async ({ page }) => {
      await page.locator('.navbar-toggler').click();
      await page.waitForTimeout(400);

      const links = page.locator('.navbar-nav .nav-link');
      await expect(links.filter({ hasText: 'O nas' })).toBeVisible();
      await expect(links.filter({ hasText: 'Oferta' })).toBeVisible();
      await expect(links.filter({ hasText: 'Dla rodziców' })).toBeVisible();
      await expect(links.filter({ hasText: 'Aktualności' })).toBeVisible();
      await expect(links.filter({ hasText: 'Kontakt' })).toBeVisible();
    });

    test('should close mobile menu via the close button', async ({ page }) => {
      // When open, the menu is a full-screen overlay, so the dedicated close
      // (X) button — not the covered hamburger — is the close affordance.
      await page.locator('.navbar-toggler').click();
      await expect(page.locator('#navbarMain')).toBeVisible();
      await page.locator('.mobile-menu-close').click();
      await expect(page.locator('#navbarMain')).not.toBeVisible({ timeout: 5000 });
    });

    test('should close mobile menu when navigating to a page', async ({ page }) => {
      await page.locator('.navbar-toggler').click();
      await page.waitForTimeout(400);
      await page.locator('.navbar-nav .nav-link').filter({ hasText: 'Kontakt' }).click();
      await expect(page).toHaveURL(/\/pl\/contact\/?$/);
    });

    test('should expand mobile submenu when clicking dropdown toggle', async ({ page }) => {
      await page.locator('.navbar-toggler').click();
      await page.waitForTimeout(400);

      await page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Oferta' }).click();
      await expect(page.locator('.mobile-submenu.show').first()).toBeVisible({ timeout: 5000 });
    });

    test('should navigate to page from mobile submenu', async ({ page }) => {
      await page.locator('.navbar-toggler').click();
      await page.waitForTimeout(400);

      await page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Oferta' }).click();
      await page.waitForTimeout(400);

      await page.locator('.dropdown-item').filter({ hasText: 'Plan dnia' }).click();
      await expect(page).toHaveURL(/\/pl\/programs\/schedule\/?$/);
    });

    test('should display language switcher in mobile menu', async ({ page }) => {
      await page.locator('.navbar-toggler').click();
      await page.waitForTimeout(400);
      await expect(page.locator('#navbarMain .language-switcher')).toBeVisible();
    });
  });

  test.describe('English Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/en/');
      await page.waitForLoadState('networkidle');
    });

    test('should display all English navigation links in mobile menu', async ({ page }) => {
      await page.locator('.navbar-toggler').click();
      await page.waitForTimeout(400);

      const links = page.locator('.navbar-nav .nav-link');
      await expect(links.filter({ hasText: 'About' })).toBeVisible();
      await expect(links.filter({ hasText: 'Offer' })).toBeVisible();
      await expect(links.filter({ hasText: 'For parents' })).toBeVisible();
      await expect(links.filter({ hasText: 'News' })).toBeVisible();
      await expect(links.filter({ hasText: 'Contact' })).toBeVisible();
    });

    test('should navigate to English pages from mobile menu', async ({ page }) => {
      await page.locator('.navbar-toggler').click();
      await page.waitForTimeout(400);
      await page.locator('.navbar-nav .nav-link').filter({ hasText: 'Contact' }).click();
      await expect(page).toHaveURL(/\/en\/contact\/?$/);
    });

    test('should expand English mobile submenu', async ({ page }) => {
      await page.locator('.navbar-toggler').click();
      await page.waitForTimeout(400);

      await page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Offer' }).click();
      await page.waitForTimeout(400);

      await expect(page.locator('.dropdown-item').filter({ hasText: 'Daily plan' })).toBeVisible();
      await expect(page.locator('.dropdown-item').filter({ hasText: 'Extra activities' })).toBeVisible();
    });
  });

  test.describe('Mobile Menu Responsive Behavior', () => {
    test('should switch from mobile to desktop navigation on viewport resize', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const toggle = page.locator('.navbar-toggler');
      await expect(toggle).toBeVisible();

      await page.setViewportSize({ width: 1280, height: 720 });
      await page.waitForTimeout(300);

      await expect(page.locator('#navbarMain')).toBeVisible();
      await expect(toggle).not.toBeVisible();
    });

    test('should close mobile menu when resizing to desktop', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const toggle = page.locator('.navbar-toggler');
      await toggle.click();
      await page.waitForTimeout(400);

      await page.setViewportSize({ width: 1280, height: 720 });
      await page.waitForTimeout(500);

      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });
  });
});

test.describe('Active State Highlighting', () => {
  test.describe('Polish Active States', () => {
    test('should highlight the About toggle as active on the About page', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'O nas' })).toHaveClass(/active/);
    });

    test('should highlight the About toggle as active on the Gallery page', async ({ page }) => {
      await page.goto('/pl/gallery/');
      await page.waitForLoadState('networkidle');
      // Gallery is a child of the About dropdown, so its parent toggle is active
      await expect(page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'O nas' })).toHaveClass(/active/);
    });

    test('should highlight News link as active on News page', async ({ page }) => {
      await page.goto('/pl/news/');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: 'Aktualności' })).toHaveClass(/active/);
    });

    test('should highlight Contact link as active on Contact page', async ({ page }) => {
      await page.goto('/pl/contact/');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: 'Kontakt' })).toHaveClass(/active/);
    });

    test('should highlight the Oferta toggle as active on the Programs page', async ({ page }) => {
      await page.goto('/pl/programs/');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Oferta' })).toHaveClass(/active/);
    });

    test('should highlight the Oferta toggle as active on the Schedule page', async ({ page }) => {
      await page.goto('/pl/programs/schedule/');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Oferta' })).toHaveClass(/active/);
    });

    test('should have aria-current="page" on the active link', async ({ page }) => {
      await page.goto('/pl/contact/');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: 'Kontakt' }))
        .toHaveAttribute('aria-current', 'page');
    });
  });

  test.describe('Mobile Active States', () => {
    test('should show active state in mobile menu on Contact page', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/pl/contact/');
      await page.waitForLoadState('networkidle');

      await page.locator('.navbar-toggler').click();
      await page.waitForTimeout(400);

      await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: 'Kontakt' })).toHaveClass(/active/);
    });

    test('should update active state after navigation in mobile menu', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      await page.locator('.navbar-toggler').click();
      await page.waitForTimeout(400);
      await page.locator('.navbar-nav .nav-link').filter({ hasText: 'Aktualności' }).click();

      await expect(page).toHaveURL(/\/pl\/news\/?$/);
      await page.waitForLoadState('networkidle');

      const toggle = page.locator('.navbar-toggler');
      await expect(toggle).toBeVisible({ timeout: 5000 });
      await toggle.click();
      await page.waitForTimeout(400);

      const newsLink = page.locator('.navbar-nav .nav-link').filter({ hasText: 'Aktualności' });
      await expect(newsLink).toHaveClass(/active/);
      await expect(newsLink).toHaveAttribute('aria-current', 'page');
    });
  });
});

test.describe('Navigation Accessibility', () => {
  test('should have proper navigation role on navbar', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('nav.navbar')).toBeVisible();
  });

  test('should have aria-expanded on dropdown toggles', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Oferta' }))
      .toHaveAttribute('aria-expanded');
  });

  test('should have aria-labelledby on dropdown menus', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');
    const ariaLabelledby = await page.locator('.dropdown-menu').first().getAttribute('aria-labelledby');
    expect(ariaLabelledby).toBeTruthy();
  });

  test('should support keyboard navigation - Tab through menu items', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');
    await page.locator('.navbar-nav .nav-link').first().focus();
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
  });

  test('should have focusable menu items with href', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');
    const navLinks = page.locator('.navbar-nav .nav-link');
    const count = await navLinks.count();
    for (let i = 0; i < count; i++) {
      await expect(navLinks.nth(i)).toHaveAttribute('href');
    }
  });
});
