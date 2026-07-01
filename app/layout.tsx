import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/lib/toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
// Initialize admin user on app startup
import "@/lib/init-admin";

const siteTitle = "UNIKMO | A Physical Key to a Private Memory";
const siteDescription =
  "Create a personalized memory gift with UNIKMO. Upload a private video, voice note, photo, or message and give someone a physical key to unlock it. No app or login required.";
const twitterDescription =
  "Create a personalized memory gift with a private video, voice note, photo, or message unlocked by a physical key.";

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
        <ErrorBoundary>
          <ToastProvider />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
