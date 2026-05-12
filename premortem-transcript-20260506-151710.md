# Premortem Transcript — ResumeRadar
**Date:** 2026-05-06  
**Method:** Gary Klein / Harvard Business Review premortem  
**Premise:** It is 6 months from now. ResumeRadar has failed. Looking back to understand why.

---

## Failure Modes Identified

1. Job Bank scraper breaks or gets blocked
2. OpenAI API costs spiral out of control
3. No user authentication — zero retention
4. Promises four markets, delivers one (only Job Bank Canada exists)
5. CV quality insufficient for the real stakes immigrants face
6. Legal exposure: scraping ToS violations + unprotected PII storage

---

## Deep-Dive: Job Bank Scraper Breaks or Gets Blocked

**Severity:** High

**The Failure Story**  
Month 1: ESDC's web team pushes a routine redesign — they migrate from the old JSP-era HTML structure to a React-rendered layout. The `article.action-buttons` wrapper gets renamed or nested inside a new container. Cheerio returns zero matches. The scraper does not throw an error; it silently returns an empty array. The API's catch block in `route.ts` swallows failed queries, and the `allRaw.length === 0` branch returns a 404 with a message indistinguishable from "no jobs for this title." Users assume they are unqualified. They tweak their search terms. Nothing works. No alert fires because HTTP 200 responses are being served to the frontend — the scraper just returns empty arrays, not exceptions.

Month 3: The builder notices the "no results" error appearing in feedback. They assume user error. By the time they manually inspect, Job Bank has also added bot detection — a Cloudflare challenge page or a session-cookie gate that requires JavaScript rendering. The static `fetch()` with a hardcoded Chrome User-Agent header hits the challenge wall and returns a 403, which the code already handles: `if (!res.ok) throw new Error(...)`. That error gets caught and silenced inside `Promise.allSettled`. The entire fetch pipeline now returns nothing without logging which request failed or why.

Month 6: The builder tries the curl fix again, but the site now requires JavaScript execution for the search results page — Cheerio, which parses static HTML, cannot run JS. The only path forward is Playwright or a paid scraping API. The entire job-feed feature is effectively dead until rebuilt from scratch.

**The Underlying Assumption**  
The builder assumed that jobbank.gc.ca is a stable, scrapable, government-maintained static HTML site that will not add bot protection, change its DOM structure, or require JavaScript rendering — indefinitely, without notice.

**Early Warning Signs**  
- Result counts quietly drop (15 results per search becomes 3, then 0) without any server errors
- `article.action-buttons` selector returns 0 matches on a manual curl test while the page visually still shows jobs in a browser
- HTTP responses return 200 but the body contains a Cloudflare challenge page (`cf-browser-verification`, `__cf_bm` cookie) instead of HTML listings
- `jsessionid` disappears from Job Bank URLs (signals a backend framework migration)
- Fetching the detail page URL stored in `linkedin_url` returns 404 or redirects to the homepage

---

## Deep-Dive: OpenAI API Costs Spiral Out of Control

**Severity:** Critical

**The Failure Story**  
Month 1: A developer posts ResumeRadar on Reddit's r/cscareerquestions. Traffic spikes to 200 daily users. Each session triggers roughly 42 GPT-4o calls (20 visa classifications + 20 scoring + 1 CV + 1 insights). At ~$0.005 per call, that's $0.21/session — $42/day. Manageable. Month 2: A Hacker News front page mention brings 2,000 daily users for a week. Cost jumps to $420/day. The builder notices but assumes it's temporary. Month 3–4: A bot operator discovers the unprotected endpoint and scripts 500 automated sessions/hour. GPT-4o input tokens for 20 job descriptions × 500 sessions = ~10M tokens/hour. At $5/1M input tokens (GPT-4o), that's $50/hour, $1,200/day from bots alone. Real users add another $200/day. Monthly bill: ~$42,000. The OpenAI account hits its credit limit and gets suspended mid-month. The app goes dark.

**The Underlying Assumption**  
The builder assumed usage would be low-volume and human-paced — that organic, word-of-mouth growth would scale slowly enough to monetize before costs became serious. The open endpoint was treated as a convenience ("anyone can try it"), not a liability.

**Early Warning Signs**  
- Daily OpenAI spend exceeds $20 within the first two weeks of any public launch announcement
- API response latency increases as parallel calls multiply — the app feels slow before the bill arrives
- OpenAI usage dashboard shows requests clustering in sub-second intervals (bot signature) rather than the 30–60 second human browsing pattern
- A single IP or subnet accounts for >10% of total monthly token consumption
- The 20-call-per-search pattern means cost scales linearly with searches, not users — even a modest traffic spike compounds fast

