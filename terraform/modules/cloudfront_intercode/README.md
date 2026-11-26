# cloudfront_intercode Terraform module

Creates a CloudFront distribution for an Intercode deployment, with:

- The frontend (`index.html` and `assets/`) served from an S3 bucket
- No-cache pass-through to Rails for API/auth endpoints
- Crawler detection via a viewer-request CloudFront Function (`static_shell_router.js`):
  - Crawlers → `/og-shell?path=<original-path>` on Rails (per-resource OG metadata)
  - Regular users → `/index.html` from the bucket

## Usage

```hcl
provider "aws" {
  region = "us-east-1"
  alias  = "us_east_1"
}

module "cloudfront" {
  source = "path/to/modules/cloudfront_intercode"

  providers = {
    aws           = aws          # your default provider
    aws.us_east_1 = aws.us_east_1
  }

  name                 = "intercode-production"
  rails_origin_domain  = "www.neilhosting.net"

  static_shell_bucket_domain_name       = module.shell_bucket.bucket_regional_domain_name
  static_shell_origin_access_control_id = module.shell_bucket.origin_access_control_id

  aliases              = ["interconx.com", "www.interconx.com"]
  acm_certificate_arn  = "arn:aws:acm:us-east-1:123456789:certificate/abc-123"
}

# Point convention domains at the distribution.
resource "aws_route53_record" "interconx" {
  zone_id = data.aws_route53_zone.interconx.zone_id
  name    = "interconx.com"
  type    = "A"

  alias {
    name                   = module.cloudfront.distribution_domain_name
    zone_id                = module.cloudfront.distribution_hosted_zone_id
    evaluate_target_health = false
  }
}
```

## Provider aliases

Standard logging v2 resources must live in `us-east-1`, so this module requires a provider alias named
`aws.us_east_1` configured for that region. Pass it via the `providers` map as shown above.

## How requests are routed

The function attaches to the **viewer request** event of the **default cache behavior**, the catch-all for SPA
routes. More specific behaviors take precedence:

| Path pattern  | Origin | Function | Cache TTL                                                      |
| ------------- | ------ | -------- | -------------------------------------------------------------- |
| `/assets/*`   | Bucket | None     | Long (immutable)                                               |
| Rails paths   | Rails  | None     | No cache                                                       |
| `/og-shell`   | Rails  | None     | Keyed on `path` query param + Host                             |
| `*` (default) | Bucket | Router   | `static_shell_ttl` (60 s), keyed on the `path` query parameter |

The function runs before the cache lookup on every request, so the rewritten URI and query string are what key the
cache, and a crawler's response is never served to a browser, or the reverse.

- Browsers get `/index.html` from the bucket. Their query strings are dropped, so tracking parameters can't fragment
  the cache.
