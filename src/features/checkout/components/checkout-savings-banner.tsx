import { StyleSheet, Text, View } from 'react-native';

import { FREE_DELIVERY_THRESHOLD } from '@/features/checkout/constants/checkout.constants';
import { formatInr } from '@/features/checkout/utils/format-currency';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type CheckoutSavingsBannerProps = {
  savings: number;
  subtotal: number;
  freeDelivery: boolean;
};

export function CheckoutSavingsBanner({
  savings,
  subtotal,
  freeDelivery,
}: CheckoutSavingsBannerProps) {
  const remaining = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);
  const progress = Math.min(subtotal / FREE_DELIVERY_THRESHOLD, 1);

  return (
    <View style={styles.banner}>
      <View style={styles.row}>
        <AppSymbol name="truck.box.fill" size={20} tintColor={colors.primary} />
        <View style={styles.copy}>
          {savings > 0 ? (
            <Text style={styles.title}>
              Yay! You are saving{' '}
              <Text style={styles.titleAccent}>{formatInr(savings)}</Text> on
              this order
            </Text>
          ) : (
            <Text style={styles.title}>
              Great picks! You&apos;re almost there
            </Text>
          )}
          {!freeDelivery && remaining > 0 ? (
            <Text style={styles.subtitle}>
              Add items worth {formatInr(remaining)} more to get{' '}
              <Text style={styles.subtitleAccent}>FREE delivery</Text>
            </Text>
          ) : (
            <Text style={styles.subtitle}>
              <Text style={styles.subtitleAccent}>FREE delivery</Text> unlocked
              on this order
            </Text>
          )}
        </View>
      </View>
      {!freeDelivery && remaining > 0 ? (
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
          <Text style={styles.progressLabel}>{formatInr(remaining)}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(212, 84, 60, 0.2)',
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  titleAccent: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  subtitleAccent: {
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: 'hidden',
    position: 'relative',
    marginTop: spacing.xs,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressLabel: {
    position: 'absolute',
    right: 0,
    top: 10,
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textTertiary,
  },
});
