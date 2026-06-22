import type { ImageSource } from 'expo-image';

export const TRENDING_FOOD_IMAGES: ImageSource[] = [
  require('@/assets/foodimages/a1.png'),
  require('@/assets/foodimages/a2.png'),
  require('@/assets/foodimages/a3.png'),
  require('@/assets/foodimages/a4.png'),
  require('@/assets/foodimages/a5.png'),
  require('@/assets/foodimages/a6.png'),
  require('@/assets/foodimages/a7.png'),
  require('@/assets/foodimages/a8.png'),
];

export function getTrendingFoodImage(index: number): ImageSource {
  return TRENDING_FOOD_IMAGES[index % TRENDING_FOOD_IMAGES.length];
}