---

## Deep-Dive: No Authentication — Zero Retention

**Severity:** Critical

**The Failure Story**  
A job seeker discovers ResumeRadar, uploads their CV, and spends 20 minutes tuning their profile. The ATS optimizer scores their resume, they find three promising leads, and they close the tab. The next morning they return to the URL — blank slate. Their CV is gone (the UUID is lost), their job results vanished from sessionStorage, and the optimizer shows them nothing familiar. They have no reason to believe the app "knows" them. They Google a competitor, create an account there, and never return to ResumeRadar.

Word of mouth never compounds. A satisfied user who wants to recommend the tool can't say "sign up and your profile is waiting" — they say "you have to redo everything each time." Referrals drop off. Power users — the ones who would revisit weekly and evangelize — churn at exactly the moment they'd have become loyal. The app acquires users continuously but retains none; growth looks like a leaky bucket measured in daily uniques that never convert to weekly actives.

The app also can't send job alerts, follow-up nudges, or re-engagement emails. Every growth lever that depends on knowing who the user is — personalized recommendations, saved searches, match notifications — is structurally unavailable.

**The Underlying Assumption**  
The builder assumed the core value was delivered in a single session: "find jobs, optimize CV, done." Retention was treated as a product problem to solve later, after the session model was already baked into the architecture.

**Early Warning Signs**  
- High bounce rate on return visits (analytics shows near-zero repeat sessions from same device)
- Zero direct/bookmark traffic growth despite new-user spikes
- User feedback requests "how do I save my profile"
- App store or landing page reviews mentioning data loss

---

## Deep-Dive: Promises Four Markets, Delivers One

**Severity:** High

**The Failure Story**  
A user in Morocco, Nigeria, or France opens ResumeRadar. The landing page metadata reads "AI-powered job search for Canada, USA, New Zealand, and Australia." The user selects "Australia," types their job title, and clicks Search. The backend silently ignores the country field — `scrapeJobBank()` is the only data source, and Job Bank is a Canadian government website. The user gets either zero results or, worse, Canadian jobs tagged with "Australia" stored in the database. They conclude the product is broken, or that Australian employers are not hiring. Both conclusions are wrong, and both erode trust permanently.

The damage compounds in the second session. The user reports the bug to a friend, leaves a review, or simply never returns. There is no graceful degradation — no "coming soon" label, no disabled state on non-Canadian options, no honest message. The UI actively invites the broken path and then fails silently, which is worse than not offering the feature at all.

**The Underlying Assumption**  
The builder assumed that "country" is a display attribute — a label to attach to scraped data — rather than a routing key that determines which data source to call. The geographic scope was designed at the UI layer and deferred indefinitely at the data layer. The implicit assumption: "We'll add the other sources later, the scaffolding is there." Later never arrived.

**Early Warning Signs**  
- The `country` field is written to the database but never read back as a filter or router — it is decorative metadata
- `src/lib/prompts.ts` hardcodes "Canadian job boards" inside the query-generator prompt while the UI advertises four markets
- The error message leaks "Job Bank" to the user for any country selection
- Zero dead-letter handling: non-Canada selections return the same code path with no guard or fallback message

---

## Deep-Dive: CV Quality Insufficient for Immigrant Stakes

**Severity:** High

**The Failure Story**  
Amara, a software engineer from Senegal, arrives in Montreal with 8 years of experience. She uploads her profile to ResumeRadar, generates a CV, and submits it to 40 employers over two weeks. She hears nothing. What she doesn't know: GPT-4o quietly dropped her most recent role, reworded her accomplishments into vague generalities ("contributed to team success"), and invented a soft-skills bullet she never claimed. The ATS scored her low. Hiring managers who did open it saw a weak candidate. She concludes Canadian employers don't value foreign experience — when the real problem was the tool she trusted.

The damage compounds invisibly. Amara has no baseline to compare against. She doesn't know what a strong Canadian CV looks like. She iterates on the wrong variable — her cover letter, her LinkedIn — while the CV quietly poisons every application. Weeks become months. Her work permit has a clock. Each failed cycle costs confidence, money, and legal runway.

This isn't a single bad PDF. It's a systematic trust violation: the product presents as authoritative ("ATS-optimized") while producing output no expert ever reviewed. The immigrant user, unfamiliar with local norms, is the least equipped person to catch the error.

