import Link from "next/link";
import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import DashboardAccountList from "@/components/DashboardAccountList";
import { getAccountStats } from "@/lib/accounts";
import { getAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  let stats = { total: 0, active: 0, inactive: 0, accounts: [] as Awaited<ReturnType<typeof getAccountStats>>["accounts"] };
  try {
    stats = await getAccountStats();
  } catch (error) {
    console.error("Gagal memuat statistik dashboard:", error);
  }

  return (
    <AdminShell username={session.username} activeNav="dashboard" pageTitle="Dashboard Ringkasan">
      <div className="page-title-box">
        <div><h1 className="page-title">Ringkasan Sistem</h1><p className="page-description">Pantau status rekening aktif dan konfigurasi tampilan landing page.</p></div>
        <div className="page-title-actions"><Link href="/admin/rekening" className="btn-secondary"><i className="fa-solid fa-list-check" /><span>Kelola Urutan</span></Link><Link href="/admin/tambah" className="btn-primary"><i className="fa-solid fa-plus" /><span>Tambah Rekening Baru</span></Link></div>
      </div>

      <section className="stats-grid">
        <div className="stat-card"><div><div className="stat-label">Total Rekening</div><div className="stat-value">{stats.total}</div><div className="stat-subtext">Semua metode terdaftar</div></div><div className="stat-icon-box stat-icon-blue"><i className="fa-solid fa-building-columns" /></div></div>
        <div className="stat-card"><div><div className="stat-label">Rekening Aktif</div><div className="stat-value" style={{ color: "var(--success)" }}>{stats.active}</div><div className="stat-subtext"><i className="fa-solid fa-circle" style={{ color: "var(--success)", fontSize: 7 }} /> Tampil di halaman publik</div></div><div className="stat-icon-box stat-icon-green"><i className="fa-solid fa-circle-check" /></div></div>
        <div className="stat-card"><div><div className="stat-label">Rekening Nonaktif</div><div className="stat-value" style={{ color: "var(--text-muted)" }}>{stats.inactive}</div><div className="stat-subtext">Disembunyikan dari pengunjung</div></div><div className="stat-icon-box stat-icon-amber"><i className="fa-solid fa-eye-slash" /></div></div>
      </section>

      <DashboardAccountList initialAccounts={stats.accounts} />
    </AdminShell>
  );
}
