import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { RouteProgress } from "@/components/route-progress";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://perpetual-os-inoon.vercel.app"),
  title: {
    default: "Perpetual — Nonprofit OS + Donor Marketplace",
    template: "%s | Perpetual",
  },
  description:
    "Discover nonprofits by what they achieve. Real outcome data, live financials, and one checkout for every giving method.",
  openGraph: {
    title: "Perpetual — Nonprofit OS + Donor Marketplace",
    description:
      "Discover nonprofits by what they achieve. Real outcome data, live financials, and one checkout for every giving method.",
    siteName: "Perpetual",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium">
          Skip to main content
        </a>
        <RouteProgress />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
