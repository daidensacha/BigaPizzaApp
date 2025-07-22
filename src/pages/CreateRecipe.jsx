import React, { useState } from 'react';
import StepWrapper from '../components/GuidedInputFlow/StepWrapper';
import Step1BasicInfo from '../components/GuidedInputFlow/Step1BasicInfo';
import Step2Hydration from '../components/GuidedInputFlow/Step2Hydration';
import Step3Fermentation from '../components/GuidedInputFlow/Step3Fermentation';
import Step4YeastType from '../components/GuidedInputFlow/Step4YeastType';
import ProgressBar from '../components/GuidedInputFlow/ProgressBar';

const steps = [
  { id: 1, label: 'Basic Info' },
  { id: 2, label: 'Hydration' },
  { id: 3, label: 'Fermentation' },
  { id: 4, label: 'Yeast Type' },
];

export default function CreateRecipe() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    numPizzas: 6,
    ballWeight: 280,
    bigaHydration: 50,
    finalHydration: 65,
    bigaPercent: 60,
    saltPercent: 3,
    maltPercent: 0.5,
    bigaTime: 24,
    bigaTemp: 22,
    doughTime: 5,
    doughTemp: 22,
    yeastType: 'idy',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'yeastType' ? value : parseFloat(value),
    }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo data={formData} onChange={handleChange} />;
      case 2:
        return <Step2Hydration data={formData} onChange={handleChange} />;
      case 3:
        return <Step3Fermentation data={formData} onChange={handleChange} />;
      case 4:
        return <Step4YeastType data={formData} onChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 flex flex-col justify-center items-center p-8 text-center">
      <div className="max-w-2xl mx-auto p-6 space-y-6 ">
        <h1 className="text-2xl font-bold text-gray-800">Create a New Pizza Dough Recipe</h1>
        <ProgressBar steps={steps} currentStep={currentStep} />

        <StepWrapper
          step={currentStep}
          totalSteps={steps.length}
          onNext={nextStep}
          onBack={prevStep}
          isLastStep={currentStep === steps.length}
        >
          {renderStep()}
        </StepWrapper>
      </div>
    </div>
  );
}