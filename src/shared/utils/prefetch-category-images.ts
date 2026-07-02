import { Image } from 'expo-image';

import { getAllCategoryImageSources } from '@/lib/firebase/category-local-images';

const CACHE_POLICY = 'memory-disk' as const;

let started = false;

/** Warm bundled category art during splash/welcome so personalize renders instantly. */
export function prefetchCategoryImages(): void {
  if (started) {
    return;
  }

  started = true;
  const sources = getAllCategoryImageSources();

  void Promise.all(
    sources.map((source) =>
      Image.prefetch(source, { cachePolicy: CACHE_POLICY }),
    ),
  ).catch(() => {
    started = false;
  });
}
