#!/usr/bin/env bash
# Verifies the CSS/JS/font pipeline before any page layouts exist.
# Copies site/ to a temp dir, adds a throwaway home layout that calls the pipeline
# partials, builds with --gc --minify and asserts on the output. The real site is untouched.
# Usage: scripts/verify-pipeline.sh            (needs `hugo` on PATH or HUGO=/path/to/hugo)
set -euo pipefail
HUGO="${HUGO:-hugo}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE="$ROOT/site"
[ -d "$SITE/node_modules/@patternfly/patternfly" ] || { echo "Run npm ci in site/ first" >&2; exit 1; }

TMP="$(mktemp -d "${TMPDIR:-/tmp}/pipeline.XXXXXX")"
trap 'rm -rf "$TMP"' EXIT
rsync -a --exclude node_modules --exclude public --exclude resources "$SITE/" "$TMP/"
ln -s "$SITE/node_modules" "$TMP/node_modules"
cat > "$TMP/layouts/home.html" <<'EOF'
<!doctype html><html lang="en" class="no-js"><head>{{ partial "head/css.html" . }}</head>
<body><h1 class="pf-v6-c-title pf-m-4xl">Pipeline check</h1>{{ partial "head/js.html" . }}</body></html>
EOF

LOG="$TMP/build.log"
(cd "$TMP" && "$HUGO" build --gc --minify --logLevel warn) >"$LOG" 2>&1 || { cat "$LOG"; exit 1; }
fail=0
check() { if eval "$2"; then echo "ok   $1"; else echo "FAIL $1"; fail=1; fi; }
P="$TMP/public"
check "no ERROR/WARN in build log"            "! grep -Eq 'ERROR|WARN' '$LOG'"
check "CSS bundle emitted"                    "ls $P/css/bundle.min.*.css >/dev/null 2>&1"
check "JS bundle emitted"                     "ls $P/js/bundle.min.*.js >/dev/null 2>&1"
CSS="$(ls $P/css/bundle.min.*.css | head -1)"
check "bundle contains PatternFly base"       "grep -q 'pf-v6-c-button' '$CSS'"
check "bundle contains --ds-* tokens"         "grep -q -- '--ds-color-primary' '$CSS'"
check "bundle contains PF bridge"             "grep -q -- '--pf-t--global--color--brand--200:var(--ds-color-brand-600)' '$CSS'"
check "bundle contains site.css"              "grep -q 'site-masthead' '$CSS'"
check "theme.css precedes site.css"           "python3 -c \"s=open('$CSS').read(); import sys; sys.exit(0 if s.index('--ds-color-primary') < s.index('site-masthead') else 1)\""
check "Inter latin woff2 published"           "[ -f $P/css/assets/fonts/Inter/inter-latin-wght-normal.woff2 ]"
check "Inter latin-ext woff2 published"       "[ -f $P/css/assets/fonts/Inter/inter-latin-ext-wght-normal.woff2 ]"
check "Red Hat Mono (code font) published"    "ls $P/css/assets/fonts/RedHatMono/*.woff2 >/dev/null 2>&1"
check "Inter preload in HTML"                 "grep -q 'inter-latin-wght-normal.woff2' $P/index.html"
check "JS bundle contains theme.js"           "grep -q 'site-reveal' $P/js/bundle.min.*.js"
du -h "$CSS" | awk '{print "info CSS bundle size: "$1}'
echo "info gzip: $(gzip -c "$CSS" | wc -c) bytes"
exit $fail
