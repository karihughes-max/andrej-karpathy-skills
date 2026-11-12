# yourbestazliving.com/links: Arizona Next Chapter link-in-bio

A drop-in page for Kari Hughes's existing static Netlify site. It matches the site's conventions: root-level `.html` pages, Netlify Forms, Playfair Display + DM Sans, and `/images/` caching from `netlify.toml`.

```
site/                              ← copy these into the website's publish folder
  links.html                       → served at /links
  images/links/*.webp, og-links.jpg
  netlify/functions/submission-created.mjs   (Flodesk sync, inert until configured)
previews/                          mobile, desktop, thank-you, before/after screenshots
AUDIT.md        Phase 1 audit + asset inventory + issues found
LEAD-CAPTURE.md Flodesk setup + ManyChat keyword replies
EMAILS.md       Journey drafts (delivery, intro, local living, invitations, branches)
CHECKLIST.md    Completed vs. blocked, with owners
```

## 1. Install (no overwrites)
New files only. Nothing in the existing site changes.

1. Copy `site/links.html` to the site root, next to `index.html` and `connect.html`.
2. Copy `site/images/links/` to `images/links/`.
3. Copy `site/netlify/functions/` to `netlify/functions/` (Netlify's default functions folder, so no `netlify.toml` change is needed).
4. If the site deploys by drag-and-drop, functions won't deploy that way. Either use the Netlify CLI (`netlify deploy` creates a draft URL), or skip the function and use the no-code CSV option in `LEAD-CAPTURE.md`.

## 2. Preview safely
- **Netlify CLI:** `netlify deploy --dir=.` deploys to a **draft URL only**. Do *not* add `--prod` until approved.
- **Git-connected site:** push to a branch and open the Deploy Preview.
- **On the draft, check:**
  - every link
  - one test signup per guide, using your own email
  - Netlify → Forms shows the `links-guide` form

## 3. Go live (after review)
1. Promote the deploy to production.
2. Change the Instagram bio link to `yourbestazliving.com/links?utm_source=instagram&utm_medium=bio` (or the clean URL).
3. Turn on the ManyChat keywords and the Flodesk workflows.

## 4. UTM convention (new; none existed)
`utm_source` = where (instagram, flodesk, links) · `utm_medium` = how (bio, dm, email, linkinbio, thankyou) · `utm_campaign` = what (manychat_ahwatukee, next_chapter, relocating…). All lowercase with underscores.

## 5. Editing later
- **Swap a guide:** edit the `GUIDES` object near the bottom of `links.html` (URL plus thank-you copy).
- **Featured home:** edit the "Current Featured Home" link and its subtitle line.
- **Tracking:** links carry `data-track` names. If Plausible or GA4 is added to the site later, clicks and signups report automatically.
