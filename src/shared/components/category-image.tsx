import { Image, type ImageProps } from 'expo-image';

import { resolveCategoryImageSource } from '@/lib/firebase/category-local-images';

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
    <Image
      source={resolveCategoryImageSource(categoryName)}
      style={style}
      contentFit={contentFit}
      transition={transition}
      recyclingKey={recyclingKey ?? categoryName}
      {...rest}
    />
  );
}
