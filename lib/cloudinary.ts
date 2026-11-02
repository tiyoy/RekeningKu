import "server-only";
import { createHash, randomUUID } from "node:crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

function getCloudinaryConfig(): CloudinaryConfig {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Konfigurasi Cloudinary belum lengkap. Periksa CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, dan CLOUDINARY_API_SECRET.");
  }

  return { cloudName, apiKey, apiSecret };
}

function createSignature(params: Record<string, string>, apiSecret: string) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== "" && value !== undefined && value !== null)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

function getFileExtension(contentType: string) {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}

export async function uploadQrisImage(file: File, accountId?: string) {
  if (!(file instanceof File) || file.size === 0) return { url: null, publicId: null };
  if (file.size > MAX_FILE_SIZE) throw new Error("Ukuran gambar QRIS maksimal 5MB.");
  if (!ALLOWED_TYPES.has(file.type)) throw new Error("Format file barcode harus JPG, PNG, atau WebP.");

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const extension = getFileExtension(file.type);
  const publicId = `rekeningku/qris/${accountId ?? "new"}/${Date.now()}-${randomUUID()}`;
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = createSignature({ public_id: publicId, timestamp }, apiSecret);

  const body = new FormData();
  body.set("file", new Blob([await file.arrayBuffer()], { type: file.type }), `qris.${extension}`);
  body.set("api_key", apiKey);
  body.set("timestamp", timestamp);
  body.set("public_id", publicId);
  body.set("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
    method: "POST",
    body,
    cache: "no-store"
  });
  const result = await response.json() as { secure_url?: string; public_id?: string; error?: { message?: string } };

  if (!response.ok || !result.secure_url || !result.public_id) {
    console.error("Cloudinary upload failed:", result.error?.message ?? response.statusText);
    throw new Error("Gagal mengunggah gambar QRIS ke Cloudinary. Periksa konfigurasi Cloudinary dan coba kembali.");
  }

  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteCloudinaryImage(publicId?: string | null) {
  if (!publicId) return;

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = createSignature({ invalidate: "true", public_id: publicId, timestamp }, apiSecret);
  const body = new URLSearchParams({
    public_id: publicId,
    timestamp,
    invalidate: "true",
    api_key: apiKey,
    signature
  });

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/destroy`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store"
  });
  const result = await response.json() as { result?: string; error?: { message?: string } };

  if (!response.ok || (result.result !== "ok" && result.result !== "not found")) {
    console.error("Cloudinary delete failed:", result.error?.message ?? response.statusText);
    throw new Error("Gagal menghapus gambar QRIS dari Cloudinary.");
  }
}

export function isCloudinaryImageUrl(value: string) {
  try {
    const url = new URL(value);
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com" && Boolean(cloudName) && url.pathname.startsWith(`/${cloudName}/image/upload/`);
  } catch {
    return false;
  }
}
