import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { AdminSession } from "@/lib/types";

export const SESSION_COOKIE = "rekeningku_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET wajib berisi minimal 32 karakter.");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(username: string) {
  return new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token?: string | null): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "admin" || typeof payload.username !== "string") return null;
    return { username: payload.username, role: "admin" };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
}

export async function verifyRequestSession(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const entry = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  const token = entry ? decodeURIComponent(entry.slice(SESSION_COOKIE.length + 1)) : null;
  return verifySessionToken(token);
}
