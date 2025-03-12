import React from 'react';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{ height: '100svh' }}
      className="flex w-screen flex-col bg-gray-500 landscape:flex-row"
    >
      {children}
    </div>
  );
};
