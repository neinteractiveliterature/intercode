# Development

## Build Commands

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Type check
yarn run ts:check

# Generate GraphQL types
yarn graphql:codegen

# Run tests
yarn test
```

## Running the App Locally

- The dev app is at `https://intercode.test:5050` (the root site) and `https://<convention>.intercode.test:5050` (conventions, e.g. `intercony`). `http://localhost:3000` doesn't work: `force_ssl` redirects it to `https://localhost:3000`, but Puma there only speaks plain HTTP.
- Sign-in, sign-up and password reset routes (`/users/...`) only exist on the root site. On a convention host they 404 by design.
- If you're already logged in on the root site, `/users/password/new` bounces to `/oauth/callback` and shows "No current login flow found". Log out first.
- Dev mail goes over SMTP to [Mailpit](https://mailpit.axllent.org/) on `localhost:1025`. Read it at `http://localhost:8025` (API: `/api/v1/messages`).
- An aborted test run can leave the `intercode_test` database dirty, which shows up as "Domain has already been taken" from `create(:root_site)`. Truncating the tables (DatabaseCleaner) fixes it.

## Pre-Commit Hook

`.husky/pre-commit` runs lint-staged (oxlint, prettier, `rubocop -a`) on the staged files.

- It needs `node_modules`. In a fresh `git worktree`, run `yarn install --immutable` before the first commit, or the hook fails with `Couldn't find the node_modules state file`.
- Rubocop lints the whole file, not just your changes, so existing offenses in a file you touch can block your commit. For the GraphQL description cops (`GraphQL/ObjectDescription`, `FieldDescription`, `ArgumentDescription`), add the missing descriptions, then run `bin/rails graphql:update` so the checked-in schema and generated files pick them up.
- If the hook fails, nothing was committed. Check the commit output before you delete a branch or worktree.
- Don't bypass the hook with `--no-verify` or `HUSKY=0`. Fix the code, or use a targeted `rubocop:disable` comment for an existing offense you don't want to fix.

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
- Run `yarn run ts:check` to catch type errors early
