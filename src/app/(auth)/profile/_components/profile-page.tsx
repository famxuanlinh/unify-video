'use client';

import { useUpdateProfile } from '@/hooks';
import { useAuthStore } from '@/store';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import {
  ArrowLeft,
  ArrowSquareOutIcon,
  BioModal,
  Button,
  CalenderIcon,
  EditIcon,
  MapInOutlineIcon,
  UploadButton,
  UserOutlineIcon
} from '@/components';

export const ProfilePage = () => {
  const { me } = useAuthStore();
  const router = useRouter();

  const { handleUpdateProfile, handleUploadAvatar, avatarFile, isLoading } =
    useUpdateProfile({
      onSuccess: () => {
        router.push('/profile');
      }
    });

  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleOpenModal = () => {
    setIsOpenModal(prev => !prev);
  };

  const handleChangeAvatar = async (file: File) => {
    let newAvatar = '';
    try {
      newAvatar = await handleUploadAvatar(file);
    } catch (error) {
      console.log('error:', error);
    }
    handleUpdateProfile({
      fullName: me?.fullName || '',
      dob: me?.dob || '',
      avatar: newAvatar
    });
  };

  if (!me) return;

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-120 flex-col px-4 max-sm:h-screen sm:h-181">
        <div className="grid h-10 grid-cols-3 items-center pt-1">
          <div className="w-fit" onClick={() => router.push('/')}>
            <ArrowLeft className="fill-dark-grey" />
          </div>
          <div className="text-head-li flex justify-center">Profile</div>
          <div></div>
        </div>
        <div className="mt-6 mb-5 flex flex-col items-center">
          <div>
            <UploadButton
              isDefaultVariant={false}
              avatarFile={avatarFile}
              // className="absolute right-0 bottom-0 z-10 h-8 w-8 rounded-full bg-white"
              accept="image/*"
              isLoading={isLoading}
              onFileUpload={handleChangeAvatar}
            ></UploadButton>
          </div>
          <div className="mt-4 mb-2 flex items-center justify-center">
            <p className="text-head-l text-dark-grey">{me?.fullName}</p>
            {/* <VerifiedBadgeIcon className="ml-2" /> */}
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
              <div>{format(me?.dob || '', 'dd/MM/yyyy')}</div>
            </div>
            <div className="text-body-m flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserOutlineIcon /> <span>Gender</span>
              </div>
              <div>{me.gender || '-'}</div>
            </div>
            <div className="text-body-m flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapInOutlineIcon /> <span>Location</span>
              </div>
              <div>{me.hometown?.name || '-'}</div>
            </div>
          </div>
          <div className="text-head-s">Bio</div>
          <div className="bg-white-200 gap-4 rounded-2xl p-4">
            <div className="text-body-m">{me?.bio || 'No bio available'}</div>
          </div>
        </div>
      </div>

      <BioModal data={me} open={isOpenModal} onOpenChange={handleOpenModal} />
    </div>
  );
};
