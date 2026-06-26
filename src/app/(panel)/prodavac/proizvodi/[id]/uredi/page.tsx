import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getProductById } from "@/lib/db/queries";
import { getOrCreateSellerShop } from "@/lib/seller";
import { updateProduct } from "@/lib/seller-actions";
import { ProductForm } from "@/components/panel/product-form";

export const metadata: Metadata = { title: "Izmena proizvoda — Panel prodavca" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, shop] = await Promise.all([
    getProductById(id),
    getCategories(),
    getOrCreateSellerShop(),
  ]);

  // Samo vlasnik radnje sme da menja svoj proizvod.
  if (!product || !shop || product.shopId !== shop.id) notFound();

  return (
    <ProductForm
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      action={updateProduct}
      heading="Izmena proizvoda"
      submitLabel="Sačuvaj izmene"
      initial={{
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice ?? null,
        category: product.category,
        inStock: product.inStock,
        description: product.desc,
        imagePublicId: product.imagePublicId,
      }}
    />
  );
}
