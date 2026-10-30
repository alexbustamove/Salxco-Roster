type SectionTitleTickerProps = {
  id: string;
  title: string;
  leading?: boolean;
};

const repetitions = Array.from({ length: 6 });

export function SectionTitleTicker({ id, title, leading = false }: SectionTitleTickerProps) {
  return (
    <h2
      className={`showcase-loop-category-title section-title-ticker${leading ? " showcase-loop-category-title-leading" : ""}`}
      id={id}
      aria-label={title}
    >
      <span className="section-title-ticker-track" aria-hidden="true">
        {[0, 1].map((group) => (
          <span className="section-title-ticker-group" key={group}>
            {repetitions.map((_, index) => (
              <span className="section-title-ticker-item" key={`${group}-${index}`}>
                <span>{title}</span>
                <span className="section-title-ticker-mark">✦</span>
              </span>
            ))}
          </span>
        ))}
      </span>
    </h2>
  );
}
