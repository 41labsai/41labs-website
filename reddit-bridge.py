#!/usr/bin/env python3
"""
reddit-bridge.py — safe, human-in-the-loop bridge to r/SgAICommunity.

It does NOT auto-run a fake community. It lets Claude:
  - post content YOU approved (as your account / a disclosed mod bot)
  - read recent comments + your inbox so Claude can DRAFT replies for you
  - post a reply YOU approved to a specific comment

Auth + config come from ~/.config/41labs/reddit.env (never from chat).

Usage:
  python reddit-bridge.py test                       # verify auth
  python reddit-bridge.py comments [--limit 20]      # recent comments on the sub
  python reddit-bridge.py inbox                       # unread replies/mentions
  python reddit-bridge.py post --title T --body B [--flair "Tools"]
  python reddit-bridge.py reply --id <comment_id> --body B
Posting commands only run when explicitly invoked (that is the approval gate).
"""
import argparse, os, sys, pathlib

ENV = pathlib.Path.home() / ".config/41labs/reddit.env"

def load_env():
    if not ENV.exists():
        sys.exit(f"Missing {ENV}. Create it from the template and fill your Reddit app keys.")
    for line in ENV.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

def get_reddit():
    load_env()
    try:
        import praw
    except ImportError:
        sys.exit("praw not installed. Run: <venv>/bin/pip install praw")
    kwargs = dict(
        client_id=os.environ.get("REDDIT_CLIENT_ID"),
        client_secret=os.environ.get("REDDIT_CLIENT_SECRET"),
        user_agent=os.environ.get("REDDIT_USER_AGENT", "sgaicommunity-bridge/0.1 by 41labs"),
    )
    if os.environ.get("REDDIT_REFRESH_TOKEN"):
        kwargs["refresh_token"] = os.environ["REDDIT_REFRESH_TOKEN"]
    else:
        kwargs["username"] = os.environ.get("REDDIT_USERNAME")
        kwargs["password"] = os.environ.get("REDDIT_PASSWORD")
    missing = [k for k in ("client_id", "client_secret") if not kwargs.get(k)]
    if missing:
        sys.exit(f"Missing in reddit.env: {', '.join('REDDIT_'+m.upper() for m in missing)}")
    import praw
    return praw.Reddit(**kwargs)

def sub_name():
    return os.environ.get("REDDIT_SUBREDDIT", "SgAICommunity")

def cmd_test(r):
    me = r.user.me()
    print(f"Authenticated as u/{me}. Target sub: r/{sub_name()}")
    s = r.subreddit(sub_name())
    print(f"Subreddit: r/{s.display_name} — subscribers: {s.subscribers}")

def cmd_comments(r, limit):
    s = r.subreddit(sub_name())
    print(f"Recent comments in r/{sub_name()}:")
    n = 0
    for c in s.comments(limit=limit):
        print(f"\n[{c.id}] u/{c.author} on '{c.submission.title[:60]}'")
        print(f"    {c.body[:280].replace(chr(10),' ')}")
        n += 1
    if not n:
        print("  (none yet)")

def cmd_inbox(r):
    print("Unread inbox:")
    n = 0
    for item in r.inbox.unread(limit=25):
        who = getattr(item, "author", "?")
        print(f"\n[{item.id}] from u/{who}: {item.body[:280].replace(chr(10),' ')}")
        n += 1
    if not n:
        print("  (empty)")

def cmd_post(r, title, body, flair):
    s = r.subreddit(sub_name())
    kwargs = {"title": title, "selftext": body}
    if flair:
        for t in s.flair.link_templates.user_selectable():
            if t["flair_text"].lower() == flair.lower():
                kwargs["flair_id"] = t["flair_template_id"]; break
    submission = s.submit(**kwargs)
    print(f"POSTED: https://www.reddit.com{submission.permalink}")

def cmd_reply(r, cid, body):
    c = r.comment(id=cid)
    reply = c.reply(body)
    print(f"REPLIED: https://www.reddit.com{reply.permalink}")

def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("test")
    c = sub.add_parser("comments"); c.add_argument("--limit", type=int, default=20)
    sub.add_parser("inbox")
    po = sub.add_parser("post"); po.add_argument("--title", required=True); po.add_argument("--body", required=True); po.add_argument("--flair")
    re = sub.add_parser("reply"); re.add_argument("--id", required=True); re.add_argument("--body", required=True)
    a = p.parse_args()
    r = get_reddit()
    {"test": lambda: cmd_test(r),
     "comments": lambda: cmd_comments(r, a.limit),
     "inbox": lambda: cmd_inbox(r),
     "post": lambda: cmd_post(r, a.title, a.body, a.flair),
     "reply": lambda: cmd_reply(r, a.id, a.body)}[a.cmd]()

if __name__ == "__main__":
    main()
