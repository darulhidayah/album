import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Album Galeri — Masjid & Yayasan Darul Hidayah Boven Digoel",
  description:
    "Portal dokumentasi visual resmi kegiatan ibadah, santunan anak yatim, TPQ, dan pembangunan Masjid Darul Hidayah (Titik Nol Tanah Merah, Boven Digoel, Papua Selatan).",
  keywords: [
    "Masjid Darul Hidayah",
    "Darul Hidayah Boven Digoel",
    "Album MDH",
    "Galeri Foto Darul Hidayah",
    "Santunan Anak Yatim",
    "Tanah Merah Boven Digoel",
  ],
  authors: [{ name: "Masjid Darul Hidayah", url: "https://mdh.or.id" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Album Galeri — Masjid Darul Hidayah",
    description: "Arsip visual dokumentasi kegiatan Masjid Darul Hidayah Titik Nol Tanah Merah Boven Digoel.",
    url: "https://album.mdh.or.id",
    siteName: "Album Darul Hidayah",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
