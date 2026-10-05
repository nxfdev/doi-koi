import { NextRequest, NextResponse } from 'next/server';
import { getSiteContent, updateSiteContent } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json({ content });
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateSiteContent(body);
    return NextResponse.json({ success: true, content: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
