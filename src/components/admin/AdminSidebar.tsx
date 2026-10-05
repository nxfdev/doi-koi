'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Truck,
  ArrowLeft,
  LogOut,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products & Stock', href: '/admin/products', icon: Package },
    { label: 'Orders & Dispatch', href: '/admin/orders', icon: ShoppingCart },
    { label: 'CMS & Marketing', href: '/admin/content', icon: FileText },
    { label: 'Delivery Zones', href: '/admin/delivery', icon: Truck },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch {
      window.location.href = '/admin/login';
    }
  };

  return (
    <aside className="w-64 bg-[#502813] text-[#FCE08B] border-r border-[#763C1E]/40 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand / Logo */}
        <div className="p-6 border-b border-[#763C1E]/40">
          <Link href="/admin" className="block">
            <div className="relative h-8 w-36 mb-1">
              <Image
                src="/assets/brand/logo.png"
                alt="DOI KOI"
                fill
                className="object-contain object-left brightness-200"
              />
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#FCE08B]/70 block">
              Control Center & Commerce
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-[#763C1E] text-white'
                    : 'text-[#FCE08B]/80 hover:bg-[#763C1E]/40 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[#763C1E]/40 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#FCE08B]/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>View Public Store ↗</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-300 hover:text-red-200 hover:bg-red-950/40 transition-colors uppercase font-mono tracking-wider text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
