#!/usr/bin/env node

/**
 * Language Parity Validation Script
 *
 * This script validates that Polish (pl) and English (en) data structures
 * are structurally identical across:
 * - i18n translation files (pl.toml, en.toml)
 * - Menu configuration files (main_pl.yml, main_en.yml)
 *
 * It identifies missing keys, extra keys, and structural differences.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// Track issues found
const issues = {
  i18n: {
    missingInEn: [],
    missingInPl: [],
    total: 0
  },
  menu: {
    differences: [],
    total: 0
  }
};

/**
 * Simple TOML parser for i18n files
 * Extracts [key] sections from TOML files
 */
function parseTOML(content) {
  const keys = new Set();
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    // Match [key_name] pattern
    const match = trimmed.match(/^\[([^\]]+)\]$/);
    if (match) {
      keys.add(match[1]);
    }
  }

  return keys;
}

/**
 * Simple YAML parser for menu files
 * Extracts i18n_key values from menu YAML files
 */
function parseMenuYAML(content) {
  const keys = new Set();
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    // Match i18n_key: value pattern
    const match = trimmed.match(/^i18n_key:\s*(.+)$/);
    if (match) {
      keys.add(match[1]);
    }
  }

  return keys;
}

/**
 * Compare two sets and return differences
 */
function compareSets(set1, set2, name1, name2) {
  const missingInSet2 = [...set1].filter(key => !set2.has(key));
  const missingInSet1 = [...set2].filter(key => !set1.has(key));

  return {
    missingInSet2,
    missingInSet1,
    inSet1Only: missingInSet2,
    inSet2Only: missingInSet1
  };
}

/**
 * Print section header
 */
