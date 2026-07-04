# 41 Labs — Google Search Ads Launch Plan

**Account:** 345-181-9239
**Objective:** Booked qualified calls for the S$10k+ custom-AI offer
**Target:** Cost per booked call under S$500
**Status:** Turnkey. Build this in the account tab-by-tab and launch.

Conversion tracking is already live (GA4: `whatsapp_click`, `generate_lead`, `form_submit`). Primary CTAs: WhatsApp `wa.me/6580124848` and the free audit at `/audit`.

---

## 1. Campaign Settings

| Setting | Value |
|---|---|
| Campaign name | `41Labs-Search-SG-Consulting` |
| Campaign type | Search |
| Networks | Search Network ONLY. **Uncheck** "Include Google Display Network". **Uncheck** "Include Google search partners". |
| Goal | Leads (no target-goal guidance; we manage manually) |
| Locations | Singapore |
| Location option | **Presence: People in or regularly in your targeted locations.** NOT "Presence or interest". This stops overseas clicks. |
| Languages | English |
| Budget | S$60/day to start. Move to S$80/day once a keyword shows a booked call under S$500. |
| Bidding | **Start: Manual CPC with Enhanced CPC OFF.** Set max CPC S$4.00, cap key head terms at S$6.00. Switch to **Maximize Conversions** only after the account has logged 15-20 conversions in 30 days (enough signal for Smart Bidding). Do not start on Maximize Conversions with zero data. |
| Ad rotation | Optimize: prefer best performing ads |
| Ad schedule | Mon-Fri 08:00-20:00, Sat 09:00-17:00. Pause Sundays for the first month, then review by day/hour. Business-buyer intent is a weekday-daytime pattern. |
| Devices | All devices at launch. Review mobile vs desktop after 2 weeks; WhatsApp CTA favours mobile, audit form favours desktop. |
| Final URL expansion | OFF |
| Dynamic Search Ads | OFF |
| Auto-applied recommendations | OFF (turn off all auto-apply; they add broad keywords and partners) |

**Tracking template / UTMs** — add at campaign level so GA4 attributes correctly:
```
{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign=search-sg&utm_content={adgroupid}&utm_term={keyword}
```

---

## 2. Ad Groups → Clusters → Landing Pages

Four core ad groups, each mapped 1:1 to a proven-demand cluster and its recreated landing page. Keep match types tight: **exact + phrase only, no broad match** at launch. Buyer-intent terms only.

### Ad Group A — AI Consulting
**Landing page:** `https://41labs.ai/blog/best-ai-consulting-singapore`
Highest proven demand (~1,100 impressions/yr in GSC). This is the priority group; give it the most budget headroom.

```
[ai consulting singapore]
[ai consultant singapore]
[ai consulting firm singapore]
[ai consulting services singapore]
[best ai consulting singapore]
[ai consultancy singapore]
"ai consulting singapore"
"ai consultant singapore"
"ai consulting services"
"ai consultancy singapore"
"ai strategy consulting singapore"
"enterprise ai consulting singapore"
"ai consulting company"
"hire ai consultant singapore"
```

### Ad Group B — AI Automation
**Landing page:** `https://41labs.ai/blog/ai-automation-singapore`

```
[ai automation singapore]
[ai automation services singapore]
[business automation ai singapore]
[ai workflow automation singapore]
[ai process automation singapore]
"ai automation singapore"
"ai automation services"
"ai automation company singapore"
"business process automation ai"
"workflow automation singapore"
"ai automation for business"
"automate business with ai singapore"
"ai automation consultant"
```

### Ad Group C — AI Automation Services (commercial variant)
**Landing page:** `https://41labs.ai/blog/ai-automation-services-singapore`
Splits the "services / done-for-you" intent from the head "ai automation" term so ad copy can lean harder on delivery and grants.

```
[ai automation services singapore]
[ai automation company singapore]
[custom ai automation singapore]
[ai integration services singapore]
"ai automation services singapore"
"ai automation company"
"custom ai automation"
"ai integration services singapore"
"ai implementation services singapore"
"done for you ai automation"
"ai automation agency singapore"
"managed ai automation"
```

### Ad Group D — AI Development Company
**Landing page:** `https://41labs.ai/blog/best-ai-systems-company-singapore`

```
[ai development company singapore]
[ai development singapore]
[custom ai development singapore]
[ai software development singapore]
[ai systems company singapore]
[best ai company singapore]
"ai development company singapore"
"ai development singapore"
"custom ai development"
"ai software development singapore"
"build ai system singapore"
"ai solutions company singapore"
"enterprise ai development singapore"
"ai product development singapore"
```

---

