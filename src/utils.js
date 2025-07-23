export function calculateDough({
  numPizzas,
  ballWeight,
  finalHydration,
  bigaPercent,
  saltPercent,
  maltPercent,
  bigaTime,
  bigaTemp,
  yeastType
}) {
  const totalDough = numPizzas * ballWeight;
  const totalFlour = totalDough / (1 + finalHydration / 100 + saltPercent / 100 + maltPercent / 100);
  const totalWater = totalFlour * (finalHydration / 100);
  const totalSalt = totalFlour * (saltPercent / 100);
  const totalMalt = totalFlour * (maltPercent / 100);

  const bigaFlour = totalFlour * (bigaPercent / 100);
  const bigaWater = bigaFlour * 0.5; // Fixed 50% hydration for biga
  const finalFlour = totalFlour - bigaFlour;
  const finalWater = totalWater - bigaWater;

  const baseYeast = 0.15;
  const timeAdj = bigaTime < 24 ? (24 - bigaTime) * 0.01 : (bigaTime - 24) * -0.005;
  const tempAdj = bigaTemp < 22 ? (22 - bigaTemp) * 0.01 : (bigaTemp - 22) * -0.008;
  let freshYeastPercent = Math.max(0.05, Math.min(baseYeast + timeAdj + tempAdj, 0.3));

  let yeastPercent;
  switch (yeastType) {
    case 'fresh': yeastPercent = freshYeastPercent; break;
    case 'ady': yeastPercent = freshYeastPercent * 0.4; break;
    case 'idy': yeastPercent = freshYeastPercent * 0.33; break;
    default: yeastPercent = freshYeastPercent;
  }
  const bigaYeast = bigaFlour * (yeastPercent / 100);

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
    yeastPercent: +yeastPercent.toFixed(3)
  };
}

export function calculateDoughYeast(doughTime, doughTemp, yeastType = 'idy') {
  let idyPercent = 0;

  if (doughTemp <= 6) {
    if (doughTime >= 24 && doughTime <= 72) {
      idyPercent = 0.03; // 0.03% IDY
    } else if (doughTime > 72) {
      idyPercent = 0.02;
    }
  } else {
    if (doughTime >= 4 && doughTime <= 8) {
      idyPercent = 0.05;
    } else if (doughTime > 8) {
      idyPercent = 0.04;
    }
  }

  const factor = {
    fresh: 3,
    ady: 1.5,
    idy: 1
  }[yeastType] || 1;

  return idyPercent * factor;
}

export function getLocalDateTimePlus24h() {
  const date = new Date();
  date.setHours(date.getHours() + 24); // add 24 hours

  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
}

