'use client';

import { Connection } from '@/types/lobby';
import { getImageUrl } from '@/utils';
import { EllipsisVertical, Flag, UserRound } from 'lucide-react';
import React from 'react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components';

interface LobbyCardProps {
  connection: Connection;
}

export const LobbyCard = ({ connection }: LobbyCardProps) => {
  return (
    <div
      key={connection.targetUserProfile.userId}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          <AvatarImage
            className="object-cover"
            src={getImageUrl(connection.targetUserProfile.avatar)}
          />
          <AvatarFallback>
            {connection.targetUserProfile.fullName?.slice(0, 2) || 'UN'}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <div className="text-dark-grey font-semibold">
            {connection.targetUserProfile.fullName}
          </div>
          <div className="text-light-grey text-xs font-light">
            {connection.lastCall ? (
              <>
                Last call:{' '}
                {new Date(connection.lastCall.endTime).toLocaleDateString()}
                {connection.lastCall.missed && ' (Missed)'}
              </>
            ) : (
              'No calls yet'
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant={'default'} size={'sm'} type="button">
          <div className="w-12">Call</div>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              className="h-8 w-8 p-1"
              variant={'ghost'}
              size={'sm'}
              type="button"
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[156px] p-1">
            <DropdownMenuItem
              className="text-dark-grey text-xs font-light"
              onClick={() => setIsOpenModal(true)}
            >
              <div className="flex items-center gap-3">
                <span>
                  <UserRound />
                </span>
                View Profile
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-dark-grey text-xs font-light"
              onClick={() => {}}
            >
              <div className="flex items-center gap-3">
                <span>
                  <Flag />
                </span>
                Report User
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
