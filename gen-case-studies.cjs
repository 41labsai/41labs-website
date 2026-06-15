#!/usr/bin/env node
/**
 * gen-case-studies.cjs — static, crawlable case-study pages at /case-studies/<slug>.
 * case-study.html was JS-rendered (fetch case-studies.json -> innerHTML), invisible to
 * AI/search crawlers. Their quantified results are highly citable. Matches site shell.
 */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const OUT = path.join(ROOT, 'case-studies');
const SITE = 'https://41labs.ai';
const WA = 'https://wa.me/6585123273?text=Hi%20Alexander%2C%20I%27m%20interested%20in%20AI%20automation%20for%20my%20business.%20Can%20we%20chat%3F';

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escA = (s) => esc(s).replace(/"/g, '&quot;');

function page(c) {
  const url = `${SITE}/case-studies/${c.slug}`;
  const desc = `${c.challenge} ${c.client ? '— ' + c.client : ''}`.slice(0, 160);
  const results = Array.isArray(c.results) ? c.results : [];
  const schemas = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: c.title, description: c.challenge || '', about: c.industry, author: { '@type': 'Organization', name: '41 Labs' }, publisher: { '@type': 'Organization', name: '41 Labs', url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}/logo-full.png` } }, mainEntityOfPage: url },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [ { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` }, { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${SITE}/case-studies` }, { '@type': 'ListItem', position: 3, name: c.title } ] }
  ];
  if (c.testimonial) schemas.push({ '@context': 'https://schema.org', '@type': 'Review', itemReviewed: { '@type': 'Organization', name: '41 Labs' }, reviewBody: c.testimonial, author: { '@type': 'Person', name: (c.testimonialAuthor || 'Client').split(',')[0] }, reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' } });
  const schemaBlocks = schemas.map(s => `    <script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n    </script>`).join('\n');
  const resultsHtml = results.length ? `<div class="case-study-results-box"><h3>Key Results</h3><div class="results-list">${results.map(r => `<div class="result-item">${esc(r)}</div>`).join('')}</div></div>` : '';
  const testimonialHtml = c.testimonial ? `<div class="case-study-testimonial"><blockquote>"${esc(c.testimonial)}"</blockquote><cite>&mdash; ${esc(c.testimonialAuthor || '')}</cite></div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-VQQ49H8N1L"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-VQQ49H8N1L');</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escA(c.title)} | 41 Labs Case Study</title>
    <meta name="description" content="${escA(desc)}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <link rel="canonical" href="${url}">
    <meta name="geo.region" content="SG"><meta name="geo.placename" content="Singapore">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${escA(c.title)} | 41 Labs">
    <meta property="og:description" content="${escA(desc)}">
    <meta property="og:image" content="${SITE}/og-image.jpg">
    <meta property="og:site_name" content="41 Labs">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" type="image/png" sizes="32x32" href="../logo-icon.png">
    <link rel="apple-touch-icon" href="../logo-icon.png">
${schemaBlocks}
    <link rel="stylesheet" href="../styles.css?v=4">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WQJF7DK7');</script>
</head>
<body>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WQJF7DK7" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <nav class="navbar">
        <div class="container nav-container">
            <a href="../index.html" class="logo"><img src="../logo-nav.png?v=2" alt="41 Labs" class="logo-img" style="height: 60px;"></a>
            <ul class="nav-links">
                <li><a href="../index.html#what-we-do">What We Do</a></li>
                <li><a href="../case-studies.html">Case Studies</a></li>
                <li><a href="../about.html">About</a></li>
                <li><a href="../blog.html">Blog</a></li>
            </ul>
            <a href="${WA}" target="_blank" rel="noopener" class="btn btn-primary nav-cta">WhatsApp Us</a>
            <button class="mobile-menu-btn" aria-label="Toggle menu"><span></span><span></span><span></span></button>
        </div>
    </nav>

    <article class="case-study-article">
        <div class="container">
            <nav class="breadcrumb" aria-label="Breadcrumb">
                <ol><li><a href="../index.html">Home</a></li><li><a href="../case-studies.html">Case Studies</a></li><li>${esc(c.title)}</li></ol>
            </nav>
            <header class="case-study-header">
                <div class="case-study-meta">
                    <span class="case-study-industry">${esc(c.industry || '')}</span>
                    <span class="case-study-location">${esc(c.location || '')}</span>
                </div>
                <h1>${esc(c.title)}</h1>
                <p class="case-study-client">${esc(c.client || '')}</p>
            </header>
            ${resultsHtml}
            <div class="case-study-content">
                ${c.challenge ? `<h2>The Challenge</h2><p>${esc(c.challenge)}</p>` : ''}
                ${c.solution ? `<h2>The Solution</h2><p>${esc(c.solution)}</p>` : ''}
                ${c.content || ''}
            </div>
            ${testimonialHtml}
            <div class="case-study-cta">
                <h3>Want similar results?</h3>
                <p>Tell us your biggest operational bottleneck on WhatsApp. We'll map the highest-ROI AI opportunity and build a working prototype before you pay anything.</p>
                <a href="${WA}" class="btn btn-primary btn-large" target="_blank" rel="noopener">Message 41 Labs on WhatsApp</a>
            </div>
        </div>
    </article>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand"><img src="../logo-full.png" alt="41 Labs" class="footer-logo"><p>Custom AI systems for revenue and operations.</p><div class="footer-contact"><a href="mailto:alexander@41labs.ai">alexander@41labs.ai</a><span>Singapore</span></div></div>
                <div class="footer-links"><a href="../index.html#what-we-do">What We Do</a><a href="${WA}" target="_blank" rel="noopener">WhatsApp Us</a><a href="../case-studies.html">Case Studies</a><a href="../about.html">About</a><a href="../privacy.html">Privacy</a></div>
            </div>
            <div class="footer-bottom"><p>&copy; 2026 41 Labs. All rights reserved.</p></div>
        </div>
    </footer>
    <script src="../script.js"></script>
</body>
</html>`;
}

const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'case-studies.json'), 'utf8'));
const studies = Array.isArray(raw) ? raw : (raw.caseStudies || raw.case_studies || raw.studies || Object.values(raw).find(Array.isArray));
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
let n = 0;
for (const c of studies) { if (!c.slug) continue; fs.writeFileSync(path.join(OUT, `${c.slug}.html`), page(c)); console.log(`  + case-studies/${c.slug}.html`); n++; }
console.log(`\n${n} static case-study pages.`);
