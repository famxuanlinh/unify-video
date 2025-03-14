import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export * from './axios';
export * from './connector';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
