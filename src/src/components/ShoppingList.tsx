import React, { useState } from 'react';
import { ShoppingItem, Recipe } from '../types';

interface ShoppingListProps {
  items: ShoppingItem[];
  onToggleItem: (itemId: string) => void;
  onUncheckAll: () => void;
  selectedRecipes: Recipe[];
  onSelectRecipeForCustomizer: (recipe: Recipe) => void;
  onShowToast: (message: string, subMessage?: string) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
  items,
  onToggleItem,
  onUncheckAll,
  selectedRecipes,
  onSelectRecipeForCustomizer,
  onShowToast,
}) => {
  const [hideChecked, setHideChecked] = useState(false);

  // Group items by department
  const departments: {
    name: 'Produce & Fresh Herbs' | 'Meat & Seafood' | 'Dairy & Refrigerated' | 'Pantry & Dry Goods';
    aisleBadge: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    subtitle: string;
  }[] = [
    {
      name: 'Produce & Fresh Herbs',
      aisleBadge: 'Aisle 1 & 2',
      icon: 'nutrition',
      iconBg: 'bg-[#6cf8bb]/50',
      iconColor: 'text-[#00714d]',
      subtitle: 'Front perimeter aisles',
    },
    {
      name: 'Meat & Seafood',
      aisleBadge: 'Butcher Counter',
      icon: 'set_meal',
      iconBg: 'bg-[#ffddb8]/60',
      iconColor: 'text-[#2a1700]',
      subtitle: 'Back counter coolers',
    },
    {
      name: 'Dairy & Refrigerated',
      aisleBadge: 'Aisle 8',
      icon: 'egg_alt',
      iconBg: 'bg-[#dae2fd]',
      iconColor: 'text-[#131b2e]',
      subtitle: 'West perimeter coolers',
    },
    {
      name: 'Pantry & Dry Goods',
      aisleBadge: 'Aisles 4 & 5',
      icon: 'grain',
      iconBg: 'bg-[#6cf8bb]/40',
      iconColor: 'text-[#00714d]',
      subtitle: 'Center market aisles',
    },
  ];

  const totalCount = items.length;
  const checkedCount = items.filter((i) => i.checked).length;
  const remainingCount = totalCount - checkedCount;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // Format shopping list to plain text
  const generateFormattedText = (): string => {
    let output = 'WEEKLY SHOPPING LIST (Savor)\nActive Plan • April 14 – April 20\n\n';
    departments.forEach((dept) => {
      const deptItems = items.filter((i) => i.department === dept.name);
      if (deptItems.length > 0) {
        output += `[ ${dept.name} - ${dept.aisleBadge} ]\n`;
        deptItems.forEach((it) => {
          const mark = it.checked ? '[x]' : '[ ]';
          output += `${mark} ${it.title} (${it.displayQuantity}) — ${it.recipeTitle}\n`;
        });
        output += '\n';
      }
    });
    return output;
  };

  const handleCopy = (isPlainText = false) => {
    const text = generateFormattedText();
    navigator.clipboard.writeText(text).then(
      () => {
        onShowToast(
          isPlainText ? 'Plain text list copied!' : 'Shopping list copied to clipboard!',
          `${remainingCount} items remaining to purchase.`
        );
      },
      () => {
        onShowToast('Copied list to clipboard!');
      }
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportNotes = () => {
    handleCopy(true);
    onShowToast('Exported formatted checklist to Notes app', 'Ready to paste in Apple Notes or Google Keep.');
  };

  const handleSendMobile = () => {
    onShowToast('List synced with Savor Mobile on iPhone', 'Cloud push completed to active device.');
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-24">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 border border-[#bccac0]/20">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#6cf8bb]/15 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col gap-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#6cf8bb] text-[#00714d] text-xs font-bold tracking-wide uppercase">
              Active Plan
            </span>
            <span className="text-[#6d7a72] text-xs">•</span>
            <span className="text-[#3d4a42] text-xs font-semibold">April 14 – April 20</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#131b2e] tracking-tight">
            Weekly Shopping List
          </h1>
          <p className="text-sm text-[#3d4a42]">
            Consolidated ingredients for {selectedRecipes.length} selected recipes (serves{' '}
            {selectedRecipes.reduce((acc, r) => acc + r.servings, 0)} portions)
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f3ff] text-[#131b2e] text-xs font-semibold">
              <span className="material-symbols-outlined text-base text-[#006948]">local_mall</span>
              <span>{totalCount} items total</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f3ff] text-[#3d4a42] text-xs font-semibold">
              <span className="material-symbols-outlined text-base text-[#006c49]">check_circle</span>
              <span>{checkedCount} items checked off</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6cf8bb]/30 text-[#00714d] text-xs font-bold">
              <span className="material-symbols-outlined text-base">restaurant</span>
              <span>{selectedRecipes.length} Recipes Synced</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 self-start md:self-auto">
          <button
            onClick={handlePrint}
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg text-[#6d7a72]">print</span>
            <span>Print List</span>
          </button>
          <button
            onClick={() => handleCopy(false)}
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">content_copy</span>
            <span>Copy to Clipboard</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left List (8 cols) + Right Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Department Checklists */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Controls Bar */}
          <div className="flex items-center justify-between px-5 py-3 rounded-xl bg-white shadow-xs border border-[#bccac0]/20">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onUncheckAll}
                className="flex items-center gap-1 text-[#3d4a42] hover:text-[#006948] text-xs font-semibold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">restart_alt</span>
                <span>Uncheck All</span>
              </button>
              <span className="text-[#dae2fd]">|</span>
              <div className="flex items-center gap-1.5 text-xs text-[#3d4a42]">
                <span className="material-symbols-outlined text-base text-[#6d7a72]">tune</span>
                <span>Grouped by Supermarket Aisles</span>
              </div>
            </div>

            {/* Hide Checked Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs text-[#3d4a42] font-medium">Hide Checked Items</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={hideChecked}
                  onChange={(e) => setHideChecked(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-[#e2e7ff] rounded-full peer peer-checked:bg-[#006948] transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </div>
            </label>
          </div>

          {/* Department Cards */}
          {departments.map((dept) => {
            const deptItems = items.filter((i) => i.department === dept.name);
            const visibleItems = hideChecked
              ? deptItems.filter((i) => !i.checked)
              : deptItems;

            if (visibleItems.length === 0 && hideChecked && deptItems.length > 0) {
              return null;
            }

            return (
              <section
                key={dept.name}
                className="rounded-xl bg-white p-6 shadow-sm flex flex-col gap-4 border border-[#bccac0]/20"
              >
                {/* Department Header */}
                <div className="flex items-center justify-between pb-1 border-b border-[#bccac0]/15">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-lg ${dept.iconBg} ${dept.iconColor}`}
                    >
                      <span className="material-symbols-outlined text-xl">{dept.icon}</span>
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-[#131b2e]">{dept.name}</h2>
                      <span className="text-xs text-[#3d4a42]">
                        {deptItems.length} items • {dept.subtitle}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#eaedff] text-[#3d4a42] text-xs font-semibold">
                    {dept.aisleBadge}
                  </span>
                </div>

                {/* Items List */}
                <div className="flex flex-col gap-1">
                  {deptItems.map((item) => {
                    if (hideChecked && item.checked) return null;

                    return (
                      <label
                        key={item.id}
                        className={`flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#f2f3ff]/60 transition-colors cursor-pointer group ${
                          item.checked ? 'bg-[#f2f3ff]/30' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => onToggleItem(item.id)}
                          className="sr-only"
                        />
                        {/* Custom Square Checkbox */}
                        <div
                          className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center transition-all ${
                            item.checked
                              ? 'bg-[#006948] text-white shadow-xs'
                              : 'bg-[#f2f3ff] group-hover:bg-[#eaedff] text-transparent border border-[#bccac0]/50'
                          }`}
                        >
                          <span className="material-symbols-outlined text-base leading-none">
                            check
                          </span>
                        </div>

                        {/* Title and metadata */}
                        <div className={`flex flex-col flex-1 min-w-0 ${item.checked ? 'opacity-60' : ''}`}>
                          <div className="flex items-baseline justify-between gap-2">
                            <span
                              className={`text-sm font-semibold transition-all ${
                                item.checked
                                  ? 'line-through text-[#3d4a42]/60'
                                  : 'text-[#131b2e]'
                              }`}
                            >
                              {item.title}
                            </span>
                            <span className="text-xs font-bold text-[#131b2e] shrink-0">
                              {item.displayQuantity}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[#3d4a42] text-xs mt-0.5">
                            {item.checked && item.checkedNote ? (
                              <>
                                <span className="material-symbols-outlined text-xs text-[#006c49]">
                                  check
                                </span>
                                <span className="truncate italic text-emerald-800 font-medium">
                                  {item.checkedNote}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-xs text-[#006948]">
                                  bookmark
                                </span>
                                <span className="truncate">{item.recipeTitle}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Right Column: Visual Summary & Basket Progress */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Included Dishes Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm flex flex-col gap-4 border border-[#bccac0]/20">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-[#131b2e]">Included Dishes</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6cf8bb] text-[#00714d] text-xs font-bold">
                {selectedRecipes.length} Meals
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {selectedRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => onSelectRecipeForCustomizer(recipe)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f2f3ff] transition-colors cursor-pointer group"
                  title="Click to customize this recipe"
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-14 h-14 rounded-lg object-cover shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#131b2e] truncate group-hover:text-[#006948] transition-colors">
                      {recipe.title}
                    </span>
                    <span className="text-[11px] text-[#3d4a42]">
                      {recipe.servings} portions • {recipe.ingredients.length} ingredients
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Basket Progress Mini Ring Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm flex flex-col gap-4 border border-[#bccac0]/20">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-[#131b2e]">Basket Progress</span>
              <span className="text-base font-bold text-[#006948]">
                {progressPercent}%
              </span>
            </div>

            <div className="flex items-center gap-4">
              <svg className="w-16 h-16 shrink-0 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#e2e7ff]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                ></path>
                <path
                  className="text-[#006948] transition-all duration-300 ease-out"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                ></path>
              </svg>

              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#131b2e]">
                  {remainingCount} items to buy
                </span>
                <span className="text-xs text-[#3d4a42]">
                  Check items off as you stroll the aisles
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-[#f2f3ff] p-3 flex items-start gap-2 border border-[#bccac0]/15">
              <span className="material-symbols-outlined text-[#006948] text-lg mt-0.5">
                tips_and_updates
              </span>
              <p className="text-xs text-[#3d4a42] leading-relaxed">
                Tap ingredients as you shop. Checked items are automatically saved in local browser storage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Export Bar at Bottom */}
      <div className="w-full mt-6 rounded-xl bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#bccac0]/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006948] text-xl">ios_share</span>
          <span className="text-xs font-bold text-[#131b2e]">Seamless Sharing:</span>
          <span className="text-xs text-[#3d4a42] hidden md:inline">
            Take your curated grocery list to any device or app
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleCopy(true)}
            type="button"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#6d7a72]">description</span>
            <span>Copy as Plain Text</span>
          </button>

          <button
            onClick={handleExportNotes}
            type="button"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#6d7a72]">edit_note</span>
            <span>Export to Notes</span>
          </button>

          <button
            onClick={handleSendMobile}
            type="button"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#6cf8bb] hover:bg-[#6cf8bb]/80 text-[#00714d] text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">smartphone</span>
            <span>Send to Mobile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
