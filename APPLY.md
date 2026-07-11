# Website update — NADO School · GYCO · About · Home

## What changed (9 files)
| File | Change |
|---|---|
| `learning.html` | Full NADO School rebuild: Become a School hero + CTA, School Beyond Walls, "Nado" = a choice to participate, **circular Learn·Own·Offer·Progress loop graphic** + 4 step cards, 8 field tiles, Where the Learning Happens (`#programs` anchor preserved), NADO→GYCO→WAWY journey, **Passport section with SVG mockup** (`#passport`), Your Journey Starts Today CTA |
| `student-community.html` | Hero one-liner, It Starts with Students (exact two-line closing kept), **From Ideas to Impact journey**, **GYCO Growth Loop** (Learn/Own/Offer/Progress/Learn Again), **What is OPUS? + new OPUS 1–6 cards**, OPUS 1 flagship deep dive kept, **Music With Purpose**, service history + quote + CTA kept |
| `about.html` | Full philosophy landing page: invitation hero, **animated NADO+NADO→WE merge figure**, **rotating One Loop diagram** (NADO+NADO=WE center), Learning→Action→Community→New learners flow, three expression pillars, **tri-circle Different Purposes**, closing vertical loop. (Old NOS section removed — say the word if you want it back on programs.html.) |
| `index.html` | Pathways section: mission line added; students section → "Students Created This. And They Keep Growing It." + Explore GYCO / Explore NADO School action cards; final CTA → "One Message Can Change a Moment…" + Partner With Us / Join the Circle cards |
| `js/partners.js` | New `audience` field ("For Cancer Patients" …) + short card descriptions per your copy. **Slugs, names, order, logos untouched.** |
| `js/site.js` | Pathway cards render audience subtitle; button now "Learn More" |
| `css/style.css` | v5 components: journey, field tiles, action cards, tri-circles, eco-loop + merge animations (reduced-motion safe), passport panel, 4-step loop grid |
| `test/smoke.test.js` | Updated for new content + new suites: About page (17 checks) and **redirect-stub / partner-slug integrity (13 checks)** |
| `EDITING-GUIDE.md` | File-map line for about.html refreshed |

## Verified
- `node test/smoke.test.js` → **153 passed, 0 failed**
- All 7 redirect stubs byte-identical to main; all 6 partner slugs unchanged
- Zero Learn·Create·Share·Grow remnants; every page hydrates nav/footer under the real JS bundle
- `#programs`, `#loop`, `#passport`, `#flagship` anchors intact

## Apply (no push happens until you say so)
```
# from repo root — copy the 9 files in, then:
node test/smoke.test.js        # expect 153 passed
git add index.html about.html learning.html student-community.html \
        css/style.css js/site.js js/partners.js test/smoke.test.js EDITING-GUIDE.md
git commit -m "Rebuild NADO School, GYCO, About, and homepage sections (Learn·Own·Offer·Progress)"
```
Then redeploy the folder to Vercel as usual.

## Two flags
1. `og:url` on the rebuilt pages still uses `akkk9202.github.io/...` to stay consistent with the rest of the site — a sitewide swap to `we-are-with-you.org` should be its own batch.
2. Your local uncommitted Batch 5 files may overlap these; I built from GitHub `main`, so reconcile locally before committing if Batch 5 touched the same files.
