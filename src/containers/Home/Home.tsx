import React from 'react';

import { DiagnosticOverlay } from './components/DiagnosticOverlay';
import { LocalSide } from './components/LocalSide';
import { RemoteSide } from './components/RemoteSide';

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
