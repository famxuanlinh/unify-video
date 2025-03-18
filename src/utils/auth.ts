import { toast } from '@/hooks';
import { MiniKit } from '@worldcoin/minikit-js';

export async function signInWithMiniAppWallet() {
  if (!MiniKit.isInstalled()) {
    console.log('MiniKit is not installed');
    toast({
      description: 'MiniKit is not installed'
    });

    return;
  }

  const res = await fetch(`/api/world-id/nonce`);

  const { nonce } = await res.json();

  const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
    nonce: nonce,
    requestId: '0', // Optional
    expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    statement: 'Authorize your wallet to connect with our app'
  });

  if (finalPayload.status === 'error') {
    throw new Error((finalPayload as any).description);
  } else {
    return {
      payload: finalPayload,
      nonce
    };
  }
}

export function parseToUsername(accountId: string) {
  return accountId?.replace('client|', '');
}
