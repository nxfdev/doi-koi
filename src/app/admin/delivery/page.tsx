import React from 'react';
import { getDeliveryZones } from '@/lib/db';
import { DeliveryManagementClient } from '@/components/admin/DeliveryManagementClient';

export const revalidate = 0;

export default async function AdminDeliveryPage() {
  const zones = await getDeliveryZones();
  return <DeliveryManagementClient initialZones={zones} />;
}
