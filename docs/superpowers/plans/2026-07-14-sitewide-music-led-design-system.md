# Site-wide Music-led Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every public page a cohesive, warm music-led design, correct Polish typography, and comprehensive automated Lighthouse/WCAG coverage.

**Architecture:** Add two shared presentation partials for editorial page intros and contact conversion, then refactor each Hugo template family to consume those primitives. Keep the existing content model, header, navigation, and data sources; centralize the visual system in a focused site-wide SCSS section and load one compact local Polish-safe heading font. Separate a three-run critical Lighthouse matrix from a broader template-family coverage matrix, while Axe checks every canonical content route.

**Tech Stack:** Hugo templates and resources, SCSS/Tailwind utilities, Node.js audit scripts, Playwright, Axe, Lighthouse CI.

---

## File map

- `layouts/partials/page-intro.html`: shared breadcrumb, eyebrow, title, summary, and optional action.
- `layouts/partials/contact-band.html`: shared direct-phone and email conversion band.
- `assets/scss/_sitewide.scss`: typography, editorial primitives, page-family skins, and responsive behavior.
- `assets/scss/main.scss`: imports the focused site-wide layer after existing styles.
- `static/fonts/bricolage-grotesque-pl.woff2`: compact static heading font with Polish and English glyphs.
- `static/fonts/OFL-Bricolage-Grotesque.txt`: font license.
- `layouts/**/*.html`: template-family structure and semantics.
- `scripts/generate-audit-routes.mjs`: derives canonical routes from `hugo list all` and maintains critical/coverage/full route lists.
- `audit/critical-routes.json`: three-run Lighthouse routes.
- `audit/coverage-routes.json`: one-run Lighthouse template coverage.
- `audit/all-routes.json`: full Axe content-route inventory.
- `lighthouserc.cjs` and `lighthouserc.coverage.cjs`: strict critical and broad coverage configurations.
- `tests/sitewide-design.spec.ts`: cross-template design, font, conversion, semantics, and responsive contracts.
- `tests/audits/wcag.spec.ts`: full canonical-route Axe coverage.

### Task 1: Lock the site-wide contracts and audit inventory

