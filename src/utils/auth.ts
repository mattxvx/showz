// Production Cryptographic Authentication for Showz Admin
const PASSWORD_SALT = 'showz_hardcore_salt_v1:';
// Salted SHA-256 hash of the master password
const MASTER_HASH = '0360f0c85867058f03906e3e10e71adac0906c029207f1028a094ac05e01c637';

const SESSION_KEY = 'showz_admin_session_v1';
const ATTEMPTS_KEY = 'showz_auth_attempts_v1';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

interface AttemptRecord {
  count: number;
  lockedUntil: number | null;
}

/**
 * Computes salted SHA-256 hash using native Web Crypto API
 */
async function computeHash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(PASSWORD_SALT + input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies admin password against the cryptographic salted hash
 */
export async function verifyMasterPassword(password: string): Promise<{ success: boolean; error?: string }> {
  const attempts = getAttemptRecord();

  // Check if locked out
  if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
    const minutesLeft = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
    return {
      success: false,
      error: `Too many failed attempts. Locked out for ${minutesLeft} more minute(s).`,
    };
  }

  const hash = await computeHash(password);
  if (hash === MASTER_HASH) {
    // Reset failed attempts on success
    clearAttemptRecord();
    setAdminSession();
    return { success: true };
  } else {
    // Register failed attempt
    const newCount = attempts.count + 1;
    const lockedUntil = newCount >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : null;
    saveAttemptRecord({ count: newCount, lockedUntil });

    const remaining = MAX_ATTEMPTS - newCount;
    return {
      success: false,
      error: remaining > 0
        ? `Access Denied. Invalid password (${remaining} attempt${remaining === 1 ? '' : 's'} remaining).`
        : 'Access Denied. Too many failed attempts. Locked out for 15 minutes.',
    };
  }
}

/**
 * Session management (4-hour auto-expiry, sessionStorage only)
 */
export function isSessionValid(): boolean {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    if (!session || !session.expiresAt) return false;
    if (Date.now() > session.expiresAt) {
      clearAdminSession();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function setAdminSession(): void {
  const session = {
    authenticated: true,
    expiresAt: Date.now() + 4 * 60 * 60 * 1000, // 4 hours
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

function getAttemptRecord(): AttemptRecord {
  try {
    const raw = sessionStorage.getItem(ATTEMPTS_KEY);
    return raw ? JSON.parse(raw) : { count: 0, lockedUntil: null };
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

function saveAttemptRecord(record: AttemptRecord): void {
  try {
    sessionStorage.setItem(ATTEMPTS_KEY, JSON.stringify(record));
  } catch {
    // ignore
  }
}

function clearAttemptRecord(): void {
  sessionStorage.removeItem(ATTEMPTS_KEY);
}
