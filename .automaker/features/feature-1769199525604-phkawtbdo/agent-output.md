
🔧 Tool: Glob
Input: {
  "pattern": "**/*.scss"
}

🔧 Tool: Glob
Input: {
  "pattern": "**/*.css"
}

🔧 Tool: Grep
Input: {
  "pattern": "hero",
  "type": "scss",
  "output_mode": "files_with_matches",
  "-i": true
}

🔧 Tool: Grep
Input: {
  "pattern": "text-shadow",
  "type": "scss",
  "output_mode": "content"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/assets/scss/_custom.scss"
}

🔧 Tool: Glob
Input: {
  "pattern": "layouts/**/*.html"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/layouts/partials/homepage/hero.html"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/layouts/partials/about/hero.html"
}

🔧 Tool: Grep
Input: {
  "pattern": "\\.hero",
  "type": "scss",
  "output_mode": "files_with_matches"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/assets/scss/_custom.scss",
  "limit": 500
}
## Planning Outline

**1. Goal**: Remove text shadows from hero section headings and paragraphs, and ensure paragraph text is white.

**2. Approach**: Modify the `_custom.scss` file to remove `text-shadow` properties from `.hero-section h1` and `.hero-section .lead` elements. The `.hero-section` already applies `text-white` class but we'll verify the `.lead` paragraph color is explicitly white. These changes are isolated to the hero section CSS block starting at line 398.

**3. Files to Touch**:
- `assets/scss/_custom.scss` - Remove text-shadow from lines 455 and 465 within the `.hero-section` block

**4. Tasks**:
1. Remove `text-shadow` property from `.hero-section h1` (line 455)
2. Remove `text-shadow` property from `.hero-section .lead` (line 465)  
3. Explicitly set `.hero-section .lead` color to white if not already set
4. Rebuild CSS to generate updated styles
5. Create Playwright test to verify text-shadow removal and white text color
6. Run test and verify changes work correctly
7. Delete the temporary test file

**5. Risks**: 
- Text readability may decrease on certain background images without shadows
- Need to verify changes don't affect other sections using `.lead` class
- CSS rebuild required for changes to take effect

[PLAN_GENERATED] Planning outline complete.

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Remove text-shadow from .hero-section h1 in _custom.scss",
      "status": "in_progress",
      "activeForm": "Removing text-shadow from .hero-section h1"
    },
    {
      "content": "Remove text-shadow from .hero-section .lead in _custom.scss",
      "status": "pending",
      "activeForm": "Removing text-shadow from .hero-section .lead"
    },
    {
      "content": "Ensure .hero-section .lead text color is white",
      "status": "pending",
      "activeForm": "Ensuring .hero-section .lead text color is white"
    },
    {
      "content": "Rebuild CSS to apply changes",
      "status": "pending",
      "activeForm": "Rebuilding CSS"
    },
    {
      "content": "Create Playwright test to verify changes",
      "status": "pending",
      "activeForm": "Creating Playwright test"
    },
    {
      "content": "Run test and verify text-shadow removal",
      "status": "pending",
      "activeForm": "Running test"
    },
    {
      "content": "Delete temporary test file",
      "status": "pending",
      "activeForm": "Deleting temporary test file"
    }
  ]
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/assets/scss/_custom.scss",
  "offset": 450,
  "limit": 20
}

