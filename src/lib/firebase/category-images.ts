export function isHttpImageUrl(value: string | undefined): boolean {
  return Boolean(value?.startsWith('http://') || value?.startsWith('https://'));
}

export function isDisplayableImageUrl(value: string | undefined): boolean {
  return isHttpImageUrl(value) || Boolean(value?.startsWith('data:image/'));
}

/** @deprecated Use resolveCategoryImageSource(categoryName) for instant bundled tiles. */
export function resolveCategoryImageUri(
  image: string | undefined,
): string | undefined {
  return isHttpImageUrl(image) ? image : undefined;
}

export {
  getCategoryLocalImage,
  isBundledImageSource,
  resolveCategoryImageSource,
} from '@/lib/firebase/category-local-images';
