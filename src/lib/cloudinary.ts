// Cloudinary delivery URL iz public id-a (cloud: djx2rkfte).
// f_auto + q_auto = automatski format/kvalitet; w_ = širina za responsivnost.
const CLOUD_NAME = "djx2rkfte";

export function cloudinaryUrl(
  publicId: string,
  { width = 1200 }: { width?: number } = {},
): string {
  const transforms = `f_auto,q_auto,w_${width}`;
  const id = publicId.replace(/^\/+/, "");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${id}`;
}
