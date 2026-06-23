/** Whole-rupee display for checkout (matches grocery-style pricing). */
export function formatInr(amount: number): string {
  return `₹${Math.round(amount)}`;
}

export function deriveMrp(price: number): number {
  return Math.round(price * 1.18);
}

export function deriveDiscountPercent(price: number, mrp: number): number {
  if (mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}
