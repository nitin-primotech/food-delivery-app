import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { ProductImage } from '@/shared/components/product-image';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const STAGE_HEIGHT = 248;
const H_PAD = spacing.lg;

type ProductImageHeroProps = {
  image?: string;
  categoryName?: string;
  discountPercent?: number;
};

export function ProductImageHero({
  image,
  categoryName,
  discountPercent = 0,
}: ProductImageHeroProps) {
  const stageWidth = Dimensions.get('window').width - H_PAD * 2;

  return (
    <View style={styles.wrap}>
      <View style={[styles.stage, { width: stageWidth }]}>
        <LinearGradient
          colors={['#FFFDFB', '#F8F1EA', '#F3E8DE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.imageFrame}>
          <ProductImage
            image={image}
            categoryName={categoryName}
            style={styles.image}
            contentFit="cover"
            priority="high"
            recyclingKey={image ?? categoryName ?? 'product-hero'}
          />
        </View>

        {discountPercent > 0 ? (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPercent}% OFF</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  stage: {
    height: STAGE_HEIGHT,
    borderRadius: 18,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: 0,
    backgroundColor: '#FFFDFB',
    boxShadow: '0 10px 28px rgba(28, 28, 30, 0.08)',
  },
  imageFrame: {
    flex: 1,
    padding: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    boxShadow: '0 4px 10px rgba(212, 84, 60, 0.24)',
  },
  discountText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textInverse,
  },
});
