import React from "react";

export default function StepWrapper({
  children,
  step,
  totalSteps,
  onNext,
  onBack,
  isNextDisabled = false,
}) {
  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg border border-gray-200 p-6 rounded-2xl space-y-6 transition-all">
      <div className="text-sm text-gray-500 text-center">
        Step <span className="font-medium text-gray-700">{step}</span> of{" "}
        <span className="font-medium text-gray-700">{totalSteps}</span>
      </div>

      <div className="pt-2">{children}</div>

      <div className="flex justify-between items-center pt-6">
        <button
          onClick={onBack}
          disabled={step === 1}
          className={`px-4 py-2 text-sm rounded-md text-white transition
            ${step === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className="px-4 py-2 text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
