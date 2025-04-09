import * as React from 'react';

import { cn } from '@/lib';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'text-body-m placeholder:text-light-grey bg-white-200 flex field-sizing-content min-h-16 w-full rounded-md border border-none px-4 py-3 text-base outline-0 transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-500/20 md:text-sm dark:border-neutral-800 dark:bg-neutral-200/30 dark:dark:bg-neutral-800/30 dark:placeholder:text-neutral-400 dark:focus-visible:border-neutral-300 dark:focus-visible:ring-neutral-300/50 dark:aria-invalid:border-red-900 dark:aria-invalid:ring-red-500/40 dark:dark:aria-invalid:ring-red-900/40',
        'aria-invalid:border-red aria-invalid:placeholder:text-dark-grey aria-invalid:border-2 aria-invalid:bg-[#FDEEEC] dark:aria-invalid:border-red-900 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