🔧 Tool: Edit
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/assets/scss/_custom.scss",
  "old_string": "    h1 {\n      @apply font-heading text-white mb-6;\n      font-size: clamp(2.5rem, 5vw, 3.5rem);\n      line-height: 1.2;\n      text-shadow: 0 2px 4px rgba(255, 255, 255, 0.8);\n\n      @media (max-width: 768px) {\n        font-size: clamp(2rem, 6vw, 2.5rem);\n      }\n    }",
  "new_string": "    h1 {\n      @apply font-heading text-white mb-6;\n      font-size: clamp(2.5rem, 5vw, 3.5rem);\n      line-height: 1.2;\n\n      @media (max-width: 768px) {\n        font-size: clamp(2rem, 6vw, 2.5rem);\n      }\n    }"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Remove text-shadow from .hero-section h1 in _custom.scss",
      "status": "completed",
      "activeForm": "Removing text-shadow from .hero-section h1"
    },
    {
      "content": "Remove text-shadow from .hero-section .lead in _custom.scss",
      "status": "in_progress",
      "activeForm": "Removing text-shadow from .hero-section .lead"
    },
    {
      "content": "Ensure .hero-section .lead text color is white",
      "status": "pending",
      "activeForm": "Ensuring .hero-section .lead text color is white"
    },
    {
      "content": "Rebuild CSS to apply changes",
      "status": "pending",
      "activeForm": "Rebuilding CSS"
    },
    {
      "content": "Create Playwright test to verify changes",
      "status": "pending",
      "activeForm": "Creating Playwright test"
    },
    {
      "content": "Run test and verify text-shadow removal",
      "status": "pending",
      "activeForm": "Running test"
    },
    {
      "content": "Delete temporary test file",
      "status": "pending",
      "activeForm": "Deleting temporary test file"
    }
  ]
}

🔧 Tool: Edit
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/assets/scss/_custom.scss",
  "old_string": "    .lead {\n      @apply max-w-2xl mx-auto mb-8 leading-relaxed;\n      font-size: clamp(1rem, 2vw, 1.25rem);\n      text-shadow: 0 2px 8px rgba(255, 255, 255, 0.9), 0 1px 3px rgba(255, 255, 255, 0.7);\n    }",
  "new_string": "    .lead {\n      @apply max-w-2xl mx-auto mb-8 leading-relaxed text-white;\n      font-size: clamp(1rem, 2vw, 1.25rem);\n    }"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Remove text-shadow from .hero-section h1 in _custom.scss",
      "status": "completed",
      "activeForm": "Removing text-shadow from .hero-section h1"
    },
    {
      "content": "Remove text-shadow from .hero-section .lead in _custom.scss",
      "status": "completed",
      "activeForm": "Removing text-shadow from .hero-section .lead"
    },
    {
      "content": "Ensure .hero-section .lead text color is white",
      "status": "completed",
      "activeForm": "Ensuring .hero-section .lead text color is white"
    },
    {
      "content": "Rebuild CSS to apply changes",
      "status": "in_progress",
      "activeForm": "Rebuilding CSS"
    },
    {
      "content": "Create Playwright test to verify changes",
      "status": "pending",
      "activeForm": "Creating Playwright test"
    },
    {
      "content": "Run test and verify text-shadow removal",
      "status": "pending",
      "activeForm": "Running test"
    },
    {
      "content": "Delete temporary test file",
      "status": "pending",
      "activeForm": "Deleting temporary test file"
    }
  ]
}

🔧 Tool: Bash
Input: {
  "command": "npm run build",
  "description": "Build the Hugo site to apply CSS changes",
  "timeout": 60000
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Remove text-shadow from .hero-section h1 in _custom.scss",
      "status": "completed",
      "activeForm": "Removing text-shadow from .hero-section h1"
    },
    {
      "content": "Remove text-shadow from .hero-section .lead in _custom.scss",
      "status": "completed",
      "activeForm": "Removing text-shadow from .hero-section .lead"
    },
    {
      "content": "Ensure .hero-section .lead text color is white",
      "status": "completed",
      "activeForm": "Ensuring .hero-section .lead text color is white"
    },
    {
      "content": "Rebuild CSS to apply changes",
      "status": "completed",
      "activeForm": "Rebuilding CSS"
    },
    {
      "content": "Create Playwright test to verify changes",
      "status": "in_progress",
      "activeForm": "Creating Playwright test"
    },
    {
      "content": "Run test and verify text-shadow removal",
      "status": "pending",
      "activeForm": "Running test"
    },
    {
      "content": "Delete temporary test file",
      "status": "pending",
      "activeForm": "Deleting temporary test file"
    }
  ]
}

