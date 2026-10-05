import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, hashPassword, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    // Default admin: admin@doikoi.com / doikoi2026
    const expectedHash = '658433906ba4af42c9b6dd40b3039da7b8c80fd57320f0476491d5a287f1bf0c';
    const inputHash = hashPassword(password);

    if (cleanEmail === 'admin@doikoi.com' && inputHash === expectedHash) {
      const token = createSessionToken(cleanEmail, 'ADMIN');
      const response = NextResponse.json({
        success: true,
        user: { email: cleanEmail, role: 'ADMIN', name: 'Doi Koi Master Admin' },
      });

      response.cookies.set({
        name: ADMIN_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid administrator credentials.' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
