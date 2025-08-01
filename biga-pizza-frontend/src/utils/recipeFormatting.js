import dayjs from 'dayjs';

export function formatGrams(value, type = 'default') {
  const num = parseFloat(value);
  if (isNaN(num)) return '–';
  if (type === 'yeast' || type === 'malt') return `${num.toFixed(2)}g`;
  return `${Math.round(num)}g`;
}

export function formatBakersPercent(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return '–';
  return num < 1 ? `${num.toFixed(2)}%` : `${num.toFixed(1)}%`;
}

export function getBakersPercent(ingredientWeight, totalFlour) {
  const num = (ingredientWeight / totalFlour) * 100;
  return isNaN(num) ? '–' : `${num.toFixed(1)}%`;
}

export function generatePreviewRows(results) {
  const totalFlour = results.totalFlour;
  return [
    {
      label: 'Flour',
      biga: formatGrams(results.bigaFlour),
      dough: formatGrams(results.finalFlour),
      total: formatGrams(results.totalFlour),
      percent: '100%',
    },
    {
      label: 'Water',
      biga: formatGrams(results.bigaWater),
      dough: formatGrams(results.finalWater),
      total: formatGrams(results.totalWater),
      percent: getBakersPercent(results.totalWater, totalFlour),
    },
    {
      label: 'Salt',
      biga: formatGrams(results.bigaSalt),
      dough: formatGrams(results.refreshSalt),
      total: formatGrams(results.totalSalt),
      percent: getBakersPercent(results.totalSalt, totalFlour),
    },
    {
      label: 'Malt',
      biga: formatGrams(results.bigaMalt),
      dough: formatGrams(results.refreshMalt),
      total: formatGrams(results.totalMalt),
      percent: getBakersPercent(results.totalMalt, totalFlour),
    },
    {
      label: 'Yeast',
      biga: `${formatGrams(results.bigaYeast, 'yeast')} (${formatBakersPercent(
        results.bigaYeastPercent
      )})`,
      dough: `${formatGrams(
        results.refreshYeast,
        'yeast'
      )} (${formatBakersPercent(results.refreshYeastPercent)})`,
      total: formatGrams(results.bigaYeast + results.refreshYeast, 'yeast'),
      percent: formatBakersPercent(results.totalYeastPercent),
    },
  ];
}

export const generateRecipeTitle = (formData) => {
  const date = dayjs(formData.bakingDateTime).format('YYYY-MM-DD');
  const biga = formData.bigaPercent;
  const hydration = formData.finalHydration;
  return `${date} - ${biga}% Biga Dough Hydration - ${hydration}%`;
};
