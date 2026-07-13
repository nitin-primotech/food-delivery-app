import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts, typography } from '@/theme/typography';

export const locationScreenStyles = StyleSheet.create({
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  searchInput: {
    flex: 1,
    ...typography.captionMedium,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  sectionLabel: {
    ...typography.caption,
    fontFamily: fonts.semibold,
    color: colors.textSecondary,
  },
  actionLabel: {
    flex: 1,
    ...typography.captionMedium,
    color: colors.primary,
  },
  resultTitle: {
    flexShrink: 1,
    ...typography.captionMedium,
    color: colors.textPrimary,
  },
  resultSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  cityPillText: {
    ...typography.overline,
    fontFamily: fonts.semibold,
    color: colors.primary,
    letterSpacing: 0.2,
    textTransform: 'none',
  },
  emptyText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  confirmLabel: {
    ...typography.label,
    color: colors.textTertiary,
  },
  confirmTitle: {
    ...typography.captionMedium,
    color: colors.textPrimary,
  },
  changeLink: {
    ...typography.captionMedium,
    color: colors.primary,
  },
});

export const locationScreenLayoutStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  list: {
    flex: 1,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
    backgroundColor: colors.backgroundMuted,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  actionIcon: {
    width: 28,
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  sectionLabel: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginHorizontal: -spacing.sm,
    borderRadius: radius.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  resultRowSelected: {
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    borderBottomColor: 'transparent',
  },
  resultIcon: {
    width: 28,
    paddingTop: 2,
    alignItems: 'center',
  },
  resultText: {
    flex: 1,
    gap: spacing.xxs,
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  cityPill: {
    backgroundColor: 'rgba(212, 84, 60, 0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  empty: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  confirmOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  confirmBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  confirmSheet: {
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  confirmHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.borderStrong,
    marginBottom: spacing.xxs,
  },
  confirmCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confirmIcon: {
    paddingTop: 2,
  },
  confirmCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  changeBtn: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
});
