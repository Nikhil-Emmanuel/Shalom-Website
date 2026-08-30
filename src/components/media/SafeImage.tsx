import Image from "next/image";
import type { Photo } from "@/content/schema";
import { isPublishable } from "@/lib/privacy";
import { cn } from "@/lib/utils";

/**
 * The only component that renders a photograph of the home.
 *
 * It refuses to render anything the safeguarding policy withholds — so even if
 * a page passes a withheld photo by mistake, nothing identifiable is published.
 * Callers should filter through the content accessor first; this is the backstop.
 */
export function SafeImage({
  photo,
  className,
  sizes = "100vw",
  priority = false,
  fill = true,
}: {
  photo: Photo;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
}) {
  if (!isPublishable(photo)) return null;

  const common = {
    src: photo.src,
    placeholder: "blur" as const,
    blurDataURL: photo.blurDataURL,
    sizes,
    priority,
  };

  if (fill) {
    return (
      <Image
        {...common}
        alt={photo.alt}
        fill
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <Image
      {...common}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      className={className}
    />
  );
}
