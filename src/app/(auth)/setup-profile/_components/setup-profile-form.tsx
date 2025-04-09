'use client';

import { useUpdateProfile } from '@/hooks';
import { Gender, UpdateUserPayload } from '@/types';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import {
  ArrowLeft,
  Button,
  DualRangeSlider,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Slider,
  Switch,
  DatePicker
} from '@/components';
import { GoogleMap } from '@/components/google-map';

interface UpdateProfileRaw {
  fullName: string;
  dob: Date;
  gender?: string;
  ageRange: number[];
  seekingGender?: string[];
  lat?: number;
  lng?: number;
  label?: string;
  miles?: number;
  limit: boolean;
}

export const UpdateProfileForm = ({
  onSetStep,
  step
}: {
  onSetStep: (value: number) => void;
  step: number;
}) => {
  const [isShowLimitRange, setIsShowLimitRange] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const form = useFormContext();

  const { isLoading, handleUpdateProfile, coordinate, handleGetCoordinate } =
    useUpdateProfile({
      onSuccess: () => {
        router.push('/');
      }
    });

  const onNext = async () => {
    console.log('Error', form.formState.errors['dob']);

    // const isValid = await form.trigger();
    // if (!isValid) return;
    setFormData(prev => ({ ...prev, ...form.getValues() }));
    onSetStep(step + 1);
  };

  const onBack = () => {
    onSetStep(Math.max(step - 1, 0));
  };

  const onSubmit = (data: UpdateProfileRaw) => {
    const finalData = { ...formData, ...data };

    const payload: UpdateUserPayload = {
      avatar: '',
      coverImage: '',
      fullName: finalData.fullName,
      dob: finalData.dob.toISOString(),
      gender: finalData.gender,
      seekingSettings: {
        genders: finalData.seekingGender?.filter(item => Boolean(item)),
        ageRange: {
          min: finalData.ageRange[0],
          max: finalData.ageRange[1]
        },
        location: {
          limit: finalData.limit,
          miles: finalData.miles || 25
        }
      }
    };
    handleUpdateProfile(payload);
  };

  const isDobWatch = useWatch({ name: 'dob' });
  const isNameWatch = useWatch({ name: 'fullName' });

  return (
    <Form {...form}>
      <div className="h-screen px-4">
        <div className="pt-1">
          <div className="relative h-1 w-full rounded bg-[#9999990D]">
            <div
              className={`h-1 rounded bg-linear-to-r from-[#FFA941] to-[#E94057] transition-all ${step === 0 ? 'w-1/3' : step === 1 ? 'w-1/2' : 'w-full'}`}
            ></div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex h-10 items-center justify-between">
            {step !== 0 ? (
              <div className="cursor-pointer" onClick={onBack}>
                <ArrowLeft className="fill-dark-grey" />
              </div>
            ) : (
              <p></p>
            )}
            {step === 1 ? (
              <p
                onClick={onNext}
                className="text-body-m text-dark-grey cursor-pointer p-2"
              >
                Skip
              </p>
            ) : null}
          </div>
        </div>
        <form
          onSubmit={form.handleSubmit(data =>
            onSubmit(data as UpdateProfileRaw)
          )}
          className="relative flex h-[calc(100%-48px)] flex-col bg-white bg-cover"
        >
          <div className="flex flex-1 flex-col gap-6 overflow-y-auto">
            {step === 0 && (
              <>
                <div className="text-dark-grey text-2xl font-bold">
                  Let&apos;s start by sharing a little about ourselves!
                </div>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-head-s text-dark-grey mb-4">
                        Your Name<span className="text-red">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Type name" type="text" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is how it will appear on your profile.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-head-s text-dark-grey mb-4">
                          {' '}
                          Your Birthday<span className="text-red">*</span>
                        </FormLabel>

                        <FormControl>
                          <DatePicker
                            date={
                              field.value ? new Date(field.value) : undefined
                            }
                            setDate={date => {
                              if (date) {
                                field.onChange(date);
                              }
                            }}
                            error={
                              form.formState.errors['dob']?.message as string
                            }
                            disabled={date => {
                              const today = new Date();
                              const minDate = new Date();
                              minDate.setFullYear(today.getFullYear() - 18);

                              return (
                                date > today ||
                                date > minDate ||
                                date < new Date('1900-01-01')
                              );
                            }}
                            endYear={new Date().getFullYear() - 18}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <div className="grid grid-cols-4 items-start gap-2">
                      <FormField
                        control={form.control}
                        name="mob"
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <p className="text-body-m text-dark-grey mb-2">
                              Month
                            </p>
                            <FormControl>
                              <Input placeholder="MM" type="text" {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <p className="text-body-m text-dark-grey mb-2">
                              Day
                            </p>
                            <FormControl>
                              <Input placeholder="DD" type="text" {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="yob"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <p className="text-body-m text-dark-grey mb-2">
                              Year
                            </p>
                            <FormControl>
                              <Input
                                placeholder="YYYY"
                                type="text"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div> */}
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <div className="text-dark-grey text-2xl font-bold">
                  Which gender best describe you?
                </div>
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-col space-y-2">
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                          {Object.values(Gender).map(gender => (
                            <label
                              key={gender}
                              htmlFor={gender}
                              className={`flex h-12 cursor-pointer items-center justify-center rounded-2xl transition ${
                                field.value === gender
                                  ? 'text-head-sx bg-linear-to-r from-[#FFA941] to-[#E94057] text-white'
                                  : 'bg-white-200 text-body-m text-gray-700'
                              } `}
                            >
                              <Input
                                id={gender}
                                className="peer hidden"
                                checked={field.value == gender}
                                type="radio"
                                onChange={() => {
                                  field.onChange(gender);
                                }}
                              />
                              {gender}
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <div className="text-dark-grey text-2xl font-bold">
                  I’m into...
                </div>
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
                      <FormLabel>Age Range</FormLabel>
                      <FormDescription className="-mt-2 mb-6">
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
              </>
            )}
            {step === 2 && (
              <>
                <div className="text-dark-grey text-2xl font-bold">
                  Location Preference
                </div>
                <FormField
                  control={form.control}
                  name="limit"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg">
                      <FormLabel className="text-body-m">
                        Limit by location
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={Boolean(field.value)}
                          onCheckedChange={value => {
                            field.onChange(value);
                            setIsShowLimitRange(value);
                          }}
                          aria-readonly
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {isShowLimitRange && (
                  <>
                    {/* <Map
                      handleOnPlaceChange={setPlaceChest}
                      onMapLoaded={() => {}}
                    /> */}

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
                          <FormLabel className="text-body-m">
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
                              defaultValue={[25]}
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
              </>
            )}
          </div>

          <div className="flex justify-between py-6">
            {step === 0 && (
              <Button
                type="button"
                disabled={!isDobWatch || !isNameWatch}
                className="w-full"
                onClick={onNext}
              >
                Next
              </Button>
            )}
            {step === 1 && (
              <Button type="button" className="w-full" onClick={onNext}>
                Next
              </Button>
            )}
            {step === 2 && (
              <Button loading={isLoading} type="submit" className="w-full">
                Start Chatting
              </Button>
            )}
          </div>
        </form>
      </div>
    </Form>
  );
};
