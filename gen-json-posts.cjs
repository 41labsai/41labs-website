#!/usr/bin/env node
/**
 * gen-json-posts.cjs — generate static blog pages for posts that live ONLY in posts.json
 * (content is already HTML, so convert-posts.js's md2html would mangle them).
 * Uses the SAME page template as convert-posts.js so design/SEO/schema match exactly.
 * Skips slugs that already have a static blog/<slug>.html. Run convert-posts.js AFTER
 * this to refresh the blog listing + sitemap across all posts.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const BLOG_DIR = path.join(ROOT, 'blog');
const SITE_URL = 'https://41labs.ai';

const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'posts.json'), 'utf8'));
const posts = Array.isArray(raw) ? raw : raw.posts;

const escAttr = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escHtml = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function formatCategory(c) { return ({ 'ai-systems': 'AI Systems', automation: 'Automation', 'case-studies': 'Case Studies', insights: 'Insights' })[c] || (c || 'Insights'); }
function formatDate(d) { if (!d) return 'March 2026'; const dt = new Date(d + 'T00:00:00'); const m = ['January','February','March','April','May','June','July','August','September','October','November','December']; return `${m[dt.getMonth()]} ${dt.getFullYear()}`; }
function keywords(meta) {
  const kw = meta.keywords;
  if (Array.isArray(kw) && kw.length) return kw.join(', ');
  if (typeof kw === 'string' && kw.trim()) return kw;
  return (meta.title || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3).slice(0, 8).join(', ') + ', AI automation Singapore, 41 Labs';
}

function pageHtml(meta, bodyHtml) {
  const slug = meta.slug, title = meta.title, excerpt = meta.excerpt || '';
  const date = meta.date || '2026-02-01';
  const category = formatCategory(meta.category || 'insights');
  const readTime = meta.readTime || '5 min read';
  const author = meta.author || 'Alexander Lee';
  const kw = keywords(meta);
  const dateISO = date + 'T08:00:00+08:00';
  const url = `${SITE_URL}/blog/${slug}`;
  const wa = 'https://wa.me/6585123273?text=Hi%20Alexander%2C%20I%27m%20interested%20in%20AI%20automation%20for%20my%20business.%20Can%20we%20chat%3F';
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-VQQ49H8N1L"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-VQQ49H8N1L');
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO Meta Tags -->
    <title>${escHtml(title)} | 41 Labs</title>
    <meta name="description" content="${escAttr(excerpt)}">
    <meta name="keywords" content="${escAttr(kw)}">
    <meta name="author" content="${escAttr(author)}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <link rel="canonical" href="${url}">

    <!-- Geo Tags for Local SEO -->
    <meta name="geo.region" content="SG">
    <meta name="geo.placename" content="Singapore">
    <meta name="geo.position" content="1.3521;103.8198">
    <meta name="ICBM" content="1.3521, 103.8198">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${escAttr(title)} | 41 Labs">
    <meta property="og:description" content="${escAttr(excerpt)}">
    <meta property="og:image" content="${SITE_URL}/og-image.jpg">
    <meta property="og:site_name" content="41 Labs">
    <meta property="article:published_time" content="${dateISO}">
    <meta property="article:modified_time" content="${dateISO}">
    <meta property="article:author" content="https://www.linkedin.com/in/leejunweialexander/">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${url}">
    <meta name="twitter:title" content="${escAttr(title)} | 41 Labs">
    <meta name="twitter:description" content="${escAttr(excerpt)}">
    <meta name="twitter:image" content="${SITE_URL}/og-image.jpg">

    <!-- Favicons -->
    <link rel="icon" type="image/png" sizes="32x32" href="../logo-icon.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../logo-icon.png">
    <link rel="apple-touch-icon" href="../logo-icon.png">

    <!-- RSS Feed -->
    <link rel="alternate" type="application/rss+xml" title="41 Labs Blog" href="${SITE_URL}/feed.xml">

    <!-- Article Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": ${JSON.stringify(title)},
        "description": ${JSON.stringify(excerpt)},
        "image": "${SITE_URL}/og-image.jpg",
        "author": { "@type": "Person", "name": ${JSON.stringify(author)}, "jobTitle": "Founder & CEO", "url": "https://www.linkedin.com/in/leejunweialexander/" },
        "publisher": { "@type": "Organization", "name": "41 Labs", "logo": { "@type": "ImageObject", "url": "${SITE_URL}/logo-full.png" } },
        "datePublished": "${dateISO}",
        "dateModified": "${dateISO}",
        "mainEntityOfPage": { "@type": "WebPage", "@id": "${url}" }
    }
    </script>

    <!-- BreadcrumbList Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "${SITE_URL}/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "${SITE_URL}/blog" },
            { "@type": "ListItem", "position": 3, "name": ${JSON.stringify(title)} }
        ]
    }
    </script>

    <link rel="stylesheet" href="../styles.css?v=4">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WQJF7DK7');</script>
<!-- End Google Tag Manager -->
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WQJF7DK7"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container nav-container">
            <a href="../index.html" class="logo">
                <img src="../logo-nav.png?v=2" alt="41 Labs" class="logo-img" style="height: 60px;">
            </a>
            <ul class="nav-links">
                <li><a href="../index.html#what-we-do">What We Do</a></li>
                <li class="nav-dropdown-wrap">
                    <a href="#" class="nav-dropdown-trigger">Industries <span style="font-size:0.65em;opacity:0.7;">&#9662;</span></a>
                    <div class="nav-dropdown">
                        <a href="../industries/construction">Construction</a>
                        <a href="../industries/healthcare">Healthcare &amp; Clinics</a>
                        <a href="../industries/home-services">Home Services</a>
                        <a href="../industries/professional-services">Professional Services</a>
                        <a href="../industries/automotive">Automotive &amp; Tow Truck</a>
                        <a href="../industries/fnb">F&amp;B &amp; Restaurants</a>
                        <a href="../industries/beauty-wellness">Beauty &amp; Wellness</a>
                    </div>
                </li>
                <li><a href="../case-studies.html">Case Studies</a></li>
                <li><a href="../about.html">About</a></li>
                <li><a href="../index.html#faq">FAQ</a></li>
            </ul>
            <a href="${wa}" target="_blank" rel="noopener" class="btn btn-primary nav-cta">WhatsApp Us</a>
            <button class="mobile-menu-btn" aria-label="Toggle menu"><span></span><span></span><span></span></button>
        </div>
    </nav>

    <article class="post-article">
        <div class="container">
            <nav class="breadcrumb" aria-label="Breadcrumb">
                <ol itemscope itemtype="https://schema.org/BreadcrumbList">
                    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a itemprop="item" href="../index.html"><span itemprop="name">Home</span></a><meta itemprop="position" content="1"></li>
                    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a itemprop="item" href="../blog.html"><span itemprop="name">Blog</span></a><meta itemprop="position" content="2"></li>
                    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><span itemprop="name">${escHtml(title)}</span><meta itemprop="position" content="3"></li>
                </ol>
            </nav>
            <header class="post-header">
                <div class="post-meta">
                    <span class="post-category">${escHtml(category)}</span>
                    <span class="post-date">${formatDate(date)}</span>
                    <span class="post-read-time">${escHtml(readTime)}</span>
                </div>
                <h1>${escHtml(title)}</h1>
                <p class="post-excerpt">${escHtml(excerpt)}</p>
                <div class="post-author"><span>By <strong><a href="https://www.linkedin.com/in/leejunweialexander/" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">${escHtml(author)}</a></strong>, Founder, 41 Labs</span></div>
            </header>
            <div class="post-content">
                ${bodyHtml}
                <h2>Ready to Explore AI for Your Business?</h2>
                <p>Every business has operations that could run faster, cheaper, and more accurately with AI. The question is which ones — and whether the ROI justifies the investment. <strong>Book a free strategy call with 41 Labs.</strong> We will audit your current workflows and show you exactly where AI delivers the highest impact.</p>
                <p style="margin-top: 32px;"><a href="${wa}" class="btn btn-primary btn-large" target="_blank" rel="noopener">Book Your Free Strategy Call</a></p>
            </div>
        </div>
    </article>

    <section class="section cta-section">
        <div class="container">
            <div class="cta-content">
                <h2>Ready to implement AI in your business?</h2>
                <p>Book a discovery call. We'll show you exactly where AI can drive impact.</p>
                <a href="${wa}" class="btn btn-primary btn-large" target="_blank" rel="noopener">Book Your Discovery Call</a>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <img src="../logo-full.png" alt="41 Labs" class="footer-logo">
                    <p>Custom AI systems for revenue and operations.</p>
                    <div class="footer-contact"><a href="mailto:alexander@41labs.ai">alexander@41labs.ai</a><span>Singapore</span></div>
                </div>
                <div class="footer-links">
                    <a href="../index.html#what-we-do">What We Do</a>
                    <a href="${wa}" target="_blank" rel="noopener">WhatsApp Us</a>
                    <a href="../case-studies.html">Case Studies</a>
                    <a href="../about.html">About</a>
                    <a href="../privacy.html">Privacy</a>
                </div>
                <div class="footer-bottom"><p>&copy; 2026 41 Labs. All rights reserved.</p></div>
            </div>
        </div>
    </footer>
    <script src="../script.js"></script>
</body>
</html>`;
}

let created = 0;
for (const p of posts) {
  if (!p.slug) continue;
  const out = path.join(BLOG_DIR, `${p.slug}.html`);
  if (fs.existsSync(out)) continue; // preserve existing/hand-crafted
  if (!p.content) { console.log(`  skip (no content): ${p.slug}`); continue; }
  fs.writeFileSync(out, pageHtml(p, p.content));
  console.log(`  + blog/${p.slug}.html`);
  created++;
}
console.log(`\nGenerated ${created} blog pages from posts.json HTML content.`);
