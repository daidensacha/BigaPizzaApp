import React from 'react';
import inputConfig from '@/constants/inputConfig';
import GuidedInputField from '@/components/ui/GuidedInputField';
import { useRecipe } from '@/context/RecipeContext';

export default function Step3Fermentation() {
  const { formData, setFormData } = useRecipe();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseFloat(value) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Step 3: Fermentation</h2>
      {/* Biga Fermentation */}
      <div className="p-4 mt-5 rounded-lg bg-blue-50 dark:bg-blue-700 dark:bg-opacity-40 border border-blue-200 dark:border-blue-600">
        <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
          Biga
        </h2>

        <GuidedInputField
          name="bigaTime"
          value={formData.bigaTime}
          onChange={handleChange}
          label={`Fermentation Time: ${formData.bigaTime}h`}
          min={inputConfig.bigaTime.min}
          max={inputConfig.bigaTime.max}
          step={inputConfig.bigaTime.step}
          unit={inputConfig.bigaTime.unit}
        />
        <GuidedInputField
          name="bigaTemp"
          value={formData.bigaTemp}
          onChange={handleChange}
          label={`Fermentation Temp: ${formData.bigaTemp}°C`}
          min={inputConfig.bigaTemp.min}
          max={inputConfig.bigaTemp.max}
          step={inputConfig.bigaTemp.step}
          unit={inputConfig.bigaTemp.unit}
        />
      </div>

      {/* Final Dough Fermentation */}
      <div className="p-4 rounded-lg bg-green-50 dark:bg-green-700 dark:bg-opacity-40 border border-green-200 dark:border-green-700">
        <h2 className="text-lg font-semibold text-green-700 dark:text-green-500 mb-2">
          Dough
        </h2>
        <GuidedInputField
          name="doughTime"
          value={formData.doughTime}
          onChange={handleChange}
          label={`Fermentation Time: ${formData.doughTime}h`}
          min={inputConfig.doughTime.min}
          max={inputConfig.doughTime.max}
          step={inputConfig.doughTime.step}
          unit={inputConfig.doughTime.unit}
        />

        <GuidedInputField
          name="doughTemp"
          value={formData.doughTemp}
          onChange={handleChange}
          label={`Fermentation Temp: ${formData.doughTemp}°C`}
          min={inputConfig.doughTemp.min}
          max={inputConfig.doughTemp.max}
          step={inputConfig.doughTemp.step}
          unit={inputConfig.doughTemp.unit}
        />
      </div>
    </div>
  );
}
