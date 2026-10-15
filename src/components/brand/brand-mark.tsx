import Image from "next/image";

type BrandMarkProps = {
  className?: string;
  priority?: boolean;
};

export function BrandMark({ className, priority = false }: BrandMarkProps) {
  return (
    <Image
      className={className}
      src="/brand/logo-trimmed.svg"
      alt=""
      width={219}
      height={216}
      priority={priority}
    />
  );
}
