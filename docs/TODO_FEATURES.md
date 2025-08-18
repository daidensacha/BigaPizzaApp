# BigaPizza — Dashboard & UX Roadmap

A backlog of enhancements for the user dashboard and related UX, grouped by phases. Priorities marked ⭐.

---

## Phase 1 — Polish & Quality of Life (Short-term)

- Personalized greeting on dashboard (e.g., “Welcome back, <name> 👋”). ⭐
- Overview stat cards: total recipes, avg rating, favorites, last baked — add small trend arrows (↑/↓) vs last week/month.
- Recipe cards: include image thumbnails (with placeholder), subtle hover reveal (rating, favorites).
- Sort toggles for lists: Recently Added, Top Rated (highest rated / most favorited / most baked).
- Left-aligned, tidy grid alignment across all inputs (done in Settings; keep consistent elsewhere).
- Tooltips standardization (Headless UI + Tailwind component), dark-mode ready.
- Micro-animations (Framer Motion) for card entrance/hover.

## Phase 2 — Insights & Visualizations (Near-term)

- Baking Frequency chart (by week or month).
- Fermentation Style breakdown (donut: 24h/48h/72h). ⭐
- Favorite toppings/recipes pie chart.
- “Time-to-bake” helper: suggests ideal start time from bakingDateTime backwards.
- Session summaries after each bake (auto-calc from recipe timeline).

## Phase 3 — Engagement & Assist (Mid-term)

- Next Bake Reminder countdown timer on dashboard tied to the selected recipe date/time. ⭐
- Quick actions:
  - Create New Recipe
  - Re-bake Last Recipe (loads last used defaults)
  - Import Recipe (from shared link, future)
- Guided tips (“Did you know…”) contextual to their defaults (e.g., hydration/temp combos).

## Phase 4 — Gamification (Mid/Long-term)

- Achievement badges:
  - “First 10 Recipes” 🏅
  - “100 Pizzas Baked” 🍕
  - “5‑Star Chef” ⭐⭐⭐⭐⭐
  - “Weekend Warrior” (≥ 2 bakes in a weekend)
  - “Long Ferment Lover” (majority ≥48h ferments)
- Badge shelf on profile + shareable images.
- Streak tracking (“Baked 4 weeks in a row”).

## Phase 5 — Admin & System (Long-term)

- Admin dashboard:
  - Manage **System Defaults** (baseline reset values)
  - Global stats (total recipes, average ratings, popular toppings)
  - User management (last login, total bakes)
  - Feature recipes globally
- A/B feature flags for gradual rollouts.

---

## Implementation Notes (Selected ⭐ items)

### 1) Personalized Greeting ⭐

**Where:** Dashboard header
**Data:** `AuthContext.user.displayName || user.email`
**UI:** “Welcome back, {name} 👋” + day part (“Good evening”)
**Extras:** Tiny avatar circle; last bake date inline.

### 2) Next Bake Reminder — Countdown ⭐

**Where:** Overview row (prominent card)
**Data:** `schedule.bakingDateTime` of the selected/active recipe
**Logic:**

- If no upcoming bake, show CTA to schedule one.
- Live countdown using `setInterval(1000)`; pause in background tab via `document.visibilityState` guard.
- State persists from `RecipeContext` or a `nextBake` pointer in user profile.
  **CTA:** “Open timeline” / “Adjust schedule”.

### 3) Achievement Badges ⭐

**Model:**

```ts
type BadgeId =
  | 'first_10_recipes'
  | 'hundred_bakes'
  | 'five_star_chef'
  | 'weekend_warrior'
  | 'long_ferment_lover';
```

**Storage:** `user.badges: BadgeId[]`, computed on demand or nightly job.
**Trigger examples:**

- First 10 recipes: `recipes.count >= 10`
- 100 pizzas baked: sum of `numPizzas` across completed recipes
- 5‑Star Chef: any recipe `rating === 5` (or average ≥ 4.8)
- Weekend Warrior: >= 2 completed bakes with Sat/Sun dates in one weekend
- Long Ferment Lover: majority of recipes `doughFermentationHours ≥ 48`
  **UI:** Badge grid with tooltips; grayscale until earned; confetti on unlock.

---

## Data & API Sketches

### Countdown

- `GET /api/recipes/active` → returns the recipe the user marked as “next bake” (or the most recent with future `bakingDateTime`).
- Alternatively: store `nextBakeRecipeId` in user profile.

### Badges

- `GET /api/user/badges` → list of earned + next-to-earn
- `POST /api/user/badges/recompute` (admin or scheduled)

### Charts

- `GET /api/analytics/my-bakes?range=12m` → time series counts
- `GET /api/analytics/my-ferments` → buckets for 24/48/72h
- `GET /api/analytics/my-toppings` → top-N labels

---

## UX Consistency

- Tailwind + dark mode first.
- Tooltip component (Headless UI + Tailwind) as standard.
- Card style: rounded-2xl, soft shadow, tidy inner padding, grid gutters.
- Use `sm:` and `md:` breakpoints to preserve two-column inner fieldsets until necessary.
- Respect `xs` control sizes for dense forms.

---

## Milestone Plan (2–3 sprints)

**Sprint A**

- Greeting + overview polish
- Countdown card
- Save/restore system defaults finalized (done ✅)

**Sprint B**

- Badges MVP (2–3 badges) + unlock logic
- Baking Frequency chart
- Sort toggles + hover reveals

**Sprint C**

- Fermentation breakdown
- Admin: system defaults editor
- Streaks + confetti polish

---

## Nice-to-haves

- Shareable recipe cards (image export)
- Public profile with selected badges & top recipes
- Offline mode for calculator
- Import from common pizza calcs (CSV/JSON)