**Files:**
- Create: `tests/sitewide-design.spec.ts`
- Create: `scripts/generate-audit-routes.mjs`
- Create: `audit/critical-routes.json`
- Create: `audit/coverage-routes.json`
- Create: `audit/all-routes.json`
- Modify: `scripts/quality-audit-config.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Add failing page-family contracts**

Create a Playwright table covering `/pl/about/`, `/pl/programs/`, `/pl/programs/maluszki/`, `/pl/news/`, `/pl/2025/10/27/koncert/`, `/pl/gallery/`, `/pl/gallery/jesienny-festyn-2024/`, `/pl/documents/`, `/pl/documents/karta-zgloszenia/`, `/pl/contact/`, and `/pl/o-przedszkolu/cennik/`. For every route assert one visible `h1`, `.editorial-page-intro`, no horizontal overflow at 390 and 1440 pixels, and a visible phone link. Assert that heading computed font family contains `Bricolage Grotesque` and the Polish sample `Zażółć gęślą jaźń` has nonzero dimensions.

- [ ] **Step 2: Run the contracts and confirm RED**

Run: `npx playwright test tests/sitewide-design.spec.ts --project=chromium`

Expected: failures because the shared intro and Polish-safe heading font do not exist.

- [ ] **Step 3: Generate deterministic route inventories**

Implement `scripts/generate-audit-routes.mjs` using `spawnSync('hugo', ['list', 'all'])`, CSV parsing that preserves quoted fields, and `new URL(permalink).pathname` with the configured base path removed. Include all non-draft `page`, `section`, and `home` rows in `all-routes.json`; deduplicate and sort. Write the approved critical list explicitly and build coverage from one representative route per template family.

- [ ] **Step 4: Add route-generation scripts and contract assertions**

Add `audit:routes: "node scripts/generate-audit-routes.mjs"`. Prepend it to `audit:lighthouse`, `audit:wcag`, and `audit:quality`. Extend `scripts/quality-audit-config.test.mjs` to assert at least 40 full routes, both languages, every required family, and separate critical/coverage files.

- [ ] **Step 5: Run route contracts**

Run: `npm run audit:routes && node --test scripts/quality-audit-config.test.mjs`

Expected: route inventory assertions pass; visual contracts remain red.

- [ ] **Step 6: Commit**

Run: `git add tests/sitewide-design.spec.ts scripts/generate-audit-routes.mjs audit package.json scripts/quality-audit-config.test.mjs && git commit -m "test: specify site-wide design and audit coverage"`

### Task 2: Install Polish-safe heading typography

**Files:**
- Create: `static/fonts/bricolage-grotesque-pl.woff2`
- Create: `static/fonts/OFL-Bricolage-Grotesque.txt`
- Create: `assets/scss/_sitewide.scss`
- Modify: `assets/scss/main.scss`
- Modify: `tailwind.config.js`
- Modify: `assets/scss/_variables.scss`

- [ ] **Step 1: Produce the licensed static subset**

Use the official Bricolage Grotesque OFL variable source. Pin optical size and weight to the display setting, then subset to uppercase/lowercase Polish and English alphabets, digits, and site punctuation. Save a single WOFF2 file and the upstream OFL text. Verify with `file` and `shasum -a 256`.

- [ ] **Step 2: Add one local `@font-face`**

In `_sitewide.scss`, declare `Bricolage Grotesque` at weight 700 with `font-display: swap`, local WOFF2 source, and a metric-compatible fallback stack. Define `--font-display` and `--font-body` tokens and apply the display token to headings only.

- [ ] **Step 3: Import after legacy styles**

Import `_sitewide.scss` as the final SCSS layer so the new tokens and page primitives override legacy page-family styling without duplicating Bootstrap/Tailwind foundations.

- [ ] **Step 4: Update Tailwind and Sass font tokens**

Set `heading` to `['Bricolage Grotesque', 'Arial Narrow', 'system-ui', 'sans-serif']` and keep body on the native humanist stack.

- [ ] **Step 5: Run typography contract and Lighthouse probe**

Run: `npx playwright test tests/sitewide-design.spec.ts --project=chromium -g "Polish typography"`

Run: `npx lhci collect --url=http://127.0.0.1:1313/pl/ --numberOfRuns=1`

Expected: Polish typography passes; no layout shift; performance remains within one point before later optimization.

- [ ] **Step 6: Commit**

Run: `git add static/fonts assets/scss tailwind.config.js tests/sitewide-design.spec.ts && git commit -m "feat: add Polish-safe display typography"`

### Task 3: Build shared editorial primitives

**Files:**
- Create: `layouts/partials/page-intro.html`
- Create: `layouts/partials/contact-band.html`
- Modify: `data/translations/pl/global.yml`
- Modify: `data/translations/en/global.yml`
- Modify: `i18n/pl.toml`
- Modify: `i18n/en.toml`
- Modify: `assets/scss/_sitewide.scss`

- [ ] **Step 1: Add partial rendering contracts**

Extend `tests/sitewide-design.spec.ts` to assert the intro contains breadcrumb navigation inside its region, an eyebrow, the single `h1`, and an optional summary. Assert the contact band exposes visible phone and email values and uses language-appropriate accessible names.

- [ ] **Step 2: Run and confirm RED**

Run: `npx playwright test tests/sitewide-design.spec.ts --project=chromium -g "shared editorial"`

Expected: missing `.editorial-page-intro` and `.site-contact-band`.

- [ ] **Step 3: Implement `page-intro.html`**

Accept a dictionary with `context`, `eyebrow`, `summary`, `modifier`, and optional `actionHref`/`actionLabel`. Render the existing breadcrumb partial, one `h1`, summary content, and a decorative staff line marked `aria-hidden="true"`.

- [ ] **Step 4: Implement `contact-band.html`**

Resolve phone and email from `site.Data.settings.contact` with parameter fallbacks. Normalize `tel:` value, render phone as the primary action and email as the secondary action, and include a compact reassuring heading translated in both languages.

- [ ] **Step 5: Style primitives responsively**

