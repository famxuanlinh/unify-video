'use client';

import { useOAuthDirect } from '@/hooks';
import { useAuthStore } from '@/store';
import { parseToUsername } from '@/utils';
import React, { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  LoginButton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ProfileForm
} from '@/components';

const Header = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const {
    oauthDirectMethods: { handleLogOut }
  } = useOAuthDirect();

  const { me } = useAuthStore();

  return (
    <div className="light absolute top-4 right-4 z-9">
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
            <DropdownMenuContent className="mr-4 min-w-40">
              <DropdownMenuLabel>
                {me?.fullName || parseToUsername(me.userId)}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setIsOpenDialog(true)}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogOut}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <LoginButton />
      )}

      <Dialog
        open={isOpenDialog}
        onOpenChange={value => setIsOpenDialog(value)}
        defaultOpen={false}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>
          <div className="scroll-hide max-h-150 overflow-auto p-1">
            <ProfileForm />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
