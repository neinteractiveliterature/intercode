---
description: Merge a PR and release it to production
argument-hint: [pr-number]
allowed-tools: Bash(gh pr checks:*), Bash(gh pr view:*), Bash(gh pr merge:*), Bash(gh run list:*), Bash(gh run view:*), Bash(gh run watch:*), Bash(gh release list:*), Bash(gh release view:*), Bash(gh release edit:*)
---

## PR to release

PR number: $ARGUMENTS

## Step 1: Wait for PR checks to pass

Poll until all checks on the PR succeed:

```bash
gh pr checks $ARGUMENTS --watch --interval 30
```

If any check fails, stop and report the failure to the user. Do not proceed.

## Step 2: Merge the PR

Merge the PR using a merge commit:

```bash
gh pr merge $ARGUMENTS --merge --delete-branch
```

## Step 3: Wait for main branch CI to complete

After merging, the CI workflow runs on `main`. Find the run triggered by the merge and wait for it:

```bash
gh run list --branch main --workflow ci.yml --limit 1 --json databaseId,status
```

Wait a few seconds if the run hasn't appeared yet, then watch it:

```bash
gh run watch <run-id> --interval 30
```

The `update-release-draft` job at the end of CI creates or updates the draft release. If any job on `main` fails, stop and report to the user.

## Step 4: Find the draft release

List recent releases to find the draft that was just updated:

```bash
gh release list --limit 5 --json tagName,name,isDraft
```

Identify the draft release (isDraft: true). Confirm its name with the user before publishing.

## Step 5: Publish the draft release

```bash
gh release edit <tag> --draft=false
```

## Step 6: Wait for the release workflow to complete

After publishing, the release workflow runs. Find and watch it:

```bash
gh run list --workflow release.yml --limit 1 --json databaseId,status
```

```bash
gh run watch <run-id> --interval 30
```

Once complete, report success to the user with the release name and a summary of what was released.
