'use client';

import { useUpdateProfile } from '@/hooks';
import { useAuthStore } from '@/store';
import { Gender, UpdateUserPayload } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import {
  FormField,
  FormItem,
  Input,
  FormMessage,
  FormLabel,
  FormDescription,
  FormControl,
  DualRangeSlider,
  Slider,
  Switch,
  Form,
  Button,
  ArrowLeft
} from '@/components';
import { GoogleMap } from '@/components/google-map';

const formSchema = z.object({
  ageRange: z.array(z.number()).optional(),
  seekingGender: z.array(z.string()).default([]).optional(),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
      name: z.string()
    })
    .nullable(),
  miles: z.number(),
  limit: z.boolean()
});

export const PreferencesPage = () => {
  const router = useRouter();
  const { me } = useAuthStore();

  const { isLoading, handleUpdateProfile, coordinate, handleGetCoordinate } =
    useUpdateProfile({
      onSuccess: () => {
        router.push('/');
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
    // defaultValues: {
    //   ageRange: me?.seekingSettings?.ageRange
    //     ? [me.seekingSettings.ageRange.min, me.seekingSettings.ageRange.max]
    //     : [18, 99],
    //   seekingGender: me?.seekingSettings.genders,
    //   location: null,
    //   miles: me?.seekingSettings.location?.miles || 25,
    //   limit: me?.seekingSettings.location?.limit || false
    // }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload: UpdateUserPayload = {
      fullName: me?.fullName || '',
      dob: me?.dob || '',
      seekingSettings: {
        genders: values.seekingGender?.filter(item => Boolean(item)),
        ageRange: {
          min: values.ageRange?.[0] || 18,
          max: values.ageRange?.[1] || 99
        },
        location: {
          limit: values.limit,
          miles: values.miles || 25
        }
      }
    };

    handleUpdateProfile(payload);
  }

  const isShowLimit = useWatch({ name: 'limit', control: form.control });

  useEffect(() => {
    form.reset({
      ageRange: me?.seekingSettings?.ageRange
        ? [me.seekingSettings.ageRange.min, me.seekingSettings.ageRange.max]
        : [18, 99],
      seekingGender: me?.seekingSettings.genders,
      location: null,
      miles: me?.seekingSettings.location?.miles
        ? me?.seekingSettings.location?.miles
        : 25,
      limit: me?.seekingSettings.location?.limit || false
    });
  }, [me]);

  return (
    <Form {...form}>
      <form
        className="flex h-screen flex-col px-4"
        onSubmit={form.handleSubmit(data =>
          onSubmit(data as z.infer<typeof formSchema>)
        )}
      >
        <div className="mb-6 grid h-10 grid-cols-3 items-center pt-1">
          <div className="w-fit" onClick={() => router.push('/')}>
            <ArrowLeft className="fill-dark-grey" />
          </div>
          <div className="text-head-li flex justify-center">Preferences</div>
          <div></div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="text-dark-grey text-head-s">I’m into...</div>
            <FormField
              control={form.control}
              name="seekingGender"
              render={({ field }) => {
                const selectedValues = Array.isArray(field.value)
                  ? field.value
                  : [];

                return (
                  <FormItem className="flex flex-col space-y-2">
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                      {Object.values(Gender).map(gender => {
                        const isChecked = selectedValues.includes(gender);

                        return (
                          <label
                            key={gender}
                            htmlFor={`gender-${gender}`}
                            className={`flex h-12 cursor-pointer items-center justify-center rounded-2xl transition ${
                              isChecked
                                ? 'text-head-sx bg-linear-to-r from-[#FFA941] to-[#E94057] text-white'
                                : 'bg-white-200 text-body-m text-gray-700'
                            } `}
                          >
                            <Input
                              id={`gender-${gender}`}
                              className="peer hidden"
                              checked={isChecked}
                              type="checkbox"
                              onChange={() => {
                                const newValue = isChecked
                                  ? selectedValues.filter(g => g !== gender)
                                  : [...selectedValues, gender];

                                field.onChange(newValue);
                              }}
                            />
                            {gender}
                          </label>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="ageRange"
              render={() => (
                <FormItem>
                  <FormLabel className="text-dark-grey text-head-s mb-5">
                    Age Range
                  </FormLabel>
                  <FormDescription className="text-body-m text-dark-grey -mt-2 mb-6">
                    Between 18 and 99
                  </FormDescription>
                  <FormControl>
                    <DualRangeSlider
                      label={value => value}
                      control={form.control}
                      name="ageRange"
                      min={18}
                      max={99}
                      step={1}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-dark-grey text-head-s">Location</div>
            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg">
                  <FormLabel className="text-body-m text-dark-grey">
                    Limit by location
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={Boolean(field.value)}
                      onCheckedChange={value => {
                        field.onChange(value);
                      }}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {isShowLimit && (
              <>
                <GoogleMap
                  lat={coordinate.lat}
                  long={coordinate.long}
                  onGetCoordinate={handleGetCoordinate}
                />

                <FormField
                  control={form.control}
                  name="miles"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel className="text-body-m mb-4">
                        Location
                      </FormLabel>
                      <FormDescription className="-mt-2 mb-4">
                        Up to 80 kilometers away: ({value ? value : '25'}
                        {value == 1 ? ' kilometer' : ' kilometers'})
                      </FormDescription>
                      <FormControl>
                        <Slider
                          min={1}
                          max={100}
                          step={1}
                          value={[value ?? 25]}
                          onValueChange={vals => {
                            onChange(vals[0]);
                          }}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        </div>
        <Button loading={isLoading} type="submit" className="my-4 w-full">
          Apply
        </Button>
      </form>
    </Form>
  );
};
