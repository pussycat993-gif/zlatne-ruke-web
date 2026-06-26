"use server";

import { sendContactEmail } from "./email";

export type ContactState = { ok: boolean; error?: string };

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name) return { ok: false, error: "Unesi ime." };
  if (!email || !email.includes("@"))
    return { ok: false, error: "Unesi ispravan email." };
  if (!message) return { ok: false, error: "Napiši poruku." };

  await sendContactEmail({ name, email, message });
  // Potvrđujemo prijem bez obzira na isporuku emaila (npr. ako Resend nije podešen).
  return { ok: true };
}
