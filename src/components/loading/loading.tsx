import { LoaderCircle } from 'lucide-react';
import React from 'react';

type Props = {
  children?: React.ReactNode;
};

export const Loading = ({ children }: Props) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
      <LoaderCircle className="text-light-grey size-15 animate-spin" />
      {children}
    </div>
  );
};
