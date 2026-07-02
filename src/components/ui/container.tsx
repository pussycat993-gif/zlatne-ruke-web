import { cn } from "@/lib/utils";

// Jedinstveni layout kontejner — isti bočni razmaci (gutter) svuda, pa se levi
// rub svega (logo, naslovi, tekst, kartice, footer) poklapa.
//
// Varijante širine:
//   - "default" → centrirano na max-w-7xl (marketing/site stranice)
//   - "fluid"   → puna raspoloživa širina bez ograničenja (paneli, npr. admin),
//                 sadržaj počinje na levom gutteru i rasteže se do desnog.
const SIZES = {
  default: "max-w-7xl",
  fluid: "max-w-none",
} as const;

export function Container({
  className,
  as: Tag = "div",
  size = "default",
  children,
}: {
  className?: string;
  as?: React.ElementType;
  size?: keyof typeof SIZES;
  children: React.ReactNode;
}) {
  return (
    <Tag className={cn("mx-auto w-full px-4 md:px-8", SIZES[size], className)}>
      {children}
    </Tag>
  );
}
