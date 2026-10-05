'use client';

import React from 'react';
import Link from 'next/link';

interface OrderCtaSectionProps {
  tagline?: string;
}

export function OrderCtaSection({
  tagline = 'Bogura at your doorsteps',
}: OrderCtaSectionProps) {
  return (
    <section className="w-full bg-[#FCE08B] text-[#763C1E] py-24 sm:py-32 px-6 sm:px-8 lg:px-12 border-t border-[#763C1E]/15">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <span className="text-xs font-mono tracking-widest text-[#763C1E]/60 uppercase block">
          07 — DIRECT DISPATCH
        </span>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight leading-none text-[#763C1E]">
          {tagline}
        </h2>

        <p className="text-base sm:text-lg text-[#763C1E]/80 max-w-xl mx-auto font-normal leading-relaxed">
          Fresh earthen pots packed in specialized thermal wraps. Dispatched from Bogura straight to your home across Dhaka and Bangladesh.
        </p>

        <div className="pt-6">
          <Link
            href="/#products"
            className="inline-block bg-[#763C1E] text-[#FCE08B] px-10 sm:px-12 py-4 sm:py-5 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase hover:bg-[#502813] active:scale-[0.99] transition-all border border-[#763C1E]"
          >
            SELECT YOUR DOI
          </Link>
        </div>
      </div>
    </section>
  );
}
