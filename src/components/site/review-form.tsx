"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { createReview, type ReviewState } from "@/lib/review-actions";

const initial: ReviewState = { ok: false };

export function ReviewForm({ productId }: { productId: string }) {
  const [state, action, pending] = useActionState(createReview, initial);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setRating(0);
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={action}
      className="rounded-2xl border border-line-soft bg-surface p-5"
    >
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating} />

      <h3 className="font-heading text-lg font-semibold text-foreground">
        Napiši recenziju
      </h3>

      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} zvezdica`}
            className="text-pink"
          >
            <Icon name="star" size={26} filled={n <= (hover || rating)} />
          </button>
        ))}
      </div>

      <textarea
        name="text"
        rows={3}
        placeholder="Kako ti se dopao proizvod?"
        className="mt-3 w-full resize-y rounded-xl border border-line bg-cream px-4 py-2.5 text-sm text-pink-dark outline-none placeholder:text-ink-soft focus:border-pink"
      />

      {state.ok && (
        <p className="mt-2 text-sm font-medium text-pink-dark">
          Hvala! Recenzija je objavljena.
        </p>
      )}
      {state.error && (
        <p className="mt-2 text-sm font-medium text-destructive">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="mt-4 h-10 rounded-full px-6 text-sm"
      >
        {pending ? "Objavljujem…" : "Objavi recenziju"}
      </Button>
    </form>
  );
}
