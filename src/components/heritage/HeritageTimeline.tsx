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
      phase: '01 — ORIGIN',
      title: 'The Bogura Heritage',
      description:
        'Born in the fertile dairy heartland of northern Bangladesh, Bogura doi is renowned for centuries of mastery. Rich cow milk and heritage bacterial strains produce an incomparable flavor profile.',
    },
    {
      phase: '02 — THE CLAY',
      title: 'Artisanal Terracotta Shora',
      description:
        'Master potters sculpt unglazed red clay bowls from local river silt. The porous earthenware naturally wicks excess moisture, ensuring an exceptionally thick, dense curd.',
    },
    {
      phase: '03 — THE SLOW SIMMER',
      title: 'Wood-Fired Caramelization',
      description:
        'Pure milk is slowly condensed over tamarind-wood fires for 12 hours. Natural sugars caramelize deeply, forming the iconic golden-brown surface crust.',
    },
    {
      phase: '04 — THE FERMENTATION',
      title: 'Overnight Chamber Setting',
      description:
        'The warm reduction is inoculated with traditional mother culture and set in straw-insulated rooms overnight, setting into firm, velvety yogurt by morning.',
    },
    {
      phase: '05 — YOUR DOORSTEP',
      title: 'Chilled Express Delivery',
      description:
        'Dispatched in temperature-controlled packaging from Bogura straight to your dining table in Dhaka and across Bangladesh.',
    },
  ];

  const timelineSteps = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="w-full">
      <div className="border-t border-[#763C1E]/20">
        <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-[#763C1E]/20">
          {timelineSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 flex flex-col justify-between hover:bg-[#F4D272]/30 transition-colors group"
            >
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-[#763C1E]/60 block mb-4 group-hover:text-[#763C1E] transition-colors">
                  {step.phase}
                </span>
                <h4 className="text-lg font-bold uppercase tracking-tight text-[#763C1E] leading-snug mb-3">
                  {step.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#763C1E]/80 leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#763C1E]/10 flex items-center justify-between text-[10px] font-mono tracking-widest text-[#763C1E]/50">
                <span>STAGE {idx + 1} OF 5</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
