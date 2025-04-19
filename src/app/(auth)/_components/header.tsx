'use client';

import { AUTH_TOKEN_KEY } from '@/constants';
import { useAuthStore } from '@/store';
import { getImageUrl } from '@/utils';
import { deleteCookie } from 'cookies-next';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  GlobalIcon,
  GlobalOutlineIcon,
  HomeIcon,
  HomeOutlineIcon,
  LeaveIcon,
  ListIcon,
  SettingIcon,
  SettingOutlineIcon,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  UserIcon,
  UserOutlineIcon
} from '@/components';

import DeleteAccountButton from './delete-account-button';

const menus: {
  name: string;
  icon: React.JSX.Element;
  activeIcon: React.JSX.Element;
  path: string;
}[] = [
  {
    name: 'Home',
    icon: <HomeOutlineIcon />,
    activeIcon: <HomeIcon />,
    path: '/'
  },
  {
    name: 'Lobby',
    icon: <GlobalOutlineIcon />,
    activeIcon: <GlobalIcon />,
    path: '/lobby'
  },
  {
    name: 'Profile',
    icon: <UserOutlineIcon />,
    activeIcon: <UserIcon />,
    path: '/profile'
  },
  {
    name: 'Preferences',
    icon: <SettingOutlineIcon />,
    activeIcon: <SettingIcon />,
    path: '/preferences'
  }
];

export const Header = () => {
  const [isOpenSheet, setIsOpenSheet] = useState(false);

  const { me, setMe } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
    deleteCookie(AUTH_TOKEN_KEY);
    setMe(null);
  };

  const pathName = usePathname();

  return (
    <>
      <div className="flex items-center justify-between px-4 pt-1">
        <div className="flex items-center gap-4">
          <Avatar className="size-10">
            <AvatarImage
              className="rounded-full object-cover"
              src={getImageUrl(me?.avatar)}
            />
            <AvatarFallback>{me?.fullName?.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-body-m text-light-grey">Hello,</p>
            <p className="text-head-sx text-dark-grey">{me?.fullName}</p>
          </div>
        </div>
        <div onClick={() => setIsOpenSheet(true)}>
          <ListIcon />
        </div>
      </div>

      <Sheet open={isOpenSheet} onOpenChange={value => setIsOpenSheet(value)}>
        <SheetContent className="flex flex-col justify-between">
          <SheetHeader className="mt-18 p-2">
            <SheetTitle className="flex flex-col items-center">
              <Avatar className="size-20">
                <AvatarImage
                  className="rounded-full object-cover"
                  src={getImageUrl(me?.avatar)}
                />
                <AvatarFallback className="text-3xl">
                  {me?.fullName?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 flex items-center justify-center">
                <p className="text-head-l text-dark-grey">{me?.fullName}</p>
                {/* <VerifiedBadgeIcon className="ml-2" /> */}
              </div>
            </SheetTitle>
            <SheetDescription>
              {menus.map(item => {
                const activeItem = pathName === item.path;

                return (
                  <Link
                    href={item.path}
                    key={item.path}
                    className={`flex h-12 items-center gap-2 p-3 ${activeItem ? 'bg-white-200 rounded-lg' : 'cursor-pointer'}`}
                  >
                    {activeItem ? item.activeIcon : item.icon}
                    <span
                      className={`text-dark-grey ${activeItem ? 'text-head-sx' : 'text-body-m'}`}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </SheetDescription>
          </SheetHeader>
          <div className="flex justify-end gap-10 p-6">
            <DeleteAccountButton />
            <div
              onClick={handleLogout}
              className="text-red flex cursor-pointer items-center gap-2"
            >
              <LeaveIcon />
              <p className="text-label-l">Sign Out</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
