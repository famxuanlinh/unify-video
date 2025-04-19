import { useAuthStore } from '@/store/auth-store';
import { User } from '@/types';
import { getDistanceInKm, getImageUrl } from '@/utils';
import Image from 'next/image';
import React, { useMemo } from 'react';

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
  const { me } = useAuthStore();
  const distance = useMemo(() => {
    if (
      !me?.location?.lat ||
      me.location?.long ||
      !data?.location.lat ||
      !data?.location.long
    )
      return false;

    return getDistanceInKm({
      lat1: me.location.lat as number,
      long1: me.location.long as number,
      lat2: data.location.lat as number,
      long2: data?.location.long as number
    });
  }, [me, data]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle></DialogTitle>
      <DialogContent className="max-w-120 overflow-auto rounded-3xl p-0">
        <div className="relative h-[70vh] w-full rounded-3xl">
          <Image
            alt={data?.fullName || ''}
            src={getImageUrl(data?.avatar) || '/images/main-bg.png'}
            fill
            className="rounded-3xl"
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute bottom-0 left-0 z-50 flex w-full items-center justify-between rounded-b-3xl bg-gradient-to-b from-black/0 to-black p-4">
            <div className="w-full">
              <div className="flex items-center">
                <p className="text-head-li text-white">{data?.fullName}</p>
                {/* <VerifiedBadgeIcon className="ml-2" /> */}
              </div>

              <p className="text-body-m text-light-grey mt-1">
                {data?.location?.name ? `${data?.location?.name} •` : ''}
                {distance}
              </p>
            </div>
          </div>
        </div>
        <div className="mb-4 p-4 pt-0">
          <div className="text-body-m text-light-grey mb-2">Bio</div>
          <div className="bg-white-200 gap-4 rounded-2xl p-4">
            <div className="text-body-m">{data?.bio || 'No bio available'}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BioModal;
