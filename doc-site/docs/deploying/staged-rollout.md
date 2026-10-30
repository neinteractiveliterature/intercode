---
sidebar_position: 2
---

# Staged rollout of the framework-mode build

This is the plan for moving a deployment that uses the [`cloudfront_intercode`](https://github.com/neinteractiveliterature/intercode/blob/main/terraform/modules/cloudfront_intercode)
module from the Rails-rendered shell (the data-mode build) to the static framework-mode shell served from S3, one
convention domain at a time. It is part of the migration tracked in
[#12219](https://github.com/neinteractiveliterature/intercode/issues/12219) and
[#12260](https://github.com/neinteractiveliterature/intercode/issues/12260).

Nothing here removes the data-mode build. Every release still builds and publishes both, so each step can be undone by
changing one Terraform variable. The code cutover (v9.0.0), which makes the framework build the only one and gives the
Rails image its own copy of the shell, comes after this rollout is finished. Domains that Rails serves directly, with no
CloudFront in front, move with that release.

## Before the first domain

- The repository variables `BUILD_FRAMEWORK`, `FRAMEWORK_SHELL_BUCKET` and `FRAMEWORK_SHELL_UPLOAD_ROLE_ARN` are set, so
  every release builds the framework image and uploads it to the shell bucket. Leave them set for the whole rollout:
  unsetting `BUILD_FRAMEWORK` while the bucket is in use means the bucket stops getting new releases.
- The shell bucket comes from [`assets_bucket_intercode`](https://github.com/neinteractiveliterature/intercode/blob/main/terraform/modules/assets_bucket_intercode) (a separate
  bucket from the one for `/packs/*`), and its bucket policy lets the distribution you are about to change read it (set
  `allow_account_cloudfront_distributions`, or list the distribution in `cloudfront_distribution_arns`; without one of
  them S3 answers that distribution with a 403).
- At least one release has uploaded to it. Check the bucket has `index.html` and an `assets/` directory.
- The distribution has access logs on (`access_logs_enabled`, from
  [`cloudfront_intercode_logging`](https://github.com/neinteractiveliterature/intercode/blob/main/terraform/modules/cloudfront_intercode_logging)), and the logging module's 5xx
  alarm has an `alarm_actions` topic someone reads. Both are what you will be watching.

## The order

1. **P** (for example `p.interconlarp.org`), the test bed.
2. **I**, once P has been quiet through at least one release.
3. The rest of the CloudFront domains, together or in small groups.
4. The cutover release (v9.0.0), which moves everything that Rails serves directly.

Each step is the same change on one distribution:

```hcl
static_shell_enabled                  = true
static_shell_bucket_domain_name       = module.shell_bucket.bucket_regional_domain_name
static_shell_origin_access_control_id = module.shell_bucket.origin_access_control_id
```

After the apply, the distribution takes a few minutes to deploy. Let it finish before testing.

## Checking a domain

Do this right after the apply, and again after the first release that lands while the domain is on the static shell.

- **The shell comes from the bucket.** `curl -sI https://<host>/` returns the shell with `Cache-Control: max-age=60`
  (the same value as `static_shell_ttl`), and a deep link such as `/events` returns the same document. A request for a
  file under `/assets/` that doesn't exist is a 404, not the shell.
- **Crawler previews.** A link-preview user agent gets per-resource metadata from Rails, not the shell:

  ```sh
  curl -s -A 'Slackbot-LinkExpanding 1.0' https://<host>/events/<an event id> | grep -E 'og:(title|url)'
  ```

  `og:title` should be the event's title and `og:url` the page's own address. Paste a link into Slack as well, since
  that is the real consumer.

- **Sign-in.** In a private window: sign in, reload (still signed in), open another page, sign out, reload (still
  signed out). Sign-in goes through the root site's sign-in page, so check that the round trip ends signed in on the
  domain you started from.
- **A page that needs the API.** Open a page with a loader, such as an event, and an admin page if you have the access.
  These fail loudly if `/graphql` or `/client_configuration` isn't reaching Rails.
- **A stale tab survives a release.** Leave a tab open on the site across a release, then click through to a page you
  haven't opened yet. It should keep working, because the bucket keeps the earlier release's files, and if a file is
  missing the app reloads once and then shows a message with a reload button.

## What to watch

- **The 5xx alarm** from `cloudfront_intercode_logging`. It counts responses, not a rate, because these sites see tens
  to hundreds of requests a day. Requests to a raw `*.cloudfront.net` name are excluded.
- **Logs Insights** on the `/cloudfront/<name>` log group, for anything that is failing but not 5xx:

  ```
  filter `sc-status` like /^5/
  | stats count(*) by `x-host-header`, `cs-uri-stem`
  ```

  Also look at 404s under `/assets/`, which mean a page is asking for a file the bucket doesn't have:

  ```
  filter `sc-status` like /^404$/ and `cs-uri-stem` like /^\/assets\//
  | stats count(*) by `x-host-header`, `cs-uri-stem`
  ```

  4xx responses overall are not alarmed on: anonymous visitors get an expected 401 from `/oauth_session/refresh` on
  every page load.

- **Sentry and Rollbar** for new frontend errors from the domain after the change.
- **Your release workflow.** The `framework-shell-release-*` jobs have to succeed, or the bucket is a release behind.

Leave each domain on the static shell for at least one release and a few days of normal traffic before moving the next.

## Rolling back

Remove the three variables above (or set `static_shell_enabled = false`) and apply. The default behavior goes back to the
Rails origin, and Rails renders the shell and loads the data-mode build from `/packs/`. The distribution takes a few
minutes to deploy, and a browser that already has the static shell keeps it until it reloads the page. Nothing else
changes with it: the API, the sign-in cookies and the database are the same in both modes, so a tab open on either build
keeps talking to the same backend.

Don't delete the bucket or unset the repository variables to roll back; leaving them in place means going forward again
is the same one-line change.

This only works while releases still build the data-mode build. Once v9.0.0 is out it no longer does, and a rollback is
redeploying the last 8.x image to Fly and removing the static shell variables.
