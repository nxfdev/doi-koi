import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/hero/HeroSection';
import { AboutSection } from '@/components/about/AboutSection';
import { BangladeshMap } from '@/components/heritage/BangladeshMap';
import { HeritageSection } from '@/components/heritage/HeritageSection';
import { ProductCatalogue } from '@/components/products/ProductCatalogue';
import { ProductStorySection } from '@/components/home/ProductStorySection';
import { OrderCtaSection } from '@/components/home/OrderCtaSection';
import { Footer } from '@/components/layout/Footer';
import { getProducts, getSiteContent } from '@/lib/db';

export const revalidate = 0; // dynamic CMS rendering

export default async function HomePage() {
  const [products, content] = await Promise.all([
    getProducts(),
    getSiteContent(),
  ]);

  return (
    <main className="min-h-screen bg-[#FCE08B] text-[#763C1E] flex flex-col">
      {/* 01 — HERO COMPOSITION (Seamless Navbar inside Hero Top) */}
      <div className="relative w-full min-h-[100svh] flex flex-col justify-between bg-[#FCE08B]">
        <div className="absolute top-0 left-0 right-0 z-40">
          <Navbar isTransparent={true} />
        </div>
        <HeroSection content={content.hero} />
      </div>

      {/* 02 — ABOUT (Full-bleed 16:9 video + minimal text overlay) */}
      <AboutSection content={content.about} />

      {/* 03 — BANGLADESH MAP (Large vector map on brown field) */}
      <BangladeshMap />

      {/* 04 — THE ARTISAN PROCESS (Craftsmanship only) */}
      <HeritageSection content={content.heritage} />

      {/* 05 — OUR DOI / PRODUCTS (The Menu) */}
      <ProductCatalogue products={products} />

      {/* 06 — PRODUCT STORY & CULINARY PURITY */}
      <ProductStorySection content={content.productStory} />

      {/* 07 — DIRECT DISPATCH ORDER CTA */}
      <OrderCtaSection tagline={content.hero.tagline} />

      {/* 08 — MINIMAL EDITORIAL FOOTER */}
      <Footer content={content.footer} />
    </main>
  );
}
