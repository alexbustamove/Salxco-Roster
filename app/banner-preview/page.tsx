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

  return (
    <ShowcaseHomeExperience
      colorway={colorway === "gold" ? "gold" : "black"}
      withFeatureBanner
    />
  );
}