## 3. Shared Negative Keyword List

Create one shared list named **`41Labs-Master-Negatives`** and apply it to the campaign. This kills tyre-kickers, students, job-seekers, and definitional searches that will never book a S$10k call.

**Intent / research (phrase match):**
```
"what is"
"how to"
"how does"
"meaning"
"definition"
"examples"
"tutorial"
"guide"
"reddit"
"wikipedia"
"quora"
"medium"
"youtube"
```

**Learning / careers (broad — these are single words, add as broad):**
```
course
courses
class
classes
bootcamp
certification
certificate
diploma
degree
training
learn
learning
study
student
students
university
poly
polytechnic
nus
ntu
smu
```

**Jobs / money-out (broad):**
```
job
jobs
career
careers
hiring
vacancy
vacancies
salary
salaries
wage
intern
internship
resume
cv
recruitment
```

**Free / cheap / DIY (broad):**
```
free
freeware
cheap
cheapest
diy
open source
opensource
download
crack
```

**Wrong product / off-topic (broad):**
```
image
images
photo
art
generator
girlfriend
chatgpt login
character
detector
essay
homework
gpu
stock
stocks
trading
```

> Review the Search Terms report weekly for the first month and push new junk terms into this shared list.

---

## 4. Responsive Search Ads

One RSA per ad group. All copy in house style: plain English, short, concrete numbers, no em dashes, no hype, no emoji, sell outcomes. Pin nothing at launch except the brand/geo headline in position 1 for the two head groups if you want geo-consistency (optional). Real proof to rotate through: 50+ AI projects delivered, 100% in production, quotes cut from 3 hours to 4 minutes, EDG grant covers 50-70%, live in 4-8 weeks, free working demo, founder-led.

Character limits: **headlines ≤ 30 chars, descriptions ≤ 90 chars.**

### RSA — Ad Group A (AI Consulting)
**Final URL:** `https://41labs.ai/blog/best-ai-consulting-singapore`
**Path:** `/ai-consulting` `/singapore`

Headlines (15):
1. `AI Consulting in Singapore` (26)
2. `50+ AI Projects Delivered` (24)
3. `100% of Our AI in Production` (27)
4. `Custom AI, Live in 4-8 Weeks` (28)
5. `EDG Grant Covers 50-70%` (23)
6. `Founder-Led AI Consulting` (25)
7. `Book a Free AI Audit` (20)
8. `See a Working Demo First` (24)
9. `From 3 Hours to 4 Minutes` (25)
10. `AI That Ships, Not Slides` (25)
11. `Talk to the Team That Builds` (28)
12. `Real AI Systems for SMEs` (24)
13. `Cut Manual Work With AI` (23)
14. `No Jargon. Just Results.` (24)
15. `Singapore AI Experts` (20)

Descriptions (4):
1. `50+ AI projects delivered and all of them running in production. Book a free audit.` (83)
2. `We build custom AI systems live in 4 to 8 weeks. EDG grant can cover 50 to 70%.` (79)
3. `See a working demo before you commit. Founder-led team, based in Singapore.` (74)
4. `One client cut quoting from 3 hours to 4 minutes. Let us find your win.` (70)

### RSA — Ad Group B (AI Automation)
**Final URL:** `https://41labs.ai/blog/ai-automation-singapore`
**Path:** `/ai-automation` `/singapore`

Headlines (15):
1. `AI Automation in Singapore` (26)
2. `Automate the Manual Work` (24)
3. `3 Hours of Work to 4 Minutes` (28)
4. `50+ AI Projects Delivered` (24)
5. `100% of Our AI in Production` (27)
6. `Live in 4 to 8 Weeks` (20)
7. `EDG Grant Covers 50-70%` (23)
8. `Free Working Demo First` (23)
9. `Founder-Led AI Team` (19)
10. `Cut Cost, Not Corners` (21)
11. `Book a Free AI Audit` (20)
12. `AI Built Around Your Work` (25)
13. `Stop Doing It By Hand` (21)
14. `Custom AI Automation SG` (23)
15. `Results You Can Measure` (23)

Descriptions (4):
1. `We automate the repetitive work your team does by hand. See a demo before you pay.` (82)
2. `One client went from 3 hours to 4 minutes per quote. Find your win in a free audit.` (83)
3. `Custom AI automation, live in 4 to 8 weeks. EDG grant can cover 50 to 70%.` (73)
4. `50+ projects delivered, all in production. Founder-led team in Singapore.` (72)

### RSA — Ad Group C (AI Automation Services)
**Final URL:** `https://41labs.ai/blog/ai-automation-services-singapore`
**Path:** `/ai-automation` `/services`

