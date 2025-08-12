# Variables & Data Model Reference

> Status: **WIP**. This doc is the single source of truth for names, units, and shapes. Update it whenever we add/rename fields.

## 1) Core state (React Context)

### `formData`

User inputs that affect dough math.

| Key               | Type                        | Unit                 | Notes                        |
| ----------------- | --------------------------- | -------------------- | ---------------------------- |
| `numPizzas`       | number                      | count                | total pizzas                 |
| `ballWeight`      | number                      | grams                | per ball                     |
| `bigaHydration`   | number                      | %                    | % water of biga flour        |
| `finalHydration`  | number                      | %                    | total dough hydration        |
| `bigaPercent`     | number                      | %                    | fraction of flour in biga    |
| `saltPercent`     | number                      | % of **total flour** | added in refresh             |
| `maltPercent`     | number                      | % of **total flour** | optional; refresh            |
| `bigaTime`        | number                      | hours                | biga ferment duration        |
| `bigaTemp`        | number                      | °C                   | biga ferment temp            |
| `doughTime`       | number                      | hours                | final dough ferment duration |
| `doughTemp`       | number                      | °C                   | final dough ferment temp     |
| `yeastType`       | `"idy" \| "ady" \| "fresh"` | —                    | lowercase in UI              |
| `shortCorrection` | number                      | factor               | used when ≤ ~12h             |
| `longCorrection`  | number                      | factor               | used when ≥ ~12h             |

> ❗ **Do not** put `bakingDateTime` here (moved to `scheduleData`).

---

### `scheduleData`

Timing knobs & the target bake moment.

| Key                   | Type                        | Unit       | Notes                     |
| --------------------- | --------------------------- | ---------- | ------------------------- |
| `bakingDateTime`      | string (`YYYY-MM-DDTHH:mm`) | local time | timeline anchor           |
| `bigaPrepTime`        | number                      | minutes    | prep (mix) biga           |
| `bigaRisingTime`      | number                      | **hours**  | bulk rise of biga         |
| `autolyzeRefreshPrep` | number                      | minutes    | mix flour+water (refresh) |
| `autolyzeRefreshRest` | number                      | minutes    | autolyze rest             |
| `doughPrepTime`       | number                      | minutes    | mix final dough           |
| `doughRisingTime`     | number                      | **hours**  | final dough rise          |
| `ballsPrepTime`       | number                      | minutes    | divide/ball               |
| `ballsRisingTime`     | number                      | **hours**  | balled proof              |
| `preheatOvenDuration` | number                      | minutes    | preheat before bake       |
| `toppingsPrepTime`    | number                      | minutes    | topping prep window       |

> Units matter: rising times are **hours**, everything else is **minutes**.

---

### `calculatedData`

Built for previews and saved with the recipe.

```ts
type CalculatedData = {
  ingredients: {
    biga: { flour: number; water: number; yeast: number; total: number };
    refresh: {
      flour: number;
      water: number;
      yeast: number;
      salt: number;
      malt: number;
      total: number;
    };
  };
  timelineSteps: Array<{
    label: string;
    time: string | null; // human-readable via formatScheduleTime
    description?: string;
  }>;
};
```

---

## 2) Derived objects (helpers)

### `calculateDough(formData)`

Returns intermediate dough math, e.g.:

- `bigaFlour`, `bigaWater`, `bigaYeast`
- `finalFlour`, `finalWater`, `refreshYeast`
- `totalSalt`, `totalMalt`
  (plus any others used by previews)

### `calculatePrepSchedule(scheduleData)`

Returns timestamps as **dayjs** objects:

```ts
type PrepSchedule = {
  prepBigaTime: dayjs.Dayjs;
  autolyzeRefreshTime: dayjs.Dayjs;
  prepDoughTime: dayjs.Dayjs;
  prepBallsTime: dayjs.Dayjs;
  preheatOvenTime: dayjs.Dayjs;
  prepToppingsTime: dayjs.Dayjs;
  bakingDateTime: dayjs.Dayjs; // ← renamed from bakePizza
  totalDuration: number | null; // minutes, from first step -> bake
};
```

