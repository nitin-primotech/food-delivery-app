import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts, typography } from '@/theme/typography';

export const editProfileStyles = StyleSheet.create({
  fieldGroup: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontFamily: fonts.semibold,
    color: colors.textSecondary,
    marginLeft: spacing.xxs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.backgroundMuted,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 52,
  },
  inputRowDisabled: {
    opacity: 0.92,
  },
  input: {
    flex: 1,
    ...typography.captionMedium,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  readOnlyText: {
    flex: 1,
    ...typography.captionMedium,
    color: colors.textPrimary,
  },
  verifiedPill: {
    backgroundColor: colors.successLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  verifiedPillText: {
    ...typography.overline,
    fontFamily: fonts.semibold,
    color: colors.success,
    letterSpacing: 0.2,
    textTransform: 'none',
  },
  saveBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.45,
  },
  saveBtnText: {
    ...typography.bodySmall,
    fontFamily: fonts.semibold,
    color: colors.textInverse,
  },
  secondaryBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  secondaryBtnText: {
    ...typography.caption,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
});
