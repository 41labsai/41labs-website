// POST /api/audit
// Captures a free-AI-audit lead into Twenty CRM (Person + linked Opportunity)
// and fires a Telegram "speed-to-lead" ping so the founder can reply in minutes.
// Runs server-side so TWENTY_API_KEY / TELEGRAM token are never exposed.
// Best-effort: a failure in any step never blocks the visitor from seeing results.

const TWENTY_BASE = process.env.TWENTY_BASE_URL || 'https://twenty-server-production-bb71.up.railway.app';
const TWENTY_KEY = process.env.TWENTY_API_KEY;
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT = process.env.TELEGRAM_GROUP_ID;
const TG_THREAD = process.env.TELEGRAM_INBOX_THREAD_ID; // optional topic thread

function readBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body);
    let raw = '';
    req.on('data', (c) => { raw += c; if (raw.length > 1e6) req.destroy(); });
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); } });
    req.on('error', () => resolve({}));
  });
}

const clean = (v) => (typeof v === 'string' ? v.trim().slice(0, 2000) : (typeof v === 'number' ? v : ''));

function splitName(full) {
  const parts = String(full || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: '', lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

// Singapore-first phone normalisation. Keeps digits; defaults to +65 unless a + prefix is given.
function normPhone(raw) {
  const s = String(raw || '').trim();
  if (!s) return null;
  if (s.startsWith('+')) {
    const m = s.match(/^\+(\d{1,3})[\s-]?(.*)$/);
    if (m) return { primaryPhoneNumber: m[2].replace(/\D/g, ''), primaryPhoneCallingCode: `+${m[1]}`, primaryPhoneCountryCode: '' };
  }
  return { primaryPhoneNumber: s.replace(/\D/g, ''), primaryPhoneCallingCode: '+65', primaryPhoneCountryCode: 'SG' };
}

async function twenty(path, record) {
  const r = await fetch(`${TWENTY_BASE}/rest/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TWENTY_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  const txt = await r.text();
  let json = null; try { json = JSON.parse(txt); } catch {}
  const created = json && json.data ? (Array.isArray(json.data) ? json.data[0] : Object.values(json.data)[0]) : null;
  return { ok: r.ok, status: r.status, id: created && created.id ? created.id : null, detail: txt.slice(0, 300) };
}

async function tgNotify(text) {
  if (!TG_TOKEN || !TG_CHAT) return;
  try {
    const payload = { chat_id: TG_CHAT, text, parse_mode: 'HTML', disable_web_page_preview: true };
    if (TG_THREAD) payload.message_thread_id = Number(TG_THREAD);
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
  } catch {}
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') { res.statusCode = 405; return res.end(JSON.stringify({ ok: false, error: 'method_not_allowed' })); }

  const body = await readBody(req);
  if (clean(body._gotcha) || clean(body.hp)) { res.statusCode = 200; return res.end(JSON.stringify({ ok: true, skipped: 'bot' })); }

  const fullName = clean(body.name);
  const email = clean(body.email);
  const phone = clean(body.phone) || clean(body.whatsapp);
  const company = clean(body.company);
  const url = clean(body.url) || clean(body.website);
  const score = clean(body.score);
  const savings = Number(String(body.savings || '').replace(/[^\d.]/g, '')) || 0;

  // Need at least one way to reach them.
  if (!email && !phone) { res.statusCode = 400; return res.end(JSON.stringify({ ok: false, error: 'missing_contact' })); }
  if (!TWENTY_KEY) { res.statusCode = 200; return res.end(JSON.stringify({ ok: false, error: 'crm_not_configured' })); }

  const label = company || url || email || 'Unknown';
  const scoreStr = score ? ` · score ${score}` : '';
  let personId = null, oppId = null, err = null;

  try {
    // 1) Person (contact) — enum-free, always safe. This is the lead we must never lose.
    const person = { name: splitName(fullName || label) };
    if (email) person.emails = { primaryEmail: email };
    const ph = normPhone(phone); if (ph) person.phones = ph;
    person.jobTitle = 'AI Audit lead';
    const pr = await twenty('people', person);
    if (pr.ok) personId = pr.id; else err = `person ${pr.status}: ${pr.detail}`;

    // 2) Opportunity — the deal. Links back to the person.
    const opp = { name: `AI Audit — ${label}${scoreStr}`, stage: 'NEW', leadSource: 'Website · AI Audit' };
    if (personId) opp.pointOfContactId = personId;
    if (savings > 0) opp.amount = { amountMicros: Math.round(savings * 1_000_000), currencyCode: 'SGD' };
    const or = await twenty('opportunities', opp);
    if (or.ok) oppId = or.id; else err = (err ? err + ' | ' : '') + `opp ${or.status}: ${or.detail}`;
  } catch (e) {
    err = String(e).slice(0, 200);
  }

  // 3) Speed-to-lead ping (never blocks). Also a backup capture if the CRM write failed.
  await tgNotify(
    `🟢 <b>New AI Audit lead</b>\n<b>${label}</b>${scoreStr}\n` +
    (fullName ? `Name: ${fullName}\n` : '') +
    (email ? `Email: ${email}\n` : '') +
    (phone ? `Phone: ${phone}\n` : '') +
    (url ? `Site: ${url}\n` : '') +
    (savings ? `Est. savings: S$${savings.toLocaleString()}\n` : '') +
    `⚡ Reply within 5 minutes.` +
    (err ? `\n⚠️ CRM: ${err}` : '')
  );

  res.statusCode = 200;
  return res.end(JSON.stringify({ ok: !!(personId || oppId), personId, oppId, error: err || undefined }));
};
