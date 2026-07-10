import { Tabs } from 'expo-router';

import { FloatingAndroidTabBar } from '@/navigation/components/floating-android-tab-bar';

export function AppTabs() {
  return (
    <Tabs
      tabBar={(props) => <FloatingAndroidTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders' }} />
      <Tabs.Screen name="wishlist" options={{ title: 'Wishlist' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
