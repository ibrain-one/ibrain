'use client';
import { PropsWithChildren, Suspense } from 'react';
import { IBrain } from './components/IBrain/IBrain';

export default function LandingMicroAppLayout({ children }: PropsWithChildren) {
  return (
    <Suspense>
      <IBrain/>
      <section>{children}</section>
    </Suspense>
  );
}
