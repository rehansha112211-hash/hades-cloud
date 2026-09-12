import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

const montserrat = Montserrat({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Montserrat({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const display = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Minecraft-style pixelated font — used SPARINGLY for accents only (badges, logo)
import { Press_Start_2P } from "next/font/google";
const pixelFont = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hades Cloud — Premium Minecraft Server Hosting",
    template: "%s | Hades Cloud",
  },
  description:
    "High-performance Minecraft hosting built for players, communities and serious server owners. NVMe storage, powerful Ryzen processors, DDoS protection and instant deployment on Hades Cloud.",
  keywords: [
    "Minecraft hosting",
    "Minecraft server hosting",
    "cheap Minecraft hosting",
    "NVMe Minecraft hosting",
    "Ryzen Minecraft server",
    "DDoS protected Minecraft",
    "Hades Cloud",
    "game server hosting",
    "India Minecraft hosting",
  ],
  authors: [{ name: "Hades Cloud" }],
  creator: "Hades Cloud",
  publisher: "Hades Cloud",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Hades Cloud — Premium Minecraft Server Hosting",
    description:
      "Power your world without limits. NVMe storage, Ryzen processors, DDoS protection and instant deployment.",
    url: siteUrl,
    siteName: "Hades Cloud",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hades Cloud — Premium Minecraft Server Hosting",
    description:
      "Power your world without limits. High-performance Minecraft hosting with NVMe storage, DDoS protection and instant deployment.",
  },
  icons: { icon: "/images/brand/logo.png" },
  category: "technology",
};

export const viewport = {
  themeColor: "#0a0d18",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${geistMono.variable} ${display.variable} ${pixelFont.variable} antialiased bg-background text-foreground font-sans`}
      >
        <Providers>
          {children}
          <Toaster />
          <SonnerToaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
