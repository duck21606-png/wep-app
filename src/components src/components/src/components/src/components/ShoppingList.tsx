import React, { useState, useMemo } from 'react';
import { ShoppingItem, INITIAL_SHOPPING_ITEMS, Recipe } from '../data/recipes';

interface ShoppingListProps {
  selectedRecipes: Recipe[];
  onOpenCustomizerForRecipe?: (recipe: Recipe) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
  selectedRecipes,
  onOpenCustomizerForRecipe,
}) => {
  // Grocery items state initialized from default data (or localStorage if present)
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem('savor_shopping_items');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SHOPPING_ITEMS;
  });

  const [checkedIds, setCheckedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('savor_shopping_checked');
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // fallback
    }
    const initialChecked = new Set<string>();
    INITIAL_SHOPPING_ITEMS.forEach((it) => {
      if (it.defaultChecked) initialChecked.add(it.id);
    });
    return initialChecked;
  });

  const [hideChecked, setHideChecked] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);

      try {
        localStorage.setItem('savor_shopping_checked', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleUncheckAll = () => {
    setCheckedIds(new Set());
    try {
      localStorage.setItem('savor_shopping_checked', JSON.stringify([]));
    } catch {
      // ignore
    }
    showToast('All items unchecked');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Metrics
  const totalCount = items.length;
  const checkedCount = checkedIds.size;
  const remainingCount = Math.max(0, totalCount - checkedCount);
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // Department groupings
  const departments = [
    {
      id: 'produce',
      title: 'Produce & Fresh Herbs',
      subtitle: '8 items • Front perimeter aisles',
      aisle: 'Aisle 1 & 2',
      icon: 'nutrition',
      bgIcon: 'bg-[#6cf8bb]/50 text-[#00714d]',
    },
    {
      id: 'meat',
      title: 'Meat & Seafood',
      subtitle: '4 items • Back counter coolers',
      aisle: 'Butcher Counter',
      icon: 'set_meal',
      bgIcon: 'bg-[#ffddb8]/60 text-[#2a1700]',
    },
    {
      id: 'dairy',
      title: 'Dairy & Refrigerated',
      subtitle: '5 items • West perimeter coolers',
      aisle: 'Aisle 8',
      icon: 'egg_alt',
      bgIcon: 'bg-[#dae2fd] text-[#131b2e]',
    },
    {
      id: 'pantry',
      title: 'Pantry & Dry Goods',
      subtitle: '11 items • Center market aisles',
      aisle: 'Aisles 4 & 5',
      icon: 'grain',
      bgIcon: 'bg-[#6cf8bb]/40 text-[#00714d]',
    },
  ];

  // Helper to generate text copy
  const generateListText = () => {
    let text = `WEEKLY SHOPPING LIST (Savor)\nActive Plan: April 14 – April 20\n${totalCount} items total • ${checkedCount} checked off\n\n`;
    departments.forEach((dept) => {
      const deptItems = items.filter((it) => it.department === dept.id);
      if (deptItems.length === 0) return;
      text += `[ ${dept.title} - ${dept.aisle} ]\n`;
      deptItems.forEach((it) => {
        const isChecked = checkedIds.has(it.id);
        text += `${isChecked ? '[x]' : '[ ]'} ${it.name} - ${it.qty} (${it.source})\n`;
      });
      text += '\n';
    });
    return text;
  };

  const handleCopyClipboard = () => {
    const text = generateListText();
    navigator.clipboard?.writeText(text);
    showToast('Shopping list copied to clipboard!');
  };

  const handleCopyPlainText = () => {
    const text = generateListText();
    navigator.clipboard?.writeText(text);
    showToast('Plain text list copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportNotes = () => {
    showToast('Exported formatted checklist to Apple/Google Notes');
  };

  const handleSendMobile = () => {
    showToast('List synced with Savor Mobile companion app');
  };

  return (
    <div className="flex flex-col gap-y-6 w-full max-w-7xl mx-auto pb-24">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-5 sm:p-6 lg:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#bccac0]/20">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#6cf8bb]/15 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col gap-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#6cf8bb] text-[#00714d] text-xs font-bold tracking-wide uppercase">
              Active Plan
            </span>
            <span className="text-[#6d7a72] text-xs">•</span>
            <span className="text-[#3d4a42] text-xs font-medium">April 14 – April 20</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight">
            Weekly Shopping List
          </h1>
          <p className="text-sm text-[#3d4a42]">
            Consolidated ingredients for 4 selected recipes (serves 14 portions)
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6cf8bb]/30 text-[#00714d] text-xs font-semibold">
              <span className="material-symbols-outlined text-base">restaurant</span>
              <span>4 Recipes Synced</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 z-10 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#131b2e] text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl text-[#6d7a72]">print</span>
            <span>Print List</span>
          </button>
          <button
            type="button"
            onClick={handleCopyClipboard}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white text-sm font-semibold transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">content_copy</span>
            <span>Copy to Clipboard</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Checklist & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Department Checklists */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Controls Bar: Uncheck All & Hide Checked Items */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white shadow-sm border border-[#bccac0]/20">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={handleUncheckAll}
                className="flex items-center gap-1 text-xs font-semibold text-[#3d4a42] hover:text-[#006948] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">restart_alt</span>
                <span>Uncheck All</span>
              </button>
              <span className="text-[#dae2fd]">|</span>
              <div className="flex items-center gap-1 text-xs text-[#3d4a42]">
                <span className="material-symbols-outlined text-base text-[#6d7a72]">tune</span>
                <span>Grouped by Supermarket Aisles</span>
              </div>
            </div>

            {/* Toggle Hide Checked */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <span className="text-xs font-medium text-[#3d4a42]">Hide Checked Items</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={hideChecked}
                  onChange={(e) => setHideChecked(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-[#e2e7ff] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006948]"></div>
              </div>
            </label>
          </div>

          {/* Department Sections */}
          {departments.map((dept) => {
            const deptItems = items.filter((it) => it.department === dept.id);
            const visibleItems = hideChecked
              ? deptItems.filter((it) => !checkedIds.has(it.id))
              : deptItems;

            if (deptItems.length === 0) return null;

            return (
              <section
                key={dept.id}
                className="rounded-xl bg-white p-5 sm:p-6 shadow-sm flex flex-col gap-3.5 border border-[#bccac0]/20"
              >
                {/* Department Header */}
                <div className="flex items-center justify-between pb-1 border-b border-[#bccac0]/15">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-lg ${dept.bgIcon}`}
                    >
                      <span className="material-symbols-outlined text-xl">{dept.icon}</span>
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-[#131b2e]">{dept.title}</h2>
                      <span className="text-xs text-[#3d4a42]">{dept.subtitle}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#eaedff] text-[#3d4a42] text-xs font-semibold">
                    {dept.aisle}
                  </span>
                </div>

                {/* Items List */}
                <div className="flex flex-col gap-1">
                  {visibleItems.length > 0 ? (
                    visibleItems.map((item) => {
                      const isChecked = checkedIds.has(item.id);

                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleCheck(item.id)}
                          className={`flex items-start gap-3 p-2.5 rounded-lg transition-colors cursor-pointer group select-none ${
                            isChecked
                              ? 'bg-[#f2f3ff]/40 hover:bg-[#f2f3ff]'
                              : 'hover:bg-[#f2f3ff]/60'
                          }`}
                        >
                          {/* Checkbox Visual */}
                          <div
                            className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center transition-all shrink-0 ${
                              isChecked
                                ? 'bg-[#006948] text-white shadow-xs'
                                : 'bg-[#e2e7ff] text-transparent group-hover:bg-[#dae2fd]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base leading-none">
                              check
                            </span>
                          </div>

                          {/* Info */}
                          <div
                            className={`flex flex-col flex-1 min-w-0 transition-opacity ${
                              isChecked ? 'opacity-50' : 'opacity-100'
                            }`}
                          >
                            <div className="flex items-baseline justify-between gap-2">
                              <span
                                className={`text-sm font-medium transition-all ${
                                  isChecked
                                    ? 'line-through text-[#6d7a72]'
                                    : 'text-[#131b2e]'
                                }`}
                              >
                                {item.name}
                              </span>
                              <span className="text-xs font-bold text-[#131b2e] shrink-0">
                                {item.qty}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-xs text-[#3d4a42] mt-0.5">
                              {isChecked ? (
                                <>
                                  <span className="material-symbols-outlined text-xs text-[#006c49]">
                                    check
                                  </span>
                                  <span className="truncate italic">
                                    {item.checkedNote || item.source}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="material-symbols-outlined text-xs text-[#006948]">
                                    bookmark
                                  </span>
                                  <span className="truncate">{item.source}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-4 text-center text-xs text-[#6d7a72] italic">
                      All items in this aisle checked off!
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {/* Right Column: Visual Recipe Basket & Progress */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Visual Recipe Basket Card */}
          <div className="rounded-xl bg-white p-5 sm:p-6 shadow-sm flex flex-col gap-4 border border-[#bccac0]/20">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-[#131b2e]">Included Dishes</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6cf8bb] text-[#00714d] text-xs font-bold">
                4 Meals
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Dish 1 */}
              <div
                onClick={() => {
                  const r = selectedRecipes.find((rec) => rec.id === 1);
                  if (r && onOpenCustomizerForRecipe) onOpenCustomizerForRecipe(r);
                }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#f2f3ff] transition-colors cursor-pointer"
              >
                <img
                  className="w-14 h-14 rounded-lg object-cover shadow-xs shrink-0"
                  alt="Creamy Tuscan Chicken"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrwYwI42imjT3VYdrFwdMu_hcChip810OtBlwMO30Qat-eNe7MFJotqcseDMQiMkzOvo6WgX8g7tCZL4RkTrQAHr_rGsU9pJpP2O6OZjSpaFIjESxMbi0kXOD3iePpKekazeFlUyrpDPlADGSzrLDjTm-5sHOI7nDz_Fkm_WZIWhgP8kdKIImU9-ifQpxcMvL4ZAsSe-CwxQczZ5MgVeauVVyA18ZRZYBCJkuG0CNLvLrixmbz-g6YjA"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-[#131b2e] truncate">
                    Creamy Tuscan Chicken
                  </span>
                  <span className="text-xs text-[#3d4a42]">6 portions • 9 ingredients</span>
                </div>
              </div>

              {/* Dish 2 */}
              <div
                onClick={() => {
                  const r = selectedRecipes.find((rec) => rec.id === 3);
                  if (r && onOpenCustomizerForRecipe) onOpenCustomizerForRecipe(r);
                }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#f2f3ff] transition-colors cursor-pointer"
              >
                <img
                  className="w-14 h-14 rounded-lg object-cover shadow-xs shrink-0"
                  alt="Pan-Seared Lemon Salmon"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4x1QfFs7DbnnR9sD9CCyoMjfo417FCuv_cWagYjoJgOLnQLT2b3UNQWudNPN0EjG5be6m_3iGhYdw_5LML5bSvMWZh2mwYge4IFzLNfXeSurPoMzuKrITaRqOR9_xFz-MD06Aj-VJmZ3I_bplrF9yXDso0oSocWe0BxvBl-KVb6xZeIGTsCJHNKCUmv9XHSjbW78x42DIttnVSuP3olcZqYG0i_T4jfxCI1QX6I8INt1TUdKXMro_Gw"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-[#131b2e] truncate">
                    Pan-Seared Lemon Salmon
                  </span>
                  <span className="text-xs text-[#3d4a42]">2 portions • 6 ingredients</span>
                </div>
              </div>

              {/* Dish 3 */}
              <div
                onClick={() => {
                  const r = selectedRecipes.find((rec) => rec.id === 2);
                  if (r && onOpenCustomizerForRecipe) onOpenCustomizerForRecipe(r);
                }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#f2f3ff] transition-colors cursor-pointer"
              >
                <img
                  className="w-14 h-14 rounded-lg object-cover shadow-xs shrink-0"
                  alt="Wild Mushroom Risotto"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUQCl_lMQhQYnq5-LtQXEmcCVYf_pMZIQnv9Yih3Tb-6reYdUgIFKeMmwybZvQIn-a7lXuBnTOdcsHB6_5bKgW1CvJXOUGRc5Hk24lmZjgwvIn8ButWRGxIAU-Ov_IDdbYt-R5bdbknyzYoFI5QV2rA0uXM3eY7Kt2wRiNCfkEDTIGwERmApvnJBQChEusJwf_2gi8ztiUEDndFRnvxw-EbJCDCtrJGiZEMs1RPZqEoJzZIh3S6-JUKA"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-[#131b2e] truncate">
                    Wild Mushroom Risotto
                  </span>
                  <span className="text-xs text-[#3d4a42]">4 portions • 8 ingredients</span>
                </div>
              </div>

              {/* Dish 4 */}
              <div
                onClick={() => {
                  const r = selectedRecipes.find((rec) => rec.id === 4);
                  if (r && onOpenCustomizerForRecipe) onOpenCustomizerForRecipe(r);
                }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#f2f3ff] transition-colors cursor-pointer"
              >
                <img
                  className="w-14 h-14 rounded-lg object-cover shadow-xs shrink-0"
                  alt="Crispy Chickpea Green Bowl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9tZGpIChP7XJUVpEVf-kjCHJf6DvwIGw-rtvi93CaWhTpGNIBStx_NcahsE8FsRR90aoBNivPzU644S-8LYAivQmszUif-y6LirvU_Od9qs2f88S41raJeYcw30f1VOcj7KCrSFanKzL7f_z4ChLKTnnPgjdmDLg44kbpF-_ddszr8Z0Y2cMJPTFTHkvtCFfB1vE8zXnxc9pAFnW89rqtc0NYbuUc9EzzfYe1fnsRVntJBeV9YYvLPg"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-[#131b2e] truncate">
                    Crispy Chickpea Green Bowl
                  </span>
                  <span className="text-xs text-[#3d4a42]">2 portions • 5 ingredients</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pantry Progress Mini Ring */}
          <div className="rounded-xl bg-white p-5 sm:p-6 shadow-sm flex flex-col gap-4 border border-[#bccac0]/20">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-[#131b2e]">Basket Progress</span>
              <span className="text-base font-bold text-[#006948]">{progressPercent}%</span>
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
      <div className="w-full rounded-xl bg-white p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#bccac0]/20">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#006948] text-xl">ios_share</span>
          <span className="text-sm font-bold text-[#131b2e]">Seamless Sharing:</span>
          <span className="text-xs text-[#3d4a42] hidden md:inline">
            Take your curated grocery list to any device or app
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCopyPlainText}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#131b2e] text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#6d7a72]">description</span>
            <span>Copy as Plain Text</span>
          </button>
          <button
            type="button"
            onClick={handleExportNotes}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#131b2e] text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#6d7a72]">edit_note</span>
            <span>Export to Notes</span>
          </button>
          <button
            type="button"
            onClick={handleSendMobile}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#6cf8bb] hover:bg-[#6cf8bb]/80 text-[#00714d] text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">smartphone</span>
            <span>Send to Mobile</span>
          </button>
        </div>
      </div>

      {/* Action Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#283044] text-[#eef0ff] shadow-xl transition-all duration-300">
          <span className="material-symbols-outlined text-[#6ffbbe] text-xl">check_circle</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
