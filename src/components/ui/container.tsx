import { cn } from "@/lib/utils";

// Jedinstveni layout kontejner — ista maksimalna širina i bočni razmaci svuda,
// pa se levi rub svega (logo, naslovi, tekst, kartice, footer) poklapa.
export function Container({
  className,
  as: Tag = "div",
  children,
}: {
  className?: string;
  as?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-7xl px-4 md:px-8", className)}>
      {children}
    </Tag>
  );
}
