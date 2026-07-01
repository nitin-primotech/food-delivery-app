import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import {
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { gradients } from '@/theme/colors';
import { radius } from '@/theme/spacing';

type ShimmerProps = ViewProps & {
  height?: number;
  width?: number | `${number}%`;
  borderRadius?: number;
};

function styleFillsParent(style: StyleProp<ViewStyle>): boolean {
  const flat = StyleSheet.flatten(style);
  if (!flat) return false;
  return (
    flat.position === 'absolute' &&
    flat.top === 0 &&
    flat.bottom === 0 &&
    flat.left === 0 &&
    flat.right === 0
  );
}

export function Shimmer({
  height = 16,
  width = '100%',
  borderRadius = radius.sm,
  style,
  ...rest
}: ShimmerProps) {
  const translateX = useSharedValue(-1);
  const fillsParent = styleFillsParent(style);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.linear }),
      -1,
      false,
    );
  }, [translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * (fillsParent ? 240 : 120) }],
  }));

  return (
    <View
      style={[
        styles.base,
        !fillsParent && { height, width },
        { borderRadius, borderCurve: 'continuous' },
        style,
      ]}
      {...rest}
    >
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={gradients.shimmer.colors}
          start={gradients.shimmer.start}
          end={gradients.shimmer.end}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    backgroundColor: '#F0EBE4',
  },
});