> We renamed the return field from `bakePizza` → `bakingDateTime` (a dayjs object).
> The input stays `scheduleData.bakingDateTime` (a string).

### `buildCalculatedData(results, sched, scheduleData)`

- Builds `CalculatedData` for UI & persistence.
- Uses `sched.*` for step times and **formats** with `formatScheduleTime`.
- For “Bake Pizza” it uses `sched.bakingDateTime` or (if missing) formats `scheduleData.bakingDateTime`.

### `makeIngredientRows(calculatedData)`

- Produces rows for the Ingredient Breakdown table:
  - Flour/Water/Yeast/Salt/Malt/Total
  - Columns: Biga, Refresh, Total, Baker%
  - Baker% calculated against total **flour** (biga + refresh).

---

## 3) Title generation

```ts
// utils/recipeFormatting.js
export const generateRecipeTitle = (formData, scheduleData) => {
  const date = dayjs(scheduleData.bakingDateTime).format('YYYY-MM-DD');
  const biga = formData.bigaPercent;
  const hydration = formData.finalHydration;
  return `${date} - ${biga}% Biga Dough Hydration - ${hydration}%`;
};
```

Usage:

```js
const title = generateRecipeTitle(formData, scheduleData);
```

---

## 4) API payload shape (frontend → backend)

```ts
type RecipePayload = {
  meta: { version: 1 };
  title: string;
  formData: typeof formData;
  scheduleData: typeof scheduleData; // includes string bakingDateTime
  calculatedData: CalculatedData; // timeline times are strings
  notes: string;
  rating: number | null;
};
```

Backend model mirrors these three blobs: `formData`, `scheduleData`, `calculatedData`.

---

## 5) Naming conventions

- **Date/time (string inputs):** `bakingDateTime` (always ISO-like `YYYY-MM-DDTHH:mm`, local).
- **Date/time (derived dayjs):** use the **same key** when returned from calculators; e.g. `schedule.bakingDateTime` is **dayjs**.
- **Durations:** end with `Time` (minutes) or `RisingTime` (hours) to signal units.
- **Booleans:** start with `is*` (e.g., `isTimelineConfirmed`).
- **Helpers that format for UI:** `format*` (e.g., `formatScheduleTime`).
- **Do not** introduce synonyms (`bakePizza`, `bakingDT`, etc.).
  If you must alias, add it here and deprecate the old one explicitly.

---

## 6) Migration notes (recent)

- ✅ **Moved** `bakingDateTime` from `formData` → `scheduleData`.
- ✅ `calculatePrepSchedule` now **returns** `bakingDateTime` (dayjs)
  (previously `bakePizza`).
- ✅ `generateRecipeTitle(formData, scheduleData)` uses the date from `scheduleData`.

**If you see** `formData.bakingDateTime` or `sched.bakePizza` in code, replace with:

- `scheduleData.bakingDateTime` (string) **or**
- `sched.bakingDateTime` (dayjs) depending on context.

---

## 7) Common gotchas

- Mixing units (minutes vs hours) in `scheduleData`—double-check when adding fields.
- Using the dayjs object directly in JSX—always format via `formatScheduleTime`.
- Forgetting to seed `scheduleData.bakingDateTime` in “create” flows—ensure the default is set once (e.g., now + 1 day).
- Ingredient Baker% must divide by **total flour** (biga + refresh), not total dough weight.

---

## 8) Examples

```js
// 1) Build schedule & preview:
const sched = calculatePrepSchedule(scheduleData);
const calculatedData = buildCalculatedData(results, sched, scheduleData);

// 2) Show bake time (preview):
const bakeTime = sched?.bakingDateTime
  ? formatScheduleTime(sched.bakingDateTime)
  : scheduleData.bakingDateTime
  ? formatScheduleTime(scheduleData.bakingDateTime)
  : null;

// 3) Save:
const payload = {
  meta: { version: 1 },
  title: generateRecipeTitle(formData, scheduleData),
  formData,
  scheduleData,
  calculatedData,
  notes: '',
  rating: null,
};
```
