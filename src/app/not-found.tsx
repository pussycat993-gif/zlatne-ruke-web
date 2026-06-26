import { Logo } from "@/components/site/logo";
import { NotFoundContent } from "@/components/site/not-found-content";

// Globalni 404 (za adrese koje ne pripadaju nijednoj ruti). Bez pune
// navigacije — samo logo na vrhu i poruka.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line-soft px-4 py-4 md:px-8">
        <Logo />
      </header>
      <main className="flex flex-1 items-center">
        <NotFoundContent />
      </main>
    </div>
  );
}
