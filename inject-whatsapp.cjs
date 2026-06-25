#!/usr/bin/env node
/**
 * inject-whatsapp.cjs — standardize the company WhatsApp number to 6580124848 (the 41 Closer
 * bot line — all public WhatsApp routes to the bot) and add a clear floating WhatsApp button
 * (idempotent) to every public page that lacks one.
 */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const WA = '6580124848';
const OLD = ['6597848886', '6585123273'];
const HREF = `https://wa.me/${WA}?text=` + encodeURIComponent("Hi 41 Labs, I'd like to talk about AI for my business.");

const EXCLUDE = new Set(['admin.html', 'dashboard.html', 'brandbook.html', '404.html', 'post.html', 'case-study.html']);

const FLOAT = `
    <!-- Floating WhatsApp button (auto-injected) -->
    <a class="wa-float" href="${HREF}" target="_blank" rel="noopener" aria-label="Message 41 Labs on WhatsApp">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.728-.957zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
    </a>
    <style>
        .wa-float { position:fixed; bottom:24px; right:24px; width:60px; height:60px; background:#25D366; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 22px rgba(37,211,102,0.5); z-index:9999; transition:transform .2s ease; animation:wa-pulse 2.4s infinite; }
        .wa-float:hover { transform:scale(1.08); }
        @keyframes wa-pulse { 0%{box-shadow:0 6px 22px rgba(37,211,102,0.5),0 0 0 0 rgba(37,211,102,0.45);} 70%{box-shadow:0 6px 22px rgba(37,211,102,0.5),0 0 0 16px rgba(37,211,102,0);} 100%{box-shadow:0 6px 22px rgba(37,211,102,0.5),0 0 0 0 rgba(37,211,102,0);} }
        @media (max-width:640px){ .wa-float{ width:54px; height:54px; bottom:18px; right:18px; } }
    </style>
`;

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) { if (['node_modules', '.vercel', '.git', 'api', 'tests'].includes(e.name)) continue; walk(fp, acc); }
    else if (e.name.endsWith('.html')) acc.push(fp);
  }
  return acc;
}

let numFix = 0, injected = 0;
for (const fp of walk(ROOT)) {
  const base = path.basename(fp);
  let html = fs.readFileSync(fp, 'utf-8');
  const before = html;
  for (const o of OLD) if (html.includes(o)) { html = html.split(o).join(WA); numFix++; }
  if (!EXCLUDE.has(base) && !html.includes('wa-float') && html.includes('</body>')) {
    html = html.replace('</body>', `${FLOAT}</body>`);
    injected++;
  }
  if (html !== before) fs.writeFileSync(fp, html);
}
console.log(`Number standardized in ${numFix} file(s). Floating button injected into ${injected} page(s).`);
