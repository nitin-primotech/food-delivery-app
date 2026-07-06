import { type Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthContinueButton } from '@/features/auth/components/auth-continue-button';
import { authScreenStyles } from '@/features/auth/constants/auth-screen.styles';
import {
  locationScreenLayoutStyles as layout,
  locationScreenStyles as text,
} from '@/features/auth/constants/location-screen.styles';
import {
  getCurrentLocationSuggestion,
  getLocationSuggestions,
} from '@/features/auth/services/location.service';
import type {
  LocationCity,
  LocationSuggestion,
} from '@/features/auth/types/location.types';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { ScreenBackButton } from '@/shared/components/screen-back-button';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { formTextInputProps } from '@/shared/utils/keyboard';
import { setDeliveryAddressFromSuggestion } from '@/store/app.store';
import { colors, shadows } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type LocationSearchScreenProps = {
  flow?: 'onboarding' | 'change';
};

const CITY_LABEL: Record<LocationCity, string> = {
  mohali: 'Mohali',
  delhi: 'Delhi',
  noida: 'Noida',
};

const CONFIRM_SHEET_HEIGHT = 220;

export function LocationSearchScreen({
  flow = 'change',
}: LocationSearchScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isOnboarding = flow === 'onboarding';
  const [query, setQuery] = useState('');
  const [pendingSelection, setPendingSelection] =
    useState<LocationSuggestion | null>(null);

  const results = useMemo(() => getLocationSuggestions(query), [query]);

  function finishWithSuggestion(suggestion: LocationSuggestion) {
    if (isOnboarding) {
      setDeliveryAddressFromSuggestion(suggestion, { onboarding: true });
      router.replace('/(auth)/personalize' as Href);
      return;
    }
    setDeliveryAddressFromSuggestion(suggestion);
    router.back();
  }

  function selectSuggestion(suggestion: LocationSuggestion) {
    hapticSoftTap();
    Keyboard.dismiss();
    setPendingSelection(suggestion);
  }

  function proceedWithSelection() {
    if (!pendingSelection) return;
    finishWithSuggestion(pendingSelection);
  }

  function useCurrentLocation() {
    hapticSoftTap();
    selectSuggestion(getCurrentLocationSuggestion());
  }

  function handleBack() {
    if (isOnboarding) {
      router.replace('/(auth)/name' as Href);
    } else {
      router.back();
    }
  }

  const listBottomPad =
    insets.bottom +
    spacing.xl +
    (pendingSelection ? CONFIRM_SHEET_HEIGHT + spacing.md : 0);

  const listHeader = (
    <View>
      <View style={layout.header}>
        <ScreenBackButton onPress={handleBack} />
        {isOnboarding ? (
          <View style={styles.onboardingHeader}>
            <Text style={authScreenStyles.title}>
              Enter your area or apartment name
            </Text>
            <Text style={authScreenStyles.subtitle}>
              We deliver to this area — pick the closest match
            </Text>
          </View>
        ) : (
          <Text style={text.title}>Change delivery location</Text>
        )}
      </View>

      <View style={layout.searchWrap}>
        <AppSymbol
          name="magnifyingglass"
          size={20}
          tintColor={colors.textTertiary}
        />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search Mohali, Delhi, Noida…"
          placeholderTextColor={colors.textTertiary}
          style={text.searchInput}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
          {...formTextInputProps}
        />
        {query.length > 0 ? (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <AppSymbol
              name="xmark.circle.fill"
              size={22}
              tintColor={colors.textTertiary}
            />
          </Pressable>
        ) : null}
      </View>

      <Pressable style={layout.actionRow} onPress={useCurrentLocation}>
        <View style={layout.actionIcon}>
          <AppSymbol
            name="location.fill"
            size={20}
            tintColor={colors.primary}
          />
        </View>
        <Text style={text.actionLabel}>Use my current location</Text>
        <AppSymbol name="chevron.right" size={16} tintColor={colors.primary} />
      </Pressable>

      <View style={layout.divider} />

      <Text style={[text.sectionLabel, layout.sectionLabel]}>
        {query.trim().length > 0 ? 'Search results' : 'Popular areas'}
      </Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={layout.root}>
        <AppStatusBar style="dark" />
        <View style={[layout.content, { paddingTop: insets.top + spacing.md }]}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            style={layout.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ paddingBottom: listBottomPad }}
            onScrollBeginDrag={Keyboard.dismiss}
            ListHeaderComponent={listHeader}
            renderItem={({ item }) => {
              const isSelected = pendingSelection?.id === item.id;
              return (
                <Pressable
                  style={[
                    layout.resultRow,
                    isSelected && layout.resultRowSelected,
                  ]}
                  onPress={() => selectSuggestion(item)}
                >
                  <View style={layout.resultIcon}>
                    <AppSymbol
                      name="location.fill"
                      size={18}
                      tintColor={
                        isSelected ? colors.primary : colors.textSecondary
                      }
                    />
                  </View>
                  <View style={layout.resultText}>
                    <View style={layout.resultTitleRow}>
                      <Text style={text.resultTitle}>{item.title}</Text>
                      <View style={layout.cityPill}>
                        <Text style={text.cityPillText}>
                          {CITY_LABEL[item.city]}
                        </Text>
                      </View>
                    </View>
                    <Text style={text.resultSubtitle} numberOfLines={2}>
                      {item.subtitle}
                    </Text>
                  </View>
                  {isSelected ? (
                    <AppSymbol
                      name="checkmark.circle.fill"
                      size={22}
                      tintColor={colors.primary}
                    />
                  ) : null}
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={layout.empty}>
                <Text style={text.emptyText}>
                  No locations found. Try a different search.
                </Text>
              </View>
            }
          />
        </View>

        {pendingSelection ? (
          <View style={layout.confirmOverlay} pointerEvents="box-none">
            <Pressable
              style={layout.confirmBackdrop}
              onPress={() => {
                Keyboard.dismiss();
                setPendingSelection(null);
              }}
              accessibilityRole="button"
              accessibilityLabel="Dismiss location confirmation"
            />
            <View
              style={[
                layout.confirmSheet,
                shadows.card,
                { paddingBottom: insets.bottom + spacing.md },
              ]}
            >
              <View style={layout.confirmHandle} />
              <Text style={text.confirmLabel}>Confirm delivery location</Text>
              <View style={layout.confirmCard}>
                <View style={layout.confirmIcon}>
                  <AppSymbol
                    name="mappin.circle.fill"
                    size={28}
                    tintColor={colors.primary}
                  />
                </View>
                <View style={layout.confirmCopy}>
                  <View style={layout.resultTitleRow}>
                    <Text style={text.confirmTitle}>
                      {pendingSelection.title}
                    </Text>
                    <View style={layout.cityPill}>
                      <Text style={text.cityPillText}>
                        {CITY_LABEL[pendingSelection.city]}
                      </Text>
                    </View>
                  </View>
                  <Text style={text.resultSubtitle} numberOfLines={2}>
                    {pendingSelection.subtitle}
                  </Text>
                </View>
              </View>
              <AuthContinueButton
                label={isOnboarding ? 'Continue' : 'Confirm & proceed'}
                onPress={proceedWithSelection}
              />
              <Pressable
                onPress={() => setPendingSelection(null)}
                style={layout.changeBtn}
                accessibilityRole="button"
                accessibilityLabel="Choose another location"
              >
                <Text style={text.changeLink}>Choose another location</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  onboardingHeader: {
    gap: spacing.xs,
  },
});
