import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  fetchCategoryById,
  fetchRestaurantsByCategory,
} from '@/features/catalog/api/catalog.api';
import { getCategoryDishes } from '@/features/category/utils/get-category-dishes';
import { RecommendedDishCard } from '@/features/home/components/recommended-dish-card';
import { RestaurantCard } from '@/features/home/components/restaurant-card';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { EmptyState } from '@/shared/components/empty-state';
import { ErrorState } from '@/shared/components/error-state';
import { PremiumText } from '@/shared/components/premium-text';
import { Shimmer } from '@/shared/components/shimmer';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { useCarouselItemWidth } from '@/shared/hooks/use-carousel-item-width';
import { useSimulatedQuery } from '@/shared/hooks/use-simulated-query';
import { colors } from '@/theme/colors';
import { screenTopPadding } from '@/theme/screen-edge';
import { spacing } from '@/theme/spacing';

export function CategoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const categoryId = id ?? '';

  const categoryQuery = useSimulatedQuery(
    (signal) => fetchCategoryById(categoryId, signal),
    [categoryId],
    { enabled: Boolean(categoryId) },
  );
  const restaurantsQuery = useSimulatedQuery(
    (signal) => fetchRestaurantsByCategory(categoryId, signal),
    [categoryId],
    { enabled: Boolean(categoryId) },
  );

  const isLoading =
    categoryQuery.status === 'loading' || restaurantsQuery.status === 'loading';
  const hasError =
    categoryQuery.status === 'error' || restaurantsQuery.status === 'error';

  const onRefresh = useCallback(() => {
    categoryQuery.refetch();
    restaurantsQuery.refetch();
  }, [categoryQuery, restaurantsQuery]);

  const refreshing =
    categoryQuery.isRefreshing || restaurantsQuery.isRefreshing;

  const restaurants = restaurantsQuery.data ?? [];
  const dishes = getCategoryDishes(restaurants, categoryId);
  const categoryName = categoryQuery.data?.name ?? 'Category';

  const dishCardWidth = useCarouselItemWidth({
    visibleCount: 2.1,
    peek: 0.04,
    gap: spacing.md,
    paddingEnd: spacing.lg,
  });

  function onBack() {
    hapticSoftTap();
    router.back();
  }

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />
      <View
        style={[styles.topBar, { paddingTop: screenTopPadding(insets.top) }]}
      >
        <Pressable
          style={styles.backBtn}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AppSymbol
            name="chevron.left"
            size={20}
            tintColor={colors.textPrimary}
          />
        </Pressable>
        <PremiumText variant="h3" numberOfLines={1} style={styles.title}>
          {categoryName}
        </PremiumText>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.textPrimary}
          />
        }
      >
        {isLoading ? (
          <View style={styles.skeleton}>
            <Shimmer height={180} borderRadius={20} />
            <Shimmer height={120} borderRadius={20} />
            <Shimmer height={120} borderRadius={20} />
          </View>
        ) : null}

        {hasError ? (
          <ErrorState message="Could not load category." onRetry={onRefresh} />
        ) : null}

        {!isLoading && !hasError ? (
          <>
            {dishes.length > 0 ? (
              <View style={styles.section}>
                <PremiumText variant="sectionTitle" style={styles.sectionTitle}>
                  Popular {categoryName}
                </PremiumText>
                <ScrollView
                  horizontal
                  nestedScrollEnabled
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.dishRow}
                >
                  {dishes.map((dish) => (
                    <RecommendedDishCard
                      key={`${dish.restaurantId}-${dish.item.id}`}
                      dish={dish}
                      width={dishCardWidth}
                    />
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <View style={styles.section}>
              <PremiumText variant="sectionTitle" style={styles.sectionTitle}>
                Restaurants
              </PremiumText>
              {restaurants.length === 0 ? (
                <EmptyState
                  title="Nothing here yet"
                  message={`No restaurants found for ${categoryName.toLowerCase()}.`}
                />
              ) : (
                <View style={styles.restaurantList}>
                  {restaurants.map((restaurant, index) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      index={index}
                    />
                  ))}
                </View>
              )}
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  content: {
    paddingTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  dishRow: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
  },
  restaurantList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  skeleton: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
});
