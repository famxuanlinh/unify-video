import React from 'react';

import { DiagnosticOverlay } from './diagnostic-overlay';
import { LocalSide } from './local-side';
import { RemoteSide } from './remote-side';

const HomePage = () => {
  return (
    <>
      <RemoteSide />
      <LocalSide />
      <DiagnosticOverlay />
    </>
  );
};

export default HomePage;
