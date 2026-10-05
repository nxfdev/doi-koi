'use client';

import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AboutVideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export function AboutVideoPlayer({
  src,
  poster,
  autoplay = false,
  loop = true,
  muted = true,
}: AboutVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      onClick={togglePlay}
      className="relative w-full aspect-video bg-[#502813] border border-[#763C1E]/20 overflow-hidden cursor-pointer group shadow-sm"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoplay}
        loop={loop}
        muted={isMuted}
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-[#763C1E]/10 group-hover:bg-[#763C1E]/5 transition-colors pointer-events-none" />

      {/* Custom Minimal Controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
        <button
          onClick={toggleMute}
          className="p-2.5 bg-[#763C1E]/80 hover:bg-[#763C1E] text-[#FCE08B] backdrop-blur-xs transition-colors"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <button
          onClick={togglePlay}
          className="p-2.5 bg-[#763C1E]/80 hover:bg-[#763C1E] text-[#FCE08B] backdrop-blur-xs transition-colors"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>

      {/* Floating Center Play Button When Paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 border border-[#FCE08B] bg-[#763C1E]/85 text-[#FCE08B] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
            <Play className="w-6 h-6 ml-1 fill-current" />
          </div>
        </div>
      )}
    </div>
  );
}
