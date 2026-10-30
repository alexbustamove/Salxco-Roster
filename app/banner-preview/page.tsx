import type { Metadata } from "next";
import { ShowcaseHomeExperience } from "../components/ShowcaseHomeExperience";
import "../home.css";

export const metadata: Metadata = {
  title: { absolute: "SALXCO — Feature Banner Preview" },
  description: "A vertical feature banner concept for SALXCO.",
  robots: { index: false, follow: false },
};

export default function BannerPreviewPage() {
  return (
    <ShowcaseHomeExperience
      withFeatureBanner
    />
  );
}
