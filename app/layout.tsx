import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/lib/toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import SiteEntityJsonLd from "@/components/SiteEntityJsonLd";
// Initialize admin user on app startup
import "@/lib/init-admin";

const siteTitle = "UNIKMO | Turn a Precious Memory Into a Lasting Gift";
const siteDescription =
  "Create a private video, voice note, photo, or written message and connect it to a physical UNIKMO card someone can keep and revisit. No app, login, or ads.";
const twitterDescription =
  "Turn a private video, voice note, photo, or message into a physical gift someone can revisit.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.unikmo.com"),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "https://www.unikmo.com/",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    url: "https://www.unikmo.com/",
    siteName: "UNIKMO",
    images: ["https://www.unikmo.com/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: twitterDescription,
    images: ["https://www.unikmo.com/og-image.jpg"],
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
        <SiteEntityJsonLd />
        <ErrorBoundary>
          <ToastProvider />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
