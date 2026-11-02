import AccountCard from "@/components/AccountCard";
import PublicInteractions from "@/components/PublicInteractions";
import { getAccounts } from "@/lib/accounts";
import type { Account } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let accounts: Account[] = [];
  try {
    accounts = await getAccounts(false);
  } catch (error) {
    console.error("Gagal mengambil rekening publik dari Firestore:", error);
  }

  return (
    <>
      <main className="container">
        <header className="hero-header">
          <div className="brand-badge"><i className="fa-solid fa-circle-check" /><span>Tervalidasi 24/7 &bull; Direktori Resmi</span></div>
          <h1 className="hero-title">Rekening Pembayaran &amp; Transfer</h1>
          <p className="hero-subtitle">Silakan pilih rekening bank atau e-wallet tujuan, lalu klik salin untuk transfer dengan cepat tanpa resiko salah nomor.</p>
        </header>

        {accounts.length > 0 && (
          <section className="filter-bar">
            <div className="filter-chips">
              <button type="button" className="filter-chip active" data-filter="all"><i className="fa-solid fa-layer-group" /><span>Semua</span></button>
              <button type="button" className="filter-chip" data-filter="rekening"><i className="fa-solid fa-building-columns" /><span>Bank</span></button>
              <button type="button" className="filter-chip" data-filter="ewallet"><i className="fa-solid fa-wallet" /><span>E-Wallet</span></button>
              <button type="button" className="filter-chip" data-filter="qris"><i className="fa-solid fa-qrcode" /><span>QRIS</span></button>
            </div>
            <span id="visibleCount" className="filter-count" aria-live="polite">{accounts.length} Rekening Aktif</span>
          </section>
        )}

        <section className="accounts-grid" id="accountsGrid">
          {accounts.length === 0 ? (
            <div className="empty-state">
              <i className="fa-solid fa-building-columns" />
              <h3>Belum Ada Rekening Aktif</h3>
              <p>Daftar rekening pembayaran sedang dalam pemeliharaan. Silakan hubungi pemilik layanan.</p>
            </div>
          ) : accounts.map((account) => <AccountCard key={account.id} account={account} />)}
        </section>
      </main>

      <footer className="public-footer">
        <p>
          &copy; {new Date().getFullYear()} - Dibuat dengan niat baik dan secangkir kopi oleh{" "}
          <a
            href="https://www.instagram.com/cecep.maulana_/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--yellow)" }}
          >
            Cecep Maulanaツ
          </a>
        </p>
      </footer>

      <div className="qris-modal-overlay" id="qrisModal" role="dialog" aria-modal="true" aria-labelledby="qrisModalTitle">
        <div className="qris-modal-backdrop" id="qrisBackdrop" />
        <div className="qris-modal-card">
          <div className="qris-modal-header">
            <div className="qris-modal-title-group"><span className="qris-badge-pill"><i className="fa-solid fa-qrcode" /> QRIS</span><h3 className="qris-modal-title" id="qrisModalTitle">Barcode Pembayaran</h3></div>
            <button type="button" className="btn-close-qris-modal" id="qrisCloseBtn" aria-label="Tutup"><i className="fa-solid fa-xmark" /></button>
          </div>
          <div className="qris-modal-body">
            <div className="qris-image-stage"><img id="qrisModalImg" alt="Barcode QRIS" className="qris-modal-img" /></div>
            <div className="qris-modal-meta">
              <div className="qris-meta-merchant" id="qrisModalMerchant">Merchant</div>
              <div className="qris-meta-bank" id="qrisModalBank">Layanan</div>
              <div className="qris-meta-nmid-box" id="qrisModalNmidWrap" style={{ display: "none" }}><span className="qris-nmid-label">NMID / Kode:</span><code id="qrisModalNmid" className="qris-nmid-value" /><button type="button" className="btn-copy-nmid" id="qrisCopyNmidBtn" title="Salin Kode"><i className="fa-regular fa-copy" /></button></div>
            </div>
            <div className="qris-modal-instructions"><i className="fa-solid fa-shield-halved" /><span>Pindai langsung menggunakan BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay, atau aplikasi QRIS lainnya.</span></div>
          </div>
          <div className="qris-modal-footer"><a id="qrisDownloadBtn" download="qris_barcode.png" className="btn-download-qris"><i className="fa-solid fa-download" /><span>Unduh Barcode QRIS</span></a></div>
        </div>
      </div>
      <div className="toast-notification" id="copyToast" role="status" aria-live="polite" aria-atomic="true" data-state="success">
        <span className="toast-notification__icon" aria-hidden="true"><i className="fa-solid fa-check" /></span>
        <span className="toast-notification__message" id="toastMessage">Nomor rekening berhasil disalin.</span>
      </div>
      <PublicInteractions />
    </>
  );
}
