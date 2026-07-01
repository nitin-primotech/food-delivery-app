import { Image, type ImageProps } from 'expo-image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { isHttpImageUrl } from '@/lib/firebase/category-images';
import { AppSymbol } from '@/shared/components/app-symbol';
import { Shimmer } from '@/shared/components/shimmer';
import { colors } from '@/theme/colors';

type LoadStatus = 'loading' | 'loaded' | 'error';

const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [1000, 2000, 4000] as const;
const DEFAULT_CACHE_POLICY: NonNullable<ImageProps['cachePolicy']> =
  'memory-disk';

function getImageUri(source: ImageProps['source']): string | undefined {
  if (!source) return undefined;
  if (typeof source === 'string') return source;
  if (typeof source === 'number') return undefined;
  if (Array.isArray(source)) return getImageUri(source[0]);
  if ('uri' in source && typeof source.uri === 'string') return source.uri;
  return undefined;
}

export function buildImageRecyclingKey(
  ...parts: Array<string | number | undefined | null>
): string {
  return parts.filter((part) => part != null && part !== '').join(':');
}

function readBorderRadius(style: StyleProp<ViewStyle>): number {
  const flat = StyleSheet.flatten(style);
  return typeof flat?.borderRadius === 'number' ? flat.borderRadius : 0;
}

function isRetryableImageError(error: unknown): boolean {
  const message = String(error ?? '').toLowerCase();
  return (
    message.includes('429') ||
    message.includes('too many requests') ||
    message.includes('status code: 502') ||
    message.includes('status code: 503') ||
    message.includes('status code: 504') ||
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('failed to connect') ||
    message.includes('unable to resolve')
  );
}

function retryDelayMs(attemptIndex: number): number {
  const base =
    RETRY_DELAYS_MS[attemptIndex] ??
    RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1];
  return base + Math.floor(Math.random() * 300);
}

export type RemoteImageProps = ImageProps;

type RemoteImageFrameProps = RemoteImageProps & {
  imageUri: string;
};

function RemoteImageFrame({
  imageUri,
  source,
  style,
  onLoad,
  onError,
  onLoadEnd,
  onDisplay,
  transition = 220,
  recyclingKey,
  cachePolicy = DEFAULT_CACHE_POLICY,
  ...rest
}: RemoteImageFrameProps) {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [retryAttempt, setRetryAttempt] = useState(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const borderRadius = readBorderRadius(style);
  const showSkeleton = status === 'loading';
  const showFallback = status === 'error';

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, []);

  function clearRetryTimer() {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }

  function markLoaded() {
    clearRetryTimer();
    setStatus((current) => (current === 'error' ? 'error' : 'loaded'));
  }

  function scheduleRetry(nextAttempt: number) {
    clearRetryTimer();
    retryTimerRef.current = setTimeout(
      () => {
        retryTimerRef.current = null;
        setRetryAttempt(nextAttempt);
        setStatus('loading');
      },
      retryDelayMs(nextAttempt - 1),
    );
  }

  function handleError(
    event: Parameters<NonNullable<ImageProps['onError']>>[0],
  ) {
    onError?.(event);
    if (isRetryableImageError(event.error) && retryAttempt < MAX_RETRIES) {
      scheduleRetry(retryAttempt + 1);
      return;
    }
    clearRetryTimer();
    setStatus('error');
  }

  return (
    <View style={[style, styles.frame]} collapsable={false}>
      {!showFallback ? (
        <Image
          key={`${imageUri}:${retryAttempt}`}
          source={source}
          style={StyleSheet.absoluteFill}
          transition={transition}
          recyclingKey={recyclingKey}
          cachePolicy={cachePolicy}
          {...rest}
          onLoad={(event) => {
            markLoaded();
            onLoad?.(event);
          }}
          onLoadEnd={() => {
            markLoaded();
            onLoadEnd?.();
          }}
          onDisplay={() => {
            markLoaded();
            onDisplay?.();
          }}
          onError={handleError}
        />
      ) : null}
      {showSkeleton ? (
        <Shimmer
          style={[StyleSheet.absoluteFill, styles.shimmer]}
          borderRadius={borderRadius}
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      ) : null}
      {showFallback ? (
        <View
          style={[StyleSheet.absoluteFill, styles.fallback, { borderRadius }]}
          accessibilityLabel="Image unavailable"
          accessibilityRole="image"
        >
          <AppSymbol
            name="fork.knife"
            size={22}
            tintColor={colors.textTertiary}
          />
        </View>
      ) : null}
    </View>
  );
}

/**
 * Remote HTTP(S) images show a same-size shimmer until loaded.
 * Retries rate-limited / transient failures with backoff.
 * Pass a stable `recyclingKey` per list/grid cell on Android (e.g. product id).
 */
export function RemoteImage({
  source,
  style,
  transition = 220,
  recyclingKey,
  cachePolicy = DEFAULT_CACHE_POLICY,
  ...rest
}: RemoteImageProps) {
  const imageUri = useMemo(() => getImageUri(source), [source]);
  const isRemote = isHttpImageUrl(imageUri);

  if (!isRemote || !imageUri) {
    return (
      <Image
        source={source}
        style={style}
        transition={transition}
        recyclingKey={recyclingKey}
        cachePolicy={cachePolicy}
        {...rest}
      />
    );
  }

  return (
    <RemoteImageFrame
      key={imageUri}
      imageUri={imageUri}
      source={source}
      style={style}
      transition={transition}
      recyclingKey={recyclingKey}
      cachePolicy={cachePolicy}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
  },
  shimmer: {
    zIndex: 1,
  },
  fallback: {
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundMuted,
  },
});
