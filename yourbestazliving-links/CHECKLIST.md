# Build Checklist: Completed vs. Blocked

## ✅ Completed in this build
- [x] Audited the site source, Drive, Gmail, and Calendly. Asset inventory with exact URLs is in `AUDIT.md`.
- [x] Built `/links` (`site/links.html`):
  - mobile-first, using the site's existing fonts
  - real photos of Kari already used on the homepage, re-encoded to WebP (35 KB for the mobile hero)
- [x] Primary links in the requested order, plus four quieter secondary links.
- [x] Guide form on Netlify Forms (the site's existing pattern):
  - name + email required; journey, timeline, and phone optional
  - separate opt-in for the Monthly Edit
  - honeypot spam field and a plain-language disclosure
- [x] The guide opens on the page right after signup.
- [x] Deep links for ManyChat (`/links?guide=…#get`). UTMs are captured into the form.
- [x] Flodesk sync function: segments, no duplicates, respects unsubscribes, Edit only with consent. Inert until keys are added.
- [x] SEO and sharing:
  - title, meta description, canonical URL
  - Open Graph and Twitter tags, plus a 1200×630 share image
  - RealEstateAgent structured data
- [x] Accessibility:
  - skip link, labeled fields, visible focus styles
  - live error messages, alt text on every image
  - respects reduced-motion settings; tap targets of 44px or more
  - small text uses AA-contrast colors
- [x] Privacy-aware click tracking: no cookies and no third-party scripts. Events are forwarded only if Plausible or GA4 is added later.
- [x] UTM convention defined (none existed before).
- [x] Footer:
  - Compass Arizona shown prominently, with brokerage address and Equal Housing Opportunity
  - license number and an informational disclaimer
- [x] Drafts of every journey email (`EMAILS.md`) and ManyChat replies (`LEAD-CAPTURE.md`).
- [x] Tested in Chromium:
  - 18 browser checks on iPhone 13 and desktop, all passing
  - 10 unit tests on the Flodesk function, all passing
  - mobile, desktop, and before/after previews in `previews/`

## ⛔ Blocked: needs Kari's access or decision
| # | Item | Why blocked | Owner / next step |
|---|---|---|---|
| 1 | Copy `site/` into the real website project and deploy a **preview** | The site's repo or folder isn't attached to this session | Kari: share the repo or a Netlify site link, or drag the files in (README) |
| 2 | Click-test the 🟡 URLs: `/trail`, `/connect`, Compass profile, Victory Way property site | yourbestazliving.com is unreachable from this environment | Test on the Netlify deploy preview |
| 3 | Angela Cheatwood reference audit | Host blocked here | Optional. The build doesn't depend on it |
| 4 | Next Chapter guide = **2027 Seller Game Plan** (created today) | Needs Kari's OK to publish it as a public lead magnet | Kari approves, or swaps in a downsizing guide (one-line change in `GUIDES`) |
| 5 | **"Moving to Ahwatukee" guide** | Not found anywhere. Primary 01 delivers the Ahwatukee Local Guide (Top 10) for now | Kari: point me to it, or keep the Top 10 |
| 6 | Flodesk segments + workflows (API key already stored in Netlify) | No Flodesk connector | Kari: `LEAD-CAPTURE.md` steps 1–4 (about 15 min). Keep workflows **paused** until approved |
| 7 | Verify the Flodesk API request format | Written from the public v1 docs, not live-tested | Test with your own email (step 4) |
| 8 | ManyChat keywords AHWATUKEE / TRAILS / NEXT | No ManyChat connector | Kari pastes the replies from `LEAD-CAPTURE.md` |
| 9 | Compass compliance review of the footer, license label (AZ vs "DRE"), office address, and SRES® | Requires Compass / your designated broker | Kari |
| 10 | "About Kari & Client Reviews" goes to `/#about` | No public reviews page found (only a write-a-review link) | Kari: share a Google Business Profile, Zillow, or Compass reviews URL to add |
| 11 | Featured home stays current | Listing data changes | Update the URL and line in `links.html` when the listing changes |
| 12 | Analytics | None installed on the site | Optional: add Plausible or Netlify Analytics; the page already sends events if one exists |
| 13 | Rename the Calendly event to match | Not changing live settings without approval | Kari: "Let's Talk About Your Next Chapter" |
| 14 | Fix homepage issues A–D in `AUDIT.md` (mislabeled relocation link, 2 broken guide links, stale listings, license label) | Out of scope: homepage and active SEO not touched | Kari decides |

## Not done on purpose (per your instructions)
- Nothing deployed publicly; no DNS or Netlify settings changed.
- The homepage and existing pages are untouched.
- No live Flodesk or ManyChat automations created or changed. No emails sent.
- No subscriber data read, exported, or exposed.
