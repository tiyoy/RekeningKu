"use client";

import { useMemo, useState, type FormEvent } from "react";

export default function PasswordSettingsForm({ username }: { username: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const strength = useMemo(() => {
    let score = 0;
    if (newPassword.length >= 6) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    return score;
  }, [newPassword]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setSuccess(""); setLoading(true);
    try {
      const response = await fetch("/api/admin/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword, confirmPassword }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal mengganti password.");
      setSuccess("Password administrator berhasil diperbarui. Gunakan password baru untuk login berikutnya.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) { setError(err instanceof Error ? err.message : "Terjadi kesalahan."); }
    finally { setLoading(false); }
  }

  const strengthLabel = ["Sangat Lemah", "Lemah", "Sedang", "Kuat", "Sangat Kuat"][strength];
  return (
    <>
      {error && <div className="alert alert-error"><i className="fa-solid fa-circle-exclamation" /><span>{error}</span></div>}
      {success && <div className="alert alert-success"><i className="fa-solid fa-circle-check" /><span>{success}</span></div>}
      <div className="settings-grid">
        <div className="panel">
          <div className="panel-header"><h2 className="panel-title"><i className="fa-solid fa-key" style={{ color: "var(--primary)" }} /><span>Ganti Password Administrator</span></h2></div>
          <div className="panel-body">
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 22 }}>Untuk menjaga keamanan akun Anda, masukkan password saat ini sebelum menentukan password baru.</p>
            <form onSubmit={submit}>
              {([{ key: "current", label: "Password Saat Ini", value: currentPassword, set: setCurrentPassword, placeholder: "Masukkan password saat ini", auto: "current-password", icon: "fa-lock" }, { key: "new", label: "Password Baru", value: newPassword, set: setNewPassword, placeholder: "Minimal 6 karakter", auto: "new-password", icon: "fa-shield-halved" }, { key: "confirm", label: "Konfirmasi Password Baru", value: confirmPassword, set: setConfirmPassword, placeholder: "Ulangi password baru yang sama", auto: "new-password", icon: "fa-check-double" }] as const).map((field) => <div className="form-group" key={field.key} style={{ marginBottom: 20 }}><label className="form-label" htmlFor={`${field.key}Password`}>{field.label} <span className="required">*</span></label><div className="input-password-wrapper"><i className={`fa-solid ${field.icon} input-icon-left`} /><input id={`${field.key}Password`} type={visible[field.key] ? "text" : "password"} className="form-control" placeholder={field.placeholder} autoComplete={field.auto} required value={field.value} onChange={(event) => field.set(event.target.value)} /><button type="button" className="btn-toggle-password" onClick={() => setVisible((state) => ({ ...state, [field.key]: !state[field.key] }))} aria-label="Lihat password"><i className={`fa-solid ${visible[field.key] ? "fa-eye-slash" : "fa-eye"}`} /></button></div>
                {field.key === "new" && newPassword && <div className="password-strength-container" style={{ display: "block" }}><div className="strength-meter-bars">{[1,2,3,4].map((level) => <div key={level} className={`strength-meter-segment ${strength >= level ? (strength <= 1 ? "active-weak" : strength <= 3 ? "active-medium" : "active-strong") : ""}`} />)}</div><div className="strength-feedback"><span>Kekuatan Password: <strong className="strength-text">{strengthLabel}</strong></span><span>Gunakan huruf besar, angka &amp; simbol</span></div></div>}
                {field.key === "confirm" && confirmPassword && <div className="password-match-status" style={{ display: "block", color: confirmPassword === newPassword ? "var(--success)" : "var(--danger)" }}>{confirmPassword === newPassword ? "Password cocok" : "Konfirmasi password belum sama"}</div>}
              </div>)}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, paddingTop: 20, borderTop: "1px solid var(--border-subtle)" }}><button type="reset" className="btn-secondary" onClick={() => { setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setError(""); setSuccess(""); }}>Batal</button><button type="submit" className="btn-primary" disabled={loading}><i className="fa-solid fa-shield-halved" /><span>{loading ? "Menyimpan..." : "Simpan Password Baru"}</span></button></div>
            </form>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="panel"><div className="panel-header"><h2 className="panel-title"><i className="fa-solid fa-user-shield" style={{ color: "var(--primary)" }} /><span>Informasi Akun</span></h2></div><div className="panel-body">
            <div className="admin-profile-summary"><div className="admin-avatar-lg">{username.slice(0, 2).toUpperCase()}</div><div className="admin-profile-details"><h3>{username}</h3><p><i className="fa-solid fa-circle" style={{ color: "var(--success)", fontSize: 8 }} /><span>Status: Administrator Aktif</span></p></div></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}><div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid var(--border-subtle)" }}><span style={{ color: "var(--text-muted)" }}>Username</span><strong style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{username}</strong></div><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-muted)" }}>Hak Akses</span><span className="badge badge-primary">Super Admin</span></div></div>
          </div></div>
          <div className="panel"><div className="panel-header"><h2 className="panel-title"><i className="fa-solid fa-shield-halved" style={{ color: "var(--success)" }} /><span>Tips Keamanan</span></h2></div><div className="panel-body"><ul className="security-tips-list"><li className="security-tip-item"><div className="security-tip-icon"><i className="fa-solid fa-key" /></div><div><strong>Gunakan password unik</strong><p>Jangan gunakan password yang sama dengan akun lain.</p></div></li><li className="security-tip-item"><div className="security-tip-icon"><i className="fa-solid fa-user-lock" /></div><div><strong>Jaga akses administrator</strong><p>Jangan bagikan informasi login kepada pihak lain.</p></div></li><li className="security-tip-item"><div className="security-tip-icon"><i className="fa-solid fa-rotate" /></div><div><strong>Perbarui secara berkala</strong><p>Ganti password jika ada aktivitas yang tidak dikenal.</p></div></li></ul></div></div>
        </div>
      </div>
    </>
  );
}
