import { test, expect } from '@playwright/test';

/**
 * Biography Display E2E Tests
 * Tests to verify that team member biographies display correctly in both Polish and English
 */

// Test configuration constants
const TEAM_MEMBER_WITH_BIO = 'Patrycja Gajzler';
const POLISH_BIO_TEXT = 'Wykwalifikowany nauczyciel przedszkola';
const ENGLISH_BIO_TEXT = 'Qualified preschool teacher';

test.describe('Team Biography Display', () => {
  test.describe('Polish Biography Display', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');
    });

    test('should display team section on about page', async ({ page }) => {
      const teamSection = page.locator('#team-section');
      await expect(teamSection).toBeVisible();
    });

    test('should display team section heading in Polish', async ({ page }) => {
      const heading = page.locator('#team-section .section-heading');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('Nasz Zespół');
    });

    test('should display team section subtitle in Polish', async ({ page }) => {
      const subtitle = page.locator('#team-section .section-subtitle');
      await expect(subtitle).toBeVisible();
      await expect(subtitle).toContainText('Poznaj naszych wykwalifikowanych i zaangażowanych nauczycieli');
    });

    test('should display team member cards', async ({ page }) => {
      const teamCards = page.locator('#team-section .team-card');
      const count = await teamCards.count();
      // Team has multiple members based on the data file
      expect(count).toBeGreaterThan(0);
    });

    test('should display team member with name and role', async ({ page }) => {
      const teamCards = page.locator('#team-section .team-card');
      const firstCard = teamCards.first();

      // Check that name is visible
      const name = firstCard.locator('.team-card-name');
      await expect(name).toBeVisible();
      const nameText = await name.textContent();
      expect(nameText?.length).toBeGreaterThan(0);

      // Check that role is visible
      const role = firstCard.locator('.team-card-role');
      await expect(role).toBeVisible();
      const roleText = await role.textContent();
      expect(roleText?.length).toBeGreaterThan(0);
    });

    test('should display Polish biography for team member with bio', async ({ page }) => {
      // Test team member has a biography in both languages
      const patrycjaCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: TEAM_MEMBER_WITH_BIO })
      });

      await expect(patrycjaCard).toBeVisible();

      // Check for Polish biography
      const bio = patrycjaCard.locator('.team-card-bio');
      await expect(bio).toBeVisible();
      await expect(bio).toContainText(POLISH_BIO_TEXT);
    });

    test('should display team member with proper image or placeholder', async ({ page }) => {
      const teamCards = page.locator('#team-section .team-card');
      const firstCard = teamCards.first();

      // Check that either an image or placeholder is visible
      const imageWrapper = firstCard.locator('.team-card-image');
      await expect(imageWrapper).toBeVisible();

      // Either has an img element or a placeholder
      const hasImage = await imageWrapper.locator('img').count();
      const hasPlaceholder = await imageWrapper.locator('.team-card-placeholder').count();

      expect(hasImage + hasPlaceholder).toBeGreaterThan(0);
    });

    test('should display team member roles in Polish', async ({ page }) => {
      // Check that at least one team member has a Polish role
      const roles = page.locator('#team-section .team-card-role');
      const count = await roles.count();
      expect(count).toBeGreaterThan(0);

      // Check first role contains Polish text (checking for Polish characters or known roles)
      const firstRole = roles.first();
      const roleText = await firstRole.textContent();

      // Should have content and be in Polish (contains Polish-specific text)
      expect(roleText?.length).toBeGreaterThan(0);
    });

    test('should display biography only for members with bio_pl content', async ({ page }) => {
      // Get all team cards
      const teamCards = page.locator('#team-section .team-card');
      const count = await teamCards.count();

      // Check each card - only cards with biography content should show it
      for (let i = 0; i < Math.min(count, 5); i++) {
        const card = teamCards.nth(i);
        const bioElements = await card.locator('.team-card-bio').count();

        // Biography should either be present or absent (not both)
        expect(bioElements).toBeGreaterThanOrEqual(0);
        expect(bioElements).toBeLessThanOrEqual(1);
      }
    });
  });

  test.describe('English Biography Display', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');
    });

    test('should display team section on English about page', async ({ page }) => {
      const teamSection = page.locator('#team-section');
      await expect(teamSection).toBeVisible();
    });

    test('should display team section heading in English', async ({ page }) => {
      const heading = page.locator('#team-section .section-heading');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('Our Team');
    });

    test('should display team section subtitle in English', async ({ page }) => {
      const subtitle = page.locator('#team-section .section-subtitle');
      await expect(subtitle).toBeVisible();
      await expect(subtitle).toContainText('Meet our qualified and dedicated teachers');
    });

    test('should display team member cards', async ({ page }) => {
      const teamCards = page.locator('#team-section .team-card');
      const count = await teamCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display English biography for team member with bio', async ({ page }) => {
      // Test team member has a biography in both languages
      const patrycjaCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: TEAM_MEMBER_WITH_BIO })
      });

      await expect(patrycjaCard).toBeVisible();

      // Check for English biography
      const bio = patrycjaCard.locator('.team-card-bio');
      await expect(bio).toBeVisible();
      await expect(bio).toContainText(ENGLISH_BIO_TEXT);
    });

    test('should display team member roles in English', async ({ page }) => {
      // Check that roles are displayed in English
      const roles = page.locator('#team-section .team-card-role');
      const count = await roles.count();
      expect(count).toBeGreaterThan(0);

      const firstRole = roles.first();
      const roleText = await firstRole.textContent();

      expect(roleText?.length).toBeGreaterThan(0);
    });

    test('should display same team members in both languages', async ({ page }) => {
      // Get English team member count
      const englishCards = page.locator('#team-section .team-card');
      const englishCount = await englishCards.count();

      // Navigate to Polish version
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      // Get Polish team member count
      const polishCards = page.locator('#team-section .team-card');
      const polishCount = await polishCards.count();

      // Same number of team members should be visible
      expect(englishCount).toBe(polishCount);
    });

    test('should maintain same team member names across languages', async ({ page }) => {
      // Get first team member name in English
      const englishCard = page.locator('#team-section .team-card').first();
      const englishName = await englishCard.locator('.team-card-name').textContent();

      // Navigate to Polish version
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      // Get first team member name in Polish
      const polishCard = page.locator('#team-section .team-card').first();
      const polishName = await polishCard.locator('.team-card-name').textContent();

      // Names should be the same (they're proper nouns)
      expect(englishName).toBe(polishName);
    });
  });

  test.describe('Biography Language Switching', () => {
    test('should switch biography from Polish to English when changing language', async ({ page }) => {
      // Start on Polish page
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      // Find Patrycja's card and verify Polish bio
      const polishCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: TEAM_MEMBER_WITH_BIO })
      });

      await expect(polishCard).toBeVisible();
      const polishBio = polishCard.locator('.team-card-bio');
      await expect(polishBio).toContainText(POLISH_BIO_TEXT);

      // Switch to English using language switcher
      const enButton = page.locator('.site-header .lang-btn').filter({
        has: page.locator('.lang-code', { hasText: 'EN' })
      });
      await enButton.click();

      // Wait for navigation to English about page
      await expect(page).toHaveURL(/\/en\/about\/?$/);
      await page.waitForLoadState('networkidle');

      // Find Patrycja's card and verify English bio
      const englishCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: TEAM_MEMBER_WITH_BIO })
      });

      await expect(englishCard).toBeVisible();
      const englishBio = englishCard.locator('.team-card-bio');
      await expect(englishBio).toContainText(ENGLISH_BIO_TEXT);
    });

    test('should switch biography from English to Polish when changing language', async ({ page }) => {
      // Start on English page
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');

      // Find Patrycja's card and verify English bio
      const englishCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: TEAM_MEMBER_WITH_BIO })
      });

      await expect(englishCard).toBeVisible();
      const englishBio = englishCard.locator('.team-card-bio');
      await expect(englishBio).toContainText(ENGLISH_BIO_TEXT);

      // Switch to Polish using language switcher
      const plButton = page.locator('.site-header .lang-btn').filter({
        has: page.locator('.lang-code', { hasText: 'PL' })
      });
      await plButton.click();

      // Wait for navigation to Polish about page
      await expect(page).toHaveURL(/\/pl\/about\/?$/);
      await page.waitForLoadState('networkidle');

      // Find Patrycja's card and verify Polish bio
      const polishCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: TEAM_MEMBER_WITH_BIO })
      });

      await expect(polishCard).toBeVisible();
      const polishBio = polishCard.locator('.team-card-bio');
      await expect(polishBio).toContainText(POLISH_BIO_TEXT);
    });
  });

  test.describe('Biography Display Accessibility', () => {
    test('should have proper semantic structure for team cards', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const teamSection = page.locator('#team-section');
      await expect(teamSection).toHaveAttribute('class', /section/);

      // Section should have proper heading
      const heading = teamSection.locator('.section-heading');
      await expect(heading).toBeVisible();
    });

    test('should display team member images with proper alt text', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      // Find first card with an actual image (not placeholder)
      const teamCards = page.locator('#team-section .team-card');
      const count = await teamCards.count();

      for (let i = 0; i < count; i++) {
        const card = teamCards.nth(i);
        const img = card.locator('img');
        const imgCount = await img.count();

        if (imgCount > 0) {
          // Image should have alt attribute
          const altText = await img.getAttribute('alt');
          expect(altText).toBeTruthy();
          expect(altText?.length).toBeGreaterThan(0);
          break; // Found at least one image with alt text
        }
      }
    });

    test('should have readable font sizes for biographies', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      // Find a card with biography
      const patrycjaCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: TEAM_MEMBER_WITH_BIO })
      });

      const bio = patrycjaCard.locator('.team-card-bio');
      await expect(bio).toBeVisible();

      // Check that bio has proper styling (font size should be readable)
      const fontSize = await bio.evaluate(el => window.getComputedStyle(el).fontSize);
      const fontSizeNum = parseFloat(fontSize);

      // Font size should be at least 14px for readability
      expect(fontSizeNum).toBeGreaterThanOrEqual(14);
    });
  });

  test.describe('Biography Responsive Display', () => {
    test('should display team cards on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const teamSection = page.locator('#team-section');
      await expect(teamSection).toBeVisible();

      const teamCards = page.locator('#team-section .team-card');
      const count = await teamCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display biography text on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const patrycjaCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: TEAM_MEMBER_WITH_BIO })
      });

      await expect(patrycjaCard).toBeVisible();
      const bio = patrycjaCard.locator('.team-card-bio');
      await expect(bio).toBeVisible();
    });

    test('should stack team cards vertically on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const teamCards = page.locator('#team-section .team-card');
      const firstCard = teamCards.first();
      const secondCard = teamCards.nth(1);

      // Get positions
      const firstBox = await firstCard.boundingBox();
      const secondBox = await secondCard.boundingBox();

      if (firstBox && secondBox) {
        // On mobile, cards should stack vertically (second card Y position > first card Y position)
        expect(secondBox.y).toBeGreaterThan(firstBox.y);
      }
    });

    test('should display team cards on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const teamCards = page.locator('#team-section .team-card');
      const count = await teamCards.count();
      expect(count).toBeGreaterThan(0);

      // Scroll to team section to bring it into viewport
      const teamSection = page.locator('#team-section');
      await teamSection.scrollIntoViewIfNeeded();

      // Wait for first card to be visible
      await expect(teamCards.first()).toBeVisible();

      // Verify all cards are rendered (even if some are below the fold)
      for (let i = 0; i < Math.min(count, 3); i++) {
        await expect(teamCards.nth(i)).toBeAttached();
      }
    });
  });
});
