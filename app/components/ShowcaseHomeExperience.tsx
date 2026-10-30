"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { lifestyleMediaItems } from "../data/lifestyleMedia";
import { partnershipItems } from "../data/partnerships";
import { AnimatedThemeLogo } from "./AnimatedThemeLogo";
import { HighlightVideoBanner } from "./HighlightVideoBanner";
import { LoopingShowcaseGallery } from "./LoopingShowcaseGallery";
import { SectionTitleTicker } from "./SectionTitleTicker";
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

type ShowcaseHomeExperienceProps = { withFeatureBanner?: boolean };

export function ShowcaseHomeExperience({
  withFeatureBanner = false,
}: ShowcaseHomeExperienceProps) {
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
    <main
      className="instagram-home-shell showcase-home-shell colorway-black colorway-black-gold colorway-black-antique-motion"
    >
      <div className="antique-motion-background" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      {withFeatureBanner ? (
        <>
          <header className="instagram-home-header highlight-video-nav">
            <h1 id="showcase-home-title" className="sr-only">MGMT NATION and SALXCO</h1>
            <AnimatedThemeLogo className="highlight-video-nav-logo" animated={false} />
          </header>
          <HighlightVideoBanner />
          <SectionTitleTicker
            id="showcase-loop-category-brand"
            title="Brand Partnerships"
            leading
          />
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

      {withFeatureBanner ? (
        <SectionTitleTicker
          id="footer-vibes-message"
          title="F*CK YOUR BAD VIBES"
          leading
        />
      ) : null}

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
