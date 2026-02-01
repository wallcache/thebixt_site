"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const videos = [
  "/content/vids/background.mp4",
  "/content/vids/london-1.mp4",
  "/content/vids/london-2.mp4",
];

function shuffleFrom(arr: string[], startIndex: number): string[] {
  // Build playlist starting at startIndex, then the rest in order, looping
  const result: string[] = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[(startIndex + i) % arr.length]);
  }
  return result;
}

export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playlist] = useState(() => {
    const start = Math.floor(Math.random() * videos.length);
    return shuffleFrom(videos, start);
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleEnded = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  }, [playlist.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 0.75;
    video.load();
    video.play().catch(() => {});
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        muted
        playsInline
        onEnded={handleEnded}
        className="absolute w-full h-full object-cover"
        style={{
          filter: "grayscale(100%)",
          opacity: 0.05,
        }}
      >
        <source src={playlist[currentIndex]} type="video/mp4" />
      </video>
    </div>
  );
}
