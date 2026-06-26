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
