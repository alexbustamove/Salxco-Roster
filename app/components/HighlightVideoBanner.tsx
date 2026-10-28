"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";

type Highlight = {
  artist: string;
  campaign: string;
  image: string;
  imagePosition?: string;
  video?: string;
  href: string;
};

const highlights: readonly Highlight[] = [
  {
    artist: "The Weeknd",
    campaign: "Nespresso",
    image: "https://salxco.com/wp-content/uploads/2025/06/NESPRESSO-650x650.jpg",
    video: "/the-weeknd-nespresso.mp4",
    href: "https://www.nespresso.com/us/en/samra-origins",
  },
  {
    artist: "French Montana",
    campaign: "Ballon D'Or",
    image: "/artists/9_French_Montana.jpg",
    imagePosition: "center 24%",
    video: "/campaign-clips/french-montana-ballon-dor.mp4",
    href: "https://www.instagram.com/frenchmontana/",
  },
  {
    artist: "Swedish House Mafia",
    campaign: "IKEA",
    image: "https://salxco.com/wp-content/uploads/2025/04/2021-IKEA-1-650x650.jpg",
    video: "/campaign-clips/swedish-house-mafia-ikea.mp4",
    href: "https://www.bloomberg.com/news/articles/2022-09-09/ikea-s-swedish-house-mafia-furniture-collection-is-monotone-but-not-boring",
  },
  {
    artist: "Doja Cat",
    campaign: "Taco Bell",
    image: "https://salxco.com/wp-content/uploads/2025/04/2022-TACO-BELL-1-650x650.jpg",
    video: "/campaign-clips/doja-cat-taco-bell.m4v",
    href: "https://pitchfork.com/news/doja-cat-covers-hole-celebrity-skin-for-taco-bell-super-bowl-2022-ad-watch/",
  },
];

export function HighlightVideoBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const dragStateRef = useRef({
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });
  const suppressClickRef = useRef(false);
  const isExpanded = true;
  const activeHighlight = highlights[activeIndex];

  const goToSlide = (index: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const nextIndex = (index + highlights.length) % highlights.length;
    viewport.scrollTo({ left: viewport.clientWidth * nextIndex, behavior: "auto" });
    setActiveIndex(nextIndex);
  };

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeIndex) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  return (
    <section className="highlight-video-banner" aria-label="Featured campaign highlights">
      <div
        className={`highlight-video-card${isExpanded ? " is-expanded" : ""}`}
        aria-label={`${activeHighlight.artist} — ${activeHighlight.campaign}`}
        onClickCapture={(event) => {
          if (!suppressClickRef.current) return;
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <div
          ref={viewportRef}
          className={`highlight-video-viewport${isDragging ? " is-dragging" : ""}`}
          onPointerDown={(event) => {
            if (event.pointerType !== "mouse" || event.button !== 0) return;

            dragStateRef.current = {
              pointerId: event.pointerId,
              startX: event.clientX,
              startScrollLeft: event.currentTarget.scrollLeft,
              moved: false,
            };
            suppressClickRef.current = false;
            setIsDragging(true);
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            const drag = dragStateRef.current;
            if (drag.pointerId !== event.pointerId) return;

            const distance = event.clientX - drag.startX;
            if (Math.abs(distance) > 5) {
              drag.moved = true;
              suppressClickRef.current = true;
            }
            event.currentTarget.scrollLeft = drag.startScrollLeft - distance;
          }}
          onPointerUp={(event) => {
            const drag = dragStateRef.current;
            if (drag.pointerId !== event.pointerId) return;

            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
            setIsDragging(false);
            dragStateRef.current.pointerId = -1;

            if (drag.moved) {
              const nextIndex = Math.round(
                event.currentTarget.scrollLeft / Math.max(event.currentTarget.clientWidth, 1),
              );
              goToSlide(nextIndex);
              window.setTimeout(() => {
                suppressClickRef.current = false;
              }, 0);
            }
          }}
          onPointerCancel={(event) => {
            if (dragStateRef.current.pointerId !== event.pointerId) return;
            setIsDragging(false);
            dragStateRef.current.pointerId = -1;
            suppressClickRef.current = false;
          }}
          onScroll={(event) => {
            const viewport = event.currentTarget;
            const nextIndex = Math.round(viewport.scrollLeft / Math.max(viewport.clientWidth, 1));
            if (nextIndex !== activeIndex) setActiveIndex(nextIndex);
          }}
        >
          <div className="highlight-video-track">
            {highlights.map((highlight, index) => (
              <article
                className="highlight-video-slide"
                aria-hidden={index === activeIndex ? undefined : "true"}
                key={`${highlight.artist}-${highlight.campaign}`}
              >
                {highlight.video ? (
                  <video
                    ref={(node) => { videoRefs.current[index] = node; }}
                    autoPlay={index === 0}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={highlight.image}
                    style={{ objectPosition: highlight.imagePosition }}
                    aria-label={`${highlight.artist} — ${highlight.campaign} campaign video`}
                  >
                    <source src={highlight.video} />
                  </video>
                ) : (
                  <img
                    src={highlight.image}
                    alt=""
                    style={{ objectPosition: highlight.imagePosition }}
                  />
                )}

                <span className="highlight-video-scrim" aria-hidden="true" />

                <div className="highlight-video-copy">
                  <p>{highlight.artist}</p>
                  <h2>{highlight.campaign}</h2>
                </div>

                <a
                  className="highlight-video-cta"
                  href={highlight.href}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={index === activeIndex && isExpanded ? 0 : -1}
                >
                  View campaign <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        </div>

        <div className="highlight-video-pagination" aria-label="Choose a campaign">
          {highlights.map((highlight, index) => (
            <button
              className={index === activeIndex ? "is-active" : ""}
              type="button"
              aria-label={`Show ${highlight.artist} — ${highlight.campaign}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => goToSlide(index)}
              key={`${highlight.campaign}-pagination`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
