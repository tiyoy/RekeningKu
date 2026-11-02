import { NextResponse } from "next/server";
import { getAccount } from "@/lib/accounts";
import { isCloudinaryImageUrl } from "@/lib/cloudinary";

export const runtime = "nodejs";

 type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const account = await getAccount(id);
    if (!account || account.category !== "qris" || !account.qrisImageUrl || !account.qrisPublicId) {
      return NextResponse.json({ error: "Barcode QRIS tidak ditemukan." }, { status: 404 });
    }
    if (!isCloudinaryImageUrl(account.qrisImageUrl)) {
      return NextResponse.json({ error: "URL gambar QRIS tidak valid." }, { status: 400 });
    }

    const imageResponse = await fetch(account.qrisImageUrl, { cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (!imageResponse.ok) throw new Error(`Cloudinary returned ${imageResponse.status}`);

    const contentType = imageResponse.headers.get("content-type")?.split(";")[0] || "image/png";
    if (!["image/png", "image/jpeg", "image/webp"].includes(contentType)) {
      throw new Error("Format gambar dari Cloudinary tidak didukung.");
    }
    const buffer = await imageResponse.arrayBuffer();
    const extension = contentType === "image/webp" ? "webp" : contentType === "image/jpeg" ? "jpg" : "png";
    const safeMerchant = (account.accountName || "merchant")
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .toLowerCase() || "merchant";

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.byteLength),
        "Content-Disposition": `attachment; filename="qris_${safeMerchant}.${extension}"`,
        "Cache-Control": "private, max-age=300"
      }
    });
  } catch (error) {
    console.error("Gagal mengunduh barcode QRIS:", error);
    return NextResponse.json({ error: "Gagal mengunduh barcode QRIS." }, { status: 500 });
  }
}
