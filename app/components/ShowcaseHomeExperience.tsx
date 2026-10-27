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
  withFeatureBanner?: boolean;
};

function shuffledShowcaseArchive() {
  const items = [...showcaseArchive];

  for (let index = items.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
  }

  return items;
}

export function ShowcaseHomeExperience({ withFeatureBanner = false }: ShowcaseHomeExperienceProps) {
  const [visibleCount, setVisibleCount] = useState(initialItemCount);
  const [showcaseItems, setShowcaseItems] = useState(showcaseArchive);
  const [shufflePulse, setShufflePulse] = useState(0);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const visibleItems = useMemo(
    () => showcaseItems.slice(0, visibleCount),
    [showcaseItems, visibleCount],
  );

  useEffect(() => {
    if (!withFeatureBanner) return;

    const shuffle = () => {
      setShowcaseItems(shuffledShowcaseArchive());
      setShufflePulse((current) => current + 1);
    };

    shuffle();
    const interval = window.setInterval(shuffle, 1000);
    return () => window.clearInterval(interval);
  }, [withFeatureBanner]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((current) => Math.min(current + loadMoreCount, showcaseItems.length));
        }
      },
      { rootMargin: "800px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [showcaseItems.length]);

  return (
    <main className="instagram-home-shell showcase-home-shell">
      {withFeatureBanner ? (
        <>
          <header className="instagram-home-header highlight-video-nav">
            <h1 id="showcase-home-title" className="sr-only">MGMT NATION and SALXCO</h1>
            <AnimatedThemeLogo className="highlight-video-nav-logo" />
            <Link className="instagram-home-roster" href="/roster">
              Roster <span aria-hidden="true">↗</span>
            </Link>
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
        <div className={`instagram-feed-grid showcase-feed-grid showcase-grid-shift-${shufflePulse % 2}`}>
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

        {visibleCount < showcaseItems.length && (
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
