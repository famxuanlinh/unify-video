'use client';

import { usePeer } from '@/hooks';
import { useCreateReview } from '@/hooks/use-create-review';
import { useAuthStore, useMainStore } from '@/store';
import { CreateReviewPayload } from '@/types/review';
import { formatDuration, getImageUrl } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Button,
  Form,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Avatar,
  AvatarImage
} from '@/components';

import { EndCallButton } from '../../_components';
import { ReactionRating } from './reaction-rating';

const friendTypes = [
  {
    id: 'MATCH',
    label: '❤️ Match'
  },
  { id: 'FRIEND', label: '🤝 Friends' }
];

const formSchema = z
  .object({
    rating: z.enum(['-2', '-1', '0', '1', '2']).transform(String),
    connectionTypes: z.array(z.string()),
    pass: z.boolean().optional().default(false)
  })
  .refine(data => data.connectionTypes.length > 0 || data.pass === true, {
    message: 'Either connectionTypes or pass must be selected',
    path: ['connectionTypes']
  });

export const ReviewPage = () => {
  const router = useRouter();
  const { handleReturnToHome } = usePeer();

  const { me } = useAuthStore();
  const { incomingUserInfo, timeStreaming, setTimeStreaming, callId } =
    useMainStore.getState();
  const { isLoading, createReview } = useCreateReview({
    onSuccess: () => {
      handleReturnToHome();
      setTimeStreaming(0);
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: '',
      connectionTypes: [],
      pass: false
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (!callId) {
      router.push('/');
    }
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!incomingUserInfo) return;
    const payload: CreateReviewPayload = {
      reviewedUserId: incomingUserInfo?.userId as string,
      callId: callId as string,
      rating: Number(values.rating),
      comment: '',
      connectionTypes: values.connectionTypes,
      pass: values.pass
    };

    createReview(payload);
  }

  return (
    <Form {...form}>
      <div className="flex w-full items-center bg-cover sm:h-screen sm:bg-[url(/images/main-bg.png)]">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-120 space-y-8"
        >
          <div
            className={`relative flex flex-col justify-end bg-cover max-sm:min-h-screen max-sm:bg-[url('/images/review-bg.jpg')]`}
          >
            <div className="relative mt-[92px] h-full w-full">
              <div className="absolute left-1/2 z-20 -translate-x-1/2">
                <div className="flex w-full justify-center">
                  <div className="relative w-[184px]">
                    <div className="absolute top-[50px] left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                      <EndCallButton />
                    </div>
                    <Avatar className="absolute left-0 size-[100px]">
                      <AvatarImage
                        className="rounded-full object-cover"
                        src={
                          getImageUrl(me?.avatar) ||
                          '/images/avatar-default.png'
                        }
                      />
                    </Avatar>
                    <Avatar className="absolute right-0 size-[100px]">
                      <AvatarImage
                        className="rounded-full object-cover"
                        src={
                          getImageUrl(incomingUserInfo?.avatar) ||
                          '/images/avatar-default.png'
                        }
                      />
                    </Avatar>
                  </div>
                </div>
              </div>
              <div className="mt-[124px]">
                <div className="text-center text-lg font-medium text-white">
                  Call Ended
                </div>
                <div className="text-center text-sm text-white">
                  {formatDuration(timeStreaming)}
                </div>
              </div>
            </div>
            <div className="mx-4 mt-8 mb-6 rounded-3xl bg-[#1E1E1E0D] pt-0 text-white">
              <div className="p-4">
                <div className="text-center text-sm font-bold text-white">
                  How’d it go?
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <ReactionRating field={field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-4 rounded-2xl bg-[#1E1E1E0D] p-4">
                  <div className="mb-4">
                    <div className="pb-1 text-sm font-bold text-white">
                      Keep in touch?
                    </div>
                    <div className="pb-1 text-[10px] text-white italic opacity-50">
                      *Pick all that apply
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="connectionTypes"
                    render={({ field }) => {
                      const selectedValues = Array.isArray(field.value)
                        ? field.value
                        : [];

                      return (
                        <FormItem className="flex flex-col space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            {friendTypes.map(type => {
                              const isChecked = selectedValues.includes(
                                type.id
                              );

                              return (
                                <label
                                  key={type.id}
                                  htmlFor={`gender-${type.id}`}
                                  className={`flex h-12 cursor-pointer items-center justify-center rounded-2xl text-white transition ${
                                    isChecked
                                      ? 'text-head-sx bg-red'
                                      : 'text-body-m bg-white/16'
                                  } `}
                                >
                                  <Input
                                    id={`gender-${type.id}`}
                                    className="peer hidden"
                                    checked={isChecked}
                                    type="checkbox"
                                    onChange={() => {
                                      if (form.getValues('pass')) {
                                        form.setValue('pass', false);
                                      }
                                      const newValue = isChecked
                                        ? selectedValues.filter(
                                            g => g !== type.id
                                          )
                                        : [...selectedValues, type.id];

                                      field.onChange(newValue);
                                    }}
                                  />
                                  {type.label}
                                </label>
                              );
                            })}
                          </div>
                          {/* <FormMessage /> */}
                        </FormItem>
                      );
                    }}
                  />
                  <div className="relative my-4 flex items-center">
                    <div className="flex-grow border-t border-dashed border-white/16"></div>
                    <span className="mx-4 text-xs">or</span>
                    <div className="flex-grow border-t border-dashed border-white/16"></div>
                  </div>
                  <FormField
                    control={form.control}
                    name="pass"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex w-full flex-col space-y-2">
                          <label
                            // key={type.id}
                            htmlFor={'pass'}
                            className={`flex h-12 cursor-pointer items-center justify-center rounded-2xl text-white transition ${
                              field.value
                                ? 'text-head-sx bg-red'
                                : 'text-body-m bg-white/16'
                            } `}
                          >
                            <Input
                              id={'pass'}
                              className="peer hidden"
                              checked={field.value}
                              type="checkbox"
                              onChange={e => {
                                if (e.target.checked) {
                                  form.setValue('connectionTypes', []);
                                }
                                field.onChange(e.target.checked);
                              }}
                            />
                            ❌ Pass
                          </label>
                          {/* <FormMessage /> */}
                        </FormItem>
                      );
                    }}
                  />
                  <div className="mt-10 flex justify-end">
                    <button
                      onClick={e => {
                        e.preventDefault();
                        router.push(`/report`);
                      }}
                      // onClick={toggleVisibility}
                      className="flex cursor-pointer items-center gap-1 text-white"
                    >
                      <Flag /> <div className="text-xs">Report</div>
                    </button>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  className="w-full"
                  loading={isLoading}
                  disabled={isLoading || !form.formState.isValid}
                  type="submit"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Form>
  );
};
