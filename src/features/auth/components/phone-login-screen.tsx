import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { requestOtp } from '@/features/auth/services/auth.service';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumButton } from '@/shared/components/premium-button';
import { PremiumText } from '@/shared/components/premium-text';
import {
  formTextInputProps,
  keyboardAvoidingBehavior,
} from '@/shared/utils/keyboard';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function PhoneLoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const { width, height } = useWindowDimensions();
  const isCompact = height < 820;
  const artSize = Math.min(width * (isCompact ? 0.68 : 0.78), 360);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleContinue() {
    setError(null);
    setIsLoading(true);
    try {
      await requestOtp(phone);
      Keyboard.dismiss();
      router.push({
        pathname: '/(auth)/verify',
        params: { phone: phone.replace(/\D/g, '') },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  function clearPhone() {
    setPhone('');
    setError(null);
    inputRef.current?.focus();
  }

  const digits = phone.replace(/\D/g, '');
  const canContinue = digits.length >= 10 && !isLoading;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={keyboardAvoidingBehavior}
    >
      <AppStatusBar style="dark" />

      <View style={styles.backdrop}>
        <View style={styles.topGlow} />
        <View style={styles.rightGlow} />
        <View style={styles.leafGlow} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        bounces={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.lg,
          },
        ]}
      >
        <View style={styles.page}>
          <View style={styles.heroRow}>
            <View style={styles.heroCopy}>
              <View style={styles.brandRow}>
                <View style={styles.brandIcon} accessibilityElementsHidden>
                  <View style={styles.brandKnob} />
                  <View style={styles.brandDome} />
                  <View style={styles.brandLineOne} />
                  <View style={styles.brandLineTwo} />
                  <View style={styles.brandLineThree} />
                </View>
                <View>
                  <View style={styles.wordmarkRow}>
                    <PremiumText variant="h1" style={styles.wordmarkDark}>
                      Food
                    </PremiumText>
                    <PremiumText
                      variant="h1"
                      color={colors.primary}
                      style={styles.wordmarkAccent}
                    >
                      Rush
                    </PremiumText>
                  </View>
                  <PremiumText variant="body" color={colors.textSecondary}>
                    Delicious food, delivered fast
                  </PremiumText>
                </View>
              </View>

              <View style={styles.copyBlock}>
                <PremiumText variant="display" style={styles.heroTitle}>
                  Welcome back!
                </PremiumText>
                <PremiumText
                  variant="body"
                  color={colors.textSecondary}
                  style={styles.heroSubtitle}
                >
                  Sign in with your phone number to continue
                </PremiumText>
              </View>
            </View>

            <View style={[styles.heroArt, { width: artSize, height: artSize }]}>
              <View style={styles.heroOrb} />
              <View style={styles.heroOrbSmall} />
              <View style={styles.heroRing} />
              <View
                style={[styles.heroStack, { width: artSize, height: artSize }]}
              >
                <View style={styles.leaf}>
                  <AppSymbol
                    name="leaf.fill"
                    size={isCompact ? 18 : 22}
                    tintColor="#79B83E"
                  />
                </View>
                <Image
                  source={require('@/assets/foodimages/a8.png')}
                  style={[
                    styles.heroPlate,
                    { width: artSize, height: artSize },
                  ]}
                  contentFit="contain"
                  transition={180}
                />
              </View>
            </View>
          </View>

          <View style={styles.formCard}>
            <PremiumText variant="h3" style={styles.formTitle}>
              Login with Phone Number
            </PremiumText>
            <PremiumText
              variant="body"
              color={colors.textSecondary}
              style={styles.formSubtitle}
            >
              We&apos;ll send you a verification code
            </PremiumText>

            <View style={styles.inputWrap}>
              <View style={styles.countrySection}>
                <TextInput
                  value="+91"
                  editable={false}
                  style={styles.countryCode}
                />
                <AppSymbol
                  name="chevron.down"
                  size={12}
                  tintColor={colors.textTertiary}
                />
              </View>

              <View style={styles.inputDivider} />

              <View style={styles.inputSection}>
                <AppSymbol
                  name="phone.fill"
                  size={18}
                  tintColor={colors.textTertiary}
                />
                <TextInput
                  ref={inputRef}
                  value={phone}
                  onChangeText={(t) => {
                    setPhone(t.replace(/\D/g, '').slice(0, 10));
                    setError(null);
                  }}
                  keyboardType="number-pad"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  placeholder="Phone number"
                  placeholderTextColor={colors.textTertiary}
                  style={styles.input}
                  maxLength={10}
                  selectionColor={colors.textPrimary}
                  blurOnSubmit
                  {...formTextInputProps}
                />
                {phone.length > 0 ? (
                  <Pressable
                    onPress={clearPhone}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Clear phone number"
                  >
                    <AppSymbol
                      name="xmark.circle.fill"
                      size={20}
                      tintColor={colors.textTertiary}
                    />
                  </Pressable>
                ) : null}
              </View>
            </View>

            {error ? (
              <PremiumText variant="caption" color={colors.danger} selectable>
                {error}
              </PremiumText>
            ) : null}

            <PremiumButton
              label={isLoading ? 'Sending OTP…' : 'Send OTP'}
              onPress={handleContinue}
              disabled={!canContinue}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    left: -40,
    top: -60,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: colors.backgroundMuted,
    opacity: 0.7,
  },
  rightGlow: {
    position: 'absolute',
    right: -90,
    top: 100,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: colors.accentMuted,
    opacity: 0.34,
  },
  leafGlow: {
    position: 'absolute',
    left: 26,
    top: 170,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.backgroundElevated,
    opacity: 0.8,
    ...shadows.soft,
  },
  scrollContent: {
    flexGrow: 1,
  },
  page: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  heroCopy: {
    flexGrow: 1,
    gap: spacing.xl,
    paddingTop: spacing.xs,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandIcon: {
    width: 50,
    height: 36,
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
    width: 34,
    height: 18,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: colors.primary,
    borderCurve: 'continuous',
  },
  brandLineOne: {
    position: 'absolute',
    left: 0,
    bottom: 12,
    width: 34,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  brandLineTwo: {
    position: 'absolute',
    left: 8,
    bottom: 7,
    width: 14,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  brandLineThree: {
    position: 'absolute',
    left: 0,
    bottom: 1,
    width: 26,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  wordmarkDark: {
    fontSize: 30,
  },
  wordmarkAccent: {
    fontSize: 30,
  },
  copyBlock: {
    gap: spacing.sm,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 34,
    // maxWidth: 160,
  },
  heroSubtitle: {
    maxWidth: 180,
    lineHeight: 24,
  },
  heroArt: {
    position: 'absolute',
    zIndex: -1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: spacing.sm,
    left: 120,
    top: 50,
  },
  heroOrb: {
    position: 'absolute',
    right: -10,
    top: 28,
    width: 96,
    height: 96,
    borderRadius: 96,
    backgroundColor: colors.accentMuted,
    opacity: 0.44,
  },
  heroOrbSmall: {
    position: 'absolute',
    left: 22,
    bottom: 10,
    width: 72,
    height: 72,
    borderRadius: 72,
    backgroundColor: colors.backgroundMuted,
    opacity: 0.6,
  },
  heroRing: {
    position: 'absolute',
    left: 0,
    top: 132,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(212,84,60,0.18)',
  },
  heroStack: {
    position: 'relative',
  },
  heroPlate: {
    position: 'absolute',
    right: -4,
    top: 10,
  },
  leaf: {
    position: 'absolute',
    right: 22,
    top: 20,
    zIndex: 2,
    transform: [{ rotate: '-16deg' }],
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    borderCurve: 'continuous',
    ...shadows.card,
  },
  formTitle: {
    lineHeight: 28,
  },
  formSubtitle: {
    marginTop: -spacing.xs,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
    overflow: 'hidden',
    borderCurve: 'continuous',
  },
  countrySection: {
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    fontFamily: fonts.semibold,
    color: colors.textPrimary,
    width: 34,
  },
  inputDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
  },
  inputSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 22,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  bottomLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingTop: spacing.xl,
  },
});
