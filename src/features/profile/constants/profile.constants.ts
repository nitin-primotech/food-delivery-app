import type { OrderTabId } from '@/features/orders/constants/orders.constants';

export type ProfileOrderShortcut = {
  id: OrderTabId;
  label: string;
  icon: string;
};

export const PROFILE_ORDER_SHORTCUTS: ProfileOrderShortcut[] = [
  { id: 'all', label: 'All Orders', icon: 'doc.text.fill' },
  { id: 'processing', label: 'Processing', icon: 'bag.fill' },
  { id: 'shipped', label: 'In Transit', icon: 'truck.box.fill' },
  { id: 'delivered', label: 'Delivered', icon: 'checkmark.circle.fill' },
  { id: 'cancelled', label: 'Cancelled', icon: 'xmark.circle.fill' },
];

export type ProfileQuickStat = {
  id: string;
  label: string;
  value: string;
  icon: string;
};

export const PROFILE_QUICK_STATS: ProfileQuickStat[] = [
  { id: 'wallet', label: 'Wallet', value: '₹250', icon: 'wallet.pass.fill' },
  { id: 'offers', label: 'Offers', value: '12 Available', icon: 'tag.fill' },
  {
    id: 'premium',
    label: 'foodRush Gold',
    value: 'Member',
    icon: 'crown.fill',
  },
];

export type ProfileMenuItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badge?: string;
  badgeTone?: 'primary' | 'success';
};

export const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  {
    id: 'addresses',
    title: 'Manage Addresses',
    subtitle: 'Home, work and saved places',
    icon: 'location.fill',
  },
  {
    id: 'payments',
    title: 'Payment Methods',
    subtitle: 'Cards, UPI and wallets',
    icon: 'creditcard.fill',
  },
  {
    id: 'wishlist',
    title: 'My Wishlist',
    subtitle: 'Saved dishes and restaurants',
    icon: 'heart.fill',
    badge: '16 Items',
    badgeTone: 'primary',
  },
  {
    id: 'premium',
    title: 'Premium Status',
    subtitle: 'foodRush Gold membership',
    icon: 'crown.fill',
    badge: 'Active',
    badgeTone: 'success',
  },
  {
    id: 'notifications',
    title: 'Notification Settings',
    subtitle: 'Orders, offers and updates',
    icon: 'bell.fill',
  },
  {
    id: 'support',
    title: 'Help & Support',
    subtitle: 'FAQs, chat and call support',
    icon: 'headphones',
  },
];

export function formatProfilePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10);
  if (digits.length !== 10) return `+91 ${phone}`;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function profileInitials(name: string | null): string {
  if (!name?.trim()) return 'FR';
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export const DEFAULT_PROFILE_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop';
