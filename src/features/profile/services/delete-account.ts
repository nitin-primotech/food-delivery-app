import { logoutUser } from '@/features/profile/services/logout-user';

export async function deleteUserAccount() {
  await logoutUser();
}
