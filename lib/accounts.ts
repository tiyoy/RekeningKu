import "server-only";
import { getDb } from "@/lib/firebase-admin";
import type { Account, AccountCategory } from "@/lib/types";

const COLLECTION = "accounts";

function mapAccount(id: string, data: Record<string, any>): Account {
  return {
    id,
    bankName: String(data.bankName ?? ""),
    accountNumber: String(data.accountNumber ?? ""),
    accountName: String(data.accountName ?? ""),
    category: (data.category ?? "rekening") as AccountCategory,
    qrisImageUrl: data.qrisImageUrl ?? null,
    qrisPublicId: data.qrisPublicId ?? null,
    label: String(data.label ?? "Utama"),
    icon: String(data.icon ?? "fa-building-columns"),
    cardTheme: String(data.cardTheme ?? "sapphire"),
    notes: String(data.notes ?? ""),
    sortOrder: Number(data.sortOrder ?? 0),
    isActive: Boolean(data.isActive),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

export async function getAccounts(includeInactive = true): Promise<Account[]> {
  const snapshot = await getDb().collection(COLLECTION).orderBy("sortOrder", "asc").get();
  return snapshot.docs.map((doc) => mapAccount(doc.id, doc.data())).filter((account) => includeInactive || account.isActive);
}

export async function getAccount(id: string): Promise<Account | null> {
  const doc = await getDb().collection(COLLECTION).doc(id).get();
  return doc.exists ? mapAccount(doc.id, doc.data()!) : null;
}

export async function saveAccount(id: string | null, data: Omit<Account, "id" | "createdAt" | "updatedAt">) {
  const collection = getDb().collection(COLLECTION);
  const ref = id ? collection.doc(id) : collection.doc();
  const existing = id ? await ref.get() : null;
  const payload = { ...data, updatedAt: new Date().toISOString(), ...(existing?.exists ? {} : { createdAt: new Date().toISOString() }) };
  await ref.set(payload, { merge: true });
  return ref.id;
}

export async function deleteAccount(id: string) {
  await getDb().collection(COLLECTION).doc(id).delete();
}

export async function setAccountActive(id: string, isActive: boolean) {
  await getDb().collection(COLLECTION).doc(id).update({ isActive, updatedAt: new Date().toISOString() });
}

export async function reorderAccount(id: string, direction: "up" | "down") {
  const db = getDb();
  const snapshot = await db.collection(COLLECTION).orderBy("sortOrder", "asc").get();
  const items = snapshot.docs.map((doc) => ({ id: doc.id, sortOrder: Number(doc.data().sortOrder ?? 0) }));
  const currentIndex = items.findIndex((item) => item.id === id);
  if (currentIndex < 0) throw new Error("Rekening tidak ditemukan.");
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= items.length) return;
  const current = items[currentIndex];
  const target = items[targetIndex];
  const batch = db.batch();
  batch.update(db.collection(COLLECTION).doc(current.id), { sortOrder: target.sortOrder, updatedAt: new Date().toISOString() });
  batch.update(db.collection(COLLECTION).doc(target.id), { sortOrder: current.sortOrder, updatedAt: new Date().toISOString() });
  await batch.commit();
}

export async function getAccountStats() {
  const accounts = await getAccounts(true);
  const active = accounts.filter((account) => account.isActive).length;
  return { total: accounts.length, active, inactive: accounts.length - active, accounts };
}

export function normalizeAccountInput(input: Record<string, unknown>, qrisImageUrl: string | null, qrisPublicId: string | null) {
  const category = String(input.category ?? "rekening").trim() as AccountCategory;
  if (!["rekening", "ewallet", "qris"].includes(category)) throw new Error("Kategori pembayaran tidak valid.");

  let bankName = String(input.bankName ?? "").trim();
  let accountNumber = String(input.accountNumber ?? "").trim();
  const accountName = String(input.accountName ?? "").trim();
  if (category === "qris") {
    bankName ||= "QRIS All Payment";
    accountNumber ||= "QRIS - Standar Pembayaran";
  } else if (!bankName || !accountNumber) {
    throw new Error("Nama bank/institusi dan nomor rekening wajib diisi.");
  }
  if (!accountName) throw new Error("Nama pemilik rekening / merchant wajib diisi.");

  const sortOrder = Number(input.sortOrder ?? 1);
  if (!Number.isInteger(sortOrder) || sortOrder < 1) throw new Error("Urutan tampil harus berupa angka bulat minimal 1.");
  const cardTheme = String(input.cardTheme ?? "sapphire");
  const validThemes = ["sapphire", "sapphire-dark", "emerald", "obsidian", "violet", "amber"];
  const labelDefaults = { rekening: "Utama", ewallet: "E-Wallet", qris: "QRIS" };

  return {
    bankName,
    accountNumber,
    accountName,
    category,
    qrisImageUrl: category === "qris" ? qrisImageUrl : null,
    qrisPublicId: category === "qris" ? qrisPublicId : null,
    label: String(input.label ?? "").trim() || labelDefaults[category],
    icon: category === "qris" ? "fa-qrcode" : category === "ewallet" ? "fa-wallet" : "fa-building-columns",
    cardTheme: validThemes.includes(cardTheme) ? cardTheme : "sapphire",
    notes: String(input.notes ?? "").trim(),
    sortOrder,
    isActive: String(input.isActive ?? "true") === "true" || input.isActive === true || input.isActive === "1"
  };
}
