# Music-Led Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the bilingual Wesołe Nutki homepage around a direct call conversion, a distinctive rhythmic-editorial identity, and fast current-family access while fixing broken routes, accessibility, responsiveness, and image behavior.

**Architecture:** Keep Hugo’s data-driven partial structure. Add focused homepage partials for parent shortcuts and trust, make global settings the contact source of truth, replace positional menu CTA lookup with explicit stable URLs, and consolidate the visual redesign in the existing SCSS token layer. Playwright tests exercise rendered behavior before each production change.

**Tech Stack:** Hugo 0.154 Extended, Go templates, YAML data, Tailwind 3/PostCSS/SCSS, vanilla JavaScript, Playwright.

---

### Task 1: Pin conversion and routing behavior with failing tests

**Files:**
- Create: `tests/homepage-redesign.spec.ts`
- Modify: `tests/homepage.spec.ts`
- Modify: `tests/internal-navigation-links.spec.ts`

- [ ] **Step 1: Write failing conversion tests**

Add tests that require the primary hero CTA to be a direct telephone link, require `71 343 18 99` everywhere, require language-specific enrollment/documents links, and request every same-origin homepage link:

```ts
import { test, expect } from '@playwright/test';

const languages = [
  { lang: 'pl', enrollment: '/pl/documents/karta-zgloszenia/', documents: '/pl/documents/' },
  { lang: 'en', enrollment: '/en/documents/enrollment-form/', documents: '/en/documents/' },
];

for (const locale of languages) {
  test(`${locale.lang} homepage uses the canonical direct-call conversion`, async ({ page }) => {
    await page.goto(`/${locale.lang}/`);
    await expect(page.getByTestId('hero-primary-call')).toHaveAttribute('href', 'tel:713431899');
    await expect(page.getByTestId('hero-primary-call')).toContainText('71 343 18 99');
    await expect(page.getByTestId('enrollment-link')).toHaveAttribute('href', locale.enrollment);
    await expect(page.getByTestId('documents-page-link')).toHaveAttribute('href', locale.documents);
    await expect(page.getByTestId('final-primary-call')).toHaveAttribute('href', 'tel:713431899');
  });
}

test('all same-origin Polish homepage links resolve', async ({ page, request }) => {
  await page.goto('/pl/');
  const hrefs = await page.locator('a[href]').evaluateAll((links) =>
    [...new Set(links.map((link) => (link as HTMLAnchorElement).href))]
      .filter((href) => href.startsWith(location.origin))
  );
  for (const href of hrefs) {
    const response = await request.get(href);
    expect(response.status(), href).toBeLessThan(400);
  }
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npx playwright test tests/homepage-redesign.spec.ts --project=chromium`

Expected: FAIL because `hero-primary-call` does not exist, old numbers remain, and current enrollment/final CTA URLs return 404.

- [ ] **Step 3: Update stale homepage assertions to the approved behavior**

Replace legacy expectations for six feature cards, generic hero copy, and contact-page hero navigation with expectations for three proof items, music-led copy, and direct call/email actions. Do not weaken route assertions.

- [ ] **Step 4: Commit the red tests**

```bash
git add tests/homepage-redesign.spec.ts tests/homepage.spec.ts tests/internal-navigation-links.spec.ts
git commit -m "test: specify music-led homepage conversion"
```

### Task 2: Establish canonical contact data and working destinations

**Files:**
- Modify: `data/settings.yml`
- Modify: `data/homepage/recruitment.yml`
- Modify: `data/homepage/hero.yml`
- Modify: `data/homepage/cta.yml`
- Modify: `content/pl/contact/_index.md`
- Modify: `content/en/contact/_index.md`
- Modify: `content/en/recruitment.md`
- Modify: `hugo.toml`
- Modify: `layouts/partials/homepage/hero.html`
- Modify: `layouts/partials/homepage/recruitment.html`
- Modify: `layouts/partials/homepage/cta.html`

- [ ] **Step 1: Make global settings authoritative**

Set the global phone to `71 343 18 99` and remove section-local contact overrides. Hero and final CTA templates read `site.Data.settings.contact` and render explicit `tel:` and `mailto:` actions:

```go-html-template
{{- $contact := site.Data.settings.contact -}}
<a href="tel:{{ $contact.phone | replaceRE `[^0-9+]` `` }}"
   class="btn btn-primary"
   data-testid="hero-primary-call">
  {{ i18n "call_us" }} {{ $contact.phone }}
</a>
```

