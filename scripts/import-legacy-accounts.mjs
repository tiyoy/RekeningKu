import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Variabel ${name} belum diatur.`);
  return value;
}

function firebaseApp() {
  if (getApps().length) return getApps()[0];
  const projectId = requiredEnv("FIREBASE_PROJECT_ID");
  const clientEmail = requiredEnv("FIREBASE_CLIENT_EMAIL");
  const privateKey = requiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }), projectId });
}

function cloudinarySignature(params, apiSecret) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== "" && value !== undefined && value !== null)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

async function uploadLegacyQris(localPath, publicId, contentType, cloudinary) {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = cloudinarySignature({ overwrite: "true", public_id: publicId, timestamp }, cloudinary.apiSecret);
  const body = new FormData();
  body.set("file", new Blob([readFileSync(localPath)], { type: contentType }), localPath.split(/[\\/]/).pop());
  body.set("api_key", cloudinary.apiKey);
  body.set("timestamp", timestamp);
  body.set("public_id", publicId);
  body.set("overwrite", "true");
  body.set("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudinary.cloudName)}/image/upload`, {
    method: "POST",
    body,
    cache: "no-store"
  });
  const result = await response.json();
  if (!response.ok || !result.secure_url || !result.public_id) {
    throw new Error(`Upload QRIS '${localPath}' gagal: ${result.error?.message ?? response.statusText}`);
  }
  return { url: result.secure_url, publicId: result.public_id };
}

const app = firebaseApp();
const db = getFirestore(app);
const cloudinary = {
  cloudName: requiredEnv("CLOUDINARY_CLOUD_NAME"),
  apiKey: requiredEnv("CLOUDINARY_API_KEY"),
  apiSecret: requiredEnv("CLOUDINARY_API_SECRET")
};
const dataPath = join(process.cwd(), "migration", "legacy-accounts.json");
if (!existsSync(dataPath)) throw new Error("File migration/legacy-accounts.json tidak ditemukan.");
const accounts = JSON.parse(readFileSync(dataPath, "utf8"));

let imported = 0;
let uploadedImages = 0;
for (const account of accounts) {
  let qrisImageUrl = null;
  let qrisPublicId = null;
  if (account.qrisImage) {
    const localPath = join(process.cwd(), "public", "assets", "images", "qris", account.qrisImage);
    if (existsSync(localPath)) {
      const extension = account.qrisImage.toLowerCase().split(".").pop();
      const contentType = extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg";
      const safeFileName = account.qrisImage.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "_");
      const publicId = `rekeningku/qris/${account.id}/legacy-${safeFileName}`;
      const uploaded = await uploadLegacyQris(localPath, publicId, contentType, cloudinary);
      qrisImageUrl = uploaded.url;
      qrisPublicId = uploaded.publicId;
      uploadedImages++;
    } else {
      console.warn(`QRIS image '${account.qrisImage}' tidak ditemukan. Rekening tetap diimpor tanpa gambar.`);
    }
  }

  const { id, qrisImage: _oldImageName, qrisStoragePath: _oldStoragePath, ...fields } = account;
  await db.collection("accounts").doc(String(id)).set({
    ...fields,
    qrisImageUrl,
    qrisPublicId,
    qrisStoragePath: null,
    isActive: Boolean(account.isActive),
    updatedAt: new Date().toISOString()
  }, { merge: true });
  imported++;
}

console.log(`${imported} rekening berhasil diimpor ke koleksi Firestore 'accounts'.`);
console.log(`${uploadedImages} gambar QRIS berhasil diunggah ke Cloudinary.`);
console.log("Migrasi menggunakan Firestore + Cloudinary; Firebase Storage tidak diperlukan.");
console.log("Setelah data diverifikasi, file migration/legacy-accounts.json boleh dihapus.");
