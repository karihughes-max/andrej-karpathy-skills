# Phase 1 Audit: Kari Hughes Link-in-Bio

Audit date: November 12, 2026. Everything below was checked directly through Google Drive, Gmail, Calendly, or the site source. Anything I could not check is labeled that way.

## 1. What could and could not be inspected

| Source | Status | How |
|---|---|---|
| Angela Cheatwood's page (`angelacheatwood.myflodesk.com/linkinbio`) | **Blocked.** The host is not reachable from this environment (sandbox, web fetch, and Pika capture all refused or out of credits). | Not inspected. Nothing in this build copies or assumes its content. |
| Live site `yourbestazliving.com` | **Blocked.** Same network restriction. | Inspected the **source** instead (Drive folder `karis-hub`, see below). |
| Website repository | **Not available.** Only the `andrej-karpathy-skills` fork is attached to this session, and GitHub search found no site repo. The site appears to be deployed from files (Netlify drag-and-drop or CLI). | Built as a drop-in folder (see README). |
| Site source snapshot | **Inspected.** Drive folder `karis-hub` (`1CxZif0VaZQn5J4eSuRlPsR2Z5PhTXrfv`), last updated Jun 23 – Jul 3, 2026: `index.html`, `connect.html`, `summer-guide.html`, `hidden-gems.html`, `netlify.toml`, images. | The live site has newer pages (`/trail`, `/connect`, `/sun-city-festival`) that are **not** in this snapshot, so the snapshot is out of date. |
| Google Drive | **Inspected.** | Guides, lead magnets, brand photos, playbooks. |
| Gmail | **Inspected (read-only).** | Flodesk test email, Netlify invoice, Kari's "Quick Links" note, Flodesk support thread. |
| Calendly | **Inspected** through the API. | 1 active event type. |
| Flodesk | **No connector.** | Account confirmed active (support thread Oct 7, 2026; test send Nov 4, 2026). Form IDs, segments, and workflows could not be read. |
| ManyChat | **No connector.** | Only marketing emails from ManyChat in Gmail. No flow data. |

## 2. What the current site already does (from source)

- **Stack:** static HTML on Netlify. `netlify.toml` sets `publish = "."` and long cache headers for `/images/*`, `*.jpg`, and `*.webp`. Pages sit at the root (`connect.html` is served at `/connect`).
- **Type and color:** Playfair Display + DM Sans. Camel `#B8945A`, sage `#6B8C6B`, off-white `#F8F6F2`, black `#0F0F0F`. The new page reuses the same fonts and camel/sage, shifted warmer (ivory/taupe) for the editorial direction.
- **Forms:** Netlify Forms (`data-netlify="true"` with a honeypot). Forms on the homepage: `open-house`, `contact`; on `/connect`: `connect`. Per the "Master LINKS" doc, notifications go to Kari's Compass inbox.
- **Analytics:** none found in the source. No GA4, Meta Pixel, or Plausible.
- **UTM convention:** none. No internal link uses UTMs; only Flodesk adds its own footer referral tags. This build sets a simple convention (README §4).

## 3. Asset inventory (exact URLs)

**Status key:**
- ✅ Verified: confirmed to exist and be link-shareable through an API.
- 🟡 In use: published on Kari's live materials but not HTTP-tested from here.
- ❌ Broken
- ⚠️ Issue

