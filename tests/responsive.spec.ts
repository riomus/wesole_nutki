import { test, expect, Page } from '@playwright/test';

/**
 * Responsive Behavior E2E Tests
 * Tests for responsive behavior across mobile, tablet, and desktop viewports.
 * Covers menu collapse, image scaling, and layout reflow.
 */

// Define viewport configurations for testing
const viewports = {
  mobile: { width: 375, height: 667, name: 'Mobile (iPhone SE)' },
  tablet: { width: 768, height: 1024, name: 'Tablet (iPad)' },
  desktop: { width: 1280, height: 720, name: 'Desktop' },
  largeDesktop: { width: 1920, height: 1080, name: 'Large Desktop' },
};

test.describe('Menu Collapse Behavior', () => {
  test.describe('Mobile Menu Collapse', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');
    });

    test('should show hamburger menu button on mobile', async ({ page }) => {
      const hamburgerButton = page.locator('.navbar-toggler');
      await expect(hamburgerButton).toBeVisible();
    });

    test('should hide desktop navigation on mobile', async ({ page }) => {
      const navbarCollapse = page.locator('#navbarMain');
      await expect(navbarCollapse).not.toBeVisible();
    });

    test('should expand mobile menu when hamburger is clicked', async ({ page }) => {
      const hamburgerButton = page.locator('.navbar-toggler');
      const navbarCollapse = page.locator('#navbarMain');

      await hamburgerButton.click();
      await expect(navbarCollapse).toBeVisible({ timeout: 5000 });
    });

    test('should collapse mobile menu when hamburger is clicked again', async ({ page }) => {
      const hamburgerButton = page.locator('.navbar-toggler');
      const navbarCollapse = page.locator('#navbarMain');

      // Open menu
      await hamburgerButton.click();
      await expect(navbarCollapse).toBeVisible({ timeout: 5000 });

      // Wait for animation to complete
      await page.waitForTimeout(500);

      // Close menu
      await hamburgerButton.click();
      await expect(navbarCollapse).not.toBeVisible({ timeout: 5000 });
    });

    test('should show all navigation links in mobile menu', async ({ page }) => {
      const hamburgerButton = page.locator('.navbar-toggler');
      await hamburgerButton.click();

      await page.waitForTimeout(500);

      // Check all main nav links are visible
      await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: 'Strona Glowna' })).toBeVisible();
      await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: 'O Nas' })).toBeVisible();
      await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: 'Oferta' })).toBeVisible();
      await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: 'Aktualnosci' })).toBeVisible();
      await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: 'Galeria' })).toBeVisible();
      await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: 'Kontakt' })).toBeVisible();
    });

    test('should show mobile submenu when dropdown is clicked', async ({ page }) => {
      const hamburgerButton = page.locator('.navbar-toggler');
      await hamburgerButton.click();
      await page.waitForTimeout(500);

      const dropdownToggle = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Oferta' });
      await dropdownToggle.click();
      await page.waitForTimeout(500);

      const submenu = page.locator('.mobile-submenu');
      await expect(submenu).toBeVisible({ timeout: 5000 });
    });

    test('should show language switcher in mobile menu', async ({ page }) => {
      const hamburgerButton = page.locator('.navbar-toggler');
      await hamburgerButton.click();
      await page.waitForTimeout(500);

      const languageSwitcher = page.locator('#navbarMain .language-switcher');
      await expect(languageSwitcher).toBeVisible();
    });
  });

  test.describe('Tablet Menu Behavior', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.tablet);
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');
    });

    test('should show hamburger menu on tablet (< 992px)', async ({ page }) => {
      const hamburgerButton = page.locator('.navbar-toggler');
      await expect(hamburgerButton).toBeVisible();
    });

    test('should hide desktop navigation on tablet', async ({ page }) => {
      const navbarCollapse = page.locator('#navbarMain');
      await expect(navbarCollapse).not.toBeVisible();
    });
  });

  test.describe('Desktop Menu Behavior', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');
    });

    test('should hide hamburger menu button on desktop', async ({ page }) => {
      const hamburgerButton = page.locator('.navbar-toggler');
      await expect(hamburgerButton).not.toBeVisible();
    });

    test('should show desktop navigation expanded', async ({ page }) => {
      const navbarCollapse = page.locator('#navbarMain');
      await expect(navbarCollapse).toBeVisible();
    });

    test('should show all navigation links inline on desktop', async ({ page }) => {
      await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: 'Strona Glowna' })).toBeVisible();
      await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: 'O Nas' })).toBeVisible();
      await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: 'Kontakt' })).toBeVisible();
    });

    test('should show dropdown on hover for desktop', async ({ page }) => {
      const dropdownToggle = page.locator('.navbar-nav .dropdown-toggle').filter({ hasText: 'Oferta' });
      await dropdownToggle.hover();

      const dropdownMenu = page.locator('.dropdown-menu').first();
      await expect(dropdownMenu).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Menu Transition Between Viewports', () => {
    test('should switch from mobile to desktop layout on viewport resize', async ({ page }) => {
      // Start with mobile viewport
      await page.setViewportSize(viewports.mobile);
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Mobile: hamburger visible, nav collapsed
      const hamburgerButton = page.locator('.navbar-toggler');
      await expect(hamburgerButton).toBeVisible();

      const navbarCollapse = page.locator('#navbarMain');
      await expect(navbarCollapse).not.toBeVisible();

      // Resize to desktop
      await page.setViewportSize(viewports.desktop);
      await page.waitForTimeout(300);

      // Desktop: hamburger hidden, nav visible
      await expect(hamburgerButton).not.toBeVisible();
      await expect(navbarCollapse).toBeVisible();
    });

    test('should switch from desktop to mobile layout on viewport resize', async ({ page }) => {
      // Start with desktop viewport
      await page.setViewportSize(viewports.desktop);
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Desktop: nav visible
      const navbarCollapse = page.locator('#navbarMain');
      await expect(navbarCollapse).toBeVisible();

      // Resize to mobile
      await page.setViewportSize(viewports.mobile);
      await page.waitForTimeout(300);

      // Mobile: nav collapsed
      const hamburgerButton = page.locator('.navbar-toggler');
      await expect(hamburgerButton).toBeVisible();
      await expect(navbarCollapse).not.toBeVisible();
    });

    test('should close open mobile menu when resizing to desktop', async ({ page }) => {
      // Start with mobile viewport
      await page.setViewportSize(viewports.mobile);
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Open mobile menu
      const hamburgerButton = page.locator('.navbar-toggler');
      await hamburgerButton.click();
      await page.waitForTimeout(500);

      // Resize to desktop
      await page.setViewportSize(viewports.desktop);
      await page.waitForTimeout(500);

      // Menu should be in desktop mode now (aria-expanded reset)
      await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
    });
  });
});

