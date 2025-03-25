'use client';

import UnifyApi from '@/apis';
import { useAuthStore } from '@/store';
import { UpdateUserPayload } from '@/types';
import { handleImageCompression, IPFSUtils } from '@/utils';
import { useCallback, useState } from 'react';

import { toast } from './use-toast';

export const useUpdateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const { setMe, me } = useAuthStore();

  const [avatarFile, setAvatarFile] = useState<string>(me?.avatar || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpdateProfile = async (payload: UpdateUserPayload) => {
    try {
      setIsLoading(true);
      const res = await UnifyApi.user.update({
        ...payload,
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

  return {
    data,
    isLoading,
    avatarFile,
    handleUpdateProfile,
    isUploading,
    handleDeleteAvatar,
    handleUploadAvatar
  };
};
