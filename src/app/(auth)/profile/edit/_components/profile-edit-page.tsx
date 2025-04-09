'use client';

import { useUpdateProfile } from '@/hooks';
import { useAuthStore } from '@/store';
import { Gender, UpdateUserPayload } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { ArrowLeft, Textarea, UploadButton } from '@/components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  DatePicker
} from '@/components';

const formSchema = z.object({
  fullName: z.string().min(1).min(1).max(32),
  dob: z.coerce.date(),
  gender: z.string(),
  bio: z.string()
});

export function ProfileEditPage() {
  const { me } = useAuthStore();
  const router = useRouter();

  const {
    isLoading,
    handleUpdateProfile,
    handleUploadAvatar,
    handleDeleteAvatar,
    avatarFile,
    isUploading
  } = useUpdateProfile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: me?.fullName || '',
      dob: me?.dob ? new Date(me?.dob) : undefined,
      gender: me?.gender
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload: UpdateUserPayload = {
      avatar: '',
      coverImage: '',
      fullName: values.fullName,
      dob: values.dob.toISOString(),
      gender: values.gender
    };

    handleUpdateProfile(payload);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid h-10 grid-cols-3 items-center px-4 pt-1">
          <div className="w-fit" onClick={() => router.push('/')}>
            <ArrowLeft className="fill-dark-grey" />
          </div>
          <div className="text-head-li flex justify-center">Edit Profile</div>
          <div className="flex justify-end">
            <Button
              disabled={isLoading}
              loading={isLoading}
              className="h-6 !w-fit p-0"
              variant="link"
            >
              Save
            </Button>
          </div>
        </div>
        <div className="bg-white-200 my-4 h-2 w-full"></div>
        <div className="max-w-3xl space-y-8 px-4">
          <div className="flex flex-col items-center gap-4">
            <div>
              <UploadButton
                avatarFile={avatarFile}
                // className="absolute right-0 bottom-0 z-10 h-8 w-8 rounded-full bg-white"
                accept="image/*"
                isLoading={isUploading}
                onFileUpload={handleUploadAvatar}
              ></UploadButton>
            </div>
            <Button
              disabled={Boolean(!avatarFile)}
              variant={'outline'}
              size={'sm'}
              type="button"
              onClick={handleDeleteAvatar}
            >
              Remove Avatar
            </Button>
          </div>
          <FormField
            control={form.control}
            name="fullName"
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

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>DOB</FormLabel>

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
                      <SelectItem value={Gender.NonBinary}>
                        Non Binary
                      </SelectItem>
                      <SelectItem value={Gender.Other}>
                        {Gender.Other}
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Placeholder"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
