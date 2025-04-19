import UnifyApi from '@/apis';
import { AUTH_TOKEN_KEY } from '@/constants';
import { useAuthStore } from '@/store';
import { deleteCookie } from 'cookies-next';
import { DeleteIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const DeleteAccountButton = () => {
  const router = useRouter();
  const { setMe } = useAuthStore();

  const handleDeleteAccount = async () => {
    try {
      await UnifyApi.auth.delete();
      router.push('/login');
      deleteCookie(AUTH_TOKEN_KEY);
      setMe(null);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div
      onClick={handleDeleteAccount}
      className="flex cursor-pointer items-center gap-2 text-black"
    >
      <DeleteIcon />
      <p className="text-label-l">Delete acc</p>
    </div>
  );
};

export default DeleteAccountButton;
