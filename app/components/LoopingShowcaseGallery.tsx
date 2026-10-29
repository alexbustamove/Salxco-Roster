"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { accoladeItems } from "../data/accolades";
import { lifestyleMediaItems } from "../data/lifestyleMedia";
import { partnershipItems } from "../data/partnerships";

type LoopItem = {
  id: string;
  title: string;
  href: string;
  image: string;
};

type LoopingShowcaseRowProps = {
  category: "brand" | "magazine" | "accolade";
  direction: 1 | -1;
  items: LoopItem[];
  label: string;
  onOpenMedia: (item: LoopItem) => void;
};

const splitIntoRows = (items: LoopItem[]) => [
  items.filter((_, index) => index % 2 === 0),
  items.filter((_, index) => index % 2 === 1),
];

const brandRows = splitIntoRows(partnershipItems.slice(0, 24));
const magazineRows = splitIntoRows(lifestyleMediaItems);
const accoladeRows = splitIntoRows(
  accoladeItems.map((item) => ({ ...item, href: item.image })),
);

const sections = [
  { category: "brand", title: "Brand Partnerships", rows: brandRows },
  { category: "magazine", title: "Media", rows: magazineRows },
  { category: "accolade", title: "Achievements", rows: accoladeRows },
] as const;

function getArtistKey(item: LoopItem) {
  const searchable = `${item.title} ${item.href} ${item.image}`.toLowerCase();
  const knownArtists = [
    ["the-weeknd", /the[\s-]weeknd|\bweeknd\b|\btw\b|\bxo\b|nespresso|samra|fortnite|\bhhn\b|bluejays|wwe|\bliv\b|apple.*\(tw\)/],
    ["french-montana", /french[\s-]montana|\bfm_|monster[\s-]energy/],
    ["doja-cat", /doja[\s-]cat|taco[\s-]bell|urban[\s-]decay/],
    ["metro-boomin", /metro[\s-]boomin|redbull[\s-]symphonic|zero[\s-]comics/],
    ["elyanna", /\belyanna\b|\bcoach\b/],
    ["hope-tala", /hope[\s-]tala|freepeople|\bfps\b/],
    ["austin-millz", /austin[\s-]millz|\bnutrl\b/],
    ["bebe-rexha", /bebe[\s-]rexha|provocativo/],
    ["brandy", /\bbrandy\b|stellarosa/],
    ["ty-dolla-sign", /ty[\s-]dolla|smirnoff/],
  ] as const;
  const knownArtist = knownArtists.find(([, pattern]) => pattern.test(searchable));

  if (knownArtist) return knownArtist[0];
  return item.title.split(/\s+(?:-|—)\s+/)[0].trim().toLowerCase();
}

function shuffleWithoutAdjacentArtists(items: LoopItem[]) {
  const artistGroups = new Map<string, LoopItem[]>();

  for (const item of items) {
    const artist = getArtistKey(item);
    const group = artistGroups.get(artist) ?? [];
    group.push(item);
    artistGroups.set(artist, group);
  }

  let lastShuffle = [...items];

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const remaining = [...artistGroups.entries()].map(([artist, groupItems]) => ({
      artist,
      items: [...groupItems].sort(() => Math.random() - 0.5),
    }));
    const shuffled: LoopItem[] = [];
    let previousArtist: string | null = null;

    while (remaining.length > 0) {
      const candidates = remaining.filter(({ artist }) => artist !== previousArtist);
      const candidatePool = candidates.length > 0 ? candidates : remaining;
      candidatePool.sort((a, b) => (
        b.items.length - a.items.length || Math.random() - 0.5
      ));

      const selectedGroup = candidatePool[0];
      const selectedItem = selectedGroup.items.pop();
      if (selectedItem) shuffled.push(selectedItem);
      previousArtist = selectedGroup.artist;

      if (selectedGroup.items.length === 0) {
        remaining.splice(remaining.indexOf(selectedGroup), 1);
      }
    }
    lastShuffle = shuffled;

    if (
      shuffled.length < 2
      || getArtistKey(shuffled[0]) !== getArtistKey(shuffled[shuffled.length - 1])
    ) return shuffled;
  }

  return lastShuffle;
}

