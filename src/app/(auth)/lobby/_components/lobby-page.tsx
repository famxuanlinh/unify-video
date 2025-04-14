'use client';

import { useGetLobbies } from '@/hooks/use-get-lobbies';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import {
  ArrowLeft,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SettingOutlineIcon
} from '@/components';

import { LobbyCard } from './lobby-card';

export const LobbyPage = () => {
  const router = useRouter();
  const { data, getLobbies, isLoading, hasMore, offset, reset } =
    useGetLobbies();
  const [connectionType, setConnectionType] = useState<'MATCH' | 'FRIEND'>(
    'MATCH'
  );
  const limit = 10;

  // Set up intersection observer for infinite scrolling
  const { ref, inView } = useInView({
    threshold: 0.5
  });

  // Load more data when scrolling to the bottom
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      getLobbies({ type: connectionType, offset, limit });
    }
  }, [inView, hasMore, isLoading, connectionType, offset]);

  const handleConnectionTypeChange = (value: string) => {
    setConnectionType(value as 'MATCH' | 'FRIEND');
    reset();
  };
  const connections = data?.connections || [];

  return (
    <div className="px-4">
      <div className="pt-1">
        <div className="flex items-center justify-between">
          <div
            className="flex w-fit items-center gap-5"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="fill-dark-grey" />
            <div className="text-head-li flex justify-center">Lobby</div>
          </div>

          <div className="flex items-center gap-4">
            <Select
              defaultValue="MATCH"
              onValueChange={handleConnectionTypeChange}
            >
              <SelectTrigger className="border-dark-grey h-10 w-[120px] rounded-lg border-2">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MATCH">Matches</SelectItem>
                <SelectItem value="FRIEND">Friends</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="h-8 w-8 p-1"
              variant={'ghost'}
              size={'sm'}
              type="button"
            >
              <SettingOutlineIcon />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {connections.length === 0 && !isLoading ? (
          <div className="py-8 text-center text-gray-500">
            No {connectionType === 'MATCH' ? 'matches' : 'friends'} found
          </div>
        ) : (
          connections.map(connection => (
            <LobbyCard
              key={connection.targetUserProfile.userId}
              connection={connection}
            />
          ))
        )}

        <div ref={ref} className="py-4 text-center">
          {isLoading && <div>Loading...</div>}
        </div>
      </div>
    </div>
  );
};
