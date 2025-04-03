'use client';

import { useAuthStore } from '@/store';
import { getImageUrl } from '@/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

import {
  Avatar,
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
  UserOutlineIcon,
  VerifiedBadgeIcon
} from '@/components';

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
  const { me } = useAuthStore();

  const pathName = usePathname();

  return (
    <>
      <div className="flex items-center justify-between px-4 pt-1">
        <div className="flex items-center gap-4">
          <Avatar className="size-10">
            <AvatarImage
              className="rounded-full object-cover"
              src={getImageUrl(me?.avatar) || '/images/avatar-default.png'}
            />
          </Avatar>
          <div>
            <p className="text-body-m text-light-grey">Hello,</p>
            <p className="text-head-sx text-dark-grey">Eleanor Pena</p>
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
                  src={getImageUrl(me?.avatar) || '/images/avatar-default.png'}
                />
              </Avatar>
              <div className="mt-4 flex items-center justify-center">
                <p className="text-head-l text-dark-grey">Eleanor Pena</p>{' '}
                <VerifiedBadgeIcon className="ml-2" />
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
          <div className="flex justify-end p-6">
            <div className="text-red flex cursor-pointer gap-2">
              <LeaveIcon />
              <p className="text-label-l">Sign Out</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
