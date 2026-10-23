import { get, put } from '@vercel/blob';

// shared helpers for the basic school-project auth (accounts + sessions
// live in the same private Blob store the feedback wall uses — they are
// only ever read/written by these server functions, never sent to browsers)
const ACCOUNTS_PATH = 'auth/accounts.json';
const SESSIONS_PATH = 'auth/sessions.json';
export const SESSION_COOKIE = 'ordo_session';
const SESSION_DAYS = 30;

// placeholder org account — change these in the Vercel dashboard
// (Storage → the blob store → auth/accounts.json) whenever you like
const SEED_ACCOUNTS = [
  { email: 'admin@ordoduodecim.test', password: 'ordo2026', name: 'Organization Admin', role: 'org' }
];

export const json = (status, body, extraHeaders) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...extraHeaders
  }
});

export const clientIp = request =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';

// per-IP throttle factory — resets on cold start, plenty for a class site
export const makeLimiter = (max, windowMs = 60000) => {
  const hits = new Map();
  return ip => {
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter(time => now - time < windowMs);
    if (recent.length >= max) { hits.set(ip, recent); return false; }
    recent.push(now);
    hits.set(ip, recent);
    return true;
  };
};

const readPrivateJson = async (pathname, fallback) => {
  try {
    // useCache: false — sessions/accounts must never be read stale from CDN
    const res = await get(pathname, { access: 'private', useCache: false });
    if (!res?.stream) return fallback;
    return JSON.parse(await new Response(res.stream).text());
  } catch {
    return fallback;
  }
};

const writePrivateJson = (pathname, data) =>
  put(pathname, JSON.stringify(data), { access: 'private', allowOverwrite: true });

export async function getAccounts() {
  const data = await readPrivateJson(ACCOUNTS_PATH, null);
  if (!data || !Array.isArray(data.accounts)) {
    await writePrivateJson(ACCOUNTS_PATH, { accounts: SEED_ACCOUNTS });
    return SEED_ACCOUNTS.slice();
  }
  return data.accounts;
}

export const saveAccounts = accounts => writePrivateJson(ACCOUNTS_PATH, { accounts });

export async function getSessions() {
  const data = await readPrivateJson(SESSIONS_PATH, {});
  return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
}

export const saveSessions = sessions => writePrivateJson(SESSIONS_PATH, sessions);

export function cookieValue(request, name) {
  const header = request.headers.get('cookie');
  if (!header) return null;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return decodeURIComponent(part.slice(eq + 1).trim());
  }
  return null;
}

export async function getSession(request) {
  const token = cookieValue(request, SESSION_COOKIE);
  if (!token) return null;
  const sessions = await getSessions();
  return sessions[token] || null;
}

export const sessionCookie = token =>
  `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 24 * 60 * 60}`;

export const clearCookie = `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

export async function createSession(account) {
  const token = crypto.randomUUID();
  const sessions = await getSessions();
  const cutoff = Date.now() - SESSION_DAYS * 24 * 60 * 60 * 1000;
  for (const [key, value] of Object.entries(sessions)) {
    if (!value?.at || new Date(value.at).getTime() < cutoff) delete sessions[key];
  }
  sessions[token] = { email: account.email, name: account.name, role: account.role, at: new Date().toISOString() };
  await saveSessions(sessions);
  return token;
}

export async function destroySession(request) {
  const token = cookieValue(request, SESSION_COOKIE);
  if (!token) return;
  const sessions = await getSessions();
  if (token in sessions) {
    delete sessions[token];
    await saveSessions(sessions);
  }
}
