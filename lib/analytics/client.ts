/**
 * APEX OS Analytics & Persistence Client
 * v7.0 CRITICAL RESTORATION - DB SYNC ENABLED
 */

import { Trajectory } from '../../stores/useOnboardingStore';

export interface UserProfile {
  trajectory: Trajectory;
  trajectoryPromptedAt: string | null;
  full_name?: string;
  phone?: string;
  client_session_id?: string;
}

const STORAGE_PREFIX = 'apex_waitlist_profile_v1:';

function safeKey(email?: string): string {
  const e = (email || '').trim().toLowerCase();
  return `${STORAGE_PREFIX}${e || 'anon'}`;
}

export async function getProfile({ email }: { email?: string }): Promise<UserProfile> {
  // 1. Check local first
  let localProfile: UserProfile = { trajectory: null, trajectoryPromptedAt: null };
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(safeKey(email));
      if (raw) {
        const parsed = JSON.parse(raw);
        localProfile = {
          trajectory: parsed.trajectory === 'BLUE' || parsed.trajectory === 'RED' ? parsed.trajectory : null,
          trajectoryPromptedAt: typeof parsed.trajectoryPromptedAt === 'string' ? parsed.trajectoryPromptedAt : null,
          full_name: parsed.full_name,
          phone: parsed.phone
        };
      }
    } catch {}
  }

  // 2. Fetch from DB if email provided
  if (email) {
    try {
      const res = await fetch(`/api/profile/get?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          const dbProfile: UserProfile = {
            trajectory: data.profile.trajectory,
            trajectoryPromptedAt: data.profile.trajectory_prompted_at,
            full_name: data.profile.full_name,
            phone: data.profile.phone
          };
          // Sync local
          if (typeof window !== 'undefined') {
            localStorage.setItem(safeKey(email), JSON.stringify(dbProfile));
          }
          return dbProfile;
        }
      }
    } catch (error) {
      console.warn('[Analytics] DB lookup failed, using local fallback:', error);
    }
  }

  return localProfile;
}

export async function upsertTrajectory({ 
  email, 
  trajectory,
  name,
  phone
}: { 
  email?: string; 
  trajectory?: Trajectory;
  name?: string;
  phone?: string;
}) {
  if (typeof window !== 'undefined') {
    const current = await getProfile({ email });
    const patch = {
      trajectory: trajectory ?? current.trajectory,
      trajectoryPromptedAt: current.trajectoryPromptedAt,
      full_name: name ?? current.full_name,
      phone: phone ?? current.phone
    };
    localStorage.setItem(safeKey(email), JSON.stringify(patch));
  }

  if (email) {
    const sessionId = typeof window !== 'undefined' ? localStorage.getItem('apex_client_session_id') : undefined;
    try {
      const res = await fetch('/api/profile/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, trajectory, name, phone, client_session_id: sessionId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof window !== 'undefined') {
          localStorage.setItem(safeKey(email), JSON.stringify({
            trajectory: data.profile.trajectory,
            trajectoryPromptedAt: data.profile.trajectory_prompted_at,
            full_name: data.profile.full_name,
            phone: data.profile.phone
          }));
        }
      }
    } catch (error) {
      console.error('[Analytics] Failed to persist trajectory to DB:', error);
    }
  }
}

export async function markPillPrompted({ email }: { email?: string }) {
  const now = new Date().toISOString();
  
  if (typeof window !== 'undefined') {
    const current = await getProfile({ email });
    localStorage.setItem(safeKey(email), JSON.stringify({
      ...current,
      trajectoryPromptedAt: now
    }));
  }

  if (email) {
    try {
      await fetch('/api/pill/prompted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      console.warn('[Analytics] Failed to mark pill prompted in DB:', error);
    }
  }
}

export async function trackEvent({ 
  email, 
  eventType, 
  payload = {} 
}: { 
  email?: string; 
  eventType: string; 
  payload?: any;
}) {
  const sessionId = typeof window !== 'undefined' ? localStorage.getItem('apex_client_session_id') : undefined;
  const data = {
    email,
    event_type: eventType,
    payload,
    client_session_id: sessionId,
    url: typeof window !== 'undefined' ? window.location.pathname : '',
    timestamp: new Date().toISOString()
  };

  console.log(`[Event: ${eventType}]`, data);

  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {}
}
