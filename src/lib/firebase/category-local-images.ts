import type { ImageSource } from 'expo-image';

const DEFAULT_CATEGORY_IMAGE = require('@/assets/food/categories/punjabi-breakfast.jpg');

const CATEGORY_LOCAL_IMAGES: Record<string, ImageSource> = {
  'punjabi breakfast': require('@/assets/food/categories/punjabi-breakfast.jpg'),
  'starters & snacks': require('@/assets/food/categories/starters-snacks.jpg'),
  'paneer specials': require('@/assets/food/categories/paneer-specials.jpg'),
  'dal & kadhi': require('@/assets/food/categories/dal-kadhi.jpg'),
  'veg curries': require('@/assets/food/categories/veg-curries.jpg'),
  'chicken curries': require('@/assets/food/categories/chicken-curries.jpg'),
  'mutton & lamb': require('@/assets/food/categories/mutton-lamb.jpg'),
  'tandoor specials': require('@/assets/food/categories/tandoor-specials.jpg'),
  'breads & paratha': require('@/assets/food/categories/breads-paratha.jpg'),
  'rice & pulao': require('@/assets/food/categories/biryani.jpg'),
  biryani: require('@/assets/food/categories/biryani.jpg'),
  'chole & rajma': require('@/assets/food/categories/chole-rajma.jpg'),
  'rolls & street food': require('@/assets/food/categories/rolls-street-food.jpg'),
  'lassi & beverages': require('@/assets/food/categories/lassi-beverages.jpg'),
  'punjabi sweets': require('@/assets/food/categories/punjabi-sweets.jpg'),
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

/** Unique bundled category art for startup prefetch. */
export function getAllCategoryImageSources(): ImageSource[] {
  return [...new Set(Object.values(CATEGORY_LOCAL_IMAGES))];
}
