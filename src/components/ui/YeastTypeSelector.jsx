export default function YeastTypeSelector({ value, onChange, theme = "light", name = "yeastType" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "text-stone-300" : "text-gray-800";
  const ringColor = isDark ? "focus:ring-yellow-600" : "focus:ring-red-600";
  const radioColor = isDark ? "text-yellow-500" : "text-red-600";
  const checkedRing = isDark ? "checked:ring-yellow-500" : "checked:ring-red-500";
  const checkedBg = isDark ? "checked:bg-yellow-600" : "checked:bg-red-600";

  const options = [
    { label: "Instant Dry Yeast (IDY)", value: "idy" },
    { label: "Active Dry Yeast (ADY)", value: "ady" },
    { label: "Fresh Yeast", value: "fresh" },
  ];

  return (
    <fieldset className="space-y-2">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex items-center space-x-2 text-sm ${textColor}`}
        >
          <input
            type="radio"
            // name="yeastType"
            name={name} // <- now accepts unique name per usage
            value={option.value}
            checked={value === option.value}
            // onChange={onChange}
            onChange={(e) => {
                console.log(`[${name}] onChange fired: ${e.target.value}`);
                console.log(`Rendered Step4YeastType`)
                onChange(e);
              }}
            className={`form-radio h-4 w-4 rounded-full border-gray-400 ${radioColor} ${ringColor} ${checkedRing} ${checkedBg}`}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
