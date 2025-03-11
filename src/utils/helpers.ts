import { debugMode } from './constants';

export function log(...args: unknown[]) {
  if (debugMode) {
    console.log(...args);
  }
}
