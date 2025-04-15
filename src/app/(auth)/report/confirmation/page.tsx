'use client';

import React, { Suspense } from 'react';

import { ReportConfirmationPage } from '../_components/report-confirmation-page ';

const page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ReportConfirmationPage />
  </Suspense>
);

export default page;
