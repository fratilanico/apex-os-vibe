import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import analytics from '../lib/analytics';

export function useAnalytics() {
  const pathname = usePathname();

  // Initialize session tracking on mount
  useEffect(() => {
    analytics.session();
    analytics.performance();
  }, []);

  // Track page views
  useEffect(() => {
    if (pathname) {
      analytics.pageView(pathname);
    }
  }, [pathname]);

  // Track clicks
  const trackClick = useCallback((element: string, type: Parameters<typeof analytics.click>[1]) => {
    analytics.click(element, type);
  }, []);

  // Track scroll depth
  useEffect(() => {
    if (pathname) {
      return analytics.scroll(pathname);
    }
  }, [pathname]);

  // Track errors
  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    analytics.error(error, context);
  }, []);

  return {
    trackClick,
    trackFormStart: analytics.formStart,
    trackFormField: analytics.formField,
    trackFormSubmit: analytics.formSubmit,
    trackError,
    trackPageView: analytics.pageView,
  };
}

export default useAnalytics;