- [ ] **Step 2: Replace broken recruitment routes**

Use language-aware stable destinations:

```go-html-template
{{- $enrollmentURL := cond (eq .Lang "pl") "/pl/documents/karta-zgloszenia/" "/en/documents/enrollment-form/" -}}
{{- $documentsURL := cond (eq .Lang "pl") "/pl/documents/" "/en/documents/" -}}
```

Render the enrollment action without `download`; the local page owns the verified external PDF.

- [ ] **Step 3: Remove positional CTA lookup**

Replace `url_menu_index` with explicit `tel:` and `mailto:` actions sourced from global settings.

- [ ] **Step 4: Verify GREEN for conversion routes**

Run: `npx playwright test tests/homepage-redesign.spec.ts --project=chromium --grep "canonical|resolve"`

Expected: PASS.

- [ ] **Step 5: Commit canonical contact changes**

```bash
git add data/settings.yml data/homepage/{hero,recruitment,cta}.yml content/pl/contact/_index.md content/en/contact/_index.md content/en/recruitment.md hugo.toml layouts/partials/homepage/{hero,recruitment,cta}.html
git commit -m "fix: unify homepage contact conversion"
```

### Task 3: Replace template sections with evidence and parent shortcuts

**Files:**
- Modify: `layouts/index.html`
- Modify: `layouts/partials/homepage/features.html`
- Modify: `layouts/partials/homepage/about.html`
- Create: `layouts/partials/homepage/parent-shortcuts.html`
- Create: `layouts/partials/homepage/trust.html`
- Modify: `data/homepage/features.yml`
- Create: `data/homepage/parents.yml`
- Create: `data/homepage/trust.yml`
- Modify: `data/settings.yml`
- Modify: `data/translations/pl/homepage.yml`
- Modify: `data/translations/en/homepage.yml`

- [ ] **Step 1: Add failing structure tests**

Require three `.proof-item` elements, no `.counter-section`, four parent shortcut links, and authentic music copy in both languages:

```ts
test('homepage uses evidence instead of template metrics', async ({ page }) => {
  await page.goto('/pl/');
  await expect(page.locator('.proof-item')).toHaveCount(3);
  await expect(page.locator('.counter-section')).toHaveCount(0);
  await expect(page.locator('.parent-shortcut')).toHaveCount(4);
  await expect(page.locator('#music-experience')).toContainText(/muzyk/i);
});
```

- [ ] **Step 2: Verify structure test RED**

Run: `npx playwright test tests/homepage-redesign.spec.ts --project=chromium --grep "evidence"`

Expected: FAIL because the old six-card grid and metric strip are still rendered.

- [ ] **Step 3: Implement the new section flow**

Order homepage partials as hero, compact recruitment, proof, music experience, parent shortcuts, trust, news, final CTA. Disable stats in `data/settings.yml` and remove its partial call from the homepage.

Proof data contains exactly three evidence-led items. Parent shortcut data contains explicit locale-aware URLs for schedule, additional activities, payments/pricing, and documents. Trust data contains only verifiable location, hours, and program focus.

- [ ] **Step 4: Verify structure test GREEN**

Run: `npx playwright test tests/homepage-redesign.spec.ts --project=chromium --grep "evidence"`

Expected: PASS.

- [ ] **Step 5: Commit content architecture**

```bash
git add layouts/index.html layouts/partials/homepage data/homepage data/settings.yml data/translations/{pl,en}/homepage.yml
git commit -m "feat: rebuild homepage around music and parent needs"
```

### Task 4: Consolidate navigation and responsive behavior

**Files:**
- Modify: `data/menus/main_pl.yml`
- Modify: `data/menus/main_en.yml`
- Modify: `data/translations/pl/navigation.yml`
- Modify: `data/translations/en/navigation.yml`
- Modify: `layouts/partials/header.html`
- Modify: `layouts/partials/footer.html`
- Modify: `assets/js/main.js`
- Modify: `assets/scss/_custom.scss`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Add failing responsive navigation tests**

```ts
for (const width of [320, 390, 768, 1024, 1440]) {
  test(`homepage has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/pl/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test('tablet switches before desktop labels wrap', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/pl/');
  await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();
});

