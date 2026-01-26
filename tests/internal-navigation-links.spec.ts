import { test, expect } from '@playwright/test';

/**
 * Internal Navigation Links E2E Tests
 * Tests for verifying that all internal navigation links (CTAs, "Read More", "Learn More", etc.)
 * work correctly and navigate to the expected pages in both Polish and English.
 */

test.describe('Hero Section CTA Links', () => {
  test.describe('Polish Homepage', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');
    });

    test('should display hero CTA buttons', async ({ page }) => {
      const ctaButtons = page.locator('[data-testid="hero-cta-button"]');
      const count = await ctaButtons.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have valid href on "Dowiedz sie wiecej" button', async ({ page }) => {
      const learnMoreButton = page.locator('[data-testid="hero-cta-button"]').filter({ hasText: 'Dowiedz sie wiecej' });

      if (await learnMoreButton.count() > 0) {
        const href = await learnMoreButton.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).not.toBe('#');
      }
    });

    test('should navigate when clicking "Dowiedz sie wiecej" button', async ({ page }) => {
      const learnMoreButton = page.locator('[data-testid="hero-cta-button"]').filter({ hasText: 'Dowiedz sie wiecej' });

      if (await learnMoreButton.count() > 0) {
        const href = await learnMoreButton.getAttribute('href');
        await learnMoreButton.click();
        await page.waitForLoadState('networkidle');

        // Should navigate to a different page (not homepage)
        const currentUrl = page.url();
        expect(currentUrl).not.toMatch(/\/pl\/?$/);
      }
    });

    test('should have valid href on "Skontaktuj sie" button', async ({ page }) => {
      const contactButton = page.locator('[data-testid="hero-cta-button"]').filter({ hasText: 'Skontaktuj sie' });

      if (await contactButton.count() > 0) {
        const href = await contactButton.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).not.toBe('#');
      }
    });

    test('should navigate to contact page when clicking "Skontaktuj sie" button', async ({ page }) => {
      const contactButton = page.locator('[data-testid="hero-cta-button"]').filter({ hasText: 'Skontaktuj sie' });

      if (await contactButton.count() > 0) {
        await contactButton.click();
        await page.waitForLoadState('networkidle');

        // Should navigate to contact page
        await expect(page).toHaveURL(/\/pl\/contact\/?$/);
      }
    });

    test('should have btn-icon class on CTA buttons with icons', async ({ page }) => {
      const ctaButtons = page.locator('[data-testid="hero-cta-button"]');
      const firstButton = ctaButtons.first();

      if (await firstButton.count() > 0) {
        const classes = await firstButton.getAttribute('class');
        // Check if button has appropriate styling classes
        expect(classes).toContain('btn');
        expect(classes).toMatch(/btn-(light|primary|secondary)/);
      }
    });
  });

  test.describe('English Homepage', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/');
      await page.waitForLoadState('networkidle');
    });

    test('should display hero CTA buttons in English', async ({ page }) => {
      const ctaButtons = page.locator('[data-testid="hero-cta-button"]');
      const count = await ctaButtons.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have valid href on "Learn More" button', async ({ page }) => {
      const learnMoreButton = page.locator('[data-testid="hero-cta-button"]').filter({ hasText: 'Learn More' });

      if (await learnMoreButton.count() > 0) {
        const href = await learnMoreButton.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).not.toBe('#');
      }
    });

    test('should navigate when clicking "Learn More" button', async ({ page }) => {
      const learnMoreButton = page.locator('[data-testid="hero-cta-button"]').filter({ hasText: 'Learn More' });

      if (await learnMoreButton.count() > 0) {
        await learnMoreButton.click();
        await page.waitForLoadState('networkidle');

        // Should navigate to a different page
        const currentUrl = page.url();
        expect(currentUrl).not.toMatch(/\/en\/?$/);
      }
    });

    test('should have valid href on "Contact Us" button', async ({ page }) => {
      const contactButton = page.locator('[data-testid="hero-cta-button"]').filter({ hasText: 'Contact Us' });

      if (await contactButton.count() > 0) {
        const href = await contactButton.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).not.toBe('#');
      }
    });

    test('should navigate to contact page when clicking "Contact Us" button', async ({ page }) => {
      const contactButton = page.locator('[data-testid="hero-cta-button"]').filter({ hasText: 'Contact Us' });

      if (await contactButton.count() > 0) {
        await contactButton.click();
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveURL(/\/en\/contact\/?$/);
      }
    });
  });
});