function printHeader(text) {
  console.log(`\n${colors.bold}${colors.cyan}${'='.repeat(70)}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}${text}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);
}

/**
 * Print subsection header
 */
function printSubheader(text) {
  console.log(`\n${colors.bold}${colors.blue}${text}${colors.reset}`);
  console.log(`${colors.blue}${'-'.repeat(50)}${colors.reset}`);
}

/**
 * Validate i18n files
 */
function validateI18n() {
  printHeader('I18N TRANSLATION FILES VALIDATION');

  const plPath = path.join(__dirname, '../i18n/pl.toml');
  const enPath = path.join(__dirname, '../i18n/en.toml');

  console.log(`${colors.yellow}Reading files:${colors.reset}`);
  console.log(`  - Polish: ${plPath}`);
  console.log(`  - English: ${enPath}`);

  const plContent = fs.readFileSync(plPath, 'utf-8');
  const enContent = fs.readFileSync(enPath, 'utf-8');

  const plKeys = parseTOML(plContent);
  const enKeys = parseTOML(enContent);

  console.log(`\n${colors.yellow}Keys found:${colors.reset}`);
  console.log(`  - Polish (pl.toml): ${colors.cyan}${plKeys.size}${colors.reset} keys`);
  console.log(`  - English (en.toml): ${colors.cyan}${enKeys.size}${colors.reset} keys`);

  const diff = compareSets(plKeys, enKeys, 'Polish', 'English');

  // Missing in English
  if (diff.missingInSet2.length > 0) {
    printSubheader(`❌ Keys in Polish but MISSING in English (${diff.missingInSet2.length})`);
    diff.missingInSet2.sort().forEach(key => {
      console.log(`  ${colors.red}✗${colors.reset} [${key}]`);
      issues.i18n.missingInEn.push(key);
    });
  }

  // Missing in Polish
  if (diff.missingInSet1.length > 0) {
    printSubheader(`❌ Keys in English but MISSING in Polish (${diff.missingInSet1.length})`);
    diff.missingInSet1.sort().forEach(key => {
      console.log(`  ${colors.red}✗${colors.reset} [${key}]`);
      issues.i18n.missingInPl.push(key);
    });
  }

  // Summary
  const totalDiff = diff.missingInSet1.length + diff.missingInSet2.length;
  issues.i18n.total = totalDiff;

  if (totalDiff === 0) {
    console.log(`\n${colors.green}${colors.bold}✓ Perfect parity! All keys match between Polish and English.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}${colors.bold}✗ Found ${totalDiff} structural differences.${colors.reset}`);
  }
}

/**
 * Validate menu files
 */
function validateMenus() {
  printHeader('MENU CONFIGURATION FILES VALIDATION');

  const plMenuPath = path.join(__dirname, '../data/menus/main_pl.yml');
  const enMenuPath = path.join(__dirname, '../data/menus/main_en.yml');

  console.log(`${colors.yellow}Reading files:${colors.reset}`);
  console.log(`  - Polish: ${plMenuPath}`);
  console.log(`  - English: ${enMenuPath}`);

  const plMenuContent = fs.readFileSync(plMenuPath, 'utf-8');
  const enMenuContent = fs.readFileSync(enMenuPath, 'utf-8');

  const plMenuKeys = parseMenuYAML(plMenuContent);
  const enMenuKeys = parseMenuYAML(enMenuContent);

  console.log(`\n${colors.yellow}i18n_key references found:${colors.reset}`);
  console.log(`  - Polish menu (main_pl.yml): ${colors.cyan}${plMenuKeys.size}${colors.reset} keys`);
  console.log(`  - English menu (main_en.yml): ${colors.cyan}${enMenuKeys.size}${colors.reset} keys`);

  const diff = compareSets(plMenuKeys, enMenuKeys, 'Polish Menu', 'English Menu');

  // Different keys used
  if (diff.missingInSet2.length > 0) {
    printSubheader(`⚠️  i18n keys in Polish menu but NOT in English menu (${diff.missingInSet2.length})`);
    diff.missingInSet2.sort().forEach(key => {
      console.log(`  ${colors.yellow}!${colors.reset} ${key}`);
      issues.menu.differences.push({ type: 'pl_only', key });
    });
  }

  if (diff.missingInSet1.length > 0) {
    printSubheader(`⚠️  i18n keys in English menu but NOT in Polish menu (${diff.missingInSet1.length})`);
    diff.missingInSet1.sort().forEach(key => {
      console.log(`  ${colors.yellow}!${colors.reset} ${key}`);
      issues.menu.differences.push({ type: 'en_only', key });
    });
  }

  // Summary
  const totalDiff = diff.missingInSet1.length + diff.missingInSet2.length;
  issues.menu.total = totalDiff;

  if (totalDiff === 0) {
    console.log(`\n${colors.green}${colors.bold}✓ Menu structures use identical i18n keys.${colors.reset}`);
  } else {
    console.log(`\n${colors.yellow}${colors.bold}⚠ Menu structures use different i18n keys (${totalDiff} differences).${colors.reset}`);
    console.log(`${colors.yellow}Note: This may be intentional if menus have different structures.${colors.reset}`);
  }
}

/**
 * Print final summary
 */
function printSummary() {
  printHeader('VALIDATION SUMMARY');

  const totalIssues = issues.i18n.total + issues.menu.total;

  console.log(`${colors.bold}i18n Translation Files:${colors.reset}`);
  if (issues.i18n.total === 0) {
    console.log(`  ${colors.green}✓ Perfect parity${colors.reset}`);
  } else {
    console.log(`  ${colors.red}✗ ${issues.i18n.total} differences found${colors.reset}`);
    console.log(`    - Missing in English: ${issues.i18n.missingInEn.length}`);
    console.log(`    - Missing in Polish: ${issues.i18n.missingInPl.length}`);
  }

  console.log(`\n${colors.bold}Menu Configuration Files:${colors.reset}`);
  if (issues.menu.total === 0) {
    console.log(`  ${colors.green}✓ Identical i18n key usage${colors.reset}`);
  } else {
    console.log(`  ${colors.yellow}⚠ ${issues.menu.total} differences in i18n keys${colors.reset}`);
  }

  console.log(`\n${colors.bold}${'='.repeat(70)}${colors.reset}`);

  if (totalIssues === 0) {
    console.log(`${colors.green}${colors.bold}✓ ALL VALIDATIONS PASSED${colors.reset}`);
    console.log(`${colors.green}Polish and English data structures are identical!${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bold}✗ VALIDATION FAILED${colors.reset}`);
    console.log(`${colors.red}Total issues found: ${totalIssues}${colors.reset}`);
    console.log(`\n${colors.yellow}Run with --fix flag to automatically add missing keys.${colors.reset}`);
  }

  console.log(`${colors.bold}${'='.repeat(70)}${colors.reset}\n`);

  // Exit with error code if issues found
  process.exit(totalIssues > 0 ? 1 : 0);
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.bold}${colors.magenta}Language Parity Validation Tool${colors.reset}`);
  console.log(`${colors.magenta}Checking structural parity between Polish (pl) and English (en)${colors.reset}`);

  try {
    validateI18n();
    validateMenus();
    printSummary();
  } catch (error) {
    console.error(`\n${colors.red}${colors.bold}ERROR:${colors.reset} ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the validation
main();
