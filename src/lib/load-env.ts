import { readFileSync } from "node:fs";

// Učitava .env.local u process.env za alate koji ne rade kroz Next
// (drizzle-kit CLI, seed skripta). Next aplikacija sama učitava .env.local.
export function loadEnvLocal(path = ".env.local") {
  try {
    const content = readFileSync(path, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const m = trimmed.match(/^([\w.-]+)\s*=\s*(.*)$/);
      if (!m) continue;
      const key = m[1];
      const val = m[2].trim().replace(/^["']|["']$/g, "");
      // Prazne vrednosti (placeholder linije) preskačemo; poslednja prava pobeđuje.
      if (val !== "") process.env[key] = val;
    }
  } catch {
    // .env.local ne postoji — oslanjamo se na postojeći process.env
  }
}
