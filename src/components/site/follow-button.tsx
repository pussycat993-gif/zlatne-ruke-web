"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { toggleFollow } from "@/lib/social-actions";

// Praćenje radnje - upisuje u bazu za ulogovanog korisnika.
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
    <Button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={following}
      variant={following ? "outline" : "default"}
      className={className}
    >
      <Icon name={following ? "check" : "plus"} size={16} />
      {following ? "Pratiš" : "Prati radnju"}
    </Button>
  );
}
