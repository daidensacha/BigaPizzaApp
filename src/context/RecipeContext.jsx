import React, { createContext, useContext, useState } from "react";
import defaultScheduleSettings from "../constants/defaultScheduleSettings";

const RecipeContext = createContext();

export function RecipeProvider({ children }) {
  const [scheduleData, setScheduleData] = useState(defaultScheduleSettings);

  const resetScheduleData = () => {
  setScheduleData(defaultScheduleSettings);
};

  // More state like dough inputs, metadata, etc., can be added here
  const value = {
    scheduleData,
    setScheduleData,
    resetScheduleData,
    // add more recipe-related state here
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipe() {
  return useContext(RecipeContext);
}
