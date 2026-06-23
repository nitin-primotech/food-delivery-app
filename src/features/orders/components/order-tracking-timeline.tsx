import { StyleSheet, Text, View } from 'react-native';

import type { OrderStatus } from '@/features/catalog/types/catalog.types';
import {
  formatTrackingStepTime,
  resolveTrackingStepState,
  TRACKING_STEPS,
} from '@/features/orders/constants/orders.constants';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors, screens } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type OrderTrackingTimelineProps = {
  status: OrderStatus;
  createdAt: string;
};

export function OrderTrackingTimeline({
  status,
  createdAt,
}: OrderTrackingTimelineProps) {
  return (
    <View style={styles.container}>
      {TRACKING_STEPS.map((step, index) => {
        const state = resolveTrackingStepState(index, status);
        const isLast = index === TRACKING_STEPS.length - 1;
        const timestamp = formatTrackingStepTime(createdAt, index, state);
        const connectorDone =
          !isLast && resolveTrackingStepState(index + 1, status) !== 'pending';

        return (
          <View key={step.key} style={styles.row}>
            <View style={styles.rail}>
              <View
                style={[
                  styles.iconWrap,
                  state === 'done' && styles.iconDone,
                  state === 'active' && styles.iconActive,
                  state === 'pending' && styles.iconPending,
                ]}
              >
                {state === 'done' ? (
                  <AppSymbol
                    name="checkmark"
                    size={12}
                    tintColor={colors.textInverse}
                  />
                ) : (
                  <AppSymbol
                    name={step.icon}
                    size={14}
                    tintColor={
                      state === 'active'
                        ? colors.textInverse
                        : colors.textTertiary
                    }
                  />
                )}
              </View>
              {!isLast ? (
                <View
                  style={[
                    styles.line,
                    connectorDone ? styles.lineDone : styles.linePending,
                  ]}
                />
              ) : null}
            </View>

            <View
              style={[
                styles.content,
                state === 'active' && styles.contentActive,
                !isLast && styles.contentSpaced,
              ]}
            >
              <Text
                style={[
                  styles.title,
                  state === 'active' && styles.titleActive,
                  state === 'pending' && styles.titlePending,
                ]}
              >
                {step.label}
              </Text>
              <Text
                style={[
                  styles.description,
                  state === 'pending' && styles.descriptionPending,
                ]}
              >
                {step.description}
              </Text>
              {timestamp ? (
                <Text style={styles.timestamp}>{timestamp}</Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rail: {
    width: 28,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
  iconDone: {
    backgroundColor: screens.tracking.activeStep,
  },
  iconActive: {
    backgroundColor: screens.tracking.activeStep,
  },
  iconPending: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  line: {
    flex: 1,
    width: 2,
    minHeight: 28,
    marginVertical: 4,
    borderRadius: 1,
  },
  lineDone: {
    backgroundColor: screens.tracking.activeStep,
  },
  linePending: {
    backgroundColor: colors.border,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    paddingVertical: 2,
    paddingRight: spacing.xs,
  },
  contentActive: {
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    borderRadius: 10,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  contentSpaced: {
    paddingBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  titleActive: {
    color: colors.primary,
  },
  titlePending: {
    color: colors.textTertiary,
    fontFamily: fonts.medium,
  },
  description: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  descriptionPending: {
    color: colors.textTertiary,
  },
  timestamp: {
    marginTop: 4,
    fontFamily: fonts.regular,
    fontSize: 9,
    lineHeight: 12,
    color: colors.textTertiary,
  },
});
