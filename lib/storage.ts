import "server-only";
import { randomUUID } from "node:crypto";
import { getBucket } from "@/lib/firebase-admin";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export async function uploadQrisImage(file: File, accountId?: string) {
  if (!(file instanceof File) || file.size === 0) return { url: null, path: null };
  if (file.size > MAX_FILE_SIZE) throw new Error("Ukuran gambar QRIS maksimal 5MB.");
  if (!ALLOWED_TYPES.has(file.type)) throw new Error("Format file barcode harus JPG, PNG, atau WebP.");

  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `qris/${accountId ?? "new"}/${Date.now()}-${randomUUID()}.${extension}`;
  const token = randomUUID();
  const bucket = getBucket();
  const object = bucket.file(path);
  const buffer = Buffer.from(await file.arrayBuffer());
  await object.save(buffer, {
    resumable: false,
    contentType: file.type,
    metadata: {
      cacheControl: "public, max-age=31536000, immutable",
      metadata: { firebaseStorageDownloadTokens: token }
    }
  });

  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
  return { url, path };
}

export async function deleteStorageObject(path?: string | null) {
  if (!path) return;
  try {
    await getBucket().file(path).delete({ ignoreNotFound: true });
  } catch (error) {
    console.error("Gagal menghapus file QRIS lama:", error);
  }
}
