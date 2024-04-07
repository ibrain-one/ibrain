'use client';
import { PropsWithChildren, Suspense } from 'react';
import useIBrain from './hooks/useIBrain';

export default function UserMicroAppLayout({ children }: PropsWithChildren) {
  useIBrain();

  return (
    <Suspense>
      <section>{children}</section>
    </Suspense>
  );
}
