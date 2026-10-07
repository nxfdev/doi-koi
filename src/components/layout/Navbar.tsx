'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../cart/CartProvider';

interface NavbarProps {
  isTransparent?: boolean;
}

export function Navbar({ isTransparent = true }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  const navLinks = [
    { label: 'ABOUT', href: '/#about' },
    { label: 'HERITAGE', href: '/#heritage' },
    { label: 'PRODUCTS', href: '/#products' },
  ];

  return (
    <>
      <header
        className={`w-full z-40 transition-colors duration-200 ${
          isTransparent
            ? 'bg-transparent'
            : 'bg-[#FCE08B] border-b border-[#763C1E]/10'
        }`}
      >
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-6 sm:py-8 flex items-center justify-between">
          {/* Desktop Left: Bold, Enlarged Logo (500% visual scale) */}
          <div className="hidden md:flex items-center">
            <Link
              href="/"
              className="group relative flex items-center h-12 sm:h-14 lg:h-16 w-44 sm:w-52 lg:w-60 overflow-hidden hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-[#763C1E]"
              aria-label="DOI KOI Homepage"
            >
              {/* Geometric crop wrapper: centers and scales out empty whitespace to render the wordmark 500% larger */}
              <div className="relative w-full h-[492%] -my-[196%] shrink-0 pointer-events-none">
                <Image
                  src="/assets/brand/logo.png"
                  alt="DOI KOI — Bogura at your doorsteps"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>
          </div>

          {/* Mobile Left: Proportionally scaled enlarged Logo */}
          <div className="md:hidden flex items-center">
            <Link
              href="/"
              className="relative flex items-center h-10 w-36 overflow-hidden hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-[#763C1E]"
              aria-label="DOI KOI Homepage"
            >
              <div className="relative w-full h-[492%] -my-[196%] shrink-0 pointer-events-none">
                <Image
                  src="/assets/brand/logo.png"
                  alt="DOI KOI — Bogura at your doorsteps"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Right: Minimal Geometric Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center space-x-10 lg:space-x-12 text-[#763C1E] tracking-[0.2em] text-xs font-semibold"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative py-1 hover:opacity-70 transition-opacity focus-visible:ring-2 focus-visible:ring-[#763C1E]"
              >
                {link.label}
              </Link>
            ))}

            {/* CART Button with badge */}
            <button
              onClick={openCart}
              className="relative py-1 flex items-center gap-2 hover:opacity-70 transition-opacity uppercase font-semibold focus-visible:ring-2 focus-visible:ring-[#763C1E]"
              aria-label={`Open shopping cart with ${itemCount} items`}
            >
              <span>CART</span>
              {itemCount > 0 && (
                <span className="inline-flex items-center justify-center bg-[#763C1E] text-[#FCE08B] text-[10px] font-bold px-1.5 py-0.5 font-mono leading-none">
                  {itemCount}
                </span>
              )}
            </button>

            {/* ACCOUNT Link */}
            <Link
              href="/account"
              className="py-1 hover:opacity-70 transition-opacity focus-visible:ring-2 focus-visible:ring-[#763C1E]"
            >
              ACCOUNT
            </Link>
          </nav>

          {/* Mobile Right: Hamburger Menu & Cart Quick Icon */}
          <div className="md:hidden flex items-center space-x-4 text-[#763C1E]">
            <button
              onClick={openCart}
              className="p-2 relative hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#763C1E]"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#763C1E] text-[#FCE08B] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-[#763C1E] hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#763C1E]"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-6 h-6 stroke-[1.8]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Editorial Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#FCE08B] flex flex-col justify-between p-8 text-[#763C1E] animate-in fade-in duration-200">
          {/* Top Bar with Logo and Close */}
          <div className="flex items-center justify-between border-b border-[#763C1E]/20 pb-6">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="relative flex items-center h-10 w-36 overflow-hidden"
            >
              <div className="relative w-full h-[492%] -my-[196%] shrink-0">
                <Image
                  src="/assets/brand/logo.png"
                  alt="DOI KOI"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 border border-[#763C1E] text-[#763C1E] hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors focus-visible:ring-2 focus-visible:ring-[#763C1E]"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 flex flex-col justify-center space-y-8 my-10">
            {navLinks.map((link, idx) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-extrabold tracking-tight hover:translate-x-2 transition-transform duration-200 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-xs text-[#763C1E]/40 font-mono">0{idx + 1}</span>
              </Link>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openCart();
              }}
              className="text-3xl font-extrabold tracking-tight text-left hover:translate-x-2 transition-transform duration-200 flex items-center justify-between"
            >
              <span>CART</span>
              <span className="text-xs bg-[#763C1E] text-[#FCE08B] px-2.5 py-1 font-mono font-bold">
                {itemCount}
              </span>
            </button>

            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl font-extrabold tracking-tight hover:translate-x-2 transition-transform duration-200 flex items-center justify-between"
            >
              <span>ACCOUNT</span>
              <span className="text-xs text-[#763C1E]/40 font-mono">05</span>
            </Link>
          </nav>

          {/* Footer Info in Menu */}
          <div className="pt-6 border-t border-[#763C1E]/20 text-xs text-[#763C1E]/70 space-y-1">
            <p className="font-bold tracking-widest uppercase">DOI KOI — Bogura at your doorsteps</p>
            <p>Traditional product. Contemporary presentation.</p>
          </div>
        </div>
      )}
    </>
  );
}
