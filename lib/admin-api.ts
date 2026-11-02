import { NextResponse } from "next/server";
import { verifyRequestSession } from "@/lib/session";

export async function requireAdminApi(request: Request) {
  const session = await verifyRequestSession(request);
  if (!session) return { session: null, response: NextResponse.json({ error: "Sesi admin tidak valid atau telah berakhir." }, { status: 401 }) };
  return { session, response: null };
}

export function jsonError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ error: message || fallback }, { status: 400 });
}
