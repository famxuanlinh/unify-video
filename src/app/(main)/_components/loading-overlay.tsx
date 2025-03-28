import React from 'react';

export const LoadingOverlay = ({ message = '' }) => {
  return (
    <div
      className={`flex h-full flex-col items-center justify-center text-center text-white ${message ? 'bg-[#644af1]' : ''}`}
    >
      <div className="h-16 w-16 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
      <div className="mt-8 text-sm">{message}</div>
    </div>
  );
};
