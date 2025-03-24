'use client';

import UnifyApi from '@/apis';
import { useAuthStore } from '@/store';
import { UpdateUserPayload } from '@/types';
import { useState } from 'react';

import { toast } from './use-toast';

export const useUpdateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const { setMe } = useAuthStore();

  const handleUpdateUser = async (payload: UpdateUserPayload) => {
    try {
      setIsLoading(true);
      const res = await UnifyApi.user.update(payload);
      setData(res);
      setMe(res);
      toast({
        description: 'Update user successful'
      });
    } catch (error) {
      console.log('🚀 ~ handleUpdateUser ~ error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, handleUpdateUser };
};
