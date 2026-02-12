type Trajectory = 'BLUE' | 'RED' | null;

type Profile = {
  trajectory: Trajectory;
  trajectoryPromptedAt: string | null;
};

function safeKey(email?: string): string {
  const e = (email || '').trim().toLowerCase();
  return `apex_waitlist_profile_v1:${e || 'anon'}`;
}

function readProfile(email?: string): Profile {
  if (typeof window === 'undefined') return { trajectory: null, trajectoryPromptedAt: null };
  try {
    const raw = window.localStorage.getItem(safeKey(email));
    if (!raw) return { trajectory: null, trajectoryPromptedAt: null };
    const parsed = JSON.parse(raw) as Partial<Profile>;
    return {
      trajectory: parsed.trajectory === 'BLUE' || parsed.trajectory === 'RED' ? parsed.trajectory : null,
      trajectoryPromptedAt: typeof parsed.trajectoryPromptedAt === 'string' ? parsed.trajectoryPromptedAt : null,
    };
  } catch {
    return { trajectory: null, trajectoryPromptedAt: null };
  }
}

function writeProfile(email: string | undefined, patch: Partial<Profile>): void {
  if (typeof window === 'undefined') return;
  const current = readProfile(email);
  const next: Profile = {
    trajectory: patch.trajectory ?? current.trajectory,
    trajectoryPromptedAt: patch.trajectoryPromptedAt ?? current.trajectoryPromptedAt,
  };
  try {
    window.localStorage.setItem(safeKey(email), JSON.stringify(next));
  } catch {
    // ignore storage failures
  }
}

export async function getProfile(input: { email?: string }): Promise<Profile> {
  return readProfile(input.email);
}

export async function markPillPrompted(input: { email?: string }): Promise<void> {
  writeProfile(input.email, { trajectoryPromptedAt: new Date().toISOString() });
}

export async function upsertTrajectory(input: { email?: string; trajectory: 'BLUE' | 'RED' }): Promise<void> {
  writeProfile(input.email, { trajectory: input.trajectory });
}

export async function trackEvent(input: {
  email?: string;
  eventType: string;
  payload?: Record<string, unknown>;
}): Promise<void> {
  // Client-side telemetry stub. Intentionally no network calls.
  // If/when you add a server endpoint, wire it here.
  void input;
}