🔧 Tool: Glob
Input: {
  "pattern": "**/*.spec.ts"
}

🔧 Tool: Glob
Input: {
  "pattern": "playwright.config.*"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/tests/homepage.spec.ts",
  "limit": 50
}

🔧 Tool: Write
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/tests/hero-text-shadow-verification.spec.ts",
  "content": "import { test, expect } from '@playwright/test';\n\n/**\n * Temporary Verification Test for Hero Section Text Styles\n * This test verifies that text-shadow has been removed from h1 and .lead elements,\n * and that .lead text is white.\n */\n\ntest.describe('Hero Section Text Shadow Removal Verification', () => {\n  test.beforeEach(async ({ page }) => {\n    await page.goto('/pl/');\n  });\n\n  test('hero h1 should not have text-shadow', async ({ page }) => {\n    const headline = page.locator('[data-testid=\"hero-headline\"]');\n    await expect(headline).toBeVisible();\n\n    // Get computed styles\n    const textShadow = await headline.evaluate((el) => {\n      return window.getComputedStyle(el).textShadow;\n    });\n\n    // Should be 'none' or empty string (no text-shadow)\n    expect(textShadow).toMatch(/^(none|)$/);\n  });\n\n  test('hero .lead paragraph should not have text-shadow', async ({ page }) => {\n    const subheadline = page.locator('[data-testid=\"hero-subheadline\"]');\n    await expect(subheadline).toBeVisible();\n\n    // Get computed styles\n    const textShadow = await subheadline.evaluate((el) => {\n      return window.getComputedStyle(el).textShadow;\n    });\n\n    // Should be 'none' or empty string (no text-shadow)\n    expect(textShadow).toMatch(/^(none|)$/);\n  });\n\n  test('hero .lead paragraph should have white color', async ({ page }) => {\n    const subheadline = page.locator('[data-testid=\"hero-subheadline\"]');\n    await expect(subheadline).toBeVisible();\n\n    // Get computed styles\n    const color = await subheadline.evaluate((el) => {\n      return window.getComputedStyle(el).color;\n    });\n\n    // White color can be represented as rgb(255, 255, 255) or rgba(255, 255, 255, 1)\n    expect(color).toMatch(/rgb\\(255,\\s*255,\\s*255\\)|rgba\\(255,\\s*255,\\s*255,\\s*1\\)/);\n  });\n\n  test('hero section should remain readable', async ({ page }) => {\n    const heroSection = page.locator('[data-testid=\"hero-section\"]');\n    await expect(heroSection).toBeVisible();\n\n    const headline = page.locator('[data-testid=\"hero-headline\"]');\n    const subheadline = page.locator('[data-testid=\"hero-subheadline\"]');\n\n    // Verify text is still visible and readable\n    await expect(headline).toBeVisible();\n    await expect(subheadline).toBeVisible();\n\n    // Verify text content is still present\n    await expect(headline).toContainText('Wesole Nutki');\n    await expect(subheadline).toContainText(/./); // Has some text content\n  });\n});\n"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Remove text-shadow from .hero-section h1 in _custom.scss",
      "status": "completed",
      "activeForm": "Removing text-shadow from .hero-section h1"
    },
    {
      "content": "Remove text-shadow from .hero-section .lead in _custom.scss",
      "status": "completed",
      "activeForm": "Removing text-shadow from .hero-section .lead"
    },
    {
      "content": "Ensure .hero-section .lead text color is white",
      "status": "completed",
      "activeForm": "Ensuring .hero-section .lead text color is white"
    },
    {
      "content": "Rebuild CSS to apply changes",
      "status": "completed",
      "activeForm": "Rebuilding CSS"
    },
    {
      "content": "Create Playwright test to verify changes",
      "status": "completed",
      "activeForm": "Creating Playwright test"
    },
    {
      "content": "Run test and verify text-shadow removal",
      "status": "in_progress",
      "activeForm": "Running test"
    },
    {
      "content": "Delete temporary test file",
      "status": "pending",
      "activeForm": "Deleting temporary test file"
    }
  ]
}

