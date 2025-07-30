import React from 'react';
import inputConfig from "../../constants/inputConfig";
import GuidedInputField from "../ui/GuidedInputField";
import { useRecipe } from "../../context/RecipeContext";

export default function Step2Hydration() {

    const { formData, setFormData } = useRecipe();

    const handleChange = (e) => {
      const { name, value, type } = e.target;
      const parsedValue = type === "number" ? parseFloat(value) : value;
      setFormData((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));
    };

  return (
    <div className="space-y-6 mt-5">
      <h2 className="text-xl font-semibold">Step 2: Hydration</h2>
      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-700 dark:bg-opacity-40 border border-blue-200 dark:border-blue-600">
      {/* Biga Hydration */}
       <GuidedInputField
        name="bigaHydration"
        label={`Biga Hydration: ${formData.bigaHydration}%`}
        value={formData.bigaHydration}
        onChange={handleChange}
        min={inputConfig.bigaHydration.min}
        max={inputConfig.bigaHydration.max}
        step={inputConfig.bigaHydration.step}
        unit={inputConfig.bigaHydration.unit}
      />
      </div>
      <div className="p-4 rounded-lg bg-green-50 dark:bg-green-700 dark:bg-opacity-40 border border-green-200 dark:border-green-700">
      {/* Final Dough Hydration */}
      <GuidedInputField
        name="finalHydration"
        label={`Dough Hydration: ${formData.finalHydration}%`}
        value={formData.finalHydration}
        onChange={handleChange}
        min={inputConfig.finalHydration.min}
        max={inputConfig.finalHydration.max}
        step={inputConfig.finalHydration.step}
        unit={inputConfig.finalHydration.unit}
      />
      </div>
      <div className="p-4 mt-5 rounded-lg bg-orange-50 dark:bg-gray-500 dark:bg-opacity-40 border border-orange-100 dark:border-stone-700">
      <h2 className="text-lg font-semibold text-orange-700 dark:text-gray-300 mb-2">Additional</h2>
      {/* Salt Percentage */}
      <GuidedInputField
        name="saltPercent"
        label={`Salt: ${formData.saltPercent}%`}
        value={formData.saltPercent}
        onChange={handleChange}
        min={inputConfig.saltPercent.min}
        max={inputConfig.saltPercent.max}
        step={inputConfig.saltPercent.step}
        unit={inputConfig.saltPercent.unit}
      />
      {/* </div>
      <div className="p-4 rounded-lg bg-green-50 dark:bg-purple-700 dark:bg-opacity-40 border border-purple-200 dark:border-green-700"> */}
      {/* Malt Percentage (Optional) */}
      <GuidedInputField
        name="maltPercent"
        label={`Malt: ${formData.maltPercent}%`}
        value={formData.maltPercent}
        onChange={handleChange}
        min={inputConfig.maltPercent.min}
        max={inputConfig.maltPercent.max}
        step={inputConfig.maltPercent.step}
        unit={inputConfig.maltPercent.unit}
      />
      </div>
    </div>
  );
}
