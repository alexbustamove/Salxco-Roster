"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArtistCard } from "./ArtistCard";
import { ArtistProfile } from "./ArtistProfile";
import { artists, categories, type ArtistCategory } from "../data/artists";

type RosterExperienceProps = {
  initialSlug?: string;
};

const normalizeSearch = (value: string) =>
  value.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function RosterExperience({ initialSlug }: RosterExperienceProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ArtistCategory>("All Artists");
  const [selectedSlug, setSelectedSlug] = useState(
    initialSlug && artists.some((artist) => artist.slug === initialSlug) ? initialSlug : null,
  );
  const filteredArtists = useMemo(() => {
    const normalized = normalizeSearch(query.trim());
    return artists.filter((artist) => {
      const matchesName = normalizeSearch(artist.name).includes(normalized);
      const matchesCategory = activeCategory === "All Artists" || artist.category === activeCategory;
      return matchesName && matchesCategory;
    });
  }, [activeCategory, query]);

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
        <div>
          <h1 id="roster-title">
            <span>The</span>
            <span>Roster.</span>
          </h1>
        </div>
        <p className="intro-tagline">Full service management for world-class talent.</p>
      </section>

      <div className={`roster-layout${selectedArtist ? " has-profile" : ""}`}>
        <section className="roster-content" aria-label="Artist roster">
          <div className="roster-controls">
            <label className="search-field">
              <span className="search-symbol" aria-hidden="true">⌕</span>
              <span className="sr-only">Search artists by name</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search artists"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear artist search">
                  ×
                </button>
              )}
            </label>

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
            <span>{String(filteredArtists.length).padStart(2, "0")} artists</span>
            <span>{activeCategory}</span>
          </div>

          {filteredArtists.length ? (
            <div className="artist-grid">
              {filteredArtists.map((artist, index) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  priority={index < 5}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">00</span>
              <h2>No artists found.</h2>
              <p>Try a different name or clear the current filter.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All Artists");
                }}
              >
                View full roster
              </button>
            </div>
          )}
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
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/artists" className="footer-brand" aria-label="SALXCO artist roster home">
            <img
              className="footer-brand-logo"
              src="/salxco-logo-white.png"
              alt=""
              width={1976}
              height={2118}
            />
          </a>
          <p className="footer-copyright">
            <span>Copyright © 2026 SALXCO | XO MGMT.</span>
            <span>All rights reserved.</span>
          </p>
        </div>
        <a href="#roster-title">Back to top ↑</a>
      </footer>
    </main>
  );
}
