import React, { useState, useMemo } from 'react';
import { Recipe } from '../data/recipes';

interface MenuCatalogProps {
  recipes: Recipe[];
  selectedRecipeIds: number[];
  onToggleRecipe: (id: number) => void;
  onCustomizeRecipe: (recipe: Recipe) => void;
  onGoToShoppingList: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const MenuCatalog: React.FC<MenuCatalogProps> = ({
  recipes,
  selectedRecipeIds,
  onToggleRecipe,
  onCustomizeRecipe,
  onGoToShoppingList,
  searchQuery,
  setSearchQuery,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);

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

  // Filter and sort recipes
  const filteredRecipes = useMemo(() => {
    let result = recipes.filter((recipe) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesCategory =
        activeCategory === 'all' ||
        recipe.categories.includes(activeCategory) ||
        (activeCategory === 'soups-bowls' && recipe.categories.includes('soups-bowls'));

      const matchesSearch =
        !q ||
        recipe.title.toLowerCase().includes(q) ||
        recipe.description.toLowerCase().includes(q) ||
        recipe.tag.toLowerCase().includes(q) ||
        recipe.categories.some((cat) => cat.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'time') {
      result = [...result].sort((a, b) => parseInt(a.prepTime) - parseInt(b.prepTime));
    } else if (sortBy === 'recent') {
      result = [...result].sort((a, b) => b.id - a.id);
    }

    return result;
  }, [recipes, activeCategory, searchQuery, sortBy]);

  // Autocomplete suggestions
  const autocompleteSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return recipes.filter((r) => r.title.toLowerCase().includes(q)).slice(0, 5);
  }, [recipes, searchQuery]);

  const selectedCount = selectedRecipeIds.length;
  const capacityPercent = Math.min(100, (selectedCount / 10) * 100);

  // Helper to get selected rank number
  const getSelectedRank = (id: number) => {
    const index = selectedRecipeIds.indexOf(id);
    return index !== -1 ? index + 1 : null;
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-24">
      {/* Top Banner: Meal Planning Ritual & Capacity */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#006948] uppercase tracking-widest">
              Meal Planning Ritual
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#006948]/40"></span>
            <span className="text-xs text-[#3d4a42]">Active Week</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#131b2e] tracking-tight">
            Weekly Menu Catalog
          </h1>
          <p className="text-sm text-[#3d4a42] max-w-xl">
            Select meals for your week. You can add up to 10 recipes to plan your prep effortlessly.
          </p>
        </div>

        {/* Capacity Bar */}
        <div className="flex items-center gap-4 self-start md:self-auto bg-white/70 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-[#bccac0]/25 shadow-xs">
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#3d4a42]">Weekly Capacity</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#e2e7ff] text-[#131b2e] text-xs font-semibold">
                <span className="text-[#006948] font-bold">{selectedCount}</span> / 10 Selected
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

      {/* Filter and Search Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white shadow-sm mb-8 flex flex-col gap-4 border border-[#bccac0]/20">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search Bar with Autocomplete */}
          <div className="relative flex-1 max-w-xl">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#6d7a72] text-xl pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsAutocompleteOpen(true);
                }}
                onFocus={() => setIsAutocompleteOpen(true)}
                placeholder="Search recipes, ingredients, tags..."
                className="w-full bg-[#f2f3ff] pl-10 pr-10 py-2.5 rounded-xl text-sm text-[#131b2e] placeholder:text-[#6d7a72]/70 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006948]/20 transition-all border border-transparent focus:border-[#006948]/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchQuery('');
                    setIsAutocompleteOpen(false);
                  }}
                  className="absolute right-3 text-[#6d7a72] hover:text-[#131b2e] transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>

            {/* Dropdown Suggestions */}
            {isAutocompleteOpen && autocompleteSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-[#bccac0]/30 py-2 z-50 max-h-72 overflow-y-auto">
                <div className="px-3.5 py-1.5 text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
                  Suggested Recipes
                </div>
                <div className="flex flex-col">
                  {autocompleteSuggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSearchQuery(item.title);
                        setIsAutocompleteOpen(false);
                      }}
                      className="w-full px-3.5 py-2 flex items-center gap-3 text-left hover:bg-[#e2e7ff] transition-colors cursor-pointer"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-8 h-8 rounded-md object-cover shrink-0"
                      />
                      <span className="text-sm text-[#131b2e] font-medium truncate">
                        {item.title}
                      </span>
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
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[#f2f3ff] text-[#131b2e] text-xs font-semibold pl-3 pr-8 py-2.5 rounded-xl focus:outline-none cursor-pointer border border-transparent focus:border-[#006948]/30"
              >
                <option value="popular">Popular First</option>
                <option value="time">Prep Time</option>
                <option value="recent">Recently Added</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-3 text-[#6d7a72] pointer-events-none text-base">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Categories Pills Bar */}
        <div className="relative w-full">
          <div className="overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-2 py-1 px-0.5">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white font-medium shadow-sm hover:bg-emerald-700'
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

      {/* Recipes Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filteredRecipes.map((recipe) => {
            const isSelected = selectedRecipeIds.includes(recipe.id);
            const rank = getSelectedRank(recipe.id);

            return (
              <div
                key={recipe.id}
                onClick={() => onToggleRecipe(recipe.id)}
                className={`group rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden border cursor-pointer ${
                  isSelected ? 'border-[#006948] ring-1 ring-[#006948]/30' : 'border-[#bccac0]/20'
                }`}
              >
                {/* Image & Badges */}
                <div className="relative w-full h-52 overflow-hidden bg-[#eaedff]">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#006948] text-xs font-semibold shadow-xs">
                      <span className="material-symbols-outlined text-sm font-bold text-[#006948]">
                        check_circle
                      </span>
                      <span>Selected (#{rank})</span>
                    </div>
                  )}

                  {/* Dietary / Category Badge */}
                  <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#3d4a42] text-xs font-medium shadow-xs">
                    {recipe.tag}
                  </span>
                </div>

                {/* Card Details */}
                <div className="p-5 flex flex-col gap-2 flex-1 justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[#3d4a42] text-xs font-medium">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-[#6d7a72]">
                          schedule
                        </span>
                        {recipe.prepTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-[#6d7a72]">
                          restaurant
                        </span>
                        {recipe.defaultServings} servings
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-[#131b2e] tracking-tight group-hover:text-[#006948] transition-colors">
                      {recipe.title}
                    </h2>

                    <p className="text-xs text-[#3d4a42] line-clamp-2 leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>

                  {/* Bottom Action strip */}
                  <div className="mt-3 pt-3 border-t border-[#bccac0]/20 flex items-center justify-between">
                    <span className="text-xs text-[#6d7a72]">
                      {isSelected ? (
                        <span className="text-[#006948] font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">check</span>
                          In Active Plan
                        </span>
                      ) : (
                        'Tap to select for week'
                      )}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCustomizeRecipe(recipe);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#f2f3ff] hover:bg-[#6cf8bb]/40 text-[#006948] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">tune</span>
                      <span>Customize</span>
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
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-lg bg-[#006948] text-white text-xs font-semibold hover:bg-[#00855d] transition-all cursor-pointer shadow-sm"
          >
            Reset to All Recipes
          </button>
        </div>
      )}

      {/* Floating Cart FAB pinned bottom-right */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          aria-label="View shopping list"
          onClick={onGoToShoppingList}
          className="relative w-14 h-14 rounded-full bg-[#006948] hover:bg-[#00855d] text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">shopping_cart</span>
          {selectedCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-xs font-bold w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
              {selectedCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
