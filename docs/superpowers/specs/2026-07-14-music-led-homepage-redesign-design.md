# Music-Led Homepage Redesign

## Goal

Redesign the Wesołe Nutki homepage into a distinctive, music-led experience that converts prospective parents into phone or email inquiries while preserving fast access to practical information for current families.

The canonical phone number is `71 343 18 99`. The implementation must work in Polish and English, at all supported base paths, without breaking existing content pages.

## Audience and Conversion Priority

The homepage serves two audiences:

1. Prospective parents comparing preschools in Wrocław. Their primary action is calling the preschool. Email is the secondary conversion.
2. Current families looking for schedules, documents, payments, and news. Their recurring tasks must remain visible through a clearly named parent-resources navigation group.

The first viewport must answer four questions without requiring scrolling:

- What is Wesołe Nutki?
- Where is it?
- What makes it different?
- How do I contact it now?

## Visual Direction

The approved direction is **rhythmic editorial**.

- Use deep evergreen and warm cream as dominant colors.
- Use warm orange for high-value accents and a brighter lime only for small decorative details.
- Do not use rainbow gradients, decorative glass effects, generic glow, or multiple competing accent colors.
- Use authentic preschool activity and music photographs already present in the repository.
- Introduce music through composition: staff-line patterns, rhythmic spacing, note-like markers, editorial cropping, and repeated beat motifs.
- Avoid literal clip-art instruments, oversized generic icons, and decorative music symbols that do not reinforce structure.
- Replace centered template sections with left-aligned and asymmetric compositions.
- Replace Poppins/Quicksand with a distinctive Polish-compatible display face and a highly readable body face. The intended pairing is Bricolage Grotesque for headings and Source Sans 3 for body copy, with `font-display: swap` and only required weights loaded.

## Page Architecture

### 1. Header

Desktop navigation contains no more than five top-level choices:

- O przedszkolu / About
- Oferta / Offer
- Dla rodziców / For parents
- Aktualności / News
- Kontakt / Contact

The parent group contains daily plan, weekly schedule, additional activities, pricing/payments, documents, and protection standards. Less-used links remain discoverable without occupying the top level.

The desktop utility bar shows the canonical phone, email, and address. At widths where labels would wrap, the interface switches to the mobile navigation before wrapping occurs.

The mobile header contains the logo, menu control, and a direct call control. Opening the full-screen menu preserves labeled navigation, large touch targets, focus management, Escape dismissal, and language switching.

### 2. Hero

Use a 60/40 asymmetric split on wide screens and a single-column composition on narrow screens.

Content:

- Eyebrow: location and preschool type.
- Headline: specific music-and-language promise rather than the business name repeated alone.
- Supporting copy: one concise sentence describing the child experience.
- Primary CTA: direct `tel:713431899`, visibly labeled with the phone number.
- Secondary CTA: direct email link.
- Tertiary link: learn about the preschool.
- Authentic music/activity photograph with descriptive alt text.

The hero background is calm and solid. Musical staff lines and beat markers may cross section boundaries as lightweight SVG or CSS decoration, but must be hidden from assistive technology.

### 3. Recruitment Notice

Replace the full-height pink gradient block with a compact, high-contrast editorial notice directly below the hero.

It includes:

- Current recruitment status and eligible year groups.
- A direct call action using the canonical number.
- A working enrollment-form page for the active language, with the external PDF offered from that page.
- A working documents link for the active language.

The section must not contain pulse or bounce animation. Missing optional documents must not produce a dead link; the phone action remains available as the recovery path.

### 4. Evidence-Led Differentiators

Replace the six identical feature cards with three editorial proof blocks:

1. Music every week: describe the actual music experience and connect it to authentic photography.
2. Language through daily use: explain how language learning appears in preschool life.
3. Small, attentive community: focus on care, safety, and teacher relationships without unverifiable superlatives.

Each block contains a concrete title, a concise explanation, and one supporting detail. Decorative icons are omitted unless the icon adds information.

### 5. Music Experience / About

Use an asymmetric photo-and-copy composition that makes the music-led identity tangible. This section links to the preschool story as a tertiary informational action, not as the main conversion.

### 6. Current-Family Shortcuts

Add a compact section titled `Dla rodziców` / `For parents` with four high-frequency destinations:

- Daily or weekly schedule.
- Additional activities.
- Payments or pricing.
- Documents.

These links remain visually secondary to the inquiry CTA but are reachable quickly on desktop and mobile.

### 7. Trust and Proof

Remove the decorative metric strip. Do not publish `100% satisfaction` or other unsupported totals.

Use verifiable trust signals instead:

- City-center location.
- Opening hours.
- Program focus.
- Authentic activity image or a parent quotation only when attribution exists in project content.

No invented testimonials, staff claims, ratios, awards, or statistics are permitted.

### 8. News

Display three recent, parent-relevant posts. Correct localized date formatting so the month is always present. Avoid prioritizing recruitment advertisements over current preschool activity unless the recruitment content is genuinely the newest item selected by an explicit editorial rule.

Images reserve their aspect ratio, use responsive sources where available, and load only when approaching the viewport. Image failure displays a stable, branded fallback without console warnings or layout shift.

