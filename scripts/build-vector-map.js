const fs = require('fs');
const path = require('path');

const adm0Path = path.join(__dirname, 'bgd-adm0.json');
const adm2Path = path.join(__dirname, 'bgd-adm2.json');

const adm0Data = JSON.parse(fs.readFileSync(adm0Path, 'utf8'));
const adm2Data = JSON.parse(fs.readFileSync(adm2Path, 'utf8'));

// Conformal Web Mercator projection
function project(lon, lat) {
  const xRad = (lon * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const yRad = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  return [xRad, yRad];
}

const minX = 1.5360403285185273;
const maxY = 0.4825676711112278;
const S = 920 / 0.0815353143931532;

function toSvg(lon, lat) {
  const [x, y] = project(lon, lat);
  const sx = 40 + (x - minX) * S;
  const sy = 40 + (maxY - y) * S;
  return [sx, sy];
}

function simplify(points, tol) {
  if (points.length <= 2) return points;
  let maxD = 0;
  let idx = 0;
  const [x1, y1] = points[0];
  const [x2, y2] = points[points.length - 1];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;

  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    let d;
    if (lenSq === 0) {
      d = Math.hypot(px - x1, py - y1);
    } else {
      const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
      const projX = x1 + t * dx;
      const projY = y1 + t * dy;
      d = Math.hypot(px - projX, py - projY);
    }
    if (d > maxD) {
      maxD = d;
      idx = i;
    }
  }

  if (maxD > tol) {
    const left = simplify(points.slice(0, idx + 1), tol);
    const right = simplify(points.slice(idx), tol);
    return left.slice(0, -1).concat(right);
  } else {
    return [points[0], points[points.length - 1]];
  }
}

function processPolygon(coordinates, tol) {
  return coordinates.map(ring => {
    const svgPts = ring.map(([lon, lat]) => toSvg(lon, lat));
    const simplified = simplify(svgPts, tol);
    return simplified
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(' ') + ' Z';
  }).join(' ');
}

// 1. Bangladesh national territory silhouette (ADM0) — ~0.2px tolerance for smooth, elegant country contour
const bdMainGeom = adm0Data.features[0].geometry;
const bdPolys = bdMainGeom.type === 'Polygon' ? [bdMainGeom.coordinates] : bdMainGeom.coordinates;
const bdPathParts = bdPolys.map(poly => processPolygon(poly, 0.2));
const bdMainPathD = bdPathParts.join(' ');

// 2. Bogura district from ADM2 — synchronized level of detail:
// Using tol = 2.4 gives ~65 clean points matching the curvature frequency & smooth geometric style of the Bangladesh silhouette
const bograFeature = adm2Data.features.find(f => {
  const name = (f.properties.shapeName || '').toLowerCase();
  return name.includes('bogra') || name.includes('bogura');
});

const bograGeom = bograFeature.geometry;
const bograPolys = bograGeom.type === 'Polygon' ? [bograGeom.coordinates] : bograGeom.coordinates;
const bograPathD = bograPolys.map(poly => processPolygon(poly, 2.4)).join(' ');

console.log('Bangladesh silhouette path length:', bdMainPathD.length);
console.log('Synchronized Bogura district path length:', bograPathD.length);

// Standalone SVG File
const svgContent = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1380" width="100%" height="100%" role="img" aria-label="Official cartographic vector map of Bangladesh highlighting Bogura district">',
  '  <!-- Bangladesh National Silhouette — Clean Unified Vector in Brand Cream (#FCE08B) -->',
  '  <path id="bangladesh-territory" fill="#FCE08B" d="' + bdMainPathD + '" />',
  '  <!-- Bogura District — Synchronized Level of Detail in Brand Brown (#763C1E) -->',
  '  <path id="district-bogura" fill="#763C1E" d="' + bograPathD + '" />',
  '</svg>',
].join('\n');

const svgOutPath = path.join(__dirname, '../public/assets/home/map/bangladesh-vector-map.svg');
fs.writeFileSync(svgOutPath, svgContent, 'utf8');
console.log('Saved SVG to:', svgOutPath, 'size:', svgContent.length, 'bytes');

// TSX Component
const tsxContent = `'use client';

import React from 'react';

/**
 * BangladeshVectorMap — 100% genuine vector geometry built from official BBS / geoBoundaries data.
 *
 * Visual Level of Detail:
 * - Synchronized detail between Bangladesh silhouette and Bogura district.
 * - Bogura's geometric curvature frequency matches the national boundary aesthetics.
 *
 * Color Specification:
 * - Bangladesh territory: #FCE08B (brand cream — seamless monolithic silhouette)
 * - Bogura district:      #763C1E (brand brown — synchronized geometric district polygon)
 * - Surrounding Canvas:   Transparent (integrates into #763C1E page background)
 *
 * Features:
 * - Genuine SVG vector paths (NO <img>, NO base64, NO raster tricks)
 * - Infinite scalability (sharp at 3000px, 4K, 8K)
 * - ViewBox: 0 0 1000 1380
 */
export function BangladeshVectorMap({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 1380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ height: '100%', width: 'auto', display: 'block' }}
      role="img"
      aria-label="Official cartographic vector map of Bangladesh highlighting Bogura district"
    >
      {/* Bangladesh Silhouette — Brand Cream */}
      <path
        id="bangladesh-territory"
        fill="#FCE08B"
        d="${bdMainPathD}"
      />

      {/* Bogura District — Synchronized Geometry in Brand Brown */}
      <path
        id="district-bogura"
        fill="#763C1E"
        d="${bograPathD}"
      />
    </svg>
  );
}
`;

const tsxOutPath = path.join(__dirname, '../src/components/heritage/BangladeshVectorMap.tsx');
fs.writeFileSync(tsxOutPath, tsxContent, 'utf8');
console.log('Saved TSX to:', tsxOutPath, 'size:', tsxContent.length, 'bytes');
