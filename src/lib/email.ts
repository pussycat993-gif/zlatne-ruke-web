import "server-only";
import { Resend } from "resend";
import { SITE_URL } from "./site";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM ?? "Zlatne Ruke <onboarding@resend.dev>";
const resend = apiKey ? new Resend(apiKey) : null;

// Obaveštava primaoca o novoj poruci. Nikad ne baca grešku (email ne sme da
// prekine slanje poruke); ako RESEND_API_KEY nije podešen, tiho preskače.
export async function sendNewMessageEmail(opts: {
  to: string;
  senderName: string;
  conversationId: string;
  recipientRole: "buyer" | "seller";
  preview: string;
}) {
  if (!resend) return;

  const path =
    opts.recipientRole === "seller"
      ? `/prodavac/poruke/${opts.conversationId}`
      : `/profil/poruke/${opts.conversationId}`;
  const url = `${SITE_URL}${path}`;

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;color:#3a2c30">
      <h2 style="color:#A0445A;margin:0 0 12px">Nova poruka na Zlatnim Rukama</h2>
      <p style="margin:0 0 8px"><strong>${opts.senderName}</strong> ti je poslao/la poruku:</p>
      <blockquote style="margin:0 0 16px;padding:12px 16px;background:#FDF6F0;border-radius:12px;color:#7A6068">
        ${opts.preview.replace(/[<>&]/g, "")}
      </blockquote>
      <a href="${url}" style="display:inline-block;background:#C0637A;color:#fff;text-decoration:none;padding:10px 20px;border-radius:999px;font-weight:600">
        Otvori razgovor
      </a>
    </div>
  `;

  try {
    await resend.emails.send({
      from,
      to: opts.to,
      subject: `Nova poruka od ${opts.senderName} — Zlatne Ruke`,
      html,
    });
  } catch (e) {
    console.error("Slanje email obaveštenja nije uspelo:", e);
  }
}
