import { NextRequest, NextResponse } from 'next/server';
import { getDeliveryZones, updateDeliveryZone } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const zones = await getDeliveryZones();
  return NextResponse.json({ zones });
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;
    const updated = await updateDeliveryZone(id, updates);
    return NextResponse.json({ success: true, zone: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
