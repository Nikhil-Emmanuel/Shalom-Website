/**
 * A small child flying a kite, drifting slowly behind the hero copy.
 *
 * Decorative only — aria-hidden, non-interactive, and kept at low opacity so it
 * never competes with the headline or hurts text contrast. Line art rather than
 * a cartoon: the site is asking adults for money on behalf of real children,
 * and cutesy illustration would undercut that.
 *
 * The loop is pure CSS, so it costs no JavaScript and no animation frames. It
 * stops entirely under prefers-reduced-motion — a continuously moving element
 * in the periphery is exactly what that setting exists to prevent.
 */
export function HeroMotif() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-4 -z-10 hidden h-40 select-none overflow-hidden sm:block"
    >
      <svg
        viewBox="0 0 240 200"
        fill="none"
        className="motif-drift h-full w-auto text-primary/20"
      >
        {/* kite string */}
        <path
          d="M62 128 C 84 118, 104 96, 122 66"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="3 4"
          className="motif-sway"
        />

        <g className="motif-sway">
          {/* kite */}
          <path
            d="M122 44 L136 66 L122 88 L108 66 Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M122 44 V88 M108 66 H136" stroke="currentColor" strokeWidth="1" />
          {/* tail */}
          <path
            d="M122 88 C 126 96, 118 102, 122 110 C 126 118, 118 124, 122 132"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>

        {/* child: head, body, raised arm holding the string, walking legs */}
        <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="46" cy="146" r="6.5" />
          <path d="M46 153 V171" />
          <path d="M46 158 L62 128" />
          <path d="M46 158 L36 170" />
          <path d="M46 171 L38 188" />
          <path d="M46 171 L55 187" />
        </g>
      </svg>
    </div>
  );
}