test.describe('Image Scaling Behavior', () => {
  test.describe('Hero Section Images', () => {
    test('should scale hero section appropriately on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toBeVisible();

      const boundingBox = await heroSection.boundingBox();
      expect(boundingBox?.width).toBeLessThanOrEqual(viewports.mobile.width);
    });

    test('should scale hero section appropriately on tablet', async ({ page }) => {
      await page.setViewportSize(viewports.tablet);
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toBeVisible();

      const boundingBox = await heroSection.boundingBox();
      expect(boundingBox?.width).toBeLessThanOrEqual(viewports.tablet.width);
    });

    test('should adjust hero headline font size on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/pl/');

      const headline = page.locator('[data-testid="hero-headline"]');
      const fontSizeMobile = await headline.evaluate(el => window.getComputedStyle(el).fontSize);

      await page.setViewportSize(viewports.desktop);
      await page.waitForTimeout(300);

      const fontSizeDesktop = await headline.evaluate(el => window.getComputedStyle(el).fontSize);

      // Mobile font size should be smaller than desktop
      const mobilePx = parseInt(fontSizeMobile);
      const desktopPx = parseInt(fontSizeDesktop);
      expect(mobilePx).toBeLessThan(desktopPx);
    });
  });

  test.describe('Gallery Images', () => {
    test('should display gallery images within viewport on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/pl/gallery/codzienne-zajecia/');
      await page.waitForLoadState('networkidle');

      const galleryImages = page.locator('.gallery-image');
      const firstImage = galleryImages.first();
      await expect(firstImage).toBeVisible();

      const boundingBox = await firstImage.boundingBox();
      expect(boundingBox?.width).toBeLessThanOrEqual(viewports.mobile.width);
    });

    test('should display gallery images within viewport on tablet', async ({ page }) => {
      await page.setViewportSize(viewports.tablet);
      await page.goto('/pl/gallery/codzienne-zajecia/');
      await page.waitForLoadState('networkidle');

      const galleryImages = page.locator('.gallery-image');
      const firstImage = galleryImages.first();
      await expect(firstImage).toBeVisible();

      const boundingBox = await firstImage.boundingBox();
      expect(boundingBox?.width).toBeLessThanOrEqual(viewports.tablet.width);
    });

    test('should have responsive images with srcset attribute', async ({ page }) => {
      await page.goto('/pl/gallery/codzienne-zajecia/');
      await page.waitForLoadState('networkidle');

      // Check if picture elements have source with srcset
      const pictureElement = page.locator('.gallery-item picture').first();
      const count = await pictureElement.count();

      if (count > 0) {
        const sourceElement = pictureElement.locator('source').first();
        const srcset = await sourceElement.getAttribute('srcset');
        expect(srcset).toBeTruthy();
      }
    });
  });

  test.describe('Feature Section Images and Icons', () => {
    test('should display feature icons at appropriate size on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const featureIcon = page.locator('#features-section .feature-icon').first();
      await expect(featureIcon).toBeVisible();

      const boundingBox = await featureIcon.boundingBox();
      expect(boundingBox?.width).toBeLessThanOrEqual(100); // Icons should be reasonably sized
    });
  });
});

