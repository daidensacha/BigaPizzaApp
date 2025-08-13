const systemDefaults = {
  doughDefaults: {
    numberOfPizzas: 4,
    ballWeightGrams: 280,
    doughHydrationPercent: 65,
    doughBigaPercent: 50,
    bigaHydrationPercent: 45,
    yeastType: 'IDY',
    bigaFermentationHours: 16,
    bigaFermentationTempC: 20,
    doughFermentationHours: 6,
    doughFermentationTempC: 20,
    bigaYeastPercentOfBigaFlour: 0.2,
    refreshYeastPercentOfRefreshFlour: 0.02,
    saltPercentOfTotalFlour: 2.7,
    maltPercentOfTotalFlour: 0,
  },
  scheduleDefaults: {
    bigaPrepTimeMin: 15,
    bigaRisingTimeMin: 900,
    autolyzeRefreshPrepMin: 15,
    autolyzeRefreshRestMin: 30,
    doughPrepTimeMin: 25,
    doughRisingTimeMin: 120,
    ballsPrepTimeMin: 15,
    ballsRisingTimeMin: 240,
    preheatOvenDurationMin: 60,
    toppingsPrepTimeMin: 30,
  },
};

export default systemDefaults;
