# Phase 3: Lead Capture, Flodesk & ManyChat

## How a signup flows

```
Instagram bio / ManyChat DM ──► yourbestazliving.com/links?guide=…&utm_…
                                        │
                     ┌──────────────────┴──────────────────┐
           Guide opens instantly on page      Netlify Forms stores the submission
           (Drive link, no email needed)      ("links-guide", spam-filtered, emails Kari)
                                                         │
                                  netlify/functions/submission-created.mjs
                                  (only runs for "links-guide"; inert until keys are set)
                                                         │
                       Flodesk: create/update by email ──► segments trigger workflows
```

Why this design: it uses the Netlify Forms setup the site already has, so leads are captured on day one even before Flodesk is connected. The guide is delivered on the page immediately. Flodesk only takes over the email side once you add the API key.

## The form (low friction)

- **Required:** first name, email, plus which guide (preselected by the button they tapped).
- **Optional, collapsed under "Tell me a little more":**
  - journey: *I live here* / *Relocating* / *Downsizing or selling* / *Exploring or buying*
  - timeline
  - phone
- **Monthly Edit:** a separate checkbox, **unchecked by default**. Choosing "Just the Monthly Arizona Edit" counts as the consent, so the checkbox hides.
- **Disclosure** under the button explains the follow-up emails and the unsubscribe link, and says the information is never sold or shared.
- **Spam:** honeypot field plus Netlify's spam filter (the function only fires on verified submissions).

## Flodesk setup (Kari, about 20 minutes)

1. **Segments.** Create these in Audience → Segments. Reuse an existing segment if one already matches; don't make duplicates.

   | Key in `FLODESK_SEGMENTS` | Segment name | Purpose |
   |---|---|---|
   | `guide:ahwatukee` | Links · Ahwatukee Guide | Triggers Workflow A |
   | `guide:next-chapter` | Links · Next Chapter Guide | Triggers Workflow B |
   | `edit` | **Your existing Monthly Edit list segment** | Monthly newsletter, opt-in only |
   | `journey:local` | Journey · Living Locally | Branching |
   | `journey:relocating` | Journey · Relocating | Branching |
   | `journey:downsizing` | Journey · Downsizing / Selling | Branching |
   | `journey:buying` | Journey · Exploring / Buying | Branching |

2. **Custom fields.** Add these in Audience → Custom fields, as text fields: `links_guide`, `links_journey`, `links_timeline`, `links_phone`, `links_source`, `links_campaign`. They show which guide and which post or DM produced each lead.
3. **API key.** Create one in Flodesk → Integrations → API keys.
4. **Netlify environment variables.** Add these in Site settings → Environment variables (never put them in the code):
   - `FLODESK_API_KEY` = the key
   - `FLODESK_SEGMENTS` = for example `{"guide:ahwatukee":"<id>","guide:next-chapter":"<id>","edit":"<id>","journey:local":"<id>","journey:relocating":"<id>","journey:downsizing":"<id>","journey:buying":"<id>"}`
5. **Workflows.** Build them from `EMAILS.md`. Leave each one **paused** until you've reviewed it.
6. **Test with your own address first:**
   - Submit once with "Relocating" chosen and once with "Downsizing".
   - Confirm in Netlify (Functions log) and in Flodesk that the subscriber shows the right segments.
   - Then unsubscribe that address and submit again. The function should log `not modified`.

### Built-in safeguards in the function
- **No duplicates:** Flodesk creates or updates by email.
- **Respects opt-outs:** people who previously unsubscribed, bounced, or complained are **never** touched.
- **Monthly Edit only with consent:** the Edit segment is added only when the person chose the Edit or ticked its checkbox.
- **Privacy:** logs contain no names, emails, or phone numbers.
- **Inert until configured:** with no API key, it does nothing.
- ⚠️ **Verify before enabling:** the Flodesk endpoint shapes (`GET /v1/subscribers/{email}` and `POST /v1/subscribers` with `segment_ids` and `custom_fields`) are written from Flodesk's public v1 API. Confirm them against Flodesk's current API docs during step 6. The logic itself is unit-tested against a mocked API (7/7 pass).

### No-code alternative
If you'd rather not use the function, skip steps 3–4. Each week, export "links-guide" submissions from Netlify Forms as a CSV, then import them into Flodesk with the matching segment. Following your Master Database rule, import only people who gave email permission.

## ManyChat keywords (ready to paste; needs your ManyChat login)

All three use **comment or DM keyword → DM reply with one button**. Keep the reply personal and short. The links carry UTMs, so you'll see in Netlify and Flodesk which keyword converts.

| Keyword | DM reply | Button | URL |
|---|---|---|---|
| **AHWATUKEE** | "Hi {first name}! Here's my Ahwatukee guide: the coffee, trails and spots I send everyone to when they move here. Tap below and it's yours. 🌵" | Get the guide | `https://yourbestazliving.com/links?guide=ahwatukee&utm_source=instagram&utm_medium=dm&utm_campaign=manychat_ahwatukee#get` |
| **TRAILS** | "Love this! These are the South Mountain trails I actually hike (Desert Classic is my everyday one). Enjoy, and tell me which one you try first." | See my trail list | `https://yourbestazliving.com/trail?utm_source=instagram&utm_medium=dm&utm_campaign=manychat_trails` *(confirm /trail is live; backup is the Trail List JPG link in AUDIT.md)* |
| **NEXT** | "Thanks for reaching out, {first name}. I'd love to hear where you're headed. Want to grab 30 minutes? No pressure, just a plan." | Pick a time | `https://calendly.com/kari-yourbestazliving/lets-create-a-plan?utm_source=instagram&utm_medium=dm&utm_campaign=manychat_next` |

**Optional second button for NEXT:** "Start with the guide" → `https://yourbestazliving.com/links?guide=next-chapter&utm_source=instagram&utm_medium=dm&utm_campaign=manychat_next#get`

This follows the note in your Nov carousel caption doc: the NEXT reply starts a conversation and doesn't promise a guide that doesn't exist.

**Instagram bio link:** `yourbestazliving.com/links?utm_source=instagram&utm_medium=bio`. Instagram's in-app browser often hides where visitors came from, so the UTM keeps bio traffic separate from DM traffic. If you'd rather show a clean URL in your bio, use `yourbestazliving.com/links`; you'll just lose that split.
