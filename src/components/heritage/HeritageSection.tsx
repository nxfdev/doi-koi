'use client';

import React from 'react';
import { SiteContent } from '@/lib/types';
import { BoguraMap } from './BoguraMap';
import { HeritageTimeline } from './HeritageTimeline';

interface HeritageSectionProps {
  content?: SiteContent['heritage'];
  mapContent?: SiteContent['map'];
}

export function HeritageSection({ content, mapContent }: HeritageSectionProps) {
  const heading = content?.heading || 'Centuries of Earthen Craft';
  const intro =
    content?.intro ||
    'Bogura is celebrated as the undisputed birthplace of authentic Bengali doi. Each batch is a living tribute to the master artisans whose hands shape the clay and slow-simmer the golden milk.';

  return (
    <section
      id="heritage"
      className="w-full bg-[#FCE08B] text-[#763C1E] py-24 sm:py-32 px-6 sm:px-8 lg:px-12 border-t border-[#763C1E]/15"
    >
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#763C1E]/20 pb-8 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-mono tracking-widest text-[#763C1E]/60 uppercase block mb-3">
              03 — THE HERITAGE OF BOGURA
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase leading-none">
              {heading}
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#763C1E]/90 max-w-md font-normal leading-relaxed md:text-right">
            {intro}
          </p>
        </div>

        {/* 04 — Minimal Editorial Geographic Map */}
        <div className="space-y-4">
          <span className="text-xs font-mono tracking-widest text-[#763C1E]/60 uppercase block">
            04 — THE JOURNEY FROM BOGURA
          </span>
          <BoguraMap
            originName={mapContent?.originName}
            originDetail={mapContent?.originDetail}
            destinationName={mapContent?.destinationName}
            destinationDetail={mapContent?.destinationDetail}
          />
        </div>

        {/* Heritage Craft Progression Timeline */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono tracking-widest text-[#763C1E]/60 uppercase">
              The 5-Stage Artisanal Process
            </span>
            <span className="text-xs text-[#763C1E]/60 uppercase tracking-widest font-mono">
              Pure • Unaltered • Slow-Crafted
            </span>
          </div>
          <HeritageTimeline steps={content?.timeline} />
        </div>
      </div>
    </section>
  );
}
