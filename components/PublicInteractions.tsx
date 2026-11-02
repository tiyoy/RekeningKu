"use client";

import { useEffect } from "react";

export default function PublicInteractions() {
  useEffect(() => {
    const modal = document.getElementById("qrisModal");
    const toast = document.getElementById("copyToast");
    const toastMessage = document.getElementById("toastMessage");
    const toastIcon = toast?.querySelector(".toast-notification__icon i") as HTMLElement | null;
    let toastTimer: ReturnType<typeof setTimeout> | null = null;
    let currentNmid = "";

    const showToast = (message: string, state: "success" | "warning" | "error" = "success") => {
      if (!toast || !toastMessage) return;
      toastMessage.textContent = message;
      toast.dataset.state = state;
      if (toastIcon) {
        toastIcon.className = state === "success"
          ? "fa-solid fa-check"
          : state === "warning"
            ? "fa-solid fa-circle-exclamation"
            : "fa-solid fa-xmark";
      }
      toast.classList.add("show");
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
    };

    const copyToClipboard = async (text: string) => {
      if (!text) return false;
      if (navigator.clipboard && window.isSecureContext) {
        try { await navigator.clipboard.writeText(text); return true; } catch { /* fallback below */ }
      }
      const input = document.createElement("textarea");
      input.value = text;
      input.style.position = "fixed";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.focus(); input.select();
      let success = false;
      try { success = document.execCommand("copy"); } catch { success = false; }
      input.remove();
      return success;
    };

    const closeModal = () => {
      if (!modal) return;
      modal.classList.remove("active");
      document.body.style.overflow = "";
      setTimeout(() => {
        const image = document.getElementById("qrisModalImg") as HTMLImageElement | null;
        const download = document.getElementById("qrisDownloadBtn") as HTMLAnchorElement | null;
        if (!modal.classList.contains("active")) {
          image?.removeAttribute("src");
          download?.removeAttribute("href");
        }
      }, 200);
    };

    const openModal = (data: { url: string; downloadUrl: string; merchant: string; bank: string; nmid: string }) => {
      if (!modal) return;
      if (!data.url) { showToast("Foto barcode QRIS belum tersedia untuk rekening ini.", "warning"); return; }
      const img = document.getElementById("qrisModalImg") as HTMLImageElement | null;
      const merchant = document.getElementById("qrisModalMerchant");
      const bank = document.getElementById("qrisModalBank");
      const wrap = document.getElementById("qrisModalNmidWrap");
      const nmid = document.getElementById("qrisModalNmid");
      const download = document.getElementById("qrisDownloadBtn") as HTMLAnchorElement | null;
      if (img) img.src = data.url;
      if (merchant) merchant.textContent = data.merchant || "Merchant QRIS";
      if (bank) bank.textContent = data.bank || "QRIS Pembayaran";
      if (download) {
        download.href = data.downloadUrl || data.url;
        const cleanMerchant = (data.merchant || "qris").replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
        download.download = `qris_${cleanMerchant}.png`;
      }
      currentNmid = (data.nmid || "").trim();
      if (wrap && nmid && currentNmid) { nmid.textContent = currentNmid; wrap.style.display = "inline-flex"; }
      else if (wrap) wrap.style.display = "none";
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    };

    const handleDocumentClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const copyButton = target.closest(".btn-copy") as HTMLButtonElement | null;
      if (copyButton) {
        event.stopPropagation();
        const cleanNumber = copyButton.dataset.cleanNumber || (copyButton.dataset.accountNumber || "").replace(/\s+/g, "");
        if (!cleanNumber) return;
        if (await copyToClipboard(cleanNumber)) {
          const bank = copyButton.dataset.bank || "Rekening";
          const original = copyButton.innerHTML;
          copyButton.classList.add("copied");
          copyButton.innerHTML = '<i class="fa-solid fa-check"></i> <span>Tersalin!</span>';
          setTimeout(() => { copyButton.classList.remove("copied"); copyButton.innerHTML = original; }, 2000);
          showToast(`Nomor rekening ${bank} berhasil disalin.`, "success");
        } else {
          showToast("Nomor rekening gagal disalin. Silakan coba lagi.", "error");
        }
        return;
      }

      const toggleNumberButton = target.closest(".btn-toggle-number") as HTMLButtonElement | null;
      if (toggleNumberButton) {
        event.stopPropagation();
        const row = toggleNumberButton.closest(".account-number-row");
        const number = row?.querySelector(".card-account-number") as HTMLElement | null;
        if (!number) return;

        const isVisible = toggleNumberButton.dataset.visible === "true";
        const nextVisible = !isVisible;
        const fullNumber = number.dataset.fullNumber || "";
        const maskedNumber = number.dataset.maskedNumber || "";
        number.textContent = nextVisible ? fullNumber : maskedNumber;
        toggleNumberButton.dataset.visible = String(nextVisible);
        toggleNumberButton.setAttribute("aria-pressed", String(nextVisible));
        const label = nextVisible ? "Sembunyikan nomor rekening" : "Tampilkan nomor rekening";
        toggleNumberButton.setAttribute("aria-label", label);
        toggleNumberButton.title = label;
        toggleNumberButton.innerHTML = `<i class="fa-regular ${nextVisible ? "fa-eye-slash" : "fa-eye"}"></i>`;
        return;
      }

      const qrisButton = target.closest(".btn-view-qris") as HTMLElement | null;
      if (qrisButton) {
        event.stopPropagation();
        openModal({ url: qrisButton.dataset.qrisUrl || "", downloadUrl: qrisButton.dataset.qrisDownload || "", merchant: qrisButton.dataset.merchant || "", bank: qrisButton.dataset.bank || "", nmid: qrisButton.dataset.nmid || "" });
        return;
      }

      const number = target.closest(".card-account-number") as HTMLElement | null;
      if (number) {
        const row = number.closest(".account-number-row");
        const trigger = row?.querySelector(".btn-view-qris, .btn-copy") as HTMLElement | null;
        trigger?.click();
      }
    };

    const filters = document.querySelectorAll<HTMLButtonElement>(".filter-chip");
    const cards = document.querySelectorAll<HTMLElement>(".account-card-wrapper");
    const count = document.getElementById("visibleCount");
    const applyFilter = (filter: string) => {
      let visibleCount = 0;
      cards.forEach((card) => {
        const category = (card.dataset.category || "rekening").toLowerCase();
        const label = (card.dataset.label || "").toLowerCase();
        const bank = (card.dataset.bank || "").toLowerCase();
        let matches = filter === "all";
        if (filter === "qris") matches = category === "qris";
        if (filter === "ewallet") matches = category === "ewallet" || label.includes("wallet") || ["gopay", "ovo", "dana"].some((value) => bank.includes(value));
        if (filter === "rekening" || filter === "bank") matches = category === "rekening" && !label.includes("wallet") && !["gopay", "ovo", "dana"].some((value) => bank.includes(value));
        card.style.display = matches ? "" : "none";
        if (matches) visibleCount++;
      });
      if (count) count.textContent = `${visibleCount} Rekening Aktif`;
    };

    const filterHandlers = Array.from(filters).map((chip) => {
      const handler = () => {
        filters.forEach((item) => item.classList.remove("active"));
        chip.classList.add("active");
        applyFilter(chip.dataset.filter || "all");
      };
      chip.addEventListener("click", handler);
      return () => chip.removeEventListener("click", handler);
    });

    const closeButton = document.getElementById("qrisCloseBtn");
    const backdrop = document.getElementById("qrisBackdrop");
    const copyNmidButton = document.getElementById("qrisCopyNmidBtn");
    const image = document.getElementById("qrisModalImg");
    const keyHandler = (event: KeyboardEvent) => { if (event.key === "Escape") closeModal(); };
    const copyNmidHandler = async () => {
      if (currentNmid && await copyToClipboard(currentNmid.replace(/\s+/g, ""))) {
        showToast("Kode NMID berhasil disalin.", "success");
      } else if (currentNmid) {
        showToast("Kode NMID gagal disalin. Silakan coba lagi.", "error");
      }
    };
    const zoomHandler = () => image?.classList.toggle("zoomed");
    closeButton?.addEventListener("click", closeModal);
    backdrop?.addEventListener("click", closeModal);
    copyNmidButton?.addEventListener("click", copyNmidHandler);
    image?.addEventListener("click", zoomHandler);
    document.addEventListener("keydown", keyHandler);
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", keyHandler);
      closeButton?.removeEventListener("click", closeModal);
      backdrop?.removeEventListener("click", closeModal);
      copyNmidButton?.removeEventListener("click", copyNmidHandler);
      image?.removeEventListener("click", zoomHandler);
      filterHandlers.forEach((remove) => remove());
      if (toastTimer) clearTimeout(toastTimer);
    };
  }, []);

  return null;
}
