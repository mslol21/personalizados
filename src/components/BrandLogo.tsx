import Image from "next/image";

/** Original artwork extracted from the supplied logo, without redrawing it. */
export function BrandLogo({ priority = false, className = "" }: { priority?: boolean; className?: string }) {
  return (
    <span className={`brand-logo ${className}`}>
      <Image src="/images/brand/monogram-original.png" alt="" width={699} height={395} priority={priority} className="brand-logo-mark" />
      <Image src="/images/brand/wordmark-original.png" alt="Criativo Artes Personalizados" width={719} height={168} priority={priority} className="brand-logo-name" />
    </span>
  );
}
