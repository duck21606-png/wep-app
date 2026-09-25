import React, { useState } from 'react';
import { Recipe } from '../data/recipes';

interface RecipeCustomizerProps {
  recipe: Recipe;
  allRecipes: Recipe[];
  onSelectRecipeToCustomize: (r: Recipe) => void;
  onBackToCatalog: () => void;
  onSaveCustomization?: (recipeId: number, servings: number, swaps: Record<string, string>) => void;
}

export const RecipeCustomizer: React.FC<RecipeCustomizerProps> = ({
  recipe,
  allRecipes,
  onSelectRecipeToCustomize,
  onBackToCatalog,
  onSaveCustomization,
}) => {
  // Base servings standard baseline
  const baseServings = 4;
  const [servings, setServings] = useState<number>(recipe.defaultServings || 6);

  // Ingredient swap selections: ingredientId -> chosen swap option value
  const [swaps, setSwaps] = useState<Record<string, string>>({});

  // Accordion state
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Scale ratio
  const ratio = servings / baseServings;
  const multiplierText = `${ratio.toFixed(2)}x Yield`;
  const yieldProgressPct = Math.min(100, Math.round((servings / 12) * 100));

  // Batch weight & liquid volume calculation
  const weightKg = (recipe.baseWeightPerServingKg * servings).toFixed(1);
  const liquidL = (recipe.baseLiquidPerServingL * servings).toFixed(1);

  const presets = [2, 4, 6, 8, 12];

  const handleServingChange = (val: number) => {
    if (val < 1) val = 1;
    if (val > 24) val = 24;
    setServings(val);
  };

  const handleSwapChange = (ingredientId: string, swapVal: string) => {
    setSwaps((prev) => ({
      ...prev,
      [ingredientId]: swapVal,
    }));
  };

  const handleReset = () => {
    setServings(recipe.defaultServings || 4);
    setSwaps({});
    showToast('Reset to original standard recipe proportions');
  };

  const handleSave = () => {
    if (onSaveCustomization) {
      onSaveCustomization(recipe.id, servings, swaps);
    }
    showToast('Customization Saved: Scaled ingredients ready for prep.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-24 relative">
      {/* Decorative ambient backdrop glow */}
      <div className="absolute -top-12 right-1/4 w-96 h-96 bg-[#68dba9]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-48 left-10 w-72 h-72 bg-[#ffddb8]/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header & Breadcrumb Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 relative z-10">
        <div className="flex flex-col gap-1.5">
          <button
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006948] hover:text-[#00855d] transition-colors w-fit cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Menu Catalog</span>
          </button>

          <div className="flex flex-wrap items-center gap-3 mt-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight">
              Recipe Customizer: {recipe.title}
            </h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#6cf8bb]/40 text-[#00714d] text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006948] animate-pulse"></span>
              Batch Scale &amp; Ingredient Adjustments
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-[#6d7a72]">Switch recipe:</span>
            <select
              value={recipe.id}
              onChange={(e) => {
                const target = allRecipes.find((r) => r.id === parseInt(e.target.value));
                if (target) {
                  onSelectRecipeToCustomize(target);
                  setServings(target.defaultServings);
                  setSwaps({});
                }
              }}
              className="bg-white border border-[#bccac0]/40 rounded-lg text-xs font-medium py-1 px-2.5 text-[#131b2e] focus:outline-none focus:ring-1 focus:ring-[#006948]"
            >
              {allRecipes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-[#3d4a42] max-w-2xl mt-1">
            Scale serving yields proportionately or replace core components to suit dietary preferences and pan capacities.
          </p>
        </div>

        {/* Action Bar (Reset & Save) */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 mt-2 md:mt-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#3d4a42] hover:bg-[#e2e7ff] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">restart_alt</span>
            <span>Reset to Original</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-lg bg-[#006948] text-white text-sm font-semibold shadow-md hover:bg-[#00855d] transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">check</span>
            <span>Save Recipe</span>
          </button>
        </div>
      </div>

      {/* Recipe Banner Card with Tactile Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6 relative z-10">
        {/* Banner Left */}
        <div className="lg:col-span-8 bg-white rounded-xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-center border border-[#bccac0]/20">
          <div className="w-full sm:w-44 h-36 rounded-lg overflow-hidden shrink-0 relative bg-[#eaedff]">
            <img
              src={recipe.bannerImage || recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#283044]/80 text-white text-[11px] font-medium backdrop-blur-xs">
              Prep: {recipe.prepTime}
            </span>
          </div>

          <div className="flex flex-col justify-between w-full h-full py-1">
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-[#006948] font-bold">
                  Base Profile
                </span>
                <span className="text-xs text-[#6d7a72]">
                  {recipe.baseProfile || 'Chef Signature'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#131b2e] mt-0.5">
                {recipe.bannerTitle || recipe.title}
              </h2>
              <p className="text-xs text-[#3d4a42] mt-1 line-clamp-2 leading-relaxed">
                {recipe.bannerSubtitle || recipe.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3 pt-2">
              {(recipe.bannerTags || ['High-Protein', 'Gluten-Free Base', 'Keto-Friendly']).map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-[#f2f3ff] text-xs text-[#3d4a42] font-medium"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Quick Scale Summary Stat Metric */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between border border-[#bccac0]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#3d4a42] uppercase tracking-wider font-semibold">
              Scale Factor
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#6cf8bb] text-[#00714d] font-bold">
              {multiplierText}
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#006948]">{servings}</span>
              <span className="text-lg font-semibold text-[#131b2e]">Dinner Plates</span>
            </div>
            <p className="text-xs text-[#3d4a42] mt-0.5">
              Dynamic recalculation active across all pantry weights.
            </p>
          </div>

          <div className="w-full bg-[#e2e7ff] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#006948] h-full rounded-full transition-all duration-300"
              style={{ width: `${yieldProgressPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Portion & Batch Volume Controls */}
      <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm mb-6 border border-[#bccac0]/20 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-[#131b2e]">
              Portion &amp; Batch Volume Controls
            </h2>
            <p className="text-xs text-[#3d4a42]">
              Adjust serving headcount to scale quantities or cap inputs according to vessel size.
            </p>
          </div>
          <span className="material-symbols-outlined text-[#6d7a72]">tune</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Servings Stepper & Presets */}
          <div className="md:col-span-6 flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#131b2e]">Servings Count</label>
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              <div className="flex items-center bg-[#f2f3ff] rounded-lg p-1">
                <button
                  type="button"
                  aria-label="Decrease servings"
                  onClick={() => handleServingChange(servings - 1)}
                  disabled={servings <= 1}
                  className="w-9 h-9 rounded-md bg-white shadow-sm flex items-center justify-center text-[#131b2e] hover:bg-[#eaedff] transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">remove</span>
                </button>
                <div className="w-28 text-center">
                  <span className="text-lg font-bold text-[#131b2e]">{servings}</span>
                  <span className="text-xs text-[#3d4a42] ml-1">Servings</span>
                </div>
                <button
                  type="button"
                  aria-label="Increase servings"
                  onClick={() => handleServingChange(servings + 1)}
                  className="w-9 h-9 rounded-md bg-white shadow-sm flex items-center justify-center text-[#131b2e] hover:bg-[#eaedff] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {presets.map((preset) => {
                  const isMatching = servings === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleServingChange(preset)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isMatching
                          ? 'bg-[#6cf8bb] text-[#00714d] font-bold shadow-sm'
                          : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#dae2fd] font-medium'
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Batch Target Weight & Volume */}
          <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Weight */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#131b2e]">Batch Target Weight</label>
                <span className="px-2 py-0.5 rounded-md bg-[#e2e7ff] text-[#3d4a42] text-[11px] font-medium">
                  Max 100 kg
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  readOnly
                  value={`${weightKg} kg`}
                  className="w-full bg-[#f2f3ff] rounded-lg px-3.5 py-2 text-[#131b2e] font-bold text-base focus:outline-none"
                />
                <span className="material-symbols-outlined absolute right-3 text-[#6d7a72] pointer-events-none text-lg">
                  scale
                </span>
              </div>
            </div>

            {/* Liquid Volume */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#131b2e]">Liquid Volume</label>
                <span className="px-2 py-0.5 rounded-md bg-[#e2e7ff] text-[#3d4a42] text-[11px] font-medium">
                  Max 5 L
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  readOnly
                  value={`${liquidL} L`}
                  className="w-full bg-[#f2f3ff] rounded-lg px-3.5 py-2 text-[#131b2e] font-bold text-base focus:outline-none"
                />
                <span className="material-symbols-outlined absolute right-3 text-[#6d7a72] pointer-events-none text-lg">
                  water_drop
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients & Substitution Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-[#bccac0]/20 relative z-10">
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white border-b border-[#bccac0]/20">
          <div>
            <h2 className="text-base font-semibold text-[#131b2e]">
              Ingredients &amp; Smart Substitutions
            </h2>
            <p className="text-xs text-[#3d4a42]">
              Switch individual pantry components while keeping the seasoning ratios cohesive.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-full bg-[#f2f3ff] text-[#3d4a42] text-xs font-medium">
              {recipe.ingredients.length} Scaled Items
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f2f3ff] text-[#3d4a42] text-xs font-semibold">
                <th className="py-3 px-5" scope="col">
                  Ingredient
                </th>
                <th className="py-3 px-4" scope="col">
                  Adjusted Amount
                </th>
                <th className="py-3 px-4" scope="col">
                  Swap Ingredient
                </th>
                <th className="py-3 px-5" scope="col">
                  Notes &amp; Culinary Guidance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bccac0]/15 text-sm text-[#131b2e]">
              {recipe.ingredients.map((ing) => {
                const scaledAmount = Math.round(ing.baseAmount * servings);
                const displayAmount = ing.displayFormat
                  ? ing.displayFormat(scaledAmount, servings)
                  : `${scaledAmount.toLocaleString()} ${ing.unit}`;

                const chosenSwapVal = swaps[ing.id] || 'original';
                const chosenSwapObj = ing.swaps.find((s) => s.value === chosenSwapVal);

                return (
                  <tr key={ing.id} className="hover:bg-[#f2f3ff]/50 transition-colors">
                    {/* Ingredient name + icon */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#6cf8bb]/40 flex items-center justify-center text-[#006c49] shrink-0">
                          <span className="material-symbols-outlined text-lg">{ing.icon}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#131b2e]">
                            {chosenSwapObj ? chosenSwapObj.value : ing.name}
                          </div>
                          <div className="text-xs text-[#3d4a42]">{ing.subtitle}</div>
                        </div>
                      </div>
                    </td>

                    {/* Adjusted amount */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-base font-bold text-[#006948]">{displayAmount}</span>
                    </td>

                    {/* Swap dropdown */}
                    <td className="py-4 px-4">
                      <div className="relative w-full max-w-xs">
                        <select
                          value={chosenSwapVal}
                          onChange={(e) => handleSwapChange(ing.id, e.target.value)}
                          className="w-full bg-[#f2f3ff] py-2 px-3 pr-8 rounded-lg text-[#131b2e] text-xs font-semibold appearance-none focus:outline-none focus:bg-white border border-transparent focus:border-[#006948]/30 transition-all cursor-pointer"
                        >
                          <option value="original">Swap Ingredient...</option>
                          {ing.swaps.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-2.5 top-2.5 pointer-events-none text-[#6d7a72] text-base">
                          expand_more
                        </span>
                      </div>
                    </td>

                    {/* Culinary notes */}
                    <td className="py-4 px-5">
                      <span className="text-xs text-[#3d4a42] flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            chosenSwapObj ? 'bg-[#006c49]' : 'bg-[#006948]'
                          }`}
                        ></span>
                        {chosenSwapObj ? (
                          <span>
                            <strong className="font-semibold text-[#131b2e]">
                              {chosenSwapObj.value}:
                            </strong>{' '}
                            {chosenSwapObj.note}
                          </span>
                        ) : (
                          ing.defaultNote
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collapsible Nutrition Panel (Accordion Drawer) */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bccac0]/20 transition-all duration-300 relative z-10">
        <button
          type="button"
          onClick={() => setIsNutritionOpen(!isNutritionOpen)}
          aria-expanded={isNutritionOpen}
          className="w-full p-5 sm:p-6 flex items-center justify-between hover:bg-[#f2f3ff]/40 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#eaedff] flex items-center justify-center text-[#006948]">
              <span className="material-symbols-outlined text-xl">analytics</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#131b2e]">
                View Detailed Nutrition Breakdown
              </h3>
              <p className="text-xs text-[#3d4a42]">
                Real-time macro estimates per serving for current portion sizes.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#006948] hidden sm:inline-block">
              {recipe.nutrition.calories} kcal / portion
            </span>
            <span
              className={`material-symbols-outlined text-[#6d7a72] transition-transform duration-300 ${
                isNutritionOpen ? 'rotate-180' : 'rotate-0'
              }`}
            >
              expand_more
            </span>
          </div>
        </button>

        {/* Drawer Content */}
        {isNutritionOpen && (
          <div className="px-5 sm:px-6 pb-6 pt-2 bg-white border-t border-[#bccac0]/15">
            <div className="p-3.5 rounded-xl bg-[#f2f3ff]/80 mb-4 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-[#3d4a42]">
                Values based on 1 plate (1/{servings}th total batch yield)
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[#006948] font-semibold">
                <span className="material-symbols-outlined text-sm">verified</span>
                Chef Calibrated Balance
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              {/* Calories */}
              <div className="bg-[#f2f3ff] p-4 rounded-xl flex flex-col items-center text-center">
                <span className="text-[11px] uppercase tracking-wider text-[#6d7a72] font-semibold">
                  Energy
                </span>
                <div className="text-2xl font-bold text-[#131b2e] mt-1">
                  {recipe.nutrition.calories}
                </div>
                <span className="text-[11px] text-[#3d4a42]">kcal</span>
                <div className="w-full bg-[#e2e7ff] rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className="bg-[#006948] h-full rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>

              {/* Protein */}
              <div className="bg-[#f2f3ff] p-4 rounded-xl flex flex-col items-center text-center">
                <span className="text-[11px] uppercase tracking-wider text-[#6d7a72] font-semibold">
                  Protein
                </span>
                <div className="text-2xl font-bold text-[#006948] mt-1">
                  {recipe.nutrition.protein}
                  <span className="text-xs font-normal">g</span>
                </div>
                <span className="text-[11px] text-[#3d4a42]">High density</span>
                <div className="w-full bg-[#e2e7ff] rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className="bg-[#6cf8bb] h-full rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>

              {/* Carbs */}
              <div className="bg-[#f2f3ff] p-4 rounded-xl flex flex-col items-center text-center">
                <span className="text-[11px] uppercase tracking-wider text-[#6d7a72] font-semibold">
                  Carbohydrates
                </span>
                <div className="text-2xl font-bold text-[#131b2e] mt-1">
                  {recipe.nutrition.carbs}
                  <span className="text-xs font-normal">g</span>
                </div>
                <span className="text-[11px] text-[#3d4a42]">Low glycemic</span>
                <div className="w-full bg-[#e2e7ff] rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className="bg-[#bccac0] h-full rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>

              {/* Fat */}
              <div className="bg-[#f2f3ff] p-4 rounded-xl flex flex-col items-center text-center">
                <span className="text-[11px] uppercase tracking-wider text-[#6d7a72] font-semibold">
                  Healthy Fats
                </span>
                <div className="text-2xl font-bold text-[#825100] mt-1">
                  {recipe.nutrition.fat}
                  <span className="text-xs font-normal">g</span>
                </div>
                <span className="text-[11px] text-[#3d4a42]">Olive oil &amp; cream</span>
                <div className="w-full bg-[#e2e7ff] rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className="bg-[#ffb95f] h-full rounded-full" style={{ width: '55%' }}></div>
                </div>
              </div>

              {/* Fiber */}
              <div className="col-span-2 sm:col-span-1 bg-[#f2f3ff] p-4 rounded-xl flex flex-col items-center text-center">
                <span className="text-[11px] uppercase tracking-wider text-[#6d7a72] font-semibold">
                  Dietary Fiber
                </span>
                <div className="text-2xl font-bold text-[#131b2e] mt-1">
                  {recipe.nutrition.fiber}
                  <span className="text-xs font-normal">g</span>
                </div>
                <span className="text-[11px] text-[#3d4a42]">Greens &amp; sun-dried</span>
                <div className="w-full bg-[#e2e7ff] rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className="bg-[#6ffbbe] h-full rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>

            {/* Inline Micronutrient & Allergen Bar */}
            <div className="mt-4 pt-3 flex flex-wrap items-center justify-between text-xs text-[#3d4a42] gap-3 border-t border-[#bccac0]/20">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#006948]"></span>
                  Sodium: {recipe.nutrition.sodium}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#825100]"></span>
                  Potassium: {recipe.nutrition.potassium}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
                  Calcium: {recipe.nutrition.calcium}
                </span>
              </div>
              <div className="text-[11px] text-[#6d7a72]">
                Allergens: {recipe.nutrition.allergens}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Save Toast */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-[#283044] text-[#eef0ff] px-5 py-3.5 rounded-xl shadow-xl transition-all duration-300">
          <span className="material-symbols-outlined text-[#6ffbbe] text-xl">check_circle</span>
          <div className="flex flex-col">
            <span className="text-xs font-semibold">{toastMessage}</span>
            <span className="text-[11px] opacity-80">Synced with weekly grocery shopping list.</span>
          </div>
        </div>
      )}
    </div>
  );
};
