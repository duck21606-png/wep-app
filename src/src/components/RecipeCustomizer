import React, { useState } from 'react';
import { Recipe, RecipeIngredient } from '../types';

interface RecipeCustomizerProps {
  recipe: Recipe;
  recipes: Recipe[];
  onSelectRecipeToCustomize: (recipe: Recipe) => void;
  onBackToCatalog: () => void;
  onSaveRecipe: (updatedRecipe: Recipe) => void;
}

export const RecipeCustomizer: React.FC<RecipeCustomizerProps> = ({
  recipe,
  recipes,
  onSelectRecipeToCustomize,
  onBackToCatalog,
  onSaveRecipe,
}) => {
  // Current servings state (default to 6 for the Tuscan Chicken screen look, or recipe.servings)
  const [servings, setServings] = useState<number>(recipe.servings || 6);

  // Swapped ingredients state mapping: ingredientId -> swapName (or 'original')
  const [swaps, setSwaps] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    recipe.ingredients.forEach((ing) => {
      initial[ing.id] = ing.selectedSwap || 'original';
    });
    return initial;
  });

  // Accordion drawer toggle
  const [isNutritionOpen, setIsNutritionOpen] = useState<boolean>(false);

  // Scaling math
  const scaleRatio = servings / recipe.baseServings;
  const multiplierText = `${scaleRatio.toFixed(2)}x Yield`;

  // Calculated batch weight and liquid volume
  const batchWeight = (recipe.baseBatchWeightKg * scaleRatio).toFixed(1);
  const liquidVolume = (recipe.baseLiquidVolumeL * scaleRatio).toFixed(1);

  // Quick preset pills
  const presets = [2, 4, 6, 8, 12];

  const handleServingChange = (newVal: number) => {
    if (newVal < 1) return;
    if (newVal > 24) return;
    setServings(newVal);
  };

  const handleSwapChange = (ingredientId: string, swapValue: string) => {
    setSwaps((prev) => ({
      ...prev,
      [ingredientId]: swapValue,
    }));
  };

  const handleResetToOriginal = () => {
    setServings(recipe.baseServings);
    const resetSwaps: Record<string, string> = {};
    recipe.ingredients.forEach((ing) => {
      resetSwaps[ing.id] = 'original';
    });
    setSwaps(resetSwaps);
  };

  const handleSave = () => {
    // Clone recipe with updated servings and swapped selections
    const updatedIngredients: RecipeIngredient[] = recipe.ingredients.map((ing) => ({
      ...ing,
      selectedSwap: swaps[ing.id] || 'original',
    }));

    const updatedRecipe: Recipe = {
      ...recipe,
      servings,
      ingredients: updatedIngredients,
    };

    onSaveRecipe(updatedRecipe);
  };

  // Helper to compute scaled amount for ingredient
  const getScaledAmountString = (ing: RecipeIngredient): string => {
    const scaled = Math.round(ing.baseAmount * scaleRatio);
    if (ing.unit.includes('cloves')) {
      const cloves = Math.max(2, Math.round(ing.baseAmount * scaleRatio));
      return `${cloves} cloves (crushed)`;
    }
    if (ing.unit === 'g') {
      return `${scaled.toLocaleString()} g`;
    }
    if (ing.unit === 'ml') {
      return `${scaled.toLocaleString()} ml`;
    }
    return `${scaled} ${ing.unit}`;
  };

  // Helper to get guidance note
  const getGuidanceNote = (ing: RecipeIngredient): { note: string; isCustom: boolean } => {
    const selectedSwapName = swaps[ing.id];
    if (!selectedSwapName || selectedSwapName === 'original') {
      return { note: ing.defaultNote, isCustom: false };
    }
    const foundSwap = ing.swaps.find((s) => s.name === selectedSwapName);
    if (foundSwap) {
      return { note: `${foundSwap.name}: ${foundSwap.note}`, isCustom: true };
    }
    return { note: ing.defaultNote, isCustom: false };
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-24">
      {/* Decorative ambient backdrop glow */}
      <div className="relative w-full">
        <div className="absolute -top-12 right-1/4 w-96 h-96 bg-[#68dba9]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-48 left-10 w-72 h-72 bg-[#ffddb8]/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header & Breadcrumb Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <button
              onClick={onBackToCatalog}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006948] hover:text-[#00855d] transition-colors w-fit cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span>Back to Menu Catalog</span>
            </button>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              <h1 className="text-2xl sm:text-3xl lg:text-[28px] font-bold text-[#131b2e] tracking-tight">
                Recipe Customizer: {recipe.title}
              </h1>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#6cf8bb]/50 text-[#00714d] text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006948] animate-pulse"></span>
                Batch Scale &amp; Ingredient Adjustments
              </span>
            </div>

            <p className="text-sm text-[#3d4a42] max-w-2xl">
              Scale serving yields proportionately or replace core components to suit dietary preferences and pan capacities.
            </p>
          </div>

          {/* Action Bar & Recipe Selector */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
            {/* Quick Switch Recipe Dropdown */}
            <div className="relative">
              <select
                value={recipe.id}
                onChange={(e) => {
                  const target = recipes.find((r) => r.id === e.target.value);
                  if (target) onSelectRecipeToCustomize(target);
                }}
                className="appearance-none bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold pl-3 pr-8 py-2.5 rounded-lg border border-[#bccac0]/30 cursor-pointer"
              >
                {recipes.map((r) => (
                  <option key={r.id} value={r.id}>
                    Recipe: {r.title}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[#6d7a72] pointer-events-none text-base">
                unfold_more
              </span>
            </div>

            <button
              onClick={handleResetToOriginal}
              type="button"
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-[#3d4a42] hover:bg-[#e2e7ff] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">restart_alt</span>
              <span>Reset to Original</span>
            </button>

            <button
              onClick={handleSave}
              type="button"
              className="px-5 py-2.5 rounded-lg bg-[#006948] text-white text-xs font-bold shadow-md hover:bg-[#00855d] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">check</span>
              <span>Save Recipe</span>
            </button>
          </div>
        </div>

        {/* Recipe Banner Card with Tactile Metadata */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
          <div className="lg:col-span-8 bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center border border-[#bccac0]/20">
            <div className="w-full sm:w-44 h-36 rounded-lg overflow-hidden shrink-0 relative bg-[#eaedff]">
              <img
                src={recipe.bannerImage || recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#283044]/80 text-white text-[11px] font-semibold">
                Prep: {recipe.prepTimeMinutes}m
              </span>
            </div>

            <div className="flex flex-col justify-between w-full h-full py-1">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-[#006948] font-bold">
                    Base Profile
                  </span>
                  <span className="text-xs text-[#6d7a72]">{recipe.baseProfile}</span>
                </div>
                <h2 className="text-lg font-bold text-[#131b2e] mt-0.5">
                  {recipe.subtitle}
                </h2>
                <p className="text-xs text-[#3d4a42] mt-1 line-clamp-2">
                  {recipe.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3 pt-2">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-[#eaedff] text-xs text-[#3d4a42] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Scale Summary Stat Metric */}
          <div className="lg:col-span-4 bg-white rounded-xl p-4 shadow-sm flex flex-col justify-between border border-[#bccac0]/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#3d4a42] uppercase tracking-wider font-semibold">
                Scale Factor
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#6cf8bb] text-[#00714d] font-bold">
                {multiplierText}
              </span>
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#006948]">
                  {servings}
                </span>
                <span className="text-lg font-semibold text-[#131b2e]">
                  Dinner Plates
                </span>
              </div>
              <p className="text-xs text-[#3d4a42]">
                Dynamic recalculation active across all pantry weights.
              </p>
            </div>

            <div className="w-full bg-[#e2e7ff] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#006948] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((servings / 12) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Portion & Batch Volume Controls */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6 border border-[#bccac0]/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#131b2e]">
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
            <div className="md:col-span-6 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#131b2e]">Servings Count</label>
              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                <div className="flex items-center bg-[#f2f3ff] rounded-lg p-1">
                  <button
                    type="button"
                    aria-label="Decrease servings"
                    onClick={() => handleServingChange(servings - 1)}
                    disabled={servings <= 1}
                    className="w-9 h-9 rounded-md bg-white shadow-xs flex items-center justify-center text-[#131b2e] hover:bg-[#eaedff] transition-colors disabled:opacity-40 cursor-pointer"
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
                    className="w-9 h-9 rounded-md bg-white shadow-xs flex items-center justify-center text-[#131b2e] hover:bg-[#eaedff] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                  </button>
                </div>

                {/* Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {presets.map((p) => {
                    const isActive = p === servings;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleServingChange(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#6cf8bb] text-[#00714d] font-bold shadow-xs'
                            : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff]'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Batch Target Weight & Volume */}
            <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Batch Target Weight */}
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
                    value={`${batchWeight} kg`}
                    className="w-full bg-[#f2f3ff] rounded-lg px-4 py-2 text-[#131b2e] font-bold text-base focus:outline-none shadow-inner"
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
                    value={`${liquidVolume} L`}
                    className="w-full bg-[#f2f3ff] rounded-lg px-4 py-2 text-[#131b2e] font-bold text-base focus:outline-none shadow-inner"
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
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-[#bccac0]/20">
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white border-b border-[#bccac0]/15">
            <div>
              <h2 className="text-lg font-bold text-[#131b2e]">
                Ingredients &amp; Smart Substitutions
              </h2>
              <p className="text-xs text-[#3d4a42]">
                Switch individual pantry components while keeping the seasoning ratios cohesive.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#eaedff] text-[#3d4a42] text-xs font-semibold">
                {recipe.ingredients.length} Scaled Items
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f2f3ff] text-[#3d4a42] text-xs font-semibold">
                  <th className="py-3 px-6" scope="col">Ingredient</th>
                  <th className="py-3 px-4" scope="col">Adjusted Amount</th>
                  <th className="py-3 px-4" scope="col">Swap Ingredient</th>
                  <th className="py-3 px-6" scope="col">Notes &amp; Culinary Guidance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bccac0]/15 text-sm text-[#131b2e]">
                {recipe.ingredients.map((ing, idx) => {
                  const guidance = getGuidanceNote(ing);
                  const currentSwap = swaps[ing.id] || 'original';

                  return (
                    <tr
                      key={ing.id}
                      className={`hover:bg-[#f2f3ff]/50 transition-colors ${
                        idx % 2 === 1 ? 'bg-white' : 'bg-[#faf8ff]'
                      }`}
                    >
                      {/* Ingredient Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#6cf8bb]/30 flex items-center justify-center text-[#006c49] shrink-0">
                            <span className="material-symbols-outlined text-lg">{ing.icon}</span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-[#131b2e]">{ing.name}</div>
                            <div className="text-xs text-[#3d4a42]">{ing.subtext}</div>
                          </div>
                        </div>
                      </td>

                      {/* Adjusted Amount Column */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-base font-bold text-[#006948]">
                          {getScaledAmountString(ing)}
                        </span>
                      </td>

                      {/* Swap Ingredient Column */}
                      <td className="py-4 px-4">
                        <div className="relative w-full min-w-[200px] max-w-xs">
                          <select
                            value={currentSwap}
                            onChange={(e) => handleSwapChange(ing.id, e.target.value)}
                            className="w-full bg-[#f2f3ff] hover:bg-[#eaedff] py-2 px-3 pr-8 rounded-lg text-[#131b2e] text-xs font-medium appearance-none focus:outline-none focus:bg-white transition-all cursor-pointer border border-transparent focus:border-[#006948]/30"
                          >
                            <option value="original">Swap Ingredient...</option>
                            {ing.swaps.map((sw) => (
                              <option key={sw.name} value={sw.name}>
                                {sw.label}
                              </option>
                            ))}
                          </select>
                          <span className="material-symbols-outlined absolute right-2.5 top-2.5 pointer-events-none text-[#6d7a72] text-base">
                            expand_more
                          </span>
                        </div>
                      </td>

                      {/* Culinary Guidance Note Column */}
                      <td className="py-4 px-6">
                        <span className="text-xs text-[#3d4a42] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#006948] shrink-0"></span>
                          <span>{guidance.note}</span>
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
        <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 border border-[#bccac0]/20">
          <button
            type="button"
            aria-expanded={isNutritionOpen}
            onClick={() => setIsNutritionOpen(!isNutritionOpen)}
            className="w-full p-6 flex items-center justify-between hover:bg-[#f2f3ff]/40 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#eaedff] flex items-center justify-center text-[#006948]">
                <span className="material-symbols-outlined text-xl">analytics</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#131b2e]">
                  View Detailed Nutrition Breakdown
                </h3>
                <p className="text-xs text-[#3d4a42]">
                  Real-time macro estimates per serving for current portion sizes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[#006948] font-bold hidden sm:inline-block">
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

          {/* Accordion Content */}
          {isNutritionOpen && (
            <div className="px-6 pb-6 pt-2 bg-white border-t border-[#bccac0]/15">
              <div className="p-3.5 rounded-xl bg-[#f2f3ff] mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-[#3d4a42]">
                  Values based on 1 plate (1/{servings}th total batch yield)
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-[#006948] font-bold">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  Chef Calibrated Balance
                </span>
              </div>

              {/* Macro Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {/* Calories */}
                <div className="bg-[#faf8ff] p-4 rounded-xl border border-[#bccac0]/15 flex flex-col items-center text-center">
                  <span className="text-[11px] uppercase tracking-wider text-[#6d7a72] font-semibold">
                    Energy
                  </span>
                  <div className="text-2xl font-bold text-[#131b2e] mt-1">
                    {recipe.nutrition.calories}
                  </div>
                  <span className="text-[11px] text-[#3d4a42]">kcal</span>
                  <div className="w-full bg-[#e2e7ff] rounded-full h-1.5 mt-3">
                    <div className="bg-[#006948] h-full rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

                {/* Protein */}
                <div className="bg-[#faf8ff] p-4 rounded-xl border border-[#bccac0]/15 flex flex-col items-center text-center">
                  <span className="text-[11px] uppercase tracking-wider text-[#6d7a72] font-semibold">
                    Protein
                  </span>
                  <div className="text-2xl font-bold text-[#006948] mt-1">
                    {recipe.nutrition.protein}
                    <span className="text-xs font-normal">g</span>
                  </div>
                  <span className="text-[11px] text-[#3d4a42]">High density</span>
                  <div className="w-full bg-[#e2e7ff] rounded-full h-1.5 mt-3">
                    <div className="bg-[#6cf8bb] h-full rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>

                {/* Carbs */}
                <div className="bg-[#faf8ff] p-4 rounded-xl border border-[#bccac0]/15 flex flex-col items-center text-center">
                  <span className="text-[11px] uppercase tracking-wider text-[#6d7a72] font-semibold">
                    Carbohydrates
                  </span>
                  <div className="text-2xl font-bold text-[#131b2e] mt-1">
                    {recipe.nutrition.carbs}
                    <span className="text-xs font-normal">g</span>
                  </div>
                  <span className="text-[11px] text-[#3d4a42]">Low glycemic</span>
                  <div className="w-full bg-[#e2e7ff] rounded-full h-1.5 mt-3">
                    <div className="bg-[#bccac0] h-full rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>

                {/* Fat */}
                <div className="bg-[#faf8ff] p-4 rounded-xl border border-[#bccac0]/15 flex flex-col items-center text-center">
                  <span className="text-[11px] uppercase tracking-wider text-[#6d7a72] font-semibold">
                    Healthy Fats
                  </span>
                  <div className="text-2xl font-bold text-[#825100] mt-1">
                    {recipe.nutrition.fat}
                    <span className="text-xs font-normal">g</span>
                  </div>
                  <span className="text-[11px] text-[#3d4a42]">Olive oil &amp; cream</span>
                  <div className="w-full bg-[#e2e7ff] rounded-full h-1.5 mt-3">
                    <div className="bg-[#ffb95f] h-full rounded-full" style={{ width: '55%' }}></div>
                  </div>
                </div>

                {/* Fiber */}
                <div className="col-span-2 sm:col-span-1 bg-[#faf8ff] p-4 rounded-xl border border-[#bccac0]/15 flex flex-col items-center text-center">
                  <span className="text-[11px] uppercase tracking-wider text-[#6d7a72] font-semibold">
                    Dietary Fiber
                  </span>
                  <div className="text-2xl font-bold text-[#131b2e] mt-1">
                    {recipe.nutrition.fiber}
                    <span className="text-xs font-normal">g</span>
                  </div>
                  <span className="text-[11px] text-[#3d4a42]">Greens &amp; sun-dried</span>
                  <div className="w-full bg-[#e2e7ff] rounded-full h-1.5 mt-3">
                    <div className="bg-[#6ffbbe] h-full rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>

              {/* Micronutrients & Allergens */}
              <div className="mt-4 pt-3 border-t border-[#bccac0]/15 flex flex-wrap items-center justify-between text-xs text-[#3d4a42] gap-3">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#006948]"></span>
                    Sodium: {recipe.nutrition.sodium}mg
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#825100]"></span>
                    Potassium: {recipe.nutrition.potassium}mg
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#68dba9]"></span>
                    Calcium: {recipe.nutrition.calciumDV}% DV
                  </span>
                </div>
                <div className="text-[11px] text-[#6d7a72] font-medium">
                  {recipe.nutrition.allergens}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
