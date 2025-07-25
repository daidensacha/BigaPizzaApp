// ========================
// Yeast Interpolation Logic
// ========================
export function calculateYeastPercent(temp, time, yeastType = 'idy') {
  // Clamp to realistic ranges
  temp = Math.max(4, Math.min(22, temp));
  time = Math.max(8, Math.min(48, time));

  // Reference: 0.2% IDY at 6°C, 24h
  const reference = {
    temp: 6,
    time: 24,
    idyPercent: 0.2, // 0.2% IDY for 6°C / 24h
  };

  // Adjust yeast % inversely by time and temp
  const tempFactor = reference.temp / temp;
  const timeFactor = reference.time / time;

  let basePercent = reference.idyPercent * tempFactor * timeFactor;

  // Yeast type adjustment
  switch (yeastType.toLowerCase()) {
    case 'idy':
      break;
    case 'ady':
      basePercent *= 1.25;
      break;
    case 'fresh':
      basePercent *= 3.0;
      break;
    default:
      throw new Error('Unknown yeast type: ' + yeastType);
  }

  return +basePercent.toFixed(4);
}


// ========================
// Dough Calculation
// ========================
export function calculateDough({
  numPizzas,
  ballWeight,
  finalHydration,
  bigaPercent,
  saltPercent,
  maltPercent,
  bigaTime,
  bigaTemp,
  bigaHydration,
  doughTime,         // <- Optional default doughTime = 0,
  doughTemp,         // <- Optional default doughTemp = 0,
  yeastType
}) {
  const totalDough = numPizzas * ballWeight;

  const totalFlour = totalDough / (
    1 +
    finalHydration / 100 +
    saltPercent / 100 +
    maltPercent / 100
  );

  const totalWater = totalFlour * (finalHydration / 100);
  const totalSalt = totalFlour * (saltPercent / 100);
  const totalMalt = totalFlour * (maltPercent / 100);

  const bigaFlour = totalFlour * (bigaPercent / 100);
  const bigaWater = bigaFlour * (bigaHydration / 100);

  const finalFlour = totalFlour - bigaFlour;
  const finalWater = totalWater - bigaWater;

  const yeastPercent = calculateYeastPercent(bigaTemp, bigaTime, yeastType);
  const bigaYeast = (bigaFlour * yeastPercent) / 100;

  const refreshYeastPercent = calculateYeastPercent(
  doughTemp,     // Final dough fermentation temp
  doughTime,     // Final dough fermentation duration
  yeastType
);
  const refreshYeast = (finalFlour * refreshYeastPercent) / 100;

  const totalYeast = bigaYeast + refreshYeast;
  const bakersYeastPercent = (totalYeast / totalFlour) * 100;

  return {
    totalFlour: +totalFlour.toFixed(1),
    totalWater: +totalWater.toFixed(1),
    totalSalt: +totalSalt.toFixed(1),
    totalMalt: +totalMalt.toFixed(1),

    bigaFlour: +bigaFlour.toFixed(1),
    bigaWater: +bigaWater.toFixed(1),
    bigaYeast: +bigaYeast.toFixed(2),

    finalFlour: +finalFlour.toFixed(1),
    finalWater: +finalWater.toFixed(1),
    refreshYeast: +refreshYeast.toFixed(2),

    bakersYeastPercent: +bakersYeastPercent.toFixed(2),
    yeastPercent: +yeastPercent.toFixed(4),
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
