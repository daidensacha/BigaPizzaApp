// Convert backend yeast to the form's lowercase convention
const normalizeYeastToForm = (val) => {
  if (!val) return 'idy';
  const v = String(val).toLowerCase();
  if (v.includes('fresh')) return 'fresh';
  if (v.includes('ady')) return 'ady';
  return 'idy';
};

// Map backend doughDefaults -> your RecipeContext formData
export function mapDoughDefaultsToForm(d) {
  if (!d) return {};
  return {
    numPizzas: d.numberOfPizzas,
    ballWeight: d.ballWeightGrams,
    bigaHydration: d.bigaHydrationPercent,
    finalHydration: d.doughHydrationPercent,
    bigaPercent: d.doughBigaPercent,
    saltPercent: d.saltPercentOfTotalFlour,
    maltPercent: d.maltPercentOfTotalFlour,
    bigaTime: d.bigaFermentationHours,
    bigaTemp: d.bigaFermentationTempC,
    doughTime: d.doughFermentationHours,
    doughTemp: d.doughFermentationTempC,
    yeastType: normalizeYeastToForm(d.yeastType),
    // Note: bakingDateTime / correction factors are managed elsewhere in your context
  };
}

// Map backend scheduleDefaults (minutes) -> your scheduleData
export function mapScheduleDefaultsToState(s) {
  if (!s) return {};
  return {
    bigaPrepTime: s.bigaPrepTimeMin, // minutes
    bigaRisingTime: Math.round((s.bigaRisingTimeMin ?? 0) / 60), // hours
    autolyzeRefreshPrep: s.autolyzeRefreshPrepMin, // minutes
    autolyzeRefreshRest: s.autolyzeRefreshRestMin, // minutes
    doughPrepTime: s.doughPrepTimeMin, // minutes
    doughRisingTime: Math.round((s.doughRisingTimeMin ?? 0) / 60), // hours
    ballsPrepTime: s.ballsPrepTimeMin, // minutes
    ballsRisingTime: Math.round((s.ballsRisingTimeMin ?? 0) / 60), // hours
    preheatOvenDuration: s.preheatOvenDurationMin, // minutes
    toppingsPrepTime: s.toppingsPrepTimeMin, // minutes
  };
}
