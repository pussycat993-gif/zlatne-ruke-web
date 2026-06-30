import type { Metadata } from "next";
import { PageHead } from "@/components/admin/page-head";
import { ShopsTable } from "@/components/admin/shops-table";
import { getAdminShops } from "@/lib/db/admin";

export const metadata: Metadata = { title: "Radnje — Admin" };

export default async function AdminShopsPage() {
  const shops = await getAdminShops();

  return (
    <>
      <PageHead eyebrow={`${shops.length} radnji`} title="Radnje" />
      <ShopsTable shops={shops} />
    </>
  );
}
