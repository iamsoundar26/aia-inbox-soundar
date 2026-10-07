#!/usr/bin/env python3
"""Re-home this static build under a URL prefix (e.g. a GitHub Pages project site).

Usage:  python3 set-base-path.py /my-repo-name      # host at https://user.github.io/my-repo-name/
        python3 set-base-path.py ""                 # back to the site root
The build ships rooted at "" (site root). Run this from the folder that contains index.html.
"""
import os, re, sys, json
new = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else ""
if new and not new.startswith("/"): new = "/" + new
here = os.path.dirname(os.path.abspath(__file__))
cfg = os.path.join(here, ".basepath")
old = open(cfg).read().strip() if os.path.exists(cfg) else ""
if old == new: print("already at", repr(new)); sys.exit()
def swap(s, a, b): return s.replace(a, b)
for root, _, files in os.walk(here):
    for f in files:
        if not f.endswith((".html", ".js", ".css", ".json")): continue
        p = os.path.join(root, f); s = open(p, encoding="utf-8").read(); o = s
        if f.endswith(".html"):
            s = re.sub(r'(href|src)="' + re.escape(old) + r'/', lambda m: m.group(1) + '="' + new + '/', s)  # covers _next, neo-light.css, neo-simple.js
            s = s.replace('"assetPrefix":"%s"' % old, '"assetPrefix":"%s"' % new)
        elif f.endswith(".js"):
            s = s.replace('basePath="%s"' % old, 'basePath="%s"' % new)
            if f.startswith("webpack-"):  # webpack publicPath
                s = s.replace('"%s/_next/"' % old, '"%s/_next/"' % new)
            if f.startswith("724-"):      # public asset prefix (ap/ar sheets, logo)
                s = s.replace('let ag="%s"' % old, 'let ag="%s"' % new)
            if f.startswith("main-"):     # Next runtime basePath helpers
                s = s.replace('addPathPrefix)(e,"%s")' % old, 'addPathPrefix)(e,"%s")' % new)
                s = s.replace('pathHasPrefix)(e,"%s")' % old, 'pathHasPrefix)(e,"%s")' % new)
                s = s.replace('path:"%s/_next/image/"' % old, 'path:"%s/_next/image/"' % new)
                s = s.replace('let n="%s";function o(e){return 0===n.length' % old, 'let n="%s";function o(e){return 0===n.length' % new)
        if s != o: open(p, "w", encoding="utf-8").write(s)
open(cfg, "w").write(new)
print("base path set to", repr(new))