🔧 Tool: Bash
Input: {
  "command": "npx playwright test tests/hero-text-shadow-verification.spec.ts",
  "description": "Run Playwright test to verify text-shadow removal",
  "timeout": 60000
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/playwright.config.ts"
}

🔧 Tool: Bash
Input: {
  "command": "cat package.json | grep -A 5 \"scripts\"",
  "description": "Check package.json scripts"
}

🔧 Tool: Glob
Input: {
  "pattern": "data/**/hero.*"
}

🔧 Tool: Bash
Input: {
  "command": "find data -name \"*hero*\" -type f",
  "description": "Find hero data files"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/data/homepage/hero.yml"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/layouts/index.html"
}

🔧 Tool: Bash
Input: {
  "command": "grep -A 5 \"\\.hero-section h1\" public/css/style.css | head -20",
  "description": "Check if the CSS changes are in the built file"
}

🔧 Tool: Bash
Input: {
  "command": "grep \"text-shadow\" public/css/style.css | grep -i hero",
  "description": "Check for text-shadow in hero styles"
}

🔧 Tool: Bash
Input: {
  "command": "npx playwright test tests/hero-text-shadow-verification.spec.ts --project=chromium",
  "description": "Run test with only Chromium browser",
  "timeout": 90000
}

🔧 Tool: Bash
Input: {
  "command": "grep -A 15 \"\\.hero-section \\.lead\" public/css/style.css",
  "description": "Check .hero-section .lead styles in compiled CSS"
}

🔧 Tool: Bash
Input: {
  "command": "grep \"\\.lead\" public/css/style.css | head -30",
  "description": "Check all .lead styles in CSS"
}

🔧 Tool: Bash
Input: {
  "command": "grep -n \"^\\.lead\" public/css/style.css | head -5",
  "description": "Find line numbers of .lead styles"
}

🔧 Tool: Bash
Input: {
  "command": "grep -n \"\\.hero-section \\.lead\" public/css/style.css",
  "description": "Find line number of hero-section .lead"
}

🔧 Tool: Bash
Input: {
  "command": "sed -n '6002,6010p' public/css/style.css",
  "description": "Check .lead style at line 6002"
}

🔧 Tool: Bash
Input: {
  "command": "sed -n '6002,6010p' /Users/romanbartusiak/git/riomus/wesole_nutki/public/css/style.css",
  "description": "Check .lead style at line 6002"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/assets/scss/_custom.scss",
  "offset": 460,
  "limit": 10
}

🔧 Tool: Edit
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/assets/scss/_custom.scss",
  "old_string": "    .lead {\n      @apply max-w-2xl mx-auto mb-8 leading-relaxed text-white;\n      font-size: clamp(1rem, 2vw, 1.25rem);\n    }",
  "new_string": "    .lead {\n      @apply max-w-2xl mx-auto mb-8 leading-relaxed;\n      font-size: clamp(1rem, 2vw, 1.25rem);\n      color: #ffffff !important;\n    }"
}

🔧 Tool: Bash
Input: {
  "command": "npm run build",
  "description": "Rebuild site with updated CSS",
  "timeout": 60000
}

🔧 Tool: Bash
Input: {
  "command": "grep -A 10 \"\\.hero-section \\.lead\" /Users/romanbartusiak/git/riomus/wesole_nutki/public/css/style.css",
  "description": "Verify updated CSS with !important"
}

🔧 Tool: Bash
Input: {
  "command": "find resources/_gen -name \"*.css\" -type f | head -3",
  "description": "Find generated CSS files"
}

🔧 Tool: Bash
Input: {
  "command": "grep -A 10 \"\\.hero-section \\.lead\" resources/_gen/assets/scss/main.scss_*.content 2>/dev/null | head -20",
  "description": "Check generated SCSS for !important"
}

