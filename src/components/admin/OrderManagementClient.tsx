'use client';

import React, { useState } from 'react';
import { Order, OrderStatus, PaymentStatus } from '@/lib/types';
import { formatBDT, formatDate } from '@/lib/utils';
import { Search, Eye, Filter, RefreshCw, X, Check, Truck, MapPin } from 'lucide-react';

interface OrderManagementClientProps {
  initialOrders: Order[];
}

const ALL_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'OUT FOR DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

export function OrderManagementClient({ initialOrders }: OrderManagementClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      selectedStatus === 'ALL' || o.orderStatus === selectedStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q) ||
      o.customer.phone.includes(q) ||
      o.customer.district.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus,
    newPaymentStatus?: PaymentStatus
  ) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: newStatus,
          paymentStatus: newPaymentStatus,
        }),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order);
        }
      } else {
        alert(data.error || 'Failed to update order status');
      }
    } catch {
      alert('Error updating status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="border-b border-[#763C1E]/15 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#763C1E]/60 block mb-1">
            Fulfillment & Logistics
          </span>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-[#502813]">
            Customer Order Registry
          </h1>
        </div>

        <div className="text-xs font-mono text-[#763C1E]/70 sm:text-right">
          <span>{filteredOrders.length} matching of {orders.length} total dispatches</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#763C1E]/15 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#763C1E]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, phone..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#763C1E]/20 bg-[#FFF9E6]/30 focus:outline-none focus:border-[#763C1E]"
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['ALL', ...ALL_STATUSES].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider font-bold transition-colors ${
                selectedStatus === st
                  ? 'bg-[#763C1E] text-[#FCE08B]'
                  : 'bg-[#FFF9E6] text-[#763C1E]/70 hover:bg-[#763C1E]/15'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#763C1E]/15 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#763C1E]/20 bg-[#FFF9E6]/60 text-[#763C1E]/70 font-mono uppercase">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#763C1E]/10 font-mono">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#763C1E]/60">
                    No orders match your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FFF9E6]/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#502813]">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="hover:underline text-left block"
                      >
                        {ord.orderNumber}
                      </button>
                      <span className="text-[10px] text-[#763C1E]/50 block">
                        {formatDate(ord.createdAt)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-sans font-medium text-[#763C1E]">
                      {ord.customer.fullName}
                      <span className="block text-[10px] text-[#763C1E]/60 font-mono">
                        {ord.customer.phone}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-sans text-xs text-[#763C1E]/80">
                      {ord.customer.district}, {ord.customer.area}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-sm text-[#502813]">
                      {formatBDT(ord.total)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="block uppercase text-[10px] font-bold">
                        {ord.paymentMethod.replace(/_/g, ' ')}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 uppercase font-bold inline-block ${
                          ord.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(ord.id, e.target.value as OrderStatus)
                        }
                        className="border border-[#763C1E]/30 bg-white px-2 py-1 text-xs font-bold uppercase focus:outline-none"
                      >
                        {ALL_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 border border-[#763C1E]/30 text-[#763C1E] hover:bg-[#763C1E] hover:text-[#FCE08B]"
                        title="View Full Order Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white min-h-screen p-8 sm:p-10 border-l border-[#763C1E]/20 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#763C1E]/15 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#763C1E]/60 block">
                  Order Manifest
                </span>
                <h2 className="text-2xl font-mono font-bold text-[#502813]">
                  {selectedOrder.orderNumber}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 border border-[#763C1E] text-[#763C1E] hover:bg-[#763C1E] hover:text-[#FCE08B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="p-4 bg-[#FFF9E6] border border-[#763C1E]/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#763C1E]/60 block">
                  Update Fulfillment
                </span>
                <span className="font-bold font-mono text-sm text-[#502813]">
                  {selectedOrder.orderStatus}
                </span>
              </div>
              <select
                value={selectedOrder.orderStatus}
                onChange={(e) =>
                  handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)
                }
                className="border border-[#763C1E] bg-white px-3 py-1.5 text-xs font-bold uppercase"
              >
                {ALL_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Details */}
            <div className="space-y-3 border-b border-[#763C1E]/15 pb-6 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-[#502813]">
                Customer & Delivery Address
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-[#763C1E]/60 uppercase block">Name</span>
                  <span className="font-semibold text-sm">{selectedOrder.customer.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#763C1E]/60 uppercase block">Phone</span>
                  <span className="font-mono font-semibold text-sm">
                    {selectedOrder.customer.phone}
                  </span>
                </div>
              </div>

              {selectedOrder.customer.email && (
                <div>
                  <span className="text-[10px] text-[#763C1E]/60 uppercase block">Email</span>
                  <span>{selectedOrder.customer.email}</span>
                </div>
              )}

              <div>
                <span className="text-[10px] text-[#763C1E]/60 uppercase block">Full Address</span>
                <p className="font-medium mt-0.5 leading-relaxed">
                  {selectedOrder.customer.fullAddress}, {selectedOrder.customer.area},{' '}
                  {selectedOrder.customer.district}, {selectedOrder.customer.division} Division
                </p>
              </div>

              {selectedOrder.customer.deliveryInstructions && (
                <div className="p-3 bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-bold uppercase text-amber-900 block">
                    Special Delivery Instructions
                  </span>
                  <p className="text-amber-800 mt-0.5">
                    {selectedOrder.customer.deliveryInstructions}
                  </p>
                </div>
              )}
            </div>

            {/* Order Items Breakdown */}
            <div className="space-y-3 border-b border-[#763C1E]/15 pb-6 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-[#502813]">
                Ordered Earthen Shora
              </h3>
              <div className="divide-y divide-[#763C1E]/10 font-mono">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-sm block">{it.productName}</span>
                      <span className="text-[10px] text-[#763C1E]/60">
                        {it.quantity} × {formatBDT(it.unitPrice)}
                      </span>
                    </div>
                    <span className="font-bold text-sm">{formatBDT(it.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#763C1E]/15 space-y-1.5 font-mono">
                <div className="flex justify-between text-[#763C1E]/80">
                  <span>Subtotal</span>
                  <span>{formatBDT(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#763C1E]/80">
                  <span>Delivery Fee</span>
                  <span>{formatBDT(selectedOrder.deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#502813] pt-2 border-t border-[#763C1E]/20">
                  <span>Grand Total</span>
                  <span>{formatBDT(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Actions */}
            <div className="space-y-3 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-[#502813]">
                Payment Status
              </h3>
              <div className="flex items-center justify-between p-3 border border-[#763C1E]/15">
                <div>
                  <span className="font-bold uppercase block">
                    {selectedOrder.paymentMethod.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-[#763C1E]/70">
                    Status: {selectedOrder.paymentStatus}
                  </span>
                </div>

                {selectedOrder.paymentStatus === 'UNPAID' ? (
                  <button
                    onClick={() =>
                      handleStatusChange(selectedOrder.id, selectedOrder.orderStatus, 'PAID')
                    }
                    className="px-3 py-1 bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-800"
                  >
                    Mark as Paid
                  </button>
                ) : (
                  <span className="text-emerald-800 font-bold uppercase text-xs flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Paid</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
