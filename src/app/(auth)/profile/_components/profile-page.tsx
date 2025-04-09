'use client';

import { useAuthStore } from '@/store';
import { getImageUrl, parseToUsername } from '@/utils';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import {
  ArrowLeft,
  ArrowSquareOutIcon,
  Avatar,
  AvatarFallback,
  AvatarImage,
  BioModal,
  Button,
  CalenderIcon,
  EditIcon,
  MapInOutlineIcon,
  UserOutlineIcon,
  VerifiedBadgeIcon
} from '@/components';

export const ProfilePage = () => {
  const { me } = useAuthStore();
  const router = useRouter();

  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleOpenModal = () => {
    setIsOpenModal(prev => !prev);
  };

  if (!me) return;

  return (
    <>
      <div className="px-4">
        <div className="grid h-10 grid-cols-3 items-center pt-1">
          <div className="w-fit" onClick={() => router.push('/')}>
            <ArrowLeft className="fill-dark-grey" />
          </div>
          <div className="text-head-li flex justify-center">Profile</div>
          <div></div>
        </div>
        <div className="mt-6 mb-5 flex flex-col items-center">
          <Avatar className="size-25">
            <AvatarImage
              className="object-cover"
              src={getImageUrl(me?.avatar)}
            />
            <AvatarFallback>
              {me?.fullName?.slice(0, 2) ||
                parseToUsername(me.userId).slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="mt-4 mb-2 flex items-center justify-center">
            <p className="text-head-l text-dark-grey">{me?.fullName}</p>
            <VerifiedBadgeIcon className="ml-2" />
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsOpenModal(true)}
              className="min-w-29 gap-2"
              size="sm"
            >
              <ArrowSquareOutIcon />
              Preview
            </Button>
            <Button
              onClick={() => router.push('/profile/edit')}
              className="min-w-29 gap-2"
              variant="outline"
              size="sm"
            >
              <EditIcon />
              Edit profile
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-head-s">About me</div>
          <div className="bg-white-200 flex flex-col gap-4 rounded-2xl p-4">
            <div className="text-body-m flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserOutlineIcon /> <span>Full Name</span>
              </div>
              <div>{me.fullName}</div>
            </div>
            <div className="text-body-m flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalenderIcon /> <span>DOB</span>
              </div>
              <div>{me.fullName}</div>
            </div>
            <div className="text-body-m flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserOutlineIcon /> <span>Gender</span>
              </div>
              <div>{me.fullName}</div>
            </div>
            <div className="text-body-m flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapInOutlineIcon /> <span>Location</span>
              </div>
              <div>{me.fullName}</div>
            </div>
          </div>
          <div className="text-head-s">Bio</div>
          <div className="bg-white-200 gap-4 rounded-2xl p-4">
            <div className="text-body-m">{me?.bio || 'No bio available'}</div>
          </div>
        </div>
      </div>

      <BioModal data={me} open={isOpenModal} onOpenChange={handleOpenModal} />
    </>
  );
};
