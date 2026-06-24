import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumButton } from '@/shared/components/premium-button';
import { PremiumText } from '@/shared/components/premium-text';
import { keyboardAvoidingBehavior } from '@/shared/utils/keyboard';
import { setUserName } from '@/store/app.store';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts, typography } from '@/theme/typography';

export function NameEntryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const canContinue = name.trim().length >= 2;

  function handleContinue() {
    if (!canContinue) return;
    Keyboard.dismiss();
    setUserName(name.trim());
    router.replace('/location?onboarding=1' as Href);
  }

  function handleBack() {
    router.back();
  }

  return (
    <View style={styles.root}>
      <View style={styles.backdrop}>
        <View style={styles.leftGlow} />
        <View style={styles.rightGlow} />
        <View style={styles.centerGlow} />
      </View>

      <KeyboardAvoidingView
        behavior={keyboardAvoidingBehavior}
        style={styles.flex}
        keyboardVerticalOffset={0}
      >
        <View style={[styles.page, { paddingTop: insets.top + 40 }]}>
          {/* <Pressable
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <AppSymbol
                name="chevron.left"
                size={22}
                tintColor={colors.textPrimary}
              />
            </Pressable> */}

          <View style={styles.illustrationWrap}>
            <Image
              source={require('@/assets/images/chef.png')}
              style={styles.illustrationImage}
              contentFit="contain"
              transition={180}
            />
          </View>

          {/* <View style={styles.hero}>
              <View style={styles.brandRow}>
                <View style={styles.brandIcon} accessibilityElementsHidden>
                  <View style={styles.brandKnob} />
                  <View style={styles.brandDome} />
                  <View style={styles.brandLineOne} />
                  <View style={styles.brandLineTwo} />
                  <View style={styles.brandLineThree} />
                </View>
              </View>

              <View style={styles.heroBody}>
                <View style={styles.copyBlock}>
                  <PremiumText variant="display" style={styles.title}>
                    What&apos;s your
                  </PremiumText>
                  <PremiumText
                    variant="display"
                    color={colors.primary}
                    style={styles.titleAccent}
                  >
                    full name?
                  </PremiumText>
                  <PremiumText
                    variant="body"
                    color={colors.textSecondary}
                    style={styles.subtitle}
                  >
                    This helps us personalize your experience
                  </PremiumText>
                </View>

                <View style={styles.heroArt}>
                  <View style={styles.heroDotGrid}>
                    {Array.from({ length: 12 }).map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.heroDot,
                          index % 3 === 2 && styles.heroDotLast,
                        ]}
                      />
                    ))}
                  </View>
                  <View style={styles.heroOrb} />
                  <View style={styles.heroSparkOne} />
                  <View style={styles.heroSparkTwo} />
                  <View style={styles.heroCardShadow} />
                  <View style={styles.heroCard}>
                    <View style={styles.avatarCircle}>
                      <AppSymbol
                        name="person.fill"
                        size={32}
                        tintColor={colors.primary}
                      />
                    </View>
                    <View style={styles.cardLines}>
                      <View style={styles.cardLineLong} />
                      <View style={styles.cardLineShort} />
                    </View>
                  </View>
                  <View style={styles.heroLeaf}>
                    <AppSymbol name="leaf.fill" size={20} tintColor="#79B83E" />
                  </View>
                </View>
              </View>
            </View> */}

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <PremiumText variant="bodyMedium" style={styles.inputLabel}>
                Full Name
              </PremiumText>
              <View style={styles.inputWrap}>
                <AppSymbol
                  name="person.fill"
                  size={18}
                  tintColor={colors.textTertiary}
                />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textTertiary}
                  style={styles.input}
                  autoCapitalize="words"
                  autoCorrect={false}
                  textContentType="name"
                  autoComplete="name"
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                {name.length > 0 ? (
                  <Pressable onPress={() => setName('')} hitSlop={8}>
                    <AppSymbol
                      name="xmark.circle.fill"
                      size={22}
                      tintColor={colors.textTertiary}
                    />
                  </Pressable>
                ) : null}
              </View>
            </View>

            <View style={styles.safetyCard}>
              <View style={styles.safetyIconShell}>
                <AppSymbol
                  name="shield.fill"
                  size={22}
                  tintColor={colors.primary}
                />
              </View>
              <View style={styles.safetyCopy}>
                <PremiumText variant="bodyMedium" style={styles.safetyTitle}>
                  Don&apos;t worry
                </PremiumText>
                <PremiumText
                  variant="body"
                  color={colors.textSecondary}
                  style={styles.safetyText}
                >
                  Your information is safe with us
                </PremiumText>
              </View>
              <AppSymbol
                name="lock.fill"
                size={16}
                tintColor={colors.primary}
              />
            </View>
          </View>

          <View style={[styles.footer, { marginBottom: insets.bottom + 30 }]}>
            <PremiumButton
              label="Continue"
              onPress={handleContinue}
              disabled={!canContinue}
            />
          </View>
        </View>
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
    left: -52,
    top: 118,
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: '#F5EADD',
    opacity: 0.56,
  },
  rightGlow: {
    position: 'absolute',
    right: -72,
    top: 88,
    width: 188,
    height: 188,
    borderRadius: 94,
    backgroundColor: '#F5E2C9',
    opacity: 0.36,
  },
  centerGlow: {
    position: 'absolute',
    right: 12,
    top: 296,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8EEDF',
    opacity: 0.66,
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
  hero: {
    marginTop: spacing.lg,
  },
  brandRow: {
    marginBottom: spacing.lg,
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
  heroBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  copyBlock: {
    flex: 1,
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
  },
  titleAccent: {
    fontSize: 24,
    lineHeight: 30,
  },
  subtitle: {
    maxWidth: 230,
    lineHeight: 24,
  },
  heroArt: {
    width: 210,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -spacing.sm,
  },
  heroDotGrid: {
    position: 'absolute',
    right: 6,
    top: 20,
    width: 48,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  heroDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#F0C39A',
  },
  heroDotLast: {
    marginRight: 0,
  },
  heroOrb: {
    position: 'absolute',
    right: 8,
    top: 24,
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#F8EEDF',
    opacity: 0.9,
  },
  heroSparkOne: {
    position: 'absolute',
    right: 34,
    top: 76,
    width: 16,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.primary,
    transform: [{ rotate: '-60deg' }],
  },
  heroSparkTwo: {
    position: 'absolute',
    right: 46,
    top: 86,
    width: 14,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.primary,
    transform: [{ rotate: '18deg' }],
  },
  heroCardShadow: {
    position: 'absolute',
    right: 0,
    top: 78,
    width: 180,
    height: 128,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(255,255,255,0.16)',
    transform: [{ rotate: '7deg' }],
  },
  heroCard: {
    position: 'absolute',
    right: 2,
    top: 80,
    width: 176,
    height: 124,
    borderRadius: radius.xl,
    backgroundColor: colors.backgroundElevated,
    ...shadows.card,
    transform: [{ rotate: '7deg' }],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  avatarCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9E7D0',
    borderWidth: 1,
    borderColor: 'rgba(212, 84, 60, 0.08)',
  },
  cardLines: {
    flex: 1,
    gap: spacing.sm,
  },
  cardLineLong: {
    width: 76,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#E7B16A',
    opacity: 0.72,
  },
  cardLineShort: {
    width: 60,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#E7B16A',
    opacity: 0.48,
  },
  heroLeaf: {
    position: 'absolute',
    right: 4,
    bottom: 22,
    transform: [{ rotate: '-12deg' }],
  },
  formSection: {
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  inputGroup: {
    gap: spacing.md,
  },
  inputLabel: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 74,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: spacing.md,
    ...shadows.soft,
  },
  input: {
    flex: 1,
    ...typography.h3,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
  safetyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: '#FBF2E8',
  },
  safetyIconShell: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7E7D4',
  },
  safetyCopy: {
    flex: 1,
    gap: 2,
  },
  safetyTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  safetyText: {
    lineHeight: 22,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing.xl,
  },
  illustrationWrap: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  illustrationImage: {
    width: 300,
    height: 300,
  },
});
