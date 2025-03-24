import UnifyApi from '@/apis';
import { AUTH_TOKEN_KEY } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const tokensRaw = req.cookies.get(AUTH_TOKEN_KEY)?.value;

  if (!tokensRaw) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  let tokens;
  try {
    tokens = JSON.parse(tokensRaw);
  } catch (e) {
    return NextResponse.json(
      { error: 'Invalid token format' + e },
      { status: 400 }
    );
  }

  try {
    const res = await UnifyApi.auth.refreshSession({
      refreshToken: tokens.refresh
    });

    if (res.access) {
      const response = NextResponse.json(res);

      const isProd = process.env.NODE_ENV === 'production';
      response.headers.append(
        'Set-Cookie',
        `${AUTH_TOKEN_KEY}=${JSON.stringify(res)}; Path=/;  ${
          isProd ? 'Secure;' : ''
        } `
      );

      return response;
    }
  } catch (error) {
    console.error('Refresh failed:', error);

    return NextResponse.json({ error: 'Refresh failed' }, { status: 401 });
  }
}
