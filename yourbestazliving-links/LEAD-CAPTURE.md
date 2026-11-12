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

## Flodesk setup (Kari, about 15 minutes, no extra cost)

`FLODESK_API_KEY` is already stored in Netlify. Nothing else goes into Netlify; the function finds segments by name.

1. **Create these segments** in Flodesk (Audience → Segments). Spell them as shown; capitalization and punctuation don't matter.

   | Segment name | Purpose |
   |---|---|
   | `Links - Ahwatukee Guide` | Triggers Workflow A |
   | `Links - Next Chapter Guide` | Triggers Workflow B |
   | `Links - Monthly Edit` | Opt-ins from /links. Add this segment as a recipient of your monthly Edit send next to your existing list; Flodesk de-duplicates across segments |
   | `Journey - Living Locally` · `Journey - Relocating` · `Journey - Downsizing` · `Journey - Buying` | Branching inside workflows |

2. **Optional custom fields** (Audience → Custom fields, as text): `links_guide`, `links_journey`, `links_timeline`, `links_phone`, `links_source`, `links_campaign`. If you skip them, signups still sync; the function retries without them.
3. **Workflows.** Build them from `EMAILS.md`. Leave each one **paused** until you've reviewed it.
4. **Test on the preview with your own address:**
   - Submit once with "Relocating" chosen and once with "Downsizing".
   - Check the Netlify function log for `links-guide: flodesk upsert status=200` and any `segments not found` line.
   - Confirm the segments in Flodesk.
   - Then unsubscribe that address and submit again. The log should say `not modified`.

### Built-in safeguards in the function
- **No duplicates:** Flodesk creates or updates by email.
- **Respects opt-outs:** people who previously unsubscribed, bounced, or complained are **never** touched.
- **Monthly Edit only with consent:** the Edit segment is added only when the person chose the Edit or ticked its checkbox.
- **Privacy:** logs contain no names, emails, or phone numbers.
- **Inert until configured:** with no API key, it does nothing.
- **Doesn't break on errors:** if a custom field is rejected, the function retries without it. Network failures are logged and never block the visitor; the submission always stays in Netlify Forms.
- ⚠️ **Verify on the preview:** the Flodesk request format (`GET /v1/subscribers/{email}`, `GET /v1/segments`, `POST /v1/subscribers` with `segment_ids`) is written from Flodesk's public v1 API and hasn't been tested against your live account. Step 4 confirms it. The logic is unit-tested against a mocked API (10/10 pass).

### No-code alternative
If you'd rather not use the function, ignore it. Each week, export "links-guide" submissions from Netlify Forms as a CSV, then import them into Flodesk with the matching segment. Following your Master Database rule, import only people who gave email permission.

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
