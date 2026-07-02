import { type ImageProps } from 'expo-image';

import { resolveCategoryImageSource } from '@/lib/firebase/category-local-images';
import { RemoteImage } from '@/shared/components/remote-image';

type CategoryImageProps = Omit<ImageProps, 'source'> & {
  categoryName: string;
  remoteImage?: string;
  recyclingKey?: string;
};

export function CategoryImage({
  categoryName,
  recyclingKey,
  style,
  contentFit = 'cover',
  transition = 0,
  ...rest
}: CategoryImageProps) {
  return (
    <RemoteImage
      source={resolveCategoryImageSource(categoryName)}
      style={style}
      contentFit={contentFit}
      transition={transition}
      cachePolicy="memory-disk"
      priority="high"
      recyclingKey={recyclingKey ?? categoryName}
      {...rest}
    />
  );
}
