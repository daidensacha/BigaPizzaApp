import tooltips from "../../constants/tooltips";
import FormLabelWithTooltip from "../FormLabelWithTooltip";
import YeastTypeSelector from "../ui/YeastTypeSelector";
import { useRecipe } from "../../context/RecipeContext";

// export default function Step4YeastType({ data, onChange }) {
export default function Step4YeastType({ data, onChange }) {

  const { formData, setFormData } = useRecipe();
    const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`[${name}] onChange fired: ${value}`);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="flex justify-center">
      <div className="space-y-6 flex flex-col items-start">
        <h2 className="text-xl font-semibold ">Step 4: Yeast Type</h2>
         {/* <YeastTypeSelector value={data.yeastType} onChange={onChange} name="yeastType-step" theme="light" /> */}
         {/* <YeastTypeSelector value={data.yeastType} onChange={onChange} name="yeastType" theme="light" /> */}
         {/* <YeastTypeSelector value={data.yeastType} onChange={onChange} theme="light" /> */}
         <YeastTypeSelector
          value={formData.yeastType}
          onChange={handleChange}
          name="yeastType"
          theme="light"
        />
      </div>
    </div>
  );
}
