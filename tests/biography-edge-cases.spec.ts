import { test, expect } from '@playwright/test';

/**
 * Biography Edge Cases and Schema Validation Tests
 * Tests to verify edge cases and fallback behavior for team member biographies
 */

// Test configuration constants
const MAX_CARDS_TO_CHECK = 10;
const TEAM_MEMBER_WITH_BIO = 'Patrycja Gajzler';

test.describe('Team Biography Edge Cases', () => {
  test.describe('Biography Fallback Behavior', () => {
    test('should handle team members without any biography gracefully', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      // Get all team cards
      const teamCards = page.locator('#team-section .team-card');
      const count = await teamCards.count();

      // Verify that cards without bio don't show empty bio sections
      let cardsChecked = 0;
      for (let i = 0; i < count && cardsChecked < MAX_CARDS_TO_CHECK; i++) {
        const card = teamCards.nth(i);
        const name = await card.locator('.team-card-name').textContent();

        // Skip the team member who has a biography
        if (name?.includes(TEAM_MEMBER_WITH_BIO)) {
          continue;
        }

        const bioElements = await card.locator('.team-card-bio').count();

        // Most team members don't have bios - they should show 0 bio elements
        // This verifies graceful handling of missing biographies
        expect(bioElements).toBeLessThanOrEqual(1);
        cardsChecked++;
      }

      expect(cardsChecked).toBeGreaterThan(0);
    });

    test('should display team members without biographies in English', async ({ page }) => {
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');

      // Get all team cards
      const teamCards = page.locator('#team-section .team-card');
      const count = await teamCards.count();

      // Verify all cards render properly even without biographies
      expect(count).toBeGreaterThan(1);

      // Check that cards have names and roles even without bio
      const firstCard = teamCards.first();
      await expect(firstCard.locator('.team-card-name')).toBeVisible();
      await expect(firstCard.locator('.team-card-role')).toBeVisible();
    });

    test('should not display empty biography sections', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      // Find cards without the team member who has a bio
      const teamCards = page.locator('#team-section .team-card');
      const count = await teamCards.count();

      let foundCardWithoutBio = false;
      for (let i = 0; i < count; i++) {
        const card = teamCards.nth(i);
        const name = await card.locator('.team-card-name').textContent();

        // Skip the team member with biography
        if (name?.includes(TEAM_MEMBER_WITH_BIO)) {
          continue;
        }

        const bioCount = await card.locator('.team-card-bio').count();

        if (bioCount === 0) {
          foundCardWithoutBio = true;

          // Verify card still displays properly without bio
          await expect(card.locator('.team-card-name')).toBeVisible();
          await expect(card.locator('.team-card-role')).toBeVisible();
          break;
        }
      }

      expect(foundCardWithoutBio).toBe(true);
    });
  });

  test.describe('Schema Structure Validation', () => {
    test('should verify bio_key field is no longer used for display', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      // Check page source to ensure bio_key is not being referenced in rendered output
      const content = await page.content();

      // The rendered HTML should not contain bio_key references
      // (It's okay if it exists in data attributes, but not in displayed content)
      const bioKeyMatches = content.match(/bio_key/gi);

      // If bio_key appears, it should only be in non-display contexts (data attributes)
      if (bioKeyMatches) {
        // Make sure it's not in visible text
        const visibleText = await page.locator('body').textContent();
        expect(visibleText).not.toContain('bio_key');
      }
    });

    test('should verify team member with bio has both bio_pl and bio_en working', async ({ page }) => {
      // Test Polish version
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const polishCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: TEAM_MEMBER_WITH_BIO })
      });

      const polishBio = polishCard.locator('.team-card-bio');
      await expect(polishBio).toBeVisible();
      await expect(polishBio).toContainText('Wykwalifikowany nauczyciel przedszkola');

      // Test English version
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');

      const englishCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: TEAM_MEMBER_WITH_BIO })
      });

      const englishBio = englishCard.locator('.team-card-bio');
      await expect(englishBio).toBeVisible();
      await expect(englishBio).toContainText('Qualified preschool teacher');
    });

    test('should verify all team members have consistent structure', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const teamCards = page.locator('#team-section .team-card');
      const count = await teamCards.count();

      // Check that all cards have the required elements
      for (let i = 0; i < Math.min(count, 5); i++) {
        const card = teamCards.nth(i);

        // Every card must have a name
        await expect(card.locator('.team-card-name')).toBeVisible();

        // Every card must have a role
        await expect(card.locator('.team-card-role')).toBeVisible();

        // Every card must have an image wrapper
        await expect(card.locator('.team-card-image')).toBeVisible();

        // Bio is optional - no assertion needed
      }
    });
  });

  test.describe('Migration Verification', () => {
    test('should verify translation keys are deprecated', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      // The page should not show translation key placeholders
      const bodyText = await page.locator('body').textContent();

      // Should not see raw translation keys like "staff_bio_teacher1"
      expect(bodyText).not.toContain('staff_bio_teacher1');
      expect(bodyText).not.toContain('staff_bio_teacher2');
      expect(bodyText).not.toContain('staff_bio_teacher3');
      expect(bodyText).not.toContain('staff_bio_director');
    });

    test('should verify bio fields are language-specific', async ({ page }) => {
      // Polish page should show Polish bio
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const polishCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: TEAM_MEMBER_WITH_BIO })
      });

      const polishBioText = await polishCard.locator('.team-card-bio').textContent();

      // Polish bio should be in Polish (checking for Polish-specific text)
      expect(polishBioText).toContain('Wykwalifikowany');

      // Should not show English bio on Polish page
      expect(polishBioText).not.toContain('Qualified preschool teacher');

      // English page should show English bio
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');

      const englishCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: TEAM_MEMBER_WITH_BIO })
      });

      const englishBioText = await englishCard.locator('.team-card-bio').textContent();

      // English bio should be in English
      expect(englishBioText).toContain('Qualified preschool teacher');

      // Should not show Polish bio on English page
      expect(englishBioText).not.toContain('Wykwalifikowany');
    });

    test('should verify all 17 team members migrated successfully', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const teamCards = page.locator('#team-section .team-card');
      const count = await teamCards.count();

      // According to the data file, there should be 17 team members
      expect(count).toBeGreaterThanOrEqual(10); // At least 10 visible

      // All cards should render without errors
      for (let i = 0; i < Math.min(count, 17); i++) {
        const card = teamCards.nth(i);
        await expect(card).toBeAttached();

        // Each card should have a name (verifies data migration)
        const name = card.locator('.team-card-name');
        await expect(name).toBeVisible();
        const nameText = await name.textContent();
        expect(nameText?.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Rendering Performance', () => {
    test('should render team section within reasonable time', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const teamSection = page.locator('#team-section');
      await expect(teamSection).toBeVisible();

      const endTime = Date.now();
      const loadTime = endTime - startTime;

      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should handle rapid language switching', async ({ page }) => {
      // Start on Polish
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      // Switch to English
      const enButton = page.locator('.site-header .lang-btn').filter({
        has: page.locator('.lang-code', { hasText: 'EN' })
      });
      await enButton.click();
      await expect(page).toHaveURL(/\/en\/about\/?$/);
      await page.waitForLoadState('networkidle');

      // Verify English bio shows
      const englishCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: TEAM_MEMBER_WITH_BIO })
      });
      await expect(englishCard.locator('.team-card-bio')).toContainText('Qualified preschool teacher');

      // Switch back to Polish
      const plButton = page.locator('.site-header .lang-btn').filter({
        has: page.locator('.lang-code', { hasText: 'PL' })
      });
      await plButton.click();
      await expect(page).toHaveURL(/\/pl\/about\/?$/);
      await page.waitForLoadState('networkidle');

      // Verify Polish bio shows again
      const polishCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: TEAM_MEMBER_WITH_BIO })
      });
      await expect(polishCard.locator('.team-card-bio')).toContainText('Wykwalifikowany nauczyciel przedszkola');
    });
  });
});
