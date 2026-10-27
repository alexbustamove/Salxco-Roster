"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

const instagramUrl = "https://www.instagram.com/salxco";

const features = [
  {
    campaign: "GQ Hong Kong",
    artist: "The Weeknd",
    image: "https://salxco.com/wp-content/uploads/2026/09/812612082_18649240456015243_6613627780163443853_n-scaled-600x750.jpg",
  },
  {
    campaign: "New York Knicks",
    artist: "French Montana",
    image: "https://salxco.com/wp-content/uploads/2026/07/FM_KNICKS-650x650.jpg",
  },
  {
    campaign: "Rolling Stone",
    artist: "French Montana",
    image: "https://salxco.com/wp-content/uploads/2026/09/Presenting-Rolling-Stone-Canadas-latest-cover-star-@frenchmontana-💎-More-than-two-decades-int-600x780.jpg",
  },
  {
    campaign: "WWE x XO",
    artist: "The Weeknd",
    image: "https://salxco.com/wp-content/uploads/2026/07/XO_WWE-650x650.jpg",
  },
  {
    campaign: "Toronto Blue Jays x XO",
    artist: "The Weeknd",
    image: "https://salxco.com/wp-content/uploads/2025/10/BJ_XO-650x650.jpg",
  },
  {
    campaign: "Fortnite Festival",
    artist: "The Weeknd",
    image: "https://salxco.com/wp-content/uploads/2025/04/2024-FORTNITE-TW-1-650x650.jpg",
  },
] as const;

export function VerticalFeatureBanner() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const activeIndex = hoveredIndex ?? pinnedIndex;

  return (
    <section className="horizontal-feature-banner" aria-label="Featured SALXCO work">
      <div className="horizontal-feature-heading">
        <span>Selected Work</span>
        <span>Hover or tap to expand</span>
      </div>

      <div
        className={`horizontal-feature-viewport${activeIndex !== null ? " is-paused" : ""}`}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <div className="horizontal-feature-track">
          {[0, 1].map((groupIndex) => (
            <div
              className="horizontal-feature-group"
              aria-hidden={groupIndex === 1 ? "true" : undefined}
              key={groupIndex}
            >
              {features.map((feature, index) => {
                const isActive = activeIndex === index;

                return (
                  <article
                    className={`horizontal-feature-card${isActive ? " is-active" : ""}`}
                    key={`${groupIndex}-${feature.artist}-${feature.campaign}`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onFocusCapture={() => setHoveredIndex(index)}
                    onBlurCapture={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) setHoveredIndex(null);
                    }}
                  >
                    <button
                      className="horizontal-feature-trigger"
                      type="button"
                      tabIndex={groupIndex === 1 ? -1 : 0}
                      aria-expanded={isActive}
                      aria-label={`${isActive ? "Collapse" : "Expand"} ${feature.artist} — ${feature.campaign}`}
                      onClick={() => {
                        setPinnedIndex((current) => current === index ? null : index);
                        setHoveredIndex(null);
                      }}
                    >
                      <img src={feature.image} alt="" />
                      <span className="horizontal-feature-scrim" aria-hidden="true" />
                      <span className="horizontal-feature-copy">
                        <span>{feature.artist}</span>
                        <strong>{feature.campaign}</strong>
                      </span>
                      <span className="horizontal-feature-symbol" aria-hidden="true">
                        {isActive ? "—" : "+"}
                      </span>
                    </button>

                    <a
                      className="horizontal-feature-link"
                      href={instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      tabIndex={isActive && groupIndex === 0 ? 0 : -1}
                    >
                      View on @SALXCO <span aria-hidden="true">↗</span>
                    </a>
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
