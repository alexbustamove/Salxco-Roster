"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { lifestyleMediaItems } from "../data/lifestyleMedia";
import { partnershipItems } from "../data/partnerships";
import { AnimatedThemeLogo } from "./AnimatedThemeLogo";
import { HighlightVideoBanner } from "./HighlightVideoBanner";
import { LoopingShowcaseGallery } from "./LoopingShowcaseGallery";
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
  colorway?:
    | "black"
    | "gold"
    | "antique-gold"
    | "antique-white"
    | "black-gold"
    | "black-antique-texture"
    | "black-gold-motion";
  withFeatureBanner?: boolean;
};

export function ShowcaseHomeExperience({
  colorway = "black",
  withFeatureBanner = false,
}: ShowcaseHomeExperienceProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(initialItemCount);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const visibleItems = useMemo(
    () => showcaseArchive.slice(0, visibleCount),
    [visibleCount],
  );
  const colorwayClasses = colorway === "antique-white"
    ? "colorway-gold colorway-antique-gold colorway-antique-white"
    : colorway === "antique-gold"
      ? "colorway-gold colorway-antique-gold"
      : colorway === "black-gold"
        ? "colorway-black colorway-black-gold"
        : colorway === "black-antique-texture"
          ? "colorway-black colorway-black-gold colorway-black-antique-texture"
          : colorway === "black-gold-motion"
            ? "colorway-black colorway-black-gold colorway-black-gold-motion"
        : `colorway-${colorway}`;

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
    <main
      className={`instagram-home-shell showcase-home-shell ${colorwayClasses}`}
    >
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
              <Link
                href="/"
                aria-current={colorway === "gold" ? "page" : undefined}
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={() => setIsMenuOpen(false)}
              >
                Primary Gold
              </Link>
              <Link
                href="/?colorway=antique-gold"
                aria-current={colorway === "antique-gold" ? "page" : undefined}
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={() => setIsMenuOpen(false)}
              >
                Antique Gold
              </Link>
              <Link
                href="/?colorway=antique-white"
                aria-current={colorway === "antique-white" ? "page" : undefined}
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={() => setIsMenuOpen(false)}
              >
                Antique Gold + White
              </Link>
              <Link
                href="/?colorway=black"
                aria-current={colorway === "black" ? "page" : undefined}
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={() => setIsMenuOpen(false)}
              >
                Black
              </Link>
              <Link
                href="/?colorway=black-gold"
                aria-current={colorway === "black-gold" ? "page" : undefined}
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={() => setIsMenuOpen(false)}
              >
                Black + Gold Dividers
              </Link>
              <Link
                href="/?colorway=black-antique-texture"
                aria-current={colorway === "black-antique-texture" ? "page" : undefined}
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={() => setIsMenuOpen(false)}
              >
                Black + Textured Antique Gold
              </Link>
              <Link
                href="/?colorway=black-gold-motion"
                aria-current={colorway === "black-gold-motion" ? "page" : undefined}
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={() => setIsMenuOpen(false)}
              >
                Black + Gold Ambient Motion
              </Link>
            </nav>
          </header>
          <HighlightVideoBanner />
          <h2
            className="showcase-loop-category-title showcase-loop-category-title-leading"
            id="showcase-loop-category-brand"
          >
            Brand Partnerships
          </h2>
          <VerticalFeatureBanner />
        </>
      ) : (
        <header className="instagram-home-header">
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

      <section
        className={withFeatureBanner ? "showcase-loop-section" : "instagram-feed-section"}
        aria-label="SALXCO magazine, partnership, and accolades showcase"
      >
        {withFeatureBanner ? (
          <LoopingShowcaseGallery />
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
