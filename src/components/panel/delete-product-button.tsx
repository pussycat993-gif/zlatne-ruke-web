"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/icon";
import { deleteProduct } from "@/lib/seller-actions";

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    if (
      !window.confirm(`Obrisati proizvod „${productName}"? Ovo se ne može vratiti.`)
    ) {
      return;
    }
    startTransition(async () => {
      const res = await deleteProduct(productId);
      if (!res.ok) setError(res.error ?? "Brisanje nije uspelo.");
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      title={error ?? "Obriši proizvod"}
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-destructive hover:text-destructive disabled:opacity-60"
    >
      <Icon name="trash" size={13} /> Obriši
    </button>
  );
}
