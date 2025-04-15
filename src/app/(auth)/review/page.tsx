'use client';

import React, { Suspense } from 'react';

import { ReviewPage } from './_components';

const page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ReviewPage />
  </Suspense>
);

export default page;