### 9. Final CTA

End with a high-contrast, solid-color inquiry section.

- Primary action: call `71 343 18 99`.
- Secondary action: email the preschool.
- Supporting copy sets an expectation that parents can ask questions or arrange a visit.

No menu-index lookup is allowed for these actions.

### 10. Footer and Error Recovery

The footer uses the canonical contact details and groups links by audience. Heading levels follow semantic order.

The 404 page uses the active language and provides:

- A plain-language explanation.
- Link back to the homepage.
- Direct call and contact actions.
- Main navigation or a concise recovery group.

## Copy Direction

Copy must sound warm, specific, and confident. It should speak to a thoughtful parent who is evaluating care and educational quality, not to a child.

- Prefer specific actions: `Zadzwoń: 71 343 18 99` instead of `Skontaktuj się`.
- Avoid generic claims such as `najlepszy start`, `najwyższy poziom`, and `wyjątkowe miejsce` unless followed by evidence.
- Use consistent sentence case for buttons and labels.
- Polish and English versions must express the same promise and link to equivalent destinations.

## Interaction and Motion

- Use one restrained entrance sequence for hero content when motion is permitted.
- Use transform and opacity only.
- Remove pulse, bounce, and long staggered card reveals.
- All motion stops under `prefers-reduced-motion: reduce`, including smooth scrolling and counter-style animation.
- Hover states cannot be the only indication of interactivity.
- All controls have visible focus and active states.

## Responsive Behavior

- 320–767px: single column, direct-call control in the header, full-width conversion buttons, 44px minimum touch targets.
- 768–1119px: tablet navigation pattern; no wrapped desktop labels; two-column content only where it remains readable.
- 1120px and above: full navigation and asymmetric editorial compositions.
- At 200% zoom, content reflows without horizontal scrolling or clipped controls.
- Long Polish and English labels wrap naturally without fixed-width truncation.

## Accessibility and Color

- Normal text contrast is at least 4.5:1; large text and non-text controls are at least 3:1.
- Brand lime is decorative or paired with dark text; it is not used for small text on white.
- Decorative musical SVGs use `aria-hidden="true"` and `focusable="false"`.
- The page retains one `h1`, logical heading progression, landmarks, the skip link, and meaningful alt text.
- Color is never the only signal.
- Language switchers and expandable navigation expose state and accessible names.

## Routing and Data Rules

- Global settings are the single source of truth for phone, email, address, and opening hours.
- Homepage sections consume the global contact data unless an explicitly documented exception exists.
- CTA destinations use explicit URLs or stable identifiers, never positional menu indexes.
- The Polish documents destination is `/pl/documents/`; the English destination is `/en/documents/`.
- The Polish enrollment destination is `/pl/documents/karta-zgloszenia/`; the English destination is `/en/documents/enrollment-form/`. A direct download action is rendered only when its PDF URL has been verified; otherwise the homepage links to the local enrollment page.
- All same-origin homepage links must return a successful response or a deliberate redirect.

## Performance

- Do not add a JavaScript framework or animation library.
- Remove counter animation and unnecessary scroll observers from the homepage.
- Reserve image dimensions to prevent layout shift.
- Load only required font weights and preserve `preconnect`/`font-display` behavior.
- The homepage must produce no console errors or image-timeout warnings during normal browsing.
- Validate local Core Web Vitals before and after; local numbers are regression signals, not production field data.

## Testing Strategy

Implementation follows test-driven development.

Automated browser tests must cover:

- Canonical phone consistency across homepage, contact page, header, and footer.
- Direct-call primary CTA in both languages.
- Working enrollment and documents routes.
- Explicit final CTA destinations.
- Equivalent Polish and English destinations.
- No 404 response from any same-origin homepage action.
- Mobile call control and minimum touch target.
- Tablet navigation switching before labels wrap.
- Keyboard navigation, Escape-close menu, and visible focus.
- Reduced-motion behavior.
- Heading structure and decorative SVG semantics.
- Correct localized dates including month text.
- No horizontal overflow at 320px, 390px, 768px, 1024px, and 1440px.

Manual browser verification must include full-page screenshots at 390px, 1024px, and 1440px; the conversion path; the contact page; the 404 state; keyboard use; and reduced motion.

After implementation, run `/audit` and `/critique` again and compare the new scores with the baseline audit and critique.

## Acceptance Criteria

- Calling `71 343 18 99` is the unmistakable primary action within two seconds.
- All homepage conversion links work in Polish and English.
- No conflicting phone number remains in rendered content or source data.
- The design no longer exhibits the six-card grid, decorative metric strip, rainbow gradients, or bounce/pulse AI-template patterns.
- The homepage reads as music-led without sacrificing trust, readability, or conversion clarity.
- Current-family tasks are available through one clearly labeled group and a homepage shortcut section.
- WCAG AA contrast, keyboard, focus, semantic, and reduced-motion requirements pass the implemented checks.
- Navigation does not wrap at tablet widths.
- Normal browsing produces no console errors or warnings.
- Production build and relevant Playwright suites pass.
