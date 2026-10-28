"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { lifestyleMediaItems } from "../data/lifestyleMedia";
import { partnershipItems } from "../data/partnerships";
import { AnimatedThemeLogo } from "./AnimatedThemeLogo";
import { HighlightVideoBanner } from "./HighlightVideoBanner";
import { VerticalFeatureBanner } from "./VerticalFeatureBanner";

const instagramUrl = "https://www.instagram.com/salxco";
const initialItemCount = 24;
const loadMoreCount = 24;

type ShowcaseItem = {
  id: string;
  image: string;
  title: string;
  type: "magazine" | "partnership";
};

const showcaseArchive: ShowcaseItem[] = [];
const archiveLength = Math.max(lifestyleMediaItems.length, partnershipItems.length);

for (let index = 0; index < archiveLength; index += 1) {
  const magazine = lifestyleMediaItems[index];
  const partnership = partnershipItems[index];

  if (magazine) {
    showcaseArchive.push({
      id: `magazine-${magazine.id}`,
      image: magazine.image,
      title: magazine.title,
      type: "magazine",
    });
  }

  if (partnership) {
    showcaseArchive.push({
      id: `partnership-${partnership.id}`,
      image: partnership.image,
      title: partnership.title,
      type: "partnership",
    });
  }
}

type ShowcaseHomeExperienceProps = {
  colorway?: "black" | "gold";
  withFeatureBanner?: boolean;
};

const showcaseSwapArchive = showcaseArchive.slice(0, 48);
const showcaseSwapColumnCount = 4;
const showcaseSwapRowCount = 6;
const showcaseSwapItemCount = showcaseSwapColumnCount * showcaseSwapRowCount;
const showcaseSwapOrder = Array.from({ length: showcaseSwapItemCount }, (_, step) => {
  const rowFromBottom = Math.floor(step / showcaseSwapColumnCount);
  const columnIndex = step % showcaseSwapColumnCount;
  const rowIndex = showcaseSwapRowCount - rowFromBottom - 1;
  return (rowIndex * showcaseSwapColumnCount) + columnIndex;
});

