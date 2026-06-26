"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "./db";
import { products, shops } from "./db/schema";
import { getOrCreateSellerShop } from "./seller";
import { uploadImage, isUploadableFile } from "./cloudinary-upload";

export type FormState = { ok: boolean; error?: string };

// Pretvara ulogovanog kupca u prodavca (postavlja publicMetadata.role) i vodi
// ga u panel. Neulogovani se šalju na registraciju.
export async function becomeSeller() {
  const { userId } = await auth();
  if (!userId) redirect("/register");

  const client = await clerkClient();
  await client.users.updateUser(userId, {
    publicMetadata: { role: "prodavac" },
  });

  redirect("/prodavac/radnja");
}

// Čuva izmene profila radnje ulogovanog prodavca.
export async function updateSellerShop(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Niste prijavljeni." };

  // Osiguraj da radnja postoji (lazy create za prvi put).
  const shop = await getOrCreateSellerShop();
  if (!shop) return { ok: false, error: "Radnja nije pronađena." };

  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const owner = String(formData.get("owner") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  if (!name) return { ok: false, error: "Naziv radnje je obavezan." };

  const coverFile = formData.get("cover");
  let coverPublicId: string | undefined;
  try {
    if (isUploadableFile(coverFile)) {
      coverPublicId = await uploadImage(coverFile, "zlatne-ruke/radnje");
    }
  } catch {
    return { ok: false, error: "Otpremanje slike nije uspelo." };
  }

  await db
    .update(shops)
    .set({
      name,
      city,
      owner,
      category,
      bio,
      ...(coverPublicId ? { coverPublicId } : {}),
    })
    .where(eq(shops.ownerId, userId));

  revalidatePath("/prodavac");
  revalidatePath("/prodavac/radnja");
  revalidatePath(`/radnja/${shop.id}`);
  revalidatePath("/radnje");
  revalidatePath("/");
  return { ok: true };
}

// Dodaje nov proizvod u radnju ulogovanog prodavca, pa vodi na listu proizvoda.
export async function createProduct(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Niste prijavljeni." };

  const shop = await getOrCreateSellerShop();
  if (!shop) return { ok: false, error: "Radnja nije pronađena." };

  const name = String(formData.get("name") ?? "").trim();
  const price = Number(String(formData.get("price") ?? "").trim());
  const category = String(formData.get("category") ?? "").trim();
  const oldPriceRaw = String(formData.get("oldPrice") ?? "").trim();
  const oldPrice = oldPriceRaw ? Number(oldPriceRaw) : null;
  const inStock = Number(String(formData.get("inStock") ?? "0").trim()) || 0;
  const description = String(formData.get("description") ?? "").trim();

  if (!name) return { ok: false, error: "Naziv proizvoda je obavezan." };
  if (!price || price <= 0) return { ok: false, error: "Unesi ispravnu cenu." };
  if (!category) return { ok: false, error: "Izaberi kategoriju." };

  const imageFile = formData.get("image");
  let imagePublicId: string | null = null;
  try {
    if (isUploadableFile(imageFile)) {
      imagePublicId = await uploadImage(imageFile, "zlatne-ruke/proizvodi");
    }
  } catch {
    return { ok: false, error: "Otpremanje slike nije uspelo." };
  }

  await db.insert(products).values({
    shopId: shop.id,
    name,
    price,
    oldPrice,
    category,
    tone: "v3",
    rating: 0,
    reviewCount: 0,
    inStock,
    description,
    imagePublicId,
  });

  revalidatePath("/prodavac/proizvodi");
  revalidatePath("/katalog");
  revalidatePath(`/radnja/${shop.id}`);
  revalidatePath("/radnje");
  revalidatePath("/");
  redirect("/prodavac/proizvodi");
}

// Menja postojeći proizvod (samo ako pripada radnji ulogovanog prodavca).
export async function updateProduct(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Niste prijavljeni." };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, error: "Nedostaje proizvod." };

  const shop = await getOrCreateSellerShop();
  if (!shop) return { ok: false, error: "Radnja nije pronađena." };

  const [owned] = await db
    .select({ shopId: products.shopId })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  if (!owned || owned.shopId !== shop.id) {
    return { ok: false, error: "Nemate pristup ovom proizvodu." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const price = Number(String(formData.get("price") ?? "").trim());
  const category = String(formData.get("category") ?? "").trim();
  const oldPriceRaw = String(formData.get("oldPrice") ?? "").trim();
  const oldPrice = oldPriceRaw ? Number(oldPriceRaw) : null;
  const inStock = Number(String(formData.get("inStock") ?? "0").trim()) || 0;
  const description = String(formData.get("description") ?? "").trim();

  if (!name) return { ok: false, error: "Naziv proizvoda je obavezan." };
  if (!price || price <= 0) return { ok: false, error: "Unesi ispravnu cenu." };
  if (!category) return { ok: false, error: "Izaberi kategoriju." };

  const imageFile = formData.get("image");
  let newImage: string | undefined;
  try {
    if (isUploadableFile(imageFile)) {
      newImage = await uploadImage(imageFile, "zlatne-ruke/proizvodi");
    }
  } catch {
    return { ok: false, error: "Otpremanje slike nije uspelo." };
  }

  await db
    .update(products)
    .set({
      name,
      price,
      oldPrice,
      category,
      inStock,
      description,
      ...(newImage ? { imagePublicId: newImage } : {}),
    })
    .where(eq(products.id, id));

  revalidatePath("/prodavac/proizvodi");
  revalidatePath("/katalog");
  revalidatePath(`/proizvod/${id}`);
  revalidatePath(`/radnja/${shop.id}`);
  redirect("/prodavac/proizvodi");
}

// Briše proizvod (samo ako pripada radnji ulogovanog prodavca).
export async function deleteProduct(
  productId: string,
): Promise<{ ok: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Niste prijavljeni." };

  const shop = await getOrCreateSellerShop();
  if (!shop) return { ok: false, error: "Radnja nije pronađena." };

  const [owned] = await db
    .select({ shopId: products.shopId })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);
  if (!owned || owned.shopId !== shop.id) {
    return { ok: false, error: "Nemate pristup ovom proizvodu." };
  }

  await db.delete(products).where(eq(products.id, productId));

  revalidatePath("/prodavac/proizvodi");
  revalidatePath("/katalog");
  revalidatePath(`/radnja/${shop.id}`);
  revalidatePath("/");
  return { ok: true };
}