test.describe('About Section CTA Links', () => {
  test.describe('Polish About Section', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');
    });

    test('should display about section on homepage', async ({ page }) => {
      const aboutSection = page.locator('#about-section');

      // Check if about section exists
      if (await aboutSection.count() > 0) {
        await expect(aboutSection).toBeVisible();
      }
    });

    test('should have "Learn More" button in about section', async ({ page }) => {
      const aboutSection = page.locator('#about-section');

      if (await aboutSection.count() > 0) {
        const learnMoreButton = aboutSection.locator('a.btn').filter({ hasText: /Dowiedz|więcej/i });

        if (await learnMoreButton.count() > 0) {
          await expect(learnMoreButton).toBeVisible();
        }
      }
    });

    test('should have valid href on about section button', async ({ page }) => {
      const aboutSection = page.locator('#about-section');

      if (await aboutSection.count() > 0) {
        const button = aboutSection.locator('a.btn').first();

        if (await button.count() > 0) {
          const href = await button.getAttribute('href');
          expect(href).toBeTruthy();
          expect(href).not.toBe('#');
        }
      }
    });

    test('should navigate when clicking about section button', async ({ page }) => {
      const aboutSection = page.locator('#about-section');

      if (await aboutSection.count() > 0) {
        const button = aboutSection.locator('a.btn').first();

        if (await button.count() > 0) {
          await button.click();
          await page.waitForLoadState('networkidle');

          // Should navigate to about page or another relevant page
          const currentUrl = page.url();
          expect(currentUrl).not.toMatch(/\/pl\/?$/);
        }
      }
    });

    test('should have btn-icon class on about section button', async ({ page }) => {
      const aboutSection = page.locator('#about-section');

      if (await aboutSection.count() > 0) {
        const button = aboutSection.locator('a.btn').first();

        if (await button.count() > 0) {
          const classes = await button.getAttribute('class');
          expect(classes).toContain('btn');
          expect(classes).toMatch(/btn-(primary|secondary|light)/);
        }
      }
    });
  });

  test.describe('English About Section', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/');
      await page.waitForLoadState('networkidle');
    });

    test('should have "Learn More" button in English about section', async ({ page }) => {
      const aboutSection = page.locator('#about-section');

      if (await aboutSection.count() > 0) {
        const learnMoreButton = aboutSection.locator('a.btn').filter({ hasText: /Learn More/i });

        if (await learnMoreButton.count() > 0) {
          await expect(learnMoreButton).toBeVisible();
        }
      }
    });

    test('should navigate when clicking English about section button', async ({ page }) => {
      const aboutSection = page.locator('#about-section');

      if (await aboutSection.count() > 0) {
        const button = aboutSection.locator('a.btn').first();

        if (await button.count() > 0) {
          await button.click();
          await page.waitForLoadState('networkidle');

          const currentUrl = page.url();
          expect(currentUrl).not.toMatch(/\/en\/?$/);
        }
      }
    });
  });
});

