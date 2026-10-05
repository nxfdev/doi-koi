'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { useCart } from '@/components/cart/CartProvider';
import { formatBDT } from '@/lib/utils';
import { Plus, Minus, ArrowLeft, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface ProductDetailPageClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailPageClient({
  product,
  relatedProducts,
}: ProductDetailPageClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(
    product.images[0] || '/assets/home/hero/hero-doi.png'
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isSoldOut = !product.isAvailable || product.stock <= 0;
  const isPriceUnset = product.price <= 0;

  const handleAddToCart = () => {
    if (isSoldOut || isPriceUnset) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (isSoldOut || isPriceUnset) return;
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
      {/* Breadcrumb Back Link */}
      <div className="mb-8">
        <Link
          href="/#products"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#763C1E]/70 hover:text-[#763C1E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Collection</span>
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left: Product Media Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Large Visual Stage */}
          <div className="w-full aspect-square bg-[#F4D272]/30 border border-[#763C1E]/20 p-8 sm:p-12 flex items-center justify-center relative overflow-hidden">
            <div className="w-[85%] h-[85%] relative">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                className="object-contain drop-shadow-sm"
              />
            </div>
            {product.isFeatured && (
              <span className="absolute top-4 left-4 bg-[#763C1E] text-[#FCE08B] text-[10px] font-mono uppercase font-bold tracking-widest px-2.5 py-1">
                Signature Bogura
              </span>
            )}
            {isSoldOut && (
              <span className="absolute top-4 right-4 bg-red-800 text-white text-[10px] font-mono uppercase font-bold tracking-widest px-2.5 py-1">
                SOLD OUT
              </span>
            )}
          </div>

          {/* Media Thumbnails if multiple exist */}
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 shrink-0 border relative p-2 bg-[#F4D272]/20 transition-all ${
                    selectedImage === img
                      ? 'border-[#763C1E] ring-1 ring-[#763C1E]'
                      : 'border-[#763C1E]/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Video preview if available */}
          {product.videos && product.videos.length > 0 && (
            <div className="pt-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#763C1E]/70 block mb-2">
                Craft Video Documentation
              </span>
              <video
                src={product.videos[0]}
                controls
                className="w-full border border-[#763C1E]/20 bg-black aspect-video"
              />
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#763C1E]/60 block mb-2">
              Authentic Earthen Shora
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#763C1E] leading-none">
              {product.name}
            </h1>
            {product.bengaliName && (
              <p className="text-base text-[#763C1E]/75 mt-1 font-medium">
                {product.bengaliName}
              </p>
            )}
          </div>

          {/* Price & Stock Display */}
          <div className="flex items-baseline justify-between border-y border-[#763C1E]/20 py-4">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#763C1E]">
                {isPriceUnset ? 'Price to be defined' : formatBDT(product.price)}
              </span>
              <span className="text-xs text-[#763C1E]/60 block mt-0.5">
                Per {product.weight || '1kg Pot'} (Inclusive of all taxes)
              </span>
            </div>

            <div>
              {isSoldOut ? (
                <span className="text-xs font-mono font-bold uppercase text-red-700">
                  Currently Out of Stock
                </span>
              ) : (
                <span className="text-xs font-mono uppercase text-emerald-800 font-bold">
                  ● Fresh Daily Stock ({product.stock} available)
                </span>
              )}
            </div>
          </div>

          {/* Tagline & Description */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#763C1E]">
              {product.tagline}
            </h3>
            <p className="text-sm sm:text-base text-[#763C1E]/90 leading-relaxed font-normal">
              {product.description}
            </p>
          </div>

          {/* Purchase Actions & Quantity */}
          {!isSoldOut && !isPriceUnset && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[#763C1E]/70">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#763C1E]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-1.5 font-mono font-bold text-sm min-w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-2 hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-[#763C1E]/60">
                  Subtotal: <strong className="text-[#763C1E] font-mono">{formatBDT(product.price * quantity)}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-200 border flex items-center justify-center gap-2 ${
                    added
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-[#763C1E] text-[#FCE08B] border-[#763C1E] hover:bg-[#502813] active:scale-[0.99]'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added</span>
                    </>
                  ) : (
                    <span>Add to Cart</span>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-4 text-xs font-bold tracking-[0.2em] uppercase border border-[#763C1E] text-[#763C1E] hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          )}

          {/* Delivery & Assurance Guarantees */}
          <div className="border-t border-[#763C1E]/15 pt-6 space-y-3 text-xs text-[#763C1E]/80">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#763C1E] shrink-0" />
              <span>Chilled dispatch from Bogura to Dhaka & Nationwide</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#763C1E] shrink-0" />
              <span>100% Authentic wood-fired earthen shora guarantee</span>
            </div>
          </div>

          {/* Product Specifications & Editorial Accordion Data */}
          <div className="divide-y divide-[#763C1E]/15 border-t border-b border-[#763C1E]/20 text-xs">
            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="py-4 space-y-2">
                <span className="font-bold uppercase tracking-wider text-[#763C1E] block">
                  Pure Ingredients
                </span>
                <ul className="list-disc list-inside space-y-1 text-[#763C1E]/85">
                  {product.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nutrition */}
            {product.nutritionalInfo && (
              <div className="py-4 space-y-2">
                <span className="font-bold uppercase tracking-wider text-[#763C1E] block">
                  Nutritional Values (Approx. per 100g)
                </span>
                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  <div className="bg-[#F4D272]/50 p-2 border border-[#763C1E]/10">
                    <span className="block text-[10px] text-[#763C1E]/60 uppercase">Energy</span>
                    <span className="font-bold">{product.nutritionalInfo.calories}</span>
                  </div>
                  <div className="bg-[#F4D272]/50 p-2 border border-[#763C1E]/10">
                    <span className="block text-[10px] text-[#763C1E]/60 uppercase">Protein</span>
                    <span className="font-bold">{product.nutritionalInfo.protein}</span>
                  </div>
                  <div className="bg-[#F4D272]/50 p-2 border border-[#763C1E]/10">
                    <span className="block text-[10px] text-[#763C1E]/60 uppercase">Fat</span>
                    <span className="font-bold">{product.nutritionalInfo.fat}</span>
                  </div>
                  <div className="bg-[#F4D272]/50 p-2 border border-[#763C1E]/10">
                    <span className="block text-[10px] text-[#763C1E]/60 uppercase">Carbs</span>
                    <span className="font-bold">{product.nutritionalInfo.carbs}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Storage & Shelf Life */}
            <div className="py-4 grid grid-cols-2 gap-4">
              <div>
                <span className="font-bold uppercase tracking-wider text-[#763C1E] block">
                  Storage Protocol
                </span>
                <p className="text-[#763C1E]/85 mt-1 leading-relaxed">
                  {product.storageInstructions || 'Keep refrigerated at 2°C–5°C in clay pot.'}
                </p>
              </div>
              <div>
                <span className="font-bold uppercase tracking-wider text-[#763C1E] block">
                  Shelf Life
                </span>
                <p className="text-[#763C1E]/85 mt-1 leading-relaxed">
                  {product.shelfLife || '5 to 7 days under refrigeration.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Collection */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 pt-16 border-t border-[#763C1E]/20">
          <span className="text-xs font-mono uppercase tracking-widest text-[#763C1E]/60 block mb-6">
            Complementary Selections
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                href={`/products/${rel.slug}`}
                className="group border border-[#763C1E]/20 bg-[#F4D272]/20 p-6 flex flex-col justify-between hover:border-[#763C1E] transition-colors"
              >
                <div className="w-full aspect-square relative mb-4">
                  <Image
                    src={rel.images[0] || '/assets/home/hero/hero-doi.png'}
                    alt={rel.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <h4 className="font-bold uppercase text-lg text-[#763C1E] group-hover:underline">
                    {rel.name}
                  </h4>
                  <span className="text-xs font-mono text-[#763C1E]/80 mt-1 block">
                    {rel.price > 0 ? formatBDT(rel.price) : 'Price to be set'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
