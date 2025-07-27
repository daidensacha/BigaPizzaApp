import { Popover } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import clsx from "clsx";

const yeastOptions = [
  {
    label: "IDY",
    value: "idy",
    description: "Instant Dry Yeast – fast, low quantity",
  },
  {
    label: "ADY",
    value: "ady",
    description: "Active Dry Yeast – must be dissolved",
  },
  {
    label: "Fresh",
    value: "fresh",
    description: "Fresh (Cake) Yeast – traditional, moist",
  },
];

export default function YeastTypePopoverSelector({
  value,
  onChange,
  name = "yeastType",
  theme = "light",
}) {
  const isDark = theme === "dark";

  const base = isDark
    ? "bg-stone-800 text-yellow-200 border-yellow-700"
    : "bg-white text-gray-800 border-gray-300";
  const selected = isDark
    ? "bg-yellow-600 text-white"
    : "bg-red-600 text-white";

  return (
    <div className="flex space-x-2">
      {yeastOptions.map((option) => (
        <Popover className="relative" key={option.value}>
          <Popover.Button
            as={motion.button}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              onChange({ target: { name, value: option.value } })
            }
            className={clsx(
              "px-4 py-2 text-sm font-medium rounded-xl border focus:outline-none",
              base,
              value === option.value && selected
            )}
          >
            {option.label}
          </Popover.Button>

          <AnimatePresence>
            <Popover.Panel>
              {({ close }) => (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className={clsx(
                    "absolute z-20 mt-2 w-64 rounded-lg shadow-lg text-sm",
                    isDark ? "bg-stone-800 text-yellow-100" : "bg-white text-gray-700"
                  )}
                >
                  <div className="p-3 flex justify-between">
                    <span>{option.description}</span>
                    <button onClick={close}>
                      <Info size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </Popover.Panel>
          </AnimatePresence>
        </Popover>
      ))}
    </div>
  );
}
