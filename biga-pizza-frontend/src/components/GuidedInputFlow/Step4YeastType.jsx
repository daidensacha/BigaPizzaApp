// import tooltips from "../../constants/tooltips";
// import FormLabelWithTooltip from "../FormLabelWithTooltip";
import { useRecipe } from "../../context/RecipeContext";
import YeastTypeToggleGroup from "../ui/YeastTypeToggleGroup";

export default function Step4YeastType() {

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
    <div className="flex justify-center">
      <div className="space-y-6 flex flex-col items-start">
        <h2 className="text-xl font-semibold">Step 4: Yeast Type</h2>
        <YeastTypeToggleGroup
          value={formData.yeastType}
          onChange={handleChange}
          theme="light"
        />
      </div>
    </div>
  );
}
