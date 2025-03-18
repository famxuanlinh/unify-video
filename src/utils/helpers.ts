import { debugMode } from '@/lib';

export function log(...args: unknown[]) {
  if (debugMode) {
    console.log(...args);
  }
}
