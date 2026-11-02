"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login gagal.");
      router.replace(data.redirect || "/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-box">
      <div className="login-header">
        <div className="login-logo"><i className="fa-solid fa-vault" /></div>
        <h1 className="login-title">Admin RekeningKu</h1>
        <p className="login-desc">Masuk untuk mengelola daftar rekening Anda</p>
      </div>
      {error && <div className="alert alert-error" role="alert"><i className="fa-solid fa-circle-exclamation" /><span>{error}</span></div>}
      <form onSubmit={submit}>
        <div className="form-group"><label className="form-label" htmlFor="username">Username</label><div className="input-group"><i className="fa-solid fa-user input-icon" /><input className="form-control input-with-icon" id="username" name="username" placeholder="Masukkan username" autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} /></div></div>
        <div className="form-group"><label className="form-label" htmlFor="password">Password</label><div className="input-group input-password-wrapper"><i className="fa-solid fa-lock input-icon" /><input className="form-control input-with-icon" id="password" name="password" type={visible ? "text" : "password"} placeholder="Masukkan password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" className="btn-toggle-password" onClick={() => setVisible((value) => !value)} aria-label="Lihat password"><i className={`fa-solid ${visible ? "fa-eye-slash" : "fa-eye"}`} /></button></div></div>
        <button type="submit" className="btn-primary btn-login" disabled={loading}><i className="fa-solid fa-right-to-bracket" /><span>{loading ? "Memproses..." : "Masuk ke Dashboard"}</span></button>
      </form>
    </div>
  );
}
