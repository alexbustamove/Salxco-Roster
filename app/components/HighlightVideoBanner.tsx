"use client";

import { useRef, useState } from "react";

const campaignUrl = "https://www.nespresso.com/us/en/samra-origins";

export function HighlightVideoBanner() {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isExpanded = isHovered || isPinned;

  const openBanner = () => {
    setIsHovered(true);
    void videoRef.current?.play().catch(() => undefined);
  };

  return (
    <section className="highlight-video-banner" aria-labelledby="highlight-video-title">
      <div className="highlight-video-heading">
        <span>Featured</span>
        <span>Hover or tap to expand</span>
      </div>

      <div
        className={`highlight-video-card${isExpanded ? " is-expanded" : ""}`}
        onMouseEnter={openBanner}
        onMouseLeave={() => setIsHovered(false)}
        onFocusCapture={openBanner}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsHovered(false);
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="https://salxco.com/wp-content/uploads/2025/06/NESPRESSO-650x650.jpg"
          aria-label="The Weeknd x Nespresso campaign video"
        >
          <source src="/the-weeknd-nespresso.mp4" type="video/mp4" />
        </video>

        <span className="highlight-video-scrim" aria-hidden="true" />

        <button
          className="highlight-video-expand"
          type="button"
          aria-expanded={isExpanded}
          aria-controls="highlight-video-details"
          aria-label={`${isExpanded ? "Collapse" : "Expand"} The Weeknd x Nespresso highlight`}
          onClick={() => {
            setIsPinned((current) => !current);
            void videoRef.current?.play().catch(() => undefined);
          }}
        >
          <span aria-hidden="true">{isExpanded ? "—" : "+"}</span>
        </button>

        <div className="highlight-video-copy" id="highlight-video-details">
          <p>Nespresso x Samra Origins</p>
          <h2 id="highlight-video-title">The Weeknd</h2>
        </div>

        <a className="highlight-video-cta" href={campaignUrl} target="_blank" rel="noreferrer">
          Explore the campaign <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
