import type { Metadata } from "next";
import { ShowcaseHomeExperience } from "./components/ShowcaseHomeExperience";
import "./home.css";

export const metadata: Metadata = {
  title: { absolute: "MGMT NATION" },
  description: "Full service management for world-class talent.",
};

type HomeProps = {
  searchParams: Promise<{ colorway?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { colorway } = await searchParams;

  return (
    <ShowcaseHomeExperience
      colorway={colorway === "black" ? "black" : "gold"}
      withFeatureBanner
    />
  );
}
