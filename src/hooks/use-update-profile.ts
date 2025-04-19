'use client';

import UnifyApi from '@/apis';
import { useAuthStore } from '@/store';
import { Location, UpdateUserPayload } from '@/types';
import { handleImageCompression, IPFSUtils } from '@/utils';
import { useCallback, useEffect, useState } from 'react';

import { toast } from './use-toast';

export const useUpdateProfile = ({
  onSuccess
}: { onSuccess?: () => void } = {}) => {
  const { setMe, me } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [hometown, setHometown] = useState(me?.hometown?.name || '');
  const [data, setData] = useState({});

  const [avatarFile, setAvatarFile] = useState<string>(me?.avatar || '');
  const [isUploading, setIsUploading] = useState(false);

  const [location, setLocation] = useState<Location>({});

  const handleUpdateProfile = async (payload: UpdateUserPayload) => {
    try {
      setIsLoading(true);
      const res = await UnifyApi.user.update({
        ...payload,
        location: {
          lat: location.lat,
          long: location.long,
          name: location.name
        },
        hometown: {
          name: hometown
        },
        avatar: payload.avatar || avatarFile
      });
      setData(res);
      setMe(res);
      toast({
        description: 'Update profile successful'
      });
      onSuccess?.();
    } catch (error) {
      console.log('🚀 ~ handleUpdateUser ~ error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadAvatar = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      const compressedFile = await handleImageCompression(file);

      return new Promise<string>((resolve, reject) => {
        IPFSUtils.uploadFileToIPFS({
          file: compressedFile,
          onSuccess: async url => {
            setAvatarFile(url);
            resolve(url);
          },
          onError: reject
        });
      });
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDeleteAvatar = () => {
    setAvatarFile('');
  };

  const handleGetLocation = (value: Location) => {
    setLocation(value);
  };

  const handleGetHometownAddress = (value: string) => {
    setHometown(value);
  };

  useEffect(() => {
    if (me) {
      setAvatarFile(me?.avatar || '');
      setHometown(me?.hometown?.name || '');
      setLocation({
        lat: me?.location?.lat,
        long: me?.location?.long,
        name: me?.location?.name
      });
    }
  }, [me]);

  return {
    data,
    isLoading,
    avatarFile,
    handleGetHometownAddress,
    hometown,
    handleGetLocation,
    location,
    handleUpdateProfile,
    isUploading,
    handleDeleteAvatar,
    handleUploadAvatar
  };
};
