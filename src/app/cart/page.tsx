'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/components/cart/CartProvider';
import { formatBDT } from '@/lib/utils';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, itemCount } = useCart();

  return (
    <div className="min-h-screen bg-[#FCE08B] text-[#763C1E] flex flex-col justify-between">
      <Navbar isTransparent={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#763C1E]/70 hover:text-[#763C1E] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="border-b border-[#763C1E]/20 pb-6 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#763C1E]/60 block mb-2">
              Your Curd Selection
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
              Shopping Cart
            </h1>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-mono uppercase text-[#763C1E]/70 hover:text-[#763C1E] underline tracking-widest"
            >
              Empty Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center space-y-6 max-w-md mx-auto">
            <div className="w-20 h-20 border-2 border-dashed border-[#763C1E]/30 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">🍯</span>
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight">
              Your cart is currently empty
            </h2>
            <p className="text-sm text-[#763C1E]/80 leading-relaxed font-normal">
              Each shora of Bogura doi is slow-cooked over wood embers and cultured in traditional red earthenware.
            </p>
            <Link
              href="/#products"
              className="inline-block bg-[#763C1E] text-[#FCE08B] px-8 py-4 font-bold text-xs tracking-widest uppercase hover:bg-[#502813] transition-colors"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Items Table (8 cols) */}
            <div className="lg:col-span-8 border border-[#763C1E]/20 bg-[#F4D272]/20 divide-y divide-[#763C1E]/15">
              {items.map(({ productId, product, quantity }) => (
                <div
                  key={productId}
                  className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <div className="w-24 h-24 bg-[#F4D272]/50 border border-[#763C1E]/20 shrink-0 relative flex items-center justify-center">
                      <Image
                        src={product.images[0] || '/assets/home/hero/hero-doi.png'}
                        alt={product.name}
                        width={90}
                        height={90}
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-bold text-lg hover:underline block"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-[#763C1E]/70 mt-1">
                        {product.weight || '1kg Terracotta Pot'}
                      </p>
                      <span className="text-sm font-mono font-bold text-[#763C1E] mt-2 block">
                        {formatBDT(product.price)} each
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-[#763C1E]/10">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#763C1E]">
                      <button
                        onClick={() => updateQuantity(productId, quantity - 1)}
                        className="p-2 hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 py-1.5 font-mono font-bold text-sm min-w-10 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(productId, quantity + 1)}
                        className="p-2 hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <span className="text-lg font-mono font-bold min-w-24 text-right">
                      {formatBDT(product.price * quantity)}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(productId)}
                      className="p-2 text-[#763C1E]/60 hover:text-red-700 transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Box (4 cols) */}
            <div className="lg:col-span-4 border border-[#763C1E]/20 bg-[#F4D272]/40 p-8 space-y-6">
              <h3 className="text-lg font-bold uppercase tracking-tight border-b border-[#763C1E]/15 pb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#763C1E]/80">
                  <span>Selected items ({itemCount})</span>
                  <span className="font-mono font-semibold">{formatBDT(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#763C1E]/80">
                  <span>Delivery fee</span>
                  <span className="text-xs">From ৳80 (Calculated at step)</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-4 border-t border-[#763C1E]/20 text-[#763C1E]">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatBDT(subtotal)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 bg-[#763C1E] text-[#FCE08B] py-4 px-6 font-bold tracking-widest text-xs uppercase hover:bg-[#502813] transition-colors border border-[#763C1E]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-[11px] text-[#763C1E]/70 text-center leading-relaxed">
                  Cash on Delivery & Mobile Banking (bKash/Nagad) supported nationwide.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
