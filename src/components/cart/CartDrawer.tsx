'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from './CartProvider';
import { formatBDT } from '@/lib/utils';

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    itemCount,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-[#763C1E]/30 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FCE08B] border-l border-[#763C1E]/20 text-[#763C1E] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="px-6 py-6 border-b border-[#763C1E]/15 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight uppercase">
                Shopping Cart
              </h2>
              <p className="text-xs tracking-wider text-[#763C1E]/70 uppercase mt-0.5">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
            <button
              onClick={closeCart}
              className="p-2 border border-[#763C1E] text-[#763C1E] hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 border-2 border-dashed border-[#763C1E]/30 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl">🍯</span>
                </div>
                <h3 className="text-lg font-bold uppercase tracking-wide">
                  Your cart is empty
                </h3>
                <p className="text-sm text-[#763C1E]/80 max-w-xs mt-2 leading-relaxed">
                  Experience authentic Bogura doi slow-crafted in traditional red clay shora.
                </p>
                <Link
                  href="/#products"
                  onClick={closeCart}
                  className="mt-6 inline-block bg-[#763C1E] text-[#FCE08B] px-6 py-3 font-semibold text-sm tracking-wider uppercase hover:bg-[#502813] transition-colors"
                >
                  Explore Our Doi
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#763C1E]/15 space-y-4">
                {items.map(({ productId, product, quantity }) => (
                  <div key={productId} className="pt-4 first:pt-0 flex gap-4">
                    <div className="w-20 h-20 bg-[#F4D272] border border-[#763C1E]/20 shrink-0 relative overflow-hidden flex items-center justify-center">
                      <Image
                        src={product.images[0] || '/assets/home/hero/hero-doi.png'}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link
                            href={`/products/${product.slug}`}
                            onClick={closeCart}
                            className="font-bold text-base leading-tight hover:underline"
                          >
                            {product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(productId)}
                            className="text-[#763C1E]/60 hover:text-[#763C1E] p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-[#763C1E]/70 mt-0.5">
                          {product.weight || '1kg Terracotta Pot'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#763C1E]">
                          <button
                            onClick={() => updateQuantity(productId, quantity - 1)}
                            className="px-2 py-1 hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 py-1 font-mono text-sm font-semibold min-w-8 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(productId, quantity + 1)}
                            className="px-2 py-1 hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="font-bold text-base">
                          {formatBDT(product.price * quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#763C1E]/20 bg-[#F4D272]/50 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-[#763C1E]/80">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatBDT(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#763C1E]/70">
                  <span>Delivery fee</span>
                  <span>Calculated at checkout (From ৳80)</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#763C1E]/20">
                  <span>Estimated Total</span>
                  <span>{formatBDT(subtotal)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 bg-[#763C1E] text-[#FCE08B] py-3.5 px-4 font-bold tracking-widest text-sm uppercase hover:bg-[#502813] transition-colors"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full block text-center border border-[#763C1E] text-[#763C1E] py-2.5 px-4 font-semibold text-xs tracking-widest uppercase hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors"
                >
                  View Full Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
