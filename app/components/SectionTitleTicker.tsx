import type { CSSProperties } from "react";

type SectionTitleTickerProps = {
  id: string;
  title: string;
  leading?: boolean;
};

export function SectionTitleTicker({ id, title, leading = false }: SectionTitleTickerProps) {
  const panelCount = title.length <= 6 ? 24 : title.length <= 12 ? 18 : 14;
  const panelAngle = 360 / panelCount;

  return (
    <h2
      className={`showcase-loop-category-title section-title-ticker${leading ? " showcase-loop-category-title-leading" : ""}`}
      id={id}
      aria-label={title}
    >
      <span className="section-title-ticker-ring" aria-hidden="true">
        {Array.from({ length: panelCount }, (_, index) => (
          <span
            className="section-title-ticker-item"
            style={{ "--ticker-angle": `${index * panelAngle}deg` } as CSSProperties}
            key={index}
          >
            <span>{title}</span>
            <span className="section-title-ticker-mark">•</span>
          </span>
        ))}
      </span>
      <span className="section-title-ticker-edge section-title-ticker-edge-left" aria-hidden="true" />
      <span className="section-title-ticker-edge section-title-ticker-edge-right" aria-hidden="true" />
    </h2>
  );
}
