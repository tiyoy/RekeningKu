import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./styles/style.css";
import "./styles/admin.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rekening Pembayaran Resmi - RekeningKu",
  description: "Daftar nomor rekening bank, dompet digital, dan QRIS untuk kemudahan transaksi pembayaran."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body>{children}</body>
    </html>
  );
}
