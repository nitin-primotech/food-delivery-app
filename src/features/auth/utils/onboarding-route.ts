import type { Href } from 'expo-router';

import type { OnboardingStep } from '@/features/auth/types/onboarding.types';

type RouteInput = {
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  onboardingStep: OnboardingStep;
  userName: string | null;
  hasConfirmedAddress: boolean;
};

/** Resume onboarding or land on home after splash hydration. */
export function getOnboardingHref(input: RouteInput): Href {
  const { isAuthenticated, onboardingComplete, userName, hasConfirmedAddress } =
    input;

  if (isAuthenticated && onboardingComplete) {
    return '/(tabs)' as Href;
  }

  if (isAuthenticated) {
    if (!userName) return '/(auth)/name' as Href;
    if (!hasConfirmedAddress) return '/location?onboarding=1' as Href;
    return '/(auth)/personalize' as Href;
  }

  return '/(auth)/welcome' as Href;
}
