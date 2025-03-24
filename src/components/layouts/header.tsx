'use client';

import { AUTH_TOKEN_KEY } from '@/constants';
import { useAuthStore } from '@/store';
import { parseToUsername } from '@/utils';
import { deleteCookie } from 'cookies-next';
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
  SigninButton,
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

  const { me, setMe } = useAuthStore();

  const handleLogout = () => {
    deleteCookie(AUTH_TOKEN_KEY);
    setMe(null);
    window.location.href = '/';
  };

  return (
    <div className="light absolute top-4 right-4 z-9">
      {me ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="size-10">
                <AvatarImage src={me?.avatar || ''} />
                <AvatarFallback>
                  {me?.fullName?.slice(0, 2) ||
                    parseToUsername(me.userId).slice(0, 2)}
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
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <SigninButton />
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
