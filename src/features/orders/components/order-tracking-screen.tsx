import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Order } from '@/features/catalog/types/catalog.types';
import { formatInr } from '@/features/checkout/utils/format-currency';
import { OrderTrackingTimeline } from '@/features/orders/components/order-tracking-timeline';
import {
  countOrderItems,
  formatEstimatedWindow,
  formatOrderId,
  formatPlacedOn,
  TRACKING_STATUS_BADGE,
} from '@/features/orders/constants/orders.constants';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import {
  advanceOrderStatus,
  selectOrders,
  useOrdersStore,
} from '@/store/orders.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const DELIVERY_PARTNER = {
  name: 'Rohit Kumar',
  rating: 4.8,
  avatar:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
};

function OrderSummaryCard({
  order,
  showDetails,
  onToggleDetails,
}: {
  order: Order;
  showDetails: boolean;
  onToggleDetails: () => void;
}) {
  const statusUi = TRACKING_STATUS_BADGE[order.status];
  const heroImage = order.items[0]?.item.image ?? order.restaurantLogo;
  const itemCount = countOrderItems(order.items);

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryTop}>
        <View style={styles.summaryInfo}>
          <Text style={styles.summaryLabel}>Order ID</Text>
          <Text style={styles.summaryId}>{formatOrderId(order.id)}</Text>
          <Text style={styles.summaryPlaced}>
            {formatPlacedOn(order.createdAt)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusUi.bg }]}>
            <AppSymbol
              name={statusUi.icon}
              size={11}
              tintColor={statusUi.color}
            />
            <Text style={[styles.statusText, { color: statusUi.color }]}>
              {statusUi.label}
            </Text>
          </View>
        </View>
        <Image
          source={{ uri: heroImage }}
          style={styles.summaryImage}
          contentFit="cover"
        />
      </View>

      <View style={styles.summaryDivider} />

      <View style={styles.summaryFooter}>
        <View style={styles.etaBlock}>
          <Text style={styles.etaLabel}>Estimated delivery</Text>
          <Text style={styles.etaValue}>
            {formatEstimatedWindow(order.estimatedDelivery)}
          </Text>
        </View>
        <Pressable
          onPress={onToggleDetails}
          style={styles.viewDetailsBtn}
          accessibilityRole="button"
          accessibilityLabel="View order details"
        >
          <Text style={styles.viewDetailsText}>View details</Text>
          <AppSymbol
            name={showDetails ? 'chevron.up' : 'chevron.right'}
            size={11}
            tintColor={colors.primary}
          />
        </Pressable>
      </View>

      {showDetails ? (
        <View style={styles.detailsBlock}>
          <View style={styles.detailsDivider} />
          {order.items.map((line) => (
            <View
              key={`${line.restaurantId}:${line.item.id}`}
              style={styles.lineRow}
            >
              <Text style={styles.lineName} numberOfLines={1}>
                {line.quantity}× {line.item.name}
              </Text>
              <Text style={styles.linePrice}>
                {formatInr(line.item.price * line.quantity)}
              </Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Total · {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </Text>
            <Text style={styles.totalValue}>{formatInr(order.total)}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function DeliveryPartnerCard() {
  return (
    <View style={styles.partnerCard}>
      <Image
        source={{ uri: DELIVERY_PARTNER.avatar }}
        style={styles.partnerAvatar}
        contentFit="cover"
      />
      <View style={styles.partnerInfo}>
        <Text style={styles.partnerName}>{DELIVERY_PARTNER.name}</Text>
        <View style={styles.ratingBadge}>
          <AppSymbol name="star.fill" size={9} tintColor={colors.star} />
          <Text style={styles.ratingText}>{DELIVERY_PARTNER.rating}</Text>
        </View>
      </View>
      <View style={styles.partnerActions}>
        <Pressable
          style={styles.partnerAction}
          onPress={hapticSoftTap}
          accessibilityRole="button"
          accessibilityLabel="Call delivery partner"
        >
          <View style={styles.partnerActionIcon}>
            <AppSymbol name="phone.fill" size={14} tintColor={colors.primary} />
          </View>
          <Text style={styles.partnerActionLabel}>Call</Text>
        </Pressable>
        <Pressable
          style={styles.partnerAction}
          onPress={hapticSoftTap}
          accessibilityRole="button"
          accessibilityLabel="Chat with delivery partner"
        >
          <View style={styles.partnerActionIcon}>
            <AppSymbol
              name="message.fill"
              size={14}
              tintColor={colors.primary}
            />
          </View>
          <Text style={styles.partnerActionLabel}>Chat</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function OrderTrackingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orders = useOrdersStore(selectOrders);
  const order = orders.find((o) => o.id === id);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!order || order.status === 'delivered') return;
    const timer = setInterval(() => {
      advanceOrderStatus(order.id);
    }, 8000);
    return () => clearInterval(timer);
  }, [order]);

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Order not found</Text>
      </View>
    );
  }

  const showPartner =
    order.status === 'on_the_way' || order.status === 'preparing';

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
        <Pressable
          onPress={() => {
            hapticSoftTap();
            router.back();
          }}
          hitSlop={10}
          style={styles.headerBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AppSymbol
            name="chevron.left"
            size={18}
            tintColor={colors.textPrimary}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Track Order</Text>
        <Pressable
          onPress={hapticSoftTap}
          hitSlop={10}
          style={styles.helpBtn}
          accessibilityRole="button"
          accessibilityLabel="Help"
        >
          <AppSymbol name="headphones" size={14} tintColor={colors.primary} />
          <Text style={styles.helpText}>Help</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.screen}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing.xxl },
        ]}
      >
        <OrderSummaryCard
          order={order}
          showDetails={showDetails}
          onToggleDetails={() => {
            hapticSoftTap();
            setShowDetails((prev) => !prev);
          }}
        />

        <Text style={styles.sectionTitle}>Order Status</Text>
        <View style={styles.timelineCard}>
          <OrderTrackingTimeline
            status={order.status}
            createdAt={order.createdAt}
          />
        </View>

        {showPartner ? <DeliveryPartnerCard /> : null}

        <Text style={styles.sectionTitle}>Delivery Details</Text>
        <View style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <Text style={styles.addressTitle}>Home · Default</Text>
            <View style={styles.changeBtn}>
              <Text style={styles.changeText}>Change</Text>
            </View>
          </View>
          <View style={styles.addressRow}>
            <View style={styles.addressIcon}>
              <AppSymbol
                name="location.fill"
                size={14}
                tintColor={colors.primary}
              />
            </View>
            <Text style={styles.addressText}>{order.address}</Text>
          </View>
        </View>

        <Pressable
          style={styles.supportCard}
          onPress={hapticSoftTap}
          accessibilityRole="button"
          accessibilityLabel="Contact support"
        >
          <View style={styles.supportIcon}>
            <AppSymbol
              name="shield.fill"
              size={16}
              tintColor={colors.primary}
            />
          </View>
          <View style={styles.supportCopy}>
            <Text style={styles.supportTitle}>Need help with your order?</Text>
            <Text style={styles.supportSubtitle}>
              Our support team is here to help you
            </Text>
          </View>
          <View style={styles.supportAction}>
            <Text style={styles.supportLink}>Contact</Text>
            <AppSymbol
              name="chevron.right"
              size={11}
              tintColor={colors.primary}
            />
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  notFound: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 36,
    justifyContent: 'flex-end',
  },
  helpText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.primary,
  },
  summaryCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  summaryTop: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  summaryInfo: {
    flex: 1,
    gap: 3,
  },
  summaryLabel: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
  },
  summaryId: {
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  summaryPlaced: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  statusText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    lineHeight: 12,
  },
  summaryImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundMuted,
  },
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
  },
  summaryFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  etaBlock: {
    flex: 1,
    gap: 2,
  },
  etaLabel: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
  },
  etaValue: {
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.primary,
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailsText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.primary,
  },
  detailsBlock: {
    gap: spacing.xs,
  },
  detailsDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginBottom: spacing.xxs,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  lineName: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textPrimary,
  },
  linePrice: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xxs,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  totalLabel: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
  },
  totalValue: {
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
    marginTop: spacing.xxs,
  },
  timelineCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  partnerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundMuted,
  },
  partnerInfo: {
    flex: 1,
    gap: 4,
  },
  partnerName: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 3,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textPrimary,
  },
  partnerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  partnerAction: {
    alignItems: 'center',
    gap: 4,
  },
  partnerActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerActionLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    lineHeight: 12,
    color: colors.textSecondary,
  },
  addressCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressTitle: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  changeBtn: {
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  changeText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    lineHeight: 12,
    color: colors.primary,
  },
  addressRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  addressIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.xxs,
  },
  supportIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportCopy: {
    flex: 1,
    gap: 2,
  },
  supportTitle: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textPrimary,
  },
  supportSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
  },
  supportAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  supportLink: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    lineHeight: 12,
    color: colors.primary,
  },
});
