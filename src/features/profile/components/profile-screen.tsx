import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { OrderTabId } from '@/features/orders/constants/orders.constants';
import {
  DEFAULT_PROFILE_AVATAR,
  formatProfilePhone,
  PROFILE_MENU_ITEMS,
  PROFILE_ORDER_SHORTCUTS,
  PROFILE_QUICK_STATS,
} from '@/features/profile/constants/profile.constants';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import {
  resetAppProfile,
  selectAddress,
  selectUserName,
  useAppStore,
} from '@/store/app.store';
import {
  clearAuthState,
  selectUserPhone,
  useAuthStore,
} from '@/store/auth.store';
import { selectOrders, useOrdersStore } from '@/store/orders.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { tabBarContentPadding } from '@/theme/tab-bar';
import { fonts } from '@/theme/typography';

const NOTIFICATION_COUNT = 2;
const H_PAD = spacing.lg;

export function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const phone = useAuthStore(selectUserPhone);
  const userName = useAppStore(selectUserName);
  const address = useAppStore(selectAddress);
  const orders = useOrdersStore(selectOrders);

  const trackableOrder = useMemo(
    () => orders.find((order) => order.status !== 'delivered') ?? null,
    [orders],
  );

  const displayName = userName ?? 'Guest User';
  const displayPhone = phone ? formatProfilePhone(phone) : '+91 ••••• •••••';

  async function handleLogout() {
    hapticSoftTap();
    await clearAuthState();
    await resetAppProfile();
    router.replace('/(auth)/welcome');
  }

  function openOrders(tab: OrderTabId = 'all') {
    hapticSoftTap();
    router.push({
      pathname: '/(tabs)/orders',
      params: { tab },
    });
  }

  function handleTrackOrder() {
    hapticSoftTap();
    if (trackableOrder) {
      router.push(`/order/${trackableOrder.id}`);
      return;
    }
    openOrders('shipped');
  }

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
        <View style={styles.brandRow}>
          <Image
            source={require('@/assets/images/foodrushlogo.png')}
            style={styles.brandLogo}
            contentFit="contain"
          />
          <Text style={styles.brandName}>foodRush</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            onPress={hapticSoftTap}
            hitSlop={10}
            style={styles.headerIconBtn}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <AppSymbol
              name="bell.fill"
              size={18}
              tintColor={colors.textPrimary}
            />
            {NOTIFICATION_COUNT > 0 ? (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{NOTIFICATION_COUNT}</Text>
              </View>
            ) : null}
          </Pressable>
          <Pressable
            onPress={hapticSoftTap}
            hitSlop={10}
            style={styles.headerIconBtn}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <AppSymbol
              name="gearshape.fill"
              size={18}
              tintColor={colors.textPrimary}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.screen}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: tabBarContentPadding(insets.bottom) },
        ]}
      >
        <View style={styles.profileRow}>
          <Image
            source={{ uri: DEFAULT_PROFILE_AVATAR }}
            style={styles.avatar}
            contentFit="cover"
          />

          <View style={styles.profileCopy}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profilePhone}>{displayPhone}</Text>
            <View style={styles.verifiedBadge}>
              <AppSymbol
                name="checkmark.circle.fill"
                size={11}
                tintColor={colors.success}
              />
              <Text style={styles.verifiedText}>Verified Account</Text>
            </View>
          </View>

          <Pressable
            onPress={hapticSoftTap}
            style={styles.editBtn}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
          >
            <Text style={styles.editText}>Edit Profile</Text>
            <AppSymbol
              name="chevron.right"
              size={12}
              tintColor={colors.primary}
            />
          </Pressable>
        </View>

        <View style={styles.statsPanel}>
          {PROFILE_QUICK_STATS.map((stat, index) => (
            <Pressable
              key={stat.id}
              onPress={hapticSoftTap}
              style={[styles.statCol, index > 0 && styles.statColDivider]}
              accessibilityRole="button"
              accessibilityLabel={`${stat.label}, ${stat.value}`}
            >
              <AppSymbol
                name={stat.icon}
                size={18}
                tintColor={colors.primary}
              />
              <Text style={styles.statLabel}>{stat.label}</Text>
              <View style={styles.statValueRow}>
                <Text style={styles.statValue} numberOfLines={1}>
                  {stat.value}
                </Text>
                <AppSymbol
                  name="chevron.right"
                  size={12}
                  tintColor={colors.textTertiary}
                />
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Orders</Text>
            <Pressable
              onPress={() => openOrders('all')}
              style={styles.sectionLink}
              accessibilityRole="button"
              accessibilityLabel="View all orders"
            >
              <Text style={styles.sectionLinkText}>View all orders</Text>
              <AppSymbol
                name="chevron.right"
                size={11}
                tintColor={colors.primary}
              />
            </Pressable>
          </View>

          <View style={styles.orderShortcuts}>
            {PROFILE_ORDER_SHORTCUTS.map((shortcut) => (
              <Pressable
                key={shortcut.id}
                onPress={() => openOrders(shortcut.id)}
                style={styles.orderShortcut}
                accessibilityRole="button"
                accessibilityLabel={shortcut.label}
              >
                <View style={styles.orderShortcutIcon}>
                  <AppSymbol
                    name={shortcut.icon}
                    size={17}
                    tintColor={colors.primary}
                  />
                </View>
                <Text style={styles.orderShortcutLabel} numberOfLines={2}>
                  {shortcut.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.trackBanner}>
            <View style={styles.trackBannerIcon}>
              <AppSymbol
                name="location.fill"
                size={16}
                tintColor={colors.primary}
              />
            </View>
            <View style={styles.trackBannerCopy}>
              <Text style={styles.trackBannerTitle}>Track your order</Text>
              <Text style={styles.trackBannerSubtitle}>
                {trackableOrder
                  ? `Get real-time updates on your order`
                  : 'Get real-time updates on your order'}
              </Text>
            </View>
            <Pressable
              onPress={handleTrackOrder}
              style={styles.trackBtn}
              accessibilityRole="button"
              accessibilityLabel="Track order"
            >
              <Text style={styles.trackBtnText}>Track Order</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Settings</Text>

          <View style={styles.menuList}>
            {PROFILE_MENU_ITEMS.map((item, index) => (
              <Pressable
                key={item.id}
                onPress={() => {
                  hapticSoftTap();
                  if (item.id === 'addresses') {
                    router.push('/location');
                  }
                }}
                style={[
                  styles.menuRow,
                  index < PROFILE_MENU_ITEMS.length - 1 && styles.menuRowBorder,
                ]}
                accessibilityRole="button"
                accessibilityLabel={item.title}
              >
                <View style={styles.menuIcon}>
                  <AppSymbol
                    name={item.icon}
                    size={16}
                    tintColor={colors.primary}
                  />
                </View>
                <View style={styles.menuCopy}>
                  <View style={styles.menuTitleRow}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    {item.badge ? (
                      <View
                        style={[
                          styles.menuBadge,
                          item.badgeTone === 'success'
                            ? styles.menuBadgeSuccess
                            : styles.menuBadgePrimary,
                        ]}
                      >
                        <Text
                          style={[
                            styles.menuBadgeText,
                            item.badgeTone === 'success'
                              ? styles.menuBadgeTextSuccess
                              : styles.menuBadgeTextPrimary,
                          ]}
                        >
                          {item.badge}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.menuSubtitle} numberOfLines={1}>
                    {item.id === 'addresses' ? address.line2 : item.subtitle}
                  </Text>
                </View>
                <AppSymbol
                  name="chevron.right"
                  size={12}
                  tintColor={colors.textTertiary}
                />
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          onPress={handleLogout}
          style={styles.logoutRow}
          accessibilityRole="button"
          accessibilityLabel="Logout"
        >
          <View style={styles.logoutIcon}>
            <AppSymbol
              name="rectangle.portrait.and.arrow.right"
              size={16}
              tintColor={colors.danger}
            />
          </View>
          <View style={styles.logoutCopy}>
            <Text style={styles.logoutTitle}>Logout</Text>
            <Text style={styles.logoutSubtitle}>Log out from your account</Text>
          </View>
          <AppSymbol
            name="chevron.right"
            size={12}
            tintColor={colors.textTertiary}
          />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
  },
  content: {
    paddingHorizontal: H_PAD,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H_PAD,
    paddingBottom: spacing.sm,
    backgroundColor: colors.backgroundElevated,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  brandLogo: {
    width: 28,
    height: 28,
  },
  brandName: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerIconBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  notifBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    lineHeight: 10,
    color: colors.textInverse,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundMuted,
    borderWidth: 2,
    borderColor: 'rgba(212, 84, 60, 0.15)',
  },
  profileCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  profileName: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 19,
    color: colors.textPrimary,
  },
  profilePhone: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
    alignSelf: 'flex-start',
    backgroundColor: colors.successLight,
    borderRadius: 4,
    borderCurve: 'continuous',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  verifiedText: {
    fontFamily: fonts.medium,
    fontSize: 9,
    lineHeight: 12,
    color: colors.success,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    maxWidth: 100,
  },
  editText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    lineHeight: 13,
    color: colors.primary,
  },
  statsPanel: {
    flexDirection: 'row',
    backgroundColor: 'rgba(212, 84, 60, 0.05)',
    borderRadius: 12,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  statColDivider: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: 'rgba(212, 84, 60, 0.15)',
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statValue: {
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.primary,
    flexShrink: 1,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    marginTop: 1,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  sectionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sectionLinkText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.primary,
  },
  orderShortcuts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  orderShortcut: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  orderShortcutIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderShortcutLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    lineHeight: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  trackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(212, 84, 60, 0.07)',
    borderRadius: 12,
    borderCurve: 'continuous',
    padding: spacing.sm,
    marginTop: spacing.xxs,
  },
  trackBannerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackBannerCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  trackBannerTitle: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  trackBannerSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
  },
  trackBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.sm,
    paddingVertical: 9,
  },
  trackBtnText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textInverse,
  },
  menuList: {
    marginTop: spacing.xxs,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  menuRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(212, 84, 60, 0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  menuTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  menuTitle: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  menuBadge: {
    borderRadius: 10,
    borderCurve: 'continuous',
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  menuBadgePrimary: {
    backgroundColor: 'rgba(212, 84, 60, 0.1)',
  },
  menuBadgeSuccess: {
    backgroundColor: colors.successLight,
  },
  menuBadgeText: {
    fontFamily: fonts.semibold,
    fontSize: 9,
    lineHeight: 11,
  },
  menuBadgeTextPrimary: {
    color: colors.primary,
  },
  menuBadgeTextSuccess: {
    color: colors.success,
  },
  menuSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  logoutIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderCurve: 'continuous',
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutTitle: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.danger,
  },
  logoutSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
  },
  logoutCopy: {
    flex: 1,
    gap: 2,
  },
});
