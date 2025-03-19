'use client';

import { useOAuthDirect } from '@/hooks';
import { User } from '@/types';
import { parseToUsername } from '@/utils';
import React from 'react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  LoginButton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components';

const Header = ({ me }: { me: User | null }) => {
  const {
    oauthDirectMethods: { handleLogOut }
  } = useOAuthDirect();

  return (
    <div className="absolute top-4 right-4 z-999">
      {me ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={me?.avatar || ''} />
                <AvatarFallback>
                  {me?.fullName?.slice(0, 2) || 'U'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-40">
              <DropdownMenuLabel>
                {me?.fullName || parseToUsername(me.userId)}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogOut}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
};

export default Header;
