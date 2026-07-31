"use client";

import { useEffect, useRef, useState } from "react";
import type { Artist } from "../data/artists";
import { ArtistImage } from "./ArtistImage";

type ArtistProfileProps = {
  artist: Artist;
  position: number;
  total: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export function ArtistProfile({
  artist,
  position,
  total,
  onClose,
  onPrevious,
  onNext,
}: ArtistProfileProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const pointerStart = useRef<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key === "ArrowRight") onNext();
      if (event.key !== "Tab" || window.innerWidth >= 1024) return;

      const panel = closeRef.current?.closest<HTMLElement>(".profile-panel");
      const focusable = panel?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])",
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [artist.slug, onClose, onNext, onPrevious]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) < 64) return;
    if (distance > 0) onPrevious();
    else onNext();
  };

  return (
    <aside
      className="profile-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="artist-profile-title"
      onPointerDown={(event) => {
        pointerStart.current = event.pointerType === "mouse" ? null : event.clientX;
      }}
      onPointerUp={handlePointerUp}
    >
      <div className="profile-topbar">
        <span className="profile-count">{String(position + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <div className="profile-actions">
          <button type="button" className="icon-button text-button" onClick={copyLink} aria-live="polite">
            {copied ? "Copied" : "Copy link"}
          </button>
          <button ref={closeRef} type="button" className="icon-button close-button" onClick={onClose} aria-label={`Close ${artist.name} profile`}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>

      <div className="profile-image">
        <ArtistImage src={artist.image} alt={artist.imageAlt} priority />
        <span className="profile-image-wash" aria-hidden="true" />
      </div>

      <div className="profile-content">
        <p className="eyebrow">{artist.category}</p>
        <h2 id="artist-profile-title">{artist.name}</h2>
        <div className="profile-rule" />
        <div className="profile-meta">
          <span>Artist roster</span>
          <span>Representation inquiries available by request.</span>
        </div>
      </div>

      <nav className="artist-navigation" aria-label="Artist profile navigation">
        <button type="button" onClick={onPrevious} aria-label="Previous artist">
          <span aria-hidden="true">←</span>
          <span>Previous</span>
        </button>
        <span className="swipe-hint">Swipe or use arrow keys</span>
        <button type="button" onClick={onNext} aria-label="Next artist">
          <span>Next</span>
          <span aria-hidden="true">→</span>
        </button>
      </nav>
    </aside>
  );
}
