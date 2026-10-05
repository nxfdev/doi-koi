import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Name and slug are required.' }, { status: 400 });
    }

    const newProduct = await createProduct({
      slug: body.slug,
      name: body.name,
      bengaliName: body.bengaliName || '',
      price: Number(body.price) || 0,
      tagline: body.tagline || '',
      description: body.description || '',
      weight: body.weight || '1kg Terracotta Pot',
      potType: body.potType || 'Bogura Terracotta Shora',
      ingredients: body.ingredients || [],
      nutritionalInfo: body.nutritionalInfo || {
        calories: '180 kcal',
        protein: '5g',
        fat: '5g',
        carbs: '25g',
      },
      storageInstructions: body.storageInstructions || 'Keep refrigerated at 2°C–5°C',
      shelfLife: body.shelfLife || '5–7 days',
      stock: Number(body.stock) || 0,
      isAvailable: Boolean(body.isAvailable),
      isFeatured: Boolean(body.isFeatured),
      images: body.images || ['/assets/home/hero/hero-doi.png'],
      videos: body.videos || [],
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
