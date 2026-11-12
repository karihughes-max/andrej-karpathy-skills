// Netlify runs this automatically after every verified (non-spam) form submission.
// It only acts on the "links-guide" form from /links. The site's other forms
// (connect, contact, open-house) pass through untouched.
//
// Inert until FLODESK_API_KEY and FLODESK_SEGMENTS are set in Netlify env vars.
// FLODESK_SEGMENTS is JSON mapping our keys to Flodesk segment IDs, e.g.
// {"guide:ahwatukee":"...","guide:next-chapter":"...","edit":"...",
//  "journey:local":"...","journey:relocating":"...","journey:downsizing":"...","journey:buying":"..."}
//
// Privacy: logs contain no names, emails or phone numbers.

const API = 'https://api.flodesk.com/v1';
const FORM = 'links-guide';
// Flodesk statuses we must never overwrite (respect prior unsubscribes / bad addresses).
const DO_NOT_TOUCH = new Set(['unsubscribed', 'bounced', 'complained', 'cleaned']);

export const handler = async (event) => {
  let payload;
  try {
    payload = JSON.parse(event.body).payload;
  } catch {
    return { statusCode: 200, body: 'ignored: bad body' };
  }
  if (payload?.form_name !== FORM) return { statusCode: 200, body: 'ignored: other form' };

  const key = process.env.FLODESK_API_KEY;
  let segments;
  try {
    segments = JSON.parse(process.env.FLODESK_SEGMENTS || '{}');
  } catch {
    segments = {};
  }
  if (!key || !Object.keys(segments).length) {
    console.log('links-guide: Flodesk not configured, submission kept in Netlify Forms only');
    return { statusCode: 200, body: 'skipped: not configured' };
  }

  const d = payload.data || {};
  const email = String(d.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { statusCode: 200, body: 'skipped: invalid email' };

  const headers = {
    Authorization: 'Basic ' + Buffer.from(key + ':').toString('base64'),
    'Content-Type': 'application/json',
    'User-Agent': 'YourBestAZLiving-Links (yourbestazliving.com)',
  };

  // 1. Respect existing preferences.
  const existing = await fetch(`${API}/subscribers/${encodeURIComponent(email)}`, { headers });
  if (existing.ok) {
    const sub = await existing.json();
    if (DO_NOT_TOUCH.has(String(sub.status || '').toLowerCase())) {
      console.log(`links-guide: existing subscriber status=${sub.status}, not modified`);
      return { statusCode: 200, body: 'skipped: subscriber opted out' };
    }
  }

  // 2. Work out segments. The guide segment triggers delivery; journey segment drives branching;
  //    the Monthly Edit segment is added only with explicit consent.
  const guide = String(d.guide || '');
  const wantsEdit = guide === 'edit' || d.monthly_edit === 'yes';
  const ids = [
    guide !== 'edit' && segments[`guide:${guide}`],
    d.journey && segments[`journey:${d.journey}`],
    wantsEdit && segments.edit,
  ].filter(Boolean);

  // 3. Create or update (Flodesk upserts by email, so no duplicates).
  const body = {
    email,
    first_name: String(d.first_name || '').slice(0, 60),
    segment_ids: ids,
    custom_fields: {
      // These custom fields must exist in Flodesk first (Audience → Custom fields).
      links_guide: guide,
      links_journey: String(d.journey || ''),
      links_timeline: String(d.timeline || ''),
      links_phone: String(d.phone || '').slice(0, 30),
      links_source: String(d.utm_source || 'links'),
      links_campaign: String(d.utm_campaign || ''),
    },
  };
  const res = await fetch(`${API}/subscribers`, { method: 'POST', headers, body: JSON.stringify(body) });
  console.log(`links-guide: flodesk upsert status=${res.status} guide=${guide} segments=${ids.length}`);
  return { statusCode: 200, body: 'ok' };
};
