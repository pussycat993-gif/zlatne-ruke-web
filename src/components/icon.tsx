import type { SVGProps } from "react";

// Zlatne Ruke — custom thin-line icon set (ported from the design prototype).
// Pure SVG, no emoji. Safe to render on the server.
const PATHS = {
  home: (
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.5-4.5" />
    </>
  ),
  bag: (
    <>
      <path d="M6 7h12l-1 13H7L6 7z" />
      <path d="M9 7a3 3 0 016 0" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15L6 16z" />
      <path d="M10 20a2 2 0 004 0" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="9" r="3.5" />
      <path d="M5 20a7 7 0 0114 0" />
    </>
  ),
  heart: <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" />,
  star: <path d="M12 3l2.6 5.5 6 .9-4.4 4.2 1 6-5.2-2.8-5.2 2.8 1-6L3.4 9.4l6-.9z" />,
  chat: <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2h-7l-4 3v-3H6a2 2 0 01-2-2z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  back: <path d="M15 5l-7 7 7 7" />,
  forward: <path d="M9 5l7 7-7 7" />,
  close: <path d="M6 6l12 12M6 18L18 6" />,
  check: <path d="M5 12l5 5 9-11" />,
  filter: <path d="M3 5h18M6 12h12M10 19h4" />,
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  list: <path d="M4 6h16M4 12h16M4 18h16" />,
  edit: <path d="M16 4l4 4-12 12H4v-4z" />,
  trash: <path d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M7 7l1 13h8l1-13" />,
  location: (
    <>
      <path d="M12 21s-7-7.5-7-12a7 7 0 0114 0c0 4.5-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  phone: <path d="M5 5l4-1 2 5-2.5 1.5a11 11 0 005 5L15 13l5 2-1 4a2 2 0 01-2 2A14 14 0 013 7a2 2 0 012-2z" />,
  share: (
    <>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.5 11l7-4M8.5 13l7 4" />
    </>
  ),
  camera: (
    <>
      <path d="M4 7h3l2-2h6l2 2h3v12H4z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M3 17l5-5 5 5 3-3 5 5" />
    </>
  ),
  send: <path d="M21 4L3 11l7 2 2 7z" />,
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  chevron: <path d="M9 6l6 6-6 6" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  sparkle: (
    <>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
      <path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
    </>
  ),
  flower: (
    <>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 4a3 3 0 010 6M20 12a3 3 0 01-6 0M12 14a3 3 0 010 6M4 12a3 3 0 016 0" />
    </>
  ),
  package: <path d="M3 7l9 5 9-5M3 7v10l9 5 9-5V7M3 7l9-4 9 4M12 12v10" />,
  truck: (
    <>
      <rect x="2" y="7" width="13" height="9" rx="1" />
      <path d="M15 10h4l3 3v3h-7" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12V4h8l10 10-8 8z" />
      <circle cx="8" cy="8" r="1.4" fill="currentColor" />
    </>
  ),
  paint: (
    <>
      <path d="M19 11l-9 9-3-3 9-9z" />
      <path d="M14 6l4 4M5 19l-2 2M16 4l4 4-2 2-4-4z" />
    </>
  ),
  shield: <path d="M12 3l8 3v6c0 5-4 9-8 9s-8-4-8-9V6z" />,
  chart: <path d="M3 20h18M6 17v-7M11 17v-10M16 17v-4" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v.5M12 11v5" />
    </>
  ),
  quote: <path d="M7 8h3v6H4v-3a3 3 0 013-3zM17 8h3v6h-6v-3a3 3 0 013-3z" />,
  refresh: (
    <>
      <path d="M4 12a8 8 0 0114-5l2-2v6h-6" />
      <path d="M20 12a8 8 0 01-14 5l-2 2v-6h6" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14a8 8 0 01-9.8-9.8 8 8 0 109.8 9.8z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
    </>
  ),
} as const;

export type IconName = keyof typeof PATHS;

type IconProps = {
  name: IconName;
  size?: number;
  /** Set to fill the shape (e.g. a filled heart/star) with currentColor. */
  filled?: boolean;
} & Omit<SVGProps<SVGSVGElement>, "name">;

export function Icon({
  name,
  size = 20,
  filled = false,
  strokeWidth = 1.7,
  ...rest
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
