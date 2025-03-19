import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function GET(_req: NextRequest) {
  // Generate a secure nonce
  const nonce = uuidv4().replace(/-/g, '');

  // Create response
  const response = NextResponse.json({ nonce });

  // Set the cookie with HTTPOnly and Secure flags
  response.headers.set(
    'Set-Cookie',
    `siwe=${nonce}; HttpOnly; Secure; SameSite=Strict; Path=/`
  );

  return response;
}
