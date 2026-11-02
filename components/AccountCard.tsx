import type { Account } from "@/lib/types";
import { formatAccountPan, getCardTheme } from "@/lib/themes";

export default function AccountCard({ account }: { account: Account }) {
  const theme = getCardTheme(account.cardTheme);
  const category = account.category || "rekening";
  const label = account.label || (category === "qris" ? "QRIS" : "Utama");
  const cleanNumber = account.accountNumber.replace(/\s+/g, "");
  const formattedNumber = formatAccountPan(account.accountNumber);
  const maskedNumber = formatAccountPan(
    `${"•".repeat(Math.max(0, cleanNumber.length - 4))}${cleanNumber.slice(-4)}`,
  );

  return (
    <article
      className={`account-card-wrapper ${category === "qris" ? "account-card-qris" : ""}`}
      data-category={category}
      data-label={label}
      data-bank={account.bankName}
      id={`account-${account.id}`}
    >
      <div className="card-stage-container">
        <div className="card-ambient-backglow" style={{ backgroundColor: theme.glow }} />
        <div className="atm-card-visual" style={{ background: theme.gradient }}>
          <div className="card-texture-overlay" />
          <div className="card-mesh-pattern" />
          <div className="atm-top-bar">
            <div className="card-chip-group">
              {category === "qris" ? (
                <div className="qris-card-icon-chip" title="QRIS Standar Nasional"><i className="fa-solid fa-qrcode" /></div>
              ) : (
                <>
                  <div className="emv-chip" title="EMV Smart Chip"><div className="chip-line-h" /><div className="chip-line-h" /><div className="chip-line-v" /><div className="chip-line-v" /></div>
                  <i className="fa-solid fa-wifi contactless-wave" title="Contactless Payment" />
                </>
              )}
            </div>
            <div className="card-bank-header">
              <div className="bank-name-title">{account.bankName}</div>
              <span className="card-tier-label" style={{ background: theme.badgeBg, color: theme.badgeText }}>{label.toUpperCase()}</span>
            </div>
          </div>
          <div className="atm-mid-bar">
            <span className="card-label-small">{category === "qris" ? "NMID / Kode Transaksi" : "Nomor Rekening / Account"}</span>
            <div className="account-number-row">
              <div
                className="card-account-number"
                role="button"
                tabIndex={0}
                aria-label={category === "qris" ? "Buka QRIS" : "Salin nomor rekening"}
                data-full-number={formattedNumber}
                data-masked-number={maskedNumber}
              >{cleanNumber ? (category === "qris" ? formattedNumber : maskedNumber) : "Scan Barcode QRIS"}</div>
              {category === "qris" ? (
                <button
                  type="button"
                  className="btn-open-inline btn-view-qris"
                  data-qris-url={account.qrisImageUrl ?? ""}
                  data-qris-download={`/api/qris/${encodeURIComponent(account.id)}/download`}
                  data-merchant={account.accountName}
                  data-bank={account.bankName}
                  data-nmid={account.accountNumber}
                  title="Buka Barcode QRIS"
                  aria-label="Buka Barcode QRIS"
                ><i className="fa-solid fa-qrcode" /><span>Buka</span></button>
              ) : cleanNumber ? (
                <div className="account-number-actions">
                  <button
                    type="button"
                    className="btn-toggle-number"
                    data-visible="false"
                    aria-pressed="false"
                    title="Tampilkan nomor rekening"
                    aria-label="Tampilkan nomor rekening"
                  ><i className="fa-regular fa-eye" /></button>
                  <button
                    type="button"
                    className="btn-copy btn-copy-inline"
                    data-account-number={account.accountNumber}
                    data-clean-number={cleanNumber}
                    data-bank={account.bankName}
                    title={`Salin Nomor ${account.bankName}`}
                    aria-label={`Salin Nomor ${account.bankName}`}
                  ><i className="fa-regular fa-copy" /><span>Salin</span></button>
                </div>
              ) : null}
            </div>
          </div>
          <div className="atm-bottom-bar">
            <div>
              <span className="card-label-small">{category === "qris" ? "Merchant / Pemilik" : "Card Holder"}</span>
              <div className="card-holder-name">{account.accountName.toUpperCase()}</div>
            </div>
            <div className="card-network-group">
              {category === "qris" ? <div className="badge-qris-pill"><span>QRIS</span></div> : <><div className="badge-gpn"><span>GPN</span><span className="badge-circle-dot" /></div><div className="interlocking-circles"><div className="circle-red" /><div className="circle-amber" /></div></>}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
