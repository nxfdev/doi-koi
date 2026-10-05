'use client';

import React from 'react';
import { SiteContent } from '@/lib/types';
import { AboutVideoPlayer } from './AboutVideoPlayer';

interface AboutSectionProps {
  content?: SiteContent['about'];
}

export function AboutSection({ content }: AboutSectionProps) {
  const heading = content?.heading || 'The Art of Authentic Bogura Doi';
  const subheading =
    content?.subheading || 'Tradition meets uncompromising quality.';
  const bodyParagraphs = content?.bodyParagraphs || [
    'Doi Koi was born out of deep reverence for Bogura’s two-century-old culinary heritage. For generations, master artisans have perfected caramelizing pure cow milk inside porous earthen pots.',
    'Unlike factory-made yogurt, true Bogura doi relies on unhurried patience: whole milk simmering over slow wood fires, developing its iconic russet crust and silken depth naturally, without synthetic additives or artificial stabilizers.',
    'Our mission is singular: to preserve this time-honored craft and bring authentic Bogura doi directly to your doorsteps across Bangladesh, packaged in traditional terracotta pots that breathe and keep the curd perfectly chilled.',
  ];

  const videoUrl = content?.videoUrl || '/assets/home/about/about-video.mp4';
  const videoPoster = content?.videoPoster || '/assets/home/hero/hero-doi.png';

  return (
    <section
      id="about"
      className="w-full bg-[#FCE08B] text-[#763C1E] py-24 sm:py-32 px-6 sm:px-8 lg:px-12 border-t border-[#763C1E]/15"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[#763C1E]/20 pb-8 gap-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#763C1E]/60 uppercase block mb-3">
              02 — ABOUT DOI KOI
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase max-w-2xl leading-none">
              {heading}
            </h2>
          </div>
          <p className="text-sm font-semibold tracking-wider uppercase text-[#763C1E]/80 max-w-xs md:text-right">
            {subheading}
          </p>
        </div>

        {/* Content Grid: Video on Left, Editorial Copy on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Video Container (7 cols) */}
          <div className="lg:col-span-7">
            <AboutVideoPlayer
              src={videoUrl}
              poster={videoPoster}
              autoplay={content?.autoplay ?? false}
              loop={content?.loop ?? true}
              muted={content?.muted ?? true}
            />
            <div className="mt-4 flex items-center justify-between text-xs text-[#763C1E]/70 font-mono uppercase tracking-widest">
              <span>Artifact 01: Fire & Terracotta Craft</span>
              <span>Bogura, Bangladesh</span>
            </div>
          </div>

          {/* Editorial Text (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6 text-[#763C1E] text-base sm:text-lg leading-relaxed font-normal">
              {bodyParagraphs.map((para, i) => (
                <p key={i} className="text-[#763C1E]/90">
                  {para}
                </p>
              ))}
            </div>

            <div className="pt-8 border-t border-[#763C1E]/20 grid grid-cols-2 gap-6">
              <div>
                <span className="block text-3xl font-extrabold font-mono text-[#763C1E]">
                  200+
                </span>
                <span className="text-xs uppercase tracking-wider text-[#763C1E]/70 mt-1 block">
                  Years of Bogura Tradition
                </span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold font-mono text-[#763C1E]">
                  100%
                </span>
                <span className="text-xs uppercase tracking-wider text-[#763C1E]/70 mt-1 block">
                  Raw Cow Milk & Clay Pots
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