**The Underlying Assumption**  
GPT-4o, given structured input, will produce output that is accurate, complete, and locally appropriate — without verification. The user will catch any errors.

**Early Warning Signs**  
- Users regenerate CVs multiple times without understanding why (signal: silent dissatisfaction)
- No user ever reports a specific factual error (signal: they can't detect what they can't compare)
- Download rates are high but callback rates, if ever tracked, are near zero
- Users mention "no responses" in support or feedback — but blame themselves, not the CV
- The generated CV omits roles, conflates dates, or adds skills not in the source profile — detectable with automated output diffing against input

---

## Deep-Dive: Legal Exposure — Scraping ToS + Unprotected PII

**Severity:** High

**The Failure Story**  
A Canadian immigration advocacy group or a Job Bank product manager notices unusual traffic patterns — hundreds of automated requests from ResumeRadar's IP range. Job Bank's legal team sends a cease-and-desist citing their Terms of Use, which explicitly prohibit automated harvesting of job listings. Simultaneously, a user discovers their full name, address, and phone number sitting in an exposed Supabase table (a misconfigured RLS policy, a leaked API key, or simply a researcher probing the endpoint). They file a complaint with the Office of the Privacy Commissioner of Canada under PIPEDA.

Now there are two active legal fronts. The scraping violation carries injunctive risk and potential damages. The PIPEDA complaint triggers an OPC investigation: no consent form, no stated purpose for data collection, no retention limits, no deletion mechanism, no privacy policy. The OPC can name the organization publicly in findings. If any user is in the EU or the UK, GDPR/UK GDPR exposure compounds this — fines up to 4% of global revenue. The operator cannot patch their way out mid-investigation. Deleting the data now looks like evidence destruction. The app shuts down while legal counsel is retained.

**The Underlying Assumption**  
"It's just a side project" creates a legal safe harbor — and that collecting PII to help users is inherently benign, so compliance can be deferred until scale.

**Early Warning Signs**  
- Job Bank returns 403s or rate-limit blocks on scraped routes
- A user asks "where is my data stored and can I delete it?"
- Supabase dashboard shows anonymous public reads on the `cv_profiles` table
- No `/privacy` URL exists and a user Googles it

---

## Synthesis

### Most Likely Failure
No user authentication kills retention before the product can grow. Every user who uploads a CV and generates a tailored PDF loses all of it when they close the tab. They return to a blank slate. The app acquires users continuously but retains none. Every growth lever (alerts, saved searches, referrals) is structurally unavailable.

### Most Dangerous Failure
One viral post triggers a $42,000/month API bill overnight. 2,000 daily users × 42 GPT-4o calls = $420/day. One bot operator discovers the open endpoint: $1,200/day. OpenAI suspends the account. The app goes dark with users mid-workflow.

### The Hidden Assumption
> "Users complete their full job-search workflow in one session, and the product delivers its entire value in that session."

This was never a stated decision. The entire architecture defaulted to it, and it cascades into: no auth, no session persistence, no alerts, no retention, no monetization path.

---

## Revised Plan

| Priority | Action | Why |
|---|---|---|
| 1 — Critical | Add Supabase Auth (magic link / email) | Fixes retention AND closes the open API exploit — gate all AI calls behind auth |
| 2 — Critical | Add rate limiting on all `/api` routes | Max N AI calls per user per day; blocks bot abuse |
| 3 — High | Remove USA/NZ/AU or gate with "Coming Soon" | Every non-Canada selection fails silently and misleads users |
| 4 — High | Add CV output diff validation | Compare roles/dates against input profile before returning — retry or flag if missing |
| 5 — Medium | Add `/privacy` page + Supabase RLS on `cv_profiles` | Raw PII stored with no consent flow or access control |

## Pre-Launch Checklist

- [ ] Supabase Auth live — no AI endpoint callable without a valid session token
- [ ] Rate limiter active — max 3 searches + 2 CV generations per user per day (free tier)
- [ ] Non-Canada country options show "Coming soon" — no silent broken paths
- [ ] Privacy policy exists at `/privacy`
- [ ] CV generation shows warning: "Review carefully before submitting — AI can miss details from your profile"

## The One Thing
**Ship auth before you share the URL with anyone.** One mention in the wrong Slack channel and you're looking at a four-figure bill before morning. Auth costs one afternoon with Supabase and solves three critical failures simultaneously: runaway costs, zero retention, and PII exposure.
