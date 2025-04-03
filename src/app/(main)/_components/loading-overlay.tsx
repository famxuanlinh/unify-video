import React from 'react';

export const LoadingOverlay = ({ message = '' }) => {
  return (
    <div
      className={`mx-3 my-2 flex h-full flex-col items-center justify-center rounded-4xl text-center text-white ${message ? 'bg-[url(/images/login-bg.png)] bg-cover bg-right-top' : ''}`}
    >
      <div className="h-16 w-16 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
      <div className="mt-8 text-sm">{message}</div>
      <div className="text-body-m mt-4 text-white">{message}</div>
    </div>
  );
};
