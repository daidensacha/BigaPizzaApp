// src/utils/mappersInverse.js

// UI formData ➜ backend doughDefaults
export function mapFormToDoughDefaults(f) {
  return {
    numberOfPizzas: f.numPizzas,
    ballWeightGrams: f.ballWeight,
    doughBigaPercent: f.bigaPercent,
    doughHydrationPercent: f.finalHydration,
    bigaHydrationPercent: f.bigaHydration,
    yeastType: (f.yeastType || 'idy').toUpperCase(), // 'IDY' | 'ADY' | 'FRESH'
    bigaFermentationHours: f.bigaTime,
    bigaFermentationTempC: f.bigaTemp,
    doughFermentationHours: f.doughTime,
    doughFermentationTempC: f.doughTemp,
    saltPercentOfTotalFlour: f.saltPercent,
    maltPercentOfTotalFlour: f.maltPercent,
  };
}

// UI scheduleData ➜ backend scheduleDefaults (convert hours ➜ minutes)
export function mapStateToScheduleDefaults(s) {
  return {
    // If your backend accepts/needs bakingDateTime, include it here; otherwise omit.
    // bakingDateTime: s.bakingDateTime,

    bigaPrepTimeMin: s.bigaPrepTime,
    bigaRisingTimeMin: Math.round((s.bigaRisingTime ?? 0) * 60),
    autolyzeRefreshPrepMin: s.autolyzeRefreshPrep,
    autolyzeRefreshRestMin: s.autolyzeRefreshRest,
    doughPrepTimeMin: s.doughPrepTime,
    doughRisingTimeMin: Math.round((s.doughRisingTime ?? 0) * 60),
    ballsPrepTimeMin: s.ballsPrepTime,
    ballsRisingTimeMin: Math.round((s.ballsRisingTime ?? 0) * 60),
    preheatOvenDurationMin: s.preheatOvenDuration,
    toppingsPrepTimeMin: s.toppingsPrepTime,
  };
}
