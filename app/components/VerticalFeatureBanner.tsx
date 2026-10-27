"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

const instagramUrl = "https://www.instagram.com/salxco";

const features = [
  {
    eyebrow: "Cover Story",
    title: "The Weeknd — GQ Hong Kong",
    image: "https://salxco.com/wp-content/uploads/2026/09/812612082_18649240456015243_6613627780163443853_n-scaled-600x750.jpg",
  },
  {
    eyebrow: "Culture",
    title: "French Montana x New York Knicks",
    image: "https://salxco.com/wp-content/uploads/2026/07/FM_KNICKS-650x650.jpg",
  },
  {
    eyebrow: "Cover Story",
    title: "French Montana — Rolling Stone",
    image: "https://salxco.com/wp-content/uploads/2026/09/Presenting-Rolling-Stone-Canadas-latest-cover-star-@frenchmontana-💎-More-than-two-decades-int-600x780.jpg",
  },
  {
    eyebrow: "Collaboration",
    title: "WWE x XO",
    image: "https://salxco.com/wp-content/uploads/2026/07/XO_WWE-650x650.jpg",
  },
] as const;

export function VerticalFeatureBanner() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="vertical-feature-banner" aria-label="Featured SALXCO work">
      <div className="vertical-feature-heading">
        <span>Selected Work</span>
        <span>Hover or tap to explore</span>
      </div>

      <div className="vertical-feature-list">
        {features.map((feature, index) => {
          const isActive = activeIndex === index;

          return (
            <article
              className={`vertical-feature-item${isActive ? " is-active" : ""}`}
              key={feature.title}
              onMouseEnter={() => setActiveIndex(index)}
              onFocusCapture={() => setActiveIndex(index)}
            >
              <button
                className="vertical-feature-trigger"
                type="button"
                aria-expanded={isActive}
                onClick={() => setActiveIndex(index)}
              >
                <span className="vertical-feature-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="vertical-feature-title">{feature.title}</span>
                <span className="vertical-feature-action" aria-hidden="true">{isActive ? "—" : "+"}</span>
              </button>

              <div className="vertical-feature-panel" aria-hidden={!isActive}>
                <img src={feature.image} alt="" />
                <div className="vertical-feature-overlay">
                  <p>{feature.eyebrow}</p>
                  <a href={instagramUrl} target="_blank" rel="noreferrer">
                    View on @SALXCO <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
