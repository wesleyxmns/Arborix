# Arborix Deploy Scripts

## 🚀 Quick Deploy

### Via npm script (Recommended)
```bash
npm run deploy
```

### Direct execution
```bash
./scripts/deploy.sh
```

### Via Claude Code slash command
```
/deploy
```

---

## 📋 What the Deploy Script Does

The automated deploy script handles the entire release process:

1. ✅ **Creates feature branch** - Based on feature name you provide
2. ✅ **Commits all changes** - With conventional commit format
3. ✅ **Pushes to GitHub** - Sets up remote tracking
4. ✅ **Creates Pull Request** - With detailed description
5. ✅ **Merges to main** - After your review
6. ✅ **Updates version** - In package.json
7. ✅ **Creates GitHub release** - With release notes
8. ✅ **Builds project** - Runs npm run build
9. ✅ **Publishes to npm** - Makes it available worldwide

---

## 🎯 Usage

### Interactive Mode

The script will prompt you for:

1. **Feature name**: e.g., `usability-improvements`, `new-feature`, `bug-fixes`
2. **New version**: e.g., `2.1.0`, `2.2.0`, `3.0.0`

Example interaction:
```bash
$ npm run deploy

🚀 Arborix Deploy Script
========================

⚠️  Warning: You have uncommitted changes

 M src/components/Tree.tsx
 A src/utils/helpers.ts

Continue anyway? (y/N) y

Enter feature name (e.g., 'usability-improvements'): my-awesome-feature

Current version: 2.1.0
Enter new version (e.g., 2.1.0): 2.2.0

📋 Deploy Summary:
  Branch: feature/my-awesome-feature
  Version: 2.1.0 → 2.2.0

Proceed with deploy? (y/N) y

🔄 Starting deploy process...
...
✅ Deploy complete!
```

---

## ⚠️ Prerequisites

Before running the deploy script, make sure you have:

1. ✅ **Git configured** - With your credentials
2. ✅ **GitHub CLI (gh) installed** - For PR and release creation
3. ✅ **npm authentication** - Logged in with `npm login`
4. ✅ **Write access** - To the GitHub repository
5. ✅ **All tests passing** - Run `npm test` if you have tests
6. ✅ **Clean build** - Run `npm run build` to verify

### Install GitHub CLI

If you don't have `gh` installed:

```bash
# macOS
brew install gh

# Linux
sudo apt install gh

# Windows
winget install GitHub.cli
```

Then authenticate:
```bash
gh auth login
```

---

## 🔧 Manual Deploy

If you prefer to deploy manually or the script fails, follow these steps:

### 1. Create branch and commit
```bash
git checkout -b feature/my-feature
git add -A
git commit -m "feat: my feature description"
git push -u origin feature/my-feature
```

### 2. Create and merge PR
```bash
gh pr create --title "My Feature" --body "Description" --base main
gh pr merge --squash --delete-branch
```

### 3. Update version
```bash
git checkout main
git pull
npm version 2.2.0 --no-git-tag-version
git add package.json
git commit -m "chore: bump version to 2.2.0"
git push
```

### 4. Create release
```bash
gh release create v2.2.0 --title "v2.2.0" --notes "Release notes" --latest
```

### 5. Publish
```bash
npm run build
npm publish
```

---

## 🐛 Troubleshooting

### Script fails at PR creation
- Make sure you have `gh` installed and authenticated
- Check that you have write access to the repository

### Script fails at npm publish
- Verify you're logged in: `npm whoami`
- Login if needed: `npm login`
- Check you have publish permissions for the package

### Version conflict
- Make sure the version doesn't already exist on npm
- Check existing releases: `npm view arborix versions`

### Merge conflicts
- Resolve conflicts manually before running the script
- Or skip the automated merge and merge manually via GitHub UI

---

## 📝 Script Customization

The deploy script can be customized by editing `scripts/deploy.sh`:

- **Commit message format**: Edit the `COMMIT_MSG` variable
- **PR template**: Edit the `PR_BODY` variable
- **Release notes**: Edit the `RELEASE_NOTES` variable
- **Pre/post deploy hooks**: Add custom commands before/after steps

---

## 🎉 Success Indicators

After a successful deploy, you should see:

1. ✅ New branch merged to main
2. ✅ Version updated in package.json
3. ✅ GitHub release created: `https://github.com/wesleyxmns/Arborix/releases/tag/vX.X.X`
4. ✅ npm package published: `https://www.npmjs.com/package/arborix`
5. ✅ Users can install: `npm install arborix@X.X.X`

---

## 🔐 Security Notes

- The script never stores credentials
- Authentication is handled by npm and gh CLI
- Review PR before merging (script pauses for review)
- Script exits on any error (`set -e`)

---

## 📚 Learn More

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [npm Publishing Guide](https://docs.npmjs.com/cli/v8/commands/npm-publish)
