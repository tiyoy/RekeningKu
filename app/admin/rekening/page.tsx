import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import AccountManager from "@/components/AccountManager";
import { getAccounts } from "@/lib/accounts";
import { getAdminSession } from "@/lib/session";
import type { Account } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ManageAccountsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");
  let accounts: Account[] = [];
  try { accounts = await getAccounts(true); } catch (error) { console.error("Gagal memuat daftar rekening:", error); }
  return <AdminShell username={session.username} activeNav="rekening" pageTitle="Kelola Rekening"><div className="page-title-box"><div><h1 className="page-title">Kelola Rekening</h1><p className="page-description">Atur daftar rekening, kategori, urutan tampil, serta status publik.</p></div><a href="/admin/tambah" className="btn-primary"><i className="fa-solid fa-plus" /><span>Tambah Rekening Baru</span></a></div><AccountManager initialAccounts={accounts} /></AdminShell>;
}
