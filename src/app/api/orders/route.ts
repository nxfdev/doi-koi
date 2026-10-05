import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrders } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

// POST /api/orders: Create order with server-side pricing & stock validation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, deliveryZoneId, paymentMethod, notes } = body;

    // Strict input validation
    if (!customer?.fullName?.trim()) {
      return NextResponse.json(
        { error: 'Full name is required.' },
        { status: 400 }
      );
    }

    if (!customer?.phone?.trim() || customer.phone.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid Bangladeshi phone number.' },
        { status: 400 }
      );
    }

    if (!customer?.fullAddress?.trim()) {
      return NextResponse.json(
        { error: 'Detailed delivery address is required.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Your cart contains no items.' },
        { status: 400 }
      );
    }

    const result = await createOrder({
      customer: {
        fullName: customer.fullName.trim(),
        phone: customer.phone.trim(),
        email: customer.email?.trim() || undefined,
        division: customer.division || 'Dhaka',
        district: customer.district || 'Dhaka',
        area: customer.area?.trim() || 'Central',
        fullAddress: customer.fullAddress.trim(),
        deliveryInstructions: customer.deliveryInstructions?.trim() || undefined,
      },
      items,
      deliveryZoneId: deliveryZoneId || 'zone_dhaka_central',
      paymentMethod: paymentMethod || 'CASH_ON_DELIVERY',
      notes: notes?.trim() || undefined,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, order: result.order }, { status: 201 });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return NextResponse.json(
      { error: 'Unable to process your order at this moment. Please try again.' },
      { status: 500 }
    );
  }
}

// GET /api/orders: Admin only
export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status') || undefined;
  const query = searchParams.get('q') || undefined;

  const orders = await getOrders(statusFilter, query);
  return NextResponse.json({ orders });
}
