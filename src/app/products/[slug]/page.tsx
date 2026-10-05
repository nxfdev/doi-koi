import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductDetailPageClient } from '@/components/products/ProductDetailPageClient';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 0;

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Product Not Found | DOI KOI' };

  return {
    title: `${product.name} — Bogura at your doorsteps | DOI KOI`,
    description: product.description,
    openGraph: {
      title: `${product.name} | DOI KOI`,
      description: product.tagline,
      images: [product.images[0] || '/assets/home/hero/hero-doi.png'],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#FCE08B] text-[#763C1E] flex flex-col justify-between">
      <Navbar isTransparent={false} />
      <ProductDetailPageClient
        product={product}
        relatedProducts={relatedProducts}
      />
      <Footer />
    </main>
  );
}
