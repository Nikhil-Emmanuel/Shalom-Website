import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button = cva(
  // min-h-11 keeps every control at/above the 44px touch target.
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md px-5 text-sm font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-primary-hover",
        secondary:
          "border border-hairline bg-canvas text-ink hover:bg-surface-soft",
        ghost: "text-ink hover:bg-surface-soft",
        onDark:
          "bg-canvas text-ink hover:bg-surface-soft",
      },
      size: {
        default: "min-h-11",
        lg: "min-h-13 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

type ButtonVariants = VariantProps<typeof button>;

export function Button({
  className,
  variant,
  size,
  ...props
}: ComponentProps<"button"> & ButtonVariants) {
  return (
    <button className={cn(button({ variant, size }), className)} {...props} />
  );
}

export function ButtonLink({
  href,
  children,
  className,
  variant,
  size,
}: {
  href: string;
  children: ReactNode;
  className?: string;
} & ButtonVariants) {
  return (
    <Link href={href} className={cn(button({ variant, size }), className)}>
      {children}
    </Link>
  );
}
