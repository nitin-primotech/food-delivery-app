import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  type CountryItem,
  CountryPicker,
  countryCodes,
} from 'react-native-country-codes-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { requestOtp } from '@/features/auth/services/auth.service';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import { hapticPressIn, hapticPrimaryAction } from '@/shared/haptics/feedback';
import { formTextInputProps } from '@/shared/utils/keyboard';
import { colors, gradients, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const DEFAULT_COUNTRY_DIAL_CODE = '+91';
const DEFAULT_COUNTRY: CountryItem = countryCodes.find(
  (country) => country.code === 'IN',
) ?? {
  name: { en: 'India' },
  dial_code: DEFAULT_COUNTRY_DIAL_CODE,
  code: 'IN',
  flag: '🇮🇳',
};
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function getPhoneDigitLimit(dialCode: string) {
  return dialCode === DEFAULT_COUNTRY_DIAL_CODE ? 10 : 15;
}

function isValidPhone(digits: string, dialCode: string) {
  if (dialCode === DEFAULT_COUNTRY_DIAL_CODE) {
    return digits.length === 10;
  }
  return digits.length >= 6 && digits.length <= 15;
}

export function PhoneLoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const { width, height } = useWindowDimensions();
  const isCompact = height < 820;
  const artSize = Math.min(width * 0.78, 340);
  const [selectedCountry, setSelectedCountry] =
    useState<CountryItem>(DEFAULT_COUNTRY);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));
  const phoneDigitLimit = getPhoneDigitLimit(selectedCountry.dial_code);

  async function handleContinue() {
    setError(null);
    setIsLoading(true);
    try {
      await requestOtp(phone);
      Keyboard.dismiss();
      router.push({
        pathname: '/(auth)/verify',
        params: {
          phone: phone.replace(/\D/g, ''),
          dialCode: selectedCountry.dial_code,
        },
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

  function openCountryPicker() {
    Keyboard.dismiss();
    setShowCountryPicker(true);
  }

  function handleCountrySelect(item: CountryItem) {
    setSelectedCountry(item);
    setShowCountryPicker(false);
    setPhone('');
    setError(null);
  }

  function handlePressIn() {
    if (!canContinue) return;
    hapticPressIn();
    buttonScale.value = withSpring(0.98, { damping: 18, stiffness: 420 });
  }

  function handlePressOut() {
    buttonScale.value = withSpring(1, { damping: 16, stiffness: 320 });
  }

  function handlePress() {
    if (!canContinue) return;
    hapticPrimaryAction();
    handleContinue();
  }

  const digits = phone.replace(/\D/g, '');
  const canContinue =
    isValidPhone(digits, selectedCountry.dial_code) && !isLoading;

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />

      <View style={styles.backdrop}>
        <View style={styles.topGlow} />
        <View style={styles.rightGlow} />
      </View>
      <KeyboardAwareScrollView
        bottomOffset={60}
        extraKeyboardSpace={40}
        automaticallyAdjustKeyboardInsets
        automaticallyAdjustContentInsets
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
          bounces={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + spacing.xs,
              paddingBottom: insets.bottom + spacing.lg,
            },
          ]}
        >
          <View style={styles.page}>
            <View
              style={[
                styles.illustrationWrap,
                {
                  width: artSize,
                  height: artSize * 0.88,
                  marginTop: isCompact ? spacing.xs : spacing.sm,
                },
              ]}
            >
              <Image
                source={require('@/assets/images/cart.png')}
                style={styles.illustrationImage}
                contentFit="contain"
                transition={180}
              />
            </View>

            <View style={styles.headlineBlock}>
              <PremiumText variant="display" style={styles.headlineSerif}>
                Good food,
              </PremiumText>
              <View style={styles.headlineSecondRow}>
                <View style={styles.deliveredWrap}>
                  <PremiumText
                    color={colors.primary}
                    style={styles.headlineAccent}
                  >
                    delivered
                  </PremiumText>
                  <View style={styles.deliveredUnderline} />
                </View>
                <PremiumText style={styles.headlineSans}> fast</PremiumText>
              </View>
            </View>

            <View style={styles.formSection}>
              <PremiumText
                variant="body"
                color={colors.textSecondary}
                style={styles.inputLabel}
              >
                Enter your mobile number
              </PremiumText>

              <View style={styles.inputWrap}>
                <Pressable
                  onPress={openCountryPicker}
                  style={styles.countrySection}
                  accessibilityRole="button"
                  accessibilityLabel={`Country code ${selectedCountry.name.en} ${selectedCountry.dial_code}`}
                >
                  <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                  <PremiumText style={styles.countryCode}>
                    {selectedCountry.dial_code}
                  </PremiumText>
                  <AppSymbol
                    name="chevron.down"
                    size={12}
                    tintColor={colors.textTertiary}
                  />
                </Pressable>

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
                      setPhone(t.replace(/\D/g, '').slice(0, phoneDigitLimit));
                      setError(null);
                    }}
                    keyboardType="number-pad"
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                    placeholder="Phone number"
                    placeholderTextColor={colors.textTertiary}
                    style={styles.input}
                    maxLength={phoneDigitLimit}
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

              <Animated.View
                style={[
                  styles.ctaWrap,
                  buttonStyle,
                  !canContinue && styles.ctaWrapDisabled,
                ]}
              >
                <AnimatedPressable
                  onPress={handlePress}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  disabled={!canContinue}
                  accessibilityRole="button"
                  accessibilityLabel="Send OTP"
                  accessibilityState={{ disabled: !canContinue }}
                  style={styles.ctaButton}
                >
                  <LinearGradient
                    colors={gradients.primary.colors}
                    start={gradients.primary.start}
                    end={gradients.primary.end}
                    style={styles.ctaGradient}
                  >
                    <View style={styles.ctaSideLeft} />
                    <PremiumText variant="h3" color={colors.textInverse}>
                      {isLoading ? 'Sending OTP…' : 'Send OTP'}
                    </PremiumText>
                    <View style={styles.ctaSideRight}>
                      <AppSymbol
                        name="chevron.right"
                        size={22}
                        tintColor={colors.textInverse}
                      />
                    </View>
                  </LinearGradient>
                </AnimatedPressable>
              </Animated.View>
            </View>
          </View>
        </ScrollView>
        {/* </KeyboardAvoidingView> */}
      </KeyboardAwareScrollView>

      <CountryPicker
        show={showCountryPicker}
        lang="en"
        initialState={selectedCountry.dial_code}
        popularCountries={['IN']}
        pickerButtonOnPress={handleCountrySelect}
        onBackdropPress={() => setShowCountryPicker(false)}
        onRequestClose={() => setShowCountryPicker(false)}
        inputPlaceholder="Search country"
        inputPlaceholderTextColor={colors.textTertiary}
        searchMessage="No country found"
        style={{
          modal: {
            height: '72%',
            backgroundColor: colors.backgroundElevated,
          },
          backdrop: {
            backgroundColor: colors.overlay,
          },
          line: {
            backgroundColor: colors.divider,
          },
          textInput: {
            fontFamily: fonts.medium,
            color: colors.textPrimary,
            backgroundColor: colors.backgroundMuted,
            borderRadius: radius.sm,
            paddingHorizontal: spacing.md,
          },
          countryButtonStyles: {
            backgroundColor: colors.backgroundElevated,
            borderBottomColor: colors.divider,
            borderBottomWidth: StyleSheet.hairlineWidth,
          },
          dialCode: {
            fontFamily: fonts.semibold,
            color: colors.textPrimary,
          },
          countryName: {
            fontFamily: fonts.regular,
            color: colors.textSecondary,
          },
          searchMessageText: {
            fontFamily: fonts.regular,
            color: colors.textSecondary,
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
  },
  flex: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  topGlow: {
    position: 'absolute',
    left: -50,
    top: -40,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: colors.backgroundMuted,
    opacity: 0.5,
  },
  rightGlow: {
    position: 'absolute',
    right: -60,
    top: 140,
    width: 140,
    height: 140,
    borderRadius: 140,
    backgroundColor: colors.accentMuted,
    opacity: 0.28,
  },
  scrollContent: {
    flexGrow: 1,
  },
  page: {
    flex: 1,
    paddingHorizontal: spacing.lg + 4,
  },
  illustrationWrap: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationImage: {
    width: 460,
    height: 460,
  },
  headlineBlock: {
    alignSelf: 'stretch',
    marginTop: spacing.md,
    gap: 2,
  },
  headlineSerif: {
    fontSize: 30,
    lineHeight: 36,
  },
  headlineSecondRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  headlineAccent: {
    fontFamily: fonts.bold,
    fontSize: 30,
    lineHeight: 36,
  },
  headlineSans: {
    fontFamily: fonts.bold,
    fontSize: 30,
    lineHeight: 36,
    color: colors.textPrimary,
  },
  deliveredWrap: {
    alignItems: 'center',
  },
  deliveredUnderline: {
    marginTop: 6,
    width: 64,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  formSection: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  inputLabel: {
    fontSize: 15,
    lineHeight: 20,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
    overflow: 'hidden',
    borderCurve: 'continuous',
    ...shadows.soft,
  },
  countrySection: {
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 56,
  },
  countryFlag: {
    fontSize: 20,
    lineHeight: 24,
  },
  countryCode: {
    fontFamily: fonts.semibold,
    color: colors.textPrimary,
    fontSize: 16,
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
  ctaWrap: {
    marginTop: spacing.xs,
    borderRadius: 18,
    overflow: 'hidden',
    ...shadows.float,
  },
  ctaWrapDisabled: {
    opacity: 0.55,
  },
  ctaButton: {
    width: '100%',
  },
  ctaGradient: {
    minHeight: 56,
    borderRadius: 18,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderCurve: 'continuous',
  },
  ctaSideLeft: {
    flex: 1,
  },
  ctaSideRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
