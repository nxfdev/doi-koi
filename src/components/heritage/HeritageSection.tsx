'use client';

import React from 'react';
import { SiteContent } from '@/lib/types';
import { HeritageTimeline } from './HeritageTimeline';

interface HeritageSectionProps {
  content?: SiteContent['heritage'];
}

/**
 * HeritageSection (Page 4) — The Artisan Process.
 *
 * Design Direction:
 * - Pure craftsmanship storytelling like a cinematic heritage documentary.
 * - Removed all geographic labels ("Rajshahi Division", "Bogura District", "Land of Origin", etc.).
 * - Removed decorative framing boxes, cards, and artificial lines.
 * - Confident, spacious typography on #763C1E brown canvas with #FCE08B cream text.
 */
export function HeritageSection({ content }: HeritageSectionProps) {
  return (
    <section
      id="process"
      className="w-full bg-[#763C1E] text-[#FCE08B] pt-8 sm:pt-14 pb-24 sm:pb-32 lg:pb-40 px-6 sm:px-10 lg:px-16"
      aria-label="The Artisan Craft Process"
    >
      <div className="w-full max-w-[1550px] mx-auto space-y-16 sm:space-y-24">
        {/* ── Section Title: Minimal, Cinematic ── */}
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase leading-none text-[#FCE08B]">
            The Artisan Process
          </h2>
          <p className="text-base sm:text-lg text-[#FCE08B]/75 font-normal leading-relaxed">
            Centuries of slow wood fires, riverbed clay, and unhurried earthen mastery.
          </p>
        </div>

        {/* ── Craft Progression: Spacious, Minimal, Unboxed ── */}
        <HeritageTimeline steps={content?.timeline} />
      </div>
    </section>
  );
}
