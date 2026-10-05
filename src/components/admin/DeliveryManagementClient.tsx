'use client';

import React, { useState } from 'react';
import { DeliveryZone } from '@/lib/types';
import { formatBDT } from '@/lib/utils';
import { Truck, Check, Edit2, ShieldAlert } from 'lucide-react';

interface DeliveryManagementClientProps {
  initialZones: DeliveryZone[];
}

export function DeliveryManagementClient({
  initialZones,
}: DeliveryManagementClientProps) {
  const [zones, setZones] = useState<DeliveryZone[]>(initialZones);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fee, setFee] = useState<number>(80);
  const [days, setDays] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState('');

  const startEdit = (z: DeliveryZone) => {
    setEditingId(z.id);
    setFee(z.fee);
    setDays(z.estimatedDays);
  };

  const handleSave = async (id: string) => {
    try {
      const res = await fetch('/api/delivery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, fee: Number(fee), estimatedDays: days }),
      });

      const data = await res.json();
      if (res.ok && data.zone) {
        setZones((prev) => prev.map((z) => (z.id === id ? data.zone : z)));
        setEditingId(null);
        setStatusMessage('Delivery zone updated!');
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        alert(data.error || 'Failed to update zone');
      }
    } catch {
      alert('Error updating zone');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="border-b border-[#763C1E]/15 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#763C1E]/60 block mb-1">
            Logistics & Freight Configuration
          </span>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-[#502813]">
            Delivery Zones & Pricing
          </h1>
        </div>

        {statusMessage && (
          <div className="p-2.5 bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      <div className="bg-white border border-[#763C1E]/15 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#763C1E]/10 bg-[#FFF9E6]/40">
          <p className="text-xs text-[#763C1E]/80 leading-relaxed font-sans">
            Adjust shipping fees for Dhaka metropolitan and nationwide courier delivery. All customer checkouts automatically apply these real-time rates.
          </p>
        </div>

        <div className="divide-y divide-[#763C1E]/10">
          {zones.map((zone) => (
            <div key={zone.id} className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1 max-w-md">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold uppercase text-base text-[#502813]">
                    {zone.name}
                  </h3>
                  {zone.isActive && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 uppercase">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#763C1E]/75 leading-relaxed">
                  {zone.description}
                </p>
                <span className="text-[11px] font-mono text-[#763C1E]/60 block mt-1">
                  Speed: {zone.estimatedDays}
                </span>
              </div>

              {editingId === zone.id ? (
                <div className="flex items-center gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#763C1E]/70 mb-1">
                      Fee (BDT)
                    </label>
                    <input
                      type="number"
                      value={fee}
                      onChange={(e) => setFee(Number(e.target.value))}
                      className="w-24 border border-[#763C1E] p-2 text-sm font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#763C1E]/70 mb-1">
                      Transit Time
                    </label>
                    <input
                      type="text"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="w-40 border border-[#763C1E] p-2 text-xs"
                    />
                  </div>
                  <div className="pt-5 flex gap-2">
                    <button
                      onClick={() => handleSave(zone.id)}
                      className="px-4 py-2 bg-[#763C1E] text-[#FCE08B] text-xs font-bold uppercase"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-2 border border-[#763C1E]/30 text-xs uppercase"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-[#763C1E]/60 block">
                      Current Charge
                    </span>
                    <span className="text-2xl font-mono font-extrabold text-[#502813]">
                      {formatBDT(zone.fee)}
                    </span>
                  </div>

                  <button
                    onClick={() => startEdit(zone)}
                    className="p-2 border border-[#763C1E]/30 text-[#763C1E] hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors"
                    title="Edit Rate"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
