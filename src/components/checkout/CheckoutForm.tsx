'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '../cart/CartProvider';
import { DeliveryZone, PaymentMethod } from '@/lib/types';
import { BD_DIVISIONS, ALL_DISTRICTS, DHAKA_AREAS } from '@/lib/constants';
import { formatBDT } from '@/lib/utils';
import { ShieldCheck, Truck, AlertCircle, Loader2 } from 'lucide-react';

interface CheckoutFormProps {
  initialZones: DeliveryZone[];
}

export function CheckoutForm({ initialZones }: CheckoutFormProps) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [zones, setZones] = useState<DeliveryZone[]>(initialZones);
  const [selectedZoneId, setSelectedZoneId] = useState<string>(
    initialZones[0]?.id || 'zone_dhaka_central'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY');

  // Customer state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('Banani');
  const [customArea, setCustomArea] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update district when division changes
  useEffect(() => {
    const districtsForDivision = ALL_DISTRICTS[division] || ['Dhaka'];
    setDistrict(districtsForDivision[0]);
    if (division === 'Dhaka') {
      setSelectedZoneId('zone_dhaka_central');
    } else {
      setSelectedZoneId('zone_outside_dhaka');
    }
  }, [division]);

  const activeZone = zones.find((z) => z.id === selectedZoneId) || zones[0];
  const deliveryFee = activeZone ? activeZone.fee : 80;
  const finalTotal = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Please select products first.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 11-digit Bangladeshi phone number (e.g. 017XXXXXXXX).');
      return;
    }

    if (!fullAddress.trim()) {
      setErrorMessage('Please provide your complete road, house, and apartment delivery address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const resolvedArea = area === 'Other' ? customArea : area;

      const payload = {
        customer: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          division,
          district,
          area: resolvedArea || 'Central',
          fullAddress: fullAddress.trim(),
          deliveryInstructions: deliveryInstructions.trim() || undefined,
        },
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        deliveryZoneId: selectedZoneId,
        paymentMethod,
        notes: notes.trim() || undefined,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      // Clear cart upon verified server order creation
      clearCart();

      // Redirect to confirmation
      router.push(`/checkout/success?orderNumber=${data.order.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableDistricts = ALL_DISTRICTS[division] || ['Dhaka'];

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Left Column: Delivery & Customer Info (7 cols) */}
      <div className="lg:col-span-7 space-y-10">
        {errorMessage && (
          <div className="p-4 bg-red-900/10 border border-red-700/30 text-red-900 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-700" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Section 1: Customer Details */}
        <div className="space-y-6">
          <div className="border-b border-[#763C1E]/15 pb-3">
            <h2 className="text-xl font-bold uppercase tracking-tight text-[#763C1E]">
              1. Customer Information
            </h2>
            <p className="text-xs text-[#763C1E]/70 mt-0.5">
              Guest checkout supported. No mandatory account required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#763C1E] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Asif Mahmud"
                className="w-full bg-[#F4D272]/30 border border-[#763C1E]/30 px-3.5 py-2.5 text-sm text-[#763C1E] focus:outline-none focus:border-[#763C1E]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#763C1E] mb-1">
                Phone Number (Bangladesh) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full bg-[#F4D272]/30 border border-[#763C1E]/30 px-3.5 py-2.5 text-sm text-[#763C1E] focus:outline-none focus:border-[#763C1E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#763C1E] mb-1">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com (For order invoice & updates)"
              className="w-full bg-[#F4D272]/30 border border-[#763C1E]/30 px-3.5 py-2.5 text-sm text-[#763C1E] focus:outline-none focus:border-[#763C1E]"
            />
          </div>
        </div>

        {/* Section 2: Delivery Location & Address */}
        <div className="space-y-6">
          <div className="border-b border-[#763C1E]/15 pb-3">
            <h2 className="text-xl font-bold uppercase tracking-tight text-[#763C1E]">
              2. Delivery Address
            </h2>
            <p className="text-xs text-[#763C1E]/70 mt-0.5">
              Dhaka metropolitan receives prioritized same-day dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#763C1E] mb-1">
                Division *
              </label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full bg-[#F4D272]/30 border border-[#763C1E]/30 px-3.5 py-2.5 text-sm text-[#763C1E] focus:outline-none focus:border-[#763C1E]"
              >
                {BD_DIVISIONS.map((div) => (
                  <option key={div} value={div}>
                    {div} Division
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#763C1E] mb-1">
                District *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-[#F4D272]/30 border border-[#763C1E]/30 px-3.5 py-2.5 text-sm text-[#763C1E] focus:outline-none focus:border-[#763C1E]"
              >
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {division === 'Dhaka' && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#763C1E] mb-1">
                Dhaka Area / Sector *
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-[#F4D272]/30 border border-[#763C1E]/30 px-3.5 py-2.5 text-sm text-[#763C1E] focus:outline-none focus:border-[#763C1E]"
              >
                {DHAKA_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
                <option value="Other">Other Dhaka Location</option>
              </select>
            </div>
          )}

          {(division !== 'Dhaka' || area === 'Other') && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#763C1E] mb-1">
                Thana / Sub-District / Area Name *
              </label>
              <input
                type="text"
                required
                value={customArea}
                onChange={(e) => setCustomArea(e.target.value)}
                placeholder="e.g. Bogura Sadar, Sylhet Zindabazar, etc."
                className="w-full bg-[#F4D272]/30 border border-[#763C1E]/30 px-3.5 py-2.5 text-sm text-[#763C1E] focus:outline-none focus:border-[#763C1E]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#763C1E] mb-1">
              Detailed House / Road / Apartment Address *
            </label>
            <textarea
              required
              rows={2}
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              placeholder="House #, Road #, Flat #, Landmark..."
              className="w-full bg-[#F4D272]/30 border border-[#763C1E]/30 px-3.5 py-2.5 text-sm text-[#763C1E] focus:outline-none focus:border-[#763C1E]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#763C1E] mb-1">
              Delivery Instructions (Optional)
            </label>
            <input
              type="text"
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              placeholder="e.g. Call upon arrival, leave with security, ring doorbell..."
              className="w-full bg-[#F4D272]/30 border border-[#763C1E]/30 px-3.5 py-2.5 text-sm text-[#763C1E] focus:outline-none focus:border-[#763C1E]"
            />
          </div>
        </div>

        {/* Section 3: Delivery Speed & Zone */}
        <div className="space-y-4">
          <div className="border-b border-[#763C1E]/15 pb-3">
            <h2 className="text-xl font-bold uppercase tracking-tight text-[#763C1E]">
              3. Delivery Options
            </h2>
          </div>

          <div className="space-y-3">
            {zones.map((zone) => (
              <label
                key={zone.id}
                className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
                  selectedZoneId === zone.id
                    ? 'border-[#763C1E] bg-[#F4D272]/60'
                    : 'border-[#763C1E]/20 bg-[#F4D272]/20 hover:border-[#763C1E]/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="deliveryZone"
                    checked={selectedZoneId === zone.id}
                    onChange={() => setSelectedZoneId(zone.id)}
                    className="mt-1 accent-[#763C1E]"
                  />
                  <div>
                    <span className="font-bold text-sm uppercase block">
                      {zone.name}
                    </span>
                    <span className="text-xs text-[#763C1E]/75 block mt-0.5">
                      {zone.description}
                    </span>
                    <span className="text-[11px] font-mono text-[#763C1E]/60 block mt-1">
                      Estimated: {zone.estimatedDays}
                    </span>
                  </div>
                </div>
                <span className="font-mono font-bold text-sm">
                  {formatBDT(zone.fee)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 4: Payment Method */}
        <div className="space-y-4">
          <div className="border-b border-[#763C1E]/15 pb-3">
            <h2 className="text-xl font-bold uppercase tracking-tight text-[#763C1E]">
              4. Payment Method
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`p-4 border cursor-pointer flex flex-col justify-between transition-all ${
                paymentMethod === 'CASH_ON_DELIVERY'
                  ? 'border-[#763C1E] bg-[#F4D272]/60'
                  : 'border-[#763C1E]/20 bg-[#F4D272]/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'CASH_ON_DELIVERY'}
                  onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className="accent-[#763C1E]"
                />
                <span className="font-bold text-sm uppercase">Cash on Delivery</span>
              </div>
              <p className="text-[11px] text-[#763C1E]/75 leading-tight">
                Inspect earthen shora and pay our courier upon doorstep delivery.
              </p>
            </label>

            <label
              className={`p-4 border cursor-pointer flex flex-col justify-between transition-all ${
                paymentMethod === 'BKASH'
                  ? 'border-[#763C1E] bg-[#F4D272]/60'
                  : 'border-[#763C1E]/20 bg-[#F4D272]/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'BKASH'}
                  onChange={() => setPaymentMethod('BKASH')}
                  className="accent-[#763C1E]"
                />
                <span className="font-bold text-sm uppercase">bKash Payment</span>
              </div>
              <p className="text-[11px] text-[#763C1E]/75 leading-tight">
                Pay securely via bKash Merchant account on dispatch confirmation.
              </p>
            </label>

            <label
              className={`p-4 border cursor-pointer flex flex-col justify-between transition-all ${
                paymentMethod === 'NAGAD'
                  ? 'border-[#763C1E] bg-[#F4D272]/60'
                  : 'border-[#763C1E]/20 bg-[#F4D272]/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'NAGAD'}
                  onChange={() => setPaymentMethod('NAGAD')}
                  className="accent-[#763C1E]"
                />
                <span className="font-bold text-sm uppercase">Nagad Payment</span>
              </div>
              <p className="text-[11px] text-[#763C1E]/75 leading-tight">
                Pay through Bangladesh Post Office Nagad gateway.
              </p>
            </label>

            <label
              className={`p-4 border cursor-pointer flex flex-col justify-between transition-all ${
                paymentMethod === 'CARD'
                  ? 'border-[#763C1E] bg-[#F4D272]/60'
                  : 'border-[#763C1E]/20 bg-[#F4D272]/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'CARD'}
                  onChange={() => setPaymentMethod('CARD')}
                  className="accent-[#763C1E]"
                />
                <span className="font-bold text-sm uppercase">Debit / Credit Card</span>
              </div>
              <p className="text-[11px] text-[#763C1E]/75 leading-tight">
                Visa, Mastercard, NexusPay via SSLCommerz gateway.
              </p>
            </label>
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary & Place Order Button (5 cols) */}
      <div className="lg:col-span-5 border border-[#763C1E]/20 bg-[#F4D272]/30 p-8 space-y-6 sticky top-8">
        <h3 className="text-xl font-bold uppercase tracking-tight border-b border-[#763C1E]/15 pb-4">
          Order Review
        </h3>

        {/* Selected Items */}
        <div className="divide-y divide-[#763C1E]/15 max-h-64 overflow-y-auto pr-1">
          {items.map(({ productId, product, quantity }) => (
            <div key={productId} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#F4D272]/60 border border-[#763C1E]/10 shrink-0 relative flex items-center justify-center">
                  <Image
                    src={product.images[0] || '/assets/home/hero/hero-doi.png'}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase leading-tight">
                    {product.name}
                  </h4>
                  <span className="text-xs text-[#763C1E]/70 font-mono">
                    Qty: {quantity} × {formatBDT(product.price)}
                  </span>
                </div>
              </div>

              <span className="font-mono font-bold text-sm">
                {formatBDT(product.price * quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Calculation */}
        <div className="space-y-3 pt-4 border-t border-[#763C1E]/15 text-sm">
          <div className="flex justify-between text-[#763C1E]/80">
            <span>Subtotal</span>
            <span className="font-mono font-semibold">{formatBDT(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[#763C1E]/80">
            <span>Delivery ({activeZone?.name})</span>
            <span className="font-mono font-semibold">{formatBDT(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-xl font-extrabold pt-4 border-t border-[#763C1E]/20">
            <span>Total Payable</span>
            <span className="font-mono">{formatBDT(finalTotal)}</span>
          </div>
        </div>

        {/* Place Order CTA */}
        <div className="pt-4 space-y-4">
          <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            className={`w-full py-4 text-xs font-bold tracking-[0.25em] uppercase transition-all duration-200 border flex items-center justify-center gap-2 ${
              isSubmitting || items.length === 0
                ? 'bg-[#763C1E]/40 border-[#763C1E]/40 text-[#FCE08B]/60 cursor-not-allowed'
                : 'bg-[#763C1E] text-[#FCE08B] border-[#763C1E] hover:bg-[#502813] active:scale-[0.99]'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Confirming Order...</span>
              </>
            ) : (
              <span>Confirm Order ({formatBDT(finalTotal)})</span>
            )}
          </button>

          <div className="space-y-2 text-[11px] text-[#763C1E]/70 font-mono">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 shrink-0" />
              <span>Direct wood-fired curd dispatched cold from Bogura</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Zero cancellation fee prior to courier dispatch</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
