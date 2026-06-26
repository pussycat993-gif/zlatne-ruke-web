"use client";

import { useActionState, useEffect, useRef } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { sendMessage, type MsgState } from "@/lib/message-actions";

const initial: MsgState = { ok: false };

export function ReplyForm({ conversationId }: { conversationId: string }) {
  const [state, action, pending] = useActionState(sendMessage, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={action}
      className="sticky bottom-4 mt-6 rounded-2xl border border-line-soft bg-surface p-3 shadow-[var(--zr-shadow-sm)]"
    >
      <input type="hidden" name="conversationId" value={conversationId} />
      <textarea
        name="body"
        required
        rows={2}
        placeholder="Napiši poruku…"
        className="w-full resize-y rounded-xl border border-line bg-cream px-4 py-2.5 text-sm text-pink-dark outline-none placeholder:text-ink-soft focus:border-pink"
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        {state.error ? (
          <span className="text-xs font-medium text-destructive">
            {state.error}
          </span>
        ) : (
          <span />
        )}
        <Button
          type="submit"
          disabled={pending}
          className="h-9 rounded-full px-5 text-sm"
        >
          <Icon name="send" size={16} /> {pending ? "Šaljem…" : "Pošalji"}
        </Button>
      </div>
    </form>
  );
}
