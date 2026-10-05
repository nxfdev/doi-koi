'use client';

import React from 'react';
import { SiteContent } from '@/lib/types';

interface ProductStorySectionProps {
  content?: SiteContent['productStory'];
}

export function ProductStorySection({ content }: ProductStorySectionProps) {
  const heading = content?.heading || 'Purity in Every Clay Shora';
  const quote =
    content?.quote ||
    '“A spoonful of authentic Bogura doi should linger with the earthy perfume of riverbed clay, natural milk caramel, and deep silky cream.”';
  const artisanNote =
    content?.artisanNote ||
    'No gelatins, no artificial coloring, no synthetic thickeners. Pure cow milk, slow wood embers, and two centuries of northern Bangladeshi pride.';

  return (
    <section className="w-full bg-[#763C1E] text-[#FCE08B] py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto text-center space-y-12">
        <span className="text-xs font-mono tracking-widest text-[#FCE08B]/60 uppercase block">
          06 — PRODUCT STORY & CULINARY PURITY
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase max-w-3xl mx-auto leading-tight">
          {heading}
        </h2>

        <blockquote className="text-xl sm:text-2xl lg:text-3xl font-light italic leading-relaxed text-[#FCE08B]/95 max-w-4xl mx-auto">
          {quote}
        </blockquote>

        <div className="pt-8 border-t border-[#FCE08B]/20 max-w-xl mx-auto">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-[#FCE08B]/80 font-mono">
            {artisanNote}
          </p>
        </div>
      </div>
    </section>
  );
}
