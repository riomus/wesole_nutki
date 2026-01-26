# Role Key Mapping - English Translations

**⚠️ HISTORICAL REFERENCE**: This document describes the **legacy** `role_key` system that has been replaced with direct `role_pl` and `role_en` fields. See "Current Implementation" section below for the new approach.

~~This document provides a complete mapping of all `role_key` values used in the team configuration (`data/about/team.yml`) to their English translations from `data/translations/en/staff.yml`.~~

## Purpose

~~This mapping is used for:~~
- ~~Reference when adding new team members~~
- ~~Understanding the translation system~~
- Historical reference for the legacy role_key system
- Documentation for developers and content editors

**For current implementation**, see the "Current Implementation" section at the bottom of this document.

## Role Key to English Translation Mapping

| Role Key | English Translation | Category |
|----------|-------------------|----------|
| `staff_role_director` | Director | Leadership |
| `staff_role_teacher_squirrels` | Lead Teacher - Squirrels 🐿️ | Group Teachers |
| `staff_role_assistant_squirrels` | Teaching Assistant - Squirrels | Group Teachers |
| `staff_role_teacher_butterflies` | Lead Teacher - Butterflies 🦋 | Group Teachers |
| `staff_role_assistant_butterflies` | Teaching Assistant - Butterflies | Group Teachers |
| `staff_role_teacher_ladybugs` | Lead Teacher - Ladybugs 🐞 | Group Teachers |
| `staff_role_teacher_hedgehogs` | Lead Teacher - Hedgehogs 🦔 | Group Teachers |
| `staff_role_rhythmics` | Rhythmics Teacher | Additional Activity Teachers |
| `staff_role_gymnastics` | Gymnastics Teacher | Additional Activity Teachers |
| `staff_role_english` | English Language Teacher | Additional Activity Teachers |
| `staff_role_psychologist` | Psychologist | Psychological and Pedagogical Support |
| `staff_role_speech_therapist` | Speech Therapist | Psychological and Pedagogical Support |
| `staff_role_special_educator` | Special Education Teacher | Psychological and Pedagogical Support |
| `staff_role_cook` | Cook | Kitchen Staff |
| `staff_role_dietitian` | Psycho-Dietitian | Kitchen Staff |
| `staff_role_maintenance` | Maintenance Staff | Maintenance |

## Currently Used Role Keys

Based on the current team configuration in `data/about/team.yml`, the following role keys are actively in use:

### Group Teachers (Wychowawcy)
- **staff_role_teacher_squirrels** - Patrycja Gajzler
- **staff_role_assistant_squirrels** - Maja Kalinowska
- **staff_role_teacher_butterflies** - Paulina Milewska
- **staff_role_assistant_butterflies** - Anita Nowak
- **staff_role_teacher_ladybugs** - Halszka Szymaniak, Katarzyna Ścibór
- **staff_role_teacher_hedgehogs** - Kacper Rygałło

### Additional Activity Teachers
- **staff_role_rhythmics** - Anna Kierakowicz
- **staff_role_gymnastics** - Alma Eperlein
- **staff_role_english** - Inna

### Psychological and Pedagogical Support
- **staff_role_psychologist** - Karolina Zwolińska
- **staff_role_speech_therapist** - Joanna Dominik
- **staff_role_special_educator** - Anna Brodzisz

### Kitchen Staff
- **staff_role_cook** - Edyta Andrzejewska, Marta Pałubińska, Pani Ania
- **staff_role_dietitian** - Małgorzata Talaga-Duma

### Maintenance Staff
- **staff_role_maintenance** - Iwonka Brańska

## Available but Unused Role Keys

The following role key is defined in translations but not currently used in the team configuration:

- **staff_role_director** - Director

## Translation File Locations

- **English translations**: `data/translations/en/staff.yml`
- **Polish translations**: `data/translations/pl/staff.yml`
- **Team configuration**: `data/about/team.yml`

## How to Add a New Role

**⚠️ LEGACY APPROACH - NO LONGER USED**

~~If you need to add a new role type:~~

~~1. Add the translation key to both language files:~~
   ~~- `data/translations/en/staff.yml`~~
   ~~- `data/translations/pl/staff.yml`~~

~~2. Use the format `staff_role_[descriptive_name]`~~

~~3. Reference the new key in `data/about/team.yml` using the `role_key` field~~

**Current Approach** (see "Current Implementation" section below):
Simply add the role text directly in both languages using `role_pl` and `role_en` fields. No translation files needed!

## Notes

- ~~All role keys follow the naming convention: `staff_role_[description]`~~ **DEPRECATED**: The system now uses direct role fields (`role_pl` and `role_en`)
- Some roles include emoji for group identification (🐿️, 🦋, 🐞, 🦔)
- ~~The same role key can be used by multiple team members (e.g., `staff_role_cook`)~~ **DEPRECATED**
- ~~Role keys are used with Hugo's `i18n` function in the template: `{{ i18n .role_key }}`~~ **DEPRECATED**: Roles are now stored directly in `role_pl` and `role_en` fields
- The template now uses language-based selection: displays `role_pl` for Polish, `role_en` for English, with appropriate fallbacks
- This matches the same pattern used for biographies (`bio_pl` and `bio_en`)

## Current Implementation (As of 2026-01-26)

The team member data structure now uses direct role fields instead of role_key with i18n lookups:

```yaml
# Example team member in data/about/team.yml
- name: "Team Member Name"
  role_pl: "Stanowisko po polsku"
  role_en: "Role in English"
  bio_pl: "Biografia po polsku"
  bio_en: "Biography in English"
  image: /images/team/member.jpg
  weight: 1
  visible: true
```

The template (`layouts/partials/about/team.html`) automatically selects the appropriate role based on the current language:
- For Polish (`pl`): Uses `role_pl`, falls back to `role_en`
- For English (`en`): Uses `role_en`, falls back to `role_pl`
- For other languages: Uses `role_en`, falls back to `role_pl`
