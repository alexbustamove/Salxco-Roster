import type { Metadata } from "next";
import { ShowcaseHomeExperience } from "./components/ShowcaseHomeExperience";
import "./home.css";

export const metadata: Metadata = {
  title: { absolute: "SALXCO" },
  description: "World-class talent. Culture-shaping work.",
};

export default function Home() {
  return <ShowcaseHomeExperience />;
}
