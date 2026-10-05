'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteContent } from '@/lib/types';

interface HeroSectionProps {
  content?: SiteContent['hero'];
}

export function HeroSection({ content }: HeroSectionProps) {
  const ctaText = content?.ctaText || 'ORDER NOW';
  const speedSeconds = content?.speedSeconds || 70;

  return (
    <section
      className="relative w-full min-h-[100svh] flex flex-col justify-between bg-[#FCE08B] text-[#763C1E] overflow-hidden select-none px-6 sm:px-8 lg:px-12 pb-12 pt-6"
      style={
        {
          '--doi-spin-duration': `${speedSeconds}s`,
        } as React.CSSProperties
      }
    >
      {/* Top spacing placeholder to balance vertical composition with the navbar */}
      <div className="w-full h-4" />

      {/* Central Hero Composition: Single Responsive Visual Container */}
      <div className="w-full flex-1 flex flex-col items-center justify-center relative my-auto py-4">
        {/* Hypnotic Circular Visual Container */}
        <div className="relative w-[68vw] max-w-[430px] aspect-square flex items-center justify-center group cursor-pointer">
          <Link
            href="/#products"
            className="w-full h-full relative block"
            aria-label="View authentic Bogura doi collection"
          >
            {/* Unified Rotational Container for both Layers */}
            <div className="hero-hypnotic-spin w-full h-full relative transition-transform duration-700 ease-out group-hover:scale-[1.015]">
              {/* Layer 1: Circular Authentic Bogura Doi PNG */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src="/assets/home/hero/hero-doi.png"
                  alt="Doi Koi — Authentic handcrafted Bogura Doi in red clay shora"
                  fill
                  priority
                  className="object-contain pointer-events-none drop-shadow-xs"
                  sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 440px"
                />
              </div>

              {/* Layer 2: Semi-Transparent Hypnotizing Overlay Asset */}
              <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <Image
                  src="/assets/home/hero/hero-hypnotic-overlay.png"
                  alt=""
                  aria-hidden="true"
                  fill
                  priority
                  className="object-contain opacity-85"
                  sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 440px"
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Minimal Editorial ORDER NOW CTA */}
        <div className="mt-8 sm:mt-10 z-20">
          <Link
            href="/#products"
            className="inline-block bg-[#763C1E] text-[#FCE08B] px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase hover:bg-[#502813] active:scale-[0.99] transition-all duration-200 border border-[#763C1E]"
          >
            {ctaText}
          </Link>
        </div>
      </div>

      {/* Hero Bottom Line: Subtle Tagline & Subheading with Editorial Negative Space */}
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs tracking-widest uppercase text-[#763C1E]/75 pt-6 border-t border-[#763C1E]/15 gap-2">
        <span className="font-semibold text-center sm:text-left">
          {content?.tagline || 'Bogura at your doorsteps'}
        </span>
        <span className="tracking-[0.18em] text-center sm:text-right hidden sm:inline">
          {content?.subheading || 'Traditional product. Contemporary presentation.'}
        </span>
      </div>
    </section>
  );
}
