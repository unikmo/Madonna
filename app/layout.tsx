import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/lib/toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
// Initialize admin user on app startup
import "@/lib/init-admin";

const siteDescription =
  "Looking for long distance gift ideas or a meaningful gift when you can't be there? This emotional gift helps you send a personal message, video, or memory in a simple and lasting way.";

export const metadata: Metadata = {
  title: "UNIKMO - Gifting Platform",
  description: siteDescription,
  keywords: [
    "long distance gift ideas",
    "emotional gift",
    "meaningful gift",
  ],
  openGraph: {
    title: "UNIKMO - Gifting Platform",
    description: siteDescription,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UNIKMO - Gifting Platform",
    description: siteDescription,
  },
};

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased font-sans">
        <ErrorBoundary>
          <ToastProvider />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
