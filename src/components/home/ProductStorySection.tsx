'use client';

import React from 'react';
import { SiteContent } from '@/lib/types';

interface ProductStorySectionProps {
  content?: SiteContent['productStory'];
}

export function ProductStorySection({ content }: ProductStorySectionProps) {
  const heading = content?.heading || 'Purity in Every Clay Shora';
  const artisanNote =
    content?.artisanNote ||
    'No gelatins, no artificial coloring, no synthetic thickeners. Pure cow milk, slow wood embers, and two centuries of northern Bangladeshi heritage.';

  return (
    <section className="w-full bg-[#763C1E] text-[#FCE08B] py-28 sm:py-36 lg:py-44 px-6 sm:px-10 lg:px-16">
      <div className="w-full max-w-4xl mx-auto text-center space-y-10">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase leading-tight">
          {heading}
        </h2>

        <p className="text-base sm:text-lg lg:text-xl font-normal leading-relaxed text-[#FCE08B]/90 max-w-2xl mx-auto tracking-wide">
          {artisanNote}
        </p>
      </div>
    </section>
  );
}
