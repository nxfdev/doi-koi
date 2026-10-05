'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useCart } from '../cart/CartProvider';
import { formatBDT } from '@/lib/utils';
import { Check, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.isAvailable || product.stock <= 0 || product.price <= 0) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isSoldOut = !product.isAvailable || product.stock <= 0;
  const isPriceUnset = product.price <= 0;

  return (
    <article className="w-full border-t border-[#763C1E]/20 pt-16 pb-20 group">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        {/* Left Side: Editorial Details (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6 order-2 lg:order-1">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono font-bold tracking-widest text-[#763C1E]/60 uppercase">
                Product 0{index + 1}
              </span>
              {product.isFeatured && (
                <span className="text-[10px] font-mono uppercase tracking-widest bg-[#763C1E] text-[#FCE08B] px-2 py-0.5 font-bold">
                  Signature Selection
                </span>
              )}
              {isSoldOut && (
                <span className="text-[10px] font-mono uppercase tracking-widest bg-red-800 text-white px-2 py-0.5 font-bold">
                  SOLD OUT
                </span>
              )}
            </div>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-[#763C1E] leading-none">
              <Link
                href={`/products/${product.slug}`}
                className="hover:opacity-85 transition-opacity"
              >
                {product.name}
              </Link>
            </h3>

            {product.bengaliName && (
              <p className="text-sm font-medium text-[#763C1E]/75">
                {product.bengaliName}
              </p>
            )}

            <p className="text-sm sm:text-base text-[#763C1E]/90 leading-relaxed max-w-lg pt-2 font-normal">
              {product.description}
            </p>
          </div>

          {/* Earthen Pot & Craft Attributes */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#763C1E]/15 text-xs text-[#763C1E]/80">
            <div>
              <span className="block font-mono text-[#763C1E]/50 uppercase tracking-wider text-[10px]">
                Vessel / Setting
              </span>
              <span className="font-semibold">{product.potType || 'Terracotta Shora'}</span>
            </div>
            <div>
              <span className="block font-mono text-[#763C1E]/50 uppercase tracking-wider text-[10px]">
                Weight / Volume
              </span>
              <span className="font-semibold">{product.weight || '1 kg Standard'}</span>
            </div>
          </div>

          {/* Pricing & CTA Controls */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="min-w-32">
              <span className="text-[10px] font-mono text-[#763C1E]/60 uppercase tracking-widest block">
                Price per Shora
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#763C1E] font-mono">
                {isPriceUnset ? 'Price to be set' : formatBDT(product.price)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isSoldOut || isPriceUnset}
                className={`px-6 sm:px-8 py-3.5 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-200 border flex items-center gap-2 ${
                  isSoldOut || isPriceUnset
                    ? 'border-[#763C1E]/30 text-[#763C1E]/40 cursor-not-allowed bg-transparent'
                    : added
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-[#763C1E] text-[#FCE08B] border-[#763C1E] hover:bg-[#502813] active:scale-[0.99]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : isSoldOut ? (
                  <span>Sold Out</span>
                ) : isPriceUnset ? (
                  <span>Configuring</span>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <Link
                href={`/products/${product.slug}`}
                className="px-5 py-3.5 text-xs font-semibold tracking-widest uppercase border border-[#763C1E] text-[#763C1E] hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors"
              >
                Details
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Large Editorial Product Composition (6 cols) */}
        <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
          <Link
            href={`/products/${product.slug}`}
            className="w-full max-w-[420px] aspect-square relative bg-[#F4D272]/40 border border-[#763C1E]/20 p-8 flex items-center justify-center overflow-hidden group-hover:border-[#763C1E]/40 transition-colors"
          >
            {/* Visual representation: authentic circular doi photography with subtle slow hover rotation */}
            <div className="w-[85%] h-[85%] relative transition-transform duration-700 ease-out group-hover:scale-105">
              <Image
                src={product.images[0] || '/assets/home/hero/hero-doi.png'}
                alt={`${product.name} — Authentic Bogura Doi`}
                fill
                className="object-contain drop-shadow-sm"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 420px"
              />
            </div>

            {/* Subtle editorial corner coordinates */}
            <div className="absolute top-3 left-3 text-[9px] font-mono text-[#763C1E]/50 uppercase tracking-widest">
              BOGURA SPEC 0{index + 1}
            </div>
            <div className="absolute bottom-3 right-3 text-[9px] font-mono text-[#763C1E]/50 uppercase tracking-widest">
              POT CULTURE
            </div>
          </Link>
        </div>
      </div>
    </article>
  );
}
