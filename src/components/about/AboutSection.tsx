'use client';

import React from 'react';
import { SiteContent } from '@/lib/types';
import { AboutVideoPlayer } from './AboutVideoPlayer';

interface AboutSectionProps {
  content?: SiteContent['about'];
}

export function AboutSection({ content }: AboutSectionProps) {
  const heading = content?.heading || 'The Art of Authentic Bogura Doi';
  const videoUrl = content?.videoUrl || '/assets/home/about/about-video.mp4';
  const videoPoster = content?.videoPoster || '/assets/home/hero/hero-doi.png';

  return (
    <section
      id="about"
      className="relative w-full aspect-video min-h-[560px] sm:min-h-0 bg-[#502813] overflow-hidden select-none"
    >
      {/* ── 01: FULL-BLEED 16:9 VIDEO BACKGROUND ── */}
      <div className="absolute inset-0 w-full h-full z-0">
        <AboutVideoPlayer
          src={videoUrl}
          poster={videoPoster}
          loop={content?.loop ?? true}
          className="w-full h-full"
        />
      </div>

      {/* ── 02: SUBTLE LOCALIZED GRADIENT (strictly behind right-side text column) ── */}
      <div
        className="absolute inset-y-0 right-0 w-full sm:w-2/3 lg:w-1/2 xl:w-[46%] bg-gradient-to-l from-[#502813]/92 via-[#502813]/55 to-transparent pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* ── 03: RIGHT-SIDE EDITORIAL TEXT OVERLAY (FIRM RIGHT ANCHOR) ── */}
      <div className="relative h-full w-full max-w-[1700px] mx-auto px-6 sm:px-12 lg:px-16 xl:px-20 flex items-center justify-end z-20 pointer-events-none">
        <div className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl pointer-events-auto text-left ml-auto mr-0 space-y-6 sm:space-y-8">
          {/* Section heading — bold, large, confident editorial typography */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.65rem] font-extrabold uppercase tracking-tight leading-[0.96] text-[#FCE08B]">
            {heading}
          </h2>

          {/* Minimal editorial narrative — larger, readable, elegant */}
          <p className="text-base sm:text-lg md:text-xl lg:text-[1.32rem] font-medium leading-[1.62] text-[#FCE08B]/95 tracking-normal">
            Whole cow milk caramelized over slow wood embers inside porous red clay pots. Unhurried, pure, and untouched by synthetic shortcuts for over two centuries.
          </p>

          {/* Provenance markers — geometrically aligned metadata row */}
          <div className="pt-6 border-t border-[#FCE08B]/25 flex items-center justify-between text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-[#FCE08B]/80">
            <span>200+ Years Tradition</span>
            <span>100% Raw Milk &amp; Clay</span>
          </div>
        </div>
      </div>
    </section>
  );
}
