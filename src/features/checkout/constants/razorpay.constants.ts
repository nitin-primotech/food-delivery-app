import { colors } from '@/theme/colors';

/** Test key — override with EXPO_PUBLIC_RAZORPAY_KEY_ID in production. */
export const RAZORPAY_KEY_ID =
  process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID ?? 'rzp_test_RKgTcc9tht64cZ';

export const RAZORPAY_BRAND = {
  name: 'FoodRush',
  logoUrl: 'https://foodrush.in/logo.png',
  currency: 'INR' as const,
  themeColor: colors.primary,
  description: 'Food Service Payment',
};
