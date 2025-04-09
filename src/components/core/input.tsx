import * as React from 'react';

import { cn } from '@/lib';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'text-body-m placeholder:text-light-grey bg-white-200 flex h-12 w-full min-w-0 rounded-md border border-transparent px-3 py-1 ring-0 transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'aria-invalid:border-red aria-invalid:placeholder:text-dark-grey aria-invalid:border-2 aria-invalid:bg-[#FDEEEC] dark:aria-invalid:border-red-900 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40',
        className
      )}
      {...props}
    />
  );
}

export { Input };
