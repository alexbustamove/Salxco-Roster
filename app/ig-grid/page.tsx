import type { Metadata } from "next";
import { HomeExperience } from "../components/HomeExperience";
import "../home.css";

export const metadata: Metadata = {
  title: { absolute: "SALXCO Instagram Grid Concept" },
  description: "Saved SALXCO Instagram-grid homepage concept.",
};

export default function InstagramGridConcept() {
  return <HomeExperience />;
}
