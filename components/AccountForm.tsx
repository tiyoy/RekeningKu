"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Account, AccountCategory } from "@/lib/types";
import { getCardTheme, formatAccountPan } from "@/lib/themes";

type AccountFormValues = Omit<Account, "id" | "createdAt" | "updatedAt">;

const defaultAccount: AccountFormValues = {
  bankName: "", accountNumber: "", accountName: "", category: "rekening", qrisImageUrl: null, qrisPublicId: null,
  label: "", icon: "fa-building-columns", cardTheme: "sapphire", notes: "", sortOrder: 1, isActive: true
};

export default function AccountForm({ account, nextOrder }: { account?: Account; nextOrder: number }) {
  const [values, setValues] = useState<AccountFormValues>(account ? {
    bankName: account.bankName, accountNumber: account.accountNumber, accountName: account.accountName,
    category: account.category, qrisImageUrl: account.qrisImageUrl, qrisPublicId: account.qrisPublicId,
    label: account.label, icon: account.icon, cardTheme: ["sapphire", "sapphire-dark", "emerald", "obsidian", "violet", "amber"].includes(account.cardTheme) ? account.cardTheme : "sapphire", notes: account.notes,
    sortOrder: account.sortOrder, isActive: account.isActive
  } : { ...defaultAccount, sortOrder: nextOrder });
  const [file, setFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [removeQrisImage, setRemoveQrisImage] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const theme = getCardTheme(values.cardTheme);
  const previewNumber = useMemo(() => values.accountNumber ? formatAccountPan(values.accountNumber) : "•••• •••• •••• ••••", [values.accountNumber]);

  function update<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    if (localPreview) URL.revokeObjectURL(localPreview);
    setFile(selected);
    setRemoveQrisImage(false);
    setLocalPreview(selected ? URL.createObjectURL(selected) : null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const form = new FormData();
      form.set("bankName", values.bankName);
      form.set("accountNumber", values.accountNumber);
      form.set("accountName", values.accountName);
      form.set("category", values.category);
      form.set("label", values.label);
      form.set("cardTheme", values.cardTheme);
      form.set("notes", values.notes);
      form.set("sortOrder", String(values.sortOrder));
      form.set("isActive", String(values.isActive));
      if (file) form.set("qrisImage", file);
      if (removeQrisImage) form.set("removeQrisImage", "true");
      const response = await fetch(account ? `/api/admin/accounts/${account.id}` : "/api/admin/accounts", { method: account ? "PUT" : "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal menyimpan rekening.");
      router.push("/admin/rekening");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  }

  const labelText = values.category === "qris" ? "Nama Merchant / Penerbit QRIS" : values.category === "ewallet" ? "Nama E-Wallet" : "Nama Bank / Institusi";
  const numberText = values.category === "qris" ? "NMID atau nomor merchant (opsional)" : values.category === "ewallet" ? "Contoh: 0812 3456 7890" : "Contoh: 1234 5678 9012";
  const cardLabel = values.label.trim() || (values.category === "qris" ? "QRIS" : values.category === "ewallet" ? "E-WALLET" : "UTAMA");

  return (
    <>
      <div className="page-title-box">
        <div><h1 className="page-title">{account ? `Edit Rekening: ${account.bankName}` : "Tambah Rekening Baru"}</h1><p className="page-description">{account ? "Perbarui informasi detail rekening, status visibilitas, atau urutan tampil." : "Lengkapi formulir di bawah ini untuk menambahkan nomor rekening ke direktori."}</p></div>
        <Link href="/admin/rekening" className="btn-secondary"><i className="fa-solid fa-arrow-left" /><span>Kembali ke Daftar</span></Link>
      </div>
      {error && <div className="alert alert-error"><i className="fa-solid fa-triangle-exclamation" /><span>{error}</span></div>}

      <div className="card-studio-layout">
        <div className="panel">
          <div className="panel-header"><h2 className="panel-title"><i className="fa-solid fa-eye" style={{ color: "var(--primary)" }} /><span>Studio Pratinjau Kartu</span></h2><span className="badge badge-primary">Live Sync</span></div>
          <div className="panel-body">
            <div className="preview-stage">
              <div className="atm-card-visual" style={{ background: theme.gradient, width: "100%", borderRadius: 16 }}>
                <div className="card-texture-overlay" /><div className="card-mesh-pattern" />
                <div className="atm-top-bar"><div className="card-chip-group">{values.category === "qris" ? <div className="qris-card-icon-chip"><i className="fa-solid fa-qrcode" /></div> : <><div className="emv-chip"><div className="chip-line-h" /><div className="chip-line-h" /><div className="chip-line-v" /><div className="chip-line-v" /></div><i className="fa-solid fa-wifi contactless-wave" /></>}</div><div className="card-bank-header"><div className="bank-name-title">{values.bankName || (values.category === "qris" ? "QRIS ALL PAYMENT" : "NAMA BANK")}</div><span className="card-tier-label" style={{ background: theme.badgeBg, color: theme.badgeText }}>{cardLabel.toUpperCase()}</span></div></div>
                <div className="atm-mid-bar"><span className="card-label-small">{values.category === "qris" ? "NMID / Kode Transaksi" : "Nomor Rekening / Account"}</span><div className="card-account-number">{values.category === "qris" && !values.accountNumber ? "Scan Barcode QRIS" : previewNumber}</div></div>
                <div className="atm-bottom-bar"><div><span className="card-label-small">{values.category === "qris" ? "Merchant / Pemilik" : "Card Holder"}</span><div className="card-holder-name">{(values.accountName || "NAMA PEMEGANG").toUpperCase()}</div></div><div className="card-network-group">{values.category === "qris" ? <div className="badge-qris-pill"><span>QRIS</span></div> : <><div className="badge-gpn"><span>GPN</span><span className="badge-circle-dot" /></div><div className="interlocking-circles"><div className="circle-red" /><div className="circle-amber" /></div></>}</div></div>
              </div>
              <div style={{ width: "100%", marginTop: 22 }}><span className="form-label">Palet Tema Gradien</span><div className="theme-swatch-row" style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>{["sapphire", "sapphire-dark", "emerald", "obsidian", "violet", "amber"].map((name) => <button key={name} type="button" onClick={() => update("cardTheme", name)} aria-label={`Pilih tema ${name}`} title={name} style={{ width: 42, height: 34, borderRadius: 8, border: values.cardTheme === name ? "2px solid var(--primary)" : "1px solid rgba(255,255,255,.3)", background: getCardTheme(name).gradient, boxShadow: values.cardTheme === name ? "0 0 0 2px #bfdbfe" : "none" }} />)}</div></div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h2 className="panel-title"><i className="fa-solid fa-pen-to-square" style={{ color: "var(--primary)" }} /><span>Informasi Rekening</span></h2><span className="badge badge-success"><i className="fa-solid fa-circle-check" /> Validasi Form</span></div>
          <div className="panel-body">
            <form onSubmit={submit}>
              <div className="form-group" style={{ marginBottom: 22 }}><label className="form-label">Kategori Pembayaran <span className="required">*</span></label><div className="category-pill-group">
                {([{ value: "rekening", label: "Rekening Bank", icon: "fa-building-columns" }, { value: "ewallet", label: "E-Wallet", icon: "fa-wallet" }, { value: "qris", label: "QRIS Barcode", icon: "fa-qrcode" }] as const).map((option) => <label className="category-pill-item" key={option.value}><input type="radio" name="category" value={option.value} checked={values.category === option.value} onChange={() => update("category", option.value as AccountCategory)} /><span className="category-pill-card"><i className={`fa-solid ${option.icon}`} /><span>{option.label}</span></span></label>)}
              </div></div>

              <div className="form-group qris-upload-box" style={{ display: values.category === "qris" ? "block" : "none" }}>
                <label className="form-label"><i className="fa-solid fa-qrcode" style={{ color: "var(--primary)" }} /> Unggah Foto / Gambar Barcode QRIS</label>
                <div className="qris-dropzone" id="qrisDropzone"><input type="file" id="qris_image" name="qrisImage" accept="image/png, image/jpeg, image/jpg, image/webp" className="qris-file-input" onChange={handleFile} />
                  <div className="qris-dropzone-content">
                    {(localPreview || (account?.qrisImageUrl && !removeQrisImage)) ? <div className="qris-preview-holder" style={{ display: "block" }}><img src={localPreview || account?.qrisImageUrl || ""} alt="Pratinjau Barcode QRIS" className="qris-thumb-preview" /><button type="button" className="btn-remove-qris" title="Hapus foto QRIS" aria-label="Hapus foto QRIS" onClick={() => { if (localPreview) URL.revokeObjectURL(localPreview); setLocalPreview(null); setFile(null); setRemoveQrisImage(true); }}><i className="fa-solid fa-xmark" /></button></div> : <div className="qris-upload-prompt"><i className="fa-solid fa-cloud-arrow-up qris-upload-icon" /><span className="qris-prompt-title">Pilih atau seret gambar barcode QRIS ke sini</span><span className="qris-prompt-desc">Format PNG, JPG, JPEG, atau WebP (Maksimal 5MB)</span></div>}
                  </div>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group"><label className="form-label" htmlFor="bankName">{labelText} <span className="required">*</span></label><input type="text" id="bankName" name="bankName" className="form-control" placeholder={values.category === "qris" ? "Contoh: QRIS Toko Saya" : values.category === "ewallet" ? "Contoh: GoPay, OVO, DANA" : "Contoh: BCA, Bank Mandiri, BRI"} value={values.bankName} onChange={(event) => update("bankName", event.target.value)} /></div>
                <div className="form-group"><label className="form-label" htmlFor="label">Label Kartu</label><input type="text" id="label" name="label" className="form-control" placeholder="Contoh: Utama, Bisnis, Pribadi" value={values.label} onChange={(event) => update("label", event.target.value)} /></div>
              </div>
              <div className="form-grid">
                <div className="form-group"><label className="form-label" htmlFor="accountNumber">Nomor Rekening / No. E-Wallet</label><input type="text" id="accountNumber" name="accountNumber" className="form-control" style={{ fontFamily: "var(--font-mono)" }} placeholder={numberText} value={values.accountNumber} onChange={(event) => update("accountNumber", event.target.value)} /><span className="form-help">Boleh menggunakan spasi untuk memudahkan pembacaan digit.</span></div>
                <div className="form-group"><label className="form-label" htmlFor="accountName">Nama Pemilik Rekening <span className="required">*</span></label><input type="text" id="accountName" name="accountName" className="form-control" placeholder="Contoh: Alex Pratama, S.E." value={values.accountName} onChange={(event) => update("accountName", event.target.value)} required /><span className="form-help">Pastikan ejaan sesuai nama di rekening atau merchant.</span></div>
              </div>
              <div className="form-grid">
                <div className="form-group"><label className="form-label" htmlFor="cardTheme">Tema Kartu (Gradien Visual)</label><select id="cardTheme" name="cardTheme" className="form-control" value={values.cardTheme} onChange={(event) => update("cardTheme", event.target.value)}><option value="sapphire">Deep Sapphire (Biru Royal &amp; Navy)</option><option value="sapphire-dark">Royal Navy (Biru Tua Mewah)</option><option value="emerald">Emerald Wealth (Hijau Zamrud)</option><option value="obsidian">Obsidian Onyx (Hitam Elegan)</option><option value="violet">Imperial Violet (Ungu Eksklusif)</option><option value="amber">Sunset Amber (Cokelat Keemasan)</option></select></div>
                <div className="form-group"><label className="form-label" htmlFor="sortOrder">Urutan Tampil (Sort Order) <span className="required">*</span></label><input type="number" id="sortOrder" min="1" required className="form-control" value={values.sortOrder} onChange={(event) => update("sortOrder", Number(event.target.value))} /><span className="form-help">Angka terkecil tampil paling atas pada landing page.</span></div>
              </div>
              <div className="form-group"><label className="form-label" htmlFor="notes">Catatan Khusus / Instruksi Transfer (Opsional)</label><textarea id="notes" rows={2} className="form-control" placeholder="Misal: Transfer via BI-Fast untuk biaya admin hemat (Rp 2.500)" value={values.notes} onChange={(event) => update("notes", event.target.value)} /></div>
              <div className="form-group" style={{ marginTop: 10, background: "#f8fafc", padding: "14px 18px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}><div><strong style={{ display: "block", fontSize: 13.5, color: "var(--text-primary)" }}>Tampilkan di Halaman Publik</strong><span style={{ fontSize: 12, color: "var(--text-muted)" }}>Aktifkan agar rekening ini dapat dilihat pengunjung di landing page utama.</span></div><label className="toggle-switch"><input type="checkbox" checked={values.isActive} onChange={(event) => update("isActive", event.target.checked)} /><span className="toggle-slider" /></label></div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--border-subtle)" }}><Link href="/admin/rekening" className="btn-secondary">Batal</Link><button type="submit" className="btn-primary" disabled={loading}><i className="fa-solid fa-floppy-disk" /><span>{loading ? "Menyimpan..." : account ? "Simpan Perubahan" : "Simpan Rekening Baru"}</span></button></div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
