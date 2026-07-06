import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import {
  formTextInputProps,
  keyboardAvoidingBehavior,
} from '@/shared/utils/keyboard';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type AppConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  icon?: string;
  destructive?: boolean;
  /** When set, the user must type this exact string to enable confirmation. */
  requiredConfirmationText?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export function AppConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  icon,
  destructive = false,
  requiredConfirmationText,
  onConfirm,
  onClose,
}: AppConfirmModalProps) {
  const [confirmationInput, setConfirmationInput] = useState('');
  const accentColor = destructive ? colors.danger : colors.primary;
  const iconBackground = destructive
    ? colors.dangerLight
    : 'rgba(212, 84, 60, 0.1)';
  const requiresTypedConfirmation = Boolean(requiredConfirmationText);
  const canConfirm =
    !requiresTypedConfirmation ||
    confirmationInput === requiredConfirmationText;

  useEffect(() => {
    if (!visible) {
      setConfirmationInput('');
    }
  }, [visible]);

  function handleClose() {
    hapticSoftTap();
    onClose();
  }

  function handleConfirm() {
    if (!canConfirm) return;
    hapticSoftTap();
    onConfirm();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={keyboardAvoidingBehavior}
      >
        <Pressable style={styles.backdrop} onPress={handleClose}>
          <Pressable
            style={styles.card}
            onPress={(event) => event.stopPropagation()}
          >
            {icon ? (
              <View
                style={[styles.iconWrap, { backgroundColor: iconBackground }]}
              >
                <AppSymbol name={icon} size={22} tintColor={accentColor} />
              </View>
            ) : null}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{message}</Text>
            {requiresTypedConfirmation ? (
              <View style={styles.confirmationField}>
                <Text style={styles.confirmationLabel}>
                  Type{' '}
                  <Text style={styles.confirmationKeyword}>
                    {requiredConfirmationText}
                  </Text>{' '}
                  to confirm
                </Text>
                <TextInput
                  value={confirmationInput}
                  onChangeText={setConfirmationInput}
                  placeholder={requiredConfirmationText}
                  placeholderTextColor={colors.textTertiary}
                  style={styles.confirmationInput}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  autoComplete="off"
                  spellCheck={false}
                  returnKeyType="done"
                  onSubmitEditing={handleConfirm}
                  selectionColor={accentColor}
                  accessibilityLabel={`Type ${requiredConfirmationText} to confirm`}
                  {...formTextInputProps}
                />
              </View>
            ) : null}
            <Pressable
              style={[
                styles.confirmBtn,
                destructive ? styles.confirmBtnDestructive : null,
                !canConfirm ? styles.confirmBtnDisabled : null,
              ]}
              onPress={handleConfirm}
              disabled={!canConfirm}
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
              accessibilityState={{ disabled: !canConfirm }}
            >
              <Text style={styles.confirmBtnText}>{confirmLabel}</Text>
            </Pressable>
            <Pressable
              style={styles.cancelBtn}
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel={cancelLabel}
            >
              <Text style={styles.cancelBtnText}>{cancelLabel}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
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
  confirmationField: {
    width: '100%',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  confirmationLabel: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  confirmationKeyword: {
    fontFamily: fonts.bold,
    color: colors.danger,
    letterSpacing: 0.4,
  },
  confirmationInput: {
    width: '100%',
    minHeight: 44,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  confirmBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    borderCurve: 'continuous',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDestructive: {
    backgroundColor: colors.danger,
  },
  confirmBtnDisabled: {
    opacity: 0.45,
  },
  confirmBtnText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.textInverse,
  },
  cancelBtn: {
    paddingVertical: spacing.xs,
  },
  cancelBtnText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
