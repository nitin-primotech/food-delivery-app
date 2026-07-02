import type { ImageSource } from 'expo-image';

const DEFAULT_CATEGORY_IMAGE = require('@/assets/food/categories/punjabi-breakfast.png');

const CATEGORY_LOCAL_IMAGES: Record<string, ImageSource> = {
  'punjabi breakfast': require('@/assets/food/categories/punjabi-breakfast.png'),
  'starters & snacks': require('@/assets/food/categories/starters-snacks.png'),
  'paneer specials': require('@/assets/food/categories/paneer-specials.png'),
  'dal & kadhi': require('@/assets/food/categories/dal-kadhi.png'),
  'veg curries': require('@/assets/food/categories/veg-curries.png'),
  'chicken curries': require('@/assets/food/categories/chicken-curries.png'),
  'mutton & lamb': require('@/assets/food/categories/mutton-lamb.png'),
  'tandoor specials': require('@/assets/food/categories/tandoor-specials.png'),
  'breads & paratha': require('@/assets/food/categories/breads-paratha.png'),
  'rice & pulao': require('@/assets/food/categories/biryani.png'),
  biryani: require('@/assets/food/categories/biryani.png'),
  'chole & rajma': require('@/assets/food/categories/chole-rajma.png'),
  'rolls & street food': require('@/assets/food/categories/rolls-street-food.png'),
  'lassi & beverages': require('@/assets/food/categories/lassi-beverages.png'),
  'punjabi sweets': require('@/assets/food/categories/punjabi-sweets.png'),
};

function normalizeCategoryName(name: string): string {
  return name.trim().toLowerCase();
}

export function getCategoryLocalImage(name: string): ImageSource | undefined {
  return CATEGORY_LOCAL_IMAGES[normalizeCategoryName(name)];
}

export function resolveCategoryImageSource(categoryName: string): ImageSource {
  return getCategoryLocalImage(categoryName) ?? DEFAULT_CATEGORY_IMAGE;
}

export function isBundledImageSource(source: ImageSource): boolean {
  return typeof source === 'number';
}
