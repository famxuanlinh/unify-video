'use client';

import UnifyApi from '@/apis';
import { CreateReportPayload, CreateReportResponse } from '@/types/report';
import { useState } from 'react';

export const useCreateReport = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CreateReportResponse | null>(null);

  const createReport = async (payload: CreateReportPayload) => {
    try {
      setIsLoading(true);
      const res = await UnifyApi.report.create(payload);
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

  return { data, isLoading, createReport };
};
