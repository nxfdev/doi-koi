import React from 'react';
import Link from 'next/link';
import { getAnalyticsSummary, getOrders } from '@/lib/db';
import { formatBDT, formatDate } from '@/lib/utils';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  AlertTriangle,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [analytics, recentOrders] = await Promise.all([
    getAnalyticsSummary(),
    getOrders(undefined, undefined),
  ]);

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="border-b border-[#763C1E]/15 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#763C1E]/60 block mb-1">
            Executive Summary
          </span>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-[#502813]">
            Operations & Analytics
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/orders"
            className="bg-[#763C1E] text-[#FCE08B] px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#502813] transition-colors"
          >
            Manage Orders
          </Link>
          <Link
            href="/admin/products"
            className="border border-[#763C1E] text-[#763C1E] px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors"
          >
            Update Catalog
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white border border-[#763C1E]/15 p-6 space-y-2">
          <div className="flex items-center justify-between text-[#763C1E]/60">
            <span className="text-xs font-mono uppercase tracking-wider">
              Total Revenue
            </span>
            <TrendingUp className="w-4 h-4 text-[#763C1E]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#502813] block">
            {formatBDT(analytics.totalRevenue)}
          </span>
          <span className="text-[11px] text-[#763C1E]/70 font-mono block">
            Avg Order: {formatBDT(analytics.averageOrderValue)}
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-[#763C1E]/15 p-6 space-y-2">
          <div className="flex items-center justify-between text-[#763C1E]/60">
            <span className="text-xs font-mono uppercase tracking-wider">
              Total Orders
            </span>
            <ShoppingCart className="w-4 h-4 text-[#763C1E]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#502813] block">
            {analytics.totalOrders}
          </span>
          <span className="text-[11px] text-[#763C1E]/70 font-mono block">
            Today: {analytics.ordersToday} • This Week: {analytics.ordersThisWeek}
          </span>
        </div>

        {/* Pending Dispatches */}
        <div className="bg-white border border-[#763C1E]/15 p-6 space-y-2">
          <div className="flex items-center justify-between text-[#763C1E]/60">
            <span className="text-xs font-mono uppercase tracking-wider">
              Pending Orders
            </span>
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-800 block">
            {analytics.pendingOrders}
          </span>
          <span className="text-[11px] text-[#763C1E]/70 font-mono block">
            Requires courier confirmation
          </span>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-[#763C1E]/15 p-6 space-y-2">
          <div className="flex items-center justify-between text-[#763C1E]/60">
            <span className="text-xs font-mono uppercase tracking-wider">
              Low Stock Curd
            </span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-red-700 block">
            {analytics.lowStockProducts.length}
          </span>
          <span className="text-[11px] text-[#763C1E]/70 font-mono block">
            {analytics.lowStockProducts.length > 0
              ? 'Replenish Bogura batch'
              : 'Inventory healthy'}
          </span>
        </div>
      </div>

      {/* Two Column Layout: Product Sales & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#763C1E]/15 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#763C1E]/15 pb-4">
            <h2 className="text-lg font-bold uppercase tracking-tight text-[#502813]">
              Recent Customer Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-mono uppercase text-[#763C1E] hover:underline flex items-center gap-1"
            >
              <span>View All ({recentOrders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#763C1E]/20 text-[#763C1E]/70 font-mono uppercase">
                <tr>
                  <th className="py-2.5 pr-4">Order #</th>
                  <th className="py-2.5 px-4">Customer</th>
                  <th className="py-2.5 px-4">Amount</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#763C1E]/10 font-mono">
                {recentOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-[#FFF9E6]/60">
                    <td className="py-3 pr-4 font-bold text-[#502813]">
                      <Link
                        href={`/admin/orders?q=${order.orderNumber}`}
                        className="hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-[#763C1E]">
                      {order.customer.fullName}
                      <span className="block text-[10px] text-[#763C1E]/60 font-mono">
                        {order.customer.district}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#502813]">
                      {formatBDT(order.total)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block bg-[#763C1E] text-[#FCE08B] px-2 py-0.5 text-[10px] font-bold uppercase">
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Sales Performance Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#763C1E]/15 p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#763C1E]/15 pb-4">
            <h2 className="text-lg font-bold uppercase tracking-tight text-[#502813]">
              Curd Demand Breakdown
            </h2>
            <p className="text-xs text-[#763C1E]/70 font-mono mt-0.5">
              Sales performance across the 4 signature items
            </p>
          </div>

          <div className="space-y-4">
            {analytics.productSales.map((item, idx) => (
              <div
                key={idx}
                className="p-4 border border-[#763C1E]/10 bg-[#FFF9E6]/50 space-y-2"
              >
                <div className="flex justify-between items-baseline font-bold text-sm text-[#502813]">
                  <span>{item.name}</span>
                  <span className="font-mono">{formatBDT(item.revenue)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#763C1E]/70 font-mono">
                  <span>Units Dispatched: {item.units}</span>
                  <span>Contribution: {analytics.totalRevenue > 0 ? Math.round((item.revenue / analytics.totalRevenue) * 100) : 0}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
