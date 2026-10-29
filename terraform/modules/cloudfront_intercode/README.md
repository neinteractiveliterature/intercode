# cloudfront_intercode Terraform module

Creates a CloudFront distribution in front of an Intercode Rails origin with:

- Long-TTL caching of `/packs/*` from the assets server
- No-cache pass-through for API/auth endpoints
- Crawler detection via a viewer-request CloudFront Function (`crawler_router.js`):
  - Crawlers → `/og-shell?path=<original-path>` (per-resource OG metadata)
  - Regular users → `/cdn-spa-shell` (lightweight shell, convention-level OG only)

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
  assets_origin_domain = "assets.neilhosting.net"
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

| Path pattern            | Origin        | Function | Cache TTL                          |
| ----------------------- | ------------- | -------- | ---------------------------------- |
| `/packs/*`              | Assets server | None     | Long (immutable)                   |
| `/client_configuration` | Rails         | None     | No cache                           |
| `/authenticity_tokens`  | Rails         | None     | No cache                           |
| `/oauth_session/*`      | Rails         | None     | No cache                           |
| `/og-shell`             | Rails         | None     | Keyed on `path` query param + Host |
| `/cdn-spa-shell`        | Rails         | None     | Keyed on Host; long                |
| `*` (default)           | Rails         | Router   | Keyed on Host + `path` query param |

The function runs before the cache lookup on every request, so the rewritten URI and query string are what key the
cache. A crawler's response can therefore never be served to a browser, or the reverse. (The router used to be a
Lambda@Edge origin-request function, which only ran on a cache miss, so a crawler could be served a browser's cached
generic shell.) The default behavior's cache policy includes `path` in the key; without it every crawled page would
share one `/og-shell` entry.

- `/cdn-spa-shell`: the content varies per convention domain, hence `Host` in the key. Rails sends a one-day TTL.
- `/og-shell`: keyed on `Host` and `path`. Rails marks these responses `max-age=0, private`, so they aren't cached.
- Browsers' query strings are dropped, so tracking parameters can't fragment the cache.

### Adding a route or crawler

`routing.json` is the one place to edit:

