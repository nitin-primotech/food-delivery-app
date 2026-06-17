import type { KeyboardAvoidingViewProps, TextInputProps } from 'react-native';

/** iOS uses padding; Android relies on `softwareKeyboardLayoutMode: resize` in app.json. */
export const keyboardAvoidingBehavior: KeyboardAvoidingViewProps['behavior'] =
  process.env.EXPO_OS === 'ios' ? 'padding' : undefined;

/** Prevent iOS from tinting the system keyboard with app accent colors. */
export const keyboardAppearance: NonNullable<
  TextInputProps['keyboardAppearance']
> = 'light';