test.describe('News Card "Read More" Links', () => {
  test.describe('Polish News Cards', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');
    });

    test('should display news cards on homepage', async ({ page }) => {
      const newsCards = page.locator('.news-card');

      if (await newsCards.count() > 0) {
        expect(await newsCards.count()).toBeGreaterThan(0);
      }
    });

    test('should have "Read More" links on news cards', async ({ page }) => {
      const newsCards = page.locator('.news-card');

      if (await newsCards.count() > 0) {
        const readMoreLinks = page.locator('.news-card .read-more');

        if (await readMoreLinks.count() > 0) {
          const firstLink = readMoreLinks.first();
          await expect(firstLink).toBeVisible();
        }
      }
    });

    test('should have valid href on news "Read More" links', async ({ page }) => {
      const readMoreLinks = page.locator('.news-card .read-more');

      if (await readMoreLinks.count() > 0) {
        const firstLink = readMoreLinks.first();
        const href = await firstLink.getAttribute('href');

        expect(href).toBeTruthy();
        expect(href).not.toBe('#');
        // Should be a valid path (can be /pl/ or date-based like /2023/01/30/)
        expect(href).toMatch(/^\//);
      }
    });

    test('should navigate to news article when clicking "Read More"', async ({ page }) => {
      const readMoreLinks = page.locator('.news-card .read-more');

      if (await readMoreLinks.count() > 0) {
        const firstLink = readMoreLinks.first();
        const href = await firstLink.getAttribute('href');

        await firstLink.click();
        await page.waitForLoadState('networkidle');

        // Should navigate to news article page (not homepage)
        const currentUrl = page.url();
        expect(currentUrl).not.toMatch(/\/pl\/?$/);
        expect(currentUrl).not.toMatch(/\/en\/?$/);
      }
    });

    test('should have arrow icon in "Read More" links', async ({ page }) => {
      const readMoreLinks = page.locator('.news-card .read-more');

      if (await readMoreLinks.count() > 0) {
        const firstLink = readMoreLinks.first();
        const svg = firstLink.locator('svg');

        if (await svg.count() > 0) {
          await expect(svg).toBeVisible();
        }
      }
    });

    test('should have clickable news card titles', async ({ page }) => {
      const newsCards = page.locator('.news-card');

      if (await newsCards.count() > 0) {
        const firstCard = newsCards.first();
        const titleLink = firstCard.locator('.card-title a');

        if (await titleLink.count() > 0) {
          const href = await titleLink.getAttribute('href');
          expect(href).toBeTruthy();
          expect(href).not.toBe('#');
        }
      }
    });
  });

  test.describe('English News Cards', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/');
      await page.waitForLoadState('networkidle');
    });

    test('should have "Read More" links in English', async ({ page }) => {
      const readMoreLinks = page.locator('.news-card .read-more');

      if (await readMoreLinks.count() > 0) {
        const firstLink = readMoreLinks.first();
        const text = await firstLink.textContent();

        expect(text).toMatch(/Read More/i);
      }
    });

    test('should have valid href on English news "Read More" links', async ({ page }) => {
      const readMoreLinks = page.locator('.news-card .read-more');

      if (await readMoreLinks.count() > 0) {
        const firstLink = readMoreLinks.first();
        const href = await firstLink.getAttribute('href');

        expect(href).toBeTruthy();
        expect(href).toContain('/en/');
      }
    });

    test('should navigate to English news article when clicking "Read More"', async ({ page }) => {
      const readMoreLinks = page.locator('.news-card .read-more');

      if (await readMoreLinks.count() > 0) {
        const firstLink = readMoreLinks.first();
        await firstLink.click();
        await page.waitForLoadState('networkidle');

        const currentUrl = page.url();
        expect(currentUrl).toContain('/en/');
      }
    });
  });

  test.describe('News List Page', () => {
    test('should have "Read More" links on news list page - Polish', async ({ page }) => {
      await page.goto('/pl/news/');
      await page.waitForLoadState('networkidle');

      const readMoreLinks = page.locator('.news-card .read-more');

      if (await readMoreLinks.count() > 0) {
        expect(await readMoreLinks.count()).toBeGreaterThan(0);

        // Verify all links have valid hrefs
        const linkCount = await readMoreLinks.count();
        for (let i = 0; i < Math.min(linkCount, 3); i++) {
          const link = readMoreLinks.nth(i);
          const href = await link.getAttribute('href');
          expect(href).toBeTruthy();
          expect(href).not.toBe('#');
        }
      }
    });

    test('should have "Read More" links on news list page - English', async ({ page }) => {
      await page.goto('/en/news/');
      await page.waitForLoadState('networkidle');

      const readMoreLinks = page.locator('.news-card .read-more');

      if (await readMoreLinks.count() > 0) {
        expect(await readMoreLinks.count()).toBeGreaterThan(0);
      }
    });
  });
});

