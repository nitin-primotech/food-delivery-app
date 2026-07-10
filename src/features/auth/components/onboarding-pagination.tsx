import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radius } from '@/theme/spacing';

type OnboardingPaginationProps = {
  count: number;
  activeIndex: number;
};

export function OnboardingPagination({
  count,
  activeIndex,
}: OnboardingPaginationProps) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {Array.from({ length: count }, (_, index) => (
        <View
          key={`dot-${index}`}
          style={[
            styles.dot,
            index === activeIndex ? styles.dotActive : styles.dotInactive,
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: index === activeIndex }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: radius.full,
    borderCurve: 'continuous',
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: colors.borderStrong,
  },
});
