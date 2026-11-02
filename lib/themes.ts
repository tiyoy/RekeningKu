export const CARD_THEMES: Record<string, { name: string; gradient: string; glow: string; badgeBg: string; badgeText: string }> = {
  sapphire: { name: "Deep Sapphire", gradient: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)", glow: "rgba(37, 99, 235, 0.35)", badgeBg: "rgba(250, 204, 21, 0.2)", badgeText: "#fef08a" },
  "sapphire-dark": { name: "Royal Navy", gradient: "linear-gradient(135deg, #1e40af 0%, #172554 100%)", glow: "rgba(30, 64, 175, 0.3)", badgeBg: "rgba(147, 197, 253, 0.2)", badgeText: "#dbeafe" },
  emerald: { name: "Emerald Wealth", gradient: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)", glow: "rgba(16, 185, 129, 0.3)", badgeBg: "rgba(52, 211, 153, 0.2)", badgeText: "#a7f3d0" },
  obsidian: { name: "Obsidian Onyx", gradient: "linear-gradient(135deg, #1f2937 0%, #0b0f19 100%)", glow: "rgba(15, 23, 42, 0.4)", badgeBg: "rgba(255, 255, 255, 0.15)", badgeText: "#f1f5f9" },
  violet: { name: "Imperial Violet", gradient: "linear-gradient(135deg, #4c1d95 0%, #1e1b4b 100%)", glow: "rgba(124, 58, 237, 0.3)", badgeBg: "rgba(192, 132, 252, 0.2)", badgeText: "#f3e8ff" },
  amber: { name: "Sunset Amber", gradient: "linear-gradient(135deg, #7c2d12 0%, #1c1917 100%)", glow: "rgba(217, 119, 6, 0.3)", badgeBg: "rgba(251, 191, 36, 0.2)", badgeText: "#fef3c7" }
};

export function getCardTheme(theme: string) {
  return CARD_THEMES[theme] ?? CARD_THEMES.sapphire;
}

export function formatAccountPan(value: string) {
  return (value ?? "").replace(/\s+/g, "").match(/.{1,4}/g)?.join(" ") ?? "";
}

export function getCategoryMeta(category: string) {
  if (category === "ewallet") return { name: "E-Wallet", badgeClass: "badge-ewallet", icon: "fa-solid fa-wallet" };
  if (category === "qris") return { name: "QRIS", badgeClass: "badge-qris", icon: "fa-solid fa-qrcode" };
  return { name: "Bank", badgeClass: "badge-bank", icon: "fa-solid fa-building-columns" };
}
