import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://salxco-artist-roster.alexbm521.chatgpt.site"),
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
