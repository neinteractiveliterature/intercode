# Development

## Build Commands

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Type check
yarn run tsc --noEmit

# Generate GraphQL types
yarn graphql:codegen

# Run tests
yarn test
```

## Pull Request Labels

When creating PRs, apply two kinds of labels:

**Category labels** (used by release-drafter to group changes in release notes):

- `enhancement` or `feature` — new features
- `bug`, `bugfix`, or `fix` — bug fixes
- `chore` — maintenance/refactoring with no user-facing change
- `dependencies` — dependency updates

**Version bump labels** (used by release-drafter to determine the next version number):

- `major` — breaking changes (bumps major version, e.g. 1.x.x → 2.0.0)
- `minor` — non-breaking new features (bumps minor version, e.g. 1.2.x → 1.3.0)
- `patch` — bug fixes and small improvements (bumps patch version, e.g. 1.2.3 → 1.2.4)

Every PR should have one category label and one version bump label. If no version bump label is set, release-drafter defaults to `patch`.

## Tips

- Check existing patterns in similar files
- Look for `*.generated.ts` files for type definitions
- Use TypeScript's "Go to Definition" to understand type structures
- Run `yarn run tsc --noEmit` to catch type errors early
