'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SiteContent } from '@/lib/types';

interface FooterProps {
  content?: SiteContent['footer'];
}

export function Footer({ content }: FooterProps) {
  return (
    <footer className="w-full bg-[#502813] text-[#FCE08B] border-t border-[#763C1E]/30 py-16 sm:py-20 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Tier: Logo & Tagline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#FCE08B]/20 pb-12 gap-8">
          <div>
            <div className="relative h-10 w-48 mb-4">
              <Image
                src="/assets/brand/logo.png"
                alt="DOI KOI"
                fill
                className="object-contain object-left brightness-200 contrast-200"
              />
            </div>
            <p className="text-sm font-semibold tracking-widest uppercase text-[#FCE08B]/80">
              {content?.tagline || 'Bogura at your doorsteps'}
            </p>
          </div>

          <div className="text-xs font-mono uppercase tracking-widest text-[#FCE08B]/70 md:text-right space-y-1">
            <p>Traditional product. Contemporary presentation.</p>
            <p>Authentic Bogura Curd & Confectionery</p>
          </div>
        </div>

        {/* Middle Tier: Grid of Editorial Information */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-xs">
          {/* Navigation */}
          <div className="space-y-4">
            <span className="font-mono font-bold tracking-widest text-[#FCE08B]/50 uppercase block">
              Navigation
            </span>
            <ul className="space-y-2.5 uppercase font-medium tracking-wider">
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  About Doi Koi
                </Link>
              </li>
              <li>
                <Link href="/#heritage" className="hover:text-white transition-colors">
                  Bogura Heritage
                </Link>
              </li>
              <li>
                <Link href="/#products" className="hover:text-white transition-colors">
                  Curd Collection
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Customer Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Delivery & Hubs */}
          <div className="space-y-4">
            <span className="font-mono font-bold tracking-widest text-[#FCE08B]/50 uppercase block">
              Dispatch Hubs
            </span>
            <div className="space-y-2 text-[#FCE08B]/80 leading-relaxed font-normal">
              <p>
                <strong className="text-[#FCE08B]">Bogura Hub:</strong> Sherpur Road, Bogura Sadar
              </p>
              <p>
                <strong className="text-[#FCE08B]">Dhaka Central:</strong> Banani Road 11 & Dhanmondi 7/A
              </p>
              <p className="pt-1 text-[#FCE08B]/60 text-[11px]">
                Nationwide express chilled dispatch across Bangladesh.
              </p>
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-4">
            <span className="font-mono font-bold tracking-widest text-[#FCE08B]/50 uppercase block">
              Contact & Hours
            </span>
            <div className="space-y-2 text-[#FCE08B]/80 font-normal">
              <p>{content?.phone || '+880 1700-000000'}</p>
              <p>{content?.email || 'hello@doikoi.com'}</p>
              <p className="text-[#FCE08B]/60 pt-1">
                Dispatch Service: 8:00 AM – 10:00 PM Daily
              </p>
            </div>
          </div>

          {/* Commerce & Admin Link */}
          <div className="space-y-4">
            <span className="font-mono font-bold tracking-widest text-[#FCE08B]/50 uppercase block">
              Platform
            </span>
            <ul className="space-y-2.5 text-[#FCE08B]/80 font-normal">
              <li>
                <Link href="/admin" className="hover:text-white transition-colors font-mono uppercase text-[11px] underline">
                  Admin Portal →
                </Link>
              </li>
              <li>
                <span className="text-[#FCE08B]/60">Payment: COD • bKash • Nagad</span>
              </li>
              <li>
                <span className="text-[#FCE08B]/60">Freshness Guaranteed in Earthen Pots</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Disclaimers */}
        <div className="pt-8 border-t border-[#FCE08B]/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#FCE08B]/60 font-mono gap-4">
          <p>{content?.copyright || '© 2026 DOI KOI. Bogura at your doorsteps.'}</p>
          <div className="flex gap-6 uppercase">
            <span>Bangladesh Food Safety Compliant</span>
            <span>Handmade Terracotta</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
