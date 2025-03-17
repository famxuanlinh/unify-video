import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  // Generate a secure nonce
  const nonce = uuidv4().replace(/-/g, '');

  // Set the cookie with HTTPOnly and Secure flags
  res.setHeader(
    'Set-Cookie',
    `siwe=${nonce}; HttpOnly; Secure; SameSite=Strict; Path=/`
  );

  return res.status(200).json({ nonce });
}
