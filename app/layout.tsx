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
  title: {
    default: "SALXCO — Artist Roster",
    template: "%s — SALXCO",
  },
  description: "Full service management for world-class talent.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
  },
  openGraph: {
    title: "SALXCO — Artist Roster",
    description: "Full service management for world-class talent.",
    type: "website",
    images: [{ url: "/og.png", width: 960, height: 505, alt: "SALXCO artist roster" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SALXCO — Artist Roster",
    description: "Full service management for world-class talent.",
    images: ["/og.png"],
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
