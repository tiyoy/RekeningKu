"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

const navLinks = [
  { key: "dashboard", href: "/admin/dashboard", icon: "fa-gauge-high", label: "Dashboard" },
  { key: "rekening", href: "/admin/rekening", icon: "fa-building-columns", label: "Kelola Rekening" },
  { key: "settings", href: "/admin/settings", icon: "fa-gear", label: "Setting" }
];

export default function AdminShell({ children, username, activeNav, pageTitle }: { children: ReactNode; username: string; activeNav: string; pageTitle: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = username.slice(0, 2).toUpperCase();
  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${mobileOpen ? "open" : ""}`}>
        <div>
          <div className="sidebar-header">
            <Link href="/admin/dashboard" className="brand-wrapper">
              <div className="brand-logo-icon"><i className="fa-solid fa-wallet" /></div>
              <div className="brand-title-group"><h2>RekeningKu</h2><span>Admin Panel</span></div>
            </Link>
            <span className="role-badge">Pro</span>
          </div>
          <nav className="sidebar-nav">
            <div>
              <span className="nav-section-title">Menu Utama</span>
              <ul className="nav-list">
                {navLinks.slice(0, 2).map((item) => <li key={item.key}><Link href={item.href} onClick={() => setMobileOpen(false)} className={`nav-link ${activeNav === item.key ? "active" : ""}`}><i className={`fa-solid ${item.icon}`} /><span>{item.label}</span></Link></li>)}
              </ul>
            </div>
            <div>
              <span className="nav-section-title">Sistem</span>
              <ul className="nav-list">
                <li><Link href="/admin/settings" onClick={() => setMobileOpen(false)} className={`nav-link ${activeNav === "settings" ? "active" : ""}`}><i className="fa-solid fa-gear" /><span>Setting</span></Link></li>
                <li><LogoutButton /></li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="sidebar-footer">
          <div className="user-profile-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-meta"><div className="user-name">{username}</div><div className="user-status"><i className="fa-solid fa-circle" style={{ fontSize: 8 }} /><span>Online</span></div></div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Link href="/admin/settings" className={`btn-icon-setting ${activeNav === "settings" ? "active" : ""}`} title="Setting Akun"><i className="fa-solid fa-gear" /></Link>
              <LogoutButton className="btn-icon-logout" />
            </div>
          </div>
        </div>
      </aside>
      <div className={`sidebar-backdrop ${mobileOpen ? "active" : ""}`} onClick={() => setMobileOpen(false)} id="sidebarBackdrop" />
      <div className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button type="button" className="mobile-nav-toggle" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle Navigation"><i className="fa-solid fa-bars" /></button>
            <div className="topbar-breadcrumbs"><Link href="/admin/dashboard">Dashboard</Link><span>/</span><span className="current">{pageTitle}</span></div>
          </div>
          <div className="topbar-actions">
            <Link href="/" target="_blank" className="btn-link-public"><i className="fa-solid fa-globe" style={{ color: "var(--success)" }} /><span>Tampilan Publik</span></Link>
            <Link href="/admin/settings" className="btn-secondary" title="Setting Akun"><i className="fa-solid fa-gear" /><span className="topbar-btn-text">Setting</span></Link>
            <Link href="/admin/tambah" className="btn-primary"><i className="fa-solid fa-plus" /><span>Tambah Rekening</span></Link>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
