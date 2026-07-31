import { notFound } from "next/navigation";
import { RosterExperience } from "../../components/RosterExperience";
import { artists } from "../../data/artists";

type ArtistProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArtistProfilePage({ params }: ArtistProfilePageProps) {
  const { slug } = await params;
  if (!artists.some((artist) => artist.slug === slug)) notFound();

  return <RosterExperience initialSlug={slug} />;
}
