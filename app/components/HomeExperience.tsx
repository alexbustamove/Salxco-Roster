"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { instagramPosts } from "../data/instagramPosts";

const instagramUrl = "https://www.instagram.com/salxco";
const initialPostCount = 12;
const loadMoreCount = 12;
const feedArchive = instagramPosts;

export function HomeExperience() {
  const [visibleCount, setVisibleCount] = useState(initialPostCount);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const visiblePosts = useMemo(
    () => feedArchive.slice(0, visibleCount),
    [visibleCount],
  );

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((current) => Math.min(current + loadMoreCount, feedArchive.length));
        }
      },
      { rootMargin: "800px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="instagram-home-shell">
      <header className="instagram-home-header">
        <Link className="instagram-home-roster" href="/roster">
          Roster <span aria-hidden="true">↗</span>
        </Link>

        <section className="intro instagram-home-intro" aria-labelledby="instagram-home-title">
          <h1 id="instagram-home-title" className="sr-only">MGMT NATION and SALXCO</h1>
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

      <section className="instagram-feed-section" aria-label="SALXCO Instagram feed">
        <div className="instagram-feed-grid">
          {visiblePosts.map((post, index) => (
            <a
              className="instagram-feed-post"
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Open SALXCO on Instagram"
              key={`${post.id}-${index}`}
            >
              <img src={post.image} alt="" loading="lazy" />
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>

        {visibleCount < feedArchive.length && (
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
        <a className="back-to-top" href="#instagram-home-title" aria-label="Back to top">
          <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </main>
  );
}
