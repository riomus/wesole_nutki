[PLAN_GENERATED] Planning outline complete.

1.  **Goal**: Fix CMS Program Management visibility for existing English and Polish program pages.
2.  **Approach**: Add the missing `type: program` frontmatter field to all relevant program Markdown files in `content/pl/programs` and `content/en/programs`. This aligns the content with the CMS configuration filter.
3.  **Files to Touch**:
    -   `content/pl/programs/maluszki.md`, `sredniaki.md`, `starszaki.md`, `zerówka.md`
    -   `content/en/programs/kindergarten.md`, `pre-k.md`, `preschoolers.md`, `toddlers.md`
4.  **Tasks**:
    1.  Read all target program files to confirm current frontmatter.
    2.  Use `edit` tool to insert `type: program` into the frontmatter of each file.
    3.  Verify the changes by reading a sample file.
    4.  Create and run a temporary Playwright test to verify the files contain the expected metadata.
5.  **Risks**: Modifying frontmatter might affect Hugo's rendering if there are layouts strictly relying on specific types, but typically `type` is used for this exact purpose (selecting layouts or filtering). The `schedule.md` file should be excluded to avoid CMS schema conflicts.

I'll start by reading the remaining program files to ensure I have the correct context for editing. I've already read `maluszki.md` and `toddlers.md`.

Reading PL files: `sredniaki.md`, `starszaki.md`, `zerówka.md`
Reading EN files: `kindergarten.md`, `pre-k.md`, `preschoolers.md`<summary>
## Summary: Implement CMS Program Management for Multi-language Content

### Changes Implemented
- Added `type: "program"` to the frontmatter of all existing program files in both Polish and English.
- This ensures these files are correctly identified and displayed in the CMS admin interface, which filters by this field.
- Verified that the changes do not affect the frontend rendering of these pages.

### Files Modified
- `content/pl/programs/maluszki.md`
- `content/pl/programs/sredniaki.md`
- `content/pl/programs/starszaki.md`
- `content/pl/programs/zerówka.md`
- `content/en/programs/kindergarten.md`
- `content/en/programs/pre-k.md`
- `content/en/programs/preschoolers.md`
- `content/en/programs/toddlers.md`

### Notes for Developer
- The CMS configuration (`static/admin/config.yml`) uses `filter: {field: "type", value: "program"}` for the programs collection.
- Any future program files created manually (outside the CMS) must include `type: "program"` in the frontmatter to be visible in the admin panel.
- Files created via the CMS will automatically have this field set due to the `default: "program"` setting in the configuration.
</summary>

### Verification Status
- Verified with Playwright: Created a temporary test suite (`tests/verify_programs_cms.spec.ts`) that successfully loaded all modified program pages (both PL and EN) on the running Hugo server, confirming that the frontmatter changes maintained data integrity and frontend accessibility. The test passed with 24 checks (3 browsers * 8 pages).