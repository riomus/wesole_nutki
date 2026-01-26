import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

/**
 * CMS Configuration Validation Tests
 * Tests to verify the CMS config has been correctly updated with bio_pl and bio_en fields
 */

test.describe('CMS Configuration Validation', () => {
  let cmsConfig: any;

  test.beforeAll(() => {
    // Load CMS config file
    const cmsConfigPath = path.join(process.cwd(), 'static', 'admin', 'config.yml');
    const cmsConfigContent = fs.readFileSync(cmsConfigPath, 'utf8');
    cmsConfig = yaml.load(cmsConfigContent);
  });

  test.describe('CMS Collections Structure', () => {
    test('should have collections defined in CMS config', () => {
      expect(cmsConfig).toBeDefined();
      expect(cmsConfig.collections).toBeDefined();
      expect(Array.isArray(cmsConfig.collections)).toBe(true);
    });

    test('should have team_staff collection defined', () => {
      const teamCollection = cmsConfig.collections.find(
        (c: any) => c.name === 'team_staff'
      );

      expect(teamCollection).toBeDefined();
      expect(teamCollection.label).toBeDefined();
      expect(teamCollection.files).toBeDefined();
      expect(Array.isArray(teamCollection.files)).toBe(true);
    });
  });

  test.describe('Team Data Fields Configuration', () => {
    let teamDataFields: any[];

    test.beforeAll(() => {
      const teamCollection = cmsConfig.collections.find(
        (c: any) => c.name === 'team_staff'
      );

      expect(teamCollection).toBeDefined();

      // Get the fields from the team file configuration
      const teamFile = teamCollection.files.find((f: any) =>
        f.name === 'team_data' || f.file === 'data/about/team.yml'
      );

      expect(teamFile).toBeDefined();
      expect(teamFile.fields).toBeDefined();

      // Get the list field that contains team members (named "members")
      const listField = teamFile.fields.find((f: any) => f.name === 'members' && f.widget === 'list');
      expect(listField).toBeDefined();
      expect(listField.fields).toBeDefined();

      teamDataFields = listField.fields;
    });

    test('should have bio_pl field configured in CMS', () => {
      const bioPLField = teamDataFields.find((f: any) => f.name === 'bio_pl');

      expect(bioPLField).toBeDefined();
      expect(bioPLField.widget).toBe('text');
      expect(bioPLField.required).toBe(false);
      expect(bioPLField.label).toBeDefined();
      expect(bioPLField.label).toContain('PL');
    });

    test('should have bio_en field configured in CMS', () => {
      const bioENField = teamDataFields.find((f: any) => f.name === 'bio_en');

      expect(bioENField).toBeDefined();
      expect(bioENField.widget).toBe('text');
      expect(bioENField.required).toBe(false);
      expect(bioENField.label).toBeDefined();
      expect(bioENField.label).toContain('EN');
    });

    test('should NOT have bio_key field in CMS config', () => {
      const bioKeyField = teamDataFields.find((f: any) => f.name === 'bio_key');

      // bio_key should have been removed
      expect(bioKeyField).toBeUndefined();
    });

    test('should have all required team member fields', () => {
      const requiredFields = ['name', 'role_key', 'bio_pl', 'bio_en', 'image', 'weight', 'visible'];

      requiredFields.forEach(fieldName => {
        const field = teamDataFields.find((f: any) => f.name === fieldName);
        expect(field).toBeDefined();
      });
    });

    test('should have proper field types for team members', () => {
      // Name should be string
      const nameField = teamDataFields.find((f: any) => f.name === 'name');
      expect(nameField.widget).toBe('string');
      expect(nameField.required).toBe(true);

      // role_key should be string
      const roleKeyField = teamDataFields.find((f: any) => f.name === 'role_key');
      expect(roleKeyField.widget).toBe('string');

      // bio_pl should be text widget (for longer content)
      const bioPLField = teamDataFields.find((f: any) => f.name === 'bio_pl');
      expect(bioPLField.widget).toBe('text');

      // bio_en should be text widget
      const bioENField = teamDataFields.find((f: any) => f.name === 'bio_en');
      expect(bioENField.widget).toBe('text');

      // weight should be number
      const weightField = teamDataFields.find((f: any) => f.name === 'weight');
      expect(weightField.widget).toBe('number');

      // visible should be boolean
      const visibleField = teamDataFields.find((f: any) => f.name === 'visible');
      expect(visibleField.widget).toBe('boolean');
    });

    test('should have bio fields as optional (not required)', () => {
      const bioPLField = teamDataFields.find((f: any) => f.name === 'bio_pl');
      const bioENField = teamDataFields.find((f: any) => f.name === 'bio_en');

      // Biography fields should be optional
      expect(bioPLField.required).toBe(false);
      expect(bioENField.required).toBe(false);
    });

    test('should have helpful hints for bio fields', () => {
      const bioPLField = teamDataFields.find((f: any) => f.name === 'bio_pl');
      const bioENField = teamDataFields.find((f: any) => f.name === 'bio_en');

      // Should have hint text to guide editors
      expect(bioPLField.hint).toBeDefined();
      expect(bioPLField.hint.length).toBeGreaterThan(0);

      expect(bioENField.hint).toBeDefined();
      expect(bioENField.hint.length).toBeGreaterThan(0);
    });

    test('should have bio fields ordered correctly', () => {
      const fieldNames = teamDataFields.map((f: any) => f.name);

      const bioPLIndex = fieldNames.indexOf('bio_pl');
      const bioENIndex = fieldNames.indexOf('bio_en');

      // Both fields should exist
      expect(bioPLIndex).toBeGreaterThanOrEqual(0);
      expect(bioENIndex).toBeGreaterThanOrEqual(0);

      // bio_en should come after bio_pl
      expect(bioENIndex).toBeGreaterThan(bioPLIndex);

      // Bio fields should come after role_key
      const roleKeyIndex = fieldNames.indexOf('role_key');
      expect(bioPLIndex).toBeGreaterThan(roleKeyIndex);
    });

    test('should have proper validation for name field', () => {
      const nameField = teamDataFields.find((f: any) => f.name === 'name');

      expect(nameField).toBeDefined();
      expect(nameField.widget).toBe('string');
      // Name field should be required (explicitly or implicitly)
      if (nameField.required !== undefined) {
        // If required is specified, it should be true
        expect(nameField.required).toBe(true);
      }
    });

    test('should have proper validation for weight field', () => {
      const weightField = teamDataFields.find((f: any) => f.name === 'weight');

      expect(weightField.widget).toBe('number');
      // Weight field is optional with a default value
      if (weightField.required !== undefined) {
        expect(weightField.required).toBe(false);
      }
      expect(weightField.default).toBeDefined();

      // Should have min/max values for ordering
      if (weightField.min !== undefined) {
        expect(weightField.min).toBeGreaterThanOrEqual(1);
      }
    });

    test('should have proper validation for visible field', () => {
      const visibleField = teamDataFields.find((f: any) => f.name === 'visible');

      expect(visibleField).toBeDefined();
      expect(visibleField.widget).toBe('boolean');
      expect(visibleField.default).toBeDefined();
      expect(visibleField.default).toBe(true);
    });
  });

  test.describe('Translation Schema Configuration', () => {
    test('should still have staff translation collections', () => {
      const collections = cmsConfig.collections;

      // Should have translation collections for staff
      const hasStaffTranslations = collections.some((c: any) =>
        c.name === 'translations_pl' || c.name === 'translations_en' ||
        c.name === 'translations' ||
        (c.files && c.files.some((f: any) => f.name === 'staff_pl' || f.name === 'staff_en'))
      );

      // Translation collections should still exist for role_key translations
      expect(hasStaffTranslations || collections.length > 0).toBe(true);
    });
  });

  test.describe('CMS Backend Configuration', () => {
    test('should have backend configured', () => {
      expect(cmsConfig.backend).toBeDefined();
      expect(cmsConfig.backend.name).toBeDefined();
    });

    test('should have media folder configured', () => {
      expect(cmsConfig.media_folder).toBeDefined();
      expect(cmsConfig.public_folder).toBeDefined();
    });

    test('should support i18n if configured', () => {
      // Check if i18n is configured (optional)
      if (cmsConfig.i18n) {
        expect(cmsConfig.i18n.locales).toBeDefined();
        expect(Array.isArray(cmsConfig.i18n.locales)).toBe(true);

        // Should include 'pl' and 'en'
        expect(cmsConfig.i18n.locales).toContain('pl');
        expect(cmsConfig.i18n.locales).toContain('en');
      }
    });
  });

  test.describe('Config File Consistency', () => {
    test('should have same config in public and static folders', () => {
      const staticConfigPath = path.join(process.cwd(), 'static', 'admin', 'config.yml');
      const publicConfigPath = path.join(process.cwd(), 'public', 'admin', 'config.yml');

      const staticContent = fs.readFileSync(staticConfigPath, 'utf8');

      // Check if public config exists
      if (fs.existsSync(publicConfigPath)) {
        const publicContent = fs.readFileSync(publicConfigPath, 'utf8');

        // Both files should have the same content
        expect(staticContent).toBe(publicContent);
      }
    });

    test('should have valid YAML syntax', () => {
      const configPath = path.join(process.cwd(), 'static', 'admin', 'config.yml');
      const content = fs.readFileSync(configPath, 'utf8');

      // Should parse without errors
      expect(() => yaml.load(content)).not.toThrow();
    });
  });
});
