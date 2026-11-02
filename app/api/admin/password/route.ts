import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/firebase-admin";
import { requireAdminApi, jsonError } from "@/lib/admin-api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;
  try {
    const { currentPassword, newPassword, confirmPassword } = await request.json();
    if (!currentPassword || !newPassword || !confirmPassword) throw new Error("Semua kolom password wajib diisi.");
    if (String(newPassword).length < 6) throw new Error("Password baru minimal harus 6 karakter.");
    if (newPassword !== confirmPassword) throw new Error("Konfirmasi password baru tidak sama.");

    const docs = await getDb().collection("admins").where("username", "==", auth.session!.username).limit(1).get();
    if (docs.empty) return NextResponse.json({ error: "Akun administrator tidak ditemukan." }, { status: 404 });
    const doc = docs.docs[0];
    const hash = String(doc.data().passwordHash ?? "");
    if (!(await bcrypt.compare(String(currentPassword), hash))) throw new Error("Password saat ini yang Anda masukkan salah.");
    if (await bcrypt.compare(String(newPassword), hash)) throw new Error("Password baru tidak boleh sama dengan password saat ini.");

    const passwordHash = await bcrypt.hash(String(newPassword), 12);
    await doc.ref.update({ passwordHash, updatedAt: new Date().toISOString() });
    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError(error, "Gagal memperbarui password administrator.");
  }
}
