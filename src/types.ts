export interface IngredientSwap {
  name: string;
  label: string;
  note: string;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  subtext: string;
  baseAmount: number; // For base servings (e.g. 4)
  unit: string;
  icon: string;
  defaultNote: string;
  swaps: IngredientSwap[];
  selectedSwap?: string; // name of selected swap or 'original'
  department: 'Produce & Fresh Herbs' | 'Meat & Seafood' | 'Dairy & Refrigerated' | 'Pantry & Dry Goods';
  aisle: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  potassium: number;
  calciumDV: number;
  allergens: string;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  time: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  baseServings: number;
  categories: string[];
  dietaryBadge: string;
  image: string;
  bannerImage: string;
  baseProfile: string;
  tags: string[];
  nutrition: NutritionInfo;
  ingredients: RecipeIngredient[];
  baseBatchWeightKg: number;
  baseLiquidVolumeL: number;
  isSelected?: boolean;
}

export interface ShoppingItem {
  id: string;
  recipeId: string;
  recipeTitle: string;
  department: 'Produce & Fresh Herbs' | 'Meat & Seafood' | 'Dairy & Refrigerated' | 'Pantry & Dry Goods';
  aisle: string;
  title: string;
  amount: number;
  unit: string;
  displayQuantity: string;
  subtitle?: string;
  checked: boolean;
  checkedNote?: string;
  custom?: boolean;
}

export type NavTab = 'menu-catalog' | 'recipe-customizer' | 'shopping-list' | 'saved-collections' | 'settings';
