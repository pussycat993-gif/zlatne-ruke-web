import Link from "next/link";
import Image from "next/image";
import type { ComponentProps } from "react";
import type { MDXComponents } from "mdx/types";

// Brendirane MDX komponente. Interni linkovi idu kroz next/link,
// eksterni se otvaraju u novom tabu; slike kroz next/image.
export const mdxComponents: MDXComponents = {
  a: ({ href = "", children, ...props }: ComponentProps<"a">) => {
    const target = typeof href === "string" ? href : "";
    const isInternal = target.startsWith("/") || target.startsWith("#");
    if (isInternal) {
      return (
        <Link href={target} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={target} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
  img: ({ src = "", alt = "" }: ComponentProps<"img">) => (
    <Image
      src={typeof src === "string" ? src : ""}
      alt={alt}
      width={1200}
      height={675}
      className="rounded-2xl"
    />
  ),
};
