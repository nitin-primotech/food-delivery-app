import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Order } from '@/features/catalog/types/catalog.types';
import { formatInr } from '@/features/checkout/utils/format-currency';
import {
  countOrderItems,
  formatDeliveryLine,
  formatOrderDateTime,
  formatOrderId,
  ORDER_STATUS_UI,
} from '@/features/orders/constants/orders.constants';
import { isDisplayableImageUrl } from '@/lib/firebase/category-images';
import { AppSymbol } from '@/shared/components/app-symbol';
import { ProductImage } from '@/shared/components/product-image';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { useCatalogStore } from '@/store/catalog.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const MAX_THUMBS = 4;

type OrderListCardProps = {
  order: Order;
};

function resolveOrderItemImage(
  itemId: string,
  itemName: string,
  image: string | undefined,
  catalogById: Map<string, { image: string; category: string }>,
  catalogByName: Map<string, { image: string; category: string }>,
): string {
  if (isDisplayableImageUrl(image)) {
    return image as string;
  }
  return (
    catalogById.get(itemId)?.image ??
    catalogByName.get(itemName.trim().toLowerCase())?.image ??
    ''
  );
}

function resolveOrderItemCategory(
  itemId: string,
  itemName: string,
  category: string | undefined,
  catalogById: Map<string, { image: string; category: string }>,
  catalogByName: Map<string, { image: string; category: string }>,
): string | undefined {
  if (category?.trim()) {
    return category;
  }
  return (
    catalogById.get(itemId)?.category ??
    catalogByName.get(itemName.trim().toLowerCase())?.category
  );
}

export function OrderListCard({ order }: OrderListCardProps) {
  const router = useRouter();
  const catalogItems = useCatalogStore((state) => state.items);
  const catalogById = new Map(
    catalogItems.map((item) => [
      item.id,
      { image: item.image, category: item.category },
    ]),
  );
  const catalogByName = new Map(
    catalogItems.map((item) => [
      item.name.trim().toLowerCase(),
      { image: item.image, category: item.category },
    ]),
  );
  const statusUi = ORDER_STATUS_UI[order.status];
  const itemCount = countOrderItems(order.items);
  const visibleItems = order.items.slice(0, MAX_THUMBS);
  const overflow = itemCount - visibleItems.reduce((s, l) => s + l.quantity, 0);

  function handleTrack() {
    hapticSoftTap();
    router.push(`/order/${order.id}`);
  }

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.orderId}>Order ID: {formatOrderId(order.id)}</Text>
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

      <View style={styles.metaRow}>
        <Text style={styles.dateText}>
          {formatOrderDateTime(order.createdAt)}
        </Text>
        <Text style={styles.deliveryText} numberOfLines={1}>
          {formatDeliveryLine(order.status, order.estimatedDelivery)}
        </Text>
      </View>
      <View style={styles.thumbRow}>
        {visibleItems.map((line) => (
          <ProductImage
            key={`${line.restaurantId}:${line.item.id}`}
            image={resolveOrderItemImage(
              line.item.id,
              line.item.name,
              line.item.image,
              catalogById,
              catalogByName,
            )}
            categoryName={resolveOrderItemCategory(
              line.item.id,
              line.item.name,
              line.item.category,
              catalogById,
              catalogByName,
            )}
            style={styles.thumb}
            contentFit="cover"
            recyclingKey={`${line.restaurantId}:${line.item.id}`}
          />
        ))}
        {overflow > 0 ? (
          <View style={styles.overflow}>
            <Text style={styles.overflowText}>+{overflow}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.summary}>
          {itemCount} {itemCount === 1 ? 'Item' : 'Items'} · Total:{' '}
          <Text style={styles.summaryAmount}>{formatInr(order.total)}</Text>
        </Text>
        <Pressable
          style={styles.trackBtn}
          onPress={handleTrack}
          accessibilityRole="button"
          accessibilityLabel="Track order"
        >
          <Text style={styles.trackLabel}>
            {order.status === 'delivered' ? 'View Details' : 'Track Order'}
          </Text>
          <AppSymbol
            name="chevron.right"
            size={11}
            tintColor={colors.primary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  orderId: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  statusBadge: {
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  dateText: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
  },
  deliveryText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  thumbRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xxs,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundMuted,
    overflow: 'hidden',
  },
  overflow: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overflowText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.xxs,
  },
  summary: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  summaryAmount: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 14,
    color: colors.textPrimary,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    borderRadius: 8,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  trackLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.primary,
  },
});
