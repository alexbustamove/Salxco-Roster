"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArtistCard } from "./ArtistCard";
import { ArtistProfile } from "./ArtistProfile";
import { artists, categories, sectionOrder, type ArtistCategory } from "../data/artists";

type RosterExperienceProps = {
  initialSlug?: string;
};

export function RosterExperience({ initialSlug }: RosterExperienceProps) {
  const [activeCategory, setActiveCategory] = useState<ArtistCategory>("Artists");
  const [selectedSlug, setSelectedSlug] = useState(
    initialSlug && artists.some((artist) => artist.slug === initialSlug) ? initialSlug : null,
  );
  const filteredArtists = useMemo(() => {
    const order = sectionOrder[activeCategory];
    return artists
      .filter((artist) => artist.sections.includes(activeCategory))
      .sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
  }, [activeCategory]);
  const emptySlots = Math.max(0, sectionOrder.Artists.length - filteredArtists.length);

  const selectedArtist = artists.find((artist) => artist.slug === selectedSlug) ?? null;
  const selectedIndex = selectedArtist ? artists.findIndex((artist) => artist.slug === selectedArtist.slug) : -1;

  const updateUrl = useCallback((slug: string | null, replace = false) => {
    const nextPath = slug ? `/artists/${slug}` : "/artists";
    window.history[replace ? "replaceState" : "pushState"]({}, "", nextPath);
  }, []);

  const closeProfile = useCallback(() => {
    setSelectedSlug(null);
    updateUrl(null);
  }, [updateUrl]);

  const navigateArtist = useCallback((direction: -1 | 1) => {
    setSelectedSlug((currentSlug) => {
      const currentIndex = Math.max(0, artists.findIndex((artist) => artist.slug === currentSlug));
      const nextIndex = (currentIndex + direction + artists.length) % artists.length;
      updateUrl(artists[nextIndex].slug, true);
      return artists[nextIndex].slug;
    });
  }, [updateUrl]);

  useEffect(() => {
    const syncFromHistory = () => {
      const parts = window.location.pathname.split("/").filter(Boolean);
      const slug = parts[0] === "artists" && parts[1] ? parts[1] : null;
      setSelectedSlug(artists.some((artist) => artist.slug === slug) ? slug : null);
    };
    window.addEventListener("popstate", syncFromHistory);
    return () => window.removeEventListener("popstate", syncFromHistory);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("profile-open", Boolean(selectedArtist));
    return () => document.body.classList.remove("profile-open");
  }, [selectedArtist]);

  return (
    <main className="site-shell">
      <section className="intro" aria-labelledby="roster-title">
        <h1 id="roster-title" className="sr-only">MGMT NATION Artist Roster</h1>
        <img
          className="intro-logo"
          src="/mgmt-nation-logo.png"
          alt="MGMT NATION"
          width={556}
          height={129}
        />
        <p className="intro-tagline">Full service management for world-class talent.</p>
      </section>

      <div className={`roster-layout${selectedArtist ? " has-profile" : ""}`}>
        <section className="roster-content" aria-label="Artist roster">
          <div className="roster-controls">
            <div className="filter-list" aria-label="Filter artists by category">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={activeCategory === category ? "is-active" : ""}
                  aria-pressed={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="roster-status" aria-live="polite">
            <span>{activeCategory}</span>
          </div>

          <div className="artist-grid">
            {filteredArtists.map((artist, index) => (
              <ArtistCard
                key={artist.slug}
                artist={artist}
                categoryLabel={activeCategory}
                priority={index < 5}
              />
            ))}
            {Array.from({ length: emptySlots }, (_, index) => (
              <div
                key={`empty-${activeCategory}-${index}`}
                className="artist-card artist-card-placeholder"
                aria-hidden="true"
              />
            ))}
          </div>
        </section>

        {selectedArtist && (
          <ArtistProfile
            key={selectedArtist.slug}
            artist={selectedArtist}
            position={selectedIndex}
            total={artists.length}
            onClose={closeProfile}
            onPrevious={() => navigateArtist(-1)}
            onNext={() => navigateArtist(1)}
          />
        )}
      </div>

      <footer className="site-footer">
        <div className="footer-center">
          <div className="footer-brand">
            <img
              className="footer-brand-logo"
              src="/mgmt-nation-logo.png"
              alt="MGMT NATION"
              width={556}
              height={129}
            />
          </div>
          <p className="footer-copyright">
            <span>Copyright © 2026 MGMT NATION.</span>
            <span>All rights reserved.</span>
          </p>
        </div>
        <a className="back-to-top" href="#roster-title" aria-label="Back to top">
          <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </main>
  );
}