Add asymmetric desktop grid, cream/paper bands, orange rule, lime notation mark, 65ch summary measure, 44px targets, focus-visible rings, and a single-column mobile layout.

- [ ] **Step 6: Sync translations and pass contracts**

Run: `npm run sync:translations && npx playwright test tests/sitewide-design.spec.ts --project=chromium -g "shared editorial"`

Expected: pass.

- [ ] **Step 7: Commit**

Run: `git add layouts/partials assets/scss/_sitewide.scss data/translations i18n && git commit -m "feat: add shared editorial page primitives"`

### Task 4: Align generic, About, and Contact pages

**Files:**
- Modify: `layouts/_default/list.html`
- Modify: `layouts/_default/single.html`
- Modify: `layouts/about/list.html`
- Modify: `layouts/partials/about/*.html`
- Modify: `layouts/contact/list.html`
- Modify: `assets/scss/_sitewide.scss`

- [ ] **Step 1: Add family-specific failing assertions**

Assert generic pages use `.editorial-reading-layout`, About has a real responsive image and no `.about-hero-overlay`, and Contact starts with `.contact-primary-actions` rather than four equal `.contact-card` elements.

- [ ] **Step 2: Run and confirm RED**

Run: `npx playwright test tests/sitewide-design.spec.ts --project=chromium -g "generic|About|Contact"`

- [ ] **Step 3: Refactor generic list/single templates**

Replace standalone breadcrumb/header blocks with `page-intro.html`, wrap content in the reading layout, preserve dates/tags/tables, and append `contact-band.html` outside legal/privacy pages only when appropriate.

- [ ] **Step 4: Refactor About composition**

Replace the illustrated overlay hero with the editorial intro plus real preschool photography from existing assets. Keep mission, values, team, facilities, and CTA data, but present them as alternating editorial sections and ruled evidence lists.

- [ ] **Step 5: Refactor Contact composition**

Lead with phone/email actions in a two-column block; move address/hours into a ruled details list; keep the map and directions; remove equal icon cards and generic gradient CTA.

- [ ] **Step 6: Style and verify at mobile/desktop widths**

Run: `npx playwright test tests/sitewide-design.spec.ts --project=chromium -g "generic|About|Contact"`

Expected: pass at 390 and 1440 pixels with no overflow.

- [ ] **Step 7: Commit**

Run: `git add layouts/_default layouts/about layouts/contact layouts/partials/about assets/scss/_sitewide.scss tests/sitewide-design.spec.ts && git commit -m "feat: align informational pages with music-led design"`

### Task 5: Align programs, news, taxonomies, galleries, and documents

**Files:**
- Modify: `layouts/programs/*.html`
- Modify: `layouts/news/*.html`
- Modify: `layouts/categories/*.html`
- Modify: `layouts/tags/*.html`
- Modify: `layouts/gallery/*.html`
- Modify: `layouts/gallery_categories/*.html`
- Modify: `layouts/documents/*.html`
- Modify: `layouts/partials/program-card.html`
- Modify: `layouts/partials/news-card.html`
- Modify: `layouts/partials/gallery-card.html`
- Modify: `assets/scss/_sitewide.scss`

- [ ] **Step 1: Add failing family contracts**

Assert each list/detail page uses the shared intro; program lists expose age-group rows; news cards have distinct accessible read-more names; gallery tiles are image-led; document lists use `.resource-list`; and detail pages expose the shared contact band where relevant.

- [ ] **Step 2: Run and confirm RED**

Run: `npx playwright test tests/sitewide-design.spec.ts --project=chromium -g "program|news|gallery|document|taxonomy"`

- [ ] **Step 3: Refactor program and schedule templates**

Use numbered age-path rows, preserve age/hours/group facts in a bordered rail, simplify activities and schedule lists, and append the contact band.

- [ ] **Step 4: Refactor news and taxonomy templates**

Use shared editorial intros and one listing primitive for news/categories/tags. Preserve filters and pagination. Make article media eager only when above the fold and keep related posts/social sharing semantic.

- [ ] **Step 5: Refactor gallery templates**

