import React from 'react';

export const ErrorOverlay = ({ message }: { message: string }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center text-white">
      <div className="mt-4 text-xs md:text-sm">{message}</div>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 rounded-full bg-white px-5 py-2 text-xs text-black sm:text-sm"
      >
        Try Again
      </button>
    </div>
  );
};