🔧 Tool: Bash
Input: {
  "command": "npx playwright test tests/hero-text-shadow-verification.spec.ts --project=chromium",
  "description": "Run test again with updated CSS",
  "timeout": 90000
}

🔧 Tool: Bash
Input: {
  "command": "npx playwright test tests/homepage.spec.ts --project=chromium --grep \"should display hero section\"",
  "description": "Run existing hero test to check infrastructure",
  "timeout": 90000
}

🔧 Tool: Bash
Input: {
  "command": "find data -name \"settings*\" -type f",
  "description": "Find settings files"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/data/homepage/hero.yml"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/romanbartusiak/git/riomus/wesole_nutki/data/settings.yml"
}

🔧 Tool: Bash
Input: {
  "command": "npm run dev &gt; /dev/null 2&gt;&1 &amp; echo $!",
  "description": "Start dev server in background"
}

🔧 Tool: Bash
Input: {
  "command": "sleep 5 &amp;&amp; curl -s http://localhost:1313/pl/ | grep -o 'data-testid=\"hero-section\"' | head -1",
  "description": "Check if hero section is in rendered page",
  "timeout": 15000
}

🔧 Tool: Bash
Input: {
  "command": "grep \"\\.hero-section h1\" /Users/romanbartusiak/git/riomus/wesole_nutki/public/css/style.css | grep -v \"text-shadow\"",
  "description": "Verify h1 has no text-shadow"
}

🔧 Tool: Bash
Input: {
  "command": "grep \"\\.hero-section \\.lead\" /Users/romanbartusiak/git/riomus/wesole_nutki/public/css/style.css | grep \"color:#fff!important\"",
  "description": "Verify .lead has white color with important"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Remove text-shadow from .hero-section h1 in _custom.scss",
      "status": "completed",
      "activeForm": "Removing text-shadow from .hero-section h1"
    },
    {
      "content": "Remove text-shadow from .hero-section .lead in _custom.scss",
      "status": "completed",
      "activeForm": "Removing text-shadow from .hero-section .lead"
    },
    {
      "content": "Ensure .hero-section .lead text color is white",
      "status": "completed",
      "activeForm": "Ensuring .hero-section .lead text color is white"
    },
    {
      "content": "Rebuild CSS to apply changes",
      "status": "completed",
      "activeForm": "Rebuilding CSS"
    },
    {
      "content": "Create Playwright test to verify changes",
      "status": "completed",
      "activeForm": "Creating Playwright test"
    },
    {
      "content": "Verify CSS changes in built files",
      "status": "in_progress",
      "activeForm": "Verifying CSS changes in built files"
    },
    {
      "content": "Delete temporary test file",
      "status": "pending",
      "activeForm": "Deleting temporary test file"
    }
  ]
}

🔧 Tool: Bash
Input: {
  "command": "grep -A 2 \"\\.hero-section \\.lead\" /Users/romanbartusiak/git/riomus/wesole_nutki/public/css/style.css | grep \"color\"",
  "description": "Find color property in .hero-section .lead"
}

🔧 Tool: Bash
Input: {
  "command": "sed -n '/\\.hero-section \\.lead/,/}/p' /Users/romanbartusiak/git/riomus/wesole_nutki/public/css/style.css | head -15",
  "description": "Extract .hero-section .lead CSS block"
}

🔧 Tool: Bash
Input: {
  "command": "sed -n '/\\.hero-section h1/,/}/p' /Users/romanbartusiak/git/riomus/wesole_nutki/public/css/style.css | head -15",
  "description": "Extract .hero-section h1 CSS block"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Remove text-shadow from .hero-section h1 in _custom.scss",
      "status": "completed",
      "activeForm": "Removing text-shadow from .hero-section h1"
    },
    {
      "content": "Remove text-shadow from .hero-section .lead in _custom.scss",
      "status": "completed",
      "activeForm": "Removing text-shadow from .hero-section .lead"
    },
    {
      "content": "Ensure .hero-section .lead text color is white",
      "status": "completed",
      "activeForm": "Ensuring .hero-section .lead text color is white"
    },
    {
      "content": "Rebuild CSS to apply changes",
      "status": "completed",
      "activeForm": "Rebuilding CSS"
    },
    {
      "content": "Create Playwright test to verify changes",
      "status": "completed",
      "activeForm": "Creating Playwright test"
    },
    {
      "content": "Verify CSS changes in built files",
      "status": "completed",
      "activeForm": "Verifying CSS changes in built files"
    },
    {
      "content": "Delete temporary test file",
      "status": "in_progress",
      "activeForm": "Deleting temporary test file"
    }
  ]
}

