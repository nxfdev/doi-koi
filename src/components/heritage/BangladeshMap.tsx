'use client';

import React from 'react';
import { BangladeshVectorMap } from './BangladeshVectorMap';

/**
 * BangladeshMap (Page 3 → Page 4) — Hero-scale monumental cartographic experience.
 *
 * Design Direction:
 * - The map is WIDTH-DRIVEN: it fills nearly the entire viewport width (≈93vw).
 * - Its height derives naturally from the 1000:1380 SVG aspect ratio (~1.38× width).
 * - At a 1920px viewport this produces ~1787px of map height — approximately
 *   1.66× a 1080px viewport, so the top half is visible on Page 3 and the
 *   remaining half is revealed as the user scrolls into Page 4.
 * - ONE continuous map. Zero duplication. Zero horizontal distortion.
 */
export function BangladeshMap() {
  return (
    <section
      id="heritage"
      className="relative w-full bg-[#763C1E] flex flex-col items-center justify-start pt-12 sm:pt-20 lg:pt-24 pb-10 sm:pb-14 select-none overflow-hidden"
      aria-label="Geographic map of Bangladesh with Bogura district"
    >
      {/*
        ── WIDTH-DRIVEN MAP CONTAINER ──
        Container spans 93vw, capped at 1820px on ultra-wide displays.
        3.5% breathing room on each side on all screen sizes.
        SVG fills the full container width; height auto-follows the viewBox ratio.
      */}
      <div
        className="relative flex justify-center items-start"
        style={{ width: 'min(93vw, 1820px)' }}
      >
        <BangladeshVectorMap
          className="w-full select-none pointer-events-none drop-shadow-sm"
        />
      </div>
    </section>
  );
}
