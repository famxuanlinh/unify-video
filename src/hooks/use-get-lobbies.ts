'use client';

import UnifyApi from '@/apis';
import { GetLobbyParams, LobbyResponse } from '@/types/lobby';
import { useState } from 'react';

export const useGetLobbies = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<LobbyResponse | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const reset = () => {
    setHasMore(true);
    setOffset(0);
    setData(null);
  };

  const getLobbies = async (payload: GetLobbyParams) => {
    try {
      setIsLoading(true);
      const res = await UnifyApi.lobby.getMany(payload);
      setHasMore(
        (data?.connections?.length || 0) + res.connections.length <
          (data?.total || 0)
      );

      // setHasMore(res.connections.length < res.total);
      setOffset(prev => prev + limit);

      setData(res);

      return res;
    } catch (error) {
      console.log('Error:', error);

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, getLobbies, hasMore, offset, reset };
};
