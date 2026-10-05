'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Order } from '@/lib/types';
import { formatBDT } from '@/lib/utils';
import { CheckCircle2, Truck, Clock, ArrowRight } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) {
      setLoading(false);
      return;
    }

    fetch(`/api/orders/${orderNumber}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  return (
    <div className="space-y-10">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-[#763C1E] text-[#FCE08B] flex items-center justify-center mx-auto shadow-md">
        <CheckCircle2 className="w-10 h-10 stroke-[1.8]" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[#763C1E]/60 block">
          Order Confirmed & Logged
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-[#763C1E]">
          Thank You For Your Order
        </h1>
        <p className="text-base text-[#763C1E]/85 max-w-lg mx-auto font-normal leading-relaxed">
          Your authentic Bogura curd has been scheduled for preparation and temperature-controlled dispatch.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="border border-[#763C1E]/20 bg-[#F4D272]/30 p-8 text-left space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#763C1E]/15 pb-4 gap-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#763C1E]/60 block">
              Order Tracking ID
            </span>
            <span className="text-xl font-mono font-extrabold text-[#763C1E]">
              {orderNumber || 'DK-2026-CONFIRMED'}
            </span>
          </div>

          <div className="sm:text-right">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#763C1E]/60 block">
              Current Status
            </span>
            <span className="inline-block bg-[#763C1E] text-[#FCE08B] text-xs font-bold px-2.5 py-1 uppercase tracking-wider">
              {order?.orderStatus || 'PENDING DISPATCH'}
            </span>
          </div>
        </div>

        {order && (
          <div className="space-y-4 text-xs text-[#763C1E]/90">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="font-mono text-[10px] text-[#763C1E]/60 uppercase block">
                  Recipient
                </span>
                <span className="font-bold text-sm block">{order.customer.fullName}</span>
                <span>{order.customer.phone}</span>
              </div>

              <div>
                <span className="font-mono text-[10px] text-[#763C1E]/60 uppercase block">
                  Delivery Address
                </span>
                <span className="block leading-relaxed">
                  {order.customer.fullAddress}, {order.customer.area}, {order.customer.district}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#763C1E]/15">
              <span className="font-mono text-[10px] text-[#763C1E]/60 uppercase block mb-2">
                Items Ordered
              </span>
              <div className="space-y-1.5 font-mono">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.quantity}× {it.productName}</span>
                    <span className="font-bold">{formatBDT(it.subtotal)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-[#763C1E]/10 text-sm font-bold">
                  <span>Total (with delivery)</span>
                  <span>{formatBDT(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[#763C1E]/15 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#763C1E]/75">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#763C1E] shrink-0" />
            <span>Chilled express dispatch from Bogura</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#763C1E] shrink-0" />
            <span>Courier will call prior to delivery</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#763C1E] text-[#FCE08B] px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#502813] transition-colors"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/account"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#763C1E] text-[#763C1E] px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors"
        >
          <span>View Orders & Track</span>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FCE08B] text-[#763C1E] flex flex-col justify-between">
      <Navbar isTransparent={false} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 sm:px-8 py-16 sm:py-24 text-center">
        <Suspense
          fallback={
            <div className="py-20 font-mono text-xs text-[#763C1E]">
              Loading confirmation...
            </div>
          }
        >
          <OrderSuccessContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