| Asset | URL | Status | Used on /links |
|---|---|---|---|
| Ahwatukee Local Guide (Top 10) PDF | https://drive.google.com/file/d/116DzrIZbr3zF-KCfVQR0Hy3rk5CoUUYi/view | ✅ shareable by link | **Primary 01** (delivered after signup) |
| 2027 Seller Game Plan PDF ("Your move starts with your life. Not your listing.") | https://drive.google.com/file/d/1DXbf5SXkvL3aCFinuu6itazAT2S-B9tI/view | ✅ shareable by link, ⚠️ created **today**; Kari should approve it as the public "Next Chapter" guide | **Primary 02** (delivered after signup) |
| Kari's Ahwatukee Trail List (mobile JPG) | https://drive.google.com/file/d/1jJJHFJSK2RpaOVtyAdOcjDb5BggsSK30/view | ✅ shareable by link | Backup for `/trail` |
| Trail page | https://yourbestazliving.com/trail | 🟡 listed in Kari's "Quick Links" email (Oct 5) | Secondary |
| Connect / intake page | https://yourbestazliving.com/connect | 🟡 used as the live CTA in the QR Control Center | Secondary ("Buying or Selling? Start Here") |
| Calendly: "Home Purchase Next Steps with Kari" (30 min, Google Meet) | https://calendly.com/kari-yourbestazliving/lets-create-a-plan | ✅ active (only active event type), ⚠️ name says "Home Purchase" but the description covers buying, selling, relocating, and downsizing | **Primary 05** |
| Compass agent profile | https://www.compass.com/agents/kari-hughes/ | 🟡 linked from the homepage | **Primary 03** |
| Featured listing: 5381 W Victory Way, Florence (Anthem at Merrill Ranch), active per pipeline sheet as of Nov 9 | https://order.mavmediagrp.com/5381-W-Victory-Way | 🟡 from "Quick Links" | Secondary |
| Monthly newsletter: **"Kari's Monthly Edit"** (Flodesk; Nov 2026 test send Nov 4) | sender kari@yourbestazliving.com | ✅ exists; signup form URL unknown | **Primary 04** (new signup on /links) |
| Instagram | https://instagram.com/karihughesrealtor | 🟡 | Quick contact |
| Buyer's Guide flipbook | https://heyzine.com/flip-book/2ee2022527.html | 🟡 from "Quick Links" | Not used (kept off the page to stay focused; candidate for the buying branch email) |
| Google review (write-a-review link) | https://g.page/r/CXbZ_iqdwtwoEBM/review | 🟡 | Not used: it opens the *leave a review* form, not a page of reviews |
| Arizona Summer Guide (Netlify) | https://bright-medovik-13522f.netlify.app/summer-guide.html | 🟡 seasonal, out of season | Not used |
| Summer in Arizona Guide PDF (co-branded with Inspire / WFG Title) | https://drive.google.com/file/d/1amPQ1CGzeWojL1H6fxAO2V-k-PHXPPmU/view | ✅ shareable by link | Not used (see issue A) |
| Compass Private Exclusives one-pager | Drive `1xeyX-aqNG2Wblp94N2nEqXY9JKWjqEqa` | Private | Not used (seller nurture candidate) |
| Fall List (Claude artifact) | https://claude.ai/artifact/94WC2ypvNPpKkFuPuA9XKx | 🟡 seasonal | Not used |

### Searched for and not found
- **"Moving to Ahwatukee" guide or project:** no file, doc, or email by that name. The closest assets are the Ahwatukee Local Guide (Top 10), the Trail List, and the "Ahwatukee Lead Magnets" folder, which is **empty**.
- **Arizona Next Chapter / Downsizing guide:** no guide by that name. The `ARIZONA NEXT CHAPTER LANDING PAGE` folder holds only empty subfolders plus 9 phone screenshots. The **2027 Seller Game Plan** is the closest match and is wired in as the Next Chapter guide pending Kari's OK.
- **Arizona Edit signup form URL:** the newsletter exists, but no public signup link was found.
- **Live MLS / home-search link:** none beyond the Compass profile. Flexmls links in Gmail are private client links and must not be published.

## 4. Issues found (fix on the main site; not changed by this build)

- **A. Mislabeled link.** On the homepage, "Start Here → 01 New to Arizona?" points its **"Arizona Relocation Guide →"** button to the *Summer in Arizona* PDF (co-branded with the title company).
- **B. Broken guide links.** The homepage's **North Central Phoenix Guide** (`drive…/1QiRGobzNVITyGP4suW4WKw_2lBNwQr1T`) and **Hidden Gems Guide** "Get the Guide" (`drive…/15zF2cw9IusH4XEJPVI7jbTCp7kfrsRzt`) return *file not found*. A Canva link for a Central Phoenix guide (`canva.link/4soon2jpg38auvp`) exists in Kari's notes as a possible replacement.
- **C. Stale content.** The homepage "Current Listings" still shows the Medlock Historic District homes from June. `/connect` still marks the Ahwatukee guide "Coming Soon" even though the PDF exists.
- **D. License label.** The homepage footer reads "DRE #SA639611000". Arizona uses ADRE, so the label should read "AZ License" or "ADRE". The footer also has **no brokerage address or Equal Housing statement**. The new page includes both (address taken from Kari's Flodesk footer: 4222 N Marshall Way, Scottsdale). Please confirm with Compass.
- **E. Name mismatch.** The Calendly event name ("Home Purchase Next Steps") doesn't match how it's used (next-chapter conversations). Suggest renaming to "Let's Talk About Your Next Chapter".
- **F. Duplicates in Drive.** Images exist in 2–3 copies (`kari-hero.jpg`, `kari-portrait.jpg`, `ahwatukee-foothills.jpg`); the "30-Day Content Calendar" doc exists ×4; "Daily Briefing" copies. Nothing was deleted.
- **G. Old Netlify domain.** "Master LINKS" lists the old Netlify domain `bright-medovik-13522f.netlify.app` (and a typo `bright-medivik-13522f.metlife.app`). Use yourbestazliving.com everywhere.
- **H. Photo provenance.** The site image folder also holds AI-generated files (`hf_2026…png`). This build uses only `kari-portrait.jpg`, `kari-hero.jpg`, and `ahwatukee-foothills.jpg`, which are the same photos already live on the homepage. Please confirm all three are authentic photos you have rights to.
