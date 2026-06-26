"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { toggleFollow } from "@/lib/social-actions";
import { cn } from "@/lib/utils";

// Praćenje radnje — upisuje u bazu za ulogovanog korisnika.
export function FollowButton({
  shopId,
  initialFollowing = false,
  className,
}: {
  shopId: string;
  initialFollowing?: boolean;
  className?: string;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onClick() {
    startTransition(async () => {
      const res = await toggleFollow(shopId);
      if (res.needsAuth) {
        router.push("/login");
        return;
      }
      if (res.ok) setFollowing(res.active);
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={following}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60",
        following
          ? "border border-line bg-surface text-pink-dark"
          : "bg-pink text-primary-foreground hover:bg-pink-dark",
        className,
      )}
    >
      <Icon name={following ? "check" : "plus"} size={16} />
      {following ? "Pratiš" : "Prati radnju"}
    </button>
  );
}
