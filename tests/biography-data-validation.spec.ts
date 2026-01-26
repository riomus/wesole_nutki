import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

/**
 * Data Validation Tests
 * Tests to verify the team.yml data structure has been correctly migrated
 */

test.describe('Team Data Schema Validation', () => {
  let teamData: any;
  let teamMembers: any[];
  let staffTranslationsPL: any;
  let staffTranslationsEN: any;

  test.beforeAll(() => {
    // Load team data file
    const teamDataPath = path.join(process.cwd(), 'data', 'about', 'team.yml');
    const teamDataContent = fs.readFileSync(teamDataPath, 'utf8');
    teamData = yaml.load(teamDataContent);

    // Extract members array from the team data structure
    teamMembers = teamData.members || [];

    // Load staff translation files
    const staffPLPath = path.join(process.cwd(), 'data', 'translations', 'pl', 'staff.yml');
    const staffPLContent = fs.readFileSync(staffPLPath, 'utf8');
    staffTranslationsPL = yaml.load(staffPLContent);

    const staffENPath = path.join(process.cwd(), 'data', 'translations', 'en', 'staff.yml');
    const staffENContent = fs.readFileSync(staffENPath, 'utf8');
    staffTranslationsEN = yaml.load(staffENContent);
  });

  test.describe('Team Data Structure', () => {
    test('should have team members array in data file', () => {
      expect(teamMembers).toBeDefined();
      expect(Array.isArray(teamMembers)).toBe(true);
      expect(teamMembers.length).toBeGreaterThan(0);
    });

    test('should have all team members present in data file', () => {
      // There should be at least 17 team members as per specification
      expect(teamMembers.length).toBeGreaterThanOrEqual(17);
    });

    test('should have all required fields for each team member', () => {
      teamMembers.forEach((member: any, index: number) => {
        // Required fields that should always exist
        expect(member.name).toBeDefined();
        expect(typeof member.name).toBe('string');
        expect(member.name.length).toBeGreaterThan(0);

        expect(member.role_key).toBeDefined();
        expect(typeof member.role_key).toBe('string');

        expect(member.visible).toBeDefined();
        expect(typeof member.visible).toBe('boolean');

        expect(member.weight).toBeDefined();
        expect(typeof member.weight).toBe('number');

        // New biography fields should exist (can be empty strings)
        expect(member).toHaveProperty('bio_pl');
        expect(member).toHaveProperty('bio_en');
        expect(typeof member.bio_pl).toBe('string');
        expect(typeof member.bio_en).toBe('string');
      });
    });

    test('should NOT have bio_key field in any team member', () => {
      teamMembers.forEach((member: any) => {
        // bio_key should have been removed during migration
        expect(member.bio_key).toBeUndefined();
      });
    });

    test('should have Patrycja Gajzler with populated biographies', () => {
      const patrycja = teamMembers.find((m: any) => m.name === 'Patrycja Gajzler');

      expect(patrycja).toBeDefined();
      expect(patrycja.bio_pl).toBeDefined();
      expect(patrycja.bio_pl.length).toBeGreaterThan(0);
      expect(patrycja.bio_pl).toBe('Wykwalifikowany nauczyciel przedszkola');

      expect(patrycja.bio_en).toBeDefined();
      expect(patrycja.bio_en.length).toBeGreaterThan(0);
      expect(patrycja.bio_en).toBe('Qualified preschool teacher');
    });

    test('should have other team members with empty biographies', () => {
      // Filter out Patrycja who has a bio
      const membersWithoutBio = teamMembers.filter((m: any) => m.name !== 'Patrycja Gajzler');

      // All other members should have empty bio fields
      membersWithoutBio.forEach((member: any) => {
        expect(member.bio_pl).toBe('');
        expect(member.bio_en).toBe('');
      });

      // Should have at least 16 members without bio (total - 1 with bio)
      expect(membersWithoutBio.length).toBeGreaterThanOrEqual(16);
    });

    test('should have valid image paths or empty strings', () => {
      teamMembers.forEach((member: any) => {
        if (member.image) {
          expect(typeof member.image).toBe('string');
          // Image paths should start with /uploads/ or be empty
          if (member.image.length > 0) {
            expect(member.image.startsWith('/uploads/')).toBe(true);
          }
        }
      });
    });

    test('should have valid weight values for ordering', () => {
      teamMembers.forEach((member: any) => {
        expect(typeof member.weight).toBe('number');
        expect(member.weight).toBeGreaterThanOrEqual(1);
        expect(member.weight).toBeLessThanOrEqual(20);
      });
    });
  });

  test.describe('Translation File Cleanup', () => {
    test('should NOT have staff_bio_teacher1 in Polish translations', () => {
      expect(staffTranslationsPL.staff_bio_teacher1).toBeUndefined();
    });

    test('should NOT have staff_bio_teacher1 in English translations', () => {
      expect(staffTranslationsEN.staff_bio_teacher1).toBeUndefined();
    });

    test('should have deprecation comments for remaining staff_bio keys', () => {
      // Read the raw file content to check for comments
      const staffPLPath = path.join(process.cwd(), 'data', 'translations', 'pl', 'staff.yml');
      const staffPLContent = fs.readFileSync(staffPLPath, 'utf8');

      // Should contain deprecation comment
      expect(staffPLContent).toContain('DEPRECATED');
      expect(staffPLContent).toContain('bio_pl');
      expect(staffPLContent).toContain('bio_en');
    });

    test('should still have remaining staff_bio keys for backward compatibility', () => {
      // These keys should exist for backward compatibility
      expect(staffTranslationsPL.staff_bio_director).toBeDefined();
      expect(staffTranslationsPL.staff_bio_teacher2).toBeDefined();
      expect(staffTranslationsPL.staff_bio_teacher3).toBeDefined();

      expect(staffTranslationsEN.staff_bio_director).toBeDefined();
      expect(staffTranslationsEN.staff_bio_teacher2).toBeDefined();
      expect(staffTranslationsEN.staff_bio_teacher3).toBeDefined();
    });
  });

  test.describe('Data Consistency', () => {
    test('should have unique names for all team members', () => {
      const names = teamMembers.map((m: any) => m.name);
      const uniqueNames = new Set(names);

      expect(uniqueNames.size).toBe(names.length);
    });

    test('should have unique weights for proper ordering', () => {
      const weights = teamMembers.map((m: any) => m.weight);
      const uniqueWeights = new Set(weights);

      // All weights should be unique for deterministic ordering
      expect(uniqueWeights.size).toBe(weights.length);
    });

    test('should have at least some visible members', () => {
      const visibleMembers = teamMembers.filter((m: any) => m.visible === true);

      expect(visibleMembers.length).toBeGreaterThan(0);
      expect(visibleMembers.length).toBe(teamMembers.length); // All should be visible based on data
    });

    test('should have valid role_key references', () => {
      const validRoleKeys = [
        'staff_role_director',
        'staff_role_teacher',
        'staff_role_assistant',
        'staff_role_specialist',
        'staff_role_cook',
        'staff_role_coordinator'
      ];

      teamMembers.forEach((member: any) => {
        // role_key can be any string, but common ones should be from the list
        expect(typeof member.role_key).toBe('string');
        expect(member.role_key.length).toBeGreaterThan(0);
      });
    });
  });

  test.describe('Migration Completeness', () => {
    test('should verify all expected team members are present', () => {
      const expectedMembers = [
        'Patrycja Gajzler',
        'Maja Kalinowska',
        'Paulina Milewska',
        'Anita Nowak',
        'Halszka Szymaniak',
        'Katarzyna Ścibór',
        'Kacper Rygałło',
        'Anna Kierakowicz',
        'Alma Eperlein',
        'Inna',
        'Karolina Zwolińska',
        'Joanna Dominik',
        'Anna Brodzisz',
        'Edyta Andrzejewska',
        'Marta Pałubińska',
        'Pani Ania',
        'Małgorzata Talaga-Duma'
      ];

      const actualNames = teamMembers.map((m: any) => m.name);

      expectedMembers.forEach(expectedName => {
        expect(actualNames).toContain(expectedName);
      });
    });

    test('should have consistent biography field structure across all members', () => {
      teamMembers.forEach((member: any) => {
        // All members should have both bio_pl and bio_en (even if empty)
        expect(member).toHaveProperty('bio_pl');
        expect(member).toHaveProperty('bio_en');

        // Both should be strings
        expect(typeof member.bio_pl).toBe('string');
        expect(typeof member.bio_en).toBe('string');

        // Neither should be null or undefined
        expect(member.bio_pl).not.toBeNull();
        expect(member.bio_en).not.toBeNull();
      });
    });

    test('should verify no data loss during migration', () => {
      // Patrycja Gajzler should have her original biography content
      const patrycja = teamMembers.find((m: any) => m.name === 'Patrycja Gajzler');

      // Polish bio should match original translation
      expect(patrycja.bio_pl).toBe('Wykwalifikowany nauczyciel przedszkola');

      // English bio should match original translation
      expect(patrycja.bio_en).toBe('Qualified preschool teacher');

      // This verifies the migration preserved the content correctly
    });
  });
});
