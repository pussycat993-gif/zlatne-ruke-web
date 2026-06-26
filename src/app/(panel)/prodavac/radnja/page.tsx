import type { Metadata } from "next";
import { getCategories } from "@/lib/db/queries";
import { getOrCreateSellerShop } from "@/lib/seller";
import { ShopProfileForm } from "./shop-profile-form";

export const metadata: Metadata = { title: "Profil radnje — Panel prodavca" };

export default async function ShopProfilePage() {
  const [shop, categories] = await Promise.all([
    getOrCreateSellerShop(),
    getCategories(),
  ]);

  if (!shop) {
    return <p className="text-ink">Radnja trenutno nije dostupna.</p>;
  }

  return (
    <ShopProfileForm
      shop={{
        name: shop.name,
        city: shop.city,
        owner: shop.owner,
        category: shop.category,
        bio: shop.bio,
        tone: shop.tone,
        coverPublicId: shop.coverPublicId,
      }}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}
