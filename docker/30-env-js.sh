#!/bin/sh
set -eu

CONFIG_FILE="/usr/share/nginx/html/env.js"

js_escape() {
    printf '%s' "$1" | sed \
        -e 's/\\/\\\\/g' \
        -e 's/"/\\"/g'
}

cat > "$CONFIG_FILE" <<EOF
window.__VYAPAR_CONFIG__ = {
  VITE_BASE_API_URL: "$(js_escape "${VITE_BASE_API_URL:-}")"
};
EOF
