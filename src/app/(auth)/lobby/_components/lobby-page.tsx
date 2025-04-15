'use client';

import { usePeer } from '@/hooks';
import { useGetLobbies } from '@/hooks/use-get-lobbies';
import { Video } from 'lucide-react';
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
import { LobbyNoData } from './no-data';

export const LobbyPage = () => {
  const { handleReturnToHome } = usePeer();

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
    <div className="relative px-4">
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
            <LobbyNoData />
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
      <div className="sticky right-4 bottom-6">
        <div className="flex items-center justify-end">
          <div
            className="flex h-10 w-10 cursor-pointer items-center justify-center"
            style={{
              borderRadius: '49px',
              background:
                'linear-gradient(135deg, var(--ORANGE, #FFA941) 0%, var(--RED, #E94057) 100%)',
              boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.25)'
            }}
            onClick={handleReturnToHome}
          >
            <Video className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
