import React, { useState } from 'react';

export const Settings: React.FC = () => {
  const [dietaryPrefs, setDietaryPrefs] = useState({
    dairyFree: false,
    glutenFree: true,
    lowCarb: false,
    organicProduce: true,
  });

  const [kitchenUnits, setKitchenUnits] = useState('metric');
  const [defaultServings, setDefaultServings] = useState(4);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2400);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-24">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#006948] uppercase tracking-widest">
            Preferences &amp; Rituals
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#006948]/40"></span>
          <span className="text-xs text-[#3d4a42]">Kitchen Profile</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight">Settings</h1>
        <p className="text-sm text-[#3d4a42]">
          Fine-tune ingredient unit standards, default recipe yield, and dietary filters.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#bccac0]/25 flex flex-col gap-6">
        <div>
          <h2 className="text-base font-bold text-[#131b2e] mb-1">Dietary Filter Defaults</h2>
          <p className="text-xs text-[#3d4a42] mb-4">
            Pre-filter catalog items and highlight tailored smart substitutions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'glutenFree', label: 'Gluten-Free Priority' },
              { key: 'dairyFree', label: 'Dairy-Free / Plant Milk Preference' },
              { key: 'lowCarb', label: 'Low Carb / Keto Focus' },
              { key: 'organicProduce', label: 'Highlight Organic Farm Staples' },
            ].map((pref) => (
              <label
                key={pref.key}
                className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors cursor-pointer"
              >
                <span className="text-xs font-semibold text-[#131b2e]">{pref.label}</span>
                <input
                  type="checkbox"
                  checked={dietaryPrefs[pref.key as keyof typeof dietaryPrefs]}
                  onChange={(e) =>
                    setDietaryPrefs((prev) => ({
                      ...prev,
                      [pref.key]: e.target.checked,
                    }))
                  }
                  className="rounded text-[#006948] focus:ring-[#006948] w-4 h-4"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#bccac0]/20">
          <h2 className="text-base font-bold text-[#131b2e] mb-1">Measurement Systems</h2>
          <p className="text-xs text-[#3d4a42] mb-3">
            Choose metric grams/milliliters or US customary ounces/cups.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setKitchenUnits('metric')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                kitchenUnits === 'metric'
                  ? 'bg-[#006948] text-white shadow-xs'
                  : 'bg-[#f2f3ff] text-[#3d4a42] hover:bg-[#e2e7ff]'
              }`}
            >
              Metric (g, ml, kg)
            </button>
            <button
              type="button"
              onClick={() => setKitchenUnits('imperial')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                kitchenUnits === 'imperial'
                  ? 'bg-[#006948] text-white shadow-xs'
                  : 'bg-[#f2f3ff] text-[#3d4a42] hover:bg-[#e2e7ff]'
              }`}
            >
              Imperial (oz, lbs, cups)
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-[#bccac0]/20">
          <h2 className="text-base font-bold text-[#131b2e] mb-1">Default Household Servings</h2>
          <p className="text-xs text-[#3d4a42] mb-3">
            Initial portion count applied when opening any new recipe.
          </p>
          <div className="flex items-center gap-2">
            {[2, 4, 6, 8].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setDefaultServings(s)}
                className={`w-10 h-10 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  defaultServings === s
                    ? 'bg-[#6cf8bb] text-[#00714d] shadow-sm'
                    : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#e2e7ff]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#bccac0]/20 flex items-center justify-between">
          <span className="text-xs text-[#6d7a72]">Changes apply across all planning boards</span>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            {savedFeedback ? 'Saved!' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};
