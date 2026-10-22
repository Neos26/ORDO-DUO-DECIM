import { getDownloadUrl, list, put } from '@vercel/blob';

const PREFIX = 'feedback/';
const MAX_LISTED = 40;
const MAX_TEXT = 1000;
const MAX_NAME = 60;

const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

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

export async function GET() {
  try {
    const { blobs } = await list({ prefix: PREFIX });
    const recent = blobs
      .slice()
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .slice(0, MAX_LISTED);
    const entries = await Promise.all(recent.map(async blob => {
      try {
        // the store is private — sign each URL server-side before fetching
        const response = await fetch(getDownloadUrl(blob.url));
        if (!response.ok) return null;
        const entry = await response.json();
        return typeof entry?.text === 'string' ? entry : null;
      } catch {
        return null;
      }
    }));
    return json(200, { feedback: entries.filter(Boolean) });
  } catch (error) {
    console.error('feedback list failed:', error);
    return json(500, { error: 'Feedback is unavailable right now.' });
  }
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
  if (!withinLimit(ip)) {
    return json(429, { error: 'Too many posts — wait a minute and try again.' });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'Invalid request.' });
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

  const entry = { name: name || 'Anonymous', text, at: new Date().toISOString() };
  try {
    await put(`${PREFIX}${Date.now()}-${crypto.randomUUID().slice(0, 8)}.json`, JSON.stringify(entry), { access: 'private' });
  } catch (error) {
    console.error('feedback put failed:', error);
    return json(500, { error: 'Could not save your feedback — please try again.' });
  }
  return json(201, { feedback: entry });
}
