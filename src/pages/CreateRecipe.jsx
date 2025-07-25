import React, { useState } from 'react';
import { Info, Droplet, Timer, FlaskConical } from 'lucide-react';
import { getLocalDateTimePlus24h, YEAST_CORRECTION_DEFAULTS } from '../utils';
import StepWrapper from '../components/GuidedInputFlow/StepWrapper';
import Step1BasicInfo from '../components/GuidedInputFlow/Step1BasicInfo';
import Step2Hydration from '../components/GuidedInputFlow/Step2Hydration';
import Step3Fermentation from '../components/GuidedInputFlow/Step3Fermentation';
import Step4YeastType from '../components/GuidedInputFlow/Step4YeastType';
import Step5RecipePreview from '../components/GuidedInputFlow/Step5RecipePreview';
import ProgressBar from '../components/GuidedInputFlow/ProgressBar';

const steps = [
  { id: 1, label: 'Basic Info', icon: <Info size={18} className="inline mr-1" /> },
  { id: 2, label: 'Hydration', icon: <Droplet size={18} className="inline mr-1" /> },
  { id: 3, label: 'Fermentation', icon: <Timer size={18} className="inline mr-1" /> },
  { id: 4, label: 'Yeast Type', icon: <FlaskConical size={18} className="inline mr-1" /> },
  { id: 5, label: 'Preview' },
];

export default function CreateRecipe() {

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    numPizzas: 3,
    ballWeight: 280,
    bigaHydration: 50,
    finalHydration: 68,
    bigaPercent: 50,
    saltPercent: 3.4,
    maltPercent: 0.5,
    bigaTime: 24,
    bigaTemp: 6,
    doughTime: 6,
    doughTemp: 22,
    yeastType: 'idy',
    bakingDateTime: getLocalDateTimePlus24h(), // prefilled!
    shortCorrection: YEAST_CORRECTION_DEFAULTS.short,
    longCorrection: YEAST_CORRECTION_DEFAULTS.long,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name] : ['yeastType', 'bakingDateTime'].includes(name) ? value : parseFloat(value),
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
      case 5:
        return (
        <Step5RecipePreview
          data={ formData }
          setData={setFormData}
          onCreateSchedule={() => setCurrentStep(6)} // or set a flag to show schedule form
          onSkip={() => console.log('Skip to final review or export')}
        />
      );
      default:
        return null;
    }
  };

  return (

        <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 flex flex-col justify-center items-center p-8 text-center">
          <div className="max-w-2xl w-full p-6 space-y-6 rounded-xl">
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