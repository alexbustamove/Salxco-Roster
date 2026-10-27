"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useLayoutEffect, useRef, useState } from "react";

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
  const viewportRef = useRef<HTMLDivElement>(null);
  const interactionTimerRef = useRef<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const activeIndex = hoveredIndex ?? pinnedIndex;
  const selectedFeature = selectedIndex === null ? null : features[selectedIndex];
  const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const beginInteraction = () => {
    setIsInteracting(true);
    if (interactionTimerRef.current !== null) window.clearTimeout(interactionTimerRef.current);
  };

  const endInteraction = () => {
    setIsInteracting(true);
    if (interactionTimerRef.current !== null) window.clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = window.setTimeout(() => setIsInteracting(false), 2400);
  };

  const scrollCampaigns = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const groupWidth = viewport.scrollWidth / 3;
    if (direction < 0 && viewport.scrollLeft < groupWidth * 0.25) viewport.scrollLeft += groupWidth;
    if (direction > 0 && viewport.scrollLeft > groupWidth * 1.75) viewport.scrollLeft -= groupWidth;

    viewport.scrollBy({
      left: direction * Math.min(viewport.clientWidth * 0.78, 420),
      behavior: "smooth",
    });
    endInteraction();
  };

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollLeft = viewport.scrollWidth / 3;
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let frame = 0;
    let previousTime = performance.now();

    const move = (time: number) => {
      const elapsed = Math.min(time - previousTime, 40);
      previousTime = time;

      if (!isInteracting && activeIndex === null && selectedIndex === null) {
        viewport.scrollLeft += elapsed * 0.035;
        const groupWidth = viewport.scrollWidth / 3;
        if (viewport.scrollLeft >= groupWidth * 2) viewport.scrollLeft -= groupWidth;
      }

      frame = window.requestAnimationFrame(move);
    };

    frame = window.requestAnimationFrame(move);
    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex, isInteracting, selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedIndex]);

  useEffect(() => () => {
    if (interactionTimerRef.current !== null) window.clearTimeout(interactionTimerRef.current);
  }, []);

  return (
    <section className="horizontal-feature-banner" aria-label="Featured SALXCO work">
      <div
        ref={viewportRef}
        className={`horizontal-feature-viewport${activeIndex !== null ? " is-paused" : ""}`}
        onMouseLeave={() => setHoveredIndex(null)}
        onPointerDown={beginInteraction}
        onPointerUp={endInteraction}
        onPointerCancel={endInteraction}
        onWheel={endInteraction}
      >
        <div className="horizontal-feature-track">
          {[0, 1, 2].map((groupIndex) => (
            <div
              className="horizontal-feature-group"
              aria-hidden={groupIndex === 1 ? undefined : "true"}
              key={groupIndex}
            >
              {features.map((feature, index) => {
                const isActive = activeIndex === index;

                return (
                  <article
                    className={`horizontal-feature-card${isActive ? " is-active" : ""}`}
                    key={`${groupIndex}-${feature.artist}-${feature.campaign}`}
                    onMouseEnter={() => {
                      if (canHover()) setHoveredIndex(index);
                    }}
                    onFocusCapture={() => {
                      if (canHover()) setHoveredIndex(index);
                    }}
                    onBlurCapture={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) setHoveredIndex(null);
                    }}
                  >
                    <button
                      className="horizontal-feature-trigger"
                      type="button"
                      tabIndex={groupIndex === 1 ? 0 : -1}
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

                    <button
                      className="horizontal-feature-link"
                      type="button"
                      tabIndex={isActive && groupIndex === 1 ? 0 : -1}
                      onClick={() => setSelectedIndex(index)}
                    >
                      View More <span aria-hidden="true">▶</span>
                    </button>
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <button
        className="horizontal-feature-scroll-control is-previous"
        type="button"
        aria-label="View previous campaign"
        onClick={() => scrollCampaigns(-1)}
      >
        ←
      </button>
      <button
        className="horizontal-feature-scroll-control is-next"
        type="button"
        aria-label="View next campaign"
        onClick={() => scrollCampaigns(1)}
      >
        →
      </button>

      {selectedFeature && (
        <div
          className="campaign-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedFeature.artist} — ${selectedFeature.campaign} video`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedIndex(null);
          }}
        >
          <div className="campaign-lightbox-panel">
            <button
              className="campaign-lightbox-close"
              type="button"
              aria-label="Close campaign video"
              onClick={() => setSelectedIndex(null)}
            >
              ×
            </button>
            <video
              src={selectedFeature.video}
              poster={selectedFeature.image}
              autoPlay
              controls
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      )}
    </section>
  );
}
