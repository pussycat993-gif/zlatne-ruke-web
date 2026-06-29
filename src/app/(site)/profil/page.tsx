import Link from "next/link";
import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Icon, type IconName } from "@/components/icon";
import { Crumbs } from "@/components/site/crumbs";
import { BecomeSellerButton } from "@/components/site/become-seller-button";
import { getCurrentRole } from "@/lib/auth";
import { getBuyerUnreadCount } from "@/lib/messages";
import { getUnreadNotificationCount } from "@/lib/notifications";

export const metadata: Metadata = {
  title: "Moj profil — Zlatne Ruke",
  robots: { index: false, follow: false },
};

const ROLE_LABEL: Record<string, string> = {
  kupac: "Kupac",
  prodavac: "Prodavac",
  admin: "Administrator",
};

export default async function ProfilePage() {
  const user = await currentUser();
  const role = (await getCurrentRole()) ?? "kupac";
  const name = user?.firstName || user?.username || "draga";
  const [unread, notifUnread] = await Promise.all([
    getBuyerUnreadCount(),
    getUnreadNotificationCount(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 md:px-8">
      <Crumbs items={[{ label: "Početna", href: "/" }, { label: "Profil" }]} />

      <div className="flex flex-wrap items-center gap-4">
        <UserButton />
        <div className="flex-1">
          <h1 className="font-heading text-3xl font-semibold text-foreground">
            Zdravo,{" "}
            <span className="font-script font-normal text-pink">{name}</span>
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-ink">
            <span>{user?.primaryEmailAddress?.emailAddress}</span>
            <span className="rounded-full bg-pink-light px-2.5 py-0.5 text-xs font-semibold text-pink-dark">
              {ROLE_LABEL[role]}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <ProfileCard
          href="/profil/omiljeno"
          icon="heart"
          title="Omiljeno"
          desc="Predmeti koje si sačuvala."
        />

        <ProfileCard
          href="/profil/poruke"
          icon="chat"
          title="Poruke"
          desc="Razgovori sa majstoricama."
          badge={unread}
        />

        <ProfileCard
          href="/profil/pracene"
          icon="flower"
          title="Praćene radnje"
          desc="Radnje koje pratiš."
        />

        <ProfileCard
          href="/profil/obavestenja"
          icon="bell"
          title="Obaveštenja"
          desc="Praćenja, recenzije, poruke."
          badge={notifUnread}
        />

        {(role === "prodavac" || role === "admin") && (
          <ProfileCard
            href="/prodavac"
            icon="package"
            title="Panel prodavca"
            desc="Upravljaj radnjom i proizvodima."
          />
        )}

        {role === "admin" && (
          <ProfileCard
            href="/admin"
            icon="shield"
            title="Admin panel"
            desc="Moderacija i pregled platforme."
          />
        )}

        {role === "kupac" && (
          <div className="rounded-2xl border border-line-soft bg-cream p-6">
            <span className="flex size-11 items-center justify-center rounded-full bg-surface text-pink-dark">
              <Icon name="package" size={20} />
            </span>
            <h2 className="mt-3 font-heading text-lg font-semibold text-foreground">
              Postani prodavac
            </h2>
            <p className="mt-1 text-sm text-ink">
              Otvori svoju radnju i prodaj rukotvorine na celu Srbiju.
            </p>
            <div className="mt-4">
              <BecomeSellerButton className="h-10 rounded-full px-5 text-sm">
                Otvori radnju
              </BecomeSellerButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileCard({
  href,
  icon,
  title,
  desc,
  badge,
}: {
  href: string;
  icon: IconName;
  title: string;
  desc: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-line-soft bg-surface p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--zr-shadow-sm)]"
    >
      <span className="relative flex size-11 items-center justify-center rounded-full bg-pink-light text-pink-dark">
        <Icon name={icon} size={20} />
        {badge ? (
          <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-pink px-1.5 text-[0.65rem] font-bold text-primary-foreground">
            {badge}
          </span>
        ) : null}
      </span>
      <h2 className="mt-3 font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-pink-dark">
        {title}
      </h2>
      <p className="mt-1 text-sm text-ink">{desc}</p>
    </Link>
  );
}
