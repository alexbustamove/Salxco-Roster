"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

const features = [
  {
    campaign: "Mercedes-Benz",
    artist: "The Weeknd",
    image: "https://salxco.com/wp-content/uploads/2025/04/2019-MERCEDES-1-650x650.jpg",
    video: "/campaign-clips/the-weeknd-mercedes.m4v",
  },
  {
    campaign: "Taco Bell",
    artist: "Doja Cat",
    image: "https://salxco.com/wp-content/uploads/2025/04/2022-TACO-BELL-1-650x650.jpg",
    video: "/campaign-clips/doja-cat-taco-bell.m4v",
  },
  {
    campaign: "Monster Energy",
    artist: "French Montana",
    image: "https://salxco.com/wp-content/uploads/2025/04/2024-MONSTER-1-650x650.jpg",
    video: "/campaign-clips/french-montana-monster-energy.m4v",
  },
  {
    campaign: "Red Bull Symphonic",
    artist: "Metro Boomin",
    image: "https://salxco.com/wp-content/uploads/2025/04/2023-REDBULL-SYMPHONIC-1-650x650.jpg",
    video: "/campaign-clips/metro-boomin-redbull-symphonic.m4v",
  },
  {
    campaign: "Fortnite Festival",
    artist: "The Weeknd",
    image: "https://salxco.com/wp-content/uploads/2025/04/2024-FORTNITE-TW-1-650x650.jpg",
    video: "/campaign-clips/the-weeknd-fortnite.m4v",
  },
] as const;

export function VerticalFeatureBanner() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const activeIndex = hoveredIndex ?? pinnedIndex;

  return (
    <section className="horizontal-feature-banner" aria-label="Featured SALXCO work">
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
                      <video
                        autoPlay={isActive}
                        key={`${feature.video}-${isActive ? "playing" : "still"}`}
                        loop
                        muted
                        playsInline
                        poster={feature.image}
                        preload="metadata"
                        src={feature.video}
                      />
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
                      href={feature.video}
                      target="_blank"
                      rel="noreferrer"
                      tabIndex={isActive && groupIndex === 0 ? 0 : -1}
                    >
                      Watch Campaign Film <span aria-hidden="true">↗</span>
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
