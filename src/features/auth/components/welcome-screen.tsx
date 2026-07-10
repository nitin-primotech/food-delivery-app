import { Image } from 'expo-image';
import { type Href, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OnboardingPagination } from '@/features/auth/components/onboarding-pagination';
import {
  WELCOME_ILLUSTRATION_ASPECT,
  WELCOME_ILLUSTRATION_MAX_HEIGHT_RATIO,
  WELCOME_SLIDES,
  type WelcomeSlide,
} from '@/features/auth/constants/welcome.constants';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticPressIn, hapticPrimaryAction } from '@/shared/haptics/feedback';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

function WelcomeIllustration({
  slide,
  illustrationWidth,
  illustrationHeight,
}: {
  slide: WelcomeSlide;
  illustrationWidth: number;
  illustrationHeight: number;
}) {
  return (
    <View
      style={[
        styles.illustrationFrame,
        { width: illustrationWidth, height: illustrationHeight },
      ]}
    >
      <Image
        source={slide.image}
        style={{
          width: illustrationWidth,
          height: illustrationHeight,
          transform: [{ scale: slide.imageScale }],
        }}
        contentFit="contain"
        cachePolicy="memory-disk"
        priority="high"
        transition={150}
      />
    </View>
  );
}

export function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  const maxIllustrationHeight = Math.round(
    screenHeight * WELCOME_ILLUSTRATION_MAX_HEIGHT_RATIO,
  );
  const illustrationWidth = screenWidth - spacing.xl * 2;
  const naturalHeight = Math.round(
    illustrationWidth * WELCOME_ILLUSTRATION_ASPECT,
  );
  const illustrationHeight = Math.min(naturalHeight, maxIllustrationHeight);
  const fittedWidth = Math.round(
    illustrationHeight / WELCOME_ILLUSTRATION_ASPECT,
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const nextIndex = viewableItems[0]?.index;
      if (typeof nextIndex === 'number') {
        setActiveIndex(nextIndex);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  function handleGetStarted() {
    hapticPrimaryAction();
    router.push('/(auth)/phone' as Href);
  }

  return (
    <View style={styles.root}>
      <View style={styles.contentArea}>
        <FlatList
          data={WELCOME_SLIDES}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          bounces={false}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          style={styles.carousel}
          contentContainerStyle={{ paddingTop: insets.top + spacing.sm }}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width: screenWidth }]}>
              <WelcomeIllustration
                slide={item}
                illustrationWidth={fittedWidth}
                illustrationHeight={illustrationHeight}
              />
              <View style={styles.copyHost}>
                <View style={styles.copyBlock}>
                  <Text style={styles.headline}>
                    {item.line1}
                    {'\n'}
                    <Text style={styles.headlineAccent}>{item.line2}</Text>
                  </Text>
                  <Text style={styles.subheadline}>{item.subheadline}</Text>
                </View>
              </View>
            </View>
          )}
        />
      </View>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.lg) },
        ]}
      >
        <OnboardingPagination
          count={WELCOME_SLIDES.length}
          activeIndex={activeIndex}
        />

        <Pressable
          onPress={handleGetStarted}
          onPressIn={hapticPressIn}
          style={styles.cta}
          accessibilityRole="button"
          accessibilityLabel="Get Started"
        >
          <Text style={styles.ctaLabel}>Get Started</Text>
          <View style={styles.ctaArrow}>
            <AppSymbol
              name="chevron.right"
              size={16}
              tintColor={colors.primary}
            />
          </View>
        </Pressable>

        <Text style={styles.legal}>
          By continuing, you agree to our{' '}
          <Text
            style={styles.legalLink}
            onPress={() => router.push('/(auth)/terms')}
          >
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text
            style={styles.legalLink}
            onPress={() => router.push('/(auth)/privacy')}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentArea: {
    flex: 1,
  },
  carousel: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
  },
  illustrationFrame: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  copyHost: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  copyBlock: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  headline: {
    fontFamily: fonts.bold,
    fontSize: 34,
    lineHeight: 42,
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  headlineAccent: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  subheadline: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 320,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.white,
  },
  cta: {
    minHeight: 56,
    borderRadius: radius.full,
    borderCurve: 'continuous',
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    boxShadow: '0 8px 24px rgba(212, 84, 60, 0.28)',
  },
  ctaLabel: {
    fontFamily: fonts.semibold,
    fontSize: 17,
    lineHeight: 22,
    color: colors.textInverse,
  },
  ctaArrow: {
    position: 'absolute',
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.textInverse,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legal: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  legalLink: {
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
});
