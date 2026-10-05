'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductCatalogueProps {
  products: Product[];
}

export function ProductCatalogue({ products }: ProductCatalogueProps) {
  return (
    <section
      id="products"
      className="w-full bg-[#FCE08B] text-[#763C1E] py-24 sm:py-32 px-6 sm:px-8 lg:px-12 border-t border-[#763C1E]/15"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[#763C1E]/20 pb-8 gap-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#763C1E]/60 uppercase block mb-3">
              05 — OUR DOI / PRODUCTS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase leading-none">
              The Bogura Collection
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#763C1E]/90 max-w-md font-normal leading-relaxed md:text-right">
            Four singular curd preparations, individually handcrafted in Bogura’s traditional earthenware kilns.
          </p>
        </div>

        {/* 4 Products List with Large Editorial Separation */}
        <div className="space-y-4">
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