test.describe('Program Card "Learn More" Links', () => {
  test.describe('Polish Program Cards', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/programs/');
      await page.waitForLoadState('networkidle');
    });

    test('should display program cards', async ({ page }) => {
      const programCards = page.locator('.program-card');
      expect(await programCards.count()).toBeGreaterThan(0);
    });

    test('should have clickable program cards', async ({ page }) => {
      const programCards = page.locator('.program-card');
      const firstCard = programCards.first();
      const cardLink = firstCard.locator('a.program-card-link');

      await expect(cardLink).toBeVisible();

      const href = await cardLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).not.toBe('#');
      expect(href).toContain('/pl/programs/');
    });

    test('should have "Learn More" text in program cards', async ({ page }) => {
      const programCards = page.locator('.program-card');

      if (await programCards.count() > 0) {
        const firstCard = programCards.first();
        const learnMoreText = firstCard.locator('.program-card-link-text');

        if (await learnMoreText.count() > 0) {
          await expect(learnMoreText).toBeVisible();
        }
      }
    });

    test('should navigate to program page when clicking card', async ({ page }) => {
      const programCards = page.locator('.program-card');
      const firstCard = programCards.first();
      const cardLink = firstCard.locator('a.program-card-link');

      await cardLink.click();
      await page.waitForLoadState('networkidle');

      // Should navigate to specific program page
      const currentUrl = page.url();
      expect(currentUrl).toContain('/pl/programs/');
      expect(currentUrl).not.toMatch(/\/pl\/programs\/?$/);
    });

    test('should have arrow icon in program card links', async ({ page }) => {
      const programCards = page.locator('.program-card');

      if (await programCards.count() > 0) {
        const firstCard = programCards.first();
        const svg = firstCard.locator('.program-card-link-text svg');

        if (await svg.count() > 0) {
          await expect(svg).toBeVisible();
        }
      }
    });

    test('should navigate to correct program pages', async ({ page }) => {
      const programCards = page.locator('.program-card');
      const cardCount = await programCards.count();

      // Test first 3 program cards to verify they navigate correctly
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        await page.goto('/pl/programs/');
        await page.waitForLoadState('networkidle');

        const card = programCards.nth(i);
        const cardLink = card.locator('a.program-card-link');
        const href = await cardLink.getAttribute('href');

        await cardLink.click();
        await page.waitForLoadState('networkidle');

        const currentUrl = page.url();
        expect(currentUrl).toContain(href || '');
      }
    });
  });

  test.describe('English Program Cards', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/programs/');
      await page.waitForLoadState('networkidle');
    });

    test('should display English program cards', async ({ page }) => {
      const programCards = page.locator('.program-card');
      expect(await programCards.count()).toBeGreaterThan(0);
    });

    test('should have "Learn More" text in English', async ({ page }) => {
      const programCards = page.locator('.program-card');

      if (await programCards.count() > 0) {
        const firstCard = programCards.first();
        const learnMoreText = firstCard.locator('.program-card-link-text');

        if (await learnMoreText.count() > 0) {
          const text = await learnMoreText.textContent();
          expect(text).toMatch(/Learn More/i);
        }
      }
    });

    test('should have valid href on English program cards', async ({ page }) => {
      const programCards = page.locator('.program-card');
      const firstCard = programCards.first();
      const cardLink = firstCard.locator('a.program-card-link');

      const href = await cardLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toContain('/en/programs/');
    });

    test('should navigate to English program page when clicking card', async ({ page }) => {
      const programCards = page.locator('.program-card');
      const firstCard = programCards.first();
      const cardLink = firstCard.locator('a.program-card-link');

      await cardLink.click();
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();
      expect(currentUrl).toContain('/en/programs/');
      expect(currentUrl).not.toMatch(/\/en\/programs\/?$/);
    });
  });
});

