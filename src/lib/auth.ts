import crypto from 'crypto';
import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'dk_admin_session';

function getSecret(): string {
  const secret = process.env.ADMIN_AUTH_SECRET;
  if (!secret) {
    throw new Error(
      'ADMIN_AUTH_SECRET is not set. Generate one with: openssl rand -hex 32'
    );
  }
  return secret;
}

// Hash function
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate simple secure signed token
export function createSessionToken(email: string, role: string = 'ADMIN'): string {
  const payload = {
    email,
    role,
    issuedAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto
    .createHmac('sha256', getSecret())
    .update(payloadStr)
    .digest('hex');
  return `${payloadStr}.${signature}`;
}

export function verifySessionToken(token: string): { email: string; role: string } | null {
  try {
    const [payloadStr, signature] = token.split('.');
    if (!payloadStr || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', getSecret())
      .update(payloadStr)
      .digest('hex');

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(payloadStr, 'base64').toString('utf-8'));
    if (Date.now() > payload.expiresAt) return null;

    return { email: payload.email, role: payload.role };
  } catch (err) {
    return null;
  }
}

export async function getAdminSession(): Promise<{ email: string; role: string } | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export { ADMIN_COOKIE_NAME };
