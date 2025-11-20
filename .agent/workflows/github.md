---
description: Automate GitHub flow: branch, commit, PR, release, merge
---

1. **Check Status**: Run `git status` to see what files are changed.
2. **Create Branch**: Propose a branch name based on the changes (e.g., `feature/context-menu-updates`) and create it: `git checkout -b <branch_name>`.
3. **Commit**: Stage all files (`git add .`) and commit with a descriptive message summarizing the changes (e.g., "feat: enhance context menu and fix selection logic").
4. **Push**: Push the branch to origin: `git push -u origin <branch_name>`.
5. **Create PR**: Create a Pull Request with a detailed description of what was done. Use `gh pr create --title "<Title>" --body "<Detailed Description>"`.
6. **Create Release**: If requested or appropriate, create a release using `gh release create <tag> --generate-notes`.
7. **Merge**: Merge the PR into main: `gh pr merge <branch_name> --merge --delete-branch`.
8. **Cleanup**: Switch back to main and pull: `git checkout main && git pull`.
