# Automated Lighthouse and WCAG Audits

## Goal

Add repeatable local and GitHub Actions quality audits for the Wesołe Nutki site. The audits should drive the rendered site toward Lighthouse 100/100 and zero automated WCAG 2.2 A/AA violations without delaying or blocking the existing GitHub Pages deployment.

Local audit commands are strict and return a non-zero exit code when their requirements are not met. GitHub Actions always execute and preserve the same checks, but audit failures are informational: results remain visible and downloadable while deployment continues independently.

## Quality Bar

The target is the strongest practical automated baseline:

- Lighthouse performance: 100.
- Lighthouse accessibility: 100.
- Lighthouse best practices: 100.
- Lighthouse SEO: 100.
- Automated WCAG 2.2 A/AA: zero Axe violations on every audited route.

Lighthouse performance measurements have normal run-to-run variance, so collection uses three runs per URL. A score below 1.0 fails the strict local command and is recorded as a non-blocking failure in GitHub Actions. If a tool limitation makes a perfect score impossible, the exception must be documented with evidence rather than silently lowering the target.

Automated checks supplement, but do not claim to replace, keyboard, screen-reader, zoom, reflow, and visual accessibility review.

## Tooling

### Lighthouse CI

Use `@lhci/cli` with a repository-owned configuration file. It starts the local Hugo server, audits the rendered site in Chromium, saves local reports, and asserts category scores.

The Lighthouse route set covers the highest-value public journeys in both languages:

- `/pl/`
- `/en/`
- `/pl/contact/`
- `/en/contact/`
- `/pl/documents/`
- `/en/documents/`
- `/pl/documents/karta-zgloszenia/`
- `/en/documents/enrollment-form/`

The configuration uses desktop Lighthouse settings for stable conversion-page diagnostics and three runs per URL. Mobile layout and interaction remain covered by Playwright; a later field-performance workflow may add separate mobile budgets if production telemetry becomes available.

### Axe with Playwright

Use `@axe-core/playwright` inside a dedicated Playwright test suite. The suite scans the same Polish and English route matrix with WCAG 2.0, 2.1, and 2.2 A/AA rule tags enabled. Each test attaches its complete Axe result as JSON to the Playwright report and fails locally if any violation is present.

The scan analyzes the final rendered document after navigation and font readiness. Existing Playwright server configuration remains the source of truth for starting Hugo and for base-path behavior.

## Local Developer Interface

Add these package scripts:

- `audit:lighthouse`: synchronize translations and run strict Lighthouse CI assertions.
- `audit:wcag`: run the dedicated Chromium Axe suite with an HTML report.
- `audit:quality`: run Lighthouse and WCAG checks together.

Generated reports live under ignored local artifact directories. Audit source, configurations, and tests are committed; generated HTML and JSON reports are not.

Local commands intentionally fail when the quality bar is missed so they can be used to locate and fix regressions before pushing.

## GitHub Actions Architecture

Add a separate `.github/workflows/quality-audit.yml` workflow triggered by:

- pull requests,
- pushes to `master` or `main`,
- manual dispatch.

The workflow uses Node 20, the same Hugo version as deployment, npm's locked dependencies, and Playwright Chromium with its Linux dependencies.

Lighthouse and Axe run as distinct steps. Each audit step uses `continue-on-error: true`, followed by artifact upload under `if: always()`. A final job-summary step records whether each audit passed or found issues and gives the artifact names. The workflow itself remains informational and does not become a dependency of `.github/workflows/deploy.yml`.

Artifacts include:

- Lighthouse HTML/JSON reports and assertion output.
- Playwright HTML report, test results, and attached Axe JSON.

This structure ensures every requested audit executes and leaves evidence while a quality regression cannot prevent the Pages deployment.

## Test-Driven Implementation

Before adding the audit implementation, add a focused configuration contract test that initially fails because the expected scripts, dependencies, configuration, route matrix, and workflow do not exist. The test verifies:

- all three local npm commands,
- Lighthouse and Axe dependencies,
- strict 1.0 Lighthouse assertions,
- the bilingual route matrix,
- PR, push, and manual workflow triggers,
- non-blocking GitHub audit steps,
- unconditional artifact retention.

After the failing test is observed, implement the smallest configuration that satisfies it. Then run the real audits locally. Any site defect exposed by Lighthouse or Axe is fixed one root cause at a time, with a regression test when practical.

## Remediation Rules

Audit findings are fixed in the site rather than suppressed. Rule exclusions require a proven false positive and a nearby written explanation. Broad route, selector, or rule disabling is not acceptable.

Prioritize findings in this order:

1. WCAG violations and unusable interactions.
2. Broken content, network, security, or best-practice findings.
3. Largest Contentful Paint, layout shift, blocking assets, and image delivery.
4. Metadata and SEO findings.
5. Remaining score variance or diagnostics.

Changes must preserve the approved music-led design, bilingual routing, direct-call conversion path, responsive behavior, and reduced-motion support.

## Verification

Completion requires fresh evidence from:

- the audit configuration contract test,
- `npm run audit:lighthouse`,
- `npm run audit:wcag`,
- `npm run audit:quality`,
- the homepage conversion Playwright suite,
- the production Hugo build,
- validation of both GitHub workflow YAML files.

The final handoff reports exact local scores, violations, warnings, and any evidence-backed limitation. It must not describe a perfect result unless the command output shows it.

## Acceptance Criteria

- Developers can run one command locally to execute both strict audit systems.
- Lighthouse collects three runs for every agreed Polish and English route and targets 100 in all four categories.
- Axe checks every agreed route against applicable WCAG 2.2 A/AA rules and reports zero violations.
- GitHub Actions execute on pull requests, default-branch pushes, and manual dispatch.
- Audit failures never block or gate the existing GitHub Pages deployment.
- Lighthouse, Playwright, and Axe evidence is retained as GitHub artifacts even when an audit step fails.
- No broad audit suppression or unexplained threshold reduction is introduced.
- Existing conversion behavior, production build, and relevant Playwright tests remain healthy.
