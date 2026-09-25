/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { NavTab, Recipe, ShoppingItem } from './types';
import { INITIAL_RECIPES, INITIAL_SELECTED_RECIPE_IDS } from './data/recipes';
import { INITIAL_SHOPPING_ITEMS } from './data/shoppingData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MenuCatalog } from './components/MenuCatalog';
import { RecipeCustomizer } from './components/RecipeCustomizer';
import { ShoppingList } from './components/ShoppingList';
import { SavedCollections } from './components/SavedCollections';
import { SettingsView } from './components/SettingsView';
import { Toast } from './components/Toast';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<NavTab>('menu-catalog');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Recipes & selected recipe IDs
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<string[]>(INITIAL_SELECTED_RECIPE_IDS);

  // Active recipe for Recipe Customizer (defaults to Tuscan Garlic Herb Chicken)
  const [activeCustomizerRecipeId, setActiveCustomizerRecipeId] = useState<string>('1');

  // Shopping list items
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(INITIAL_SHOPPING_ITEMS);

  // Global search input
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Toast feedback state
  const [toastState, setToastState] = useState<{
    visible: boolean;
    message: string;
    subMessage?: string;
    icon?: string;
  }>({
    visible: false,
    message: '',
    subMessage: '',
    icon: 'check_circle',
  });

  const showToast = (message: string, subMessage?: string, icon = 'check_circle') => {
    setToastState({
      visible: true,
      message,
      subMessage,
      icon,
    });
    setTimeout(() => {
      setToastState((prev) => ({ ...prev, visible: false }));
    }, 3200);
  };

  // Toggle selection of a recipe in meal plan
  const handleToggleRecipeSelect = (recipeId: string) => {
    if (selectedRecipeIds.includes(recipeId)) {
      setSelectedRecipeIds((prev) => prev.filter((id) => id !== recipeId));
      showToast('Recipe removed from weekly plan');
    } else {
      if (selectedRecipeIds.length >= 10) {
        showToast('Weekly capacity reached (10/10)', 'Remove an existing recipe first.', 'warning');
        return;
      }
      setSelectedRecipeIds((prev) => [...prev, recipeId]);
      showToast('Recipe added to weekly plan', 'Ingredients consolidated into shopping list.');
    }
  };

  // Open recipe in Customizer
  const handleCustomizeRecipe = (recipe: Recipe) => {
    setActiveCustomizerRecipeId(recipe.id);
    setCurrentTab('recipe-customizer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save recipe adjustments from Customizer
  const handleSaveRecipeCustomization = (updatedRecipe: Recipe) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
    );

    // If recipe is not in meal plan yet, automatically add it!
    if (!selectedRecipeIds.includes(updatedRecipe.id)) {
      setSelectedRecipeIds((prev) => [...prev, updatedRecipe.id]);
    }

    // Dynamic adjustment of related shopping items
    setShoppingItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.recipeId === updatedRecipe.id) {
          const ratio = updatedRecipe.servings / updatedRecipe.baseServings;
          if (item.unit === 'kg') {
            const newWeight = (1.2 * (updatedRecipe.servings / 6)).toFixed(1);
            return {
              ...item,
              displayQuantity: `${newWeight} kg`,
            };
          }
          if (item.unit === 'ml') {
            const newVol = Math.round(233 * ratio);
            return {
              ...item,
              displayQuantity: `${newVol} ml`,
            };
          }
          if (item.unit === 'g') {
            const newG = Math.round(item.amount * ratio);
            return {
              ...item,
              displayQuantity: `${newG} g`,
            };
          }
        }
        return item;
      });
    });

    showToast('Customization Saved', 'Scaled ingredients ready for prep.');
  };

  // Toggle single shopping item checkbox
  const handleToggleShoppingItem = (itemId: string) => {
    setShoppingItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, checked: !it.checked } : it))
    );
  };

  // Uncheck all shopping items
  const handleUncheckAll = () => {
    setShoppingItems((prev) =>
      prev.map((it) => ({
        ...it,
        checked: false,
      }))
    );
    showToast('All items unchecked', 'Ready for a fresh grocery run.');
  };

  // Currently active recipe object for Customizer
  const currentCustomizerRecipe =
    recipes.find((r) => r.id === activeCustomizerRecipeId) || recipes[0];

  // Selected recipes objects for shopping list included dishes
  const selectedRecipes = recipes.filter((r) => selectedRecipeIds.includes(r.id));

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isMobileDrawerOpen={isMobileDrawerOpen}
        onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
        shoppingListBadgeCount={selectedRecipeIds.length}
      />

      {/* Main Content Area (offset by left-72 on desktop) */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          searchTerm={globalSearch}
          onSearchChange={setGlobalSearch}
          selectedRecipesCount={selectedRecipeIds.length}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 py-6 w-full">
          {currentTab === 'menu-catalog' && (
            <MenuCatalog
              recipes={recipes}
              selectedRecipeIds={selectedRecipeIds}
              onToggleRecipeSelect={handleToggleRecipeSelect}
              onCustomizeRecipe={handleCustomizeRecipe}
              onNavigateTab={(tab) => {
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              globalSearch={globalSearch}
              onGlobalSearchChange={setGlobalSearch}
            />
          )}

          {currentTab === 'recipe-customizer' && (
            <RecipeCustomizer
              recipe={currentCustomizerRecipe}
              recipes={recipes}
              onSelectRecipeToCustomize={(r) => setActiveCustomizerRecipeId(r.id)}
              onBackToCatalog={() => {
                setCurrentTab('menu-catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSaveRecipe={handleSaveRecipeCustomization}
            />
          )}

          {currentTab === 'shopping-list' && (
            <ShoppingList
              items={shoppingItems}
              onToggleItem={handleToggleShoppingItem}
              onUncheckAll={handleUncheckAll}
              selectedRecipes={selectedRecipes}
              onSelectRecipeForCustomizer={handleCustomizeRecipe}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'saved-collections' && (
            <SavedCollections
              recipes={recipes}
              onSelectRecipeForCustomizer={handleCustomizeRecipe}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView onShowToast={showToast} />
          )}
        </main>
      </div>

      {/* Toast Notification Container */}
      <Toast
        isVisible={toastState.visible}
        message={toastState.message}
        subMessage={toastState.subMessage}
        icon={toastState.icon}
      />
    </div>
  );
}