Use varied media tiles with stable ratios, deliberate missing-image placeholders, accessible album counts, and the existing conditional GLightbox behavior.

- [ ] **Step 6: Refactor document templates**

Replace card grids with grouped ruled resources, keep PDF download/view controls and metadata, and make the primary document action visually dominant.

- [ ] **Step 7: Run page-family contracts**

Run: `npx playwright test tests/sitewide-design.spec.ts --project=chromium`

Expected: all cross-template contracts pass.

- [ ] **Step 8: Commit**

Run: `git add layouts assets/scss/_sitewide.scss tests/sitewide-design.spec.ts && git commit -m "feat: unify public page families"`

### Task 6: Expand and enforce automated quality coverage

**Files:**
- Modify: `tests/audits/wcag.spec.ts`
- Modify: `playwright.audit.config.ts`
- Modify: `lighthouserc.cjs`
- Create: `lighthouserc.coverage.cjs`
- Modify: `.github/workflows/quality-audit.yml`
- Modify: `package.json`

- [ ] **Step 1: Point Axe at every canonical route**

Read `audit/all-routes.json`, keep full Axe JSON attachments, use the production-compressed audit server, and retain concise violation summaries.

- [ ] **Step 2: Split Lighthouse critical and coverage runs**

Keep `lighthouserc.cjs` at three runs and score 1.00 assertions for critical routes. Add a one-run coverage config for all representative template families with score 1.00 assertions initially; only lower a threshold when the report identifies an unavoidable Lighthouse variance and document the reason.

- [ ] **Step 3: Update local scripts and GitHub artifacts**

Add `audit:lighthouse:coverage` and include it in `audit:quality`. Run both jobs with `continue-on-error: true` in GitHub and upload separate critical, coverage, and Axe artifacts.

- [ ] **Step 4: Run the configuration contract**

Run: `node --test scripts/quality-audit-config.test.mjs`

Expected: all contracts pass.

- [ ] **Step 5: Commit**

Run: `git add audit tests/audits playwright.audit.config.ts lighthouserc*.cjs package.json .github/workflows/quality-audit.yml scripts && git commit -m "test: expand site-wide quality coverage"`

### Task 7: Audit, remediate, and verify

**Files:**
- Modify: any in-scope templates/styles/content identified by evidence.

- [ ] **Step 1: Run the full Axe inventory**

Run: `npm run audit:wcag`

Expected: zero automated WCAG A/AA violations across every canonical route. Fix contrast, names, semantics, focus, overflow, and target issues at the shared primitive before route-specific overrides.

- [ ] **Step 2: Run critical Lighthouse**

Run: `npm run audit:lighthouse`

Expected: every critical run scores 1.00 in performance, accessibility, best practices, and SEO.

- [ ] **Step 3: Run template coverage Lighthouse**

Run: `npm run audit:lighthouse:coverage`

Expected: every template-family route meets enforced scores with reports retained.

- [ ] **Step 4: Run build and current conversion tests**

Run: `npm run build && npx playwright test tests/homepage-redesign.spec.ts tests/sitewide-design.spec.ts --project=chromium`

Expected: production build succeeds with only the known missing English gallery-content warning; all current tests pass.

- [ ] **Step 5: Visually review desktop and mobile templates**

Capture and inspect PL and representative EN pages for every family at 1440x1000 and 390x844. Verify hierarchy, Polish glyph consistency, focus, menu operation, missing-image states, and absence of console errors.

- [ ] **Step 6: Run the combined local command**

Run: `npm run audit:quality`

Expected: exit 0; all strict Lighthouse assertions and Axe tests pass.

- [ ] **Step 7: Clean generated files and commit remediation**

Restore only known generated tracked outputs (`public`, `resources`, `hugo_stats.json`, Playwright reports) and leave the pre-existing untracked `.gitignore` untouched. Run `git diff --check`, stage exact source paths, and commit with `fix: resolve site-wide design audit findings`.

- [ ] **Step 8: Push master and verify remote SHA**

Run: `git push origin master && git ls-remote origin refs/heads/master && git rev-parse HEAD`

Expected: local and remote SHAs match.
