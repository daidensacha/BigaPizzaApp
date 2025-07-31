import dayjs from './dayjsConfig'; // your configured dayjs instance

// Convert setting data to safe numebr to avoid Nan or undefined errors
const safeNumber = (n) => Number(n) || 0;

// Convert setting duration units to minutes
const toMinutes = (value, unit = 'min') => {
  const num = safeNumber(value);
  return unit === 'h' ? num * 60 : num;
};

export function calculatePrepSchedule(data) {
  const {
    bakingDateTime,
    bigaPrepTime,
    bigaRisingTime,
    autolyzeRefreshPrep,
    autolyzeRefreshRest,
    doughPrepTime,
    doughRisingTime,
    ballsPrepTime,
    ballsRisingTime,
    preheatOvenDuration,
    toppingsPrepTime,
  } = data;

  const bakingTime = dayjs(bakingDateTime);

  const prepToppingsTime = bakingTime.subtract(
    toMinutes(toppingsPrepTime) + 30,
    'minute'
  );

  const preheatOvenTime = bakingTime.subtract(
    toMinutes(preheatOvenDuration),
    'minute'
  );

  const totalBallsTime =
    toMinutes(ballsPrepTime) + toMinutes(ballsRisingTime, 'h');
  const prepBallsTime = bakingTime.subtract(totalBallsTime, 'minute');

  const totalDoughTime =
    toMinutes(doughPrepTime) + toMinutes(doughRisingTime, 'h');
  const prepDoughTime = prepBallsTime.subtract(totalDoughTime, 'minute');

  const totalAutolyzeTime =
    toMinutes(autolyzeRefreshPrep) + toMinutes(autolyzeRefreshRest);
  const autolyzeRefreshTime = prepDoughTime.subtract(
    totalAutolyzeTime,
    'minute'
  );

  const totalBigaTime =
    toMinutes(bigaPrepTime) + toMinutes(bigaRisingTime, 'h');
  const prepBigaTime = autolyzeRefreshTime.subtract(totalBigaTime, 'minute');

  const totalDuration =
    dayjs.isDayjs(bakingTime) && dayjs.isDayjs(prepBigaTime)
      ? bakingTime.diff(prepBigaTime, 'minute')
      : null;

  return {
    prepBigaTime,
    autolyzeRefreshTime,
    prepDoughTime,
    prepBallsTime,
    preheatOvenTime,
    prepToppingsTime,
    bakePizza: bakingTime,
    totalDuration,
  };
}