- Crawlers, and any Rails path that reaches the default behavior, get the Rails origin with the viewer's `Host` header
  (an S3 origin can't take one, so the default behavior has no origin request policy). Crawlers get
  `/og-shell?path=...`.
- `/og-shell`: keyed on `Host` and `path`. Rails marks these responses `max-age=0, private`, so they aren't cached.

### Adding a route or crawler

`routing.json` is the one place to edit:

- `rails_paths`: routes that Rails owns. Each becomes a no-cache pass-through behavior (Terraform reads the file
  directly), is exempt from the router function, and is proxied by the reference nginx config. `/foo/*` is a prefix
  (it doesn't match `/foo` itself); anything else is an exact path.
- `shell_paths` and `asset_paths`: the `/og-shell` and `/assets/*` behaviors, which `main.tf` still spells out. A test
  fails if `main.tf` and `routing.json` disagree.
- `crawler_user_agents`: the user agents that get `/og-shell`.

After editing it, run `yarn routing:codegen` and commit the result. That rewrites the generated section of
`static_shell_router.js` (a CloudFront Function can't read files) and the two files in `nginx/`; CI runs
`yarn routing:check` and fails if they are stale. Tests for the function run with Vitest
(`yarn vitest run terraform/modules/cloudfront_intercode`).

## The frontend bucket

Both of these are required, and come from an `assets_bucket_intercode` instance:

- `static_shell_bucket_domain_name`: the bucket's `bucket_regional_domain_name`
- `static_shell_origin_access_control_id`: the bucket's `origin_access_control_id`

Use **a separate bucket** for this, not one that serves another host's assets: the release upload marks every file under
its prefix that the new release lacks as obsolete, and two builds would otherwise mark each other's files. The bucket's
policy must let this distribution read it: set `allow_account_cloudfront_distributions` on the bucket, or put this
distribution's ARN in `cloudfront_distribution_arns`. Otherwise S3 answers with a 403.

Releases upload the build with the `framework-shell-release-hashed` and `framework-shell-release-publish` jobs in
`.github/workflows/release.yml`, which run `script/uploadFrameworkAssets.sh` in two phases: the hashed files with a long
`Cache-Control` alongside the Fly deploy, then, once `fly-release` has finished, `index.html` with
`max-age=60` (keep that in step with `static_shell_ttl`) and `stale-while-revalidate=300`, and finally the files that
release dropped are marked obsolete.

CloudFront cuts the stale-while-revalidate window off at the cache policy's maximum TTL, so the full window needs
policies from `cloudfront_intercode_policies` with `static_shell_max_ttl` of at least 300, passed in as
`shared_policies`.

Set the repository variables `FRAMEWORK_SHELL_BUCKET` and `FRAMEWORK_SHELL_UPLOAD_ROLE_ARN` (from the bucket module's
`bucket_name` and `release_upload_role_arn`) to turn the upload on. The image it uploads from is only built when the
repository variable `BUILD_FRAMEWORK` is set.

## Upgrading from the Rails-rendered shell

This module no longer has a mode where Rails renders the shell, or a `/packs/*` behavior. Remove the
`assets_origin_domain`, `static_shell_enabled` and `cdn_spa_shell_ttl` arguments, and pass the two bucket variables.

## Other web servers

Deployments without CloudFront can do the same routing in nginx. `nginx/crawler-map.conf` (include in the `http`
block) and `nginx/rails-locations.conf` (include in the `server` block) are generated from the same file. The
second expects an upstream named `rails` and `/etc/nginx/proxy_params.conf`. Send crawlers to
`/og-shell?path=<original path>` from `location /` when `$is_crawler` is set.

The `intercode-assets` image ships a complete nginx configuration built from these files, with a docker-compose
example and notes for deployers: see [the deployment guide](https://intercode.interactiveliterature.org/docs/deploying).

## Upgrading from the Lambda@Edge router

Earlier versions of this module routed crawlers with a Lambda@Edge origin-request function. Upgrading removes it, and
a plain `tofu apply` on an existing deployment **cannot succeed**:

- The distribution update (which drops the Lambda association) is ordered _after_ the Lambda's destruction.
- AWS will not delete a Lambda@Edge function while a distribution still uses it, or until its edge replicas are gone,
  which can take a few hours after the distribution stops using it.

So the Lambda delete fails, and the distribution never gets updated. Do it in two steps:

1. Update the distributions on their own. Targeting them leaves the Lambda destroys out of the plan:

   ```
   tofu apply \
     -target='module.<your module>.aws_cloudfront_distribution.this'
   ```

   (add a `-target` for each distribution, such as one per `for_each` key). Check the plan first: it should show only
   the distributions changing, with 0 to destroy.

2. Wait a few hours, then run a plain `tofu apply` to delete the old Lambda functions and their IAM roles. Until the
   edge replicas are gone this step errors, which is harmless because nothing uses the functions any more.

## Host header forwarding

Intercode uses the `Host` header to resolve the convention for each request.
The origin-request policies in this module forward the viewer's `Host` header
to the Rails origin, so multi-tenant routing works correctly behind CloudFront.

## Sharing cache policies between distributions

An AWS account can only hold 20 cache policies (and a limited number of origin request policies), and each distribution
needs 3 cache policies and 2 origin request policies of its own. They don't depend on the distribution, so with more than
a few distributions, create one set with the [`cloudfront_intercode_policies`](../cloudfront_intercode_policies) module and
give every distribution the same `shared_policies`:

```hcl
module "intercode_cloudfront_policies" {
  source = "github.com/neinteractiveliterature/intercode//terraform/modules/cloudfront_intercode_policies"
  name   = "intercode-shared"
}

module "convention_cloudfront" {
  source          = "github.com/neinteractiveliterature/intercode//terraform/modules/cloudfront_intercode"
  # ...
  shared_policies = {
    cache_policy_ids          = module.intercode_cloudfront_policies.cache_policy_ids
    origin_request_policy_ids = module.intercode_cloudfront_policies.origin_request_policy_ids
  }
}
```

Without `shared_policies`, the distribution creates its own set, so existing users of the module don't have to change
anything. To move a distribution that already has its own set to a shared one, use `moved` blocks to make one
distribution's policies (at `module.<instance>.module.policies[0].<resource>`) the shared ones, and the others' are
destroyed once their distributions point at the shared set. A plan shows the policies renamed in place and the other
distributions updated in place; none is replaced.

## Inputs

| Name                                    | Description                                                                                                                                                                 | Default          |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `name`                                  | Resource name prefix                                                                                                                                                        | —                |
| `rails_origin_domain`                   | Rails app domain                                                                                                                                                            | —                |
| `aliases`                               | CloudFront CNAMEs                                                                                                                                                           | `[]`             |
| `acm_certificate_arn`                   | ACM certificate ARN (us-east-1)                                                                                                                                             | `null`           |
| `price_class`                           | CloudFront price class                                                                                                                                                      | `PriceClass_100` |
| `static_shell_bucket_domain_name`       | Regional domain name of the shell bucket; required                                                                                                                          | —                |
| `static_shell_origin_access_control_id` | Origin access control ID of the shell bucket; required                                                                                                                      | —                |
| `static_shell_ttl`                      | Edge TTL for the static shell (seconds)                                                                                                                                     | `60`             |
| `og_shell_ttl`                          | TTL for `/og-shell` responses (seconds)                                                                                                                                     | `3600`           |
| `shared_policies`                       | Cache and origin request policies to use, from [`cloudfront_intercode_policies`](../cloudfront_intercode_policies); this module creates its own set when `null` (see below) | `null`           |
| `access_logs_enabled`                   | Deliver access logs to the destination below                                                                                                                                | `false`          |
| `access_log_delivery_destination_arn`   | CloudWatch Logs delivery destination for access logs (from [`cloudfront_intercode_logging`](../cloudfront_intercode_logging)); no access logs when `null`                   | `null`           |

## Outputs

| Name                          | Description                                |
| ----------------------------- | ------------------------------------------ |
| `distribution_id`             | CloudFront distribution ID                 |
| `distribution_domain_name`    | Use as CNAME target for convention domains |
| `distribution_hosted_zone_id` | Use for Route 53 alias records             |
