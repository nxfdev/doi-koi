'use client';

import React from 'react';

interface BoguraMapProps {
  originName?: string;
  destinationName?: string;
  originDetail?: string;
  destinationDetail?: string;
}

export function BoguraMap({
  originName = 'BOGURA (বগুড়া)',
  destinationName = 'DHAKA & NATIONWIDE',
  originDetail = 'Artisanal Wood-Fired Hearth & Clay Setting',
  destinationDetail = 'Direct Chilled Delivery at Your Doorsteps',
}: BoguraMapProps) {
  return (
    <div className="w-full bg-[#FCE08B] border border-[#763C1E]/20 p-8 sm:p-12 relative overflow-hidden">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#763C1E]/15 pb-6 mb-8 gap-2">
        <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
          Geographic Lineage
        </h3>
        <span className="text-xs font-mono uppercase tracking-widest text-[#763C1E]/70">
          Bogura 24.85°N → Dhaka 23.81°N
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Editorial Map SVG Container (7 cols) */}
        <div className="lg:col-span-7 flex justify-center py-4">
          <div className="w-full max-w-[480px] aspect-[4/5] relative">
            <svg
              viewBox="0 0 400 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              aria-label="Minimal editorial map illustrating the journey from Bogura to Dhaka"
            >
              {/* Minimal Geometric Boundary of Bangladesh */}
              <path
                d="M 175 40 
                   L 230 45 
                   L 280 85 
                   L 320 130 
                   L 375 160 
                   L 370 210 
                   L 330 250 
                   L 350 310 
                   L 325 390 
                   L 280 430 
                   L 245 425 
                   L 220 455 
                   L 190 445 
                   L 150 450 
                   L 135 395 
                   L 105 370 
                   L 95 320 
                   L 80 270 
                   L 60 210 
                   L 95 160 
                   L 105 110 
                   L 140 70 Z"
                stroke="#763C1E"
                strokeWidth="1.25"
                strokeOpacity="0.35"
                fill="none"
              />

              {/* Minimal River Corridors (Jamuna & Padma) */}
              <path
                d="M 185 45 Q 170 140 180 220 Q 190 270 240 330 Q 280 380 285 430"
                stroke="#763C1E"
                strokeWidth="0.75"
                strokeOpacity="0.2"
                strokeDasharray="4 4"
                fill="none"
              />

              {/* The Express Route Line: Bogura -> Dhaka */}
              {/* Bogura coordinate ~ (170, 175), Dhaka ~ (225, 270) */}
              <path
                d="M 170 175 Q 185 220 225 270"
                stroke="#763C1E"
                strokeWidth="2.5"
                className="map-route-line"
              />

              {/* Extension Route to Nationwide Doorsteps */}
              <path
                d="M 225 270 Q 255 315 285 360"
                stroke="#763C1E"
                strokeWidth="1"
                strokeDasharray="2 3"
                strokeOpacity="0.5"
              />
              <path
                d="M 225 270 Q 180 310 145 350"
                stroke="#763C1E"
                strokeWidth="1"
                strokeDasharray="2 3"
                strokeOpacity="0.5"
              />

              {/* Origin Point: BOGURA */}
              <g transform="translate(170, 175)">
                <circle r="7" fill="#763C1E" />
                <circle
                  r="13"
                  stroke="#763C1E"
                  strokeWidth="1.5"
                  className="animate-ping opacity-30"
                />
                <circle r="20" stroke="#763C1E" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.6" />
                <text
                  x="-12"
                  y="-14"
                  fill="#763C1E"
                  fontSize="12"
                  fontWeight="800"
                  fontFamily="sans-serif"
                  letterSpacing="2"
                  textAnchor="end"
                >
                  BOGURA
                </text>
                <text
                  x="-12"
                  y="-2"
                  fill="#763C1E"
                  fontSize="8"
                  opacity="0.75"
                  fontFamily="sans-serif"
                  letterSpacing="1"
                  textAnchor="end"
                >
                  ORIGIN
                </text>
              </g>

              {/* Destination Point: DHAKA */}
              <g transform="translate(225, 270)">
                <circle r="6" fill="#763C1E" />
                <circle r="12" stroke="#763C1E" strokeWidth="1" opacity="0.6" />
                <text
                  x="16"
                  y="4"
                  fill="#763C1E"
                  fontSize="12"
                  fontWeight="800"
                  fontFamily="sans-serif"
                  letterSpacing="2"
                >
                  DHAKA
                </text>
                <text
                  x="16"
                  y="16"
                  fill="#763C1E"
                  fontSize="8"
                  opacity="0.75"
                  fontFamily="sans-serif"
                  letterSpacing="1"
                >
                  CENTRAL HUB
                </text>
              </g>

              {/* Doorstep Marker */}
              <g transform="translate(285, 360)">
                <circle r="3" fill="#763C1E" opacity="0.8" />
                <text
                  x="10"
                  y="4"
                  fill="#763C1E"
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="sans-serif"
                  letterSpacing="1"
                >
                  YOUR DOORSTEP
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Narrative Flow (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-6">
            <div className="border-l-2 border-[#763C1E] pl-4">
              <span className="text-xs font-mono tracking-widest text-[#763C1E]/60 uppercase block">
                Origin
              </span>
              <h4 className="text-lg font-bold uppercase mt-1">{originName}</h4>
              <p className="text-sm text-[#763C1E]/80 mt-1 leading-relaxed">
                {originDetail}
              </p>
            </div>

            <div className="text-center py-1">
              <span className="font-mono text-xs text-[#763C1E]/60 tracking-widest">
                ↓ 210 KM EXPRESS CHILLED ROUTE ↓
              </span>
            </div>

            <div className="border-l-2 border-[#763C1E] pl-4">
              <span className="text-xs font-mono tracking-widest text-[#763C1E]/60 uppercase block">
                Destination
              </span>
              <h4 className="text-lg font-bold uppercase mt-1">{destinationName}</h4>
              <p className="text-sm text-[#763C1E]/80 mt-1 leading-relaxed">
                {destinationDetail}
              </p>
            </div>
          </div>

          <div className="bg-[#F4D272]/50 p-6 border border-[#763C1E]/15">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#763C1E]">
              Fresh Transit Protocol
            </h5>
            <p className="text-xs text-[#763C1E]/80 mt-2 leading-relaxed">
              Every earthen shora travels packed within shock-absorbent thermal wraps. The natural clay breathes during transit, arriving at your doorstep cold, dense, and undisturbed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
