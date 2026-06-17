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
import Animated, { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { OtpDigitStatus } from '@/features/auth/components/verification-code/animated-code-number';
import { useAnimatedShake } from '@/features/auth/components/verification-code/use-animated-shake';
import { VerificationCode } from '@/features/auth/components/verification-code/verification-code';
import { verifyOtpAndCreateSession } from '@/features/auth/services/auth.service';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumButton } from '@/shared/components/premium-button';
import { PremiumText } from '@/shared/components/premium-text';
import {
  keyboardAppearance,
  keyboardAvoidingBehavior,
} from '@/shared/utils/keyboard';
import { setAuthSession } from '@/store/auth.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const OTP_LENGTH = 4;
const CORRECT_OTP = 1234;

export function OtpVerifyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(true);

  const verificationStatus = useSharedValue<OtpDigitStatus>('inProgress');
  const invisibleInputRef = useRef<TextInput>(null);
  const { shake, rShakeStyle } = useAnimatedShake();

  const masked = phone ? `+1 ${phone.slice(0, 3)}•••${phone.slice(-4)}` : '';
  const codeString = code.join('');

  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(timer);
  }, []);

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
    }, 1000);
  }, [verificationStatus]);

  const onWrongCode = useCallback(() => {
    verificationStatus.value = 'wrong';
    shake();
    resetCode();
  }, [resetCode, shake, verificationStatus]);

  const onCorrectCode = useCallback(async () => {
    if (!phone || isLoading) return;
    verificationStatus.value = 'correct';
    setIsLoading(true);

    try {
      const session = await verifyOtpAndCreateSession(
        phone,
        CORRECT_OTP.toString(),
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
  }, [phone, isLoading, resetCode, router, shake, verificationStatus]);

  function handleTextChange(text: string) {
    if (isLoading) return;

    const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
    const newCode = digits.split('').map((d) => Number(d));
    setCode(newCode);
    verificationStatus.value = 'inProgress';
  }

  function handleVerifyPress() {
    if (codeString === CORRECT_OTP.toString()) {
      void onCorrectCode();
      return;
    }
    if (codeString.length === OTP_LENGTH) {
      onWrongCode();
    }
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={keyboardAvoidingBehavior}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={StyleSheet.flatten([
            styles.scrollContent,
            { paddingBottom: insets.bottom + spacing.lg },
          ])}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={() => router.back()}
            style={styles.back}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <AppSymbol
              name="chevron.left"
              size={22}
              tintColor={colors.textPrimary}
            />
          </Pressable>

          <View style={styles.content}>
            <PremiumText variant="h1">Verify OTP</PremiumText>
            <PremiumText variant="body" color={colors.textSecondary}>
              Code sent to {masked}
            </PremiumText>

            <Animated.View
              style={[styles.codeWrap, rShakeStyle]}
              onTouchEnd={() => invisibleInputRef.current?.focus()}
            >
              <VerificationCode
                code={code}
                maxLength={OTP_LENGTH}
                status={verificationStatus}
              />
            </Animated.View>

            <PremiumText variant="caption" color={colors.textTertiary}>
              Tap the boxes to enter your code
            </PremiumText>
          </View>

          <View style={styles.footer}>
            <PremiumText
              variant="caption"
              color={colors.textTertiary}
              style={styles.hint}
            >
              Session stays active for 10 minutes after login.
            </PremiumText>
            <PremiumButton
              label={isLoading ? 'Verifying…' : 'Verify & continue'}
              onPress={handleVerifyPress}
              disabled={codeString.length < OTP_LENGTH || isLoading}
            />
          </View>
        </ScrollView>

        <TextInput
          ref={invisibleInputRef}
          value={codeString}
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

        {showToast ? (
          <View
            style={StyleSheet.flatten([
              styles.toast,
              { bottom: insets.bottom + spacing.xxxl },
            ])}
          >
            <AppSymbol
              name="info.circle.fill"
              size={18}
              tintColor={colors.textInverse}
            />
            <PremiumText variant="captionMedium" color={colors.textInverse}>
              Your OTP is {CORRECT_OTP}
            </PremiumText>
          </View>
        ) : null}
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  back: {
    marginBottom: spacing.xl,
  },
  content: {
    gap: spacing.lg,
  },
  codeWrap: {
    marginVertical: spacing.md,
    width: '100%',
  },
  footer: {
    marginTop: 'auto',
    gap: spacing.md,
    paddingTop: spacing.xxl,
  },
  hint: {
    textAlign: 'center',
  },
  invisibleInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
  },
});
