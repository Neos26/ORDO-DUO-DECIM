import { del, get, list, put } from '@vercel/blob';
import { getSession, json } from '../lib/auth.mjs';

const PREFIX = 'feedback/';
const MAX_LISTED = 40;
const MAX_TEXT = 1000;
const MAX_NAME = 60;

// best-effort per-IP throttle (5 posts/minute) — resets on cold start,
// which is enough for a public write endpoint on a portfolio site
const hits = new Map();
const withinLimit = ip => {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(time => now - time < 60000);
  if (recent.length >= 5) { hits.set(ip, recent); return false; }
  recent.push(now);
  hits.set(ip, recent);
  return true;
};

export async function GET(request) {
  // ?all=1 → org account only: every entry (including hidden) with its id
  const wantAll = new URL(request.url).searchParams.get('all') === '1';
  let session = null;
  if (wantAll) {
    session = await getSession(request);
    if (!session || session.role !== 'org') {
      return json(403, { error: 'Organization account required.' });
    }
  }
  try {
    const { blobs } = await list({ prefix: PREFIX });
    const recent = blobs
      .slice()
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .slice(0, MAX_LISTED);
    const entries = await Promise.all(recent.map(async blob => {
      try {
        // private store: get() authenticates against blob storage itself;
        // useCache:false so hide/unhide/delete show up immediately
        const res = await get(blob.url, { access: 'private', useCache: false });
        if (!res?.stream) return null;
        const entry = JSON.parse(await new Response(res.stream).text());
        if (typeof entry?.text !== 'string') return null;
        return { ...entry, id: blob.pathname };
      } catch {
        return null;
      }
    }));
    let visible = entries.filter(Boolean);
    if (!wantAll) visible = visible.filter(entry => entry.hidden !== true);
    return json(200, { feedback: visible });
  } catch (error) {
    console.error('feedback list failed:', error);
    return json(500, { error: 'Feedback is unavailable right now.' });
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'Invalid request.' });
  }

  // moderation (org only): hide / unhide / delete an entry by its pathname
  if (body.action) {
    const session = await getSession(request);
    if (!session || session.role !== 'org') {
      return json(403, { error: 'Organization account required.' });
    }
    const id = String(body.id ?? '');
    if (!/^feedback\/[\w.-]+$/.test(id)) {
      return json(400, { error: 'Invalid entry.' });
    }
    const action = String(body.action);
    if (action === 'delete') {
      try {
        await del(id, { access: 'private' });
      } catch (error) {
        console.error('feedback delete failed:', error);
        return json(500, { error: 'Could not delete that entry.' });
      }
      return json(200, { ok: true, id });
    }
    if (action === 'hide' || action === 'unhide') {
      try {
        const res = await get(id, { access: 'private', useCache: false });
        if (!res?.stream) return json(404, { error: 'Entry not found.' });
        const entry = JSON.parse(await new Response(res.stream).text());
        entry.hidden = action === 'hide';
        await put(id, JSON.stringify(entry), { access: 'private', allowOverwrite: true });
        return json(200, { ok: true, id, hidden: entry.hidden });
      } catch (error) {
        console.error('feedback moderate failed:', error);
        return json(500, { error: 'Could not update that entry.' });
      }
    }
    return json(400, { error: 'Unknown action.' });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
  if (!withinLimit(ip)) {
    return json(429, { error: 'Too many posts — wait a minute and try again.' });
  }

  // honeypot — real visitors never see this field
  if (body.website) {
    return json(201, { feedback: { name: 'Anonymous', text: 'Thanks!', at: new Date().toISOString() } });
  }

  const name = String(body.name ?? '').trim().slice(0, MAX_NAME);
  const text = String(body.text ?? '').trim().slice(0, MAX_TEXT);
  if (text.length < 3) {
    return json(400, { error: 'Please write a short message first.' });
  }
  const rating = Math.round(Number(body.rating));
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return json(400, { error: 'Please pick a star rating (1–5).' });
  }

  const entry = { name: name || 'Anonymous', text, rating, at: new Date().toISOString() };
  try {
    await put(`${PREFIX}${Date.now()}-${crypto.randomUUID().slice(0, 8)}.json`, JSON.stringify(entry), { access: 'private' });
  } catch (error) {
    console.error('feedback put failed:', error);
    return json(500, { error: 'Could not save your feedback — please try again.' });
  }
  return json(201, { feedback: entry });
}
