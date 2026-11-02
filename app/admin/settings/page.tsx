import Link from "next/link";
import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import PasswordSettingsForm from "@/components/PasswordSettingsForm";
import { getAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");
  return <AdminShell username={session.username} activeNav="settings" pageTitle="Setting & Ganti Password"><div className="page-title-box"><div><h1 className="page-title">Setting &amp; Ganti Password</h1><p className="page-description">Kelola keamanan akun administrator RekeningKu.</p></div><Link href="/admin/dashboard" className="btn-secondary"><i className="fa-solid fa-arrow-left" /><span>Kembali ke Dashboard</span></Link></div><PasswordSettingsForm username={session.username} /></AdminShell>;
}
