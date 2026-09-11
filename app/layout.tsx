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
  applicationName: "MGMT NATION Artist Roster",
  title: {
    default: "MGMT NATION Artist Roster",
    template: "%s | MGMT NATION Artist Roster",
  },
  description: "Full service management for world-class talent.",
  icons: {
    icon: [
      { url: "/favicon.ico?v=5", sizes: "any" },
      { url: "/icon.png?v=5", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico?v=5",
    apple: [
      {
        url: "/apple-touch-icon.png?v=5",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },
  openGraph: {
    title: "MGMT NATION Artist Roster",
    siteName: "MGMT NATION Artist Roster",
    description: "Full service management for world-class talent.",
    type: "website",
    images: [
      {
        url: "/og-mgmt.png?v=4",
        width: 1200,
        height: 630,
        alt: "MGMT NATION",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MGMT NATION Artist Roster",
    description: "Full service management for world-class talent.",
    images: ["/og-mgmt.png?v=4"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
