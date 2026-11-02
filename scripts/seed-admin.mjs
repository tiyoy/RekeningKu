import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

import bcrypt from "bcryptjs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function firebaseApp() {
  if (getApps().length) return getApps()[0];
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) throw new Error("Isi variabel FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, dan FIREBASE_PRIVATE_KEY.");
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }), projectId });
}

const db = getFirestore(firebaseApp());
const legacyPath = join(process.cwd(), "migration", "legacy-admins.json");
let importedLegacy = 0;
if (existsSync(legacyPath)) {
  const legacyAdmins = JSON.parse(readFileSync(legacyPath, "utf8"));
  for (const legacy of legacyAdmins) {
    const username = String(legacy.username ?? "").trim();
    const legacyHash = String(legacy.passwordHash ?? "");
    if (!username || !legacyHash) continue;
    const existing = await db.collection("admins").where("username", "==", username).limit(1).get();
    if (!existing.empty) continue;
    // PHP PASSWORD_DEFAULT stores bcrypt as $2y$; $2b$ is the equivalent current variant.
    const passwordHash = legacyHash.replace(/^\$2y\$/, "$2b$");
    await db.collection("admins").doc(username).set({
      username,
      passwordHash,
      createdAt: legacy.createdAt || new Date().toISOString(),
      updatedAt: legacy.updatedAt || new Date().toISOString()
    });
    importedLegacy++;
    console.log(`Akun admin lama '${username}' berhasil dipindahkan.`);
  }
}

if (importedLegacy > 0) {
  console.log(`${importedLegacy} akun admin lama berhasil diimpor. Gunakan password lama Anda.`);
  process.exit(0);
}

const username = (process.env.ADMIN_INITIAL_USERNAME || "admin").trim();
const password = process.env.ADMIN_INITIAL_PASSWORD || "admin123";
if (password.length < 6) throw new Error("ADMIN_INITIAL_PASSWORD harus minimal 6 karakter.");

const existing = await db.collection("admins").where("username", "==", username).limit(1).get();
if (!existing.empty) {
  console.log(`Admin '${username}' sudah tersedia. Tidak ada perubahan.`);
  process.exit(0);
}

const passwordHash = await bcrypt.hash(password, 12);
await db.collection("admins").doc(username).set({ username, passwordHash, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
console.log(`Admin '${username}' berhasil dibuat.`);
