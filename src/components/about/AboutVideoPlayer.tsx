'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AboutVideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
}

export function AboutVideoPlayer({
  src,
  poster,
  loop = true,
  className = 'aspect-video',
}: AboutVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Viewport-based natural autoplay on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Natural resume without restarting
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                // Browser prevented unmuted autoplay or power-saving; ignore gracefully
              });
            }
          } else {
            // Pause when scrolled out of view to conserve resources
            video.pause();
          }
        });
      },
      {
        threshold: 0.25, // Begins playing once 25% enters viewport
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-[#502813] overflow-hidden ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop={loop}
        muted={isMuted}
        playsInline
        preload="metadata"
        className="w-full h-full object-cover pointer-events-none"
      />

      {/* Subtle, non-intrusive sound toggle in bottom corner */}
      <div className="absolute bottom-4 right-4 z-20">
        <button
          onClick={toggleMute}
          className="p-2 bg-[#763C1E]/80 hover:bg-[#763C1E] text-[#FCE08B] backdrop-blur-xs transition-colors focus-visible:ring-2 focus-visible:ring-[#FCE08B]"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
