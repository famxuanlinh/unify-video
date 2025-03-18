import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export * from './axios';
export * from './peer';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
