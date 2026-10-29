import type { Metadata } from "next";
import { ShowcaseHomeExperience } from "../components/ShowcaseHomeExperience";
import "../home.css";

export const metadata: Metadata = {
  title: { absolute: "SALXCO — Feature Banner Preview" },
  description: "A vertical feature banner concept for SALXCO.",
  robots: { index: false, follow: false },
};

type BannerPreviewPageProps = {
  searchParams: Promise<{ colorway?: string }>;
};

export default async function BannerPreviewPage({ searchParams }: BannerPreviewPageProps) {
  const { colorway } = await searchParams;
  const selectedColorway = colorway === "gold"
    || colorway === "antique-gold"
    || colorway === "antique-white"
    || colorway === "black-gold"
    || colorway === "black-antique-texture"
    || colorway === "black-gold-motion"
    || colorway === "black-antique-motion"
    ? colorway
    : "black";

  return (
    <ShowcaseHomeExperience
      colorway={selectedColorway}
      withFeatureBanner
    />
  );
}
