# BigaPizza — Per-User Defaults Plan & Kanban

## Goal

Enable each user to define **personal default settings** for (A) Pizza Dough and (B) Prep Schedule. New recipes start from these defaults; users can tweak per‑recipe without changing their saved defaults.

## Product Decisions

- **Two default buckets:**

  - **Dough Defaults** (e.g., numberOfPizzas, ballWeight, finalDoughHydrationPercent, finalDoughBigaPercent, saltPercent, maltPercent, yeastType, fermentation temps/durations affecting yeast calc).

  - **Schedule Defaults** (all fields from `defaultScheduleSettings`).

- **Single defaults set per user** for v1. (Future: multiple named profiles like "Home Oven", "Ooni Koda").

- **Precedence:** Recipe values > User defaults > App system defaults.

- **Create Flow:** When user clicks _New Recipe_, initial form state hydrates from user defaults.

- **Editing:** Per‑recipe changes do **not** modify user defaults unless user explicitly saves them in Settings.

- **Reset options:** Reset to system defaults (app‑level) or reset to last saved user defaults.

- **Optional one‑time apply:** Button to "Apply my defaults" to an existing recipe (writes values into that recipe only).

## Data Model (MongoDB)

**Collection:** `userDefaults`

```
{
  _id: ObjectId,
  userId: ObjectId, // unique index
  doughDefaults: {
    numberOfPizzas: 4,
    ballWeightGrams: 260,
    finalDoughHydrationPercent: 64,
    finalDoughBigaPercent: 45, // % of total flour in biga (min 40, max 100)
    bigaHydrationPercent: 45,
    bigaYeastPercentOfBigaFlour: 0.2,
    refreshYeastPercentOfRefreshFlour: 0.02,
    saltPercentOfTotalFlour: 2.7,
    maltPercentOfTotalFlour: 0, // optional
    yeastType: 'IDY', // 'IDY' | 'ADY' | 'FRESH'
    ambientTempC: 22, // optional
    bigaFermentationHours: 18, // optional
    doughFermentationHours: 24 // optional
  },
  scheduleDefaults: {
    // mirror constants/defaultScheduleSettings.js
    bigaPrepTimeMin: 15,
    bigaRisingTimeMin: 900, // 15h example
    autolyzeRefreshPrepMin: 15,
    autolyzeRefreshRestMin: 30,
    doughPrepTimeMin: 25,
    doughRisingTimeMin: 120,
    ballsPrepTimeMin: 15,
    ballsRisingTimeMin: 240,
    preheatOvenDurationMin: 60,
    toppingsPrepTimeMin: 30
  },
  version: 1,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

**Indexes** - `userId` unique. - `updatedAt` for housekeeping.

## Frontend UX (Dashboard Settings Tab)

**Location:** Dashboard → Settings (two tabs inside):

### Dough Defaults

- UI mirrors Step 5 layout.

- Hover min/max hints; YeastTypeToggleGroup + popover descriptions.

- Include `finalDoughBigaPercent` control (slider + numeric) with min 40, max 100.

- Buttons: _Reset to System_, _Save Defaults_. Dirty‑state guard.

### Schedule Defaults

- UI mirrors Step 6 layout with grouped `ScheduleInputGroup` components.

- Live timeline preview (non‑destructive) based on a sample baking time (e.g., tonight 19:00) to show effects.

- Buttons: _Reset to System_, _Save Defaults_.

**Create Recipe Flow** - On `CreateRecipe.jsx` mount: fetch defaults → initialize `formData` + `scheduleData`. - Show a chip: "Loaded from My Defaults" with a tooltip “changing values here won’t change your defaults”. - Button in any recipe: _Apply My Defaults_ (writes values into current form) — optional for v1 if initial load covers most cases.

## State & Logic

- **Context:** `DefaultsContext` holds fetched defaults and exposes `saveDefaults(part, data)` for `dough` or `schedule`.

- **Hydration:** On app load (after login), fetch once and cache in context; refetch after saves.

- **Computation:** When defaults are injected, call existing `calculateDough` and `scheduleCalculator` to update previews.

## Security & Edge Cases

- Server‑side validation of all numeric ranges.

- Sanitize strings (notes not part of defaults).

- Prevent `userId` spoofing (use session user only).

- Large numbers or negative durations → 400 with clear messages.

- Handle timezone (Europe/Berlin default) when showing sample timeline preview; allow manual TZ later per your enhancement plan.

## Migration Plan

1.  Create `userDefaults` collection + index.

2.  Seed new users with **system defaults** on first GET (lazy upsert) to keep UI simple.

3.  Add Settings tab UI (two subtabs).

4.  Wire Create Recipe to consume defaults for initial state.

5.  QA and telemetry: Log % of new recipes started from defaults.

## Future (v1.2+)

- Multiple named profiles with quick switch.

- Export/Import defaults as JSON.

- Per‑device overrides (mobile vs desktop prep timing).

- Share defaults template with friends.

## Field Naming & Structures (Proposed for Review)

### Naming rules

- Use clear prefixes: `biga*`, `refresh*`, `finalDough*`, `totals*`.

- Suffix with units when stored values are not percents: `*Grams`, `*Hours`, `*C`.

- Percent fields specify the reference base in the name: `*PercentOfTotalFlour`, `*PercentOfBigaFlour`, `*PercentOfRefreshFlour`.

### What belongs in user defaults vs per‑recipe

- **User defaults (inputs only):** store user preferences that seed new recipes. **Do not** store grams here.

- **Per‑recipe** `calculatedData`**:** store full grams breakdown for biga/refresh/final dough (used by Step 7). This preserves exact outputs when re‑opening a saved recipe.

### `doughDefaults` (v1 — inputs only)

```
{
  numberOfPizzas: number,
  ballWeightGrams: number,
  finalDoughHydrationPercent: number,
  finalDoughBigaPercent: number,           // % of total flour in biga (40–100)
  bigaHydrationPercent: number,
  yeastType: 'IDY' | 'ADY' | 'FRESH',
  bigaYeastPercentOfBigaFlour: number,
  refreshYeastPercentOfRefreshFlour: number,
  saltPercentOfTotalFlour: number,
  maltPercentOfTotalFlour: number,
  ambientTempC?: number,
  bigaFermentationHours?: number,
  doughFermentationHours?: number
}
```

### `calculatedData` (per recipe — full breakdown)

```
{
  meta: {
    doughBallCount: number,
    doughBallWeightGrams: number,
    totalDoughWeightGrams: number
  },

  biga: {
    bigaFlourGrams: number,
    bigaWaterGrams: number,
    bigaYeastGrams: number,
    bigaHydrationPercent: number,
    bigaYeastPercentOfBigaFlour: number
  },

  refresh: {
    refreshFlourGrams: number,
    refreshWaterGrams: number,
    refreshSaltGrams: number,
    refreshMaltGrams: number,
    refreshYeastGrams: number,
    refreshYeastPercentOfRefreshFlour: number,
    refreshHydrationPercent?: number
  },

  finalDough: {
    finalDoughBigaPercent: number,
    finalDoughFlourGrams: number,
    finalDoughWaterGrams: number,
    finalDoughSaltGrams: number,
    finalDoughMaltGrams: number,
    finalDoughYeastGrams: number,
    finalDoughHydrationPercent: number
  }
}
```

# Kanban Checklist

## 🧩 Backend

- [ ] `userDefaults` model & unique index on `userId`.

- [ ] Validation schema reusing `inputConfig` + `defaultScheduleSettings` + new `finalDoughBigaPercent` rule.

- [ ] `GET /api/user/defaults` (lazy create if not found with system defaults).

- [ ] `PUT /api/user/defaults` (upsert, field‑level validation errors).

- [ ] Auth middleware wired + tests.

## 🖥️ Frontend

- [ ] Dashboard → **Settings** page shell with tabs: _Dough Defaults_ | _Schedule Defaults_.

- [ ] Dough Defaults: add **finalDoughBigaPercent** control (slider + numeric) with min=40, max=100, step=1, tooltip help.

- [ ] Wire `finalDoughBigaPercent` into calculateDough and preview.

- [ ] Error states + inline validation for out‑of‑range values.

- [ ] **Schedule Defaults** form (mirror Step6) using `ScheduleInputGroup`.

- [ ] Live timeline preview (sample baking time) in Schedule tab.

- [ ] `DefaultsContext` (load, cache, update; optimistic save + rollback on error).

- [ ] CreateRecipe initializes from defaults; badge: "Loaded from My Defaults".

- [ ] Optional: button "Apply My Defaults" inside Recipe editor.

## 🧪 QA

- [ ] Validation: min/max and error banners per field.

- [ ] Dirty‑state guard on navigate/close.

- [ ] Mobile full‑screen sheet behavior.

- [ ] Timezone rendering correct for preview.

- [ ] Regression: editing a recipe does **not** mutate defaults.

## 🚀 Deploy & Docs

- [ ] Seed path for first‑time users (system defaults).

- [ ] Print‑friendly Kanban view (A4 portrait) via simple CSS print styles.

- [ ] README: note how to use Kanban (checklist in canvas + GitHub issues mapping).

# Workflow & Branching Plan (Git)

## Branching model

- **main** — always deployable. Protected branch.

- **develop** — integration branch for upcoming beta (optional; use if multiple streams overlap).

- **feature/\*** — one branch per task or tightly‑coupled task group (e.g., `feature/user-defaults-api`, `feature/settings-tabs-ui`).

- **fix/\*** — hotfixes off `main`.

## Rules

- Create issue → create matching branch (`feature/<issue-number>-slug`).

- Small, focused PRs (≤ 300 lines diff when possible).

- Require: lint passes, unit tests (if present), and manual QA checklist.

- Squash merge to keep history clean. Delete branches after merge.

## Suggested sequence (for this epic)

1.  `feature/user-defaults-model-api` → model, routes, validation.

2.  `feature/settings-tabs-ui` → settings shell with tabs.

3.  `feature/dough-defaults-finalDoughBigaPercent` → UI control + wiring + preview.

4.  `feature/schedule-defaults-ui` → schedule form + preview.

5.  `feature/create-from-defaults` → hydrate CreateRecipe from defaults.

6.  `feature/field-renames-migration` → refresh naming + migration script.

7.  `feature/qa-polish` → error states, mobile, docs.

## PR Template (checklist)

- [ ] Linked issue

- [ ] Screenshots / GIF (desktop + mobile)

- [ ] Validation cases covered (min/max, empty)

- [ ] i18n / labels reviewed

- [ ] Accessibility quick pass (labels, focus, keyboard)

- [ ] No console errors/warnings

## Using the Kanban

- Treat each **checkbox item** here as a corresponding **GitHub Issue**.

- As we finish tasks, tick them here _and_ close the GitHub issue.

- This doc is printable from any editor on iPad (Notes/Pages → Share → Print).
