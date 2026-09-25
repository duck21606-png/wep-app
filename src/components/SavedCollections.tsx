import React from 'react';
import { Recipe } from '../data/recipes';

interface SavedCollectionsProps {
  recipes: Recipe[];
  onOpenRecipeCustomizer: (recipe: Recipe) => void;
}

export const SavedCollections: React.FC<SavedCollectionsProps> = ({
  recipes,
  onOpenRecipeCustomizer,
}) => {
  const collections = [
    {
      id: 'quick-dinners',
      title: 'Quick Weeknight Dinners (<30m)',
      recipeCount: 3,
      tag: 'Speed & Ease',
      cover: recipes[0]?.image,
      recipesList: [recipes[0], recipes[2], recipes[3]],
    },
    {
      id: 'high-protein-prep',
      title: 'High Protein Sunday Meal Prep',
      recipeCount: 4,
      tag: 'Fitness & Macros',
      cover: recipes[4]?.image || recipes[0]?.image,
      recipesList: [recipes[0], recipes[2], recipes[4]],
    },
    {
      id: 'mindful-plant',
      title: 'Mindful Plant-Powered Suppers',
      recipeCount: 2,
      tag: 'Gut Health',
      cover: recipes[1]?.image,
      recipesList: [recipes[1], recipes[3]],
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-24">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#006948] uppercase tracking-widest">
            Recipe Vault
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#006948]/40"></span>
          <span className="text-xs text-[#3d4a42]">Curated Anthologies</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight">
          Saved Collections
        </h1>
        <p className="text-sm text-[#3d4a42]">
          Organized boards and curated menus for entertaining, seasonal prep, and mindful rituals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="rounded-2xl bg-white p-5 shadow-sm border border-[#bccac0]/25 flex flex-col justify-between hover:shadow-md transition-all group"
          >
            <div>
              <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4 bg-[#eaedff]">
                <img
                  src={col.cover}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-xs font-semibold text-[#006948] shadow-xs">
                  {col.tag}
                </span>
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-[11px] font-medium backdrop-blur-xs">
                  {col.recipeCount} recipes
                </span>
              </div>

              <h2 className="text-base font-bold text-[#131b2e] group-hover:text-[#006948] transition-colors">
                {col.title}
              </h2>
            </div>

            <div className="mt-4 pt-3 border-t border-[#bccac0]/20 flex items-center justify-between">
              <span className="text-xs text-[#3d4a42]">Last updated this week</span>
              <button
                type="button"
                onClick={() => col.recipesList[0] && onOpenRecipeCustomizer(col.recipesList[0])}
                className="text-xs font-bold text-[#006948] hover:text-[#00855d] flex items-center gap-1 cursor-pointer"
              >
                <span>Explore</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
