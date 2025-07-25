import React from "react";
import Tooltip from "./ui/Tooltip";
import { Info } from "lucide-react";

export default function FormLabelWithTooltip({ label, tooltip, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 flex items-center justify-center gap-1"
    >
      {label}
      {tooltip && (
        <Tooltip content={tooltip}>
          <Info className="w-4 h-4 text-blue-600 cursor-pointer" />
        </Tooltip>
      )}
    </label>
  );
}
