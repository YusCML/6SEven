import type { Hotspot } from '../data';

const palettes = {
  Landmark: ['#0f172a', '#334155'],
  'Transit Hub': ['#0f172a', '#334155'],
  Food: ['#f59e0b', '#ea580c'],
  'Study Spot': ['#059669', '#0d9488'],
} as const;

/*
 * Stand-in cover art. Real photos have not been supplied for these places yet,
 * so each card draws a generated panel instead of borrowing an unrelated image.
 */
export default function HotspotCover({ hotspot, height }: { hotspot: Hotspot; height: number }) {
  const [from, to] = palettes[hotspot.category];
  const gradientId = `hotspot-${hotspot.id}`;

  return (
    <svg
      viewBox={`0 0 400 ${height}`}
      className="block h-auto w-full"
      role="img"
      aria-label={`${hotspot.title} — photo not yet added`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>

      <rect width="400" height={height} fill={`url(#${gradientId})`} />

      <g fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.5">
        <circle cx="330" cy={height - 40} r="70" />
        <circle cx="330" cy={height - 40} r="110" />
        <path d={`M0 ${height * 0.62} L120 ${height * 0.44} L240 ${height * 0.68} L400 ${height * 0.36}`} />
      </g>

      <g transform={`translate(24 ${height - 34})`} fill="#ffffff">
        <path
          d="M8 0C3.6 0 0 3.6 0 8c0 5.8 8 14 8 14s8-8.2 8-14c0-4.4-3.6-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
          fillOpacity="0.9"
        />
      </g>

      <text
        x="48"
        y={height - 18}
        fill="#ffffff"
        fontSize="15"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        {hotspot.title}
      </text>
    </svg>
  );
}
