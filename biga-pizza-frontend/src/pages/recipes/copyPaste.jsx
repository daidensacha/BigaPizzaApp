// src/pages/recipes/EditRecipe.jsx
} else if (req.body.scheduleData) {
  recipe.scheduleData = req.body.scheduleData;

- // ✅ Recalculate timelineSteps with actual times
- const schedule = calculatePrepSchedule({
-   ...req.body.scheduleData,
-   bakingDateTime: req.body.formData?.bakingDateTime, // <-- also wrong source
- });
- recipe.calculatedData.timelineSteps = schedule;
+ // ✅ Trust the frontend-calculated payload to keep logic consistent
+ if (req.body.calculatedData) {
+   recipe.calculatedData = req.body.calculatedData;
+ }
}