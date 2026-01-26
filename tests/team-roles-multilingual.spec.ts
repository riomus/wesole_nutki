import { test, expect } from '@playwright/test';

/**
 * Team Roles Multilingual Display Tests
 *
 * These tests verify that team member roles are correctly displayed in both Polish and English.
 * The roles are stored directly in team.yml as role_pl and role_en fields, ensuring
 * language-specific role translations appear correctly for each team member.
 */

// Test data: Team members with their expected role translations
const TEAM_ROLES_DATA = [
  {
    name: 'Patrycja Gajzler',
    role_pl: 'Wychowawca - Wiewióreczki 🐿️',
    role_en: 'Lead Teacher - Squirrels 🐿️',
  },
  {
    name: 'Maja Kalinowska',
    role_pl: 'Pomoc nauczyciela - Wiewióreczki',
    role_en: 'Teaching Assistant - Squirrels',
  },
  {
    name: 'Paulina Milewska',
    role_pl: 'Wychowawca - Motylki 🦋',
    role_en: 'Lead Teacher - Butterflies 🦋',
  },
  {
    name: 'Anna Kierakowicz',
    role_pl: 'Nauczyciel rytmiki',
    role_en: 'Rhythmics Teacher',
  },
  {
    name: 'Alma Eperlein',
    role_pl: 'Nauczyciel gimnastyki',
    role_en: 'Gymnastics Teacher',
  },
  {
    name: 'Karolina Zwolińska',
    role_pl: 'Psycholog',
    role_en: 'Psychologist',
  },
  {
    name: 'Joanna Dominik',
    role_pl: 'Logopeda',
    role_en: 'Speech Therapist',
  },
  {
    name: 'Edyta Andrzejewska',
    role_pl: 'Kucharka',
    role_en: 'Cook',
  },
];

