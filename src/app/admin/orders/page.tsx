import React from 'react';
import { getOrders } from '@/lib/db';
import { OrderManagementClient } from '@/components/admin/OrderManagementClient';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <OrderManagementClient initialOrders={orders} />;
}
