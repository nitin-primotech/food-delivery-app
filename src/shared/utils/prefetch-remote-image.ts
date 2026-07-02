import { Image } from 'expo-image';

import { isHttpImageUrl } from '@/lib/firebase/category-images';

const CACHE_POLICY = 'memory-disk' as const;

const inFlight = new Set<string>();

export function prefetchRemoteImage(uri: string | undefined): void {
  if (!uri || !isHttpImageUrl(uri) || inFlight.has(uri)) {
    return;
  }

  inFlight.add(uri);
  void Image.prefetch(uri, { cachePolicy: CACHE_POLICY })
    .catch(() => undefined)
    .finally(() => {
      inFlight.delete(uri);
    });
}

export function prefetchRemoteImages(
  uris: Array<string | undefined>,
  limit = 500,
): void {
  const seen = new Set<string>();

  for (const uri of uris) {
    if (seen.size >= limit) {
      break;
    }
    if (!uri || !isHttpImageUrl(uri) || seen.has(uri)) {
      continue;
    }
    seen.add(uri);
    prefetchRemoteImage(uri);
  }
}
