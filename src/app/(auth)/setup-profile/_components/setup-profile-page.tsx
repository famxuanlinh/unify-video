'use client';

import { useAuthStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { UpdateProfileForm } from './setup-profile-form';

const stepSchemas = [
  z.object({
    fullName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .optional(),
    dob: z.coerce.date()
  }),
  z.object({
    gender: z.string(),
    ageRange: z.array(z.number()).optional(),
    seekingGender: z.array(z.string()).default([]).optional()
  }),
  z.object({
    location: z
      .object({
        lat: z.number(),
        lng: z.number(),
        label: z.string()
      })
      .nullable(),
    miles: z.coerce.number().min(18).max(99),
    limit: z.boolean()
  })
];

export const SetupProfilePage = () => {
  const [step, setStep] = useState(0);
  const me = useAuthStore.getState().me;
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(stepSchemas[step]),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      dob: '',
      ageRange: [18, 99],
      gender: '',
      location: null,
      miles: [25],
      limit: false,
      seekingGender: [] // Initial preferences (array)
    }
  });

  const handleSetStep = (value: number) => {
    setStep(value);
  };

  useEffect(() => {
    if (me) {
      if (me.fullName && me.dob) {
        router.push('/');
      }
    }
  }, []);

  return (
    <FormProvider {...form}>
      <UpdateProfileForm step={step} onSetStep={handleSetStep} />
    </FormProvider>
  );
};
