'use client';

import { RepConnector } from './type';

export function getConnector(): RepConnector {
  return !process.env.NEXT_RUNTIME && (window as any).connector
    ? (window as any).connector
    : ({} as RepConnector);
}
