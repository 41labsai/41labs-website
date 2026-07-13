# 41labs.ai — SEO / GEO Audit
**Date:** 2026-07-13 · Live data: GSC, gpt-4o web search, Lighthouse, direct crawl. This is a *current-state* audit — measures whether the July 8-9 work landed and what's next.

## Overall: 78/100 — healthy and climbing, GEO is the gap
| Dimension | Score | One-line |
|---|---|---|
| Technical | 88/100 | All core pages 200, rich schema, AI bots allowed. One real perf bug (1.2MB icons). |
| On-page SEO | 90/100 | Strong titles/H1/schema across money pages + pillar. |
| Rankings (SEO) | 75/100 | **Climbing fast** — impressions 2×, avg pos 16.3→13.4 in a week. Still few clicks (young). |
| GEO / AI citation | 40/100 | **Still 0/5.** Pages exist + bots allowed, but no third-party authority yet. The bottleneck. |

## ✅ What's working (the July 8-9 work landed)
- **Impressions doubled in 7 days:** 1,341 → **2,879**. Avg position **16.3 → 13.4**.
- **The #1 lever moved:** `/blog/best-ai-consulting-singapore` went **pos 37 → 16.1** (399 impr). On track for page 1.
- **New pillar indexed fast:** `/conversational-ai-singapore` already ranks pos 14.5 (built 4 days ago).
- **`/whatsapp-ai-chatbot`** pos 11.3, **`/41-closer`** pos 5.2, **whatsapp-business-api guide** pos 13.8 (197 impr).
- Technical foundation excellent: single H1, Organization + WebSite + ProfessionalService + FAQ schema, 133-URL sitemap (lastmod 2026-07-09), robots allows GPTBot/ClaudeBot/PerplexityBot/OAI-SearchBot/Google-Extended, llms.txt present.
- Lighthouse: **SEO 100, Best-practices 100, Accessibility 94.**

## 🔴 Issues, prioritized

### P1 — Performance: giant icon files (real, easy fix)
- `logo-icon.png` and `favicon.png` are **1,273 KB each**; `logo-full.png` is 286 KB. A favicon should be <10KB.
- Lighthouse Performance **70**, LCP inflated (12.3s on throttled mobile — partly test throttling, but the 1.2MB icons are real dead weight on every page).
- **Fix:** compress `logo-icon.png`/`favicon.png` to proper 32×32 / 48×48 (<10KB), and serve `logo-full.png` as WebP. One afternoon, sitewide win. → *I can do this now, solo.*

### P1 — GEO: 0/5 AI citations (the real ceiling)
- Re-ran the buyer-question baseline: **41 Closer still cited 0/5.** AI names Moshee, Omnichat, AiChat, WIZ.AI instead.
- Root cause unchanged: on-page is done, but **authority + third-party mentions are missing** (7 referring domains vs competitors' 88-102). AI cites indexed, trusted, listicle-referenced vendors.
- **Fix:** execute the outreach pack (`2026-07-09-closer-outreach-pack.md`) — get named in outrankco.sg / otg-lab.com listicles + G2/Capterra/Clutch. → *Drafted; needs user to send.*
- **Also:** the Perplexity API key is 401/expired — fix it so we can track a second major GEO surface.

### P2 — Clicks lag rankings (expected, monitor)
- 2,879 impressions but only 39 clicks (7d). Positions are still mostly page-2 (11-16), where CTR is near zero. This resolves itself as the pages climb to page 1 — no action beyond continuing the push.

### P3 — Keep feeding the winners
- Comparison pages rank pos 3-7 (the proven moat). Publish more per the content calendar (1-2/week).
- `/conversational-ai-singapore` at 14.5 is new — a few internal links + time should climb it.

## Next moves (leverage order)
1. **Compress the 1.2MB icons** (solo, today) — sitewide perf.
2. **Send the outreach pack** (user) — the only thing that moves GEO 0/5.
3. **Fix Perplexity key** (quick) — restore GEO tracking.
4. **Re-run this audit in 2 weeks** — watch consulting page hit page 1 + GEO move off zero.

## Verdict
The site is **fundamentally healthy and the recent work is clearly working** (impressions 2×, key page 37→16 in a week). SEO will keep climbing on its own. The single thing holding 41 Closer back from AI recommendations is **off-page authority** — which is outreach execution, not more building. Don't build more pages right now; get the ones you have cited.
