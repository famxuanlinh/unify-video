'use client';

import { signInWithMiniAppWallet } from '@/utils/auth';
import { Base64 } from '@/utils/base64';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '@/components/core/button';

import { cn } from '@/lib';

interface SigninButtonProps {
  className?: string;
}

export const SigninButton: React.FunctionComponent<SigninButtonProps> = ({
  className
}) => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const handleLoginMiniAppWalletAuth = async () => {
    try {
      setLoading(true);

      const payload = await signInWithMiniAppWallet();
      const token = await Base64.encode(payload);
      const providerId = 'worldWalletAuth';

      router.push(`/auth?token=${token}&providerId=${providerId}`);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading}
      className={cn('w-full', className)}
      onClick={handleLoginMiniAppWalletAuth}
    >
      Sign In
    </Button>
  );
};
