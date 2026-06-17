import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export function HomeSearchBar() {
  const router = useRouter();
  const [vegOnly, setVegOnly] = useState(false);

  return (
    <View style={styles.wrap}>
      <Pressable
        style={styles.search}
        onPress={() => router.push('/(tabs)/search')}
      >
        <AppSymbol
          name="magnifyingglass"
          size={20}
          tintColor={colors.textSecondary}
        />
        <PremiumText
          variant="bodyMedium"
          color={colors.textSecondary}
          style={styles.placeholder}
        >
          Search here...
        </PremiumText>
        <View style={styles.micWrap}>
          <AppSymbol name="mic.fill" size={18} tintColor={colors.primary} />
        </View>
      </Pressable>
      <Pressable
        style={[styles.vegToggle, vegOnly && styles.vegToggleOn]}
        onPress={() => setVegOnly((v) => !v)}
      >
        <PremiumText
          variant="label"
          color={vegOnly ? colors.success : colors.textPrimary}
        >
          VEG
        </PremiumText>
        <View style={[styles.dot, vegOnly && styles.dotOn]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundMuted,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0 4px 16px rgba(28, 28, 30, 0.06)',
  },
  placeholder: {
    flex: 1,
  },
  micWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegToggle: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundMuted,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0 4px 16px rgba(28, 28, 30, 0.06)',
  },
  vegToggleOn: {
    borderWidth: 1.5,
    borderColor: colors.success,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.borderStrong,
  },
  dotOn: {
    backgroundColor: colors.success,
  },
});
