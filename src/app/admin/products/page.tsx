import React from 'react';
import { getProducts } from '@/lib/db';
import { ProductManagementClient } from '@/components/admin/ProductManagementClient';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await getProducts();
  return <ProductManagementClient initialProducts={products} />;
}
