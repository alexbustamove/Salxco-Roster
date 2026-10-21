"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type AnimatedThemeLogoProps = {
  className?: string;
};

export function AnimatedThemeLogo({ className = "" }: AnimatedThemeLogoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncPlayback = () => {
      if (document.hidden) {
        video.pause();
        return;
      }

      void video.play().then(() => setIsVideoPlaying(true)).catch(() => {
        setIsVideoPlaying(false);
      });
    };

    syncPlayback();
    video.addEventListener("canplay", syncPlayback);
    window.addEventListener("pageshow", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      video.removeEventListener("canplay", syncPlayback);
      window.removeEventListener("pageshow", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, []);

  return (
    <Link
      className={`theme-logo animated-theme-logo ${className}`.trim()}
      href="/"
      aria-label="Go to home page"
    >
      <video
        ref={videoRef}
        className="theme-logo-video"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onPlaying={() => setIsVideoPlaying(true)}
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

      <span
        className={`theme-logo-static${isVideoPlaying ? "" : " is-visible"}`}
        aria-hidden="true"
      >
        <img src="/mgmt-nation-logo-gold.svg" alt="" />
        <span className="theme-logo-front" />
      </span>
    </Link>
  );
}
