'use client';

import { useCreateReport } from '@/hooks/use-create-report';
import { useAuthStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import {
  ArrowLeft,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Form,
  FormLabel,
  FormControl,
  Textarea,
  Button
} from '@/components';

const formSchema = z.object({
  reportType: z.string(),
  description: z.string(),
  other: z.string().optional()
});

enum ReportType {
  INAPPROPRIATE_BEHAVIOR = 'INAPPROPRIATE_BEHAVIOR',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  FAKE_PROFILE = 'FAKE_PROFILE',
  SCAM_OR_FRAUD = 'SCAM_OR_FRAUD',
  UNDERAGE_USER = 'UNDERAGE_USER',
  OTHER = 'OTHER'
}

const reasons = [
  {
    id: ReportType.INAPPROPRIATE_BEHAVIOR,
    title: 'Inappropriate Behavior',
    description:
      'Harassment, really mean/rude, hate speech, threats, or unwanted advances'
  },
  {
    id: ReportType.INAPPROPRIATE_CONTENT,
    title: 'Inappropriate Content',
    description: 'Nudity, explicit images, or offensive content'
  },
  {
    id: ReportType.FAKE_PROFILE,
    title: 'Fake Profile',
    description: 'Impersonation, misleading information, or spam accounts'
  },
  {
    id: ReportType.SCAM_OR_FRAUD,
    title: 'Scam or Fraud',
    description: 'Requests for money, suspicious links, or deceptive behavior'
  },
  {
    id: ReportType.UNDERAGE_USER,
    title: 'Underage User',
    description: 'They appear to be under the required age'
  },
  {
    id: ReportType.OTHER,
    title: 'Other',
    description: 'Something else not listed.'
  }
];

export const ProfilePage = () => {
  const { me } = useAuthStore();
  const router = useRouter();
  const { isLoading, createReport } = useCreateReport();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
    mode: 'onChange'
  });

  const reportType = useWatch({
    control: form.control,
    name: 'reportType'
  });

  const isOtherOptionSelected = reportType === ReportType.OTHER;

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!me) return;
    const payload = {
      ...values,
      reportedUserId: me?.userId
    };
    createReport(payload);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-8"
      >
        <div className="relative h-screen px-4">
          <div className="grid h-10 grid-cols-3 items-center pt-1">
            <div
              className="w-fit cursor-pointer"
              onClick={() => router.push('/review')}
            >
              <ArrowLeft className="fill-dark-grey" />
            </div>
            <div className="text-head-li flex justify-center">Report</div>
            <div></div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <div className="text-sm font-bold">
              Why are you submitting this report?
            </div>
            <FormField
              control={form.control}
              name="reportType"
              render={({ field }) => (
                <FormItem className="w-full gap-y-2">
                  {reasons.map(option => (
                    <label
                      key={option.id}
                      className={`flex w-full cursor-pointer items-start gap-2 rounded-xl px-3 transition`}
                    >
                      <div className="w-6">
                        <Input
                          type="radio"
                          value={option.id}
                          checked={field.value === option.id}
                          onChange={e => {
                            const other = form.getValues('other');
                            if (e.target.value !== ReportType.OTHER && other) {
                              form.setValue('other', '');
                            }
                            field.onChange(e.target.value);
                          }}
                          className="size-6"
                        />
                      </div>
                      <div className="flex w-full flex-col">
                        <span className="text-dark-grey text-xs leading-6">
                          {option.title}
                        </span>
                        {option.id === ReportType.OTHER ? (
                          <FormField
                            control={form.control}
                            name="other"
                            disabled={!isOtherOptionSelected}
                            render={({ field }) => (
                              <FormItem>
                                <Textarea
                                  maxLength={256}
                                  className="w-full resize-none"
                                  {...field}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <span className="text-light-grey font-b text-xs">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="text-dark-grey text-sm font-semibold">
                      Tell us more
                    </span>
                    <span className="text-light-grey text-xs font-light">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      maxLength={256}
                      className="h-[114px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="sticky bottom-0 bg-white p-4">
          <Button
            variant="default"
            className="w-full"
            loading={isLoading}
            // disabled={isLoading || !form.formState.isValid}
            type="submit"
          >
            Done
          </Button>
        </div>
      </form>
    </Form>
  );
};
