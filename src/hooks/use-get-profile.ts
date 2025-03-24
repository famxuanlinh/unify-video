'use client';

import UnifyApi from '@/apis';
import { useAuthStore } from '@/store';
import { User } from '@/types';
import { useState } from 'react';

export const useGetProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<User | null>(null);
  const { setMe } = useAuthStore();

  const handleGetProfile = async () => {
    try {
      setIsLoading(true);
      const res = await UnifyApi.user.get();
      setData(res);
      setMe(res);

      return res;
    } catch (error) {
      console.log('Error:', error);

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, handleGetProfile };
};
