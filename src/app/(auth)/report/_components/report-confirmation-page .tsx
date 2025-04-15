'use client';

import { usePeer } from '@/hooks';
import { XIcon } from 'lucide-react';
import React from 'react';

import { Button } from '@/components';
import { ReportConfirmIcon } from '@/components/icons/report-confirm-icon';

export const ReportConfirmationPage = () => {
  const { handleReturnToHome } = usePeer();

  return (
    <div className="relative h-screen px-4">
      <div className="grid h-10 grid-cols-3 items-center pt-1">
        <div className="w-fit cursor-pointer"></div>
        <div className="text-head-li flex justify-center">Report</div>
        <div className="flex justify-end text-right">
          <Button variant="ghost" size="icon" onClick={handleReturnToHome}>
            <XIcon className="fill-dark-grey" />
          </Button>
        </div>
      </div>

      <div className="mt-[49px] flex flex-col justify-center gap-4 px-10 text-center">
        <div className="flex cursor-pointer justify-center">
          <ReportConfirmIcon className="cursor-pointer" />
        </div>
        <div className="text-dark-grey text-lg font-semibold">
          Your safety matters!
        </div>
        <div className="text-light-grey text-xs font-light">
          Thank you for helping keep Unify a safe and respectful place for
          everyone. We’ll review your report and take appropriate action.
        </div>
      </div>
    </div>
  );
};
