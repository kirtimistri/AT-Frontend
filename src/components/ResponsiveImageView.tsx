// ResponsiveImageView.tsx
// Serves AVIF first, then WebP, then the original raster as a fallback, with
// multiple screen-size variants so the browser downloads the smallest image
// that fits the viewport (via <picture> + srcSet).
import type { Ref } from 'react';

export type ImageVariant = { src: string; w: number };

export const ResponsiveImageView = ({
  avif,
  webp,
  fallback,
  sizes = '100vw',
  alt = '',
  imgClassName,
  imgRef,
  eager = true,
}: {
  avif?: ImageVariant[];
  webp?: ImageVariant[];
  fallback: string;
  sizes?: string;
  alt?: string;
  imgClassName?: string;
  imgRef?: Ref<HTMLImageElement>;
  eager?: boolean;
}) => {
  const toSrcSet = (variants?: ImageVariant[]) =>
    variants?.map((v) => `${v.src} ${v.w}w`).join(', ');

  return (
    <picture>
      {avif && avif.length > 0 && (
        <source type="image/avif" srcSet={toSrcSet(avif)} sizes={sizes} />
      )}
      {webp && webp.length > 0 && (
        <source type="image/webp" srcSet={toSrcSet(webp)} sizes={sizes} />
      )}
      <img
        ref={imgRef}
        src={fallback}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        className={imgClassName}
      />
    </picture>
  );
};