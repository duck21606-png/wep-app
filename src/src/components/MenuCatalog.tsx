import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Recipe, NavTab } from '../types';

interface MenuCatalogProps {
  recipes: Recipe[];
  selectedRecipeIds: string[];
  onToggleRecipeSelect: (recipeId: string) => void;
  onCustomizeRecipe: (recipe: Recipe) => void;
  onNavigateTab: (tab: NavTab) => void;
  globalSearch: string;
  onGlobalSearchChange: (val: string) => void;
}

export const MenuCatalog: React.FC<MenuCatalogProps> = ({
  recipes,
  selectedRecipeIds,
  onToggleRecipeSelect,
  onCustomizeRecipe,
  onNavigateTab,
  globalSearch,
  onGlobalSearchChange,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'prepTime' | 'recentlyAdded'>('popular');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'all', label: 'All Recipes' },
    { id: 'quick-easy', label: 'Quick & Easy (<30m)' },
    { id: 'high-protein', label: 'High Protein' },
    { id: 'plant-based-vegan', label: 'Plant-Based / Vegan' },
    { id: 'low-carb-keto', label: 'Low Carb / Keto' },
    { id: 'comfort-food', label: 'Comfort Food' },
    { id: 'asian-japanese', label: 'Asian & Japanese' },
    { id: 'italian-pasta', label: 'Italian & Pasta' },
    { id: 'soups-bowls', label: 'Soups & Bowls' },
  ];

  // Close autocomplete on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsAutocompleteOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered and sorted recipes
  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((recipe) => {
        const matchesCategory =
          activeCategory === 'all' || recipe.categories.includes(activeCategory);

        const query = globalSearch.trim().toLowerCase();
        const matchesSearch =
          !query ||
          recipe.title.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query) ||
          recipe.categories.some((c) => c.toLowerCase().includes(query)) ||
          recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(query));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'prepTime') {
          return a.prepTimeMinutes - b.prepTimeMinutes;
        }
        if (sortBy === 'recentlyAdded') {
          return Number(b.id) - Number(a.id);
        }
        return Number(a.id) - Number(b.id);
      });
  }, [recipes, activeCategory, globalSearch, sortBy]);

  // Autocomplete matching items
  const autocompleteMatches = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];
    return recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [recipes, globalSearch]);

  const capacityCount = selectedRecipeIds.length;
  const capacityMax = 10;
  const capacityPercent = Math.min(100, Math.round((capacityCount / capacityMax) * 100));

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-24">
      {/* Top Banner & Capacity */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#006948] uppercase tracking-widest font-bold">
              Meal Planning Ritual
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#006948]/40"></span>
            <span className="text-xs text-[#3d4a42]">Active Week</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#131b2e] tracking-tight">
            Weekly Menu Catalog
          </h1>
          <p className="text-sm text-[#3d4a42] max-w-xl">
            Select meals for your week. You can add up to 10 recipes to plan your prep effortlessly.
          </p>
        </div>

        {/* Weekly Capacity Card */}
        <div className="flex items-center gap-4 self-start md:self-auto bg-white/70 p-3 rounded-2xl border border-[#bccac0]/25 shadow-xs">
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#3d4a42] font-medium">Weekly Capacity</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#e2e7ff] text-[#131b2e] text-xs font-semibold">
                <span className="text-[#006948] font-bold">{capacityCount}</span> / {capacityMax} Selected
              </span>
            </div>
            <div className="w-36 h-2 rounded-full bg-[#dae2fd] overflow-hidden">
              <div
                className="h-full bg-[#006948] transition-all duration-300 rounded-full"
                style={{ width: `${capacityPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Sort Panel */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white shadow-sm mb-8 flex flex-col gap-4 border border-[#bccac0]/20">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search with autocomplete */}
          <div className="relative flex-1 max-w-xl">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#6d7a72] text-xl pointer-events-none">
                search
              </span>
              <input
                ref={searchInputRef}
                type="text"
                autoComplete="off"
                value={globalSearch}
                onChange={(e) => {
                  onGlobalSearchChange(e.target.value);
                  setIsAutocompleteOpen(true);
                }}
                onFocus={() => {
                  if (globalSearch.trim().length > 0) setIsAutocompleteOpen(true);
                }}
                placeholder="Search recipes, ingredients, tags..."
                className="w-full bg-[#f2f3ff] pl-10 pr-10 py-2.5 rounded-xl text-sm text-[#131b2e] placeholder:text-[#6d7a72]/70 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006948]/20 transition-all"
              />
              {globalSearch && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    onGlobalSearchChange('');
                    setIsAutocompleteOpen(false);
                  }}
                  className="absolute right-3 text-[#6d7a72] hover:text-[#131b2e] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isAutocompleteOpen && autocompleteMatches.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-[#bccac0]/30 py-2 z-50 max-h-72 overflow-y-auto"
              >
                <div className="px-3.5 py-1.5 text-[11px] font-bold text-[#6d7a72] uppercase tracking-wider">
                  Suggested Recipes
                </div>
                <div className="flex flex-col">
                  {autocompleteMatches.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onGlobalSearchChange(item.title);
                        setIsAutocompleteOpen(false);
                      }}
                      className="w-full px-3.5 py-2 flex items-center gap-3 text-left hover:bg-[#e2e7ff] transition-colors focus:outline-none cursor-pointer"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#131b2e]">{item.title}</span>
                        <span className="text-[11px] text-[#3d4a42]">{item.time} • {item.dietaryBadge}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <span className="text-xs font-semibold text-[#3d4a42]">Sort:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold pl-3 pr-8 py-2.5 rounded-xl focus:outline-none cursor-pointer transition-colors"
              >
                <option value="popular">Popular First</option>
                <option value="prepTime">Prep Time</option>
                <option value="recentlyAdded">Recently Added</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[#6d7a72] pointer-events-none text-base">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Filter Pills scroll area */}
        <div className="relative w-full">
          <div className="overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-2 py-1 px-0.5">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-white font-semibold shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recipe Cards Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-20">
          {filteredRecipes.map((recipe) => {
            const isSelected = selectedRecipeIds.includes(recipe.id);
            const selectionRank = selectedRecipeIds.indexOf(recipe.id) + 1;

            return (
              <div
                key={recipe.id}
                className="group rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden border border-[#bccac0]/20 cursor-pointer relative"
                onClick={() => onToggleRecipeSelect(recipe.id)}
              >
                {/* Image Banner */}
                <div className="relative w-full h-52 overflow-hidden bg-[#eaedff]">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Selection Status Badge */}
                  {isSelected ? (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#006948] text-xs font-semibold shadow-xs">
                      <span className="material-symbols-outlined text-sm font-bold text-[#006948]">
                        check_circle
                      </span>
                      <span>Selected (#{selectionRank})</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleRecipeSelect(recipe.id);
                      }}
                      className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-[#3d4a42] hover:text-[#006948] text-xs font-medium shadow-xs transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      <span>Add to Plan</span>
                    </button>
                  )}

                  {/* Dietary Badge */}
                  <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#3d4a42] text-xs font-medium">
                    {recipe.dietaryBadge}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col justify-between flex-1 gap-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[#3d4a42] text-xs">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-[#6d7a72]">
                          schedule
                        </span>
                        {recipe.time}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-[#6d7a72]">
                          restaurant
                        </span>
                        {recipe.servings} servings
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-[#131b2e] tracking-tight group-hover:text-[#006948] transition-colors">
                      {recipe.title}
                    </h2>

                    <p className="text-xs text-[#3d4a42] line-clamp-2 leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-2 border-t border-[#bccac0]/20 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCustomizeRecipe(recipe);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006948] hover:text-[#00855d] transition-colors p-1 rounded-md hover:bg-[#6cf8bb]/20 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">tune</span>
                      <span>Customize Recipe</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleRecipeSelect(recipe.id);
                      }}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#6cf8bb]/40 text-[#00714d] hover:bg-[#6cf8bb]/70'
                          : 'bg-[#f2f3ff] text-[#3d4a42] hover:bg-[#e2e7ff]'
                      }`}
                    >
                      {isSelected ? 'In Meal Plan' : '+ Add Recipe'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm text-center mb-28 border border-[#bccac0]/20">
          <div className="w-16 h-16 rounded-full bg-[#e2e7ff] flex items-center justify-center text-[#006948] mb-4">
            <span className="material-symbols-outlined text-3xl">filter_list_off</span>
          </div>
          <h3 className="text-lg font-bold text-[#131b2e] mb-1">No recipes found for this filter</h3>
          <p className="text-sm text-[#3d4a42] max-w-md mb-6">
            Try choosing another dietary category or clearing your current search keywords.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              onGlobalSearchChange('');
            }}
            className="px-5 py-2.5 rounded-lg bg-[#006948] text-white text-xs font-semibold hover:bg-[#00855d] transition-all shadow-sm cursor-pointer"
          >
            Reset to All Recipes
          </button>
        </div>
      )}

      {/* Floating Cart FAB pinned bottom-right */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          type="button"
          onClick={() => onNavigateTab('shopping-list')}
          aria-label="View shopping list"
          className="relative w-14 h-14 rounded-full bg-[#006948] hover:bg-[#00855d] text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">shopping_cart</span>
          {capacityCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-xs font-bold w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
              {capacityCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
