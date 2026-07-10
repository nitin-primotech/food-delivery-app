import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  APP_LOGO,
  SPLASH_BACKGROUND,
  SPLASH_HERO,
} from '@/constants/brand-assets';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type AppSplashProps = {
  /** Hide after hydration; max 2.5s either way */
  ready?: boolean;
};

export function AppSplash({ ready = false }: AppSplashProps) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const progress = useSharedValue(0.15);
  const heroHeight = Math.round(screenHeight * 0.34);

  useEffect(() => {
    progress.value = withTiming(ready ? 1 : 0.72, {
      duration: ready ? 280 : 1100,
    });
  }, [ready, progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${Math.max(progress.value * 100, 8)}%`,
  }));

  return (
    <View style={styles.root}>
      <Image
        source={SPLASH_BACKGROUND}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        cachePolicy="memory-disk"
        priority="high"
      />

      <Animated.View entering={FadeIn.duration(500)} style={styles.content}>
        <View style={[styles.heroFrame, { height: heroHeight }]}>
          <Image
            source={SPLASH_HERO}
            style={{ width: heroHeight * 0.95, height: heroHeight }}
            contentFit="contain"
            cachePolicy="memory-disk"
            priority="high"
          />
        </View>

        <View style={styles.brandBlock}>
          <Text style={styles.brand}>
            food<Text style={styles.brandAccent}>Rush</Text>
          </Text>
          <Text style={styles.tagline}>Premium food, delivered fast</Text>
        </View>
      </Animated.View>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.lg) },
        ]}
      >
        <Image
          source={APP_LOGO}
          style={styles.footerIcon}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
        <Text style={styles.footerLabel}>Preparing your experience</Text>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  heroFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  brandBlock: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  brand: {
    fontFamily: fonts.bold,
    fontSize: 36,
    lineHeight: 42,
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  brandAccent: {
    color: colors.primary,
  },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xxl,
  },
  footerIcon: {
    width: 28,
    height: 28,
    opacity: 0.9,
  },
  footerLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: radius.full,
    borderCurve: 'continuous',
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.full,
    borderCurve: 'continuous',
    backgroundColor: colors.primary,
  },
});
