# AI Accountant · Inbox (Soundar) — Neo in light theme

Static replica of https://sandeep-j-designs.github.io/aia-experiment/inbox/ with two changes:

- Profile is **Soundar R** (avatar `SR`, soundar.r@aiaccountant.com, greeting "Good …, Soundar").
- The Neo copilot panel uses a **light theme** with a cleaner layout (`neo-light.css`): white panel
  with a soft left shadow, centered welcome mark, quick-ask items as cards, pill composer with a
  primary send button, and a "Neo can make mistakes…" footnote. The rest of the app is untouched.

## Run locally

    cd aia-inbox-soundar
    python3 -m http.server 8000
    # open http://localhost:8000/inbox/

The build is rooted at `/`. It must be served over HTTP (not opened as a file) because the
Next.js bundles load from absolute `/_next/...` paths.

## Deploy to GitHub Pages (project site)

Project sites live under `https://<user>.github.io/<repo>/`, so re-home the build first:

    python3 set-base-path.py /<repo>     # e.g. /aia-inbox-soundar
    git add -A && git commit -m "Re-home under /<repo>" && git push

Run `python3 set-base-path.py ""` to move it back to the root. The current prefix is stored in
`.basepath`.

## Files

- `index.html`, `inbox/`, `inbox/<ID>/` — exported Next.js pages (profile strings patched).
- `_next/` — JS/CSS/font bundles and per-page data JSON (`_next/data/...`).
- `ap/`, `ar/` — the purchase/sales voucher sheet engine (HTML, CSS, JS) loaded by the document page.
- `images/logo.png` — app logo.
- `neo-light.css` — the Neo light-theme overrides, linked from every page.
- `set-base-path.py` — helper to change the hosting prefix.
