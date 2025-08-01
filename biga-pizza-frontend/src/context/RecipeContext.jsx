import React, { createContext, useContext, useState } from 'react';
import { getLocalDateTimePlus24h } from '@utils/dayjsConfig';
import { YEAST_CORRECTION_DEFAULTS } from '@utils/utils';

const RecipeContext = createContext();

const defaultFormData = {
  numPizzas: 3,
  ballWeight: 280,
  bigaHydration: 50,
  finalHydration: 68,
  bigaPercent: 50,
  saltPercent: 3.4, // only in dough refresh
  maltPercent: 0.5, // only in dough refresh
  bigaTime: 24,
  bigaTemp: 6,
  doughTime: 6,
  doughTemp: 22,
  yeastType: 'idy',
  bakingDateTime: getLocalDateTimePlus24h(),
  shortCorrection: YEAST_CORRECTION_DEFAULTS.short,
  longCorrection: YEAST_CORRECTION_DEFAULTS.long,
};

const defaultScheduleData = {
  bigaPrepTime: 15,
  bigaRisingTime: 24,
  autolyzeRefreshPrep: 20,
  autolyzeRefreshRest: 30,
  doughPrepTime: 30,
  doughRisingTime: 6,
  ballsPrepTime: 20,
  ballsRisingTime: 6,
  preheatOvenDuration: 60,
  toppingsPrepTime: 30,
};

export const RecipeProvider = ({ children }) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [scheduleData, setScheduleData] = useState(defaultScheduleData);

  const resetFormData = () => setFormData(defaultFormData);
  const resetScheduleData = () => setScheduleData(defaultScheduleData);

  const [isSettingsDrawerOpen, setSettingsDrawerOpen] = useState(false);

  const [isTimelineConfirmed, setTimelineConfirmed] = useState(false);

  return (
    <RecipeContext.Provider
      value={{
        formData,
        setFormData,
        resetFormData,
        scheduleData,
        setScheduleData,
        resetScheduleData,
        isSettingsDrawerOpen,
        setSettingsDrawerOpen,
        isTimelineConfirmed,
        setTimelineConfirmed,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipe = () => useContext(RecipeContext);
