# BigaPizza — Per-User Defaults Plan & Kanban

## Goal

Enable each user to define **personal default settings** for (A) Pizza Dough and (B) Prep Schedule. New recipes start from these defaults; users can tweak per‑recipe without changing their saved defaults.

## Product Decisions

- **Two default buckets:**
  - **Dough Defaults** (e.g., numberOfPizzas, ballWeight, doughHydrationPercent, doughBigaPercent, saltPercent, maltPercent, yeastType, fermentation temps/durations affecting yeast calc).
  - **Schedule Defaults** (all fields from `defaultScheduleSettings`).
- **Single defaults set per user** for v1. (Future: multiple named profiles like "Home Oven", "Ooni Koda").
- **Precedence:** Recipe values > User defaults > App system defaults.
- **Create Flow:** When user clicks _New Recipe_, initial form state hydrates from user defaults.
- **Editing:** Per‑recipe changes do **not** modify user defaults unless user explicitly saves them in Settings.
- **Reset options:** Reset to system defaults (app‑level) or reset to last saved user defaults.
- **Optional one‑time apply:** Button to "Apply my defaults" to an existing recipe (writes values into that recipe only).

## Data Model (MongoDB)

**Collection:** `userDefaults`

```js
{
  _id: ObjectId,
  userId: ObjectId, // unique index
  doughDefaults: {
    numberOfPizzas: 4,
    ballWeightGrams: 260,
    doughHydrationPercent: 64,
    doughBigaPercent: 45, // % of total flour in biga (min 40, max 100)
    bigaHydrationPercent: 45,
    bigaYeastPercentOfBigaFlour: 0.2,
    refreshYeastPercentOfRefreshFlour: 0.02,
    saltPercentOfTotalFlour: 2.7,
    maltPercentOfTotalFlour: 0, // optional
    yeastType: 'IDY', // 'IDY' | 'ADY' | 'FRESH'
    bigaFermentationHours: 18,
    bigaFermentationTempC: 18,
    doughFermentationHours: 24,
    doughFermentationTempC: 20
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

**Indexes**

- `userId` unique.
- `updatedAt` for housekeeping.

## Frontend UX (Dashboard Settings Tab)

**Location:** Dashboard → Settings (two tabs inside):

### Dough Defaults

- Form layout mirrors the display style used in `Step5RecipePreview.jsx` (GuidedInputFlow recipe preview).
- Hover min/max hints; YeastTypeToggleGroup + popover descriptions.
- Include `doughBigaPercent` control (slider + numeric) with min 40, max 100.
- Buttons: _Reset to System_, _Save Defaults_. Dirty‑state guard.

### Schedule Defaults

- Form layout mirrors the display style used in `Step6PrepSchedule.jsx` (GuidedInputFlow schedule preview).
- Live timeline preview (non‑destructive) based on a sample baking time (e.g., tonight 19:00) to show effects.
- Buttons: _Reset to System_, _Save Defaults_.

**Create Recipe Flow**

- On `CreateRecipe.jsx` mount: fetch defaults → initialize `formData` + `scheduleData`.
- Show a chip: "Loaded from My Defaults" with a tooltip “changing values here won’t change your defaults”.
- Button in any recipe: _Apply My Defaults_ (writes values into current form).

## State & Logic

- **Context:** `DefaultsContext` holds fetched defaults and exposes `saveDefaults(part, data)` for `dough` or `schedule`.
- **Hydration:** On app load (after login), fetch once and cache in context; refetch after saves.
- **Computation:** When defaults are injected, call existing `calculateDough` and `scheduleCalculator` to update previews.

## Security & Edge Cases

- Server‑side validation of all numeric ranges.
- Sanitize strings (notes not part of defaults).
- Prevent `userId` spoofing (use session user only).
- Large numbers or negative durations → 400 with clear messages.
- Handle timezone (Europe/Berlin default) when showing sample timeline preview; allow manual TZ later.

## Migration Plan

1. Create `userDefaults` collection + index.
2. Seed new users with **system defaults** on first GET (lazy upsert) to keep UI simple.
3. Add Settings tab UI (two subtabs).
4. Wire Create Recipe to consume defaults for initial state.
5. QA and telemetry: Log % of new recipes started from defaults.

## Future (v1.2+)

- Multiple named profiles with quick switch.
- Export/Import defaults as JSON.
- Per‑device overrides (mobile vs desktop prep timing).
- Share defaults template with friends.

## Field Naming & Structures (Proposed for Review)

### Naming rules

- Use clear prefixes: `biga*`, `refresh*`, `dough*`, `totals*`.
- Suffix with units when stored values are not percents: `*Grams`, `*Hours`, `*C`.
- Percent fields specify the reference base in the name: `*PercentOfTotalFlour`, `*PercentOfBigaFlour`, `*PercentOfRefreshFlour`.

### What belongs in user defaults vs per‑recipe

- **User defaults (inputs only):** store user preferences that seed new recipes. **Do not** store grams here.
- **Per‑recipe** `calculatedData`: store full grams breakdown for biga/refresh/dough (used by Step 7).

### `doughDefaults` (v1 — inputs only)

```js
{
  numberOfPizzas: number,
  ballWeightGrams: number,
  doughBigaPercent: number,
  doughHydrationPercent: number,
  bigaHydrationPercent: number,
  yeastType: 'IDY' | 'ADY' | 'FRESH',
  bigaYeastPercentOfBigaFlour: number,
  refreshYeastPercentOfRefreshFlour: number,
  saltPercentOfTotalFlour: number,
  maltPercentOfTotalFlour: number,
  bigaFermentationHours: number,
  bigaFermentationTempC: number,
  doughFermentationHours: number,
  doughFermentationTempC: number
}
```

### `calculatedData` (per recipe — full breakdown)

```js
{
  meta: {
    doughBallCount: number,
    doughBallWeightGrams: number,
    totalDoughWeightGrams: number,
    ambientTempC: number,
    ambientTempSource: 'manual' | 'weather',
    ambientTempRecordedAt: string
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
    refreshHydrationPercent: number
  },
  dough: {
    doughBigaPercent: number,
    doughFlourGrams: number,
    doughWaterGrams: number,
    doughSaltGrams: number,
    doughMaltGrams: number,
    doughYeastGrams: number,
    doughHydrationPercent: number
  }
}
```

# Kanban Checklist

## 🧩 Backend

- [ ] `userDefaults` model & unique index on `userId`.
- [ ] Validation schema reusing `inputConfig` + `defaultScheduleSettings` + fermentation hours/temps + new `doughBigaPercent` rule.
- [ ] `GET /api/user/defaults` (lazy create if not found with system defaults).
- [ ] `PUT /api/user/defaults` (upsert, field‑level validation errors).
- [ ] Auth middleware wired + tests.

## 🖥️ Frontend

- [ ] Dashboard → **Settings** page shell with tabs: _Dough Defaults_ | _Schedule Defaults_.
- [ ] Dough Defaults: add **doughBigaPercent** control (slider + numeric) with min=40, max=100, step=1, tooltip help.
- [ ] Wire `doughBigaPercent` into calculateDough and preview.
- [ ] Error states + inline validation for out‑of‑range values.
- [ ] **Schedule Defaults** form (mirror Step6) using `ScheduleInputGroup`.
- [ ] Live timeline preview (sample baking time) in Schedule tab.
- [ ] `DefaultsContext` (load, cache, update; optimistic save + rollback on error).
- [ ] CreateRecipe initializes from defaults; badge: "Loaded from My Defaults".
- [ ] Integration: Ensure Create/Edit Recipe modals can hydrate from user defaults or saved recipe.

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
