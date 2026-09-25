import React, { useState } from 'react';

interface SettingsViewProps {
  onShowToast: (msg: string, sub?: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onShowToast }) => {
  const [householdSize, setHouseholdSize] = useState(4);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([
    'High-Protein Focus',
    'Dairy-Conscious',
  ]);
  const [autoSyncGroceries, setAutoSyncGroceries] = useState(true);

  const options = [
    'High-Protein Focus',
    'Gluten-Free Base',
    'Plant-Based / Vegan',
    'Low-Carb / Keto',
    'Dairy-Conscious',
    'Nut-Free Safe',
  ];

  const toggleRestriction = (name: string) => {
    setDietaryRestrictions((prev) =>
      prev.includes(name) ? prev.filter((r) => r !== name) : [...prev, name]
    );
  };

  const handleSave = () => {
    onShowToast('Settings updated', 'Preferences saved to your culinary profile.');
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-24">
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#006948] uppercase tracking-widest font-bold">
            Preferences
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#006948]/40"></span>
          <span className="text-xs text-[#3d4a42]">Culinary Profile</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#131b2e] tracking-tight">
          Kitchen Settings &amp; Defaults
        </h1>
        <p className="text-sm text-[#3d4a42] max-w-xl">
          Calibrate serving portions, measurement systems, and supermarket consolidation rules.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Household Servings */}
        <div className="p-6 rounded-2xl bg-white shadow-sm border border-[#bccac0]/20 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#131b2e]">Default Household Portion Baseline</h2>
              <p className="text-xs text-[#3d4a42]">Recipes will default to this serving headcount upon catalog discovery.</p>
            </div>
            <div className="flex items-center bg-[#f2f3ff] rounded-lg p-1">
              <button
                type="button"
                onClick={() => setHouseholdSize(Math.max(1, householdSize - 1))}
                className="w-8 h-8 rounded bg-white shadow-xs flex items-center justify-center text-[#131b2e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">remove</span>
              </button>
              <span className="w-16 text-center text-sm font-bold text-[#131b2e]">
                {householdSize} Plates
              </span>
              <button
                type="button"
                onClick={() => setHouseholdSize(Math.min(16, householdSize + 1))}
                className="w-8 h-8 rounded bg-white shadow-xs flex items-center justify-center text-[#131b2e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Measurement Unit */}
        <div className="p-6 rounded-2xl bg-white shadow-sm border border-[#bccac0]/20 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#131b2e]">Measurement Units</h2>
              <p className="text-xs text-[#3d4a42]">Pantry weight, liquid volumes, and grocery scaling values.</p>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f2f3ff] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setUnitSystem('metric')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  unitSystem === 'metric'
                    ? 'bg-[#6cf8bb] text-[#00714d] shadow-xs'
                    : 'text-[#3d4a42] hover:text-[#131b2e]'
                }`}
              >
                Metric (g, ml, kg)
              </button>
              <button
                type="button"
                onClick={() => setUnitSystem('imperial')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  unitSystem === 'imperial'
                    ? 'bg-[#6cf8bb] text-[#00714d] shadow-xs'
                    : 'text-[#3d4a42] hover:text-[#131b2e]'
                }`}
              >
                Imperial (oz, lbs, cups)
              </button>
            </div>
          </div>
        </div>

        {/* Dietary Highlights */}
        <div className="p-6 rounded-2xl bg-white shadow-sm border border-[#bccac0]/20 flex flex-col gap-4">
          <div>
            <h2 className="text-base font-bold text-[#131b2e]">Primary Dietary Focus</h2>
            <p className="text-xs text-[#3d4a42]">Tags prioritized when organizing your weekly menu recommendations.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {options.map((opt) => {
              const isSelected = dietaryRestrictions.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleRestriction(opt)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#006948] text-white shadow-xs'
                      : 'bg-[#f2f3ff] text-[#3d4a42] hover:bg-[#eaedff]'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sync & Automation */}
        <div className="p-6 rounded-2xl bg-white shadow-sm border border-[#bccac0]/20 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#131b2e]">Automatic Shopping Consolidation</h2>
            <p className="text-xs text-[#3d4a42]">Immediately recalculate grocery aisle weights when tweaking recipe portions.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoSyncGroceries}
              onChange={(e) => setAutoSyncGroceries(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#dae2fd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006948]"></div>
          </label>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="self-end px-6 py-2.5 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
