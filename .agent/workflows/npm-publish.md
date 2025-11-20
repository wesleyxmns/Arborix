---
description: Publish package to NPM registry
---

// turbo-all
1. **Update Version**: Run `pnpm version patch` (or `minor`/`major` depending on changes) to update package.json version.
2. **Build Package**: Run `pnpm build` to ensure the package is built with latest changes.
3. **Publish to NPM**: Run `pnpm publish --access public` to publish the package to NPM registry.
4. **Verify**: Check that the package was published successfully at https://www.npmjs.com/package/@wesleyxmns/arborix
