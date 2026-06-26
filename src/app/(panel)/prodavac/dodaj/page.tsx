import type { Metadata } from "next";
import { getCategories } from "@/lib/db/queries";
import { getOrCreateSellerShop } from "@/lib/seller";
import { createProduct } from "@/lib/seller-actions";
import { ProductForm } from "@/components/panel/product-form";

export const metadata: Metadata = { title: "Novi proizvod — Panel prodavca" };

export default async function AddProductPage() {
  // Osiguraj da prodavac ima radnju pre dodavanja proizvoda.
  const [, categories] = await Promise.all([
    getOrCreateSellerShop(),
    getCategories(),
  ]);

  return (
    <ProductForm
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      action={createProduct}
      heading="Novi proizvod"
      submitLabel="Objavi proizvod"
    />
  );
}
