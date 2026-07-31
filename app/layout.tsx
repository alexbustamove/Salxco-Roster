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
  applicationName: "SALXCO Artist Roster",
  title: {
    default: "SALXCO Artist Roster",
    template: "%s | SALXCO Artist Roster",
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
    title: "SALXCO Artist Roster",
    siteName: "SALXCO Artist Roster",
    description: "Full service management for world-class talent.",
    type: "website",
    images: [
      {
        url: "/og.png?v=2",
        width: 1200,
        height: 630,
        alt: "SALXCO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SALXCO Artist Roster",
    description: "Full service management for world-class talent.",
    images: ["/og.png?v=2"],
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
