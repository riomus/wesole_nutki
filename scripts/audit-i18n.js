#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const layoutsDir = path.join(__dirname, '..', 'layouts');
const i18nDir = path.join(__dirname, '..', 'i18n');

// Regular expressions to extract i18n keys
const i18nRegex = /i18n\s+"([^"]+)"/g;
const partialTRegex = /partial\s+"t\.html"[^}]*"key"\s+"([^"]+)"/g;

// Extract all i18n keys from templates
function extractI18nKeys(content) {
  const keys = new Set();

  // Extract direct i18n calls
  let match;
  while ((match = i18nRegex.exec(content)) !== null) {
    keys.add(match[1]);
  }

  // Reset regex state
  i18nRegex.lastIndex = 0;

  // Extract partial "t.html" calls
  while ((match = partialTRegex.exec(content)) !== null) {
    keys.add(match[1]);
  }

  partialTRegex.lastIndex = 0;

  return Array.from(keys);
}

// Parse TOML file and extract existing keys
function parseTomlKeys(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const keys = new Set();
    const keyRegex = /^\[([^\]]+)\]/gm;

    let match;
    while ((match = keyRegex.exec(content)) !== null) {
      keys.add(match[1]);
    }

    return keys;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return new Set();
  }
}

// Recursively find all HTML files
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Scan all template files
function scanTemplates() {
  const htmlFiles = findHtmlFiles(layoutsDir);
  const allKeys = new Set();

  console.log(`Scanning ${htmlFiles.length} template files...\n`);

  for (const filePath of htmlFiles) {
    const relativePath = path.relative(layoutsDir, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const keys = extractI18nKeys(content);

    if (keys.length > 0) {
      console.log(`${relativePath}: found ${keys.length} keys`);
      keys.forEach(key => allKeys.add(key));
    }
  }

  return allKeys;
}

// Main audit function
function auditI18n() {
  console.log('=== i18n Translation Audit ===\n');

  // Extract keys from templates
  const templateKeys = scanTemplates();
  console.log(`\nTotal unique keys found in templates: ${templateKeys.size}\n`);

  // Parse existing translation files
  const enKeys = parseTomlKeys(path.join(i18nDir, 'en.toml'));
  const plKeys = parseTomlKeys(path.join(i18nDir, 'pl.toml'));

  console.log(`Existing keys in en.toml: ${enKeys.size}`);
  console.log(`Existing keys in pl.toml: ${plKeys.size}\n`);

  // Find missing keys
  const missingInEn = Array.from(templateKeys).filter(key => !enKeys.has(key));
  const missingInPl = Array.from(templateKeys).filter(key => !plKeys.has(key));

  console.log('=== Missing Translations ===\n');

  if (missingInEn.length > 0) {
    console.log(`Missing in en.toml (${missingInEn.length} keys):`);
    missingInEn.sort().forEach(key => console.log(`  - ${key}`));
    console.log();
  } else {
    console.log('✓ No missing keys in en.toml\n');
  }

  if (missingInPl.length > 0) {
    console.log(`Missing in pl.toml (${missingInPl.length} keys):`);
    missingInPl.sort().forEach(key => console.log(`  - ${key}`));
    console.log();
  } else {
    console.log('✓ No missing keys in pl.toml\n');
  }

  // Output results as JSON for further processing
  const results = {
    templateKeys: Array.from(templateKeys).sort(),
    existingEn: Array.from(enKeys).sort(),
    existingPl: Array.from(plKeys).sort(),
    missingInEn: missingInEn.sort(),
    missingInPl: missingInPl.sort()
  };

  fs.writeFileSync(
    path.join(__dirname, 'i18n-audit-results.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('Results saved to scripts/i18n-audit-results.json');

  return results;
}

// Run audit if called directly
if (require.main === module) {
  try {
    auditI18n();
  } catch (error) {
    console.error('Error during audit:', error);
    process.exit(1);
  }
}

module.exports = { auditI18n, extractI18nKeys, parseTomlKeys };
