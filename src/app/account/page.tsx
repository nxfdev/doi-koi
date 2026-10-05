'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Order } from '@/lib/types';
import { formatBDT, formatDate } from '@/lib/utils';
import { Search, Package, Clock, MapPin, CheckCircle, Truck, AlertCircle } from 'lucide-react';

export default function AccountPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${searchQuery.trim()}`);
      const data = await res.json();
      if (!res.ok || !data.order) {
        setError(`No order found matching "${searchQuery}". Please check your order ID.`);
      } else {
        setOrder(data.order);
      }
    } catch {
      setError('Unable to track order. Please verify your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCE08B] text-[#763C1E] flex flex-col justify-between">
      <Navbar isTransparent={false} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 space-y-12">
        {/* Header */}
        <div className="border-b border-[#763C1E]/20 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#763C1E]/60 block mb-2">
              Customer Portal & Logistics
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
              Order Tracking & Account
            </h1>
          </div>
          <div className="text-xs font-mono text-[#763C1E]/70 sm:text-right">
            <span>Direct from Bogura to Doorstep</span>
          </div>
        </div>

        {/* Live Order Tracking Lookup Form */}
        <div className="bg-[#F4D272]/30 border border-[#763C1E]/20 p-8 space-y-6">
          <div className="max-w-xl">
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Track Your Earthen Shora
            </h2>
            <p className="text-xs text-[#763C1E]/80 mt-1 leading-relaxed">
              Enter your Order Number (e.g. DK-2026-8901) received at checkout or via SMS confirmation.
            </p>
          </div>

          <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#763C1E]/50" />
              <input
                type="text"
                required
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. DK-2026-8901)"
                className="w-full bg-[#FCE08B] border border-[#763C1E]/30 pl-10 pr-4 py-3 text-sm text-[#763C1E] uppercase font-mono tracking-wider focus:outline-none focus:border-[#763C1E]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#763C1E] text-[#FCE08B] px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-[#502813] transition-colors border border-[#763C1E] shrink-0"
            >
              {loading ? 'Searching...' : 'Track Status'}
            </button>
          </form>

          {error && (
            <div className="p-4 bg-red-900/10 border border-red-700/30 text-red-900 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-700" />
              <span>{error}</span>
            </div>
          )}

          {/* Render Result */}
          {order && (
            <div className="mt-8 pt-8 border-t border-[#763C1E]/20 space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#763C1E]/60 block">
                    Order Found
                  </span>
                  <h3 className="text-2xl font-mono font-extrabold">{order.orderNumber}</h3>
                  <span className="text-xs text-[#763C1E]/70 font-mono">
                    Placed on {formatDate(order.createdAt)}
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#763C1E]/60 block">
                    Order Status
                  </span>
                  <span className="inline-block bg-[#763C1E] text-[#FCE08B] text-xs font-bold px-3 py-1 font-mono uppercase mt-1">
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#763C1E]/15">
                {[
                  { label: 'CONFIRMED', active: true },
                  {
                    label: 'PREPARING',
                    active: ['PREPARING', 'READY', 'OUT FOR DELIVERY', 'DELIVERED'].includes(
                      order.orderStatus
                    ),
                  },
                  {
                    label: 'OUT FOR DELIVERY',
                    active: ['OUT FOR DELIVERY', 'DELIVERED'].includes(order.orderStatus),
                  },
                  {
                    label: 'DELIVERED',
                    active: order.orderStatus === 'DELIVERED',
                  },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-3 border text-center ${
                      step.active
                        ? 'border-[#763C1E] bg-[#763C1E] text-[#FCE08B]'
                        : 'border-[#763C1E]/20 bg-[#F4D272]/20 text-[#763C1E]/50'
                    }`}
                  >
                    <span className="block text-[10px] font-mono tracking-wider">
                      STEP 0{idx + 1}
                    </span>
                    <span className="block text-xs font-bold uppercase mt-1">
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Items Breakdown */}
              <div className="bg-[#FCE08B] p-6 border border-[#763C1E]/15 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider block">
                  Items Ordered
                </span>
                <div className="space-y-2 font-mono text-xs">
                  {order.items.map((it, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{it.quantity}× {it.productName}</span>
                      <span>{formatBDT(it.subtotal)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-[#763C1E]/20 flex justify-between font-bold text-sm">
                    <span>Grand Total</span>
                    <span>{formatBDT(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Customer Account Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#763C1E]/80">
          <div className="p-6 border border-[#763C1E]/20 bg-[#F4D272]/20 space-y-2">
            <h4 className="font-bold uppercase text-sm text-[#763C1E]">
              Guest Reordering
            </h4>
            <p className="leading-relaxed">
              No complicated passwords needed. Every order is tracked securely through your phone number and order ID.
            </p>
          </div>

          <div className="p-6 border border-[#763C1E]/20 bg-[#F4D272]/20 space-y-2">
            <h4 className="font-bold uppercase text-sm text-[#763C1E]">
              Cold Chain Assurance
            </h4>
            <p className="leading-relaxed">
              Dispatched from Bogura via refrigerated corridors. Clay pots are packaged to withstand transit while preserving curd density.
            </p>
          </div>

          <div className="p-6 border border-[#763C1E]/20 bg-[#F4D272]/20 space-y-2">
            <h4 className="font-bold uppercase text-sm text-[#763C1E]">
              Direct Helpline
            </h4>
            <p className="leading-relaxed">
              Need immediate assistance with a running dispatch? Contact our Dhaka desk directly at +880 1700-000000.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
