import type { PaymentBrandLogo } from '@/features/checkout/constants/payment-brands';
import { PAYMENT_BRAND_LOGOS } from '@/features/checkout/constants/payment-brands';

export type CheckoutAddress = {
  id: string;
  label: string;
  line1: string;
  line2: string;
};

export type PaymentMethodOption = {
  id: string;
  label: string;
  subtitle: string;
  badge?: string;
  trailingLogos: PaymentBrandLogo[];
  showMore?: boolean;
};

export const CHECKOUT_OFFICE_ADDRESS: CheckoutAddress = {
  id: 'office',
  label: 'Office',
  line1: '42 Hudson St, Floor 8',
  line2: 'New York, NY 10013',
};

export const FREE_DELIVERY_THRESHOLD = 500;
export const DELIVERY_FEE = 40;
export const PLATFORM_FEE = 10;

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'upi',
    label: 'UPI',
    subtitle: 'Pay using any UPI app',
    badge: 'FAST & SECURE',
    trailingLogos: [PAYMENT_BRAND_LOGOS.upi],
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    subtitle: 'Visa, Mastercard, Rupay & more',
    trailingLogos: [
      PAYMENT_BRAND_LOGOS.visa,
      PAYMENT_BRAND_LOGOS.mastercard,
      PAYMENT_BRAND_LOGOS.rupay,
    ],
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    subtitle: 'All major banks supported',
    trailingLogos: [
      PAYMENT_BRAND_LOGOS.hdfc,
      PAYMENT_BRAND_LOGOS.sbi,
      PAYMENT_BRAND_LOGOS.icici,
    ],
  },
  {
    id: 'wallet',
    label: 'Wallets',
    subtitle: 'Paytm, PhonePe, Amazon Pay & more',
    trailingLogos: [
      PAYMENT_BRAND_LOGOS.paytm,
      PAYMENT_BRAND_LOGOS.phonepe,
      PAYMENT_BRAND_LOGOS.amazonPay,
    ],
    showMore: true,
  },
];

export function computeOfferDiscount(
  code: string,
  subtotal: number,
): { discount: number; freeDelivery: boolean } {
  switch (code) {
    case 'WELCOME20':
      return { discount: Math.min(subtotal * 0.2, 120), freeDelivery: false };
    case 'NEW10':
      return { discount: subtotal >= 250 ? 100 : 0, freeDelivery: false };
    case 'RUSHFREE':
      return { discount: 0, freeDelivery: true };
    case 'WEEKEND':
      return { discount: Math.min(subtotal * 0.3, 150), freeDelivery: false };
    default:
      return { discount: 0, freeDelivery: false };
  }
}
