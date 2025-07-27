import tooltips from "../../constants/tooltips";
import FormLabelWithTooltip from "../FormLabelWithTooltip";

export default function Step4YeastType({ data, onChange }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Step 4: Yeast Type</h2>
      <div>
        <FormLabelWithTooltip tooltip={tooltips.yeastType}>
          Select Yeast Type (Fresh, IDY, ADY): {data.yeastType}
        </FormLabelWithTooltip>
        <select
          name="yeastType"
          value={data.yeastType || ''}
          onChange={onChange}
          className="mt-1 block w-full border rounded p-2"
        >
          <option value="idy">Instant Dry Yeast (IDY)</option>
          <option value="ady">Active Dry Yeast (ADY)</option>
          <option value="fresh">Fresh Yeast</option>
        </select>
      </div>
    </div>
  );
}
