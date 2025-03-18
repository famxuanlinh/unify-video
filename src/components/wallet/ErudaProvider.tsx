'use client';

let eruda: any;
const isEligibleForInstallation =
  typeof window !== 'undefined' && process.env.NODE_ENV === 'development';

if (isEligibleForInstallation) {
  eruda = import('eruda');
}
import { ReactNode, useEffect } from 'react';

export function ErudaProvider(props: { children: ReactNode }) {
  useEffect(() => {
    if (eruda && isEligibleForInstallation) {
      try {
        eruda.init();
      } catch (error) {
        console.log('Eruda failed to initialize', error);
      }
    }
  }, []);

  return <>{props.children}</>;
}
