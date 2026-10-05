import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { getDeliveryZones } from '@/lib/db';

export const revalidate = 0;

export default async function CheckoutPage() {
  const zones = await getDeliveryZones();

  return (
    <div className="min-h-screen bg-[#FCE08B] text-[#763C1E] flex flex-col justify-between">
      <Navbar isTransparent={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="border-b border-[#763C1E]/20 pb-6 mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#763C1E]/60 block mb-2">
            Secure Direct Checkout
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
            Delivery & Payment
          </h1>
        </div>

        <CheckoutForm initialZones={zones} />
      </main>

      <Footer />
    </div>
  );
}
