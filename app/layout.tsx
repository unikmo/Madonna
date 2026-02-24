import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/lib/toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
// Initialize admin user on app startup
import "@/lib/init-admin";

export const metadata: Metadata = {
  title: "UNIKMO - Gifting Platform",
  description: "Secure gifting platform with Moment Codes",
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
