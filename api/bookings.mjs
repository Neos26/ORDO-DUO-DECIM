import { get, list, put } from '@vercel/blob';
import { clientIp, getSession, json, makeLimiter } from '../lib/auth.mjs';

const PREFIX = 'bookings/';
const MAX_LISTED = 100;
const MAX_MESSAGE = 1000;
const EVENT_TYPES = [
  'Birthday', 'Wedding', 'Debut', 'Corporate Event',
  'Seminar', 'Party', 'School Event', 'Special Occasion'
];

const submitLimit = makeLimiter(5);

const readEntry = async blob => {
  try {
    const res = await get(blob.url, { access: 'private' });
    if (!res?.stream) return null;
    const entry = JSON.parse(await new Response(res.stream).text());
    return typeof entry?.message === 'string' ? { id: blob.pathname, ...entry } : null;
  } catch {
    return null;
  }
};

export async function GET(request) {
  const session = await getSession(request);
  if (!session) return json(401, { error: 'Please sign in first.' });
  try {
    const { blobs } = await list({ prefix: PREFIX });
    const recent = blobs
      .slice()
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .slice(0, MAX_LISTED);
    const entries = (await Promise.all(recent.map(readEntry))).filter(Boolean);
    // members only see their own; the org account sees everything
    const visible = session.role === 'org' ? entries : entries.filter(entry => entry.email === session.email);
    return json(200, { bookings: visible });
  } catch (error) {
    console.error('bookings list failed:', error);
    return json(500, { error: 'Bookings are unavailable right now.' });
  }
}

export async function POST(request) {
  const session = await getSession(request);
  if (!session) return json(401, { error: 'Please sign in to send a booking.' });
  if (!submitLimit(clientIp(request))) {
    return json(429, { error: 'Too many submissions — wait a minute and try again.' });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'Invalid request.' });
  }

  const name = String(body.name ?? '').trim().slice(0, 60) || session.name;
  const type = String(body.type ?? '').trim();
  if (!EVENT_TYPES.includes(type)) {
    return json(400, { error: 'Please pick an event type.' });
  }
  const date = String(body.date ?? '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(date).getTime())) {
    return json(400, { error: 'Please pick a valid event date.' });
  }
  const headcount = Math.round(Number(body.headcount));
  if (!Number.isFinite(headcount) || headcount < 1 || headcount > 100000) {
    return json(400, { error: 'Please enter a sensible headcount.' });
  }
  const message = String(body.message ?? '').trim().slice(0, MAX_MESSAGE);
  if (message.length < 3) {
    return json(400, { error: 'Please add a short message about the event.' });
  }

  // email always comes from the signed-in account, never from the request body
  const entry = { name, email: session.email, type, date, headcount, message, at: new Date().toISOString() };
  try {
    await put(`${PREFIX}${Date.now()}-${crypto.randomUUID().slice(0, 8)}.json`, JSON.stringify(entry), { access: 'private' });
  } catch (error) {
    console.error('booking put failed:', error);
    return json(500, { error: 'Could not save your booking — please try again.' });
  }
  return json(201, { booking: entry });
}
