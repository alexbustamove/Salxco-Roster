/* eslint-disable @next/next/no-img-element */

import { lifestyleMediaItems } from "../data/lifestyleMedia";

export function LifestyleMediaGallery() {
  return (
    <div className="lifestyle-media-grid lifestyle-magazine-grid" aria-label="Lifestyle media covers">
      {lifestyleMediaItems.map((item) => (
        <a
          className="lifestyle-media-card"
          href={item.href}
          key={item.id}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${item.title}`}
        >
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
          />
          <span className="lifestyle-media-link" aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}