test('mobile exposes a direct call control', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/pl/');
  const call = page.getByTestId('mobile-call');
  await expect(call).toHaveAttribute('href', 'tel:713431899');
  const box = await call.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
});
```

- [ ] **Step 2: Verify responsive tests RED**

Run: `npx playwright test tests/homepage-redesign.spec.ts --project=chromium --grep "overflow|tablet|mobile exposes"`

Expected: FAIL because desktop navigation remains active at 1024px and no mobile call control exists.

- [ ] **Step 3: Implement five-group navigation**

Create top-level About, Offer, For parents, News, and Contact groups. Put schedules, payments/pricing, documents, and standards under For parents. Preserve all existing destinations through children or footer links.

- [ ] **Step 4: Switch the navigation breakpoint to 1120px**

Use `lg: 1120px` in Tailwind configuration and matching SCSS media queries. Header markup renders the direct mobile call action and maintains full-screen menu focus/Escape behavior.

- [ ] **Step 5: Verify responsive tests GREEN**

Run: `npx playwright test tests/homepage-redesign.spec.ts tests/responsive.spec.ts --project=chromium --grep "overflow|tablet|mobile|menu"`

Expected: PASS.

- [ ] **Step 6: Commit navigation adaptation**

```bash
git add data/menus data/translations/{pl,en}/navigation.yml layouts/partials/{header,footer}.html assets/js/main.js assets/scss/_custom.scss tailwind.config.js
git commit -m "feat: streamline responsive parent navigation"
```

### Task 5: Build the rhythmic-editorial design system

**Files:**
- Modify: `assets/scss/_variables.scss`
- Modify: `assets/scss/_custom.scss`
- Modify: `tailwind.config.js`
- Modify: `layouts/partials/head.html`
- Modify: `layouts/partials/homepage/hero.html`
- Modify: `layouts/partials/homepage/recruitment.html`
- Modify: `layouts/partials/homepage/about.html`
- Modify: `layouts/partials/homepage/news.html`
- Modify: `layouts/partials/homepage/cta.html`

- [ ] **Step 1: Add failing anti-template and contrast tests**

Require the old feature cards, counter section, pulsing badge, and bouncing CTA to be absent. Compute contrast for primary button text/background and require at least 4.5:1.

```ts
test('primary conversion meets WCAG AA contrast', async ({ page }) => {
  await page.goto('/pl/');
  const colors = await page.getByTestId('hero-primary-call').evaluate((element) => {
    const style = getComputedStyle(element);
    return { foreground: style.color, background: style.backgroundColor };
  });
  expect(contrastRatio(colors.foreground, colors.background)).toBeGreaterThanOrEqual(4.5);
});
```

Define the test helper in the same file:

```ts
function contrastRatio(foreground: string, background: string): number {
  const parse = (color: string) => color.match(/[\d.]+/g)!.slice(0, 3).map(Number);
  const luminance = (color: string) => {
    const [r, g, b] = parse(color).map((value) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
```

- [ ] **Step 2: Verify design tests RED**

Run: `npx playwright test tests/homepage-redesign.spec.ts --project=chromium --grep "template|contrast"`

Expected: FAIL because old template patterns and low-contrast brand green remain.

- [ ] **Step 3: Replace visual tokens and fonts**

Use evergreen `#183f35`, cream `#fff8ea`, orange `#b84f22`, ink `#172b27`, muted evergreen `#577068`, and decorative lime `#b6dd55`. Load Bricolage Grotesque weights 500–800 and Source Sans 3 weights 400–700 with `display=swap`.

- [ ] **Step 4: Implement rhythmic compositions**

Use asymmetric hero and editorial sections, authentic music imagery, staff-line decoration marked `aria-hidden`, solid backgrounds, restrained borders, and a varied spacing scale. Remove generic shadows, multicolor gradients, pill badges, and identical card styling.

- [ ] **Step 5: Verify design tests GREEN**

Run: `npx playwright test tests/homepage-redesign.spec.ts --project=chromium --grep "template|contrast"`

Expected: PASS.

- [ ] **Step 6: Commit the visual system**

```bash
git add assets/scss assets/js/main.js tailwind.config.js layouts/partials/head.html layouts/partials/homepage
git commit -m "style: establish rhythmic editorial identity"
```

### Task 6: Harden accessibility, motion, dates, images, and 404 recovery

**Files:**
- Modify: `assets/js/main.js`
- Modify: `assets/scss/_custom.scss`
- Modify: `layouts/partials/news-card.html`
- Modify: `layouts/partials/format-date.html`
- Modify: `layouts/404.html`
- Modify: `data/translations/pl/errors.yml`
- Modify: `data/translations/en/errors.yml`
- Modify: `layouts/partials/icons/feature-icon.html`
- Modify: `layouts/partials/icons/stats-icon.html`

- [ ] **Step 1: Add failing resilience tests**

```ts
test('reduced motion removes decorative animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/pl/');
  const animations = await page.locator('body').evaluate(() =>
    Array.from(document.querySelectorAll('*')).filter((el) => {
      const style = getComputedStyle(el);
      return style.animationName !== 'none' && style.animationDuration !== '0s';
    }).length
  );
  expect(animations).toBe(0);
});

test('Polish news dates include a month', async ({ page }) => {
  await page.goto('/pl/');
  await expect(page.locator('article time').first()).toContainText(/[A-Za-ząćęłńóśźż]{3,}/i);
});

test('404 offers recovery in the active language', async ({ page }) => {
  const response = await page.goto('/pl/nie-istnieje/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('link', { name: /strona główna/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /71 343 18 99/ })).toHaveAttribute('href', 'tel:713431899');
});
```

- [ ] **Step 2: Verify resilience tests RED**

Run: `npx playwright test tests/homepage-redesign.spec.ts --project=chromium --grep "reduced motion|dates|404"`

Expected: FAIL because motion remains, Polish dates omit the month, and 404 recovery is absent.

- [ ] **Step 3: Implement resilience fixes**

Remove homepage counters and generic scroll observer initialization. Add a global reduced-motion override, ensure decorative SVGs are hidden, make localized month formatting explicit, reserve news image aspect ratios, and remove premature image timeout warnings.

- [ ] **Step 4: Build bilingual 404 recovery**

Render localized heading, explanation, homepage, phone, and email actions using global settings and language-aware paths.

- [ ] **Step 5: Verify resilience tests GREEN**

Run: `npx playwright test tests/homepage-redesign.spec.ts --project=chromium --grep "reduced motion|dates|404"`

Expected: PASS.

- [ ] **Step 6: Commit hardening**

```bash
git add assets/js/main.js assets/scss/_custom.scss layouts/404.html layouts/partials data/translations/{pl,en}/errors.yml
git commit -m "fix: harden homepage accessibility and recovery"
```

### Task 7: Full verification, browser audit, critique, and polish

**Files:**
- Modify: `assets/scss/_custom.scss`
- Modify: `assets/js/main.js`
- Modify: `layouts/partials/homepage/hero.html`
- Modify: `layouts/partials/homepage/recruitment.html`
- Modify: `layouts/partials/homepage/features.html`
- Modify: `layouts/partials/homepage/about.html`
- Modify: `layouts/partials/homepage/parent-shortcuts.html`
- Modify: `layouts/partials/homepage/trust.html`
- Modify: `layouts/partials/homepage/news.html`
- Modify: `layouts/partials/homepage/cta.html`
- Modify: `tests/homepage-redesign.spec.ts`

- [ ] **Step 1: Run focused Chromium suites**

Run: `npx playwright test tests/homepage-redesign.spec.ts tests/homepage.spec.ts tests/responsive.spec.ts tests/internal-navigation-links.spec.ts --project=chromium`

Expected: PASS with zero failures.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: exit 0 with no new missing-resource errors.

- [ ] **Step 3: Run the full Playwright suite**

Run: `npm test`

Expected: all configured browser projects pass. Pre-existing failures, if any, are documented with exact test names and logs rather than hidden.

- [ ] **Step 4: Inspect rendered page with agent-browser**

Capture and inspect 390×844, 1024×768, and 1440×1000 screenshots; test menu Escape, keyboard focus, reduced motion, Polish/English routes, contact conversion, 404 recovery, console output, and Core Web Vitals.

- [ ] **Step 5: Re-run audit and critique scoring**

Apply the `audit` and `critique` skills to the rendered page. Fix any P0/P1 regression and repeat focused verification.

- [ ] **Step 6: Polish details**

Verify alignment, spacing rhythm, typographic hierarchy, hover/focus/active states, 44px touch targets, 200% zoom, contrast, image aspect ratios, bilingual copy parity, no horizontal overflow, and no console warnings.

- [ ] **Step 7: Commit final polish**

```bash
git add assets data content layouts tests tailwind.config.js
git commit -m "fix: polish and verify music-led homepage"
```
