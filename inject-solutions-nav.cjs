#!/usr/bin/env node
/**
 * inject-solutions-nav.cjs — add a "Solutions" dropdown to the top nav site-wide so the
 * commercial pages are one hover from the top of every page (mirrors the Industries dropdown).
 * Idempotent. Uses absolute URLs so it works at any path depth.
 */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

const DROPDOWN = `<ul class="nav-links">
                <li class="nav-dropdown-wrap">
                    <a href="#" class="nav-dropdown-trigger">Solutions <span style="font-size:0.65em;opacity:0.7;">&#9662;</span></a>
                    <div class="nav-dropdown">
                        <a href="/ai-automation-agency-singapore">AI Automation Agency</a>
                        <a href="/ai-development-company-singapore">AI Development Company</a>
                        <a href="/ai-sales-agent-singapore">AI Sales Agent</a>
                        <a href="/ai-for-ecommerce">AI for Ecommerce</a>
                        <a href="/whatsapp-ai-chatbot">WhatsApp AI Chatbot</a>
                        <a href="/ai-appointment-booking">AI Appointment Booking</a>
                        <a href="/services/ai-consulting">AI Consulting</a>
                    </div>
                </li>`;

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (['node_modules', '.vercel', '.git', 'api', 'docs', 'playwright-report', '.playwright-mcp', 'tests', 'test-results'].includes(e.name)) continue; walk(p, acc); }
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

let done = 0, skip = 0;
for (const fp of walk(ROOT)) {
  let html = fs.readFileSync(fp, 'utf-8');
  if (html.includes('nav-dropdown-trigger">Solutions')) { skip++; continue; }
  if (!html.includes('<ul class="nav-links">')) { skip++; continue; }
  html = html.replace('<ul class="nav-links">', DROPDOWN);
  fs.writeFileSync(fp, html);
  done++;
}
console.log(`Solutions dropdown added to ${done} pages (${skip} skipped).`);
