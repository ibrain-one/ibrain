'use client';
import ReactGA from 'react-ga';
import { useEffect } from 'react';

export function useGoogleAnalytics() {
  useEffect(() => {
    ReactGA.initialize('G-P7EJWD94RQ');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);
}
