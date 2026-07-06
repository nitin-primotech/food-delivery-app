import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type WishlistManageModalProps = {
  visible: boolean;
  onClose: () => void;
  onEditList: () => void;
  onClearAll: () => void;
};

export function WishlistManageModal({
  visible,
  onClose,
  onEditList,
  onClearAll,
}: WishlistManageModalProps) {
  function handleClose() {
    hapticSoftTap();
    onClose();
  }

  function handleEditList() {
    hapticSoftTap();
    onEditList();
  }

  function handleClearAll() {
    hapticSoftTap();
    onClearAll();
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
          <View style={styles.iconWrap}>
            <AppSymbol name="heart.fill" size={22} tintColor={colors.primary} />
          </View>
          <Text style={styles.title}>Manage wishlist</Text>
          <Text style={styles.subtitle}>Choose an action</Text>

          <Pressable
            style={styles.primaryBtn}
            onPress={handleEditList}
            accessibilityRole="button"
            accessibilityLabel="Edit list"
          >
            <AppSymbol name="pencil" size={16} tintColor={colors.textInverse} />
            <Text style={styles.primaryBtnText}>Edit list</Text>
          </Pressable>

          <Pressable
            style={styles.destructiveBtn}
            onPress={handleClearAll}
            accessibilityRole="button"
            accessibilityLabel="Clear all saved dishes"
          >
            <AppSymbol name="trash" size={16} tintColor={colors.danger} />
            <Text style={styles.destructiveBtnText}>Clear all</Text>
          </Pressable>

          <Pressable
            style={styles.cancelBtn}
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
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
    backgroundColor: 'rgba(212, 84, 60, 0.1)',
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
  primaryBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: 12,
    borderCurve: 'continuous',
    minHeight: 44,
  },
  primaryBtnText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.textInverse,
  },
  destructiveBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.dangerLight,
    borderRadius: 12,
    borderCurve: 'continuous',
    minHeight: 44,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.15)',
  },
  destructiveBtnText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.danger,
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
