import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Minecraft-style pixelated font for headings/accents
const pixelFont = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Monospace pixel font for console / code / labels
const vt323 = VT323({
  variable: "--font-vt323",
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
  icons: { icon: "/favicon.svg" },
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
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${pixelFont.variable} ${vt323.variable} antialiased bg-background text-foreground`}
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
