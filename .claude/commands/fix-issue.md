---
description: Read a GitHub issue, branch, plan, fix, and open a PR
argument-hint: [issue-number]
allowed-tools: Bash(gh issue view:*), Bash(gh issue list:*), Bash(gh project item-add:*), Bash(gh project item-edit:*), Bash(git checkout:*), Bash(git branch:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(gh pr create:*), Bash(gh pr edit:*), Bash(gh api:*), Bash(git status:*), Bash(git diff:*), Bash(git rev-parse:*), Bash(git log:*), Bash(yarn run tsc:*), Bash(bin/rails test:*), Bash(bundle exec rubocop:*), Bash(python3:*), Read, Write, Edit, Glob, Grep
---

## Issue to fix

Issue number: $ARGUMENTS

## Step 1: Read the issue

Fetch the issue details:

Issue content: !`gh issue view $ARGUMENTS --json title,body,labels,comments`

## Step 2: Move the issue to "In Progress"

Add the issue to the Intercode project board and set its status to "In Progress":

```bash
ISSUE_URL=$(gh issue view $ARGUMENTS --json url --jq '.url')
ITEM_ID=$(gh project item-add 1 --owner neinteractiveliterature --url "$ISSUE_URL" --format json | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
gh project item-edit --id "$ITEM_ID" --field-id PVTSSF_lADOABuqO84AAdTMzgAPetE --project-id PVT_kwDOABuqO84AAdTM --single-select-option-id 47fc9ee4
```

## Step 3: Create a branch

- Derive a short, descriptive branch name from the issue title (use kebab-case, prefix with the issue number, e.g. `1234-fix-login-bug`)
- Check out a new branch from `main`: `git checkout -b <branch-name>`

## Step 4: Plan

Before writing any code:

1. Explore the codebase to understand the relevant area(s) affected by the issue
2. Read the CLAUDE.md and agent-docs/ files if you need context about conventions
3. Formulate a clear plan: which files to change and what changes to make
4. Present the plan to the user and **wait for approval** before proceeding

## Step 5: Implement the fix

- Follow all conventions described in CLAUDE.md and the agent-docs/ topic guides
- Make the minimum changes necessary to fix the issue
- For TypeScript changes: run `yarn run tsc --noEmit` to check for type errors
- For Ruby changes: run `bin/rails test` on the relevant test file(s)
- Fix any errors before proceeding

## Step 6: Commit

- Stage all changes with `git add`
- Write a concise, descriptive commit message referencing the issue (e.g. `Fix login bug (#1234)`)
- Commit the changes

## Step 7: Open a PR

1. Push the branch: `git push -u origin <branch-name>`
2. Create a PR with `gh pr create`:
   - Title should summarize the fix
   - Body should reference the issue (`Fixes #<issue-number>`) and briefly describe what changed
3. Add labels using the GitHub REST API (required — gh pr edit is broken):

   ```
   gh api repos/neinteractiveliterature/intercode/issues/<PR-number>/labels -X POST -f 'labels[]=<category>' -f 'labels[]=<version-bump>'
   ```

   - Pick one category label: `bug`, `enhancement`, `feature`, `performance`, `refactor`, `documentation`, `testing`, `dependencies`
   - Pick one version bump label: `major`, `minor`, `patch`

## Important notes

- Do not skip the planning step or proceed without user approval
- Do not make changes beyond what is needed to fix the issue
- If you encounter an error you cannot resolve after 2-3 attempts, stop and ask the user for direction
