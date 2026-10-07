'use client';

import React from 'react';

interface TimelineStep {
  phase: string;
  title: string;
  description: string;
}

interface HeritageTimelineProps {
  steps?: TimelineStep[];
}

export function HeritageTimeline({ steps }: HeritageTimelineProps) {
  const defaultSteps: TimelineStep[] = [
    {
      phase: '01',
      title: 'The Terracotta Shora',
      description:
        'Master potters sculpt unglazed red clay bowls from local river silt. The porous earthenware naturally wicks excess moisture, ensuring an exceptionally thick, dense curd.',
    },
    {
      phase: '02',
      title: 'Wood-Fired Simmer',
      description:
        'Pure whole cow milk is simmered slowly over wood embers for hours. Natural milk sugars caramelize deeply, forming the iconic golden-russet surface crust.',
    },
    {
      phase: '03',
      title: 'Overnight Setting',
      description:
        'The warm reduction is inoculated with traditional heirloom mother culture and rested inside straw chambers overnight, setting into velvety curd by dawn.',
    },
    {
      phase: '04',
      title: 'Earthen Dispatch',
      description:
        'Sealed in breathable earthenware and packed in temperature-controlled parcels, dispatched fresh from northern kilns straight to your table.',
    },
  ];

  const timelineSteps = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="w-full">
      {/* Unboxed, cinematic process spread — no divider borders, no cards, pure editorial layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-14 lg:gap-16 items-start">
        {timelineSteps.map((step, idx) => (
          <div key={idx} className="space-y-4">
            <span className="block font-mono text-2xl sm:text-3xl font-extrabold text-[#FCE08B]/35 tracking-tight">
              {String(idx + 1).padStart(2, '0')}
            </span>

            <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#FCE08B] leading-snug">
              {step.title}
            </h3>

            <p className="text-sm text-[#FCE08B]/75 leading-relaxed font-normal">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
