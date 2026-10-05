'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
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
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 flex items-center justify-between">
          {/* Desktop Left: Logo */}
          <div className="flex-1 hidden md:flex items-center">
            <Link
              href="/"
              className="inline-block relative h-10 w-44 hover:opacity-90 transition-opacity"
              aria-label="DOI KOI Homepage"
            >
              <Image
                src="/assets/brand/logo.png"
                alt="DOI KOI — Bogura at your doorsteps"
                fill
                priority
                className="object-contain object-left scale-125 origin-left"
              />
            </Link>
          </div>

          {/* Mobile Center: Logo */}
          <div className="flex-1 md:hidden flex justify-center pl-8">
            <Link
              href="/"
              className="inline-block relative h-8 w-36 hover:opacity-90 transition-opacity"
              aria-label="DOI KOI Homepage"
            >
              <Image
                src="/assets/brand/logo.png"
                alt="DOI KOI — Bogura at your doorsteps"
                fill
                priority
                className="object-contain object-center scale-125"
              />
            </Link>
          </div>

          {/* Desktop Right: Minimal Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center space-x-8 text-[#763C1E] tracking-widest text-xs font-semibold"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative py-1 hover:opacity-75 transition-opacity"
              >
                {link.label}
              </Link>
            ))}

            {/* CART Button */}
            <button
              onClick={openCart}
              className="relative py-1 flex items-center gap-1.5 hover:opacity-75 transition-opacity uppercase font-semibold"
              aria-label={`Open shopping cart with ${itemCount} items`}
            >
              <span>CART</span>
              {itemCount > 0 && (
                <span className="inline-flex items-center justify-center bg-[#763C1E] text-[#FCE08B] text-[10px] font-bold px-1.5 py-0.5 rounded-xs leading-none">
                  {itemCount}
                </span>
              )}
            </button>

            {/* ACCOUNT Link */}
            <Link
              href="/account"
              className="py-1 hover:opacity-75 transition-opacity"
            >
              ACCOUNT
            </Link>
          </nav>

          {/* Mobile Right: Hamburger Menu & Cart Quick Icon */}
          <div className="md:hidden flex items-center space-x-3 text-[#763C1E]">
            <button
              onClick={openCart}
              className="p-1.5 relative hover:opacity-80"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#763C1E] text-[#FCE08B] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-[#763C1E] hover:opacity-80 focus:outline-none"
              aria-label="Open navigation menu"
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
              className="relative h-8 w-32"
            >
              <Image
                src="/assets/brand/logo.png"
                alt="DOI KOI"
                fill
                className="object-contain object-left scale-125 origin-left"
              />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 border border-[#763C1E] text-[#763C1E] hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors"
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
