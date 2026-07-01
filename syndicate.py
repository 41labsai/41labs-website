#!/usr/bin/env python3
"""
syndicate.py — auto-publish a 41 Labs blog post to external platforms to earn
referring domains, with a canonical_url pointing back to 41labs.ai (so Google
treats 41labs.ai as the original — no duplicate-content penalty).

Platforms wired (both have clean write APIs + canonical support in 2026):
  - dev.to (Forem)   env: DEVTO_API_KEY
  - Hashnode         env: HASHNODE_TOKEN, HASHNODE_PUBLICATION_ID

NOT wired (by design):
  - Medium — public API / integration tokens were retired; no reliable automation.
  - LinkedIn — personal posting needs an approved OAuth app; do those manually.

Input: a markdown file with simple front matter:
    ---
    title: Best AI Consulting in Singapore (2026 Guide)
    canonical: https://41labs.ai/blog/best-ai-consulting-singapore
    tags: ai, singapore, consulting
    ---
    (markdown body...)

Usage:
    python3 syndicate.py post.md            # publish live to every configured platform
    python3 syndicate.py post.md --dry      # preview only, no network calls
    python3 syndicate.py post.md --only devto
"""
import os, sys, json, urllib.request, urllib.error

def load(path):
    raw = open(path, encoding="utf-8").read()
    meta, body = {}, raw
    if raw.startswith("---"):
        _, fm, body = raw.split("---", 2)
        for line in fm.strip().splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()
    tags = [t.strip() for t in meta.get("tags", "").split(",") if t.strip()]
    return meta.get("title", "").strip(), meta.get("canonical", "").strip(), tags, body.strip()

def _post(url, headers, payload):
    req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return True, json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return False, f"{e.code}: {e.read().decode()[:300]}"
    except Exception as e:
        return False, str(e)[:300]

def publish_devto(title, canonical, tags, body, dry):
    key = os.environ.get("DEVTO_API_KEY")
    if not key: return "devto", "skip (no DEVTO_API_KEY)"
    if dry: return "devto", f"[dry] would publish '{title}' canonical={canonical}"
    ok, res = _post("https://dev.to/api/articles",
        {"api-key": key, "Content-Type": "application/json"},
        {"article": {"title": title, "body_markdown": body, "published": True,
                     "canonical_url": canonical, "tags": tags[:4]}})
    return "devto", (res.get("url") if ok else f"ERROR {res}")

def publish_hashnode(title, canonical, tags, body, dry):
    token = os.environ.get("HASHNODE_TOKEN"); pub = os.environ.get("HASHNODE_PUBLICATION_ID")
    if not (token and pub): return "hashnode", "skip (no HASHNODE_TOKEN / HASHNODE_PUBLICATION_ID)"
    if dry: return "hashnode", f"[dry] would publish '{title}' canonical={canonical}"
    mutation = """mutation Publish($input: PublishPostInput!){ publishPost(input:$input){ post{ url } } }"""
    variables = {"input": {"title": title, "contentMarkdown": body, "publicationId": pub,
                 "originalArticleURL": canonical, "tags": [{"slug": t.replace(' ', '-'), "name": t} for t in tags[:5]]}}
    ok, res = _post("https://gql.hashnode.com/",
        {"Authorization": token, "Content-Type": "application/json"},
        {"query": mutation, "variables": variables})
    if ok and res.get("data", {}).get("publishPost"):
        return "hashnode", res["data"]["publishPost"]["post"]["url"]
    return "hashnode", f"ERROR {res}"

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    dry = "--dry" in sys.argv
    only = sys.argv[sys.argv.index("--only")+1] if "--only" in sys.argv else None
    if not args:
        print(__doc__); sys.exit(1)
    title, canonical, tags, body = load(args[0])
    if not title or not canonical:
        print("ERROR: front matter needs both 'title' and 'canonical'"); sys.exit(1)
    print(f"{'[DRY] ' if dry else ''}Syndicating: {title}\n  canonical: {canonical}\n  tags: {tags}\n")
    for fn in (publish_devto, publish_hashnode):
        name, result = fn(title, canonical, tags, body, dry)
        if only and name != only: continue
        print(f"  {name:9} -> {result}")

if __name__ == "__main__":
    main()
