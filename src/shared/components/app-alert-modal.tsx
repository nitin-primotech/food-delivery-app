import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export type AppAlertTone = 'default' | 'success' | 'danger';

type AppAlertModalProps = {
  visible: boolean;
  title: string;
  message: string;
  buttonLabel?: string;
  icon?: string;
  tone?: AppAlertTone;
  onClose: () => void;
};

const TONE_STYLES: Record<
  AppAlertTone,
  { accent: string; iconBackground: string }
> = {
  default: {
    accent: colors.primary,
    iconBackground: 'rgba(212, 84, 60, 0.1)',
  },
  success: {
    accent: colors.success,
    iconBackground: colors.successLight,
  },
  danger: {
    accent: colors.danger,
    iconBackground: colors.dangerLight,
  },
};

export function AppAlertModal({
  visible,
  title,
  message,
  buttonLabel = 'Got it',
  icon = 'info.circle.fill',
  tone = 'default',
  onClose,
}: AppAlertModalProps) {
  const { accent, iconBackground } = TONE_STYLES[tone];

  function handleClose() {
    hapticSoftTap();
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable
          style={styles.card}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={[styles.iconWrap, { backgroundColor: iconBackground }]}>
            <AppSymbol name={icon} size={22} tintColor={accent} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{message}</Text>
          <Pressable
            style={[styles.button, { backgroundColor: accent }]}
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel={buttonLabel}
          >
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.xl,
    borderCurve: 'continuous',
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 21,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  button: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    borderCurve: 'continuous',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.textInverse,
  },
});