function ShowcaseSwapTile({ item }: { item: ShowcaseItem }) {
  const [displayedItem, setDisplayedItem] = useState(item);
  const [outgoingItem, setOutgoingItem] = useState<ShowcaseItem | null>(null);
  const displayedItemRef = useRef(item);

  useEffect(() => {
    if (displayedItemRef.current.id === item.id) return;

    setOutgoingItem(displayedItemRef.current);
    setDisplayedItem(item);
    displayedItemRef.current = item;

    const timeout = window.setTimeout(() => setOutgoingItem(null), 640);
    return () => window.clearTimeout(timeout);
  }, [item]);

  return (
    <a
      className={`instagram-feed-post showcase-feed-post showcase-swap-tile showcase-feed-post-${displayedItem.type}`}
      href={instagramUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`View ${displayedItem.title} on SALXCO Instagram`}
    >
      {outgoingItem ? (
        <img
          className="showcase-swap-image showcase-swap-image-outgoing"
          src={outgoingItem.image}
          alt=""
          aria-hidden="true"
        />
      ) : null}
      <img
        className={`showcase-swap-image${outgoingItem ? " showcase-swap-image-incoming" : ""}`}
        src={displayedItem.image}
        alt={displayedItem.title}
      />
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export function ShowcaseHomeExperience({
  colorway = "black",
  withFeatureBanner = false,
}: ShowcaseHomeExperienceProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(initialItemCount);
  const [swapItems, setSwapItems] = useState(() => showcaseSwapArchive.slice(0, showcaseSwapItemCount));
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const swapStepRef = useRef(0);
  const nextSwapItemRef = useRef(showcaseSwapItemCount);
  const visibleItems = useMemo(
    () => showcaseArchive.slice(0, visibleCount),
    [visibleCount],
  );

  useEffect(() => {
    if (!withFeatureBanner) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    showcaseSwapArchive.forEach((item) => {
      const image = new Image();
      image.src = item.image;
    });

    const interval = window.setInterval(() => {
      const slotIndex = showcaseSwapOrder[swapStepRef.current % showcaseSwapOrder.length];
      const nextItem = showcaseSwapArchive[nextSwapItemRef.current % showcaseSwapArchive.length];

      setSwapItems((current) => {
        const next = [...current];
        next[slotIndex] = nextItem;
        return next;
      });

      swapStepRef.current += 1;
      nextSwapItemRef.current += 1;
    }, 850);

    return () => window.clearInterval(interval);
  }, [withFeatureBanner]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((current) => Math.min(current + loadMoreCount, showcaseArchive.length));
        }
      },
      { rootMargin: "800px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  return (
    <main className={`instagram-home-shell showcase-home-shell colorway-${colorway}`}>
      {withFeatureBanner ? (
        <>
          <header className="instagram-home-header highlight-video-nav">
            <h1 id="showcase-home-title" className="sr-only">MGMT NATION and SALXCO</h1>
            <AnimatedThemeLogo className="highlight-video-nav-logo" animated={false} />
            <button
              className={`showcase-menu-toggle${isMenuOpen ? " is-open" : ""}`}
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="showcase-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              <span />
              <span />
              <span />
            </button>
            <nav
              className={`showcase-menu${isMenuOpen ? " is-open" : ""}`}
              id="showcase-menu"
              aria-label="Main navigation"
              aria-hidden={!isMenuOpen}
            >
              <Link href={colorway === "black" ? "/?colorway=black" : "/"} tabIndex={isMenuOpen ? 0 : -1} onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link href="/" tabIndex={isMenuOpen ? 0 : -1} onClick={() => setIsMenuOpen(false)}>
                Gold colorway
              </Link>
              <Link href="/?colorway=black" tabIndex={isMenuOpen ? 0 : -1} onClick={() => setIsMenuOpen(false)}>
                Black colorway
              </Link>
              <Link href="/artists" tabIndex={isMenuOpen ? 0 : -1} onClick={() => setIsMenuOpen(false)}>
                Artists
              </Link>
              <Link href="/roster" tabIndex={isMenuOpen ? 0 : -1} onClick={() => setIsMenuOpen(false)}>
                Roster
              </Link>
            </nav>
          </header>
          <HighlightVideoBanner />
          <VerticalFeatureBanner />
        </>
      ) : (
        <header className="instagram-home-header">
          <Link className="instagram-home-roster" href="/roster">
            Roster <span aria-hidden="true">↗</span>
          </Link>

          <section className="intro instagram-home-intro" aria-labelledby="showcase-home-title">
            <h1 id="showcase-home-title" className="sr-only">MGMT NATION and SALXCO</h1>
            <AnimatedThemeLogo className="intro-theme-logo" />
            <p className="intro-tagline">
              <span>Full Service Management</span>
              <span>For World-Class Talent.</span>
            </p>
          </section>
        </header>
      )}

      <section className="instagram-feed-section" aria-label="SALXCO magazine and partnership showcase">
        {withFeatureBanner ? (
          <div className="showcase-swap-grid" id="showcase-swap-grid">
            {swapItems.map((item, slotIndex) => (
              <ShowcaseSwapTile item={item} key={slotIndex} />
            ))}
          </div>
        ) : (
          <div className="instagram-feed-grid showcase-feed-grid">
            {visibleItems.map((item) => (
              <a
                className={`instagram-feed-post showcase-feed-post showcase-feed-post-${item.type}`}
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${item.title} on SALXCO Instagram`}
                key={item.id}
              >
                <img src={item.image} alt={item.title} loading="lazy" />
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        )}

        {!withFeatureBanner && visibleCount < showcaseArchive.length && (
          <div className="instagram-feed-loader" ref={loadMoreRef} aria-hidden="true">
            <span />
          </div>
        )}
      </section>

      <footer className="site-footer instagram-home-footer">
        <div className="footer-center">
          <Link className="theme-logo footer-theme-logo" href="/" aria-label="Go to home page">
            <img className="theme-logo-underlay" src="/mgmt-nation-logo-gold.svg" alt="" aria-hidden="true" />
            <span className="theme-logo-front" aria-hidden="true" />
            <img
              className="footer-theme-logo-white"
              src="/mgmt-nation-logo-white-footer.png"
              alt=""
              aria-hidden="true"
            />
          </Link>
          <p className="footer-copyright">
            <span>Copyright © 2026 MGMT NATION.</span>
            <span>All rights reserved.</span>
          </p>
        </div>
        <a className="back-to-top" href="#showcase-home-title" aria-label="Back to top">
          <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </main>
  );
}
