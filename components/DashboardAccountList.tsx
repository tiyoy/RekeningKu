"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Account } from "@/lib/types";
import { formatAccountPan, getCardTheme, getCategoryMeta } from "@/lib/themes";

export default function DashboardAccountList({ initialAccounts }: { initialAccounts: Account[] }) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [selected, setSelected] = useState<Account | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function removeAccount() {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/accounts/${selected.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal menghapus rekening.");
      setAccounts((items) => items.filter((item) => item.id !== selected.id));
      setSelected(null);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Terjadi kesalahan saat menghapus rekening.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {error && <div className="alert alert-error"><i className="fa-solid fa-triangle-exclamation" /><span>{error}</span></div>}
      <div className="panel">
        <div className="panel-header"><h2 className="panel-title"><i className="fa-solid fa-credit-card" style={{ color: "var(--primary)" }} /><span>Daftar Rekening Pembayaran</span></h2><Link href="/admin/rekening" className="btn-secondary" style={{ fontSize: 12, padding: "6px 12px" }}><span>Lihat Semua</span><i className="fa-solid fa-arrow-right" /></Link></div>
        <div className="table-responsive">
          <table className="data-table">
            <thead><tr><th style={{ width: 60 }}>Urutan</th><th>Bank / Lembaga</th><th>Nomor Rekening</th><th>Nama Pemilik</th><th>Label</th><th>Status</th><th style={{ textAlign: "right" }}>Aksi</th></tr></thead>
            <tbody>
              {accounts.length === 0 ? <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}><i className="fa-solid fa-folder-open" style={{ fontSize: 32, marginBottom: 8, display: "block" }} />Belum ada rekening yang ditambahkan. Silakan klik tombol <strong>Tambah Rekening</strong>.</td></tr> : accounts.map((account) => {
                const theme = getCardTheme(account.cardTheme);
                const category = getCategoryMeta(account.category);
                return <tr key={account.id}>
                  <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--text-muted)", textAlign: "center" }}>#{account.sortOrder}</td>
                  <td><div className="bank-cell"><div className="bank-avatar-mini" style={{ background: theme.gradient }}>{account.bankName.slice(0, 3).toUpperCase()}</div><div><div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}><strong style={{ color: "var(--text-primary)", fontSize: 14 }}>{account.bankName}</strong><span className={`badge ${category.badgeClass}`} style={{ fontSize: 10, padding: "2px 7px" }}><i className={category.icon} style={{ fontSize: 9 }} />{category.name}</span>{account.qrisImageUrl && <a href={account.qrisImageUrl} target="_blank" rel="noreferrer" title="Lihat Barcode QRIS"><img src={account.qrisImageUrl} alt="QRIS" className="table-qris-thumb" /></a>}</div><small style={{ color: "var(--text-muted)", fontSize: 11 }}>{account.notes || "Tidak ada catatan"}</small></div></div></td>
                  <td><code style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13.5, background: "#f1f5f9", padding: "4px 8px", borderRadius: 6 }}>{formatAccountPan(account.accountNumber)}</code></td>
                  <td style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{account.accountName}</td>
                  <td><span className="badge badge-primary">{account.label || "Utama"}</span></td>
                  <td>{account.isActive ? <span className="badge badge-success"><i className="fa-solid fa-circle" style={{ fontSize: 6 }} /> Aktif</span> : <span className="badge badge-muted">Nonaktif</span>}</td>
                  <td style={{ textAlign: "right" }}><div className="action-btns" style={{ justifyContent: "flex-end" }}><Link href={`/admin/rekening/${account.id}/edit`} className="btn-icon" title="Edit Rekening"><i className="fa-solid fa-pen-to-square" /></Link><button type="button" className="btn-icon btn-icon-danger" title="Hapus Rekening" onClick={() => setSelected(account)}><i className="fa-solid fa-trash-can" /></button></div></td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
        <div className="mobile-account-list">
          {accounts.length === 0 ? <div style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}><i className="fa-solid fa-folder-open" style={{ fontSize: 28, marginBottom: 8, display: "block" }} />Belum ada rekening yang ditambahkan.</div> : accounts.map((account) => {
            const theme = getCardTheme(account.cardTheme);
            const category = getCategoryMeta(account.category);
            return <div className="mobile-account-card" key={account.id}>
              <div className="mac-header"><div className="mac-bank-info"><div className="bank-avatar-mini" style={{ background: theme.gradient }}>{account.bankName.slice(0, 3).toUpperCase()}</div><div><div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}><strong className="mac-bank-name">{account.bankName}</strong><span className={`badge ${category.badgeClass}`} style={{ fontSize: 9, padding: "1px 6px" }}><i className={category.icon} style={{ fontSize: 8 }} />{category.name}</span>{account.qrisImageUrl && <a href={account.qrisImageUrl} target="_blank" rel="noreferrer" title="Lihat Barcode QRIS"><img src={account.qrisImageUrl} alt="QRIS" className="table-qris-thumb" style={{ width: 18, height: 18 }} /></a>}</div><span className="badge badge-primary mac-badge">{account.label || "Utama"}</span></div></div><div className="mac-status">{account.isActive ? <span className="badge badge-success"><i className="fa-solid fa-circle" style={{ fontSize: 6 }} /> Aktif</span> : <span className="badge badge-muted">Nonaktif</span>}</div></div>
              <div className="mac-body"><div className="mac-detail-row"><span className="mac-label">No. Rekening</span><code className="mac-number">{formatAccountPan(account.accountNumber)}</code></div><div className="mac-detail-row"><span className="mac-label">Pemilik</span><span className="mac-holder">{account.accountName}</span></div>{account.notes && <div className="mac-notes"><i className="fa-solid fa-circle-info" /><span>{account.notes}</span></div>}</div>
              <div className="mac-footer"><span className="mac-order">Urutan #{account.sortOrder}</span><div className="mac-actions"><Link href={`/admin/rekening/${account.id}/edit`} className="btn-action-edit"><i className="fa-solid fa-pen-to-square" /><span>Edit</span></Link><button type="button" className="btn-action-delete" onClick={() => setSelected(account)}><i className="fa-solid fa-trash-can" /><span>Hapus</span></button></div></div>
            </div>;
          })}
        </div>
      </div>

      <div className={`modal-overlay ${selected ? "active" : ""}`} role="dialog" aria-modal="true" aria-labelledby="dashboardDeleteTitle" onClick={(event) => { if (event.target === event.currentTarget && !busy) setSelected(null); }}>
        <div className="modal-card"><div className="modal-header"><h3 className="modal-title" id="dashboardDeleteTitle" style={{ color: "var(--danger)" }}><i className="fa-solid fa-triangle-exclamation" /> Konfirmasi Hapus Rekening</h3></div><div className="modal-body"><p>Apakah Anda yakin ingin menghapus rekening <strong style={{ color: "var(--text-primary)" }}>{selected?.bankName} - {selected?.accountNumber}</strong>?</p><p style={{ marginTop: 8, fontSize: 13, color: "var(--text-muted)" }}>Tindakan ini tidak dapat dibatalkan dan rekening ini tidak akan lagi muncul di landing page publik.</p></div><div className="modal-footer"><button type="button" className="btn-secondary" onClick={() => setSelected(null)} disabled={busy}>Batal</button><button type="button" className="btn-danger" disabled={busy} onClick={removeAccount}><i className="fa-solid fa-trash-can" /><span>{busy ? "Menghapus..." : "Ya, Hapus Rekening"}</span></button></div></div>
      </div>
    </>
  );
}
