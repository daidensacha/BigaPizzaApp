export function formatGrams(value, type = 'default') {
  const num = parseFloat(value);
  if (isNaN(num)) return '–';

  if (type === 'yeast' || type === 'malt') {
    return `${num.toFixed(2)}g`;
  }

  return `${Math.round(num)}g`;
}

export function formatBakersPercent(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return '–';
  return num < 1 ? `${num.toFixed(2)}%` : `${num.toFixed(1)}%`;
}

export function getPercent(value, totalFlour) {
  if (!value || !totalFlour) return '-';
  return `${((value / totalFlour) * 100).toFixed(1)}%`;
}

export function generatePreviewRows(results) {
  const {
    totalFlour,
    totalSalt,
    totalMalt,
    bigaYeast,
    refreshYeast,
    totalYeastPercent,
    bigaYeastPercent,
    refreshYeastPercent,
  } = results;

  return [
    {
      label: 'Flour',
      biga: formatGrams(results.bigaFlour, 'flour'),
      dough: formatGrams(results.finalFlour, 'flour'),
      total: formatGrams(results.totalFlour, 'flour'),
      percent: '100%',
    },
    {
      label: 'Water',
      biga: formatGrams(results.bigaWater, 'water'),
      dough: formatGrams(results.finalWater, 'water'),
      total: formatGrams(results.totalWater, 'water'),
      percent: getPercent(results.totalWater, totalFlour),
    },
    {
      label: 'Salt',
      biga: '-',
      dough: formatGrams(totalSalt, 'salt'),
      total: formatGrams(totalSalt, 'salt'),
      percent: getPercent(totalSalt, totalFlour),
    },
    {
      label: 'Malt',
      biga: '-',
      dough: formatGrams(totalMalt, 'malt'),
      total: formatGrams(totalMalt, 'malt'),
      percent: getPercent(totalMalt, totalFlour),
    },
    {
      label: 'Yeast',
      biga: `${formatGrams(bigaYeast, 'yeast')} (${formatBakersPercent(
        bigaYeastPercent
      )})`,
      dough: `${formatGrams(refreshYeast, 'yeast')} (${formatBakersPercent(
        refreshYeastPercent
      )})`,
      total: formatGrams(bigaYeast + refreshYeast, 'yeast'),
      percent: formatBakersPercent(totalYeastPercent),
    },
  ];
}
