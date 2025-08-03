// ========================
// Yeast Interpolation Logic
// ========================

export const YEAST_CORRECTION_DEFAULTS = {
  short: 1.9,
  long: 1.03,
};

export function predictYeastPercent({
  stage = 'biga', // or "refresh"
  temp,
  time,
  yeastType = 'idy',
  bigaPercent = 0.5, // only for refresh
  correction, // <== new
}) {
  temp = Math.max(4, Math.min(30, temp));
  time = Math.max(4, Math.min(72, time));

  const reference = {
    temp: 6,
    time: 24,
    idyPercent: 0.2,
  };

  const tempFactor = reference.temp / temp;
  const timeFactor = reference.time / time;

  // If correction is provided (from slider), use that. Else use defaults.
  if (correction === undefined) {
    correction = 1.0;
    if (stage === 'refresh') {
      correction =
        time <= 12
          ? YEAST_CORRECTION_DEFAULTS.short
          : YEAST_CORRECTION_DEFAULTS.long;
      if (bigaPercent >= 0.4) correction *= 0.85;
      if (bigaPercent >= 0.6) correction *= 0.75;
    }
  }

  let percent = reference.idyPercent * tempFactor * timeFactor * correction;

  if (yeastType === 'ady') percent *= 1.25;
  if (yeastType === 'fresh') percent *= 3.3;

  return percent;
}

// ========================
// Rounding Calculation
//
export function round(value, decimals = 2) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

// ========================
// Dough Calculation
// ========================
export function calculateDough(data) {
  function round(value, decimals = 2) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  }

  const {
    numPizzas,
    ballWeight,
    bigaPercent,
    finalHydration,
    bigaHydration,
    saltPercent,
    maltPercent = 0, // default to 0 if undefined
    yeastType,
    bigaTime,
    bigaTemp,
    doughTime,
    doughTemp,
    shortCorrection = YEAST_CORRECTION_DEFAULTS.short,
    longCorrection = YEAST_CORRECTION_DEFAULTS.long,
  } = data;

  const totalDough = numPizzas * ballWeight;

  const totalFlour =
    totalDough / (1 + finalHydration / 100 + (saltPercent + maltPercent) / 100);

  const bigaFlour = totalFlour * (bigaPercent / 100);
  const finalFlour = totalFlour - bigaFlour;

  const bigaWater = bigaFlour * (bigaHydration / 100);
  const finalWater = totalFlour * (finalHydration / 100) - bigaWater;
  const totalWater = bigaWater + finalWater;

  const totalSalt = totalFlour * (saltPercent / 100);
  const totalMalt = totalFlour * (maltPercent / 100);

  const bigaYeastPercent = predictYeastPercent({
    stage: 'biga',
    temp: bigaTemp,
    time: bigaTime,
    yeastType,
    correction: longCorrection,
  });

  const refreshYeastPercent = predictYeastPercent({
    stage: 'refresh',
    temp: doughTemp,
    time: doughTime,
    yeastType,
    bigaPercent: bigaPercent / 100,
    correction: shortCorrection,
  });

  const bigaYeast = bigaFlour * (bigaYeastPercent / 100);
  const refreshYeast = finalFlour * (refreshYeastPercent / 100);
  const totalYeast = bigaYeast + refreshYeast;

  const totalYeastPercent = (totalYeast / totalFlour) * 100;

  return {
    totalFlour: round(totalFlour),
    bigaFlour: round(bigaFlour),
    finalFlour: round(finalFlour),
    bigaWater: round(bigaWater),
    finalWater: round(finalWater),
    totalWater: round(totalWater),
    totalSalt: round(totalSalt),
    totalMalt: round(totalMalt),
    bigaYeast: round(bigaYeast),
    refreshYeast: round(refreshYeast),
    bigaYeastPercent: round(bigaYeastPercent),
    refreshYeastPercent: round(refreshYeastPercent),
    totalYeast: round(totalYeast),
    totalYeastPercent: round(totalYeastPercent),
    bakersYeastPercent: round(totalYeastPercent), // same as above
  };
}

// ========================
// Schedule Utility
// ========================
export function getLocalDateTimePlus24h() {
  const date = new Date();
  date.setHours(date.getHours() + 24);

  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());

  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
