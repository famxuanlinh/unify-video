'use client';

import { signInWithMiniAppWallet } from '@/utils/auth';
import { Base64 } from '@/utils/base64';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '@/components';

export const LoginPage = () => {
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
    <div className="flex h-screen items-center justify-center bg-[url(/images/main-bg.png)] bg-cover">
      <div
        className={`relative flex h-screen w-full max-w-120 flex-col justify-end sm:h-181`}
      >
        <div className="relative h-full w-full">
          <Image
            src="/images/login-img.png"
            alt="login"
            fill
            className="size-full object-contain"
          />
        </div>
        <div className="p-8 pt-0 text-white">
          <h1 className="pb-2 text-[28px] font-semibold">UNIFY</h1>
          <p className="mb-16 text-xs font-light">
            Meet new people, make friends, or find a date—all through real-time
            video chats. Whether you&apos;re here for fun connections or
            something more, Unify makes it easy to match, chat, and vibe
            instantly.
          </p>

          <div className="flex justify-center">
            <Button
              disabled={isLoading}
              onClick={handleLoginMiniAppWalletAuth}
              variant="secondary"
              className="w-full sm:max-w-86"
            >
              Join now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
