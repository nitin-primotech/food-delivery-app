import { Image } from 'expo-image';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { OtpDigitStatus } from '@/features/auth/components/verification-code/animated-code-number';
import { useAnimatedShake } from '@/features/auth/components/verification-code/use-animated-shake';
import { VerificationCode } from '@/features/auth/components/verification-code/verification-code';
import {
  requestOtp,
  verifyOtpAndCreateSession,
} from '@/features/auth/services/auth.service';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumButton } from '@/shared/components/premium-button';
import { PremiumText } from '@/shared/components/premium-text';
import {
  hapticPrimaryAction,
  hapticSecondaryAction,
  hapticSelection,
} from '@/shared/haptics/feedback';
import {
  keyboardAppearance,
  keyboardAvoidingBehavior,
} from '@/shared/utils/keyboard';
import { setAuthSession } from '@/store/auth.store';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

const OTP_LENGTH = 4;
const CORRECT_OTP = '1234';
const RESEND_SECONDS = 49;

function formatCountdown(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
}

export function OtpVerifyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);

  const verificationStatus = useSharedValue<OtpDigitStatus>('inProgress');
  const invisibleInputRef = useRef<TextInput>(null);
  const { shake, rShakeStyle } = useAnimatedShake();

  const phonePreview = phone?.replace(/\D/g, '') ?? '';
  const maskedPhone = phonePreview
    ? `+91 ${phonePreview.slice(0, 5)} ${phonePreview.slice(-5)}`
    : '+91';

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = setInterval(() => {
      setResendSeconds((current) => current - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendSeconds]);

  useEffect(() => {
    if (code.length === OTP_LENGTH) {
      handleVerifyPress();
    }
  }, [code]);

  useFocusEffect(
    useCallback(() => {
      const focusTimer = setTimeout(
        () => invisibleInputRef.current?.focus(),
        300,
      );
      return () => {
        clearTimeout(focusTimer);
        invisibleInputRef.current?.blur();
      };
    }, []),
  );

  const resetCode = useCallback(() => {
    setTimeout(() => {
      verificationStatus.value = 'inProgress';
      setCode([]);
      invisibleInputRef.current?.clear();
      invisibleInputRef.current?.focus();
    }, 700);
  }, [verificationStatus]);

  const onWrongCode = useCallback(() => {
    verificationStatus.value = 'wrong';
    shake();
    resetCode();
  }, [resetCode, shake, verificationStatus]);

  const onCorrectCode = useCallback(async () => {
    if (!phonePreview || isLoading) return;
    verificationStatus.value = 'correct';
    setIsLoading(true);

    try {
      const session = await verifyOtpAndCreateSession(
        phonePreview,
        CORRECT_OTP,
      );
      await setAuthSession(session);
      Keyboard.dismiss();
      InteractionManager.runAfterInteractions(() => {
        router.replace('/(auth)/name');
      });
    } catch {
      verificationStatus.value = 'wrong';
      shake();
      resetCode();
      setIsLoading(false);
    }
  }, [isLoading, phonePreview, resetCode, router, shake, verificationStatus]);

  async function handleResend() {
    if (!phonePreview || resendSeconds > 0 || isResending) return;
    hapticSelection();
    setIsResending(true);
    try {
      await requestOtp(phonePreview);
      setCode([]);
      verificationStatus.value = 'inProgress';
      setResendSeconds(RESEND_SECONDS);
      invisibleInputRef.current?.clear();
      invisibleInputRef.current?.focus();
    } catch {
      // Keep the current screen state if resend fails.
    } finally {
      setIsResending(false);
    }
  }

  function handleTextChange(text: string) {
    if (isLoading) return;

    const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
    const nextCode = digits.split('').map((digit) => Number(digit));
    setCode(nextCode);
    verificationStatus.value = 'inProgress';
  }

  function handleVerifyPress() {
    if (code.join('') === CORRECT_OTP) {
      hapticPrimaryAction();
      void onCorrectCode();
      return;
    }

    if (code.length === OTP_LENGTH) {
      hapticSecondaryAction();
      onWrongCode();
    }
  }

  if (!phonePreview) {
    return (
      <View style={styles.root}>
        <AppStatusBar style="dark" />
        <View style={[styles.centeredState, { paddingTop: insets.top }]}>
          <PremiumText variant="h2">Verification unavailable</PremiumText>
          <PremiumText variant="body" color={colors.textSecondary}>
            Please go back and enter your phone number again.
          </PremiumText>
          <PremiumButton label="Go back" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />
      <View style={styles.backdrop}>
        <View style={styles.leftGlow} />
        <View style={styles.rightGlow} />
        <View style={styles.centerGlow} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={keyboardAvoidingBehavior}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + spacing.sm,
              paddingBottom: insets.bottom + spacing.md,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
          bounces={false}
        >
          <View style={styles.page}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={12}
            >
              <AppSymbol
                name="chevron.left"
                size={22}
                tintColor={colors.textPrimary}
              />
            </Pressable>

            <View style={styles.illustrationWrap}>
              <Image
                source={require('@/assets/images/password.png')}
                style={styles.illustrationImage}
                contentFit="contain"
                transition={180}
              />
            </View>

            <View style={styles.content}>
              <View style={styles.titleBlock}>
                <PremiumText variant="h1" style={styles.title}>
                  Enter the 4-digit code
                </PremiumText>
                <PremiumText
                  variant="body"
                  color={colors.textSecondary}
                  style={styles.subtitle}
                >
                  We&apos;ve sent the code to{' '}
                  <PremiumText variant="bodyMedium" style={styles.phoneText}>
                    {maskedPhone}
                  </PremiumText>
                </PremiumText>
              </View>

              <Animated.View
                entering={FadeInDown.delay(80).duration(380)}
                style={styles.codeBlock}
              >
                <Pressable
                  onPress={() => invisibleInputRef.current?.focus()}
                  accessibilityRole="button"
                  accessibilityLabel="Enter verification code"
                  style={styles.codePressable}
                >
                  <Animated.View style={rShakeStyle}>
                    <VerificationCode
                      code={code}
                      maxLength={OTP_LENGTH}
                      status={verificationStatus}
                    />
                  </Animated.View>
                </Pressable>
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(140).duration(380)}
                style={styles.messageCard}
              >
                <View style={styles.messageIconShell}>
                  <View style={styles.messageIcon}>
                    <View style={styles.messageBubble} />
                    <View style={styles.messageLine} />
                    <View style={styles.messageLineShort} />
                    <View style={styles.messageTail} />
                  </View>
                </View>
                <View style={styles.messageTextWrap}>
                  <PremiumText variant="bodyMedium" style={styles.messageTitle}>
                    Check your messages
                  </PremiumText>
                  <PremiumText
                    variant="body"
                    color={colors.textSecondary}
                    style={styles.messageBody}
                  >
                    The code is valid for 10 minutes
                  </PremiumText>
                </View>
              </Animated.View>

              <View style={styles.resendRow}>
                <PremiumText
                  style={{ fontSize: 14 }}
                  variant="body"
                  color={colors.textSecondary}
                >
                  Didn&apos;t receive the code?
                </PremiumText>
                {resendSeconds > 0 ? (
                  <PremiumText
                    variant="bodyMedium"
                    color={colors.textSecondary}
                    style={styles.resendCountdown}
                  >
                    Resend code in{' '}
                    <PremiumText
                      variant="bodyMedium"
                      color={colors.primary}
                      style={styles.countdownValue}
                    >
                      {formatCountdown(resendSeconds)}
                    </PremiumText>
                  </PremiumText>
                ) : (
                  <Pressable onPress={handleResend} accessibilityRole="button">
                    <PremiumText
                      style={{ fontSize: 14 }}
                      variant="bodyMedium"
                      color={colors.primary}
                    >
                      {isResending ? 'Resending…' : 'Resend code'}
                    </PremiumText>
                  </Pressable>
                )}
              </View>
            </View>

            <View style={styles.footer}>
              <Animated.View entering={FadeInUp.delay(220).duration(360)}>
                <PremiumButton
                  label={isLoading ? 'Verifying…' : 'Verify & Continue'}
                  onPress={handleVerifyPress}
                  disabled={code.join('').length < OTP_LENGTH || isLoading}
                />
              </Animated.View>
            </View>
          </View>
        </ScrollView>

        <TextInput
          ref={invisibleInputRef}
          value={code.join('')}
          onChangeText={handleTextChange}
          keyboardType="number-pad"
          keyboardAppearance={keyboardAppearance}
          maxLength={OTP_LENGTH}
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          caretHidden
          style={styles.invisibleInput}
          accessibilityLabel="OTP input"
          blurOnSubmit
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  leftGlow: {
    position: 'absolute',
    left: -44,
    top: 128,
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: '#F6E8D9',
    opacity: 0.48,
  },
  rightGlow: {
    position: 'absolute',
    right: -68,
    top: 74,
    width: 166,
    height: 166,
    borderRadius: 83,
    backgroundColor: '#F2D8B7',
    opacity: 0.34,
  },
  centerGlow: {
    position: 'absolute',
    right: 18,
    top: 276,
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: '#F8EEDF',
    opacity: 0.72,
  },
  scrollContent: {
    flexGrow: 1,
  },
  page: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundElevated,
    ...shadows.soft,
  },
  illustrationWrap: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationImage: {
    width: 150,
    height: 150,
  },
  content: {
    gap: spacing.md,
  },
  titleBlock: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    textAlign: 'center',
    fontSize: 21,
    lineHeight: 28,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
  },
  phoneText: {
    color: colors.textPrimary,
  },
  codeBlock: {
    paddingTop: spacing.xs,
  },
  codePressable: {
    alignSelf: 'stretch',
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm + 2,
    borderRadius: radius.xl,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  messageIconShell: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF4E8',
  },
  messageIcon: {
    width: 26,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBubble: {
    position: 'absolute',
    width: 26,
    height: 18,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  messageLine: {
    position: 'absolute',
    top: 5,
    width: 12,
    height: 2,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  messageLineShort: {
    position: 'absolute',
    top: 11,
    width: 8,
    height: 2,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  messageTail: {
    position: 'absolute',
    bottom: -4,
    right: 4,
    width: 7,
    height: 7,
    borderBottomRightRadius: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: colors.primary,
    transform: [{ rotate: '45deg' }],
    backgroundColor: colors.background,
  },
  messageTextWrap: {
    flex: 1,
    gap: 4,
  },
  messageTitle: {
    fontSize: 18,
  },
  messageBody: {
    fontSize: 16,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  resendCountdown: {
    flexShrink: 1,
    textAlign: 'right',
    fontSize: 14,
  },
  countdownValue: {
    fontVariant: ['tabular-nums'],
    fontSize: 14,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing.lg,
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  invisibleInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});
