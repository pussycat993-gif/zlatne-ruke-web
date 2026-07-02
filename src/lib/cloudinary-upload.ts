import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "djx2rkfte",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Da li je FormData unos prava (neprazna) datoteka.
export function isUploadableFile(
  value: FormDataEntryValue | null,
): value is File {
  return value instanceof File && value.size > 0;
}

// Otprema sliku na Cloudinary i vraća public_id (koji čuvamo u bazi).
export async function uploadImage(file: File, folder: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder, resource_type: "image" },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Otpremanje slike nije uspelo."));
            return;
          }
          resolve(result.public_id);
        },
      )
      .end(buffer);
  });
}

// Briše slike sa Cloudinary-ja po public_id-u. „Best-effort": nikad ne baca
// grešku — pozivalac (npr. brisanje radnje) je već obavio brisanje iz baze,
// pa neuspeh na Cloudinary strani ne sme da obori celu akciju. Neuspesi se
// samo loguju sa spiskom public id-eva. Cloudinary API dozvoljava najviše
// 100 id-eva po pozivu, pa šaljemo u serijama.
export async function deleteImages(publicIds: string[]): Promise<void> {
  // Ukloni prazne/duplirane vrednosti.
  const ids = Array.from(
    new Set(publicIds.filter((id): id is string => Boolean(id))),
  );
  if (ids.length === 0) return;

  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn(
      `[cloudinary] Preskačem brisanje ${ids.length} slika — nedostaje ` +
        `CLOUDINARY_API_KEY ili CLOUDINARY_API_SECRET.`,
    );
    return;
  }

  const BATCH = 100;
  for (let i = 0; i < ids.length; i += BATCH) {
    const batch = ids.slice(i, i + BATCH);
    try {
      await cloudinary.api.delete_resources(batch, {
        resource_type: "image",
        invalidate: true,
      });
    } catch (error) {
      console.error(
        `[cloudinary] Brisanje slika nije uspelo za: ${batch.join(", ")}`,
        error,
      );
    }
  }
}