Headlines (15):
1. `AI Automation Services SG` (25)
2. `Done For You AI Systems` (23)
3. `Live in 4 to 8 Weeks` (20)
4. `50+ AI Projects Delivered` (24)
5. `100% Running in Production` (26)
6. `EDG Grant Covers 50-70%` (23)
7. `See a Working Demo First` (24)
8. `Founder-Led Delivery` (20)
9. `Book a Free AI Audit` (20)
10. `We Build It, You Run It` (23)
11. `Custom AI for Your Team` (23)
12. `3 Hours to 4 Minutes` (20)
13. `No Jargon. Real Systems.` (24)
14. `AI That Pays for Itself` (23)
15. `Singapore AI Delivery Team` (26)

Descriptions (4):
1. `Done-for-you AI automation, built and shipped in 4 to 8 weeks. Free demo first.` (78)
2. `EDG grant can cover 50 to 70% of the build. Book a free audit to check your fit.` (79)
3. `50+ AI projects delivered and every one is in production. Founder-led team.` (74)
4. `We handle the build so your team just runs it. Cut hours of manual work.` (72)

### RSA — Ad Group D (AI Development Company)
**Final URL:** `https://41labs.ai/blog/best-ai-systems-company-singapore`
**Path:** `/ai-development` `/singapore`

Headlines (15):
1. `AI Development in Singapore` (27)
2. `Custom AI Systems Built` (23)
3. `50+ AI Projects Delivered` (24)
4. `100% of Our AI in Production` (27)
5. `Live in 4 to 8 Weeks` (20)
6. `EDG Grant Covers 50-70%` (23)
7. `See It Work Before You Buy` (26)
8. `Founder-Led AI Company` (22)
9. `Book a Free AI Audit` (20)
10. `AI That Ships, Not Slides` (25)
11. `Built for Singapore SMEs` (24)
12. `From Idea to Live System` (24)
13. `3 Hours of Work to 4 Mins` (25)
14. `Real Engineers, Real Code` (25)
15. `No Jargon. Just Results.` (24)

Descriptions (4):
1. `We build custom AI systems and ship them live in 4 to 8 weeks. See a demo first.` (80)
2. `50+ projects delivered, all in production. EDG grant can cover 50 to 70%.` (72)
3. `Founder-led team in Singapore. Book a free audit and get a working demo.` (72)
4. `One client cut a 3-hour job to 4 minutes. Let us find the same win for you.` (74)

---

## 5. Ad Extensions (Assets)

Apply at campaign level so all ad groups inherit them.

### Sitelinks (6)
| Sitelink text | Description line 1 | Description line 2 | URL |
|---|---|---|---|
| Free AI Audit | See where AI saves you time | No cost, no obligation | `https://41labs.ai/audit` |
| See a Live Demo | Watch our AI work first | Before you commit a dollar | `https://41labs.ai/audit` |
| AI Automation | Automate the manual work | Live in 4 to 8 weeks | `https://41labs.ai/blog/ai-automation-singapore` |
| AI Consulting | 50+ projects delivered | All running in production | `https://41labs.ai/blog/best-ai-consulting-singapore` |
| 41 Closer | AI that replies on WhatsApp | Books calls while you sleep | `https://41labs.ai/41-closer` |
| Talk to Us | Message us on WhatsApp | Get a straight answer | `https://wa.me/6580124848` |

### Callouts (6)
```
50+ AI Projects Delivered
100% Running in Production
EDG Grant 50-70% Covered
Live in 4 to 8 Weeks
Free Working Demo
Founder-Led Team
```

### Structured Snippets (2)
- **Header: Services** → `AI Consulting, AI Automation, Custom AI Development, WhatsApp AI Agents, AI Audits`
- **Header: Types** → `SMEs, Enterprise, Manufacturing, Professional Services, Trades`

### Also add (free, high value)
- **Call asset:** business number, call reporting on.
- **Business name + logo assets.**
- **Lead form asset** (optional) pointing to the same audit intent if you want in-SERP capture.

---

## 6. Secondary Ad Group — 41 Closer (WhatsApp AI)

Separate campaign or a fifth ad group. **Note:** this demand is real but thinner than the consulting clusters. Keep the budget small (cap at ~S$15/day of the total, or run as its own S$20/day campaign) and judge it on its own cost-per-booked-call. Do not let it starve the consulting groups.

**Ad group name:** `AI-Closer-WhatsApp`
**Landing page:** `https://41labs.ai/41-closer`

