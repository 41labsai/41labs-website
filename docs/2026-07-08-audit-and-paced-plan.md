# 41labs.ai — Fresh Audit + Paced Action Plan
**Date:** 2026-07-08 · **Owner:** Alexander · **Prepared by:** Claude (Opus)
**Scope:** entire 41labs.ai domain (main site + 41 Closer pages)

This replaces the stale **2026-03-23** audit (`research/geo-audit-41labs.md`, `research/seo-technical-audit-41labs.md`), which described a site that no longer exists (it reported "no blog posts" and "phantom URLs"; the site now has 67 live blog posts, 6 country pages, and a 133-URL sitemap).

---

## PART A — Fresh Independent Audit (the "double the feedback" pass)

### What changed since the March audit (verified against live + repo, 2026-07-08)
| March 2026 finding | Status now |
|---|---|
| "Blog shows *No posts yet*" (0 posts) | ✅ FIXED — 67 static blog posts live |
| "30+ empty JS-shell pages, invisible to crawlers" | ✅ FIXED — posts are static HTML with full content + schema |
| "Sitemap has ~30 phantom URLs" | ✅ MOSTLY FIXED — sitemap now 133 real URLs (verify no 404s remain — see A.1) |
| "llms.txt returns 404" | ⚠️ RE-CHECK — confirm `/llms.txt` now serves (see A.2) |
| "Testimonials loaded via client-side JS (invisible)" | ⚠️ RE-CHECK on homepage |
| "6 top-demand blog URLs are 404" (found 2026-07-02) | ✅ FIXED — recreated, all 200 |
| "Zero content images / graphs in blog" | ✅ FIXED THIS SESSION — 67 hero images + charts/tables added |
| "Boilerplate-only internal links" | ✅ FIXED THIS SESSION — contextual in-body links per link-map |

### A.1 Technical SEO — re-verify checklist
- [ ] Crawl the 133 sitemap URLs for any remaining 404/redirect (was the #1 March failure).
- [ ] Confirm `cleanUrls:true` canonical form is consistent (no `/x.html` vs `/x` split).
- [ ] Security headers (March flagged missing CSP/HSTS/X-Frame) — confirm in `vercel.json` headers block.
- [ ] Core Web Vitals field data (CrUX) now that real content + images exist — the new hero images are WebP ~33KB, `loading="eager"` on hero only (good), body images lazy.

### A.2 GEO / AI-citability
- [ ] `/llms.txt` present and current (March = 404).
- [ ] Answer-capsule (`.aeo-capsule`) present on all money pages, not just blog.
- [ ] FAQ schema coverage across the 41 Closer comparison pages.
- **Known moat (GSC-proven):** literal ChatGPT-style question queries already rank pos 5-12. Keep making comparison + Q&A content — competitors' generic pages lack it.

### A.3 Content / E-E-A-T
- Author box + `Person` schema present on posts (good). Alexander Lee bylines wired.
- **Gap (your note #6):** posts are competent but generic-voiced — they lack first-person founder insight ("here's what I've actually seen"). See Plan item 6.

### A.4 Internal linking + keyword mapping
- **DONE this session:** 67-post link map built and applied. Equity funnels to money pages: `/services/ai-consulting` (27 inbound), `/41-closer` (20), `/whatsapp-ai-chatbot` (20), `/ai-development-company-singapore` (17), `/ai-automation-agency-singapore` (14).
- **Keyword→URL map:** the demand-validated cluster (from GSC) is "AI consulting Singapore." The map + fixed pages target it. 41 Closer cluster is greenfield — build from the DataForSEO plan.

---

## PART B — Paced Execution Roadmap (your 9 notes)

Pace: **1–2 publishes/week** (your call — conservative, avoids a content-spike pattern on a young-ish site).
Tags: **P** priority (1=now, 2=this week, 3=this month) · **Effort** · **Owner** · **Safe today?** = can I do it now without a judgment call from you.

| # | Note | What it means | P | Effort | Owner | Safe today? |
|---|---|---|---|---|---|---|
| 1 | Internal linking | Contextual in-body links, equity to money pages | 1 | done | Claude | ✅ DONE (in review) |
| 2 | Recrawl | Resubmit sitemap to GSC + IndexNow ping after changes deploy | 1 | S | Claude | ⚠️ after deploy |
| 3 | Photos + graphs to blog | Hero image + chart/table per post | 1 | done | Claude | ✅ DONE (in review) |
| 4 | Keyword research + mapping | GSC-validated keyword→URL map | 2 | M | Claude | ✅ can produce doc |
| 5 | Pace releases | Don't publish too fast; 1–2/wk calendar | 2 | S | Claude | ✅ build calendar |
| 6 | More unique insights (my POV) | Inject first-person founder voice into top posts | 2 | M | You + Claude | 🔶 needs your input |
| 7 | Country pages localise | Per-country images + localized content | 2 | L | Claude | 🔶 partial — needs your steer |
| 8 | Do PR | Press + authoritative backlinks | 3 | L | You + Claude | 🔶 needs outreach approval |
| 9 | Audit (this doc) | Fresh independent audit | 1 | done | Claude | ✅ DONE |

### Item 2 — Recrawl (do right after the links+images deploy)
- Resubmit `sitemap.xml` in GSC.
- Fire IndexNow for changed URLs (Bing key `a1b2c3d4...txt` exists in repo — confirm live).
- Update `<lastmod>` on the 67 changed posts in the sitemap so crawlers see freshness.

### Item 5 — Paced content calendar (1–2/week)
- **Do NOT bulk-republish all 67 at once.** They already exist; the edits are enhancements, so this is lower-risk than net-new pages — but new posts going forward = max 2/week.
- Next net-new content should target proven-demand gaps in the "AI consulting Singapore" cluster and the greenfield 41 Closer cluster.

### Item 6 — Unique founder insight (needs you)
For the top 8–10 posts by impressions, add a short first-person block: a real number, a client moment, a contrarian take only you can make. I'll draft from your existing decks/notes, you approve/correct. **This is the single highest E-E-A-T lever and the one I can't fully do without you.**

### Item 7 — Country pages localisation (needs your steer)
6 country pages exist (SG, MY, ID, TH, VN, PH). Currently near-templated. Localise: swap hero imagery per country, add country-specific proof/examples, local grant/regulation references, local currency. Needs your call on how deep per market.

### Item 8 — PR (needs outreach approval)
Repo already has `BACKLINK-OUTREACH.md`, `DIRECTORY-PROFILES.md`, `PR-CLOSER.md`. The authority gap (7 vs 565 ref domains per competitor intel) is the real GEO bottleneck. This is the highest-leverage, slowest item.

---

## Recommended order of operations
1. **Ship links+images** (in review now) → deploy → **recrawl (item 2)**.
2. **Keyword map + content calendar** (items 4-5) — I produce, you glance.
3. **Founder insight on top 10 posts** (item 6) — needs a 30-min brain-dump from you.
4. **Country localisation** (item 7) — one market at a time.
5. **PR / authority** (item 8) — ongoing, the long game.

*Nothing is deployed. This session's edits (links + images) are staged in the repo, verified, awaiting your deploy decision.*
