import type { ImageSource } from 'expo-image';

export type WelcomeSlide = {
  id: string;
  image: ImageSource;
  line1: string;
  line2: string;
  subheadline: string;
  /** Normalizes artwork size when source PNG padding differs. */
  imageScale: number;
};

export const WELCOME_SLIDES: WelcomeSlide[] = [
  {
    id: 'fresh-delivery',
    image: require('@/assets/images/Onboarding4.png'),
    line1: 'Freshly made,',
    line2: 'delivered to you.',
    subheadline: 'Hot, hygienic and delivered with care, right to your door.',
    imageScale: 1.56,
  },
  {
    id: 'track-live',
    image: require('@/assets/images/onboarding2.png'),
    line1: 'Track every',
    line2: 'order live.',
    subheadline: 'Real-time tracking from our kitchen to your doorstep.',
    imageScale: 1,
  },
  {
    id: 'full-menu',
    image: require('@/assets/images/Onboarding3.png'),
    line1: 'Full menu,',
    line2: 'one tap away.',
    subheadline: 'Browse categories and order your favourites in seconds.',
    imageScale: 1.3,
  },
];

/** Shared source aspect ratio — all onboarding art is ~1023×1536. */
export const WELCOME_ILLUSTRATION_ASPECT = 1536 / 1023;

/** Max illustration height as a fraction of screen height. */
export const WELCOME_ILLUSTRATION_MAX_HEIGHT_RATIO = 0.42;
