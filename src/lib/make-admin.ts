import { loadEnvLocal } from "./load-env";

// Postavlja publicMetadata.role = "admin" za dati email (ili ADMIN_EMAIL).
// Pokretanje:
//   NODE_OPTIONS=--use-system-ca npx tsx src/lib/make-admin.ts [email]
// Bez argumenta koristi ADMIN_EMAIL iz .env.local.
async function main() {
  loadEnvLocal();

  const target = (process.argv[2] ?? process.env.ADMIN_EMAIL ?? "")
    .trim()
    .toLowerCase();

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) throw new Error("Nema CLERK_SECRET_KEY u .env.local");

  const { createClerkClient } = await import("@clerk/backend");
  const clerk = createClerkClient({ secretKey });

  // Izlistaj sve naloge da vidimo ko je registrovan.
  const all = await clerk.users.getUserList({ limit: 100 });
  console.log(`\nRegistrovani nalozi (${all.totalCount}):`);
  for (const u of all.data) {
    const email = u.primaryEmailAddress?.emailAddress ?? "(bez mejla)";
    const role = (u.publicMetadata?.role as string) ?? "—";
    console.log(`  • ${email}   role=${role}   id=${u.id}`);
  }

  if (!target) {
    console.log("\nNije zadat ciljni email i nema ADMIN_EMAIL. Kraj.");
    process.exit(0);
  }

  const user = all.data.find(
    (u) => u.primaryEmailAddress?.emailAddress?.toLowerCase() === target,
  );
  if (!user) {
    console.log(
      `\n⚠ Nije nađen nalog sa mejlom „${target}". Verovatno se još nisi prijavila tim mejlom, ili je primarni mejl drugačiji.`,
    );
    process.exit(1);
  }

  await clerk.users.updateUser(user.id, {
    publicMetadata: { ...(user.publicMetadata ?? {}), role: "admin" },
  });
  console.log(`\n✓ „${target}" je sada admin (role=admin). Osveži sajt.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Greška:", err?.message ?? err);
  process.exit(1);
});