- `rails_paths`: routes that Rails owns. Each becomes a no-cache pass-through behavior (Terraform reads the file
  directly), is exempt from the router function, and is proxied by the reference nginx config. `/foo/*` is a prefix
  (it doesn't match `/foo` itself); anything else is an exact path.
- `shell_paths` and `asset_paths`: the shell and `/packs/*` behaviors, which `main.tf` still spells out. A test
  fails if `main.tf` and `routing.json` disagree.
- `crawler_user_agents`: the user agents that get `/og-shell`.

After editing it, run `yarn routing:codegen` and commit the result. That rewrites the generated section of
`crawler_router.js` (a CloudFront Function can't read files) and the two files in `nginx/`; CI runs
`yarn routing:check` and fails if they are stale. Tests for the function run with Vitest
(`yarn vitest run terraform/modules/cloudfront_intercode`).

## Serving the shell from S3 (framework-mode build)

By default the default behavior is a Rails origin, and Rails renders the shell. The framework-mode build is a static
`index.html` plus hashed files in `assets/`, which can be served from an S3 bucket instead. Set `static_shell_enabled = true`
and both of:

- `static_shell_bucket_domain_name`: the bucket's `bucket_regional_domain_name`
- `static_shell_origin_access_control_id`: the bucket's `origin_access_control_id`

Both come from an `assets_bucket_intercode` instance. Use **a separate bucket** for this, not the one that serves
`/packs/*`: the release upload marks every file under its prefix that the new release lacks as obsolete, and the two
builds would otherwise mark each other's files. The bucket's `cloudfront_distribution_arns` must include this
distribution's ARN. Then:

| Path pattern  | Origin              | Function            | Cache TTL                                                      |
| ------------- | ------------------- | ------------------- | -------------------------------------------------------------- |
| `/assets/*`   | Static shell bucket | None                | Long (immutable)                                               |
| Rails paths   | Rails               | None                | As above                                                       |
| `*` (default) | Static shell bucket | Static shell router | `static_shell_ttl` (60 s), keyed on the `path` query parameter |

The default behavior's function is `static_shell_router.js` instead of `crawler_router.js`. Browsers get
`/index.html` from the bucket. Crawlers, and any Rails path that reaches it, get the Rails origin with the viewer's
`Host` header (an S3 origin can't take one, so the default behavior has no origin request policy), and crawlers get
`/og-shell?path=...`. It is generated from `routing.json` like the other one, and `/assets/*` is in `asset_paths`.

Releases upload the build with the `framework-shell-release` job in `.github/workflows/release.yml`, which runs
`script/uploadFrameworkAssets.sh`: the hashed files with a long `Cache-Control`, then `index.html` with
`max-age=60` (keep that in step with `static_shell_ttl`), then it marks the files that release dropped as obsolete.
Set the repository variables `FRAMEWORK_SHELL_BUCKET` and `FRAMEWORK_SHELL_UPLOAD_ROLE_ARN` (from the bucket module's
`bucket_name` and `release_upload_role_arn`) to turn it on. The image it uploads from is only built when the repository
variable `BUILD_FRAMEWORK` is set.

**Trying it out:** create the bucket and a distribution with the static shell variables set and no aliases, run the "Upload
framework-mode build to bucket" workflow for a commit, and fetch the distribution's `cloudfront.net` domain with a
`Host` header for a convention, once as a browser and once as a crawler. The shell should come from the bucket, the
crawler's response from Rails, and a missing `/assets/...` file should be a 404.

**Rolling back** is removing `static_shell_enabled` (and the two variables). The next apply puts the Rails origin and the Rails-rendered shell back.

## Other web servers

Deployments without CloudFront can do the same routing in nginx. `nginx/crawler-map.conf` (include in the `http`
block) and `nginx/rails-locations.conf` (include in the `server` block) are generated from the same file. The
second expects an upstream named `rails` and `/etc/nginx/proxy_params.conf`. Send crawlers to
`/og-shell?path=<original path>` from `location /` when `$is_crawler` is set.

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

## Inputs

| Name                                    | Description                                                                                                                                               | Default          |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `name`                                  | Resource name prefix                                                                                                                                      | —                |
| `rails_origin_domain`                   | Rails app domain                                                                                                                                          | —                |
| `assets_origin_domain`                  | Assets server domain                                                                                                                                      | —                |
| `aliases`                               | CloudFront CNAMEs                                                                                                                                         | `[]`             |
| `acm_certificate_arn`                   | ACM certificate ARN (us-east-1)                                                                                                                           | `null`           |
| `price_class`                           | CloudFront price class                                                                                                                                    | `PriceClass_100` |
| `static_shell_enabled`                  | Serve the framework-mode shell from the S3 bucket below instead of Rails                                                                                  | `false`          |
| `static_shell_bucket_domain_name`       | Regional domain name of the shell bucket; required with `static_shell_enabled`                                                                            | `null`           |
| `static_shell_origin_access_control_id` | Origin access control ID of the shell bucket; required with `static_shell_enabled`                                                                        | `null`           |
| `static_shell_ttl`                      | Edge TTL for the static shell (seconds)                                                                                                                   | `60`             |
| `og_shell_ttl`                          | TTL for `/og-shell` responses (seconds)                                                                                                                   | `3600`           |
| `cdn_spa_shell_ttl`                     | TTL for `/cdn-spa-shell` responses (seconds)                                                                                                              | `86400`          |
| `access_logs_enabled`                   | Deliver access logs to the destination below                                                                                                              | `false`          |
| `access_log_delivery_destination_arn`   | CloudWatch Logs delivery destination for access logs (from [`cloudfront_intercode_logging`](../cloudfront_intercode_logging)); no access logs when `null` | `null`           |

## Outputs

| Name                          | Description                                |
| ----------------------------- | ------------------------------------------ |
| `distribution_id`             | CloudFront distribution ID                 |
| `distribution_domain_name`    | Use as CNAME target for convention domains |
| `distribution_hosted_zone_id` | Use for Route 53 alias records             |
