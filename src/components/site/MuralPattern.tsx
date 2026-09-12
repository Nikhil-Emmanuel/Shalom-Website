/**
 * A faint tiled mural behind the header-the sort of line art painted on the
 * walls of a children's home: a house, a kite, birds, a sun, a book, a ball.
 *
 * Decorative and aria-hidden. Kept very low contrast so it reads as texture
 * rather than decoration competing with the wordmark, and so nav text keeps
 * well clear of the 4.5:1 contrast floor.
 */
export function MuralPattern({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="mural"
          width="150"
          height="72"
          patternUnits="userSpaceOnUse"
        >
          <g
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            {/* house */}
            <path d="M8 40 V26 L18 18 L28 26 V40 Z" />
            <path d="M15 40 V32 h6 v8" />

            {/* sun */}
            <circle cx="52" cy="24" r="5" />
            <path d="M52 13 v3 M52 32 v3 M41 24 h3 M60 24 h3 M44.5 16.5 l2 2 M57.5 29.5 l2 2 M59.5 16.5 l-2 2 M46.5 29.5 l-2 2" />

            {/* open book */}
            <path d="M78 44 c 6 -5, 12 -5, 16 0 c 4 -5, 10 -5, 16 0" />
            <path d="M78 44 V32 c 6 -5, 12 -5, 16 0 V44 M94 32 c 4 -5, 10 -5, 16 0 V44" />

            {/* birds */}
            <path d="M120 20 c 3 -4, 6 -4, 8 0 c 2 -4, 5 -4, 8 0" />

            {/* kite */}
            <path d="M132 46 l6 8 l-6 8 l-6 -8 Z" />
            <path d="M132 62 c 2 4, -2 6, 0 10" />

            {/* ball */}
            <circle cx="26" cy="60" r="6" />
            <path d="M20 60 c 4 -3, 8 -3, 12 0 M26 54 c -3 4, -3 8, 0 12" />

            {/* star */}
            <path d="M62 56 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mural)" />
    </svg>
  );
}
