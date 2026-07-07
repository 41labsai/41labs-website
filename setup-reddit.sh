#!/bin/bash
# Securely capture Reddit API creds into ~/.config/41labs/reddit.env (0600).
# Values are typed locally into this prompt, never pasted into chat.
set -e
F="$HOME/.config/41labs/reddit.env"
mkdir -p "$(dirname "$F")"

echo "Enter your Reddit app details (from https://www.reddit.com/prefs/apps)"
read -r -p "  Client ID (under the app name): " CID
read -r -p "  Client secret: " CSEC
read -r -p "  Your Reddit username: " UN
read -r -s -p "  Your Reddit password (hidden): " PW; echo

python3 - "$F" "$CID" "$CSEC" "$UN" "$PW" <<'PY'
import sys, pathlib
f, cid, csec, un, pw = sys.argv[1:6]
vals = {
    "REDDIT_CLIENT_ID": cid,
    "REDDIT_CLIENT_SECRET": csec,
    "REDDIT_USERNAME": un,
    "REDDIT_PASSWORD": pw,
    "REDDIT_USER_AGENT": f"sgaicommunity-bridge/0.1 by u/{un}",
    "REDDIT_SUBREDDIT": "SgAICommunity",
}
lines = []
seen = set()
p = pathlib.Path(f)
existing = p.read_text().splitlines() if p.exists() else []
for line in existing:
    key = line.split("=", 1)[0].strip() if "=" in line and not line.strip().startswith("#") else None
    if key in vals:
        lines.append(f"{key}={vals[key]}"); seen.add(key)
    else:
        lines.append(line)
for k, v in vals.items():
    if k not in seen:
        lines.append(f"{k}={v}")
p.write_text("\n".join(lines) + "\n")
PY
chmod 600 "$F"
echo ""
echo "Saved to $F (0600). Tell Claude 'done' and it will test the connection."
