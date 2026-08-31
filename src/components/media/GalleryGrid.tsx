"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import type { Photo, PhotoCategory } from "@/content/schema";
import { SafeImage } from "@/components/media/SafeImage";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<PhotoCategory, string> = {
  "daily-life": "Daily life",
  education: "School",
  nutrition: "Meals",
  health: "Health",
  sport: "Sport",
  celebration: "Celebrations",
  outreach: "Villages",
  people: "People",
};

export function GalleryGrid({ photos }: { photos: Photo[] }) {
  const [filter, setFilter] = useState<PhotoCategory | "all">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const categories = useMemo(() => {
    const present = new Set(photos.map((p) => p.category));
    return (Object.keys(CATEGORY_LABELS) as PhotoCategory[]).filter((c) =>
      present.has(c),
    );
  }, [photos]);

  const visible = useMemo(
    () => (filter === "all" ? photos : photos.filter((p) => p.category === filter)),
    [photos, filter],
  );

  const close = useCallback(() => {
    setOpenIndex(null);
    lastFocused.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + delta + visible.length) % visible.length;
      });
    },
    [visible.length],
  );

  // Escape closes, arrows navigate, Tab is trapped inside the dialog.
  useEffect(() => {
    if (openIndex === null) return;

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
      if (event.key !== "Tab") return;

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled])",
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, step]);

  const active = openIndex === null ? null : visible[openIndex];

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter photographs">
        <FilterChip
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label={`All (${photos.length})`}
        />
        {categories.map((category) => (
          <FilterChip
            key={category}
            active={filter === category}
            onClick={() => setFilter(category)}
            label={CATEGORY_LABELS[category]}
          />
        ))}
      </div>

      <Reveal
        key={filter}
        stagger
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((photo, index) => (
          <button
            key={photo.slug}
            type="button"
            onClick={(event) => {
              lastFocused.current = event.currentTarget;
              setOpenIndex(index);
            }}
            className="group relative aspect-4/3 cursor-pointer overflow-hidden rounded-2xl bg-surface-card text-left"
          >
            <SafeImage
              photo={photo}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
              className="transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4 pt-10 text-sm font-medium text-canvas">
              {photo.caption}
            </span>
          </button>
        ))}
      </Reveal>

      {visible.length === 0 && (
        <p className="mt-10 text-muted">No photographs in this category yet.</p>
      )}

      <AnimatePresence>
        {active && (
        <LightboxShell dialogRef={dialogRef} label={active.caption}>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-canvas/70">
              {openIndex! + 1} / {visible.length}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-canvas hover:bg-canvas/10"
            >
              <Icon name="X" className="size-5" />
            </button>
          </div>

          {/* Keyed on slug so stepping through photographs cross-fades each
              one rather than swapping the src underneath a static frame. */}
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-4 min-h-0 flex-1"
          >
            <SafeImage
              photo={active}
              sizes="100vw"
              className="object-contain"
            />
          </motion.div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photograph"
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-canvas hover:bg-canvas/10"
            >
              <Icon name="ArrowRight" className="size-5 rotate-180" />
            </button>
            <p className="text-center text-sm text-canvas">{active.caption}</p>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photograph"
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-canvas hover:bg-canvas/10"
            >
              <Icon name="ArrowRight" className="size-5" />
            </button>
          </div>
        </LightboxShell>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * The lightbox surface, split out purely so it can call `useIsPresent`.
 *
 * An exit animation is rAF-driven, so if the tab is backgrounded mid-close the
 * fade stalls and the element stays mounted. A stalled `role="dialog"` with
 * `aria-modal="true"` still sitting in the DOM would hide the rest of the page
 * from assistive technology — closing used to be instant, so this would be a
 * regression. `inert` drops it out of the accessibility tree and blocks
 * interaction the moment React starts removing it, however long the fade takes.
 */
function LightboxShell({
  children,
  label,
  dialogRef,
}: {
  children: ReactNode;
  label: string;
  dialogRef: RefObject<HTMLDivElement | null>;
}) {
  const isPresent = useIsPresent();

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      inert={!isPresent}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed inset-0 z-100 flex flex-col bg-ink/95 p-4 backdrop-blur-sm sm:p-8"
    >
      {children}
    </motion.div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-11 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors duration-200",
        active
          ? "border-primary bg-primary text-on-primary"
          : "border-hairline text-body hover:bg-surface-soft",
      )}
    >
      {label}
    </button>
  );
}
