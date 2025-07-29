import React from "react";
import { useRecipe } from "../../context/RecipeContext";
import inputConfig from "../../constants/inputConfig";
import GuidedInputField from "../ui/GuidedInputField";

export default function Step1BasicInfo() {

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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Step 1: Basic Info</h2>
      {/* Number of Pizzas */}
      <div className="p-4 mt-5 rounded-lg bg-orange-50 dark:bg-gray-500 dark:bg-opacity-40 border border-orange-100 dark:border-stone-700">
        <GuidedInputField
          name="numPizzas"
          label={`Recipe for ${formData.numPizzas} ${formData.numPizzas === 1 ? 'pizza' : 'pizzas'}`}
          value={formData.numPizzas}
          onChange={handleChange}
          min={inputConfig.numPizzas.min}
          max={inputConfig.numPizzas.max}
          step={inputConfig.numPizzas.step}
          unit={inputConfig.numPizzas.unit}
        />


        {/* Ball Weight */}
        <GuidedInputField
          name="ballWeight"
          value={formData.ballWeight}
          onChange={handleChange}
          label={`${formData.ballWeight}g per ball`}
          min={inputConfig.ballWeight.min}
          max={inputConfig.ballWeight.max}
          step={inputConfig.ballWeight.step}
          unit={inputConfig.ballWeight.unit}
        />

        {/* Biga Percent */}
        <GuidedInputField
          name="bigaPercent"
          value={formData.bigaPercent}
          onChange={handleChange}
          label={`${formData.bigaPercent}% Biga pizza dough`}
          min={inputConfig.bigaPercent.min}
          max={inputConfig.bigaPercent.max}
          step={inputConfig.bigaPercent.step}
          unit={inputConfig.bigaPercent.unit}
        />

        {/* Baking Date & Time */}
        <GuidedInputField
          name="bakingDateTime"
          value={formData.bakingDateTime}
          onChange={handleChange}
          label="Baking Date and Time"
          type={inputConfig.bakingDateTime.type}
        />
      </div>
    </div>
  );
}
