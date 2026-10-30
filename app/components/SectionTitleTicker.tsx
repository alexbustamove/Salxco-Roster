import { Fragment, type CSSProperties } from "react";

type SectionTitleTickerProps = {
  id: string;
  title: string;
  leading?: boolean;
};

export function SectionTitleTicker({ id, title, leading = false }: SectionTitleTickerProps) {
  const tickerConfig = title === "Brand Partnerships"
    ? { key: "brand", desktopPanels: 8, mobilePanels: 6 }
    : title === "Achievements"
      ? { key: "achievements", desktopPanels: 10, mobilePanels: 8 }
      : { key: "media", desktopPanels: 18, mobilePanels: 14 };
  const desktopAngle = 360 / tickerConfig.desktopPanels;
  const mobileAngle = 360 / tickerConfig.mobilePanels;
  const renderRing = (layerClassName: string) => (
    <span className={`section-title-ticker-text-layer ${layerClassName}`} aria-hidden="true">
      <span className="section-title-ticker-ring">
        {Array.from({ length: tickerConfig.desktopPanels }, (_, index) => (
          <Fragment key={index}>
            <span
              className={`section-title-ticker-item section-title-ticker-word${index >= tickerConfig.mobilePanels ? " is-mobile-hidden" : ""}`}
              style={{
                "--ticker-angle-desktop": `${index * desktopAngle}deg`,
                "--ticker-angle-mobile": `${index * mobileAngle}deg`,
              } as CSSProperties}
            >
              <span>{title}</span>
            </span>
            <span
              className={`section-title-ticker-item section-title-ticker-logo${index >= tickerConfig.mobilePanels ? " is-mobile-hidden" : ""}`}
              style={{
                "--ticker-angle-desktop": `${(index + 0.5) * desktopAngle}deg`,
                "--ticker-angle-mobile": `${(index + 0.5) * mobileAngle}deg`,
              } as CSSProperties}
            >
              <span className="section-title-ticker-mark">
                <img src="/mgmt-nation-logo-gold.svg" alt="" />
                <span aria-hidden="true" />
              </span>
            </span>
          </Fragment>
        ))}
      </span>
    </span>
  );

  return (
    <h2
      className={`showcase-loop-category-title section-title-ticker section-title-ticker-${tickerConfig.key}${leading ? " showcase-loop-category-title-leading" : ""}`}
      id={id}
      aria-label={title}
    >
      {renderRing("section-title-ticker-text-layer-sharp")}
      {renderRing("section-title-ticker-text-layer-blurred")}
    </h2>
  );
}
