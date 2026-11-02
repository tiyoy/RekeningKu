import { NextResponse } from "next/server";
import { requireAdminApi, jsonError } from "@/lib/admin-api";
import { reorderAccount } from "@/lib/accounts";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };
export async function POST(request: Request, context: RouteContext) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;
  const { id } = await context.params;
  try {
    const body = await request.json();
    if (body.direction !== "up" && body.direction !== "down") throw new Error("Arah pengurutan tidak valid.");
    await reorderAccount(id, body.direction);
    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError(error, "Gagal mengubah urutan rekening.");
  }
}