🔧 Tool: Bash
Input: {
  "command": "rm /Users/romanbartusiak/git/riomus/wesole_nutki/tests/hero-text-shadow-verification.spec.ts",
  "description": "Delete temporary verification test file"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Remove text-shadow from .hero-section h1 in _custom.scss",
      "status": "completed",
      "activeForm": "Removing text-shadow from .hero-section h1"
    },
    {
      "content": "Remove text-shadow from .hero-section .lead in _custom.scss",
      "status": "completed",
      "activeForm": "Removing text-shadow from .hero-section .lead"
    },
    {
      "content": "Ensure .hero-section .lead text color is white",
      "status": "completed",
      "activeForm": "Ensuring .hero-section .lead text color is white"
    },
    {
      "content": "Rebuild CSS to apply changes",
      "status": "completed",
      "activeForm": "Rebuilding CSS"
    },
    {
      "content": "Create Playwright test to verify changes",
      "status": "completed",
      "activeForm": "Creating Playwright test"
    },
    {
      "content": "Verify CSS changes in built files",
      "status": "completed",
      "activeForm": "Verifying CSS changes in built files"
    },
    {
      "content": "Delete temporary test file",
      "status": "completed",
      "activeForm": "Deleting temporary test file"
    }
  ]
}
<summary>
## Summary: Remove Text Shadows from Hero Section and Update Text Colors

### Changes Implemented
- Removed `text-shadow` CSS property from `.hero-section h1` elements (was: `text-shadow: 0 2px 4px rgba(255, 255, 255, 0.8)`)
- Removed `text-shadow` CSS property from `.hero-section .lead` (paragraph) elements (was: `text-shadow: 0 2px 8px rgba(255, 255, 255, 0.9), 0 1px 3px rgba(255, 255, 255, 0.7)`)
- Explicitly set `.hero-section .lead` color to white (`#ffffff`) with `!important` flag to ensure it overrides other CSS rules
- Rebuilt the site to generate updated CSS files

### Files Modified
- `assets/scss/_custom.scss` - Updated `.hero-section` styles (lines 451-464)
  - Removed `text-shadow` from `h1` block
  - Removed `text-shadow` from `.lead` block
  - Added `color: #ffffff !important;` to `.lead` block

### Verification Status
- **CSS Verification**: Successfully verified changes in compiled CSS files at `/public/css/style.css`
  - `.hero-section h1` block contains NO `text-shadow` property ✅
  - `.hero-section .lead` block contains NO `text-shadow` property ✅
  - `.hero-section .lead` block contains `color: #ffffff !important;` ✅
- **Build Status**: Site successfully built with Hugo (no errors)
- **Playwright Testing**: Created temporary verification test to check CSS properties. Note: Test execution encountered pre-existing infrastructure issues with hero section rendering in the test environment (existing homepage tests also failing), but manual CSS verification confirms all changes are correctly implemented in the production build files.

### Notes for Developer
- Text shadow removal improves clean, modern typography in the hero section
- The `!important` flag was necessary because a global `.lead` utility class (at line 6002 in compiled CSS) was overriding the hero section's white color with dark gray
- Changes are isolated to the `.hero-section` scope and do not affect other page areas
- Text readability should be monitored on different background images, especially lighter backgrounds
- If readability issues arise, consider adjusting the `overlay_opacity` value in `/data/homepage/hero.yml` to darken the background overlay
</summary>