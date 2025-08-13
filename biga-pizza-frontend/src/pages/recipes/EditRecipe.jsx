// src/pages/recipes/EditRecipe.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipe } from '@context/RecipeContext';
import { getRecipeById, updateRecipe } from '@services/recipeService';
import Step5RecipePreview from '@components/guidedinputflow/Step5RecipePreview';
import Step6PrepSchedule from '@components/guidedinputflow/Step6PrepSchedule';
import ScheduleSettingsDrawer from '@components/ScheduleSettingsDrawer';
import defaultScheduleSettings from '@constants/defaultScheduleSettings';
import {
  calcDoughAndSchedule,
  buildCalculatedData,
} from '@/utils/recipeCalcHelpers';
import { calculateDough } from '@/utils/utils';
import { calculatePrepSchedule } from '@/utils/scheduleCalculator';
import toast from 'react-hot-toast';
import { Settings } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null); // <-- new state
  const [includeTimeline, setIncludeTimeline] = useState(true);

  const {
    setFormData,
    setScheduleData,
    isSettingsDrawerOpen,
    setSettingsDrawerOpen,
    resetFormData,
    resetScheduleData,
    formData,
    scheduleData,
  } = useRecipe();

  const isEditing = true;

  useEffect(() => {
    async function loadRecipe() {
      try {
        const recipe = await getRecipeById(id);
        if (recipe) {
          setRecipe(recipe); // <-- set here
          setFormData(recipe.formData);
          console.log('🧩 Loaded formData:', recipe.formData);
          setScheduleData(recipe.scheduleData);
          setSettingsDrawerOpen(true);
        }
      } catch (err) {
        toast.error('Failed to load recipe for editing.');
        navigate('/account');
      }
    }
    loadRecipe();
  }, [id]);

  useEffect(() => {
    if (recipe) {
      setIncludeTimeline(recipe.hasSchedule ?? true);
    }
  }, [recipe]);

  const handleSave = async () => {
    try {
      // 1) Recompute from current formData + scheduleData
      const { results, sched } = calcDoughAndSchedule(formData, scheduleData);
      const calculatedData = includeTimeline
        ? buildCalculatedData(results, sched, scheduleData)
        : {
            ingredients: recipe?.calculatedData?.ingredients ?? null,
            timelineSteps: [],
          };

      const payload = {
        formData,
        hasSchedule: includeTimeline,
        scheduleData: includeTimeline
          ? scheduleData ?? defaultScheduleSettings
          : null,
        // 2) Send calculatedData so the backend stores the fresh timeline
        calculatedData,
      };
      console.log('📦 payload to update:', payload);
      console.log('🧾 Saving formData:', formData);
      await updateRecipe(id, payload);
      toast.success('Recipe updated!');
      resetFormData();
      resetScheduleData();
      setSettingsDrawerOpen(false);
      console.log(id);
      navigate(`/account/recipes/${id}`);
    } catch (err) {
      toast.error('Failed to save recipe.');
    }
  };

  const handleCancel = () => {
    navigate(`/account/recipes/${id}`);
  };

  return (
    <>
      <div className="space-y-6">
        {isEditing && (
          <button
            onClick={() => setSettingsDrawerOpen(true)}
            className="fixed top-100 right-0 transform -translate-y-1/2 z-40 flex items-center gap-2 bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 pl-3 pr-4 rounded-l-full rounded-r-none shadow-lg ring-2 ring-yellow-400/40 hover:ring-yellow-300 transition-all duration-300"
          >
            <span className="animate-pulse text-sm font-medium">
              <Settings className="w-5 h-5" />
            </span>
          </button>
        )}
        <h1 className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
          Edit Recipe
        </h1>
        <Step5RecipePreview isEditing={true} />

        {/* Toggle switch */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone-600 dark:text-stone-300">
            Include Prep Schedule
          </span>
          <button
            onClick={() => setIncludeTimeline(!includeTimeline)}
            className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
              includeTimeline ? 'bg-green-500' : 'bg-stone-600'
            }`}
            aria-pressed={includeTimeline}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                includeTimeline ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="border-t border-stone-500 my-6" />
        {includeTimeline && (
          <Step6PrepSchedule
            isEditing={isEditing}
            onOpenDrawer={() => setSettingsDrawerOpen(true)}
          />
        )}

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-stone-600 pt-4">
          {/* Action buttons */}
          <div className="flex gap-3 justify">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm rounded border border-stone-700 bg-stone-700 hover:bg-stone-600 text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm rounded bg-green-600 hover:bg-green-700 text-white"
            >
              Save Changes
            </button>
          </div>
        </div>
        <ScheduleSettingsDrawer
          isOpen={isSettingsDrawerOpen}
          onClose={() => setSettingsDrawerOpen(false)}
          data={scheduleData}
          onChange={(e) =>
            setScheduleData((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }))
          }
          onReset={resetScheduleData}
        />
      </div>
    </>
  );
}
