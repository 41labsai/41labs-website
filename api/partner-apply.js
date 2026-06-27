// POST /api/partner-apply
// Creates a Partner record in Twenty CRM from the /partners application form.
// Runs server-side so TWENTY_API_KEY is never exposed to the browser.
// Best-effort: the form also posts to Formspree for the email copy, so a failure
// here never loses the lead.

const TWENTY_BASE = process.env.TWENTY_BASE_URL || 'https://twenty-server-production-bb71.up.railway.app';
const TWENTY_KEY = process.env.TWENTY_API_KEY;

function readBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body);
    let raw = '';
    req.on('data', (c) => { raw += c; if (raw.length > 1e6) req.destroy(); });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

const clean = (v) => (typeof v === 'string' ? v.trim().slice(0, 2000) : '');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ ok: false, error: 'method_not_allowed' }));
  }

  const body = await readBody(req);

  // honeypot — bots fill hidden fields; pretend success and skip
  if (clean(body._gotcha) || clean(body.website)) {
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: true, skipped: 'bot' }));
  }

  const name = clean(body.name);
  const email = clean(body.email);
  const whatsapp = clean(body.whatsapp);
  if (!name || (!email && !whatsapp)) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ ok: false, error: 'missing_fields' }));
  }

  if (!TWENTY_KEY) {
    // not configured — don't fail the user, the Formspree email still went out
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: false, error: 'crm_not_configured' }));
  }

  const record = {
    name,
    company: clean(body.company),
    email,
    phone: whatsapp,
    partnerType: clean(body.partner_type),
    audienceSize: clean(body.audience_size),
    notes: clean(body.message),
    status: 'APPLICANT',
  };

  try {
    const r = await fetch(`${TWENTY_BASE}/rest/partners`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TWENTY_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
    });
    if (!r.ok) {
      const txt = await r.text();
      res.statusCode = 200; // best-effort; lead is safe via email
      return res.end(JSON.stringify({ ok: false, error: 'crm_error', status: r.status, detail: txt.slice(0, 300) }));
    }
    const data = await r.json();
    const created = data && data.data ? Object.values(data.data)[0] : null;
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: true, id: created && created.id ? created.id : null }));
  } catch (e) {
    res.statusCode = 200; // never block the applicant
    return res.end(JSON.stringify({ ok: false, error: 'exception', detail: String(e).slice(0, 200) }));
  }
};
