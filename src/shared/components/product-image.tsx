import { type ImageProps } from 'expo-image';

import { isDisplayableImageUrl } from '@/lib/firebase/category-images';
import { resolveCategoryImageSource } from '@/lib/firebase/category-local-images';
import { RemoteImage } from '@/shared/components/remote-image';

type ProductImageProps = Omit<ImageProps, 'source'> & {
  image?: string;
  categoryName?: string;
  recyclingKey: string;
  priority?: ImageProps['priority'];
};

/**
 * Shows the merchant-uploaded image (Blob / HTTPS) when available.
 * Bundled category art is used as an instant placeholder while the remote image loads.
 */
export function ProductImage({
  image,
  categoryName,
  recyclingKey,
  style,
  contentFit = 'cover',
  transition = 120,
  priority = 'normal',
  ...rest
}: ProductImageProps) {
  const placeholder = resolveCategoryImageSource(
    categoryName ?? 'Punjabi Breakfast',
  );

  if (isDisplayableImageUrl(image)) {
    return (
      <RemoteImage
        source={{ uri: image as string }}
        placeholder={placeholder}
        placeholderContentFit="cover"
        style={style}
        contentFit={contentFit}
        transition={transition}
        cachePolicy="memory-disk"
        recyclingKey={recyclingKey}
        priority={priority}
        {...rest}
      />
    );
  }

  return (
    <RemoteImage
      source={placeholder}
      style={style}
      contentFit={contentFit}
      transition={0}
      cachePolicy="memory-disk"
      recyclingKey={recyclingKey}
      {...rest}
    />
  );
}
