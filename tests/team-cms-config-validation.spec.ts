import { test, expect } from '@playwright/test';
import * as yaml from 'yaml';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Team CMS Configuration Validation Tests
 *
 * These tests validate the Netlify CMS configuration for the team section to ensure:
 * - role_pl and role_en fields are properly configured
 * - No legacy role_key field remains
 * - Field configurations match the data structure
 * - CMS widgets are correctly set up for multilingual role editing
 */

const CMS_CONFIG_PATH = path.join(process.cwd(), 'static/admin/config.yml');

test.describe('Team CMS Configuration Validation', () => {
  let cmsConfig: any;
  let teamMemberFields: any[];

  test.beforeAll(() => {
    // Load and parse CMS config
    const fileContent = fs.readFileSync(CMS_CONFIG_PATH, 'utf8');
    cmsConfig = yaml.parse(fileContent);

    // Find the team_staff collection
    const teamStaffCollection = cmsConfig.collections?.find(
      (c: any) => c.name === 'team_staff'
    );

    expect(teamStaffCollection).toBeTruthy();

    // Get the member fields
    const membersField = teamStaffCollection.files?.[0]?.fields?.find(
      (f: any) => f.name === 'members'
    );

    expect(membersField).toBeTruthy();
    teamMemberFields = membersField.fields || [];
  });

  test('CMS config file should exist and be valid YAML', () => {
    expect(fs.existsSync(CMS_CONFIG_PATH)).toBe(true);
    expect(cmsConfig).toBeTruthy();
  });

  test('should have team_staff collection configured', () => {
    const teamCollection = cmsConfig.collections?.find(
      (c: any) => c.name === 'team_staff'
    );

    expect(teamCollection).toBeTruthy();
    expect(teamCollection.label).toBeTruthy();
  });

  test('should have role_pl field configured', () => {
    const rolePlField = teamMemberFields.find((f: any) => f.name === 'role_pl');

    expect(rolePlField).toBeTruthy();
    expect(rolePlField.label).toContain('PL');
    expect(rolePlField.widget).toBe('text');
  });

  test('should have role_en field configured', () => {
    const roleEnField = teamMemberFields.find((f: any) => f.name === 'role_en');

    expect(roleEnField).toBeTruthy();
    expect(roleEnField.label).toContain('EN');
    expect(roleEnField.widget).toBe('text');
  });

  test('should NOT have role_key field configured', () => {
    const roleKeyField = teamMemberFields.find((f: any) => f.name === 'role_key');

    expect(roleKeyField).toBeUndefined();
  });

  test('role_pl field should have appropriate hint', () => {
    const rolePlField = teamMemberFields.find((f: any) => f.name === 'role_pl');

    expect(rolePlField.hint).toBeTruthy();
    expect(rolePlField.hint.toLowerCase()).toContain('polsk');
  });

  test('role_en field should have appropriate hint', () => {
    const roleEnField = teamMemberFields.find((f: any) => f.name === 'role_en');

    expect(roleEnField.hint).toBeTruthy();
    expect(roleEnField.hint.toLowerCase()).toContain('english');
  });

  test('team member fields should include all required fields', () => {
    const requiredFieldNames = [
      'name',
      'role_pl',
      'role_en',
      'bio_pl',
      'bio_en',
      'image',
      'weight',
      'visible',
    ];

    for (const fieldName of requiredFieldNames) {
      const field = teamMemberFields.find((f: any) => f.name === fieldName);
      expect(field).toBeTruthy();
    }
  });

  test('role fields should be positioned correctly in field list', () => {
    const fieldNames = teamMemberFields.map((f: any) => f.name);
    const rolePlIndex = fieldNames.indexOf('role_pl');
    const roleEnIndex = fieldNames.indexOf('role_en');

    // role_pl and role_en should be adjacent
    expect(Math.abs(rolePlIndex - roleEnIndex)).toBe(1);

    // They should come after 'name' field
    const nameIndex = fieldNames.indexOf('name');
    expect(rolePlIndex).toBeGreaterThan(nameIndex);
    expect(roleEnIndex).toBeGreaterThan(nameIndex);
  });

  test('summary field should reference role_pl, not role_key', () => {
    const teamStaffCollection = cmsConfig.collections?.find(
      (c: any) => c.name === 'team_staff'
    );

    const summaryField = teamStaffCollection.files?.[0]?.fields?.find(
      (f: any) => f.name === 'members'
    )?.summary;

    if (summaryField) {
      expect(summaryField).toContain('role_pl');
      expect(summaryField).not.toContain('role_key');
    }
  });

  test('bio fields should have same widget type as role fields', () => {
    const rolePlField = teamMemberFields.find((f: any) => f.name === 'role_pl');
    const bioPlField = teamMemberFields.find((f: any) => f.name === 'bio_pl');

    expect(rolePlField.widget).toBe(bioPlField.widget);
  });

  test('role fields should not be marked as required (to allow empty)', () => {
    const rolePlField = teamMemberFields.find((f: any) => f.name === 'role_pl');
    const roleEnField = teamMemberFields.find((f: any) => f.name === 'role_en');

    // Either required is false or not set (defaults to false)
    expect(rolePlField.required).not.toBe(true);
    expect(roleEnField.required).not.toBe(true);
  });

  test('team member list should have widget type "list"', () => {
    const teamStaffCollection = cmsConfig.collections?.find(
      (c: any) => c.name === 'team_staff'
    );

    const membersField = teamStaffCollection.files?.[0]?.fields?.find(
      (f: any) => f.name === 'members'
    );

    expect(membersField.widget).toBe('list');
  });

  test('CMS should support both Polish and English content editing', () => {
    // Check that both role_pl and role_en exist and are editable
    const rolePlField = teamMemberFields.find((f: any) => f.name === 'role_pl');
    const roleEnField = teamMemberFields.find((f: any) => f.name === 'role_en');

    expect(rolePlField).toBeTruthy();
    expect(roleEnField).toBeTruthy();

    // Neither should be read-only
    expect(rolePlField.disabled).not.toBe(true);
    expect(roleEnField.disabled).not.toBe(true);
  });

  test('field labels should be bilingual (Polish/English)', () => {
    const rolePlField = teamMemberFields.find((f: any) => f.name === 'role_pl');
    const roleEnField = teamMemberFields.find((f: any) => f.name === 'role_en');

    // Labels should contain both Polish and English text (separated by /)
    expect(rolePlField.label).toMatch(/.*\/.*|.*\(.*\).*/);
    expect(roleEnField.label).toMatch(/.*\/.*|.*\(.*\).*/);
  });

  test('should not have select/dropdown widget for roles', () => {
    const rolePlField = teamMemberFields.find((f: any) => f.name === 'role_pl');
    const roleEnField = teamMemberFields.find((f: any) => f.name === 'role_en');

    // Should use text widget, not select/dropdown
    expect(rolePlField.widget).not.toBe('select');
    expect(roleEnField.widget).not.toBe('select');
    expect(rolePlField.widget).not.toBe('relation');
    expect(roleEnField.widget).not.toBe('relation');
  });

  test('team members should have weight field for ordering', () => {
    const weightField = teamMemberFields.find((f: any) => f.name === 'weight');

    expect(weightField).toBeTruthy();
    expect(weightField.widget).toBe('number');
  });

  test('team members should have visible toggle field', () => {
    const visibleField = teamMemberFields.find((f: any) => f.name === 'visible');

    expect(visibleField).toBeTruthy();
    expect(visibleField.widget).toBe('boolean');
  });
});
