#!/bin/bash

# Arborix Deploy Script
# Automates the complete deployment process

set -e # Exit on error

echo "🚀 Arborix Deploy Script"
echo "========================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project root?"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo ""
    git status --short
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Get feature name
echo ""
read -p "Enter feature name (e.g., 'usability-improvements'): " FEATURE_NAME

if [ -z "$FEATURE_NAME" ]; then
    echo "❌ Feature name is required"
    exit 1
fi

BRANCH_NAME="feature/${FEATURE_NAME}"

# Get version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo ""
echo "Current version: $CURRENT_VERSION"
read -p "Enter new version (e.g., 2.1.0): " NEW_VERSION

if [ -z "$NEW_VERSION" ]; then
    echo "❌ Version is required"
    exit 1
fi

# Confirm
echo ""
echo "📋 Deploy Summary:"
echo "  Branch: $BRANCH_NAME"
echo "  Version: $CURRENT_VERSION → $NEW_VERSION"
echo ""
read -p "Proceed with deploy? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "🔄 Starting deploy process..."
echo ""

# Step 1: Create branch
echo "1️⃣ Creating branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME" || git checkout "$BRANCH_NAME"

# Step 2: Add all changes
echo "2️⃣ Adding all changes..."
git add -A

# Step 3: Commit
echo "3️⃣ Committing changes..."
COMMIT_MSG="feat: $FEATURE_NAME

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git commit -m "$COMMIT_MSG" || echo "No changes to commit"

# Step 4: Push
echo "4️⃣ Pushing to GitHub..."
git push -u origin "$BRANCH_NAME"

# Step 5: Create PR
echo "5️⃣ Creating Pull Request..."
PR_TITLE="🚀 $FEATURE_NAME"
PR_BODY="# $FEATURE_NAME

Automated deploy via deploy script.

Version: $NEW_VERSION"

gh pr create --title "$PR_TITLE" --body "$PR_BODY" --base main || echo "PR already exists or failed"

# Step 6: Merge PR
echo "6️⃣ Merging Pull Request..."
read -p "Review the PR and press Enter to merge..."
gh pr merge --squash --delete-branch || echo "Merge failed or already merged"

# Step 7: Switch to main and pull
echo "7️⃣ Switching to main and pulling..."
git checkout main
git pull

# Step 8: Update version
echo "8️⃣ Updating version to $NEW_VERSION..."
npm version $NEW_VERSION --no-git-tag-version

# Step 9: Commit version bump
echo "9️⃣ Committing version bump..."
git add package.json package-lock.json 2>/dev/null || git add package.json
git commit -m "chore: bump version to $NEW_VERSION

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push

# Step 10: Create release
echo "🔟 Creating GitHub release..."
RELEASE_NOTES="# Release v$NEW_VERSION

See CHANGELOG for details.

Install:
\`\`\`bash
npm install arborix@$NEW_VERSION
\`\`\`"

gh release create "v$NEW_VERSION" --title "v$NEW_VERSION" --notes "$RELEASE_NOTES" --latest

# Step 11: Build
echo "🔨 Building project..."
npm run build

# Step 12: Publish to npm
echo "📦 Publishing to npm..."
npm publish

echo ""
echo "✅ Deploy complete!"
echo ""
echo "📌 Summary:"
echo "  ✓ Branch: $BRANCH_NAME"
echo "  ✓ Version: $NEW_VERSION"
echo "  ✓ GitHub Release: https://github.com/wesleyxmns/Arborix/releases/tag/v$NEW_VERSION"
echo "  ✓ npm: https://www.npmjs.com/package/arborix"
echo ""
echo "🎉 Arborix v$NEW_VERSION is live!"
