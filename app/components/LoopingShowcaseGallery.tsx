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
};

const splitIntoRows = (items: LoopItem[]) => [
  items.filter((_, index) => index % 2 === 0),
  items.filter((_, index) => index % 2 === 1),
];

const brandRows = splitIntoRows(partnershipItems.slice(0, 24));
const magazineRows = splitIntoRows(lifestyleMediaItems.slice(0, 24));
const accoladeRows = splitIntoRows(
  accoladeItems.map((item) => ({ ...item, href: item.image })),
);

const rows = [
  { category: "brand", label: "Brand Partnerships", items: brandRows[0] },
  { category: "brand", label: "Brand Partnerships", items: brandRows[1] },
  { category: "magazine", label: "Magazine Covers", items: magazineRows[0] },
  { category: "magazine", label: "Magazine Covers", items: magazineRows[1] },
  { category: "accolade", label: "Accolades", items: accoladeRows[0] },
  { category: "accolade", label: "Accolades", items: accoladeRows[1] },
] as const;

function LoopingShowcaseRow({ category, direction, items, label }: LoopingShowcaseRowProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const loopMetricsRef = useRef({ cycleWidth: 0, middleStart: 0 });
  const interactionTimerRef = useRef<number | null>(null);
  const dragRef = useRef({ pointerId: -1, startX: 0, startScrollLeft: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
          };
          setIsDragging(true);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current;
          if (drag.pointerId !== event.pointerId) return;
          event.currentTarget.scrollLeft = drag.startScrollLeft - (event.clientX - drag.startX);
        }}
        onPointerUp={(event) => {
          if (dragRef.current.pointerId === event.pointerId) {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
            dragRef.current.pointerId = -1;
            setIsDragging(false);
          }
          endInteraction();
        }}
        onPointerCancel={(event) => {
          if (dragRef.current.pointerId === event.pointerId) {
            dragRef.current.pointerId = -1;
            setIsDragging(false);
          }
          endInteraction();
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
              {items.map((item) => (
                <a
                  className="showcase-loop-card"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.title}
                  tabIndex={groupIndex === 1 ? 0 : -1}
                  key={`${groupIndex}-${item.id}`}
                >
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <span className="showcase-loop-card-title">{item.title}</span>
                  <span className="showcase-loop-card-arrow" aria-hidden="true">↗</span>
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
  return (
    <div className="showcase-loop-gallery">
      {rows.map((row, index) => (
        <LoopingShowcaseRow
          category={row.category}
          direction={index % 2 === 0 ? 1 : -1}
          items={[...row.items]}
          label={row.label}
          key={`${row.label}-${index}`}
        />
      ))}
    </div>
  );
}
