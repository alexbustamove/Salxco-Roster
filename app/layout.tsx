import type { Metadata } from "next";
import "./globals.css";

const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://roster.salxco.com");

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  applicationName: "MGMT NATION",
  title: {
    default: "MGMT NATION",
    template: "%s | MGMT NATION",
  },
  description: "Full service management for world-class talent.",
  icons: {
    icon: [
      { url: "/favicon-inverted.png?v=6", type: "image/png", sizes: "64x64" },
      { url: "/icon-inverted.png?v=6", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon-inverted.png?v=6",
    apple: [
      {
        url: "/apple-touch-icon-inverted.png?v=6",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },
  openGraph: {
    title: "MGMT NATION",
    siteName: "MGMT NATION",
    description: "Full service management for world-class talent.",
    type: "website",
    images: [
      {
        url: "/og-mgmt-black.jpg?v=3",
        width: 1200,
        height: 630,
        alt: "MGMT NATION",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MGMT NATION",
    description: "Full service management for world-class talent.",
    images: ["/og-mgmt-black.jpg?v=3"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-preview-theme="gold-white-premium">
      <body>{children}</body>
    </html>
  );
}