Keywords (exact + phrase, buyer intent):
```
[whatsapp ai chatbot singapore]
[whatsapp automation singapore]
[whatsapp ai agent singapore]
[ai chatbot for whatsapp]
[whatsapp business automation singapore]
"whatsapp ai chatbot singapore"
"whatsapp automation singapore"
"whatsapp ai agent"
"ai chatbot for whatsapp business"
"automate whatsapp replies"
"whatsapp sales bot singapore"
"whatsapp chatbot for business"
```

RSA headlines (12):
1. `WhatsApp AI That Replies` (24)
2. `Never Miss a WhatsApp Lead` (26)
3. `AI Answers in Seconds` (21)
4. `Books Calls While You Sleep` (27)
5. `WhatsApp AI Agent SG` (20)
6. `Turn Chats Into Bookings` (24)
7. `Stop Losing Leads at Night` (26)
8. `See a Live Demo Free` (20)
9. `Founder-Led AI Team` (19)
10. `Live in 4 to 8 Weeks` (20)
11. `Automate WhatsApp Replies` (25)
12. `Message Us to See It Work` (25)

RSA descriptions (4):
1. `Your WhatsApp AI replies in seconds, qualifies the lead, and books the call.` (75)
2. `Stop losing enquiries after hours. The AI answers every message instantly.` (74)
3. `See it work on a live demo before you pay. Founder-led team in Singapore.` (73)
4. `Live in 4 to 8 weeks. Message us on WhatsApp to try it yourself.` (63)

---

## 7. Conversion Actions and How to Read Results

### Conversion actions to import / configure
Import from GA4 into Google Ads (Tools → Conversions → Import → Google Analytics 4). Set as **primary** the actions that mean a real booked call:

| GA4 event | Google Ads setup | Primary? | Value |
|---|---|---|---|
| `whatsapp_click` | Import, category = "Contact" | **Primary** | Assign S$50 (a WhatsApp click is intent, not a booked call) |
| `form_submit` (audit form) | Import, category = "Submit lead form" | **Primary** | Assign S$120 |
| `generate_lead` | Import, category = "Qualified lead" | **Primary** | Assign S$150 |
| Booked call (calendar/manual) | If a booking tool fires an event, import it as the true north-star | **Primary** | S$500+ |

- **Count:** use "One" per click for `whatsapp_click` and `form_submit` (one booked call per session, not every click).
- **Attribution model:** Data-driven if available, else last click.
- **Conversion window:** 30 days click, 1 day view.
- If a true "booked call" event does not yet exist, treat `generate_lead` + `form_submit` as the proxy for a booked call and reconcile manually against the CRM (Twenty) weekly.

### The one number that matters
**Cost per booked call = total spend ÷ number of booked calls (from CRM, not just Google's conversion count).**
Google will over-count (a WhatsApp click is not a booked call). So every Monday:
1. Pull spend per ad group from Google Ads.
2. Pull actual booked calls per source from Twenty CRM (UTM `utm_content` = ad group id, `utm_term` = keyword).
3. Divide. That is the real cost per booked call. Target: **under S$500.**

### Scale / hold / cut rules
Review at day 7, day 14, then weekly. Judge at the **keyword** and **ad group** level, not the whole campaign.

- **SCALE** (raise budget / raise max CPC 20%): keyword or ad group producing booked calls under S$500. Push the winners first; Ad Group A (consulting) is the expected leader.
- **HOLD** (leave as-is, gather data): has clicks but under ~15 conversions total. Not enough signal yet. Do not touch bids.
- **CUT** (pause keyword): spent more than **2x target (S$1,000)** with zero booked calls, OR CTR under 2% after 500+ impressions with no conversions.
- **FIX before cutting an ad group:** if clicks are coming but not converting, the leak is usually the landing page or the offer, not the keyword. Check the page loads fast, the WhatsApp CTA and audit form are above the fold, and the headline matches the ad.

### First 30 days checklist
- Day 1: launch on Manual CPC, S$60/day, all four core groups + Closer group paused-small.
- Day 3: first Search Terms report review, add negatives.
- Day 7: pause obvious losers, note early winners, check UTMs land in CRM.
- Day 14: if 15-20 conversions logged, test switching the top group to Maximize Conversions.
- Day 30: full read. Reallocate budget to the group with the lowest real cost per booked call. Kill anything over S$1,000 with no calls.

---

## Build order in the account
1. Shared negative list first (`41Labs-Master-Negatives`).
2. Campaign `41Labs-Search-SG-Consulting` with settings above, apply the negative list.
3. Ad groups A-D, paste keywords, set each Final URL.
4. One RSA per ad group.
5. Extensions at campaign level.
6. Import conversions, set primaries and values.
7. Separate small campaign or ad group for 41 Closer.
8. Confirm tracking template fires, then enable.
