import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  deriveMrp,
  formatInr,
} from '@/features/checkout/utils/format-currency';
import { productDetailPath } from '@/features/product/utils/product-path';
import { AppSymbol } from '@/shared/components/app-symbol';
import { ProductImage } from '@/shared/components/product-image';
import { WishlistToggle } from '@/shared/components/wishlist-toggle';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import {
  removeWishlistEntry,
  type WishlistProduct,
  wishlistProductKey,
} from '@/store/wishlist.store';
import { colors, shadows } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type WishlistDishRowProps = {
  entry: WishlistProduct;
  isManaging?: boolean;
};

export function WishlistDishRow({
  entry,
  isManaging = false,
}: WishlistDishRowProps) {
  const { item, restaurantId, restaurantName, rating } = entry;
  const mrp = deriveMrp(item.price);
  const entryKey = wishlistProductKey(restaurantId, item.id);

  function handleRemove() {
    hapticSoftTap();
    removeWishlistEntry(entryKey);
  }

  return (
    <View
      style={[styles.card, shadows.soft, isManaging && styles.cardManaging]}
    >
      {isManaging ? (
        <Pressable
          style={styles.pressable}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${item.name} from wishlist`}
        >
          <View style={styles.imageWrap}>
            <ProductImage
              image={item.image}
              categoryName={item.category}
              style={styles.image}
              contentFit="cover"
              recyclingKey={item.id}
            />
          </View>

          <View style={styles.body}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.restaurant} numberOfLines={1}>
              {restaurantName}
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatInr(item.price)}</Text>
              <Text style={styles.mrp}>{formatInr(mrp)}</Text>
            </View>
          </View>
        </Pressable>
      ) : (
        <Link href={productDetailPath(restaurantId, item.id)} asChild>
          <Pressable style={styles.pressable} accessibilityRole="link">
            <View style={styles.imageWrap}>
              <ProductImage
                image={item.image}
                categoryName={item.category}
                style={styles.image}
                contentFit="cover"
                recyclingKey={item.id}
              />
            </View>

            <View style={styles.body}>
              <Text style={styles.name} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.restaurant} numberOfLines={1}>
                {restaurantName}
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>{formatInr(item.price)}</Text>
                <Text style={styles.mrp}>{formatInr(mrp)}</Text>
              </View>
            </View>
          </Pressable>
        </Link>
      )}

      {isManaging ? (
        <Pressable
          onPress={handleRemove}
          style={styles.removeBtn}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${item.name} from wishlist`}
        >
          <AppSymbol name="trash" size={16} tintColor={colors.danger} />
        </Pressable>
      ) : (
        <WishlistToggle
          item={item}
          restaurantId={restaurantId}
          restaurantName={restaurantName}
          rating={rating}
          style={styles.heart}
          accessibilityLabel={`Remove ${item.name} from wishlist`}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardManaging: {
    borderColor: 'rgba(220, 38, 38, 0.2)',
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    paddingRight: 48,
  },
  imageWrap: {
    width: 88,
    height: 88,
    borderRadius: 12,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: colors.backgroundMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  body: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  restaurant: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  mrp: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  heart: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  removeBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
