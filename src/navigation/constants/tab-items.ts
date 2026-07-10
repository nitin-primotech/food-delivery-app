export type TabItemConfig = {
  name: string;
  label: string;
  icon: { default: string; selected: string };
};

export const MAIN_TAB_ITEMS: TabItemConfig[] = [
  {
    name: 'index',
    label: 'Home',
    icon: { default: 'house', selected: 'house.fill' },
  },
  {
    name: 'orders',
    label: 'Orders',
    icon: { default: 'bag', selected: 'bag.fill' },
  },
  {
    name: 'wishlist',
    label: 'Wishlist',
    icon: { default: 'heart', selected: 'heart.fill' },
  },
  {
    name: 'profile',
    label: 'Profile',
    icon: { default: 'person', selected: 'person.fill' },
  },
];

export const SEARCH_TAB_NAME = 'search';
