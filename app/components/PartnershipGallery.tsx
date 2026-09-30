/* eslint-disable @next/next/no-img-element */

import { partnershipItems } from "../data/partnerships";

export function PartnershipGallery() {
  return (
    <div className="lifestyle-media-grid" aria-label="Brand partnerships">
      {partnershipItems.map((item) => (
        <a
          className="lifestyle-media-card partnership-card"
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