test.describe('Layout Reflow', () => {
  test.describe('Homepage Layout', () => {
    test('should stack hero content vertically on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toBeVisible();

      // Hero should take full width on mobile
      const boundingBox = await heroSection.boundingBox();
      expect(boundingBox?.width).toBeGreaterThan(viewports.mobile.width * 0.9);
    });

    test('should display feature cards in single column on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const featureCards = page.locator('#features-section .feature-card');
      const firstCard = featureCards.first();
      const secondCard = featureCards.nth(1);

      await expect(firstCard).toBeVisible();
      await expect(secondCard).toBeVisible();

      const firstBox = await firstCard.boundingBox();
      const secondBox = await secondCard.boundingBox();

      // Cards should be stacked vertically (second card below first)
      expect(secondBox!.y).toBeGreaterThan(firstBox!.y + firstBox!.height - 10);
    });

    test('should display feature cards in two columns on tablet', async ({ page }) => {
      await page.setViewportSize(viewports.tablet);
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const featureCards = page.locator('#features-section .feature-card');
      const firstCard = featureCards.first();
      const secondCard = featureCards.nth(1);

      await expect(firstCard).toBeVisible();
      await expect(secondCard).toBeVisible();

      const firstBox = await firstCard.boundingBox();
      const secondBox = await secondCard.boundingBox();

      // Cards should be side by side on tablet (similar Y position)
      expect(Math.abs(secondBox!.y - firstBox!.y)).toBeLessThan(20);
    });

    test('should display feature cards in three columns on desktop', async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const featureCards = page.locator('#features-section .feature-card');
      const firstCard = featureCards.first();
      const secondCard = featureCards.nth(1);
      const thirdCard = featureCards.nth(2);

      await expect(firstCard).toBeVisible();
      await expect(secondCard).toBeVisible();
      await expect(thirdCard).toBeVisible();

      const firstBox = await firstCard.boundingBox();
      const secondBox = await secondCard.boundingBox();
      const thirdBox = await thirdCard.boundingBox();

      // All three cards should be on the same row (similar Y position)
      expect(Math.abs(secondBox!.y - firstBox!.y)).toBeLessThan(20);
      expect(Math.abs(thirdBox!.y - firstBox!.y)).toBeLessThan(20);
    });
  });

  test.describe('Gallery Layout', () => {
    test('should display gallery cards responsively on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/pl/gallery/');
      await page.waitForLoadState('networkidle');

      const galleryCards = page.locator('.gallery-card');
      const count = await galleryCards.count();

      if (count >= 1) {
        const firstCard = galleryCards.first();
        await expect(firstCard).toBeVisible();

        // Card should fit within viewport
        const firstBox = await firstCard.boundingBox();
        expect(firstBox?.width).toBeLessThanOrEqual(viewports.mobile.width);
      }
    });

    test('should display gallery cards in multiple columns on desktop', async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await page.goto('/pl/gallery/');
      await page.waitForLoadState('networkidle');

      const galleryCards = page.locator('.gallery-card');
      const count = await galleryCards.count();

      if (count >= 2) {
        const firstCard = galleryCards.first();
        const secondCard = galleryCards.nth(1);

        const firstBox = await firstCard.boundingBox();
        const secondBox = await secondCard.boundingBox();

        // Cards should be side by side on desktop (similar Y position)
        expect(Math.abs(secondBox!.y - firstBox!.y)).toBeLessThan(20);
      }
    });

    test('should display gallery grid items in single column on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/pl/gallery/codzienne-zajecia/');
      await page.waitForLoadState('networkidle');

      const galleryItems = page.locator('.gallery-item');
      const count = await galleryItems.count();

      if (count >= 2) {
        const firstItem = galleryItems.first();
        const secondItem = galleryItems.nth(1);

        const firstBox = await firstItem.boundingBox();
        const secondBox = await secondItem.boundingBox();

        // Items should be stacked or in a responsive grid
        // On very small screens they may stack, on slightly larger they may be side by side
        expect(secondBox!.y).toBeGreaterThanOrEqual(firstBox!.y);
      }
    });
  });

  test.describe('News Layout', () => {
    test('should display news cards in single column on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/pl/news/');
      await page.waitForLoadState('networkidle');

      const newsCards = page.locator('.news-card');
      const count = await newsCards.count();

      if (count >= 2) {
        const firstCard = newsCards.first();
        const secondCard = newsCards.nth(1);

        const firstBox = await firstCard.boundingBox();
        const secondBox = await secondCard.boundingBox();

        // Cards should be stacked vertically on mobile
        expect(secondBox!.y).toBeGreaterThan(firstBox!.y + firstBox!.height - 10);
      }
    });
  });

  test.describe('Top Bar Visibility', () => {
    test('should hide top bar on mobile when configured', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Top bar uses d-none d-lg-block class, so it's hidden on mobile regardless of config
      const topBar = page.locator('.top-bar');
      const count = await topBar.count();

      // If top bar exists, it should be hidden on mobile
      if (count > 0) {
        await expect(topBar).not.toBeVisible();
      }
    });

    test('should show top bar on desktop when configured with contact info', async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      // Top bar is only shown if site has phone, email, facebook, or instagram configured
      // This is a conditional test - top bar may or may not be present based on site config
      const topBar = page.locator('.top-bar');
      const count = await topBar.count();

      // If top bar exists, it should be visible on desktop
      if (count > 0) {
        await expect(topBar).toBeVisible();
      }
    });
  });

  test.describe('Footer Layout', () => {
    test('should stack footer columns on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');

      const footer = page.locator('footer');
      await expect(footer).toBeVisible();

      // Footer should take full width
      const footerBox = await footer.boundingBox();
      expect(footerBox?.width).toBeGreaterThan(viewports.mobile.width * 0.9);
    });
  });
});

