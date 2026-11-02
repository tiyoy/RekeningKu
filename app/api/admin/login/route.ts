import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/firebase-admin";
import { createSessionToken, setAdminSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const cleanUsername = String(username ?? "").trim();
    const cleanPassword = String(password ?? "");
    if (!cleanUsername || !cleanPassword) return NextResponse.json({ error: "Silakan masukkan username dan password." }, { status: 400 });

    const snapshot = await getDb().collection("admins").where("username", "==", cleanUsername).limit(1).get();
    if (snapshot.empty) return NextResponse.json({ error: "Username atau password yang Anda masukkan salah." }, { status: 401 });
    const admin = snapshot.docs[0].data();
    const passwordHash = String(admin.passwordHash ?? "").replace(/^\$2y\$/, "$2b$");
    if (!passwordHash || !(await bcrypt.compare(cleanPassword, passwordHash))) {
      return NextResponse.json({ error: "Username atau password yang Anda masukkan salah." }, { status: 401 });
    }

    const token = await createSessionToken(cleanUsername);
    await setAdminSessionCookie(token);
    return NextResponse.json({ success: true, redirect: "/admin/dashboard" });
  } catch (error) {
    console.error("Login admin gagal:", error);
    return NextResponse.json({ error: error instanceof Error && error.message.includes("Konfigurasi Firebase") ? error.message : "Terjadi kesalahan sistem. Pastikan konfigurasi Firebase sudah benar." }, { status: 500 });
  }
}
