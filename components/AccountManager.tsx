"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Account } from "@/lib/types";
import { formatAccountPan, getCardTheme, getCategoryMeta } from "@/lib/themes";

export default function AccountManager({ initialAccounts }: { initialAccounts: Account[] }) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [selected, setSelected] = useState<Account | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const router = useRouter();

  async function action(id: string, path: string, payload?: Record<string, unknown>, method = "POST") {
    setBusyId(id);
    setNotice("");
    try {
      const response = await fetch(path, {
        method,
        headers: payload ? { "Content-Type": "application/json" } : undefined,
        body: payload ? JSON.stringify(payload) : undefined
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Aksi gagal dilakukan.");
      router.refresh();
      return true;
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Terjadi kesalahan.");
      return false;
    } finally {
      setBusyId(null);
    }
  }

  async function toggle(account: Account, isActive: boolean) {
    const ok = await action(account.id, `/api/admin/accounts/${account.id}/toggle`, { isActive });
    if (ok) setAccounts((items) => items.map((item) => item.id === account.id ? { ...item, isActive } : item));
  }

  async function reorder(account: Account, direction: "up" | "down") {
    const ok = await action(account.id, `/api/admin/accounts/${account.id}/reorder`, { direction });
    if (!ok) return;
    const index = accounts.findIndex((item) => item.id === account.id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (index >= 0 && targetIndex >= 0 && targetIndex < accounts.length) {
      const next = [...accounts];
      const current = next[index];
      const target = next[targetIndex];
      next[index] = { ...target, sortOrder: current.sortOrder };
      next[targetIndex] = { ...current, sortOrder: target.sortOrder };
      setAccounts(next);
    }
  }

  async function removeAccount() {
    if (!selected) return;
    const deleting = selected;
    const ok = await action(deleting.id, `/api/admin/accounts/${deleting.id}`, undefined, "DELETE");
    if (ok) {
      setAccounts((items) => items.filter((item) => item.id !== deleting.id));
      setSelected(null);
      setNotice("Rekening berhasil dihapus dari direktori.");
    }
  }

  return (
    <>
      {notice && <div className="alert alert-info" role="status"><i className="fa-solid fa-circle-info" /><span>{notice}</span></div>}
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title"><i className="fa-solid fa-layer-group" style={{ color: "var(--primary)" }} /><span>Daftar Rekening Terdaftar ({accounts.length})</span></h2>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 70, textAlign: "center" }}>Urutan</th>
                <th>Institusi / Bank</th>
                <th>Nomor Rekening</th>
                <th>Nama Pemilik</th>
                <th>Tema Kartu</th>
                <th style={{ width: 140 }}>Visibilitas Publik</th>
                <th style={{ textAlign: "right", width: 140 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}><i className="fa-solid fa-folder-open" style={{ fontSize: 32, display: "block", marginBottom: 8 }} />Belum ada rekening. Silakan klik tombol <strong>Tambah Rekening Baru</strong> di atas.</td></tr>
              ) : accounts.map((account, index) => {
                const theme = getCardTheme(account.cardTheme);
                const category = getCategoryMeta(account.category);
                return (
                  <tr key={account.id}>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                        <button type="button" className="btn-icon" style={{ width: 26, height: 26, fontSize: 11 }} title="Pindah ke Atas" disabled={index === 0 || busyId === account.id} onClick={() => reorder(account, "up")}><i className="fa-solid fa-arrow-up" /></button>
                        <strong style={{ fontFamily: "var(--font-mono)", minWidth: 24, textAlign: "center" }}>#{account.sortOrder}</strong>
                        <button type="button" className="btn-icon" style={{ width: 26, height: 26, fontSize: 11 }} title="Pindah ke Bawah" disabled={index === accounts.length - 1 || busyId === account.id} onClick={() => reorder(account, "down")}><i className="fa-solid fa-arrow-down" /></button>
                      </div>
                    </td>
                    <td>
                      <div className="bank-cell">
                        <div className="bank-avatar-mini" style={{ background: theme.gradient }}>{account.bankName.slice(0, 3).toUpperCase()}</div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <strong style={{ color: "var(--text-primary)", fontSize: 14 }}>{account.bankName}</strong>
                            <span className={`badge ${category.badgeClass}`} style={{ fontSize: 10, padding: "2px 7px" }}><i className={category.icon} style={{ fontSize: 9 }} />{category.name}</span>
                            <span className="badge badge-primary" style={{ fontSize: 10 }}>{account.label || "Utama"}</span>
                            {account.qrisImageUrl && <a href={account.qrisImageUrl} target="_blank" rel="noreferrer" title="Lihat Barcode QRIS"><img src={account.qrisImageUrl} alt="QRIS" className="table-qris-thumb" /></a>}
                          </div>
                          <small style={{ color: "var(--text-muted)", fontSize: 11 }}>{account.notes || "Tidak ada catatan"}</small>
                        </div>
                      </div>
                    </td>
                    <td><code style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13.5, background: "#f1f5f9", padding: "4px 8px", borderRadius: 6 }}>{formatAccountPan(account.accountNumber)}</code></td>
                    <td style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{account.accountName}</td>
                    <td><span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}><span style={{ width: 12, height: 12, borderRadius: 3, background: theme.gradient, display: "inline-block" }} />{theme.name}</span></td>
                    <td>
                      <label className="toggle-switch" title="Klik untuk mengaktifkan/menonaktifkan"><input type="checkbox" checked={account.isActive} disabled={busyId === account.id} onChange={(event) => toggle(account, event.target.checked)} /><span className="toggle-slider" /></label>
                      <span style={{ display: "block", fontSize: 11, fontWeight: 600, color: account.isActive ? "var(--success-text)" : "var(--text-muted)" }}>{account.isActive ? "Tampil" : "Sembunyi"}</span>
                    </td>
                    <td style={{ textAlign: "right" }}><div className="action-btns" style={{ justifyContent: "flex-end" }}><Link href={`/admin/rekening/${account.id}/edit`} className="btn-icon" title="Edit Rekening"><i className="fa-solid fa-pen-to-square" /></Link><button type="button" className="btn-icon btn-icon-danger" title="Hapus Rekening" onClick={() => setSelected(account)}><i className="fa-solid fa-trash-can" /></button></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mobile-account-list">
          {accounts.length === 0 ? <div style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>Belum ada rekening.</div> : accounts.map((account, index) => {
            const theme = getCardTheme(account.cardTheme);
            const category = getCategoryMeta(account.category);
            return (
              <div className="mobile-account-card" key={account.id}>
                <div className="mac-header">
                  <div className="mac-bank-info">
                    <div className="bank-avatar-mini" style={{ background: theme.gradient }}>{account.bankName.slice(0, 3).toUpperCase()}</div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                        <strong className="mac-bank-name">{account.bankName}</strong>
                        <span className={`badge ${category.badgeClass}`} style={{ fontSize: 9, padding: "1px 6px" }}><i className={category.icon} style={{ fontSize: 8 }} />{category.name}</span>
                        {account.qrisImageUrl && <a href={account.qrisImageUrl} target="_blank" rel="noreferrer" title="Lihat Barcode QRIS"><img src={account.qrisImageUrl} alt="QRIS" className="table-qris-thumb" style={{ width: 18, height: 18 }} /></a>}
                      </div>
                      <span className="badge badge-primary mac-badge">{account.label || "Utama"}</span>
                    </div>
                  </div>
                  <div className="mac-status"><label className="toggle-switch" title="Ubah status"><input type="checkbox" checked={account.isActive} disabled={busyId === account.id} onChange={(event) => toggle(account, event.target.checked)} /><span className="toggle-slider" /></label><span style={{ display: "block", fontSize: 11, fontWeight: 600, color: account.isActive ? "var(--success-text)" : "var(--text-muted)" }}>{account.isActive ? "Tampil" : "Sembunyi"}</span></div>
                </div>
                <div className="mac-body">
                  <div className="mac-detail-row"><span className="mac-label">No. Rekening</span><code className="mac-number">{formatAccountPan(account.accountNumber)}</code></div>
                  <div className="mac-detail-row"><span className="mac-label">Pemilik</span><span className="mac-holder">{account.accountName}</span></div>
                  <div className="mac-detail-row"><span className="mac-label">Tema Kartu</span><span>{theme.name}</span></div>
                  {account.notes && <div className="mac-notes"><i className="fa-solid fa-circle-info" /><span>{account.notes}</span></div>}
                </div>
                <div className="mac-footer">
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}><button type="button" className="btn-icon" title="Naik" onClick={() => reorder(account, "up")} disabled={index === 0 || busyId === account.id}><i className="fa-solid fa-arrow-up" /></button><span className="mac-order">Urutan #{account.sortOrder}</span><button type="button" className="btn-icon" title="Turun" onClick={() => reorder(account, "down")} disabled={index === accounts.length - 1 || busyId === account.id}><i className="fa-solid fa-arrow-down" /></button></div>
                  <div className="mac-actions"><Link href={`/admin/rekening/${account.id}/edit`} className="btn-action-edit"><i className="fa-solid fa-pen-to-square" /><span>Edit</span></Link><button type="button" className="btn-action-delete" onClick={() => setSelected(account)}><i className="fa-solid fa-trash-can" /><span>Hapus</span></button></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`modal-overlay ${selected ? "active" : ""}`} role="dialog" aria-modal="true" aria-labelledby="deleteModalTitle" onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        <div className="modal-card">
          <div className="modal-header"><h3 className="modal-title" id="deleteModalTitle" style={{ color: "var(--danger)" }}><i className="fa-solid fa-triangle-exclamation" /> Konfirmasi Hapus Rekening</h3></div>
          <div className="modal-body"><p>Apakah Anda yakin ingin menghapus rekening <strong style={{ color: "var(--text-primary)" }}>{selected?.bankName} - {selected?.accountNumber}</strong>?</p><p style={{ marginTop: 8, fontSize: 13, color: "var(--text-muted)" }}>Tindakan ini tidak dapat dibatalkan dan rekening ini tidak akan lagi muncul di landing page.</p></div>
          <div className="modal-footer"><button type="button" className="btn-secondary" onClick={() => setSelected(null)}>Batal</button><button type="button" className="btn-danger" disabled={busyId !== null} onClick={removeAccount}><i className="fa-solid fa-trash-can" /><span>Ya, Hapus Rekening</span></button></div>
        </div>
      </div>
    </>
  );
}
