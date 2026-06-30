import { cn } from "@/lib/utils";

// Organski "blob" avatar sa inicijalom (umesto kvadratnog placeholdera).
const SHAPES = [
  "45% 55% 50% 50% / 60% 50% 50% 40%",
  "60% 40% 45% 55% / 50% 60% 40% 50%",
  "50% 50% 60% 40% / 45% 55% 45% 55%",
  "40% 60% 50% 50% / 55% 45% 55% 45%",
];

export function Blob({
  initial,
  size = 40,
  seed = 0,
  className,
}: {
  initial?: string;
  size?: number;
  seed?: number;
  className?: string;
}) {
  const shape = SHAPES[Math.abs(seed) % SHAPES.length];
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, borderRadius: shape }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-pink-light text-sm font-bold uppercase text-pink-dark",
        className,
      )}
    >
      {initial}
    </span>
  );
}
