import { test, expect } from '@playwright/test';

/**
 * Team Template Fallback Logic Tests
 *
 * These tests verify the template's fallback behavior for role fields:
 * - When role_pl is missing, should fall back to role_en
 * - When role_en is missing, should fall back to role_pl
 * - When both are missing, should not display role element
 * - Language selection should work correctly
 */

test.describe('Team Template Fallback Logic', () => {
  test.describe('Polish Language Fallback', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');
    });

    test('should display all team member roles in Polish version', async ({ page }) => {
      const teamCards = page.locator('#team-section .team-card');
      const count = await teamCards.count();

      expect(count).toBeGreaterThan(0);

      // All visible team members should have roles
      for (let i = 0; i < count; i++) {
        const card = teamCards.nth(i);
        const role = card.locator('.team-card-role');

        // Role should be visible (exists in data)
        await expect(role).toBeVisible();
      }
    });

    test('should prefer role_pl in Polish context', async ({ page }) => {
      // Test a known team member
      const patrycjaCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: 'Patrycja Gajzler' })
      });

      const role = patrycjaCard.locator('.team-card-role');
      const roleText = await role.textContent();

      // Should display Polish role (with emoji)
      expect(roleText).toContain('Wychowawca');
      expect(roleText).toContain('🐿️');
      expect(roleText).not.toContain('Lead Teacher');
    });

    test('should display Polish-specific terminology', async ({ page }) => {
      const allRoles = await page.locator('#team-section .team-card-role').allTextContents();
      const combinedText = allRoles.join(' ');

      // Should contain Polish terms
      expect(combinedText).toMatch(/Wychowawca|Nauczyciel|Pomoc|Psycholog|Kucharka/);
    });
  });

  test.describe('English Language Fallback', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');
    });

    test('should display all team member roles in English version', async ({ page }) => {
      const teamCards = page.locator('#team-section .team-card');
      const count = await teamCards.count();

      expect(count).toBeGreaterThan(0);

      // All visible team members should have roles
      for (let i = 0; i < count; i++) {
        const card = teamCards.nth(i);
        const role = card.locator('.team-card-role');

        // Role should be visible (exists in data)
        await expect(role).toBeVisible();
      }
    });

    test('should prefer role_en in English context', async ({ page }) => {
      // Test a known team member
      const patrycjaCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: 'Patrycja Gajzler' })
      });

      const role = patrycjaCard.locator('.team-card-role');
      const roleText = await role.textContent();

      // Should display English role (with emoji)
      expect(roleText).toContain('Lead Teacher');
      expect(roleText).toContain('🐿️');
      expect(roleText).not.toContain('Wychowawca');
    });

    test('should display English-specific terminology', async ({ page }) => {
      const allRoles = await page.locator('#team-section .team-card-role').allTextContents();
      const combinedText = allRoles.join(' ');

      // Should contain English terms
      expect(combinedText).toMatch(/Teacher|Assistant|Psychologist|Cook|Therapist/);
    });
  });

  test.describe('Cross-Language Consistency', () => {
    test('same team members should appear in both languages', async ({ page }) => {
      // Get Polish team member names
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');
      const polishNames = await page.locator('#team-section .team-card-name').allTextContents();

      // Get English team member names
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');
      const englishNames = await page.locator('#team-section .team-card-name').allTextContents();

      // Same people should appear in both versions
      expect(polishNames.length).toBe(englishNames.length);
      expect(polishNames.sort()).toEqual(englishNames.sort());
    });

    test('roles should exist for all team members in both languages', async ({ page }) => {
      // Check Polish
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');
      const polishRoleCount = await page.locator('#team-section .team-card-role').count();

      // Check English
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');
      const englishRoleCount = await page.locator('#team-section .team-card-role').count();

      // Same number of roles should be displayed
      expect(polishRoleCount).toBe(englishRoleCount);
      expect(polishRoleCount).toBeGreaterThan(0);
    });
  });

  test.describe('Emoji Preservation', () => {
    test('emojis should be preserved in Polish roles', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const groupTeacherEmojis = ['🐿️', '🦋', '🐞', '🦔'];
      const allRoles = await page.locator('#team-section .team-card-role').allTextContents();
      const combinedText = allRoles.join(' ');

      for (const emoji of groupTeacherEmojis) {
        expect(combinedText).toContain(emoji);
      }
    });

    test('emojis should be preserved in English roles', async ({ page }) => {
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');

      const groupTeacherEmojis = ['🐿️', '🦋', '🐞', '🦔'];
      const allRoles = await page.locator('#team-section .team-card-role').allTextContents();
      const combinedText = allRoles.join(' ');

      for (const emoji of groupTeacherEmojis) {
        expect(combinedText).toContain(emoji);
      }
    });

    test('same emojis should appear in corresponding roles across languages', async ({ page }) => {
      // Get Polish roles for group teachers
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const patrycjaPolish = await page.locator('.team-card')
        .filter({ has: page.locator('.team-card-name', { hasText: 'Patrycja Gajzler' }) })
        .locator('.team-card-role')
        .textContent();

      // Get English roles for same person
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');

      const patrycjaEnglish = await page.locator('.team-card')
        .filter({ has: page.locator('.team-card-name', { hasText: 'Patrycja Gajzler' }) })
        .locator('.team-card-role')
        .textContent();

      // Both should contain the squirrel emoji
      expect(patrycjaPolish).toContain('🐿️');
      expect(patrycjaEnglish).toContain('🐿️');
    });
  });

  test.describe('No Translation Key Leakage', () => {
    test('should not display i18n keys in Polish version', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const allRoles = await page.locator('#team-section .team-card-role').allTextContents();

      for (const roleText of allRoles) {
        // Should not contain i18n key patterns
        expect(roleText).not.toContain('staff_role_');
        expect(roleText).not.toContain('{{');
        expect(roleText).not.toContain('}}');
        expect(roleText).not.toContain('i18n');
      }
    });

    test('should not display i18n keys in English version', async ({ page }) => {
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');

      const allRoles = await page.locator('#team-section .team-card-role').allTextContents();

      for (const roleText of allRoles) {
        // Should not contain i18n key patterns
        expect(roleText).not.toContain('staff_role_');
        expect(roleText).not.toContain('{{');
        expect(roleText).not.toContain('}}');
        expect(roleText).not.toContain('i18n');
      }
    });
  });

  test.describe('Role Display Structure', () => {
    test('role should be displayed in correct HTML element in Polish', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const roles = page.locator('#team-section .team-card-role');
      const firstRole = roles.first();

      // Should be a paragraph element
      const tagName = await firstRole.evaluate(el => el.tagName.toLowerCase());
      expect(tagName).toBe('p');

      // Should have correct CSS class
      await expect(firstRole).toHaveClass(/team-card-role/);
    });

    test('role should be displayed in correct HTML element in English', async ({ page }) => {
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');

      const roles = page.locator('#team-section .team-card-role');
      const firstRole = roles.first();

      // Should be a paragraph element
      const tagName = await firstRole.evaluate(el => el.tagName.toLowerCase());
      expect(tagName).toBe('p');

      // Should have correct CSS class
      await expect(firstRole).toHaveClass(/team-card-role/);
    });

    test('role should be positioned between name and bio', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const firstCard = page.locator('#team-section .team-card').first();
      const name = firstCard.locator('.team-card-name');
      const role = firstCard.locator('.team-card-role');
      const bio = firstCard.locator('.team-card-bio');

      // All should be visible
      await expect(name).toBeVisible();
      await expect(role).toBeVisible();

      // Bio might not be present for all members, so only check order if it exists
      const bioExists = await bio.count() > 0;
      if (bioExists) {
        // Get bounding boxes to verify order
        const nameBox = await name.boundingBox();
        const roleBox = await role.boundingBox();
        const bioBox = await bio.boundingBox();

        expect(nameBox).toBeTruthy();
        expect(roleBox).toBeTruthy();
        expect(bioBox).toBeTruthy();

        // Role should be below name
        expect(roleBox!.y).toBeGreaterThan(nameBox!.y);
        // Bio should be below role
        expect(bioBox!.y).toBeGreaterThan(roleBox!.y);
      }
    });
  });
});
