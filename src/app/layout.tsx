import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
