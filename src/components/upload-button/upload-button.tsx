'use client';

import { toast } from '@/hooks';
import React, { ChangeEvent, FC, useRef } from 'react';

import { ButtonProps, Button } from '@/components';

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
  className?: UploadFileButtonClassName | string;
};

export const UploadButton: FC<UploadFileButtonProps> = ({
  onFileUpload,
  children,
  isLoading,
  name,
  accept
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

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

      onFileUpload(file); // ✅ Corrected placement
    }
  };

  return (
    <div className="w-full">
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

      <Button
        size={'sm'}
        loading={isLoading}
        disabled={isLoading}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        {children}
      </Button>
    </div>
  );
};
