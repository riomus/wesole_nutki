#!/usr/bin/env node

/**
 * Sync translations from YAML data files to Hugo i18n TOML files
 *
 * This script reads structured translation YAML files from data/translations/
 * and generates/updates the i18n TOML files that Hugo uses.
 *
 * Usage: node scripts/sync-translations.js
 */

const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const LANGUAGES = ['pl', 'en'];
const DATA_DIR = path.join(__dirname, '../data/translations');
const I18N_DIR = path.join(__dirname, '../i18n');

const CATEGORIES = [
  'about',
  'contact',
  'errors',
  'footer',
  'gallery',
  'global',
  'homepage',
  'navigation',
  'news',
  'programs',
  'schedule',
  'staff',
];

/**
 * Convert a YAML value to TOML format
 */
function toTomlValue(value) {
  if (typeof value === 'string') {
    // Escape quotes and backslashes
    const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `"${escaped}"`;
  }
  return JSON.stringify(value);
}

/**
 * Read all translation YAML files for a language and combine them
 */
function readTranslations(lang) {
  const translations = {};

  for (const category of CATEGORIES) {
    const filePath = path.join(DATA_DIR, lang, `${category}.yml`);

    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: ${filePath} not found, skipping...`);
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = YAML.parse(content);

      // Merge category data into translations
      Object.assign(translations, data);
    } catch (error) {
      console.error(`Error reading ${filePath}:`, error.message);
    }
  }

  return translations;
}

/**
 * Generate TOML content from translations object
 */
function generateToml(translations) {
  const lines = [`# UI translations - Auto-generated from data/translations/`, ''];

  for (const [key, value] of Object.entries(translations)) {
    lines.push(`[${key}]`);
    lines.push(`other = ${toTomlValue(value)}`);
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Main sync function
 */
function syncTranslations() {
  console.log('🔄 Syncing translations from YAML to TOML...\n');

  for (const lang of LANGUAGES) {
    console.log(`Processing ${lang}...`);

    // Read all YAML translation files for this language
    const translations = readTranslations(lang);
    const keyCount = Object.keys(translations).length;

    if (keyCount === 0) {
      console.warn(`  ⚠️  No translations found for ${lang}`);
      continue;
    }

    // Generate TOML content
    const tomlContent = generateToml(translations);

    // Write to i18n directory
    const outputPath = path.join(I18N_DIR, `${lang}.toml`);
    fs.writeFileSync(outputPath, tomlContent, 'utf8');

    console.log(`  ✅ Generated ${outputPath} with ${keyCount} keys`);
  }

  console.log('\n✨ Translation sync complete!');
}

// Run the sync
try {
  syncTranslations();
} catch (error) {
  console.error('❌ Error syncing translations:', error);
  process.exit(1);
}
