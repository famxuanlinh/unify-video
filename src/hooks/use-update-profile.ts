'use client';

import UnifyApi from '@/apis';
import { useAuthStore } from '@/store';
import { UpdateUserPayload } from '@/types';
import { handleImageCompression, IPFSUtils } from '@/utils';
import { useCallback, useEffect, useState } from 'react';

import { toast } from './use-toast';

export const useUpdateProfile = ({
  onSuccess
}: { onSuccess?: () => void } = {}) => {
  const { setMe, me } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isGettingCoordinate, setIsGettingCoordinate] = useState(false);
  const [hometown, setHometown] = useState(me?.hometown?.name || '');
  const [data, setData] = useState({});

  const [avatarFile, setAvatarFile] = useState<string>(me?.avatar || '');
  const [isUploading, setIsUploading] = useState(false);
  const [coordinate, setCoordinate] = useState<{
    lat?: number;
    long?: number;
  }>({
    lat: me?.location?.lat,
    long: me?.location?.long
  });

  const handleUpdateProfile = async (payload: UpdateUserPayload) => {
    try {
      setIsLoading(true);
      const res = await UnifyApi.user.update({
        ...payload,
        location: {
          lat: coordinate.lat,
          long: coordinate.long
        },
        hometown: {
          name: hometown
        },
        avatar: avatarFile
      });
      setData(res);
      setMe(res);
      toast({
        description: 'Update user successful'
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
      await IPFSUtils.uploadFileToIPFS({
        file: compressedFile,
        onSuccess: async url => {
          setAvatarFile(url);
        }
      });
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDeleteAvatar = () => {
    setAvatarFile('');
  };

  const handleGetCoordinate = (values: { lat: number; long: number }) => {
    setCoordinate(values);
  };
  const handleGetHometownAddress = (value: string) => {
    setHometown(value);
  };

  const handleGetLocation = () => {
    setIsGettingCoordinate(true);
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      setCoordinate({
        lat: latitude,
        long: longitude
      });
      setIsGettingCoordinate(false);
    });
  };

  useEffect(() => {
    if (me) {
      if (!me?.location?.lat && !me?.location?.long) {
        navigator.geolocation.getCurrentPosition(pos => {
          const { latitude, longitude } = pos.coords;
          setCoordinate({
            lat: latitude,
            long: longitude
          });
          setIsGettingCoordinate(false);
        });
      } else {
        setCoordinate({
          lat: me?.location?.lat,
          long: me?.location?.long
        });
      }
    }
  }, [me]);

  return {
    data,
    coordinate,
    isLoading,
    avatarFile,
    handleGetHometownAddress,
    hometown,
    isGettingCoordinate,
    handleGetLocation,
    handleUpdateProfile,
    isUploading,
    handleDeleteAvatar,
    handleUploadAvatar,
    handleGetCoordinate
  };
};
