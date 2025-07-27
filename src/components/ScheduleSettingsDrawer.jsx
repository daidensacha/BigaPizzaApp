import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ChevronUp } from "lucide-react";
import ScheduleInputGroup from "./ScheduleInputGroup";
import { useRecipe } from "../context/RecipeContext";
import YeastTypeSelector from "./ui/YeastTypeSelector";
import toast from "react-hot-toast";

const pizzaSettingsSections = [
  {
    title: "General",
    inputs: [
      { label: "Baking Date and Time", name: "bakingDateTime", type: "datetime-local" },
      { label: "Recipe for (pizzas)", name: "numPizzas", unit: "pcs" },
      { label: "Ball weight (g)", name: "ballWeight", unit: "g" },
      { label: "Dough Biga %", name: "bigaPercent", unit: "%" }
    ]
  },
  {
    title: "Biga",
    inputs: [
      { label: "Biga Hydration", name: "bigaHydration", unit: "%" },
      { label: "Duration (hrs)", name: "bigaTime", unit: "h" },
      { label: "Temperature (°C)", name: "bigaTemp", unit: "°C" }
    ]
  },
  {
    title: "Dough Refresh",
    inputs: [
      { label: "Final Dough Hydration", name: "finalHydration", unit: "%" },
      { label: "Salt (%)", name: "saltPercent", unit: "%" },
      { label: "Malt (%)", name: "maltPercent", unit: "%" },
      { label: "Duration (hrs)", name: "doughTime", unit: "h" },
      { label: "Temperature (°C)", name: "doughTemp", unit: "°C" }
    ]
  },
  {
    title: "Advanced Options",
    inputs: [
      { label: "Short Ferment Correction", name: "shortCorrection" },
      { label: "Long Ferment Correction", name: "longCorrection" }
    ]
  }
];

const scheduleSections = [
  {
    title: "Biga",
    inputs: [
      { label: "Prep time (min)", name: "bigaPrepTime", unit: "min" },
      { label: "Fermentation time (hrs)", name: "bigaRisingTime", unit: "h" }
    ]
  },
  {
    title: "Autolyze",
    inputs: [
      { label: "Prep time (min)", name: "autolyzeRefreshPrep", unit: "min" },
      { label: "Rest time (min)", name: "autolyzeRefreshRest", unit: "min" }
    ]
  },
  {
    title: "Pizza Dough",
    inputs: [
      { label: "Prep time (min)", name: "doughPrepTime", unit: "min" },
      { label: "Bulk Proofing (hrs)", name: "doughRisingTime", unit: "h" }
    ]
  },
  {
    title: "Dough Balls",
    inputs: [
      { label: "Prep time (min)", name: "ballsPrepTime", unit: "min" },
      { label: "Rising time (hrs)", name: "ballsRisingTime", unit: "h" }
    ]
  },
  {
    title: "Food Prep",
    inputs: [
      { label: "Food prep time (min)", name: "toppingsPrepTime", unit: "min" }
    ]
  },
  {
    title: "Preheat",
    inputs: [
      { label: "Preheat Oven (min)", name: "preheatOvenDuration", unit: "min" }
    ]
  }
];

export default function ScheduleSettingsDrawer({ isOpen, onClose, data, onChange, onReset }) {
  const [openIndex, setOpenIndex] = useState(0);
  const [openPizzaIndex, setOpenPizzaIndex] = useState(0);
  const { resetScheduleData } = useRecipe();

  const { formData, setFormData } = useRecipe();

  const handleFormChange = (e) => {
  const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative w-full max-w-md bg-stone-700 shadow-xl p-6 overflow-y-auto">
                <Dialog.Title className="text-xl font-semibold mb-4 text-neutral-400">
                  Pizza Settings
                </Dialog.Title>

                {/* Pizza Accordion */}
                <div className="space-y-2 mb-6">
                  {pizzaSettingsSections.map((section, index) => (
                    <div key={section.title} className="border border-stone-600 rounded-lg">
                      <button
                        className="flex justify-between w-full px-4 py-2 text-left text-sm font-medium text-yellow-700 bg-stone-800 rounded-t-lg hover:bg-red-950"
                        onClick={() => setOpenPizzaIndex((prev) => (prev === index ? -1 : index))}
                      >
                        <span>{section.title}</span>
                        <ChevronUp
                          className={`${
                            openPizzaIndex === index ? "rotate-180" : ""
                          } h-5 w-5 text-stone-200 transition-transform`}
                        />
                      </button>

                      {openPizzaIndex === index && (
                        <div className="px-4 pt-4 pb-2 bg-stone-600">
                           <ScheduleInputGroup
                              title={section.title}
                              inputs={section.inputs.map((input) => ({
                                ...input,
                                value: formData[input.name] || "",
                                onChange: handleFormChange,
                              }))}
                            />
                           {section.title === "General" && (
                              <div>
                                <label className="text-sm pt-4 text-yellow-500 block mb-2">Yeast Type</label>
                                <YeastTypeSelector
                                  value={formData.yeastType}
                                  onChange={handleFormChange}
                                  theme="dark"
                                  name="yeastType"
                                  // name="yeastType-drawer"
                                  showLabel={false}
                                />
                              </div>
                            )}


                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Dialog.Title className="text-xl font-semibold mb-4 text-neutral-400">
                  Schedule Settings
                </Dialog.Title>

                {/* Schedule Accordion */}
                <div className="space-y-2">
                  {scheduleSections.map((section, index) => (
                    <div key={section.title} className="border border-stone-600 rounded-lg">
                      <button
                        className="flex justify-between w-full px-4 py-2 text-left text-sm font-medium text-yellow-700 bg-stone-800 rounded-t-lg hover:bg-red-950"
                        onClick={() => setOpenIndex((prev) => (prev === index ? -1 : index))}
                      >
                        <span>{section.title}</span>
                        <ChevronUp
                          className={`${openIndex === index ? "rotate-180" : ""} h-5 w-5 text-stone-200 transition-transform`}
                        />
                      </button>
                      {openIndex === index && (
                        <div className="px-4 pt-4 pb-2 bg-stone-600">
                          <ScheduleInputGroup
                            title={section.title}
                            inputs={section.inputs.map((input) => ({
                              ...input,
                              value: data[input.name] || "",
                              onChange
                            }))}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      const confirmReset = window.confirm("Reset all values to defaults?");
                      if (confirmReset) {
                        onReset();
                        toast.success("Schedule settings reset to defaults", {
                          duration: 3000,
                          icon: "🔄"
                        });
                      }
                    }}
                    className="text-red-700 border border-red-950 bg-stone-800 px-4 py-2 mr-1 rounded hover:text-stone-300 hover:bg-red-900 hover:border-stone-800"
                  >
                    Reset
                  </button>
                  <button
                    onClick={onClose}
                    className="text-gray-300 border border-stone-800 bg-stone-800 px-4 py-2 rounded hover:bg-stone-950"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}


