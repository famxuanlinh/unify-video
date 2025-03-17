'use client';

import React, { useEffect } from 'react';

interface GhostLayoutProps {
  me?: string;
}

export const GhostLayout = ({ me }: GhostLayoutProps) => {
  useEffect(() => {
    if (me) {
      console.log('🚀 ~ useEffect ~ me:', me);
    }
  }, []);

  return <></>;
};
