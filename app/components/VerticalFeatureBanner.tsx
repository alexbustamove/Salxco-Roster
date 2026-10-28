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
    campaign: "Pepsi",
    artist: "Doja Cat",
    image: "https://salxco.com/wp-content/uploads/2025/04/2021-PEPSI-1-650x650.jpg",
    video: "/campaign-clips/doja-cat-pepsi.mp4",
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
  const loopMetricsRef = useRef({ cycleWidth: 0, middleStart: 0 });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [pinnedCard, setPinnedCard] = useState<string | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const activeCard = hoveredCard ?? pinnedCard;
  const selectedFeature = selectedIndex === null ? null : features[selectedIndex];
  const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const clearActiveCard = () => {
    setHoveredCard(null);
    setPinnedCard(null);
  };

  const beginInteraction = () => {
    clearActiveCard();
    setIsInteracting(true);
    if (interactionTimerRef.current !== null) window.clearTimeout(interactionTimerRef.current);
  };

  const endInteraction = () => {
    setIsInteracting(true);
    if (interactionTimerRef.current !== null) window.clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = window.setTimeout(() => setIsInteracting(false), 2400);
  };

  const measureLoop = () => {
    const viewport = viewportRef.current;
    if (!viewport) return null;

    const groups = viewport.querySelectorAll<HTMLElement>(".horizontal-feature-group");
    if (groups.length < 3) return null;

    const cycleWidth = groups[1].offsetLeft - groups[0].offsetLeft;
    const middleStart = groups[1].offsetLeft;
    loopMetricsRef.current = { cycleWidth, middleStart };
    return loopMetricsRef.current;
  };

  const normalizeLoop = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const metrics = loopMetricsRef.current.cycleWidth > 0
      ? loopMetricsRef.current
      : measureLoop();
    if (!metrics) return;

    const lowerBoundary = metrics.middleStart - metrics.cycleWidth * 0.5;
    const upperBoundary = metrics.middleStart + metrics.cycleWidth * 0.5;

    if (viewport.scrollLeft < lowerBoundary) viewport.scrollLeft += metrics.cycleWidth;
    if (viewport.scrollLeft > upperBoundary) viewport.scrollLeft -= metrics.cycleWidth;
  };

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const centerLoop = () => {
      const metrics = measureLoop();
      if (metrics) viewport.scrollLeft = metrics.middleStart;
    };

    centerLoop();
    let previousWidth = viewport.clientWidth;
    const recenterAfterWidthChange = () => {
      if (viewport.clientWidth === previousWidth) return;
      previousWidth = viewport.clientWidth;
      centerLoop();
    };

    window.addEventListener("resize", recenterAfterWidthChange);
    return () => window.removeEventListener("resize", recenterAfterWidthChange);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let frame = 0;
    let previousTime = performance.now();

    const move = (time: number) => {
      const elapsed = Math.min(time - previousTime, 40);
      previousTime = time;

      if (!isInteracting && activeCard === null && selectedIndex === null) {
        viewport.scrollLeft += elapsed * 0.035;
        normalizeLoop();
      }

      frame = window.requestAnimationFrame(move);
    };

    frame = window.requestAnimationFrame(move);
    return () => window.cancelAnimationFrame(frame);
  }, [activeCard, isInteracting, selectedIndex]);

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
        className={`horizontal-feature-viewport${activeCard !== null ? " is-paused" : ""}`}
        onMouseLeave={() => setHoveredCard(null)}
        onPointerDown={beginInteraction}
        onPointerUp={endInteraction}
        onPointerCancel={endInteraction}
        onWheel={() => {
          clearActiveCard();
          endInteraction();
        }}
        onScroll={normalizeLoop}
      >
        <div className="horizontal-feature-track">
          {[0, 1, 2].map((groupIndex) => (
            <div
              className="horizontal-feature-group"
              aria-hidden={groupIndex === 1 ? undefined : "true"}
              key={groupIndex}
            >
              {features.map((feature, index) => {
                const cardKey = `${groupIndex}-${index}`;
                const isActive = activeCard === cardKey;

                return (
                  <article
                    className={`horizontal-feature-card${isActive ? " is-active" : ""}`}
                    key={`${groupIndex}-${feature.artist}-${feature.campaign}`}
                    onMouseEnter={() => {
                      if (canHover()) setHoveredCard(cardKey);
                    }}
                    onFocusCapture={() => {
                      if (canHover()) setHoveredCard(cardKey);
                    }}
                    onBlurCapture={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) setHoveredCard(null);
                    }}
                  >
                    <button
                      className="horizontal-feature-trigger"
                      type="button"
                      tabIndex={groupIndex === 1 ? 0 : -1}
                      aria-expanded={isActive}
                      aria-label={`${isActive ? "Collapse" : "Expand"} ${feature.artist} — ${feature.campaign}`}
                      onClick={() => {
                        setPinnedCard((current) => current === cardKey ? null : cardKey);
                        setHoveredCard(null);
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
