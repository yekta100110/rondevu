#!/usr/bin/env bash
# Fails when upstream brand residue reappears. Only the MIT LICENSE notice is exempt.
set -uo pipefail
cd "$(dirname "$0")/.."
EXCL=(':!LICENSE' ':!yarn.lock' ':!i18n.lock' ':!Style References' ':!scripts/check-brand-residue.sh' ':!**/CHANGELOG.md' ':!packages/prisma/migrations' ':!apps/web/public/rondevu_files')
fail=0
if git grep -n -I -i -E 'calcom|cal\.com|cal\.diy|calendso|cal_files' -- . "${EXCL[@]}" | grep -v -E 'LexicalComposer|ICAL\.Component'; then fail=1; fi
if git grep -n -I -E '\bCal\b|\bCAL_[A-Z]|--cal-|font-cal\b|data-cal-' -- . "${EXCL[@]}"; then fail=1; fi
[ "$fail" -eq 0 ] && echo "No brand residue." || { echo "Brand residue found." >&2; exit 1; }
