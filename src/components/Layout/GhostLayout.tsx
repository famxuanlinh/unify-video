'use client';

import React, { useEffect } from 'react';

interface GhostLayoutProps {
  me?: string;
}

const GhostLayout = ({ me }: GhostLayoutProps) => {
  useEffect(() => {
    if (me) {
      console.log('🚀 ~ useEffect ~ me:', me);
    }
  }, []);

  return <></>;
};

export default GhostLayout;
