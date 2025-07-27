// import tooltips from "../../constants/tooltips";
// import FormLabelWithTooltip from "../FormLabelWithTooltip";
import { useRecipe } from "../../context/RecipeContext";
import YeastTypeToggleGroup from "../ui/YeastTypeToggleGroup";

export default function Step4YeastType({ data, onChange }) {
  return (
    <div className="flex justify-center">
      <div className="space-y-6 flex flex-col items-start">
        <h2 className="text-xl font-semibold">Step 4: Yeast Type</h2>
        <YeastTypeToggleGroup
          value={data.yeastType}
          onChange={onChange}
          theme="light"
        />
      </div>
    </div>
  );
}
