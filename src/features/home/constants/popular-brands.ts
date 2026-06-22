import type { ImageSource } from 'expo-image';

export type PopularBrand = {
  id: string;
  name: string;
  image: ImageSource;
};

export const POPULAR_BRANDS: PopularBrand[] = [
  {
    id: 'haldiram',
    name: "Haldiram's",
    image: require('@/assets/images/brands/haldiram.png'),
  },
  {
    id: 'bikaner',
    name: 'Bikanervala',
    image: require('@/assets/images/brands/bikaner.png'),
  },
  {
    id: 'amul',
    name: 'Amul',
    image: require('@/assets/images/brands/amul.png'),
  },
  {
    id: 'tata',
    name: 'Tata Salt',
    image: require('@/assets/images/brands/tata.png'),
  },

  {
    id: 'parle',
    name: 'Parle',
    image: require('@/assets/images/brands/parle.png'),
  },
  {
    id: 'britannia',
    name: 'Britannia',
    image: require('@/assets/images/brands/britannia.png'),
  },
  {
    id: 'nestle',
    name: 'Nestlé',
    image: require('@/assets/images/brands/nestle.png'),
  },
];
