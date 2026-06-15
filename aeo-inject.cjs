#!/usr/bin/env node
/**
 * aeo-inject.cjs — add an AEO answer capsule (40–60 word direct answer) + FAQPage schema to
 * the cost/consulting blog posts 41 Labs already gets cited for in AI search (per Bing report).
 * Idempotent: skips a post if the capsule is already present.
 */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

const POSTS = {
  'how-much-does-custom-ai-cost': {
    capsule: "Custom AI in Singapore typically costs <strong>S$7,000–S$25,000 per project</strong> for SMEs working with a specialist build firm. Off-the-shelf tools run S$50–S$500/month; enterprise consultancies charge S$50,000–S$500,000+. The <strong>Enterprise Development Grant (EDG)</strong> covers up to 50% of qualifying costs (up to 70% for eligible SMEs) — and a working prototype on your own data should come <em>before</em> any large commitment.",
    faqs: [
      ['How much does custom AI cost in Singapore?', 'Custom AI for SMEs in Singapore typically costs S$7,000–S$25,000 per project with a specialist firm like 41 Labs. Off-the-shelf tools run S$50–S$500/month; large consultancies charge S$50,000–S$500,000+. The EDG grant covers up to 50% of qualifying costs (up to 70% for eligible SMEs).'],
      ['What drives the cost of a custom AI project?', 'Cost is driven by scope (how many workflows), integration complexity (connecting to your CRM/ERP/accounting tools), data quality, and the level of accuracy required. A single focused automation sits at the lower end; multi-system, mission-critical builds sit higher.'],
      ['Is custom AI worth it versus off-the-shelf tools?', 'For standard, simple workflows, off-the-shelf tools are cheaper to start. For complex processes with your own pricing rules, documents, or data, custom AI usually pays back faster because it actually fits — one automated workflow often saves 15+ hours per week, recovering the project cost within 3–6 months.'],
      ['Does the EDG grant cover custom AI development?', "Yes. Singapore's Enterprise Development Grant covers up to 50% of qualifying AI project costs (up to 70% for eligible SMEs). Businesses must be registered and operating in Singapore with at least 30% local shareholding. 41 Labs helps clients with the application."],
      ['Should I pay before seeing the AI work?', 'No. A reputable partner builds a working prototype on your real data first. 41 Labs delivers a prototype in about 2 weeks — if it does not show clear value, you owe nothing.'],
    ],
  },
  'ai-automation-cost-singapore-pricing-guide': {
    capsule: "AI automation in Singapore costs <strong>S$7,000–S$25,000</strong> for a custom SME project, <strong>S$50–S$500/month</strong> for off-the-shelf tools, and <strong>S$50,000+</strong> for enterprise consultancy work. The <strong>EDG grant</strong> offsets up to 50% (70% for qualifying SMEs). Most SMEs reach ROI within <strong>3–6 months</strong>, since one automated workflow often saves 15+ hours a week.",
    faqs: [
      ['How much does AI automation cost in Singapore?', 'AI automation in Singapore ranges from S$50–S$500/month for off-the-shelf tools to S$7,000–S$25,000 for a custom SME project, and S$50,000+ for enterprise consultancy work. The EDG grant covers up to 50% of qualifying costs (up to 70% for eligible SMEs).'],
      ['What is the cheapest way to start with AI automation?', 'The cheapest start is a single, high-pain workflow — usually quoting, document processing, or customer replies. Proving ROI on one process first keeps the initial cost low and funds the next automation from the savings.'],
      ['How much can AI automation save a Singapore business?', 'A business spending 20 hours a week on manual quoting, data entry, or document processing can typically recover 15+ hours. At Singapore loaded labour costs, that is roughly S$19,500–S$39,000 saved per year — usually more than the project cost.'],
      ['Does the EDG grant cover AI automation?', 'Yes. The Enterprise Development Grant covers up to 50% of qualifying AI automation costs (up to 70% for eligible SMEs), administered by Enterprise Singapore. 41 Labs supports the application.'],
      ['How long until AI automation pays for itself?', 'Most Singapore SMEs reach payback within 3–6 months for a focused custom automation. After payback, the savings compound every month.'],
    ],
  },
};

function inject(slug, data) {
  const fp = path.join(ROOT, 'blog', `${slug}.html`);
  if (!fs.existsSync(fp)) { console.log(`  skip (missing): ${slug}`); return; }
  let html = fs.readFileSync(fp, 'utf-8');
  if (html.includes('aeo-capsule')) { console.log(`  skip (already done): ${slug}`); return; }

  // 1) answer capsule right after the post-content opens
  const capsule = `\n                <div class="aeo-capsule" style="background:rgba(74,222,128,0.07);border-left:3px solid #4ade80;border-radius:10px;padding:20px 24px;margin:0 0 28px;font-size:1.02rem;line-height:1.7;">${data.capsule}</div>`;
  html = html.replace(/(<div class="post-content">)/, `$1${capsule}`);

  // 2) FAQPage schema before </head>
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: data.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
  const block = `    <script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 2)}\n    </script>\n</head>`;
  html = html.replace('</head>', block);

  fs.writeFileSync(fp, html);
  console.log(`  + AEO capsule + FAQPage schema -> blog/${slug}.html`);
}

for (const [slug, data] of Object.entries(POSTS)) inject(slug, data);
console.log('AEO pass done.');
