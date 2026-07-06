import { resetAppProfile } from '@/store/app.store';
import { clearAuthState } from '@/store/auth.store';
import { clearCart } from '@/store/cart.store';
import { resetOrders } from '@/store/orders.store';
import { clearWishlist } from '@/store/wishlist.store';

/** Clears in-memory user session state (cart, wishlist, orders). */
export function clearUserSessionState() {
  resetOrders();
  clearCart();
  clearWishlist();
}

/** Signs out and wipes all persisted and in-memory user data from this device. */
export async function logoutUser() {
  clearUserSessionState();
  await clearAuthState();
  await resetAppProfile();
}
