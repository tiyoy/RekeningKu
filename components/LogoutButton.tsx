"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ className = "nav-link" }: { className?: string }) {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin");
    router.refresh();
  }
  return <button type="button" onClick={logout} className={className}><i className="fa-solid fa-right-from-bracket" style={{ color: "var(--danger)" }} /><span>Keluar / Logout</span></button>;
}
