import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { LinearTransition, ZoomIn } from 'react-native-reanimated';

import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';

type CartLineStepperProps = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

const LAYOUT = LinearTransition.springify().damping(20).stiffness(300);

/** Compact outline stepper for cart rows — Swiggy-style inline control. */
export function CartLineStepper({
  quantity,
  onDecrease,
  onIncrease,
}: CartLineStepperProps) {
  return (
    <View style={styles.root}>
      <Pressable
        onPress={onDecrease}
        style={styles.btn}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
      >
        <AppSymbol name="minus" size={12} tintColor={colors.primary} />
      </Pressable>
      <Animated.View
        key={quantity}
        entering={ZoomIn.springify().damping(18).stiffness(340).duration(160)}
        layout={LAYOUT}
        style={styles.qtyWrap}
      >
        <Text style={styles.qty}>{quantity}</Text>
      </Animated.View>
      <Pressable
        onPress={onIncrease}
        style={styles.btn}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
      >
        <AppSymbol name="plus" size={12} tintColor={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    borderCurve: 'continuous',
    paddingHorizontal: 2,
    paddingVertical: 1,
    minWidth: 76,
  },
  btn: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyWrap: {
    minWidth: 18,
    alignItems: 'center',
  },
  qty: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 15,
    color: colors.primary,
  },
});