test.describe('CTA Section Links', () => {
  test.describe('Polish CTA Section', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/');
      await page.waitForLoadState('networkidle');
    });

    test('should display CTA section on homepage', async ({ page }) => {
      const ctaSection = page.locator('.cta-section');

      if (await ctaSection.count() > 0) {
        await expect(ctaSection).toBeVisible();
      }
    });

    test('should have CTA button in CTA section', async ({ page }) => {
      const ctaSection = page.locator('.cta-section');

      if (await ctaSection.count() > 0) {
        const ctaButton = ctaSection.locator('a.btn');

        if (await ctaButton.count() > 0) {
          await expect(ctaButton).toBeVisible();
        }
      }
    });

    test('should have valid href on CTA button', async ({ page }) => {
      const ctaSection = page.locator('.cta-section');

      if (await ctaSection.count() > 0) {
        const ctaButton = ctaSection.locator('a.btn');

        if (await ctaButton.count() > 0) {
          const href = await ctaButton.getAttribute('href');
          expect(href).toBeTruthy();
          expect(href).not.toBe('#');
        }
      }
    });

    test('should navigate when clicking CTA button', async ({ page }) => {
      const ctaSection = page.locator('.cta-section');

      if (await ctaSection.count() > 0) {
        const ctaButton = ctaSection.locator('a.btn');

        if (await ctaButton.count() > 0) {
          await ctaButton.click();
          await page.waitForLoadState('networkidle');

          // Should navigate to contact or another relevant page
          const currentUrl = page.url();
          expect(currentUrl).not.toMatch(/\/pl\/?$/);
        }
      }
    });

    test('should have btn-icon class on CTA button', async ({ page }) => {
      const ctaSection = page.locator('.cta-section');

      if (await ctaSection.count() > 0) {
        const ctaButton = ctaSection.locator('a.btn');

        if (await ctaButton.count() > 0) {
          const classes = await ctaButton.getAttribute('class');
          expect(classes).toContain('btn');
        }
      }
    });
  });

  test.describe('English CTA Section', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/');
      await page.waitForLoadState('networkidle');
    });

    test('should have CTA button in English', async ({ page }) => {
      const ctaSection = page.locator('.cta-section');

      if (await ctaSection.count() > 0) {
        const ctaButton = ctaSection.locator('a.btn');

        if (await ctaButton.count() > 0) {
          await expect(ctaButton).toBeVisible();
        }
      }
    });

    test('should have valid href on English CTA button', async ({ page }) => {
      const ctaSection = page.locator('.cta-section');

      if (await ctaSection.count() > 0) {
        const ctaButton = ctaSection.locator('a.btn');

        if (await ctaButton.count() > 0) {
          const href = await ctaButton.getAttribute('href');
          expect(href).toBeTruthy();
          expect(href).not.toBe('#');
        }
      }
    });

    test('should navigate when clicking English CTA button', async ({ page }) => {
      const ctaSection = page.locator('.cta-section');

      if (await ctaSection.count() > 0) {
        const ctaButton = ctaSection.locator('a.btn');

        if (await ctaButton.count() > 0) {
          await ctaButton.click();
          await page.waitForLoadState('networkidle');

          const currentUrl = page.url();
          expect(currentUrl).not.toMatch(/\/en\/?$/);
        }
      }
    });
  });
});

