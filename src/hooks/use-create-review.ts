'use client';

import UnifyApi from '@/apis';
import { CreateReviewPayload, CreateReviewResponse } from '@/types/review';
import { useState } from 'react';

export const useCreateReview = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CreateReviewResponse | null>(null);

  const createReview = async (payload: CreateReviewPayload) => {
    try {
      setIsLoading(true);
      const res = await UnifyApi.review.create(payload);
      setData(res);
      onSuccess?.();

      return res;
    } catch (error) {
      console.log('Error:', error);

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, createReview };
};
