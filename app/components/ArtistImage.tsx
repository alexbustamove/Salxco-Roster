"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";

type ArtistImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

export function ArtistImage({ src, alt, priority = false }: ArtistImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (!image?.complete) return;
    if (image.naturalWidth > 0) setLoaded(true);
    else setFailed(true);
  }, [src]);

  return (
    <div className={`artist-image-frame${loaded ? " is-loaded" : ""}${failed ? " is-fallback" : ""}`}>
      {!loaded && !failed && <span className="image-shimmer" aria-hidden="true" />}
      {failed ? (
        <div className="image-fallback" role="img" aria-label={`${alt} portrait unavailable`}>
          <span>SALXCO</span>
          <strong>{alt.charAt(0)}</strong>
        </div>
      ) : (
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
