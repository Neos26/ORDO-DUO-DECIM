import {
  clearCookie, clientIp, createSession, destroySession, getAccounts,
  getSession, json, makeLimiter, saveAccounts, sessionCookie
} from '../lib/auth.mjs';

const attempts = makeLimiter(10);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const publicUser = session => ({ email: session.email, name: session.name, role: session.role });

export async function GET(request) {
  const session = await getSession(request);
  return json(200, { user: session ? publicUser(session) : null });
}

export async function POST(request) {
  if (!attempts(clientIp(request))) {
    return json(429, { error: 'Too many attempts — wait a minute and try again.' });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'Invalid request.' });
  }

  if (body.action === 'logout') {
    await destroySession(request);
    return json(200, { ok: true }, { 'set-cookie': clearCookie });
  }

  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');
  if (!EMAIL_RE.test(email)) {
    return json(400, { error: 'Please enter a valid email address.' });
  }
  if (!password) {
    return json(400, { error: 'Please enter your password.' });
  }

  const accounts = await getAccounts();

  if (body.action === 'signup') {
    const name = String(body.name ?? '').trim().slice(0, 60);
    if (!name) return json(400, { error: 'Please enter your name.' });
    if (password.length < 6) return json(400, { error: 'Password needs at least 6 characters.' });
    if (accounts.some(account => account.email === email)) {
      return json(409, { error: 'That email already has an account — sign in instead.' });
    }
    // signups are always members; the org role only exists via the seeded account
    const account = { email, password, name, role: 'member' };
    accounts.push(account);
    await saveAccounts(accounts);
    const token = await createSession(account);
    return json(201, { user: publicUser({ ...account }) }, { 'set-cookie': sessionCookie(token) });
  }

  if (body.action === 'login') {
    const account = accounts.find(entry => entry.email === email && entry.password === password);
    if (!account) return json(401, { error: 'Wrong email or password.' });
    const token = await createSession(account);
    return json(200, { user: publicUser(account) }, { 'set-cookie': sessionCookie(token) });
  }

  return json(400, { error: 'Unknown action.' });
}
