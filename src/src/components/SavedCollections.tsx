import React from 'react';
import { Recipe } from '../types';

interface SavedCollectionsProps {
  recipes: Recipe[];
  onSelectRecipeForCustomizer: (recipe: Recipe) => void;
  onShowToast: (message: string, sub?: string) => void;
}

export const SavedCollections: React.FC<SavedCollectionsProps> = ({
  recipes,
  onSelectRecipeForCustomizer,
  onShowToast,
}) => {
  const collections = [
    {
      id: 'c1',
      title: 'Mediterranean Weeknight Reset',
      recipeCount: 4,
      prepTime: '2.5 hrs total',
      tags: ['Olive Oil', 'High Protein', 'Gluten-Free Options'],
      description: 'Balanced low-inflammatory meals featuring Tuscan chicken cutlets, citrus salmon, and fresh greens.',
      image: recipes[0]?.image || '',
    },
    {
      id: 'c2',
      title: 'Slow Food Sunday Rituals',
      recipeCount: 3,
      prepTime: '3.0 hrs total',
      tags: ['Batch Cook', 'Comfort', 'Wine Braised'],
      description: 'Slow-cooked Burgundy beef bourguignon and carnaroli risotto meant for tranquil kitchen afternoons.',
      image: recipes[4]?.image || recipes[1]?.image || '',
    },
    {
      id: 'c3',
      title: 'Plant-Forward Vitality Bowls',
      recipeCount: 3,
      prepTime: '1.0 hr total',
      tags: ['Vegan', 'High Fiber', 'Quick Prep'],
      description: 'Crispy chickpeas, warm spiced grains, and tahini-dressed leafy bowls.',
      image: recipes[3]?.image || '',
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-24">
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#006948] uppercase tracking-widest font-bold">
            Curated Archives
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#006948]/40"></span>
          <span className="text-xs text-[#3d4a42]">Seasonal Menus</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#131b2e] tracking-tight">
          Saved Collections
        </h1>
        <p className="text-sm text-[#3d4a42] max-w-xl">
          Cookbook archives and ritual meal plans saved across your culinary calendar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="group rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden border border-[#bccac0]/20"
          >
            <div className="relative w-full h-48 overflow-hidden bg-[#eaedff]">
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#3d4a42] text-xs font-semibold">
                {col.recipeCount} Recipes
              </span>
            </div>

            <div className="p-5 flex flex-col justify-between flex-1 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold text-[#006948] uppercase tracking-wider">
                  {col.prepTime}
                </span>
                <h2 className="text-lg font-bold text-[#131b2e] tracking-tight">
                  {col.title}
                </h2>
                <p className="text-xs text-[#3d4a42] leading-relaxed">
                  {col.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {col.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-[#eaedff] text-[11px] text-[#3d4a42]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#bccac0]/15 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const r = recipes[0];
                    if (r) onSelectRecipeForCustomizer(r);
                  }}
                  className="text-xs font-bold text-[#006948] hover:text-[#00855d] flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Collection</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast('Collection shared with family group')}
                  className="p-1.5 rounded-lg text-[#6d7a72] hover:bg-[#eaedff] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">share</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
