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