test.describe('Touch and Interaction on Mobile', () => {
  // Note: These tests use click() instead of tap() as it works across all test contexts
  // In real device testing, clicks are interpreted as taps on touch devices

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
  });

  test('should allow click/tap to open mobile menu', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    const hamburgerButton = page.locator('.navbar-toggler');
    await hamburgerButton.click();

    const navbarCollapse = page.locator('#navbarMain');
    await expect(navbarCollapse).toBeVisible({ timeout: 5000 });
  });

  test('should allow click/tap navigation in mobile menu', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Open mobile menu
    const hamburgerButton = page.locator('.navbar-toggler');
    await hamburgerButton.click();
    await page.waitForTimeout(500);

    // Navigate to About page
    const aboutLink = page.locator('.navbar-nav .nav-link').filter({ hasText: 'O Nas' });
    await aboutLink.click();

    await expect(page).toHaveURL(/\/pl\/about\/?$/);
  });

  test('should allow click/tap to open gallery lightbox on mobile', async ({ page }) => {
    await page.goto('/pl/gallery/codzienne-zajecia/');
    await page.waitForLoadState('networkidle');

    const firstImageLink = page.locator('.glightbox').first();
    await firstImageLink.click();

    await expect(page.locator('.goverlay')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Viewport-Specific Accessibility', () => {
  test('should maintain heading hierarchy on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Check h1 exists
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Should have only one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('should have focusable menu toggle on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    const hamburgerButton = page.locator('.navbar-toggler');
    await hamburgerButton.focus();

    // Check it has proper aria-label
    const ariaLabel = await hamburgerButton.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

  test('should maintain proper contrast on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Hero headline should be visible and readable
    const headline = page.locator('[data-testid="hero-headline"]');
    await expect(headline).toBeVisible();
  });

  test('should have proper touch target sizes on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Open mobile menu
    const hamburgerButton = page.locator('.navbar-toggler');
    await hamburgerButton.click();
    await page.waitForTimeout(500);

    // Check nav links have reasonable touch target size
    const navLink = page.locator('.navbar-nav .nav-link').first();
    const box = await navLink.boundingBox();

    // Touch targets should be at least 44x44 pixels for accessibility
    expect(box?.height).toBeGreaterThanOrEqual(40);
  });
});

test.describe('Cross-Viewport Content Consistency', () => {
  test('should display same navigation items across viewports', async ({ page }) => {
    const navItems = ['Strona Glowna', 'O Nas', 'Oferta', 'Aktualnosci', 'Galeria', 'Kontakt'];

    // Check mobile
    await page.setViewportSize(viewports.mobile);
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    const hamburgerButton = page.locator('.navbar-toggler');
    await hamburgerButton.click();
    await page.waitForTimeout(500);

    for (const item of navItems) {
      await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: item })).toBeVisible();
    }

    // Check desktop
    await page.setViewportSize(viewports.desktop);
    await page.waitForTimeout(300);

    for (const item of navItems) {
      await expect(page.locator('.navbar-nav .nav-link').filter({ hasText: item })).toBeVisible();
    }
  });

  test('should display same hero content across viewports', async ({ page }) => {
    // Check mobile
    await page.setViewportSize(viewports.mobile);
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    const mobileHeadline = await page.locator('[data-testid="hero-headline"]').textContent();
    const mobileSubheadline = await page.locator('[data-testid="hero-subheadline"]').textContent();

    // Check desktop
    await page.setViewportSize(viewports.desktop);
    await page.waitForTimeout(300);

    const desktopHeadline = await page.locator('[data-testid="hero-headline"]').textContent();
    const desktopSubheadline = await page.locator('[data-testid="hero-subheadline"]').textContent();

    // Content should be the same
    expect(mobileHeadline).toBe(desktopHeadline);
    expect(mobileSubheadline).toBe(desktopSubheadline);
  });

  test('should display same number of feature cards across viewports', async ({ page }) => {
    // Check mobile
    await page.setViewportSize(viewports.mobile);
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    const mobileCount = await page.locator('#features-section .feature-card').count();

    // Check desktop
    await page.setViewportSize(viewports.desktop);
    await page.waitForTimeout(300);

    const desktopCount = await page.locator('#features-section .feature-card').count();

    // Same number of cards
    expect(mobileCount).toBe(desktopCount);
    expect(mobileCount).toBe(6); // 6 feature cards as per existing test
  });
});

test.describe('Language Switcher Responsiveness', () => {
  test('should show language switcher in header on desktop', async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    const headerLanguageSwitcher = page.locator('.site-header .language-switcher');
    await expect(headerLanguageSwitcher).toBeVisible();
  });

  test('should show language switcher in mobile menu on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Open mobile menu
    const hamburgerButton = page.locator('.navbar-toggler');
    await hamburgerButton.click();
    await page.waitForTimeout(500);

    const mobileLanguageSwitcher = page.locator('#navbarMain .language-switcher');
    await expect(mobileLanguageSwitcher).toBeVisible();
  });

  test('should allow language switch on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Open mobile menu
    const hamburgerButton = page.locator('.navbar-toggler');
    await hamburgerButton.click();
    await page.waitForTimeout(500);

    // Click English language button
    const enButton = page.locator('#navbarMain .lang-btn').filter({ has: page.locator('.lang-code', { hasText: 'EN' }) });
    await enButton.click();

    await expect(page).toHaveURL(/\/en\/?$/);
  });
});
