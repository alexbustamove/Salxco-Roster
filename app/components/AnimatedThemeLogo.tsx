"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type AnimatedThemeLogoProps = {
  className?: string;
  animated?: boolean;
};

export function AnimatedThemeLogo({
  className = "",
  animated = true,
}: AnimatedThemeLogoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    if (!animated) return;

    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const markPlaying = () => {
      if (!video.paused && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        setIsVideoPlaying(true);
      }
    };

    const syncPlayback = () => {
      if (document.hidden) {
        video.pause();
        return;
      }

      void video.play().then(markPlaying).catch(() => {
        setIsVideoPlaying(false);
      });
    };

    const retryTimers = [0, 250, 750, 1500, 3000].map((delay) =>
      window.setTimeout(syncPlayback, delay),
    );

    video.load();
    video.addEventListener("loadedmetadata", syncPlayback);
    video.addEventListener("loadeddata", syncPlayback);
    video.addEventListener("canplay", syncPlayback);
    video.addEventListener("canplaythrough", syncPlayback);
    video.addEventListener("playing", markPlaying);
    video.addEventListener("timeupdate", markPlaying);
    window.addEventListener("pageshow", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      retryTimers.forEach((timer) => window.clearTimeout(timer));
      video.removeEventListener("loadedmetadata", syncPlayback);
      video.removeEventListener("loadeddata", syncPlayback);
      video.removeEventListener("canplay", syncPlayback);
      video.removeEventListener("canplaythrough", syncPlayback);
      video.removeEventListener("playing", markPlaying);
      video.removeEventListener("timeupdate", markPlaying);
      window.removeEventListener("pageshow", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [animated]);

  return (
    <Link
      className={`theme-logo animated-theme-logo ${className}`.trim()}
      href="/"
      aria-label="Go to home page"
    >
      {animated ? (
        <video
          ref={videoRef}
          className="theme-logo-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onPlaying={() => setIsVideoPlaying(true)}
          onError={() => setIsVideoPlaying(false)}
          aria-hidden="true"
        >
          <source
            src="/mgmt-nation-flag-animation-alpha.mov"
            type='video/quicktime; codecs="hvc1"'
          />
          <source
            src="/mgmt-nation-flag-animation.webm"
            type='video/webm; codecs="vp9"'
          />
        </video>
      ) : null}

      <span
        className={`theme-logo-static${!animated || !isVideoPlaying ? " is-visible" : ""}`}
        aria-hidden="true"
      >
        <img src="/mgmt-nation-logo-gold.svg" alt="" />
        <span className="theme-logo-front" />
      </span>
    </Link>
  );
}
