import type { ImageSource } from 'expo-image';

export type PaymentBrandLogo = {
  id: string;
  name: string;
  image: ImageSource;
};

export const PAYMENT_BRAND_LOGOS = {
  gpay: {
    id: 'gpay',
    name: 'Google Pay',
    image: require('@/assets/images/payments/gpay.png'),
  },
  phonepe: {
    id: 'phonepe',
    name: 'PhonePe',
    image: require('@/assets/images/payments/phonepe.png'),
  },
  paytm: {
    id: 'paytm',
    name: 'Paytm',
    image: require('@/assets/images/payments/paytm.png'),
  },
  upi: {
    id: 'upi',
    name: 'UPI',
    image: require('@/assets/images/payments/upi.png'),
  },
  visa: {
    id: 'visa',
    name: 'Visa',
    image: require('@/assets/images/payments/visa.png'),
  },
  mastercard: {
    id: 'mastercard',
    name: 'Mastercard',
    image: require('@/assets/images/payments/mastercard.png'),
  },
  rupay: {
    id: 'rupay',
    name: 'RuPay',
    image: require('@/assets/images/payments/rupay.png'),
  },
  amazonPay: {
    id: 'amazon-pay',
    name: 'Amazon Pay',
    image: require('@/assets/images/payments/amazon-pay.png'),
  },
  hdfc: {
    id: 'hdfc',
    name: 'HDFC Bank',
    image: require('@/assets/images/payments/hdfc.png'),
  },
  sbi: {
    id: 'sbi',
    name: 'State Bank of India',
    image: require('@/assets/images/payments/sbi.png'),
  },
  icici: {
    id: 'icici',
    name: 'ICICI Bank',
    image: require('@/assets/images/payments/icici.png'),
  },
} as const satisfies Record<string, PaymentBrandLogo>;
