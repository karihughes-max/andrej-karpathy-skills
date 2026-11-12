// Netlify runs this automatically after every verified (non-spam) form submission.
// It only acts on the "links-guide" form from /links. The site's other forms
// (connect, contact, open-house) pass through untouched.
//
// Needs only FLODESK_API_KEY. Segments are found by NAME in Flodesk (create them once):
//   Links - Ahwatukee Guide · Links - Next Chapter Guide · Links - Monthly Edit
//   Journey - Living Locally · Journey - Relocating · Journey - Downsizing · Journey - Buying
// (Matching ignores case, spaces and punctuation.) Optional override: FLODESK_SEGMENTS as JSON
// of key → segment ID, e.g. {"guide:ahwatukee":"<id>"}.
//
// Privacy: logs contain no names, emails or phone numbers.

const API = 'https://api.flodesk.com/v1';
const FORM = 'links-guide';
// Flodesk statuses we must never overwrite (respect prior unsubscribes / bad addresses).
const DO_NOT_TOUCH = new Set(['unsubscribed', 'bounced', 'complained', 'cleaned']);
const SEGMENT_NAMES = {
  'guide:ahwatukee': 'Links - Ahwatukee Guide',
  'guide:next-chapter': 'Links - Next Chapter Guide',
  edit: 'Links - Monthly Edit',
  'journey:local': 'Journey - Living Locally',
  'journey:relocating': 'Journey - Relocating',
  'journey:downsizing': 'Journey - Downsizing',
  'journey:buying': 'Journey - Buying',
};
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

async function resolveSegments(headers) {
  try {
    const override = JSON.parse(process.env.FLODESK_SEGMENTS || '{}');
    if (Object.keys(override).length) return override;
  } catch {
    console.log('links-guide: FLODESK_SEGMENTS is not valid JSON, falling back to name lookup');
  }
  const res = await fetch(`${API}/segments?per_page=100`, { headers });
  if (!res.ok) {
    console.log(`links-guide: could not list Flodesk segments status=${res.status}`);
    return {};
  }
  const list = (await res.json()).data || [];
  const byName = new Map(list.map((s) => [norm(s.name), s.id]));
  const out = {};
  for (const [k, name] of Object.entries(SEGMENT_NAMES)) {
    if (byName.has(norm(name))) out[k] = byName.get(norm(name));
  }
  const missing = Object.keys(SEGMENT_NAMES).filter((k) => !out[k]);
  if (missing.length) console.log(`links-guide: Flodesk segments not found: ${missing.join(', ')}`);
  return out;
}

export const handler = async (event) => {
  let payload;
  try {
    payload = JSON.parse(event.body).payload;
  } catch {
    return { statusCode: 200, body: 'ignored: bad body' };
  }
  if (payload?.form_name !== FORM) return { statusCode: 200, body: 'ignored: other form' };

  const key = process.env.FLODESK_API_KEY;
  if (!key) {
    console.log('links-guide: FLODESK_API_KEY not set, submission kept in Netlify Forms only');
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

  try {
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
    const segments = await resolveSegments(headers);
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
        // Optional: create these in Flodesk (Audience → Custom fields) to see them on each subscriber.
        links_guide: guide,
        links_journey: String(d.journey || ''),
        links_timeline: String(d.timeline || ''),
        links_phone: String(d.phone || '').slice(0, 30),
        links_source: String(d.utm_source || 'links'),
        links_campaign: String(d.utm_campaign || ''),
      },
    };
    let res = await fetch(`${API}/subscribers`, { method: 'POST', headers, body: JSON.stringify(body) });
    if (res.status >= 400 && res.status < 500 && res.status !== 401 && res.status !== 403) {
      // Most likely a custom field that doesn't exist yet. Never lose the lead over it.
      console.log(`links-guide: upsert rejected status=${res.status}, retrying without custom fields`);
      delete body.custom_fields;
      res = await fetch(`${API}/subscribers`, { method: 'POST', headers, body: JSON.stringify(body) });
    }
    console.log(`links-guide: flodesk upsert status=${res.status} guide=${guide} segments=${ids.length}`);
  } catch (err) {
    console.log(`links-guide: flodesk sync failed (${err.name}); submission is still in Netlify Forms`);
  }
  return { statusCode: 200, body: 'ok' };
};
