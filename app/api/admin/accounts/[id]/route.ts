import { NextResponse } from "next/server";
import { requireAdminApi, jsonError } from "@/lib/admin-api";
import { getAccount, normalizeAccountInput, saveAccount, deleteAccount } from "@/lib/accounts";
import { deleteCloudinaryImage, uploadQrisImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;
  const { id } = await context.params;

  let newlyUploadedPublicId: string | null = null;
  try {
    const current = await getAccount(id);
    if (!current) return NextResponse.json({ error: "Data rekening tidak ditemukan." }, { status: 404 });

    const form = await request.formData();
    const qrisFile = form.get("qrisImage");
    let qrisImageUrl = current.qrisImageUrl;
    let qrisPublicId = current.qrisPublicId;
    const formData = Object.fromEntries(form.entries());
    const removeQrisImage = form.get("removeQrisImage") === "true";

    if (formData.category === "qris" && qrisFile instanceof File && qrisFile.size > 0) {
      const uploaded = await uploadQrisImage(qrisFile, id);
      qrisImageUrl = uploaded.url;
      qrisPublicId = uploaded.publicId;
      newlyUploadedPublicId = uploaded.publicId;
    } else if (removeQrisImage || formData.category !== "qris") {
      qrisImageUrl = null;
      qrisPublicId = null;
    }

    const data = normalizeAccountInput(formData, qrisImageUrl, qrisPublicId);
    await saveAccount(id, data);

    if (current.qrisPublicId && current.qrisPublicId !== qrisPublicId) {
      try { await deleteCloudinaryImage(current.qrisPublicId); }
      catch (cleanupError) { console.error("Data rekening tersimpan, tetapi gambar QRIS lama gagal dihapus:", cleanupError); }
    }
    newlyUploadedPublicId = null;
    return NextResponse.json({ success: true });
  } catch (error) {
    if (newlyUploadedPublicId) {
      try { await deleteCloudinaryImage(newlyUploadedPublicId); }
      catch (cleanupError) { console.error("Gagal membersihkan upload QRIS yang tidak terpakai:", cleanupError); }
    }
    return jsonError(error, "Gagal memperbarui rekening.");
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;
  const { id } = await context.params;
  try {
    const current = await getAccount(id);
    if (!current) return NextResponse.json({ error: "Data rekening tidak ditemukan." }, { status: 404 });
    await deleteAccount(id);
    if (current.qrisPublicId) {
      try { await deleteCloudinaryImage(current.qrisPublicId); }
      catch (cleanupError) { console.error("Rekening sudah dihapus, tetapi gambar QRIS di Cloudinary gagal dibersihkan:", cleanupError); }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError(error, "Gagal menghapus rekening.");
  }
}
