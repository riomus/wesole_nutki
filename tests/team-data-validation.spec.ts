import { test, expect } from '@playwright/test';
import * as yaml from 'yaml';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Team Data Validation Tests
 *
 * These tests validate the team.yml data file to ensure:
 * - All team members have required role_pl and role_en fields
 * - Data structure is correct
 * - No legacy role_key fields remain
 * - All visible team members have complete data
 */

const TEAM_DATA_PATH = path.join(process.cwd(), 'data/about/team.yml');

test.describe('Team Data Validation', () => {
  let teamData: any;

  test.beforeAll(() => {
    // Load and parse team.yml
    const fileContent = fs.readFileSync(TEAM_DATA_PATH, 'utf8');
    teamData = yaml.parse(fileContent);
  });

  test('team.yml file should exist and be readable', () => {
    expect(fs.existsSync(TEAM_DATA_PATH)).toBe(true);
    expect(teamData).toBeTruthy();
  });

  test('should have enabled flag', () => {
    expect(teamData).toHaveProperty('enabled');
    expect(typeof teamData.enabled).toBe('boolean');
  });

  test('should have members array', () => {
    expect(teamData).toHaveProperty('members');
    expect(Array.isArray(teamData.members)).toBe(true);
    expect(teamData.members.length).toBeGreaterThan(0);
  });

  test('all team members should have required fields', () => {
    const requiredFields = ['name', 'role_pl', 'role_en', 'bio_pl', 'bio_en', 'image', 'weight', 'visible'];

    for (const member of teamData.members) {
      for (const field of requiredFields) {
        expect(member).toHaveProperty(field);
      }
    }
  });

  test('should not have any legacy role_key fields', () => {
    for (const member of teamData.members) {
      expect(member).not.toHaveProperty('role_key');
    }
  });

  test('all visible team members should have non-empty role_pl', () => {
    const visibleMembers = teamData.members.filter((m: any) => m.visible !== false);

    for (const member of visibleMembers) {
      expect(member.role_pl).toBeTruthy();
      expect(typeof member.role_pl).toBe('string');
      expect(member.role_pl.trim().length).toBeGreaterThan(0);
    }
  });

  test('all visible team members should have non-empty role_en', () => {
    const visibleMembers = teamData.members.filter((m: any) => m.visible !== false);

    for (const member of visibleMembers) {
      expect(member.role_en).toBeTruthy();
      expect(typeof member.role_en).toBe('string');
      expect(member.role_en.trim().length).toBeGreaterThan(0);
    }
  });

  test('team member names should be unique', () => {
    const names = teamData.members.map((m: any) => m.name);
    const uniqueNames = new Set(names);

    expect(names.length).toBe(uniqueNames.size);
  });

  test('team member weights should be positive integers', () => {
    for (const member of teamData.members) {
      expect(typeof member.weight).toBe('number');
      expect(member.weight).toBeGreaterThan(0);
      expect(Number.isInteger(member.weight)).toBe(true);
    }
  });

  test('team member images should have valid paths', () => {
    for (const member of teamData.members) {
      expect(member.image).toBeTruthy();
      expect(typeof member.image).toBe('string');
      expect(member.image).toMatch(/^\/images\/team\/.+\.(jpg|jpeg|png|webp)$/);
    }
  });

  test('bio fields should be strings (can be empty)', () => {
    for (const member of teamData.members) {
      expect(typeof member.bio_pl).toBe('string');
      expect(typeof member.bio_en).toBe('string');
    }
  });

  test('visible field should be boolean', () => {
    for (const member of teamData.members) {
      expect(typeof member.visible).toBe('boolean');
    }
  });

  test('role_pl should not contain English-only words', () => {
    const englishOnlyTerms = ['Lead Teacher', 'Teaching Assistant', 'Psychologist', 'Speech Therapist'];

    for (const member of teamData.members) {
      for (const term of englishOnlyTerms) {
        expect(member.role_pl).not.toBe(term);
      }
    }
  });

  test('role_en should not contain Polish-only words', () => {
    const polishOnlyTerms = ['Wychowawca', 'Pomoc nauczyciela', 'Logopeda', 'Kucharka'];

    for (const member of teamData.members) {
      for (const term of polishOnlyTerms) {
        expect(member.role_en).not.toBe(term);
      }
    }
  });

  test('emojis should be preserved in both role_pl and role_en for group teachers', () => {
    const groupEmojis = ['🐿️', '🦋', '🐞', '🦔'];
    const allRolesPl = teamData.members.map((m: any) => m.role_pl).join(' ');
    const allRolesEn = teamData.members.map((m: any) => m.role_en).join(' ');

    // Check that emojis appear in both languages
    for (const emoji of groupEmojis) {
      const inPolish = allRolesPl.includes(emoji);
      const inEnglish = allRolesEn.includes(emoji);

      if (inPolish) {
        expect(inEnglish).toBe(true); // If emoji is in Polish, it should also be in English
      }
    }
  });

  test('should have at least 15 team members', () => {
    expect(teamData.members.length).toBeGreaterThanOrEqual(15);
  });

  test('should have at least 10 visible team members', () => {
    const visibleMembers = teamData.members.filter((m: any) => m.visible !== false);
    expect(visibleMembers.length).toBeGreaterThanOrEqual(10);
  });

  test('data structure should match expected schema', () => {
    expect(teamData).toMatchObject({
      enabled: expect.any(Boolean),
      heading_key: expect.any(String),
      subtitle_key: expect.any(String),
      members: expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          role_pl: expect.any(String),
          role_en: expect.any(String),
          bio_pl: expect.any(String),
          bio_en: expect.any(String),
          image: expect.any(String),
          weight: expect.any(Number),
          visible: expect.any(Boolean),
        }),
      ]),
    });
  });

  test('should not have role fields with translation key patterns', () => {
    for (const member of teamData.members) {
      // Check that role fields don't contain i18n key patterns
      expect(member.role_pl).not.toMatch(/^staff_role_/);
      expect(member.role_en).not.toMatch(/^staff_role_/);
      expect(member.role_pl).not.toContain('{{');
      expect(member.role_en).not.toContain('{{');
    }
  });

  test('role values should be substantive (not just whitespace or special characters)', () => {
    for (const member of teamData.members) {
      if (member.visible !== false) {
        // Role should contain at least one alphanumeric character
        expect(member.role_pl).toMatch(/[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/);
        expect(member.role_en).toMatch(/[a-zA-Z]/);
      }
    }
  });

  test('team members should be sorted by weight', () => {
    const weights = teamData.members.map((m: any) => m.weight);

    for (let i = 1; i < weights.length; i++) {
      expect(weights[i]).toBeGreaterThanOrEqual(weights[i - 1]);
    }
  });
});
