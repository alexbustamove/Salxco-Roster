import type { Metadata } from "next";
import { ShowcaseHomeExperience } from "./components/ShowcaseHomeExperience";
import "./home.css";

export const metadata: Metadata = {
  title: { absolute: "MGMT NATION" },
  description: "Full service management for world-class talent.",
};

export default function Home() {
  return (
    <ShowcaseHomeExperience
      withFeatureBanner
    />
  );
}
