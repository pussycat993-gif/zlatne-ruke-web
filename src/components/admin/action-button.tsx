"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-pink text-primary-foreground hover:bg-pink-dark",
  outline: "border border-line text-pink-dark hover:bg-pink-light",
  ghost: "text-ink hover:bg-pink-light hover:text-pink-dark",
};

// Dugme koje poziva server akciju, traži potvrdu (opciono), pokazuje toast
// i osvežava stranicu. Server akcija se prosleđuje već vezana za id.
export function ActionButton({
  action,
  confirm,
  icon,
  variant = "ghost",
  success,
  children,
}: {
  action: () => Promise<{ ok: boolean; error?: string }>;
  confirm?: string;
  icon?: IconName;
  variant?: Variant;
  success?: string;
  children: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function onClick() {
    if (confirm && !window.confirm(confirm)) return;
    startTransition(async () => {
      const res = await action();
      if (res.ok) {
        toast.success(success ?? "Urađeno.");
        router.refresh();
      } else {
        toast.error(res.error ?? "Došlo je do greške.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
        VARIANTS[variant],
      )}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
    </button>
  );
}
