import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  MAIN_TAB_ITEMS,
  SEARCH_TAB_NAME,
} from '@/navigation/constants/tab-items';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSelection } from '@/shared/haptics/feedback';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PILL_HEIGHT = 58;
const SEARCH_SIZE = 52;
const TAB_ICON_SIZE = 22;

type TabButtonProps = {
  label: string;
  icon: { default: string; selected: string };
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

function TabButton({
  label,
  icon,
  focused,
  onPress,
  onLongPress,
}: TabButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 18, stiffness: 380 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 18, stiffness: 380 });
      }}
      style={[styles.tabButton, animatedStyle]}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
    >
      <View style={[styles.tabInner]}>
        <AppSymbol
          name={icon.selected}
          size={TAB_ICON_SIZE}
          tintColor={focused ? colors.primary : colors.textPrimary}
          weight="semibold"
        />
        <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
          {label}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

function SearchButton({
  focused,
  onPress,
}: {
  focused: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 18, stiffness: 380 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 18, stiffness: 380 });
      }}
      style={[styles.searchButton, animatedStyle]}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel="Search"
    >
      <AppSymbol
        name="magnifyingglass"
        size={24}
        tintColor={focused ? colors.primary : colors.textPrimary}
        weight="semibold"
      />
    </AnimatedPressable>
  );
}

export function FloatingAndroidTabBar({
  state,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  function navigateToRoute(routeName: string) {
    hapticSelection();
    const route = state.routes.find((item) => item.name === routeName);
    if (!route) return;

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    const routeIndex = state.routes.findIndex(
      (item) => item.name === routeName,
    );
    if (!event.defaultPrevented && state.index !== routeIndex) {
      navigation.navigate(route.name, route.params);
    }
  }

  function onTabLongPress(routeName: string) {
    const route = state.routes.find((item) => item.name === routeName);
    if (!route) return;

    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  }

  const searchFocused = state.routes[state.index]?.name === SEARCH_TAB_NAME;

  return (
    <View
      style={[
        styles.root,
        { paddingBottom: Math.max(insets.bottom + spacing.sm, spacing.sm) },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.row} pointerEvents="box-none">
        <View style={styles.pill}>
          {MAIN_TAB_ITEMS.map((item) => {
            const routeIndex = state.routes.findIndex(
              (route) => route.name === item.name,
            );
            const focused = state.index === routeIndex;

            return (
              <TabButton
                key={item.name}
                label={item.label}
                icon={item.icon}
                focused={focused}
                onPress={() => navigateToRoute(item.name)}
                onLongPress={() => onTabLongPress(item.name)}
              />
            );
          })}
        </View>

        <SearchButton
          focused={searchFocused}
          onPress={() => navigateToRoute(SEARCH_TAB_NAME)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: PILL_HEIGHT,
    paddingHorizontal: spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: radius.full,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderCurve: 'continuous',
    minWidth: 56,
  },
  tabLabel: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textPrimary,
    letterSpacing: 0.1,
  },
  tabLabelActive: {
    color: colors.primary,
  },
  searchButton: {
    width: SEARCH_SIZE,
    height: SEARCH_SIZE,
    borderRadius: radius.full,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
});
