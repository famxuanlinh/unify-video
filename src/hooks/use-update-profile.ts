'use client';

import UnifyApi from '@/apis';
import { useAuthStore } from '@/store';
import { UpdateUserPayload } from '@/types';
import { handleImageCompression, IPFSUtils } from '@/utils';
import { useCallback, useState } from 'react';

import { toast } from './use-toast';

export const useUpdateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingCoordinate, setIsGettingCoordinate] = useState(false);
  const [data, setData] = useState({});
  const { setMe, me } = useAuthStore();

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
        avatar: avatarFile
      });
      setData(res);
      setMe(res);
      toast({
        description: 'Update user successful'
      });
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

  const handleGetLocation = () => {
    setIsGettingCoordinate(true);
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      setCoordinate({
        lat: latitude,
        long: longitude
      });
      setIsGettingCoordinate(false);
      // const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
      // fetch(url)
      //   .then(res => res.json())
      //   .then(data => setAdd(data.address));
    });
  };

  return {
    data,
    coordinate,
    isLoading,
    avatarFile,
    isGettingCoordinate,
    handleGetLocation,
    handleUpdateProfile,
    isUploading,
    handleDeleteAvatar,
    handleUploadAvatar
  };
};
