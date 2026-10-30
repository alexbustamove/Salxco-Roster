import type { CSSProperties } from "react";

type SectionTitleTickerProps = {
  id: string;
  title: string;
  leading?: boolean;
};

const rings = Array.from({ length: 3 });
const panels = Array.from({ length: 12 });

export function SectionTitleTicker({ id, title, leading = false }: SectionTitleTickerProps) {
  return (
    <h2
      className={`showcase-loop-category-title section-title-ticker${leading ? " showcase-loop-category-title-leading" : ""}`}
      id={id}
      aria-label={title}
    >
      {rings.map((_, ringIndex) => (
        <span
          className="section-title-ticker-ring"
          aria-hidden="true"
          key={ringIndex}
        >
          {panels.map((__, index) => (
            <span
              className="section-title-ticker-item"
              style={{ "--ticker-index": index } as CSSProperties}
              key={index}
            >
              <span>{title}</span>
              <span className="section-title-ticker-mark">•</span>
            </span>
          ))}
        </span>
      ))}
    </h2>
  );
}
