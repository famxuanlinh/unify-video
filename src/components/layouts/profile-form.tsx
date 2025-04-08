'use client';
import { env } from '@/constants';
import { useUpdateProfile } from '@/hooks';
import { useAuthStore } from '@/store';
import { Gender, UpdateUserPayload } from '@/types';
import { parseToUsername } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { UploadButton } from '@/components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Checkbox,
  Switch,
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  DualRangeSlider,
  Avatar,
  AvatarImage,
  AvatarFallback,
  DatePicker
} from '@/components';

const formSchema = z.object({
  name: z.string().min(1).min(1).max(32),
  dob: z.coerce.date(),
  gender: z.string(),
  ageRange: z.array(z.number()),
  seekingGender: z.array(z.string()).default([]),
  isLimit: z.boolean(),
  miles: z.coerce.number().min(18).max(99)
});

export function ProfileForm() {
  const { me } = useAuthStore();
  const [isShowLimitRange, setIsShowLimitRange] = useState(
    me?.seekingSettings.location?.limit || false
  );

  const {
    isLoading,
    isGettingCoordinate,
    handleUpdateProfile,
    handleUploadAvatar,
    handleDeleteAvatar,
    handleGetLocation,
    avatarFile,
    isUploading,
    coordinate
  } = useUpdateProfile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: me?.fullName || '',
      dob: me?.dob ? new Date(me?.dob) : undefined,
      gender: me?.gender,
      ageRange: me?.seekingSettings?.ageRange
        ? [me.seekingSettings.ageRange.min, me.seekingSettings.ageRange.max]
        : [18, 99],
      seekingGender: me?.seekingSettings.genders,
      isLimit: me?.seekingSettings.location?.limit,
      miles: me?.seekingSettings.location?.miles
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload: UpdateUserPayload = {
      avatar: '',
      coverImage: '',
      fullName: values.name,
      dob: values.dob.toISOString(),
      gender: values.gender,
      seekingSettings: {
        genders: values.seekingGender.filter(item => Boolean(item)),
        ageRange: {
          min: values.ageRange[0],
          max: values.ageRange[1]
        },
        location: {
          limit: values.isLimit,
          miles: values.miles
        }
      }
    };

    handleUpdateProfile(payload);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-8"
      >
        <div className="flex items-center gap-6">
          <Avatar className="size-20">
            <AvatarImage
              className="object-cover"
              src={env.IPFS_BASE_URL + avatarFile}
            />
            <AvatarFallback>
              {me?.fullName?.slice(0, 2) ||
                parseToUsername(me?.userId as string).slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-4">
            <UploadButton
              accept="image/*"
              isLoading={isUploading}
              onFileUpload={handleUploadAvatar}
            >
              {avatarFile ? 'Update' : 'Upload'} avatar
            </UploadButton>
            <Button
              disabled={Boolean(!avatarFile)}
              variant={'secondary'}
              size={'sm'}
              type="button"
              onClick={handleDeleteAvatar}
            >
              Delete
            </Button>
          </div>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Type name" type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Date of birth</FormLabel>

                <FormControl>
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    setDate={date => {
                      if (date) {
                        field.onChange(date);
                      }
                    }}
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

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Gender.Male}>{Gender.Male}</SelectItem>
                    <SelectItem value={Gender.Female}>
                      {Gender.Female}
                    </SelectItem>
                    <SelectItem value={Gender.NonBinary}>Non Binary</SelectItem>
                    <SelectItem value={Gender.Other}>{Gender.Other}</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-6 space-y-2">
          <Button
            disabled={isGettingCoordinate}
            type="button"
            loading={isGettingCoordinate}
            variant={'secondary'}
            size={'sm'}
            onClick={handleGetLocation}
          >
            {!coordinate.lat ? 'Get location' : 'Update location'}
          </Button>
        </div>

        <div className="space-y-8 rounded-2xl border border-gray-500 p-4">
          <FormField
            control={form.control}
            name="ageRange"
            render={() => (
              <FormItem>
                <FormLabel className="pb-6">Ages I’m into...</FormLabel>
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
                <FormDescription>
                  Adjust the age range using the slider.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Country</FormLabel>
                <FormControl>
                  <LocationSelector
                    onCountryChange={country => {
                      setCountryName(country?.name || '');
                      form.setValue(field.name, [
                        country?.name || '',
                        stateName || ''
                      ]);
                    }}
                    onStateChange={state => {
                      setStateName(state?.name || '');
                      form.setValue(field.name, [
                        form.getValues(field.name)[0] || '',
                        state?.name || ''
                      ]);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  If your country has states, it will be appear after selecting
                  country
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="seekingGender"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2">
                <FormLabel>Seeking Genders</FormLabel>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {Object.values(Gender).map(gender => (
                    <div key={gender} className="flex items-center space-x-3">
                      <Checkbox
                        checked={
                          Array.isArray(field.value) &&
                          field.value.includes(gender)
                        }
                        onCheckedChange={checked => {
                          const newValue = checked
                            ? [
                                ...(Array.isArray(field.value)
                                  ? field.value
                                  : []),
                                gender
                              ]
                            : (Array.isArray(field.value)
                                ? field.value
                                : []
                              ).filter(g => g !== gender);
                          field.onChange(newValue);
                        }}
                      />
                      <FormLabel>{gender}</FormLabel>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormField
              control={form.control}
              name="isLimit"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg pb-3">
                  <FormLabel>Limit by location</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
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
              <FormField
                control={form.control}
                name="miles"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormControl>
                      <Slider
                        min={1}
                        max={100}
                        step={5}
                        defaultValue={[
                          me?.seekingSettings.location?.miles || 25
                        ]}
                        onValueChange={vals => {
                          onChange(vals[0]);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Adjust the limit by sliding: ({value ? value : '25'}
                      {value == 1 ? 'mile' : 'miles'})
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
        <Button loading={isLoading} disabled={isLoading} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
