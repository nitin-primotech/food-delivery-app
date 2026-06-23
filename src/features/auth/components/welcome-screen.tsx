import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import {
  hapticPrimaryAction,
  hapticSecondaryAction,
} from '@/shared/haptics/feedback';
import { setOnboardingStep } from '@/store/app.store';
import { colors, gradients, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

const FEATURE_ITEMS = [
  {
    icon: 'takeoutbag.and.cup.and.straw.fill',
    title: 'Wide Selection',
    body: 'Choose from a variety of cuisines and restaurants.',
  },
  {
    icon: 'bicycle',
    title: 'Lightning Fast',
    body: 'Super fast delivery to bring your food hot & fresh.',
  },
  {
    icon: 'shield.fill',
    title: 'Safe & Secure',
    body: 'Your data and payments are 100% protected.',
  },
] as const;

const AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&q=80&fit=crop&crop=faces',
] as const;

export function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isCompact = height < 820;
  const bowlSize = Math.min(
    width * (isCompact ? 0.56 : 0.7),
    isCompact ? 260 : 320,
  );
  const heroTitleSize = isCompact ? 22 : 28;
  const heroLineHeight = isCompact ? 26 : 32;
  const deliveryCardWidth = isCompact ? 140 : 154;
  const featureIconSize = isCompact ? 54 : 69;
  const ctaMinHeight = isCompact ? 56 : 64;
  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  function goToPhoneScreen() {
    setOnboardingStep('phone');
    router.push('/(auth)/phone' as Href);
  }

  function handlePressIn() {
    buttonScale.value = withSpring(0.98, { damping: 18, stiffness: 420 });
  }

  function handlePressOut() {
    buttonScale.value = withSpring(1, { damping: 16, stiffness: 320 });
  }

  function handlePrimaryPress() {
    hapticPrimaryAction();
    goToPhoneScreen();
  }

  function handleSecondaryPress() {
    hapticSecondaryAction();
    goToPhoneScreen();
  }

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />
      <View style={styles.backdrop}>
        <View style={styles.topGlow} />
        <View style={styles.bottomGlow} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        bounces={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + spacing.sm,
            paddingBottom:
              insets.bottom + (isCompact ? spacing.sm : spacing.lg),
          },
        ]}
      >
        <View style={styles.page}>
          <Animated.View
            entering={FadeInDown.duration(420)}
            style={[styles.top, isCompact && styles.topCompact]}
          >
            <View style={styles.brandRow}>
              <View style={styles.brandIcon} accessibilityElementsHidden>
                <View style={styles.brandKnob} />
                <View style={styles.brandDome} />
                <View style={styles.brandLineOne} />
                <View style={styles.brandLineTwo} />
                <View style={styles.brandLineThree} />
              </View>
              <View style={styles.wordmark}>
                <PremiumText variant="display" style={styles.wordmarkDark}>
                  Food
                </PremiumText>
                <PremiumText
                  variant="display"
                  color={colors.primary}
                  style={styles.wordmarkDark}
                >
                  Rush
                </PremiumText>
              </View>
            </View>

            <Animated.View
              entering={FadeInDown.delay(80).duration(420)}
              style={[styles.deliveryCard]}
            >
              <View style={styles.deliveryRow}>
                <View style={styles.deliveryIconWrap}>
                  <AppSymbol
                    name="clock"
                    size={14}
                    tintColor={colors.primary}
                  />
                </View>
                <PremiumText variant="h3" style={[styles.deliveryTitle]}>
                  20 min
                </PremiumText>
              </View>
              <PremiumText
                variant="body"
                color={colors.textSecondary}
                style={styles.deliveryBodyCompact}
              >
                Fast Delivery
              </PremiumText>
            </Animated.View>
          </Animated.View>

          <View
            style={[styles.heroStage, isCompact && styles.heroStageCompact]}
          >
            <Animated.View
              entering={FadeInUp.delay(100).duration(420)}
              style={styles.copyBlock}
            >
              <PremiumText
                variant="display"
                style={[
                  styles.heroTitle,
                  {
                    fontSize: heroTitleSize,
                    lineHeight: heroLineHeight,
                  },
                ]}
              >
                Great food,
              </PremiumText>
              <PremiumText
                variant="display"
                color={colors.primary}
                style={[
                  styles.heroTitleAccent,
                  {
                    fontSize: heroTitleSize,
                    lineHeight: heroLineHeight,
                  },
                ]}
              >
                delivered fast
              </PremiumText>
              <PremiumText
                variant="body"
                color={colors.textSecondary}
                style={[
                  styles.heroDescription,
                  isCompact && styles.heroDescriptionCompact,
                ]}
              >
                Your favorite meals, delivered to your door in no time.
              </PremiumText>
            </Animated.View>
            <Animated.View
              entering={FadeInUp.delay(140).duration(480)}
              style={[
                styles.bowlWrap,
                {
                  width: bowlSize,
                  height: bowlSize,
                },
                isCompact && styles.bowlWrapCompact,
              ]}
            >
              <View style={styles.bowlHalo} />
              <Image
                source={require('@/assets/foodimages/a8.png')}
                style={styles.bowlImage}
                contentFit="contain"
                transition={180}
              />
            </Animated.View>

            <Animated.View
              entering={FadeIn.delay(220).duration(500)}
              style={[styles.ratingCard, isCompact && styles.ratingCardCompact]}
            >
              <View style={styles.avatarStack}>
                {AVATARS.map((uri, index) => (
                  <Image
                    key={uri}
                    source={{ uri }}
                    style={[
                      styles.avatar,
                      index > 0 && { marginLeft: -spacing.xs },
                    ]}
                    contentFit="cover"
                  />
                ))}
              </View>
              <View style={styles.ratingText}>
                <View style={styles.ratingRow}>
                  <PremiumText variant="h3" style={styles.ratingValue}>
                    4.8
                  </PremiumText>
                  <AppSymbol
                    name="star.fill"
                    size={isCompact ? 14 : 18}
                    tintColor={colors.star}
                  />
                </View>
                <PremiumText variant="caption" color={colors.textSecondary}>
                  10K+ happy customers
                </PremiumText>
              </View>
            </Animated.View>
          </View>

          <Animated.View
            entering={FadeInUp.delay(220).duration(420)}
            style={[styles.features, isCompact && styles.featuresCompact]}
          >
            {FEATURE_ITEMS.map((item) => (
              <View key={item.title} style={styles.featureCard}>
                <View
                  style={[
                    styles.featureIconWrap,
                    { width: featureIconSize, height: featureIconSize },
                  ]}
                >
                  <AppSymbol
                    name={item.icon}
                    size={isCompact ? 18 : 22}
                    tintColor={colors.primary}
                  />
                </View>
                <PremiumText
                  variant="bodyMedium"
                  style={[
                    styles.featureTitle,
                    isCompact && styles.featureTitleCompact,
                  ]}
                >
                  {item.title}
                </PremiumText>
              </View>
            ))}
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(300).duration(420)}
            style={[styles.footer, isCompact && styles.footerCompact]}
          >
            <Animated.View style={[styles.ctaWrap, buttonStyle, shadows.float]}>
              <Pressable
                onPress={handlePrimaryPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                accessibilityRole="button"
                accessibilityLabel="Get started"
                style={styles.ctaButton}
              >
                <LinearGradient
                  colors={gradients.primary.colors}
                  start={gradients.primary.start}
                  end={gradients.primary.end}
                  style={[styles.ctaGradient, { minHeight: ctaMinHeight }]}
                >
                  <PremiumText variant="h3" color={colors.textInverse}>
                    Get Started
                  </PremiumText>
                  <AppSymbol
                    name="chevron.right"
                    size={28}
                    tintColor={colors.textInverse}
                  />
                </LinearGradient>
              </Pressable>
            </Animated.View>

            <Pressable
              onPress={handleSecondaryPress}
              accessibilityRole="button"
              accessibilityLabel="Sign in"
              style={styles.signInRow}
            >
              <PremiumText variant="body" color={colors.textSecondary}>
                Already have an account?{' '}
              </PremiumText>
              <PremiumText variant="bodyMedium" color={colors.primary}>
                Sign In
              </PremiumText>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  topGlow: {
    position: 'absolute',
    right: -70,
    top: -48,
    width: 240,
    height: 240,
    borderRadius: 240,
    backgroundColor: colors.accentMuted,
    opacity: 0.34,
  },
  bottomGlow: {
    position: 'absolute',
    left: -88,
    bottom: 120,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: colors.backgroundMuted,
    opacity: 0.7,
  },
  scrollContent: {
    flexGrow: 1,
  },
  page: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  topCompact: {
    marginBottom: -spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 1,
  },
  brandIcon: {
    width: 42,
    height: 30,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 2,
  },
  brandKnob: {
    position: 'absolute',
    top: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  brandDome: {
    width: 30,
    height: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: colors.primary,
    borderCurve: 'continuous',
  },
  brandLineOne: {
    position: 'absolute',
    left: 0,
    bottom: 12,
    width: 32,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  brandLineTwo: {
    position: 'absolute',
    left: 8,
    bottom: 7,
    width: 12,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  brandLineThree: {
    position: 'absolute',
    left: 0,
    bottom: 1,
    width: 24,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  wordmark: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  wordmarkDark: {
    fontSize: 30,
  },
  deliveryCard: {
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.glass,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  deliveryIconWrap: {
    alignSelf: 'flex-start',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  deliveryTitle: {
    fontSize: 14,
  },
  deliveryTitleCompact: {
    fontSize: 12,
    lineHeight: 16,
  },
  deliveryBodyCompact: {
    fontSize: 14,
    textAlign: 'center',
  },
  heroStage: {
    marginTop: spacing.md,
    minHeight: 420,
  },
  heroStageCompact: {
    marginTop: spacing.md,
    minHeight: 340,
  },
  copyBlock: {
    maxWidth: '52%',
    gap: spacing.xxs,
    zIndex: 3,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 32,
  },
  heroTitleAccent: {
    fontSize: 28,
    lineHeight: 32,
  },
  heroDescription: {
    marginTop: spacing.sm,
    maxWidth: 200,
  },
  heroDescriptionCompact: {
    marginTop: spacing.xs,
    maxWidth: 180,
    fontSize: 12,
    lineHeight: 16,
  },
  routeRow: {
    position: 'absolute',
    left: spacing.lg,
    top: 150,
    zIndex: 2,
    alignItems: 'center',
  },
  routeRowCompact: {
    top: 130,
  },
  routePin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundElevated,
    ...shadows.soft,
  },
  routePath: {
    marginTop: spacing.xs,
    width: 92,
    height: 52,
    borderTopWidth: 1.25,
    borderTopColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 999,
    transform: [{ rotate: '-6deg' }],
  },
  routePathCompact: {
    width: 82,
    height: 46,
  },
  bowlWrap: {
    position: 'absolute',
    right: -22,
    top: 128,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  bowlWrapCompact: {
    right: -14,
    top: 112,
  },
  bowlHalo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.backgroundElevated,
    opacity: 0.72,
    ...shadows.card,
  },
  bowlImage: {
    width: '100%',
    height: '100%',
  },
  ratingCard: {
    position: 'absolute',
    left: spacing.lg,
    top: 300,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xs,
    paddingRight: spacing.sm,
    borderRadius: radius.xl,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.divider,
    zIndex: 4,
    ...shadows.card,
  },
  ratingCardCompact: {
    top: 260,
    gap: spacing.xs,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.xs,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.backgroundElevated,
    backgroundColor: colors.backgroundMuted,
  },
  ratingText: {
    gap: spacing.xxs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  ratingValue: {
    fontSize: 18,
    lineHeight: 22,
  },
  features: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  featuresCompact: {
    marginTop: spacing.sm,
  },
  featureCard: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
  },
  featureIconWrap: {
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundMuted,
  },
  featureTitle: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
  },
  featureTitleCompact: {
    fontSize: 11,
    lineHeight: 14,
  },
  featureBody: {
    textAlign: 'center',
    lineHeight: 14,
  },
  featureBodyCompact: {
    fontSize: 10,
    lineHeight: 12,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  footerCompact: {
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  ctaWrap: {
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  ctaButton: {
    width: '100%',
  },
  ctaGradient: {
    minHeight: 56,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    borderCurve: 'continuous',
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingBottom: spacing.xs,
  },
});
