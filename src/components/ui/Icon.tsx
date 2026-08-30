import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Boxes,
  Clock,
  GraduationCap,
  Heart,
  HeartHandshake,
  House,
  Mail,
  MapPin,
  Menu,
  ShieldCheck,
  Stethoscope,
  Trophy,
  UtensilsCrossed,
  X,
  type LucideIcon,
} from "lucide-react";

/**
 * Explicit registry rather than dynamic lookup: content files reference icons
 * by name, and this keeps an invalid name a type error instead of a blank space
 * at runtime. SVG only — never emoji.
 */
const icons = {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Boxes,
  Clock,
  GraduationCap,
  Heart,
  HeartHandshake,
  House,
  Mail,
  MapPin,
  Menu,
  ShieldCheck,
  Stethoscope,
  Trophy,
  UtensilsCrossed,
  X,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  className,
  strokeWidth = 1.6,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Component = icons[name as IconName];
  if (!Component) return null;
  return (
    <Component className={className} strokeWidth={strokeWidth} aria-hidden />
  );
}
