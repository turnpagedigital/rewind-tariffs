#!/bin/bash
# ═══════════════════════════════════════════════════════
# Rewind Tariffs — Deploy to Cloudflare Pages via GitHub
# ═══════════════════════════════════════════════════════
# Prerequisites: gh (GitHub CLI), npm, wrangler (Cloudflare CLI)
#   brew install gh
#   npm install -g wrangler
#   gh auth login
#   wrangler login
# ═══════════════════════════════════════════════════════

set -e

REPO_NAME="rewind-tariffs"
BRANCH="main"

echo "═══ Rewind Tariffs Deploy ═══"
echo ""

# Step 1: Init git if needed
if [ ! -d ".git" ]; then
  echo "→ Initializing git repo..."
  git init -b main
  git add -A
  git commit -m "Initial commit: tariff refund landing page + claims platform"
else
  echo "→ Git repo already initialized"
fi

# Step 2: Create GitHub repo (private)
echo "→ Creating GitHub repo..."
if gh repo view "$REPO_NAME" &>/dev/null; then
  echo "  Repo already exists, skipping creation"
else
  gh repo create "$REPO_NAME" --private --source=. --push
  echo "  ✓ Created and pushed to github.com/$(gh api user -q .login)/$REPO_NAME"
fi

# Make sure remote is set and push
if ! git remote | grep -q origin; then
  gh repo create "$REPO_NAME" --private --source=. --push
fi
git push -u origin "$BRANCH" 2>/dev/null || true

# Step 3: Install deps and build
echo "→ Installing dependencies..."
npm install

echo "→ Building..."
npm run build

# Step 4: Deploy to Cloudflare Pages
echo "→ Deploying to Cloudflare Pages..."
npx wrangler pages project create "$REPO_NAME" --production-branch="$BRANCH" 2>/dev/null || true
npx wrangler pages deploy dist --project-name="$REPO_NAME"

echo ""
echo "═══════════════════════════════════════════"
echo "✓ Deployed! Your site is live at:"
echo "  https://$REPO_NAME.pages.dev"
echo ""
echo "To connect your custom domain (rewindtariffs.com):"
echo "  1. Go to dash.cloudflare.com → Pages → $REPO_NAME → Custom domains"
echo "  2. Add 'rewindtariffs.com' and 'www.rewindtariffs.com'"
echo "  3. Update your DNS to point to Cloudflare"
echo "═══════════════════════════════════════════"
