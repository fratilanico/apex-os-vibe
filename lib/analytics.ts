/**
 * Comprehensive Analytics System
 * Tracks every user interaction across APEX OS
 * 
 * Tables:
 * - jarvis_conversations: AI chat interactions
 * - terminal_commands: Terminal usage
 * - recommendations: Content recommendations
 * - user_interactions: General user actions
 * - page_views: Page visit tracking
 * - click_events: Click tracking
 * - scroll_events: Scroll depth tracking
 * - session_events: Session management
 */

import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

// Session ID management
const SESSION_KEY = 'apex_analytics_session';
const DEVICE_ID_KEY = 'apex_device_id';

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'server';
  
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

// Get device info
export function getDeviceInfo() {
  if (typeof window === 'undefined') return {};
  
  return {
    user_agent: navigator.userAgent,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    language: navigator.language,
    platform: navigator.platform,
    device_id: getOrCreateDeviceId(),
  };
}

// Base tracking function with retry
async function trackEvent(table: string, data: Record<string, any>) {
  const sessionId = getOrCreateSessionId();
  const deviceInfo = getDeviceInfo();
  
  const payload = {
    ...data,
    session_id: sessionId,
    timestamp: new Date().toISOString(),
    ...deviceInfo,
  };
  
  try {
    const { error } = await supabase.from(table).insert([payload]);
    if (error) {
      console.error(`[Analytics] Failed to track ${table}:`, error);
      // Queue for retry
      queueFailedEvent(table, payload);
    }
  } catch (err) {
    console.error(`[Analytics] Exception tracking ${table}:`, err);
    queueFailedEvent(table, payload);
  }
}

// Failed events queue
const failedEventsQueue: Array<{ table: string; data: any }> = [];

function queueFailedEvent(table: string, data: any) {
  if (failedEventsQueue.length < 100) {
    failedEventsQueue.push({ table, data });
  }
}

// Retry failed events every 30 seconds
if (typeof window !== 'undefined') {
  setInterval(async () => {
    if (failedEventsQueue.length === 0) return;
    
    const events = [...failedEventsQueue];
    failedEventsQueue.length = 0;
    
    for (const { table, data } of events) {
      try {
        await supabase.from(table).insert([data]);
      } catch {
        // Re-queue if still failing
        queueFailedEvent(table, data);
      }
    }
  }, 30000);
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE VIEW TRACKING
// ═════════════════════════════════════════════════════════════════════════════

export async function trackPageView(
  page: string,
  metadata?: Record<string, any>
) {
  await trackEvent('page_views', {
    page,
    referrer: typeof document !== 'undefined' ? document.referrer : null,
    ...metadata,
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// CLICK TRACKING
// ═════════════════════════════════════════════════════════════════════════════

export async function trackClick(
  element: string,
  type: 'button' | 'link' | 'card' | 'pill' | 'toggle' | 'other',
  metadata?: Record<string, any>
) {
  await trackEvent('click_events', {
    element,
    type,
    ...metadata,
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// SCROLL TRACKING
// ═════════════════════════════════════════════════════════════════════════════

const scrollDepths = new Set<number>();

export function initScrollTracking(page: string) {
  if (typeof window === 'undefined') return;
  
  scrollDepths.clear();
  
  const trackScroll = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    // Track at 25%, 50%, 75%, 90%, 100%
    const milestones = [25, 50, 75, 90, 100];
    for (const milestone of milestones) {
      if (scrollPercent >= milestone && !scrollDepths.has(milestone)) {
        scrollDepths.add(milestone);
        trackEvent('scroll_events', {
          page,
          depth_percent: milestone,
          scroll_y: window.scrollY,
        });
      }
    }
  };
  
  window.addEventListener('scroll', trackScroll, { passive: true });
  return () => window.removeEventListener('scroll', trackScroll);
}

// ═════════════════════════════════════════════════════════════════════════════
// FORM TRACKING
// ═════════════════════════════════════════════════════════════════════════════

export async function trackFormStart(formId: string) {
  await trackEvent('form_events', {
    form_id: formId,
    event: 'start',
  });
}

export async function trackFormField(
  formId: string,
  field: string,
  timeSpentMs: number
) {
  await trackEvent('form_events', {
    form_id: formId,
    event: 'field_complete',
    field,
    time_spent_ms: timeSpentMs,
  });
}

export async function trackFormSubmit(
  formId: string,
  success: boolean,
  errorMessage?: string
) {
  await trackEvent('form_events', {
    form_id: formId,
    event: 'submit',
    success,
    error_message: errorMessage,
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// SESSION TRACKING
// ═════════════════════════════════════════════════════════════════════════════

let sessionStartTime: number | null = null;

export function initSessionTracking() {
  if (typeof window === 'undefined') return;
  
  sessionStartTime = Date.now();
  
  trackEvent('session_events', {
    event: 'session_start',
    entry_page: window.location.pathname,
  });
  
  // Track session end on unload
  window.addEventListener('beforeunload', () => {
    if (sessionStartTime) {
      const duration = Date.now() - sessionStartTime;
      trackEvent('session_events', {
        event: 'session_end',
        duration_ms: duration,
      });
    }
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// ERROR TRACKING
// ═════════════════════════════════════════════════════════════════════════════

export async function trackError(
  error: Error,
  context?: Record<string, any>
) {
  await trackEvent('error_events', {
    message: error.message,
    stack: error.stack,
    ...context,
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// PERFORMANCE TRACKING
// ═════════════════════════════════════════════════════════════════════════════

export function initPerformanceTracking() {
  if (typeof window === 'undefined') return;
  
  // Track Core Web Vitals
  if ('web-vitals' in window) {
    // @ts-ignore
    window.webVitals.getCLS(console.log);
    // @ts-ignore
    window.webVitals.getFID(console.log);
    // @ts-ignore
    window.webVitals.getFCP(console.log);
    // @ts-ignore
    window.webVitals.getLCP(console.log);
    // @ts-ignore
    window.webVitals.getTTFB(console.log);
  }
  
  // Track page load time
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfData) {
        trackEvent('performance_events', {
          metric: 'page_load',
          value: perfData.loadEventEnd - perfData.startTime,
          dns_lookup: perfData.domainLookupEnd - perfData.domainLookupStart,
          tcp_connect: perfData.connectEnd - perfData.connectStart,
          response_time: perfData.responseEnd - perfData.responseStart,
          dom_interactive: perfData.domInteractive - perfData.startTime,
        });
      }
    }, 0);
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// EXPORT ALL
// ═════════════════════════════════════════════════════════════════════════════

export const analytics = {
  pageView: trackPageView,
  click: trackClick,
  formStart: trackFormStart,
  formField: trackFormField,
  formSubmit: trackFormSubmit,
  error: trackError,
  scroll: initScrollTracking,
  session: initSessionTracking,
  performance: initPerformanceTracking,
  getSessionId: getOrCreateSessionId,
  getDeviceId: getOrCreateDeviceId,
};

export default analytics;
