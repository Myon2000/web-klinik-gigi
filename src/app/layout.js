import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/landing/JsonLd";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://klinikdrghetty.myon.my.id";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Klinik drg. Hetty Jember | Praktik Dokter Gigi & Perawatan Gigi Profesional",
    template: "%s | Klinik drg. Hetty Jember",
  },
  description:
    "Klinik dokter gigi terpercaya di Kaliwates, Jember. Melayani pembersihan karang gigi (scaling), tambal gigi komposit, cabut gigi, behel/kawat gigi, dan perawatan gusi. Buat janji temu online mudah tanpa login.",
  keywords: [
    "klinik gigi jember",
    "dokter gigi jember",
    "drg hetty jember",
    "klinik drg hetty",
    "praktek dokter gigi jember",
    "dokter gigi kaliwates",
    "klinik gigi kaliwates",
    "scaling jember",
    "tambal gigi jember",
    "cabut gigi jember",
    "behel gigi jember",
    "pemutihan gigi jember",
    "dokter gigi terdekat jember",
    "perawatan gigi jember",
  ],
  authors: [{ name: "drg. Hetty", url: siteUrl }],
  creator: "Klinik drg. Hetty",
  publisher: "Klinik drg. Hetty",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Klinik drg. Hetty Jember | Perawatan Gigi Profesional",
    description:
      "Perawatan gigi modern, profesional, dan nyaman untuk senyum sehat Anda di Kaliwates, Jember. Buat janji temu online langsung tanpa antre.",
    url: siteUrl,
    siteName: "Klinik drg. Hetty",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Klinik drg. Hetty Jember | Dokter Gigi Profesional",
    description:
      "Klinik dokter gigi di Kaliwates Jember. Scaling, tambal gigi, behel, dan cabut gigi. Buat janji online mudah.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "googledfe8476829535dd7",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
