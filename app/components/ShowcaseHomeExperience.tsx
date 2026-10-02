"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { lifestyleMediaItems } from "../data/lifestyleMedia";
import { partnershipItems } from "../data/partnerships";

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

export function ShowcaseHomeExperience() {
  const [visibleCount, setVisibleCount] = useState(initialItemCount);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const visibleItems = useMemo(
    () => showcaseArchive.slice(0, visibleCount),
    [visibleCount],
  );

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

  return (
    <main className="instagram-home-shell showcase-home-shell">
      <header className="instagram-home-header">
        <Link className="instagram-home-roster" href="/roster">
          Roster <span aria-hidden="true">↗</span>
        </Link>

        <section className="intro instagram-home-intro" aria-labelledby="showcase-home-title">
          <h1 id="showcase-home-title" className="sr-only">MGMT NATION and SALXCO</h1>
          <Link className="theme-logo intro-theme-logo" href="/" aria-label="Go to home page">
            <img className="theme-logo-underlay" src="/mgmt-nation-logo-gold.svg" alt="" aria-hidden="true" />
            <span className="theme-logo-front" aria-hidden="true" />
          </Link>
          <p className="intro-tagline">
            <span>Full Service Management</span>
            <span>For World-Class Talent.</span>
          </p>
        </section>
      </header>

      <section className="instagram-feed-section" aria-label="SALXCO magazine and partnership showcase">
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

        {visibleCount < showcaseArchive.length && (
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
