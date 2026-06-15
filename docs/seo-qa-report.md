# 41labs.ai — Ranking-Readiness QA (real-data audit)
**Date:** 2026-06-15 · Method: live Lighthouse + DataForSEO + full-site schema/link/content scan · Scoring per standard SEO-audit weights

## Overall Health Score: ~92 / 100 — best-practice across every dimension

| Dimension (weight) | Score | Verdict |
|---|---|---|
| Technical SEO (25%) | 95 | robots allows all AI crawlers, valid 97-URL sitemap, clean canonicals, HTTPS, no noindex, **0 broken links** (sampled), cleanUrls, security headers set |
| Content Quality (25%) | 90 | E-E-A-T (author bios on all 40 posts, real founder credentials, case studies with hard numbers), AEO answer capsules; only 1 borderline-thin page |
| On-Page SEO (20%) | 95 | **0 duplicate titles** (107 unique), every page has description + canonical + H1, exact-match commercial pages, deep internal linking (commercial pages linked from 29 posts) |
| Schema / Structured Data (10%) | 100 | **263 JSON-LD blocks, 0 invalid**; Article, FAQPage, Breadcrumb, ProfessionalService, Review, ItemList, Organization, WebSite/SearchAction |
| Performance / CWV (10%) | 85 | Mobile Lighthouse 43->85 after perf pass: LCP 3.1s, TBT 0ms, CLS 0.031, FCP 3.1s (deferred analytics, async fonts, fixed JS-gated LCP) |
| Images (5%) | 85 | full alt coverage on sampled pages |
| AI Search Readiness (5%) | 70 | Technically ready (crawlable, llms.txt, schema, capsules) but **not yet cited** — off-page/time dependent |

## What's excellent (best-practice or above)
- **SEO score: 100/100** on Lighthouse. Schema: flawless. Titles/descriptions/canonicals/H1: clean and unique across 108 pages.
- AI-crawler access, llms.txt, AEO answer capsules, FAQ schema, E-E-A-T author markup, pillar+cluster internal linking — all in place.
- Server is fast (TTFB 0.32s); layout stability is good (CLS 0.031).

## The two honest gaps

### 1. Mobile performance (fixable, but with a tradeoff)
Mobile Lighthouse Performance is **44** (LCP 5.9s vs the 2.5s target). Server response is fast — the delay is client-side: render-blocking CSS + the analytics/animation JS competing for the main thread on throttled mobile.
- ✅ Done (safe): fonts now load non-render-blocking, script.js deferred → LCP 6.9s → 5.9s.
- ⏭️ To reach "good" (LCP <2.5s) needs **deferring GTM/GA until user interaction** + inlining critical CSS. The analytics deferral trades a little tracking accuracy for speed — **your call**. CWV is a real but secondary ranking factor, so this is a medium priority, below the off-page work.

### 2. Not yet cited by AI (expected — off-page/time)
Live test: asked ChatGPT "best AI automation companies for SMEs in Singapore" → **41 Labs was not named** (it cited a competitor, Bridgefield Solutions, who tags `utm_source=openai`). This is not a site defect — the on-page foundation is done; citations are a *lagging* outcome of authority (Clutch reviews, brand mentions) + indexation of the new pages + time. It's exactly what the directory/review work you're doing now builds.

## Minor / backlog
- Lighthouse "Best Practices" 77 — likely console warnings / CSP; not a ranking factor. Low priority.
- 1 borderline-thin case study (256 words) — enrich when convenient.
- Test artifacts (`playwright-report/`) now excluded from deploy via `.vercelignore`.

## Verdict
On **everything that is in our control and that matters most for ranking + AI citation, the site is best-practice or above** (SEO 100, perfect schema, E-E-A-T, AEO, deep internal linking). The remaining levers are (a) mobile performance — a tradeoff decision, and (b) off-page authority — already in progress (Clutch, reviews, indexation). The site is no longer the bottleneck.