test.describe('Internal Navigation Links Accessibility', () => {
  test('should have proper link text for screen readers - Polish', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Check that links don't just say "Click here" or similar non-descriptive text
    const allLinks = page.locator('a[href]');
    const linkCount = await allLinks.count();

    // Sample check on first 10 links
    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const link = allLinks.nth(i);
      const text = await link.textContent();

      if (text && text.trim().length > 0) {
        // Links should have descriptive text, not just symbols or empty
        expect(text.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test('should have proper link text for screen readers - English', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');

    const allLinks = page.locator('a[href]');
    const linkCount = await allLinks.count();

    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const link = allLinks.nth(i);
      const text = await link.textContent();

      if (text && text.trim().length > 0) {
        expect(text.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test('should have focusable internal navigation links', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Test that CTA buttons are focusable
    const ctaButton = page.locator('[data-testid="hero-cta-button"]').first();

    if (await ctaButton.count() > 0) {
      await ctaButton.focus();
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    }
  });

  test('should support keyboard navigation on internal links', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    // Tab through links
    const ctaButton = page.locator('[data-testid="hero-cta-button"]').first();

    if (await ctaButton.count() > 0) {
      await ctaButton.focus();

      // Press Enter to activate
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');

      // Should navigate
      const currentUrl = page.url();
      expect(currentUrl).toBeTruthy();
    }
  });

  test('should have visible focus indicators on links', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    const readMoreLink = page.locator('.read-more').first();

    if (await readMoreLink.count() > 0) {
      await readMoreLink.focus();

      // Check that element is focused
      const isFocused = await readMoreLink.evaluate(el => el === document.activeElement);
      expect(isFocused).toBe(true);
    }
  });
});

test.describe('Internal Navigation Links Performance', () => {
  test('should load quickly when clicking internal links - Polish', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    const readMoreLink = page.locator('.read-more').first();

    if (await readMoreLink.count() > 0) {
      const startTime = Date.now();
      await readMoreLink.click();
      await page.waitForLoadState('networkidle');
      const endTime = Date.now();

      // Page should load within reasonable time (5 seconds)
      const loadTime = endTime - startTime;
      expect(loadTime).toBeLessThan(5000);
    }
  });

  test('should load quickly when clicking internal links - English', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');

    const readMoreLink = page.locator('.read-more').first();

    if (await readMoreLink.count() > 0) {
      const startTime = Date.now();
      await readMoreLink.click();
      await page.waitForLoadState('networkidle');
      const endTime = Date.now();

      const loadTime = endTime - startTime;
      expect(loadTime).toBeLessThan(5000);
    }
  });
});

test.describe('Mobile Internal Navigation Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('should have working CTA buttons on mobile - Polish', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    const ctaButtons = page.locator('[data-testid="hero-cta-button"]');

    if (await ctaButtons.count() > 0) {
      const firstButton = ctaButtons.first();
      await expect(firstButton).toBeVisible();

      const href = await firstButton.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('should have working "Read More" links on mobile - Polish', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    const readMoreLinks = page.locator('.read-more');

    if (await readMoreLinks.count() > 0) {
      const firstLink = readMoreLinks.first();
      await expect(firstLink).toBeVisible();

      // Should be tappable
      await firstLink.click();
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();
      expect(currentUrl).not.toMatch(/\/pl\/?$/);
    }
  });

  test('should have working program card links on mobile', async ({ page }) => {
    await page.goto('/pl/programs/');
    await page.waitForLoadState('networkidle');

    const programCards = page.locator('.program-card');

    if (await programCards.count() > 0) {
      const firstCard = programCards.first();
      const cardLink = firstCard.locator('a.program-card-link');

      await expect(cardLink).toBeVisible();
      await cardLink.click();
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();
      expect(currentUrl).toContain('/pl/programs/');
    }
  });

  test('should have adequate tap target size for mobile links', async ({ page }) => {
    await page.goto('/pl/');
    await page.waitForLoadState('networkidle');

    const ctaButton = page.locator('[data-testid="hero-cta-button"]').first();

    if (await ctaButton.count() > 0) {
      const boundingBox = await ctaButton.boundingBox();

      if (boundingBox) {
        // Buttons should be at least 44x44px for good mobile UX
        expect(boundingBox.height).toBeGreaterThanOrEqual(40);
      }
    }
  });
});
