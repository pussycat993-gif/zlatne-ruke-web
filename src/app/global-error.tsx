"use client";

// Hvata greške u samom root layout-u. Mora da renderuje <html>/<body> i ne
// oslanja se na globalni CSS (možda nije učitan) - koristi inline stilove.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="sr">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          background: "#FDF6F0",
          color: "#3a2c30",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
          margin: 0,
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: "1.75rem", margin: 0, color: "#A0445A" }}>
            Nešto je pošlo naopako
          </h1>
          <p style={{ marginTop: "0.75rem", color: "#7A6068" }}>
            Došlo je do neočekivane greške. Osveži stranicu i pokušaj ponovo.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: "1.5rem",
              border: "none",
              borderRadius: 999,
              background: "#C0637A",
              color: "#fff",
              padding: "0.7rem 1.6rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Pokušaj ponovo
          </button>
        </div>
      </body>
    </html>
  );
}
