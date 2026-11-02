import { NextResponse } from "next/server";
import { requireAdminApi, jsonError } from "@/lib/admin-api";
import { getAccounts, normalizeAccountInput, saveAccount } from "@/lib/accounts";
import { deleteCloudinaryImage, uploadQrisImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;
  try {
    return NextResponse.json({ accounts: await getAccounts(true) });
  } catch (error) {
    return jsonError(error, "Gagal memuat data rekening.");
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;

  let uploadedPublicId: string | null = null;
  try {
    const form = await request.formData();
    const qrisFile = form.get("qrisImage");
    const formData = Object.fromEntries(form.entries());
    const uploaded = formData.category === "qris" && qrisFile instanceof File && qrisFile.size > 0
      ? await uploadQrisImage(qrisFile)
      : { url: null, publicId: null };
    uploadedPublicId = uploaded.publicId;

    const data = normalizeAccountInput(formData, uploaded.url, uploaded.publicId);
    const id = await saveAccount(null, data);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    if (uploadedPublicId) {
      try { await deleteCloudinaryImage(uploadedPublicId); }
      catch (cleanupError) { console.error("Gagal membersihkan upload QRIS yang tidak terpakai:", cleanupError); }
    }
    return jsonError(error, "Gagal menambahkan rekening.");
  }
}
