'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteContent } from '@/lib/types';
import { Page1ScrollTransition } from './Page1ScrollTransition';

interface HeroSectionProps {
  content?: SiteContent['hero'];
}

export function HeroSection({ content }: HeroSectionProps) {
  const ctaText = content?.ctaText || 'ORDER NOW';
  const speedSeconds = content?.speedSeconds || 28;

  return (
    <section
      className="relative w-full min-h-[100svh] flex flex-col justify-between bg-[#FCE08B] text-[#763C1E] overflow-hidden select-none px-6 sm:px-10 lg:px-16 pb-12 pt-28 sm:pt-32"
      style={
        {
          '--doi-spin-duration': `${speedSeconds}s`,
        } as React.CSSProperties
      }
    >
      {/* Accelerated Page 1 → Page 2 scroll controller */}
      <Page1ScrollTransition />

      {/* Central Hero Composition: Enlarged 40% Rotating Circular Terracotta Shora */}
      <div className="w-full flex-1 flex flex-col items-center justify-center relative my-auto py-6">
        {/* Main circular hero element (approx 40% larger: max-w-[600px] vs previous max-w-[430px]) */}
        <div className="relative w-[86vw] sm:w-[74vw] lg:w-[56vw] max-w-[600px] aspect-square flex items-center justify-center">
          <Link
            href="/#products"
            className="w-full h-full relative block"
            aria-label="View authentic Bogura doi collection"
          >
            {/* Pure Continuous Smooth Rotation Container */}
            <div className="hero-hypnotic-spin w-full h-full relative">
              <Image
                src="/assets/home/hero/hero-doi.png"
                alt="Doi Koi — Authentic handcrafted Bogura Doi in red clay shora"
                fill
                priority
                className="object-contain pointer-events-none drop-shadow-md"
                sizes="(max-width: 640px) 86vw, (max-width: 1024px) 74vw, 600px"
              />
            </div>
          </Link>
        </div>

        {/* Minimal Editorial ORDER NOW CTA */}
        <div className="mt-10 sm:mt-12 z-20">
          <Link
            href="/#products"
            className="inline-block bg-[#763C1E] text-[#FCE08B] px-9 sm:px-12 py-4 sm:py-4.5 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase hover:bg-[#502813] active:scale-[0.99] transition-all duration-200 border border-[#763C1E]"
          >
            {ctaText}
          </Link>
        </div>
      </div>

      {/* Hero Bottom Line: Subtle Tagline & Subheading with Generous Horizontal Space */}
      <div className="w-full max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between text-xs tracking-widest uppercase text-[#763C1E]/80 pt-6 border-t border-[#763C1E]/15 gap-3">
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
