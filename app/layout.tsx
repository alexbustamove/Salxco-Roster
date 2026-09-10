import type { Metadata } from "next";
import "./globals.css";

const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://salxco-artist-roster.alexbm521.chatgpt.site");

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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "/apple-touch-icon.png",
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
        url: "/og-mgmt.png?v=3",
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
    images: ["/og-mgmt.png?v=3"],
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
