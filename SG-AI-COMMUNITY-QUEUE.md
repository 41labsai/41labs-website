# r/SgAICommunity — Post Queue (Claude's runsheet)

Once `reddit-bridge.py test` is green, Claude posts these on this drip so the sub fills
naturally without looking spammed. Full post bodies live in SG-AI-COMMUNITY-KIT.md.
Claude posts as the user's approved content; user just says "go" once connected.

| Order | When | Flair | Title |
|---|---|---|---|
| Pin | On connect | (none) | Welcome. What are you actually automating right now? |
| 1 | On connect | Tools | The WhatsApp Business API fees nobody explains before you sign up |
| 2 | +3 days | Grants (EDG/PSG) | EDG grant for AI in Singapore: what actually qualifies (and what gets rejected) |
| 3 | +6 days | Question | Honest question: has AI actually saved your business time or money, or just added noise? |
| 4 | +9 days | Automation | Build vs buy: when should an SME build its own AI vs just pay for a tool? |
| 5 | +13 days | Tools | The AI tools Singapore SMEs are actually using in 2026 (not the hype list) |
| 6 | +16 days | Grants (EDG/PSG) | PSG vs EDG for AI projects: which grant, and how much you really get back |
| 7 | +20 days | Automation | A simple way to find the one process worth automating first |
| 8 | +24 days | Case Study | Where WhatsApp leads actually leak for SG SMEs (what we measured) |

**On connect (Claude does):**
1. `reddit-bridge.py test` — confirm auth + show subscriber count
2. Post the Welcome post, then pin it (mod action)
3. Post #1
4. Report the two live URLs

**Then:** every few days Claude posts the next one on the drip above, and pulls new comments
each time so it can draft the user's replies. Cadence = 2 posts/week, matches the kit.

**If the API never connects:** identical posts go into Reddit mod tools > Scheduled Posts by hand,
same drip. No content rewrite needed.
