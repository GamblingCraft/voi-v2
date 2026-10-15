import type { ComponentProps } from "react";

type IntrinsicImageProps = Omit<ComponentProps<"img">, "alt"> & { alt: string };

/** Preserve intrinsic image dimensions for DOM-measured compositions and GSAP. */
export function IntrinsicImage({ alt, ...props }: IntrinsicImageProps) {
  // The animation controllers measure the native image box directly.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={alt} />;
}
