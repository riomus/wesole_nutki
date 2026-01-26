# Documentation Directory

This directory contains technical documentation and reference materials for the Wesołe Nutki Hugo website.

## Contents

### Role Key Mapping Documentation

Documentation for the team member role translation system:

- **[role-key-mapping.md](role-key-mapping.md)** - Human-readable documentation with detailed explanations of the role key system, including:
  - Complete mapping table of all role keys to English translations
  - List of currently used role keys with assigned team members
  - Instructions for adding new roles
  - Translation file locations

- **[role-key-mapping.json](role-key-mapping.json)** - Machine-readable JSON format containing:
  - Structured data for all role mappings
  - Metadata about source files
  - Category groupings
  - Usage statistics
  - Useful for programmatic access and automation

- **[role-key-mapping.csv](role-key-mapping.csv)** - Spreadsheet-compatible CSV format for:
  - Easy import into Excel, Google Sheets, etc.
  - Quick reference and sorting
  - Data analysis

### Other Documentation

- **CODE-REVIEW-IMPROVEMENTS.md** - Code review findings and improvements
- **URL_CONFIGURATION_TESTING.md** - URL configuration testing documentation

## Quick Reference

### Role Key System Overview

The role key system allows multilingual display of team member roles:

1. **Configuration File**: `data/about/team.yml` - Contains team member data with `role_key` references
2. **Translation Files**:
   - `data/translations/en/staff.yml` - English translations
   - `data/translations/pl/staff.yml` - Polish translations
3. **Template**: `layouts/partials/about/team.html` - Uses Hugo's `i18n` function to display translated roles

### Available Role Categories

1. **Leadership** - Director and management positions
2. **Group Teachers** - Lead teachers and assistants for each preschool group (Squirrels, Butterflies, Ladybugs, Hedgehogs)
3. **Additional Activity Teachers** - Specialized instructors (Rhythmics, Gymnastics, English)
4. **Psychological and Pedagogical Support** - Support staff (Psychologist, Speech Therapist, Special Educator)
5. **Kitchen Staff** - Cooks and dietitian
6. **Maintenance** - Facility maintenance staff

## Usage Notes

- All role keys follow the naming convention: `staff_role_[description]`
- Translations must be added to both English and Polish files when creating new roles
- The same role key can be used by multiple team members
- Role keys should be descriptive and unique
