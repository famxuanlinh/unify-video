'use client';

import UnifyApi from '@/apis';
import { useAuthStore, useMainStore } from '@/store';
import { User } from '@/types';
import { useState } from 'react';

export const useGetProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<User | null>(null);
  const { setMe } = useAuthStore();
  const { setIncomingUserInfo } = useMainStore();

  const getProfile = async (userId?: string) => {
    try {
      setIsLoading(true);
      const res = await UnifyApi.user.get({ userId });
      setData(res);

      if (userId) {
        setIncomingUserInfo(res);
      } else {
        setMe(res);
      }

      return res;
    } catch (error) {
      console.log('Error:', error);

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, getProfile };
};
