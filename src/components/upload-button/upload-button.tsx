'use client';

import { toast } from '@/hooks';
import { useAuthStore } from '@/store';
import { getImageUrl } from '@/utils';
import { Loader2 } from 'lucide-react';
import React, { ChangeEvent, FC, useRef } from 'react';

import {
  ButtonProps,
  Avatar,
  AvatarImage,
  CameraIcon,
  AvatarFallback
} from '@/components';

import { cn } from '@/lib';

const isSupport = (file: File, accept: string) => {
  if (!accept || accept === '*/*') {
    return true;
  }

  const acceptedTypes = accept
    .split(',')
    .map(type => type.trim().toLowerCase());
  const fileType = file.type.trim().toLowerCase();
  const fileName = file.name.toLowerCase();

  for (const type of acceptedTypes) {
    if (
      type === fileType ||
      (type.endsWith('/*') && fileType.startsWith(type.slice(0, -2)))
    ) {
      return true;
    }

    if (type.startsWith('.') && fileName.endsWith(type)) {
      return true;
    }
  }

  return false;
};

type UploadFileButtonClassName = {
  container?: string;
  _default?: string;
};

type UploadFileButtonProps = Omit<ButtonProps, 'className'> & {
  onFileUpload: (file: File) => void;
  name?: string;
  accept?: string;
  isLoading?: boolean;
  avatarFile?: string;
  className?: UploadFileButtonClassName | string;
  isDefaultVariant?: boolean;
};

export const UploadButton: FC<UploadFileButtonProps> = ({
  onFileUpload,
  isLoading,
  name,
  isDefaultVariant = true,
  accept,
  avatarFile,
  className
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { me } = useAuthStore();

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    if (file) {
      if (accept && !isSupport(file, accept)) {
        return toast({
          description: 'File type is not supported'
        });
      }

      onFileUpload(file);
    }
  };

  if (!me) return;

  return (
    <div className={cn('relative w-full', className)}>
      <input
        name={name}
        accept={accept}
        ref={inputRef}
        className="sr-only"
        type="file"
        onChange={events => {
          handleFileUpload(events);
        }}
      />

      {isLoading ? (
        <div className="flex size-20 animate-pulse items-center justify-center rounded-full bg-gray-300">
          <Loader2 className="size-10 animate-spin" />
        </div>
      ) : (
        <Avatar className="size-20">
          <AvatarImage className="object-cover" src={getImageUrl(avatarFile)} />
          {!isDefaultVariant && (
            <AvatarFallback className="text-3xl">
              {me?.fullName?.slice(0, 1)}
            </AvatarFallback>
          )}
        </Avatar>
      )}
      {!isLoading && (
        <>
          {isDefaultVariant ? (
            <button
              type="button"
              disabled={isLoading}
              onClick={() => inputRef.current?.click()}
              className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-full bg-black/50"
            >
              <CameraIcon className="fill-white" />
            </button>
          ) : (
            <div className="absolute right-0.5 bottom-0.5 flex size-6 items-center justify-center rounded-full border-2 border-white bg-[#000000B2]">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => inputRef.current?.click()}
                className=""
              >
                <CameraIcon className="size-3.5 fill-white" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
