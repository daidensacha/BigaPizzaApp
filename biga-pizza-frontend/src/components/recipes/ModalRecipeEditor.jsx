// src/components/ModalRecipeEditor.jsx
import { useState } from 'react';
import { useRecipe } from '@/context/RecipeContext';
import { useDefaults } from '@/context/DefaultsContext';
import {
  mapDoughDefaultsToForm,
  mapScheduleDefaultsToState,
} from '@/utils/mappers';
import {
  mapFormToDoughDefaults,
  mapStateToScheduleDefaults,
} from '@/utils/mappersInverse';

export default function ModalRecipeEditor({ mode = 'edit', onClose }) {
  const { formData, setFormData, scheduleData, setScheduleData } = useRecipe();
  const { defaults, save, saving } = useDefaults();
  const [tab, setTab] = useState('dough');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const applyMyDefaults = () => {
    if (!defaults) return;
    setFormData((prev) => ({
      ...prev,
      ...mapDoughDefaultsToForm(defaults.doughDefaults),
    }));
    setScheduleData((prev) => ({
      ...prev,
      ...mapScheduleDefaultsToState(defaults.scheduleDefaults),
    }));
  };

  const saveTheseAsMyDefaults = async () => {
    const doughPatch = mapFormToDoughDefaults(formData);
    const schedulePatch = mapStateToScheduleDefaults(scheduleData);
    await save('doughDefaults', doughPatch);
    await save('scheduleDefaults', schedulePatch);
    // toast.success('Saved your defaults');
  };

  const onSaveRecipe = async () => {
    // TODO: call your existing save recipe API
    onClose?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 grid place-items-center bg-black/40"
    >
      <div className="w-full max-w-3xl max-h-[90vh] overflow-auto bg-white rounded-2xl p-4">
        <header className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">
            {mode === 'create' ? 'New Recipe' : 'Edit Recipe'}
          </h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-gray-200" onClick={onClose}>
              Cancel
            </button>
            <button
              className="px-3 py-1 rounded bg-black text-white"
              onClick={onSaveRecipe}
            >
              Save
            </button>
          </div>
        </header>

        <nav className="mt-3 flex gap-2">
          <button
            className={`px-3 py-1 rounded ${
              tab === 'dough' ? 'bg-black text-white' : 'bg-gray-200'
            }`}
            onClick={() => setTab('dough')}
          >
            Dough
          </button>
          <button
            className={`px-3 py-1 rounded ${
              tab === 'schedule' ? 'bg-black text-white' : 'bg-gray-200'
            }`}
            onClick={() => setTab('schedule')}
          >
            Schedule
          </button>
        </nav>

        <section className="mt-4 space-y-3">
          {tab === 'dough' && (
            <div className="grid grid-cols-2 gap-3">
              {/* bind to formData here (same fields you already use) */}
              {/* e.g. doughBigaPercent, doughHydrationPercent, etc. */}
            </div>
          )}
          {tab === 'schedule' && (
            <div className="grid grid-cols-2 gap-3">
              {/* bind to scheduleData here */}
            </div>
          )}
        </section>

        <div className="mt-4">
          <button
            className="text-sm underline"
            onClick={() => setShowAdvanced((v) => !v)}
          >
            {showAdvanced ? 'Hide Advanced' : 'Advanced ▸'}
          </button>
          {showAdvanced && (
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                className="px-3 py-1 rounded bg-gray-100"
                onClick={applyMyDefaults}
              >
                Apply My Defaults
              </button>
              <button
                className="px-3 py-1 rounded bg-gray-100"
                disabled={saving}
                onClick={saveTheseAsMyDefaults}
              >
                {saving ? 'Saving…' : 'Save These as My Defaults…'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
