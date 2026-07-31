import type { CSSProperties } from "react";
import type { Artist } from "../data/artists";
import { ArtistImage } from "./ArtistImage";

type ArtistCardProps = {
  artist: Artist;
  priority?: boolean;
};

export function ArtistCard({ artist, priority }: ArtistCardProps) {
  const cropScale = artist.cropScale ?? (artist.isDuo ? 1 : 1.025);

  return (
    <article className="artist-card">
      <a
        className="artist-card-button"
        href={artist.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${artist.name} on Instagram`}
        style={{
          "--crop-y": `${artist.cropY}%`,
          "--crop-scale": cropScale,
          "--crop-hover-scale": cropScale + 0.035,
          "--crop-offset-y": `${artist.cropOffsetY ?? 0}%`,
        } as CSSProperties}
      >
        <ArtistImage src={artist.image} alt={artist.imageAlt} priority={priority} />
        <span className="card-gradient" aria-hidden="true" />
        <span className="card-index" aria-hidden="true">{artist.id}</span>
        <span className="card-glass">
          <strong>{artist.name}</strong>
          <span>{artist.category}</span>
        </span>
      </a>
    </article>
  );
}