test.describe('Team Roles Multilingual Display', () => {
  test.describe('Polish Role Display', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');
    });

    test('should display all team member roles in Polish', async ({ page }) => {
      const teamSection = page.locator('#team-section');
      await expect(teamSection).toBeVisible();

      // Verify that all team members have roles displayed
      const teamCards = page.locator('#team-section .team-card');
      const count = await teamCards.count();
      expect(count).toBeGreaterThan(0);

      // Verify each card has a visible role
      for (let i = 0; i < count; i++) {
        const card = teamCards.nth(i);
        const role = card.locator('.team-card-role');
        await expect(role).toBeVisible();

        const roleText = await role.textContent();
        expect(roleText).toBeTruthy();
        expect(roleText?.trim().length).toBeGreaterThan(0);
      }
    });

    test('should display specific Polish roles for known team members', async ({ page }) => {
      // Test a sample of team members with their specific Polish roles
      for (const member of TEAM_ROLES_DATA) {
        const memberCard = page.locator('.team-card').filter({
          has: page.locator('.team-card-name', { hasText: member.name })
        });

        await expect(memberCard).toBeVisible();

        const roleElement = memberCard.locator('.team-card-role');
        await expect(roleElement).toBeVisible();
        await expect(roleElement).toContainText(member.role_pl);
      }
    });

    test('should display Polish role with emoji for group teachers', async ({ page }) => {
      // Verify group teachers have emojis in their Polish roles
      const groupTeachers = [
        { name: 'Patrycja Gajzler', emoji: '🐿️' },
        { name: 'Paulina Milewska', emoji: '🦋' },
        { name: 'Halszka Szymaniak', emoji: '🐞' },
        { name: 'Kacper Rygałło', emoji: '🦔' },
      ];

      for (const teacher of groupTeachers) {
        const teacherCard = page.locator('.team-card').filter({
          has: page.locator('.team-card-name', { hasText: teacher.name })
        });

        await expect(teacherCard).toBeVisible();

        const roleElement = teacherCard.locator('.team-card-role');
        const roleText = await roleElement.textContent();

        expect(roleText).toContain(teacher.emoji);
        expect(roleText).toContain('Wychowawca');
      }
    });

    test('should display Polish roles without i18n key references', async ({ page }) => {
      // Ensure roles are actual text, not i18n key references
      const roles = page.locator('#team-section .team-card-role');
      const count = await roles.count();

      for (let i = 0; i < count; i++) {
        const roleText = await roles.nth(i).textContent();

        // Should not contain i18n key patterns like "staff_role_" or "{{" or "}}"
        expect(roleText).not.toContain('staff_role_');
        expect(roleText).not.toContain('{{');
        expect(roleText).not.toContain('}}');
        expect(roleText).not.toContain('i18n');
      }
    });

    test('should contain Polish-specific terms in roles', async ({ page }) => {
      const allRolesText = await page.locator('#team-section .team-card-role').allTextContents();
      const combinedText = allRolesText.join(' ');

      // Verify Polish-specific terms are present
      const polishTerms = [
        'Wychowawca',
        'Pomoc nauczyciela',
        'Nauczyciel',
        'Psycholog',
        'Logopeda',
        'Pedagog',
        'Kucharka',
        'Personel',
      ];

      let foundPolishTerms = 0;
      for (const term of polishTerms) {
        if (combinedText.includes(term)) {
          foundPolishTerms++;
        }
      }

      // At least several Polish terms should be present
      expect(foundPolishTerms).toBeGreaterThanOrEqual(5);
    });
  });

  test.describe('English Role Display', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');
    });

    test('should display all team member roles in English', async ({ page }) => {
      const teamSection = page.locator('#team-section');
      await expect(teamSection).toBeVisible();

      // Verify that all team members have roles displayed
      const teamCards = page.locator('#team-section .team-card');
      const count = await teamCards.count();
      expect(count).toBeGreaterThan(0);

      // Verify each card has a visible role
      for (let i = 0; i < count; i++) {
        const card = teamCards.nth(i);
        const role = card.locator('.team-card-role');
        await expect(role).toBeVisible();

        const roleText = await role.textContent();
        expect(roleText).toBeTruthy();
        expect(roleText?.trim().length).toBeGreaterThan(0);
      }
    });

    test('should display specific English roles for known team members', async ({ page }) => {
      // Test a sample of team members with their specific English roles
      for (const member of TEAM_ROLES_DATA) {
        const memberCard = page.locator('.team-card').filter({
          has: page.locator('.team-card-name', { hasText: member.name })
        });

        await expect(memberCard).toBeVisible();

        const roleElement = memberCard.locator('.team-card-role');
        await expect(roleElement).toBeVisible();
        await expect(roleElement).toContainText(member.role_en);
      }
    });

    test('should display English role with emoji for group teachers', async ({ page }) => {
      // Verify group teachers have emojis in their English roles
      const groupTeachers = [
        { name: 'Patrycja Gajzler', emoji: '🐿️' },
        { name: 'Paulina Milewska', emoji: '🦋' },
        { name: 'Halszka Szymaniak', emoji: '🐞' },
        { name: 'Kacper Rygałło', emoji: '🦔' },
      ];

      for (const teacher of groupTeachers) {
        const teacherCard = page.locator('.team-card').filter({
          has: page.locator('.team-card-name', { hasText: teacher.name })
        });

        await expect(teacherCard).toBeVisible();

        const roleElement = teacherCard.locator('.team-card-role');
        const roleText = await roleElement.textContent();

        expect(roleText).toContain(teacher.emoji);
        expect(roleText).toContain('Lead Teacher');
      }
    });

    test('should display English roles without i18n key references', async ({ page }) => {
      // Ensure roles are actual text, not i18n key references
      const roles = page.locator('#team-section .team-card-role');
      const count = await roles.count();

      for (let i = 0; i < count; i++) {
        const roleText = await roles.nth(i).textContent();

        // Should not contain i18n key patterns
        expect(roleText).not.toContain('staff_role_');
        expect(roleText).not.toContain('{{');
        expect(roleText).not.toContain('}}');
        expect(roleText).not.toContain('i18n');
      }
    });

    test('should contain English-specific terms in roles', async ({ page }) => {
      const allRolesText = await page.locator('#team-section .team-card-role').allTextContents();
      const combinedText = allRolesText.join(' ');

      // Verify English-specific terms are present
      const englishTerms = [
        'Teacher',
        'Assistant',
        'Psychologist',
        'Therapist',
        'Cook',
        'Staff',
        'Lead',
      ];

      let foundEnglishTerms = 0;
      for (const term of englishTerms) {
        if (combinedText.includes(term)) {
          foundEnglishTerms++;
        }
      }

      // At least several English terms should be present
      expect(foundEnglishTerms).toBeGreaterThanOrEqual(5);
    });
  });

  test.describe('Role Consistency Across Languages', () => {
    test('should display same number of roles in both languages', async ({ page }) => {
      // Count roles in Polish version
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const polishRoles = page.locator('#team-section .team-card-role');
      const polishCount = await polishRoles.count();

      // Count roles in English version
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');

      const englishRoles = page.locator('#team-section .team-card-role');
      const englishCount = await englishRoles.count();

      // Both versions should have the same number of team members with roles
      expect(polishCount).toBe(englishCount);
      expect(polishCount).toBeGreaterThan(0);
    });

    test('should maintain same team member order in both languages', async ({ page }) => {
      // Get team member names in Polish
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const polishNames = await page.locator('#team-section .team-card-name').allTextContents();

      // Get team member names in English
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');

      const englishNames = await page.locator('#team-section .team-card-name').allTextContents();

      // Names should be in the same order (names don't change across languages)
      expect(polishNames).toEqual(englishNames);
    });

    test('should have corresponding role for each team member in both languages', async ({ page }) => {
      // Verify that specific team members have roles in both languages
      for (const member of TEAM_ROLES_DATA) {
        // Check Polish version
        await page.goto('/pl/about/');
        await page.waitForLoadState('networkidle');

        const polishCard = page.locator('.team-card').filter({
          has: page.locator('.team-card-name', { hasText: member.name })
        });
        const polishRole = polishCard.locator('.team-card-role');
        await expect(polishRole).toBeVisible();
        const polishRoleText = await polishRole.textContent();
        expect(polishRoleText?.trim()).toBe(member.role_pl);

        // Check English version
        await page.goto('/en/about/');
        await page.waitForLoadState('networkidle');

        const englishCard = page.locator('.team-card').filter({
          has: page.locator('.team-card-name', { hasText: member.name })
        });
        const englishRole = englishCard.locator('.team-card-role');
        await expect(englishRole).toBeVisible();
        const englishRoleText = await englishRole.textContent();
        expect(englishRoleText?.trim()).toBe(member.role_en);
      }
    });
  });

  test.describe('Role Language Switching', () => {
    test('should switch roles from Polish to English when changing language', async ({ page }) => {
      // Start on Polish about page
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      // Wait for team section to be visible
      const teamSection = page.locator('#team-section');
      await expect(teamSection).toBeVisible();

      // Verify a specific team member's Polish role
      const testMember = TEAM_ROLES_DATA[0]; // Patrycja Gajzler
      const polishCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: testMember.name })
      });

      // Scroll to the card to ensure it's in viewport
      await polishCard.scrollIntoViewIfNeeded();
      await expect(polishCard).toBeVisible();

      const polishRole = polishCard.locator('.team-card-role');
      await expect(polishRole).toContainText(testMember.role_pl);

      // Switch to English using language switcher - scroll to top first
      await page.evaluate(() => window.scrollTo(0, 0));
      const enButton = page.locator('.site-header .lang-btn').filter({
        has: page.locator('.lang-code', { hasText: 'EN' })
      });
      await enButton.click();

      // Wait for navigation to English about page
      await page.waitForURL(/\/en\/about\/?$/);
      await page.waitForLoadState('networkidle');

      // Wait for team section to be visible on new page
      const englishTeamSection = page.locator('#team-section');
      await expect(englishTeamSection).toBeVisible();

      // Verify the same team member now shows English role
      const englishCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: testMember.name })
      });

      // Scroll to the card to ensure it's in viewport
      await englishCard.scrollIntoViewIfNeeded();
      await expect(englishCard).toBeVisible();

      const englishRole = englishCard.locator('.team-card-role');
      await expect(englishRole).toContainText(testMember.role_en);
    });

    test('should switch roles from English to Polish when changing language', async ({ page }) => {
      // Start on English about page
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');

      // Wait for team section to be visible
      const teamSection = page.locator('#team-section');
      await expect(teamSection).toBeVisible();

      // Verify a specific team member's English role
      const testMember = TEAM_ROLES_DATA[3]; // Anna Kierakowicz
      const englishCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: testMember.name })
      });

      // Scroll to the card to ensure it's in viewport
      await englishCard.scrollIntoViewIfNeeded();
      await expect(englishCard).toBeVisible();

      const englishRole = englishCard.locator('.team-card-role');
      await expect(englishRole).toContainText(testMember.role_en);

      // Switch to Polish using language switcher - scroll to top first
      await page.evaluate(() => window.scrollTo(0, 0));
      const plButton = page.locator('.site-header .lang-btn').filter({
        has: page.locator('.lang-code', { hasText: 'PL' })
      });
      await plButton.click();

      // Wait for navigation to Polish about page
      await page.waitForURL(/\/pl\/about\/?$/);
      await page.waitForLoadState('networkidle');

      // Wait for team section to be visible on new page
      const polishTeamSection = page.locator('#team-section');
      await expect(polishTeamSection).toBeVisible();

      // Verify the same team member now shows Polish role
      const polishCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: testMember.name })
      });

      // Scroll to the card to ensure it's in viewport
      await polishCard.scrollIntoViewIfNeeded();
      await expect(polishCard).toBeVisible();

      const polishRole = polishCard.locator('.team-card-role');
      await expect(polishRole).toContainText(testMember.role_pl);
    });

    test('should switch multiple team member roles correctly when changing language', async ({ page }) => {
      // Test switching for multiple team members at once
      const testMembers = TEAM_ROLES_DATA.slice(0, 4); // Test first 4 members

      // Verify all members in Polish
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      // Wait for team section to be visible
      const polishTeamSection = page.locator('#team-section');
      await expect(polishTeamSection).toBeVisible();

      for (const member of testMembers) {
        const card = page.locator('.team-card').filter({
          has: page.locator('.team-card-name', { hasText: member.name })
        });
        const role = card.locator('.team-card-role');
        await expect(role).toContainText(member.role_pl);
      }

      // Switch to English - scroll to top first
      await page.evaluate(() => window.scrollTo(0, 0));
      const enButton = page.locator('.site-header .lang-btn').filter({
        has: page.locator('.lang-code', { hasText: 'EN' })
      });
      await enButton.click();
      await page.waitForURL(/\/en\/about\/?$/);
      await page.waitForLoadState('networkidle');

      // Wait for team section to be visible on new page
      const englishTeamSection = page.locator('#team-section');
      await expect(englishTeamSection).toBeVisible();

      // Verify all members now show English roles
      for (const member of testMembers) {
        const card = page.locator('.team-card').filter({
          has: page.locator('.team-card-name', { hasText: member.name })
        });
        const role = card.locator('.team-card-role');
        await expect(role).toContainText(member.role_en);
      }
    });
  });

  test.describe('Role Display Format and Styling', () => {
    test('should display roles with consistent formatting in Polish', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const roles = page.locator('#team-section .team-card-role');
      const count = await roles.count();
      expect(count).toBeGreaterThan(0);

      // Check that all roles have consistent CSS classes and are visible
      for (let i = 0; i < count; i++) {
        const role = roles.nth(i);
        await expect(role).toBeVisible();
        await expect(role).toHaveClass(/team-card-role/);
      }
    });

    test('should display roles with consistent formatting in English', async ({ page }) => {
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');

      const roles = page.locator('#team-section .team-card-role');
      const count = await roles.count();
      expect(count).toBeGreaterThan(0);

      // Check that all roles have consistent CSS classes and are visible
      for (let i = 0; i < count; i++) {
        const role = roles.nth(i);
        await expect(role).toBeVisible();
        await expect(role).toHaveClass(/team-card-role/);
      }
    });

    test('should preserve emojis in roles across languages', async ({ page }) => {
      const emojis = ['🐿️', '🦋', '🐞', '🦔'];

      // Check Polish version
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const polishRolesText = await page.locator('#team-section .team-card-role').allTextContents();
      const polishCombinedText = polishRolesText.join(' ');

      for (const emoji of emojis) {
        expect(polishCombinedText).toContain(emoji);
      }

      // Check English version
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');

      const englishRolesText = await page.locator('#team-section .team-card-role').allTextContents();
      const englishCombinedText = englishRolesText.join(' ');

      for (const emoji of emojis) {
        expect(englishCombinedText).toContain(emoji);
      }
    });
  });

  test.describe('Role Data Integrity', () => {
    test('should not have empty roles for any team member in Polish', async ({ page }) => {
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const roles = page.locator('#team-section .team-card-role');
      const count = await roles.count();

      for (let i = 0; i < count; i++) {
        const roleText = await roles.nth(i).textContent();
        expect(roleText).toBeTruthy();
        expect(roleText?.trim().length).toBeGreaterThan(0);
      }
    });

    test('should not have empty roles for any team member in English', async ({ page }) => {
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');

      const roles = page.locator('#team-section .team-card-role');
      const count = await roles.count();

      for (let i = 0; i < count; i++) {
        const roleText = await roles.nth(i).textContent();
        expect(roleText).toBeTruthy();
        expect(roleText?.trim().length).toBeGreaterThan(0);
      }
    });

    test('should display roles that match data file exactly', async ({ page }) => {
      // This test verifies that the roles displayed match exactly what's in team.yml
      // Testing a specific known team member
      const testMember = {
        name: 'Karolina Zwolińska',
        role_pl: 'Psycholog',
        role_en: 'Psychologist',
      };

      // Test Polish
      await page.goto('/pl/about/');
      await page.waitForLoadState('networkidle');

      const polishCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: testMember.name })
      });
      const polishRole = polishCard.locator('.team-card-role');
      const polishRoleText = await polishRole.textContent();
      expect(polishRoleText?.trim()).toBe(testMember.role_pl);

      // Test English
      await page.goto('/en/about/');
      await page.waitForLoadState('networkidle');

      const englishCard = page.locator('.team-card').filter({
        has: page.locator('.team-card-name', { hasText: testMember.name })
      });
      const englishRole = englishCard.locator('.team-card-role');
      const englishRoleText = await englishRole.textContent();
      expect(englishRoleText?.trim()).toBe(testMember.role_en);
    });
  });
});
