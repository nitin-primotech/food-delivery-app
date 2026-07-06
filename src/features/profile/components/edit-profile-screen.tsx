import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ProfileSubScreenShell } from '@/features/profile/components/profile-sub-screen-shell';
import { editProfileStyles as styles } from '@/features/profile/constants/edit-profile.styles';
import { formatProfilePhone } from '@/features/profile/constants/profile.constants';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PROFILE_SAVED_NAV_DELAY_MS } from '@/shared/components/profile-saved-toast';
import { hapticSoftTap, hapticSuccess } from '@/shared/haptics/feedback';
import { formTextInputProps } from '@/shared/utils/keyboard';
import { filterPersonNameInput } from '@/shared/utils/person-name';
import {
  markProfileSaved,
  selectAddress,
  selectUserName,
  updateProfileName,
  useAppStore,
} from '@/store/app.store';
import { selectUserPhone, useAuthStore } from '@/store/auth.store';
import { colors } from '@/theme/colors';

export function EditProfileScreen() {
  const router = useRouter();
  const userName = useAppStore(selectUserName);
  const phone = useAuthStore(selectUserPhone);
  const address = useAppStore(selectAddress);
  const [name, setName] = useState(userName ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const trimmed = name.trim();
  const canSave =
    !isSaving && trimmed.length >= 2 && trimmed !== (userName ?? '');
  const displayPhone = phone ? formatProfilePhone(phone) : 'Not linked';

  function handleSave() {
    if (!canSave) return;
    Keyboard.dismiss();
    setIsSaving(true);
    updateProfileName(trimmed);
    markProfileSaved();
    hapticSuccess();
    setTimeout(() => {
      router.back();
    }, PROFILE_SAVED_NAV_DELAY_MS);
  }

  return (
    <ProfileSubScreenShell
      title="Edit"
      accentTitle="Profile"
      subtitle="Update your account details"
    >
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Full name</Text>
        <View style={styles.inputRow}>
          <AppSymbol
            name="person.fill"
            size={16}
            tintColor={colors.textTertiary}
          />
          <TextInput
            value={name}
            onChangeText={(text) => setName(filterPersonNameInput(text))}
            placeholder="Your name"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            autoCapitalize="words"
            autoCorrect={false}
            textContentType="name"
            returnKeyType="done"
            onSubmitEditing={handleSave}
            selectionColor={colors.primary}
            {...formTextInputProps}
            maxLength={30}
          />
          {name.length > 0 ? (
            <Pressable
              onPress={() => setName('')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Clear name"
            >
              <AppSymbol
                name="xmark.circle.fill"
                size={18}
                tintColor={colors.textTertiary}
              />
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Mobile number</Text>
        <View style={[styles.inputRow, styles.inputRowDisabled]}>
          <AppSymbol
            name="phone.fill"
            size={16}
            tintColor={colors.textTertiary}
          />
          <Text style={styles.readOnlyText}>{displayPhone}</Text>
          <View style={styles.verifiedPill}>
            <Text style={styles.verifiedPillText}>Verified</Text>
          </View>
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Delivery area</Text>
        <Pressable
          style={styles.inputRow}
          onPress={() => {
            hapticSoftTap();
            router.push('/location');
          }}
          accessibilityRole="button"
        >
          <AppSymbol
            name="location.fill"
            size={16}
            tintColor={colors.textTertiary}
          />
          <Text style={styles.readOnlyText} numberOfLines={2}>
            {address.line2}
          </Text>
          <AppSymbol
            name="chevron.right"
            size={12}
            tintColor={colors.textTertiary}
          />
        </Pressable>
      </View>

      <Pressable
        style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={!canSave}
        accessibilityRole="button"
        accessibilityLabel="Save profile"
      >
        <Text style={styles.saveBtnText}>Save changes</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryBtn}
        onPress={() => {
          hapticSoftTap();
          Alert.alert(
            'Need help?',
            'Contact support from Help & Support on your profile.',
          );
        }}
        accessibilityRole="button"
      >
        <Text style={styles.secondaryBtnText}>
          Need help with your account?
        </Text>
      </Pressable>
    </ProfileSubScreenShell>
  );
}
