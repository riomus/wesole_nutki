# Site-wide music-led design system

## Goal

Bring every public page into the same warm, playful, trustworthy visual world as the conversion-focused homepage. The result must feel like a small language-and-music preschool rather than a municipal or corporate website, while remaining calm, readable, fast, and accessible for parents.

This specification proceeds without a separate approval round because the user explicitly requested autonomous execution and identified the desired direction: the previous, friendlier design; Polish-safe typography; and complete site-wide Lighthouse/WCAG coverage.

## Audiences and jobs

- Prospective parents need emotional reassurance, concrete program information, pricing, location, and an immediate phone or email path.
- Current families need schedules, documents, news, payments, and practical information without searching through promotional content.
- Both audiences use Polish first, with English parity on all principal templates.

## Problems observed

- The homepage and subpages use different visual languages.
- Subpages rely on centered corporate headings, repeated white cards, pale gradients, and generic icon grids.
- The About hero uses an unrelated purple illustration instead of the real preschool identity.
- Native rounded font fallbacks create inconsistent Polish diacritics and change by operating system.
- Important conversion actions are strong on the homepage but weak or inconsistent on subpages.
- Automated audits cover only eight routes, leaving major template families unrepresented.

## Approaches considered

### 1. Restore the previous homepage only

Fast, but it leaves the site visually fragmented and does not address the subpages. Rejected.

### 2. Apply a generic component theme to every page

Consistent, but would preserve the official, card-heavy feeling the user dislikes. Rejected.

### 3. Extend the music-led editorial system across every template

Recommended. Reuse the homepage palette and tactile editorial rhythm, replace generic wrappers with shared page primitives, and preserve functional page-specific layouts. This produces one recognizable brand without forcing every page into the same composition.

## Visual direction: a music notebook for families

The site should feel like a well-designed preschool notebook: warm cream paper, evergreen ink, burnt-orange annotations, lime highlights, fine staff-like rules, real classroom photography, and occasional musical marks. It should be playful through composition and detail, not through cartoon UI or excessive animation.

### Palette

- Cream paper remains the dominant background.
- Evergreen remains the primary ink and conversion color.
- Accessible burnt orange is used for emphasis, labels, and rules.
- Lime is reserved for highlights and small joyful moments.
- White panels are tinted toward paper and used only where they clarify grouping.

### Typography

- Headings use a locally hosted, static Bricolage Grotesque subset containing the complete Polish and English alphabets, punctuation, and digits used by the site.
- The heading subset uses one intentional bold weight to avoid multiple font requests and mismatched synthetic glyphs.
- Body copy uses the fast native humanist system stack already proven readable and performant.
- Headings use a tight display rhythm; body text stays at least 1rem with 1.6 line height and a 65–72 character reading measure.
- No remote font service, font preload race, or operating-system-dependent rounded fallback is allowed.

## Shared page primitives

### Editorial page intro

A reusable intro wraps the breadcrumb, short eyebrow, page title, optional summary, and optional contextual action. It is left-aligned and asymmetric, with a ruled or musical detail rather than a generic gradient banner.

### Content measure

Long-form content uses a generous reading column with intentional heading spacing, accessible link treatment, list rhythm, tables that scroll safely on small screens, and visible focus states.

### Information rail

Program facts, document actions, dates, tags, or contact details use a bordered paper rail. Rails are sticky only on desktop and become normal-flow blocks on small screens.

### Contact cadence

Every major page family ends with the same compact conversion band: direct phone first, email second, with language-appropriate labels and visible contact details.

### Listing rhythm

News, galleries, programs, and taxonomy pages use editorial rows or varied media tiles instead of identical shadow cards. Filters remain usable but become quiet, tactile chips with strong selected states.

## Page-family designs

### About

Replace the purple illustration with a real-photo editorial intro. Mission, values, team, and facilities use alternating paper bands, portrait/media compositions, and ruled lists. The page remains warm and evidence-led.

### Programs and schedule

The program index becomes an age-path overview with large numbered rows and a visible daily-rhythm preview. Program detail pages keep their useful fact rail but remove generic cards and icon clutter. Schedule layouts use a clear time axis with strong text hierarchy.

### News, articles, categories, and tags

The list intro and filters share the editorial system. Articles use a strong title/meta header, readable content measure, full-width real imagery where available, related content, and the shared contact band. Category and tag pages reuse the news listing primitive.

### Gallery and gallery categories

Gallery indexes use varied image-led tiles and clear album counts. Gallery detail pages use an editorial header followed by a responsive image grid. Missing images receive a deliberate paper placeholder rather than a technical-looking error panel.

### Documents

Document indexes become simple ruled resource lists grouped by purpose. Document detail pages make the primary PDF action unmistakable, preserve file metadata, and avoid nested cards.

### Contact

Phone and email become the visual lead. Address, hours, map, directions, and visit invitation follow in a two-column editorial composition. The four equal icon cards are removed.

### Generic content pages

Pricing, payments, recruitment, policies, standards, and daily-plan pages use the shared editorial intro and reading layout. Dense tables, legal copy, and schedules receive specialized responsive treatments without changing their content.

### Navigation, footer, 404, and taxonomies

Header and footer retain their functional structure but use the final typography and shared focus/spacing tokens. The 404 and taxonomy pages use the same page intro, contact recovery path, and warm paper language.

## Responsive behavior

- Desktop compositions may use asymmetric two-column layouts.
- At tablet widths, rails return to document flow before text becomes narrow.
- At mobile widths, titles remain expressive but do not dominate the full first screen; phone and email actions become full-width touch targets.
- Filters wrap without horizontal overflow; tables use labeled scroll regions; media keeps stable aspect ratios.
- No critical content or action is hidden on mobile.

## Accessibility requirements

- WCAG 2.2 A/AA automated rules pass on every canonical content route in Polish and English.
- Heading levels follow document structure; repeated links have distinct accessible names.
- Text, focus indicators, controls, badges, filters, and image captions meet contrast requirements.
- Touch targets are at least 44 by 44 CSS pixels where practical.
- Reduced-motion preference removes nonessential transitions.
- Maps and galleries retain keyboard-accessible alternatives and descriptive labels.

## Performance and audit strategy

- Keep remote fonts and public-page Netlify Identity scripts removed.
- Use one compact local heading font subset and the native body stack.
- Eager-load only the true above-the-fold image; all other media remains responsive and lazy.
- Keep gallery-only assets conditional.
- Expand the route inventory to cover every public template family and canonical content page.
- Run Axe across the full canonical route inventory.
- Run Lighthouse three times on critical conversion and high-frequency routes, plus at least one run for every remaining template family. Because LHCI has one run count per configuration, use separate critical and coverage configurations if needed.
- Enforce category score 1.00 for the critical matrix and retain reports for the broader coverage matrix; remediate every actionable failure.

## Verification

- Production Hugo build.
- Configuration contract tests.
- Current homepage conversion suite.
- Responsive overflow checks at 320, 390, 768, 1024, and 1440 pixels.
- Visual review of every template family in Polish and representative English pages.
- Full Axe canonical-route matrix.
- Critical Lighthouse matrix with three runs and perfect category assertions.
- Broader Lighthouse template-family coverage with retained reports and no category regressions.

## Scope boundaries

- Content facts and navigation architecture remain unchanged unless wording is required for clarity or accessibility.
- CMS/admin UI is not redesigned.
- The work does not add a form backend; phone and email remain the primary conversion paths.
