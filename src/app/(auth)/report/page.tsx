'use client';

import React, { Suspense } from 'react';

import { ProfilePage } from './_components';

const page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ProfilePage />
  </Suspense>
);

export default page;