function LoopingShowcaseRow({
  category,
  direction,
  items,
  label,
  onOpenMedia,
}: LoopingShowcaseRowProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const loopMetricsRef = useRef({ cycleWidth: 0, middleStart: 0 });
  const interactionTimerRef = useRef<number | null>(null);
  const dragRef = useRef({
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    hasMoved: false,
  });
  const suppressClickUntilRef = useRef(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [displayItems, setDisplayItems] = useState(items);

  useEffect(() => {
    setDisplayItems(shuffleWithoutAdjacentArtists(items));
  }, [items]);

  const measureLoop = () => {
    const viewport = viewportRef.current;
    if (!viewport) return null;

    const groups = viewport.querySelectorAll<HTMLElement>(".showcase-loop-group");
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

  const beginInteraction = () => {
    setIsInteracting(true);
    if (interactionTimerRef.current !== null) window.clearTimeout(interactionTimerRef.current);
  };

  const endInteraction = () => {
    setIsInteracting(true);
    if (interactionTimerRef.current !== null) window.clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = window.setTimeout(() => setIsInteracting(false), 1800);
  };

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const centerLoop = () => {
      const metrics = measureLoop();
      if (metrics) viewport.scrollLeft = metrics.middleStart;
    };

    centerLoop();
    const observer = new ResizeObserver(centerLoop);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let frame = 0;
    let previousTime = performance.now();
    const move = (time: number) => {
      const elapsed = Math.min(time - previousTime, 40);
      previousTime = time;

      if (!isInteracting) {
        viewport.scrollLeft += elapsed * 0.026 * direction;
        normalizeLoop();
      }

      frame = window.requestAnimationFrame(move);
    };

    frame = window.requestAnimationFrame(move);
    return () => window.cancelAnimationFrame(frame);
  }, [direction, isInteracting]);

  useEffect(() => () => {
    if (interactionTimerRef.current !== null) window.clearTimeout(interactionTimerRef.current);
  }, []);

  return (
    <section className={`showcase-loop-row showcase-loop-row-${category}`} aria-label={label}>
      <div
        ref={viewportRef}
        className={`showcase-loop-viewport${isDragging ? " is-dragging" : ""}`}
        onPointerDown={(event) => {
          beginInteraction();
          if (event.pointerType !== "mouse" || event.button !== 0) return;

          dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startScrollLeft: event.currentTarget.scrollLeft,
            hasMoved: false,
          };
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current;
          if (drag.pointerId !== event.pointerId) return;
          const distance = event.clientX - drag.startX;

          if (!drag.hasMoved && Math.abs(distance) < 6) return;
          if (!drag.hasMoved) {
            drag.hasMoved = true;
            setIsDragging(true);
            event.currentTarget.setPointerCapture(event.pointerId);
          }

          event.currentTarget.scrollLeft = drag.startScrollLeft - distance;
        }}
        onPointerUp={(event) => {
          if (dragRef.current.pointerId === event.pointerId) {
            if (dragRef.current.hasMoved) {
              suppressClickUntilRef.current = performance.now() + 250;
            }
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
            dragRef.current.pointerId = -1;
            dragRef.current.hasMoved = false;
            setIsDragging(false);
          }
          endInteraction();
        }}
        onPointerCancel={(event) => {
          if (dragRef.current.pointerId === event.pointerId) {
            dragRef.current.pointerId = -1;
            dragRef.current.hasMoved = false;
            setIsDragging(false);
          }
          endInteraction();
        }}
        onClickCapture={(event) => {
          if (performance.now() >= suppressClickUntilRef.current) return;
          suppressClickUntilRef.current = 0;
          event.preventDefault();
          event.stopPropagation();
        }}
        onWheel={endInteraction}
        onScroll={normalizeLoop}
      >
        <div className="showcase-loop-track">
          {[0, 1, 2].map((groupIndex) => (
            <div
              className="showcase-loop-group"
              aria-hidden={groupIndex === 1 ? undefined : "true"}
              key={groupIndex}
            >
              {displayItems.map((item) => (
                <a
                  className="showcase-loop-card"
                  href={item.href}
                  target={category === "magazine" ? undefined : "_blank"}
                  rel={category === "magazine" ? undefined : "noreferrer"}
                  aria-label={item.title}
                  aria-haspopup={category === "magazine" ? "dialog" : undefined}
                  tabIndex={groupIndex === 1 ? 0 : -1}
                  key={`${groupIndex}-${item.id}`}
                  onClick={category === "magazine" ? (event) => {
                    event.preventDefault();
                    onOpenMedia(item);
                  } : undefined}
                >
                  <img src={item.image} alt={item.title} loading="lazy" />
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LoopingShowcaseGallery() {
  const [selectedMedia, setSelectedMedia] = useState<LoopItem | null>(null);
  const lightboxPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedMedia) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedMedia(null);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedMedia]);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await lightboxPanelRef.current?.requestFullscreen();
  };

  return (
    <>
      <div className="showcase-loop-gallery">
        {sections.map((section, sectionIndex) => (
          <section
            className={`showcase-loop-category showcase-loop-category-${section.category}`}
            aria-labelledby={`showcase-loop-category-${section.category}`}
            key={section.category}
          >
            {section.category !== "brand" && (
              <h2
                className="showcase-loop-category-title"
                id={`showcase-loop-category-${section.category}`}
              >
                {section.title}
              </h2>
            )}
            <div className="showcase-loop-category-rows">
              {section.rows.map((items, rowIndex) => {
                const absoluteIndex = sectionIndex * 2 + rowIndex;

                return (
                  <LoopingShowcaseRow
                    category={section.category}
                    direction={absoluteIndex % 2 === 0 ? 1 : -1}
                    items={items}
                    label={`${section.title} row ${rowIndex + 1}`}
                    onOpenMedia={setSelectedMedia}
                    key={`${section.category}-${rowIndex}`}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {selectedMedia ? (
        <div
          className="media-lightbox"
          role="dialog"
          aria-label={`${selectedMedia.title} full cover`}
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedMedia(null);
          }}
        >
          <div className="media-lightbox-panel" ref={lightboxPanelRef}>
            <button
              className="media-lightbox-control media-lightbox-fullscreen"
              type="button"
              aria-label="View cover fullscreen"
              onClick={toggleFullscreen}
            >
              ⛶
            </button>
            <button
              className="media-lightbox-control media-lightbox-close"
              type="button"
              aria-label="Close full cover"
              autoFocus
              onClick={() => setSelectedMedia(null)}
            >
              ×
            </button>
            <img src={selectedMedia.image} alt={selectedMedia.title} />
          </div>
        </div>
      ) : null}
    </>
  );
}
