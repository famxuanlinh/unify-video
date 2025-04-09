import { User } from '@/types';
import { getImageUrl } from '@/utils';
import Image from 'next/image';
import React from 'react';

import { Dialog, DialogContent, DialogTitle } from '../core';

type BioModalProps = {
  data: User;
  onOpenChange: () => void;
  open: boolean;
};

export const BioModal: React.FC<BioModalProps> = ({
  data,
  onOpenChange,
  open
}) => {
  console.log('🚀 ~ data:', data);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle></DialogTitle>
      <DialogContent className="overflow-auto rounded-3xl p-0">
        <div className="relative h-[70vh] w-full rounded-3xl">
          <Image
            alt={data?.fullName || ''}
            src={getImageUrl(data?.avatar) || '/images/main-bg.png'}
            fill
            className="rounded-3xl"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="mb-4 p-4 pt-0">
          <div className="text-body-m text-light-grey mb-2">Bio</div>
          <div className="bg-white-200 gap-4 rounded-2xl p-4">
            <div className="text-body-m">
              I&apos;m an explorer at heart, always searching for the next great
              adventure. Looking for someone who&apos;s not afraid to get their
              hands dirty or their feet wet. Let&apos;s create unforgettable
              memories together.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BioModal;
