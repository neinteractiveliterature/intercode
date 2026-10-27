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

The crawler list and the Rails path list in `crawler_router.js` need to stay in step with the behaviors above and
with Rails' routes. Tests for the function run with `node --test terraform/modules/cloudfront_intercode/crawler_router.test.mjs`.

Because the old Lambda@Edge function is replaced, applying this change on an existing deployment destroys it, and
AWS will not delete a Lambda@Edge function until its edge replicas are gone, which can take a few hours after the
distribution stops using it. If the first apply fails on that step, apply again later.

## Host header forwarding

Intercode uses the `Host` header to resolve the convention for each request.
The origin-request policies in this module forward the viewer's `Host` header
to the Rails origin, so multi-tenant routing works correctly behind CloudFront.

## Inputs

| Name                                  | Description                                                                                                                                               | Default          |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `name`                                | Resource name prefix                                                                                                                                      | —                |
| `rails_origin_domain`                 | Rails app domain                                                                                                                                          | —                |
| `assets_origin_domain`                | Assets server domain                                                                                                                                      | —                |
| `aliases`                             | CloudFront CNAMEs                                                                                                                                         | `[]`             |
| `acm_certificate_arn`                 | ACM certificate ARN (us-east-1)                                                                                                                           | `null`           |
| `price_class`                         | CloudFront price class                                                                                                                                    | `PriceClass_100` |
| `og_shell_ttl`                        | TTL for `/og-shell` responses (seconds)                                                                                                                   | `3600`           |
| `cdn_spa_shell_ttl`                   | TTL for `/cdn-spa-shell` responses (seconds)                                                                                                              | `86400`          |
| `access_logs_enabled`                 | Deliver access logs to the destination below                                                                                                              | `false`          |
| `access_log_delivery_destination_arn` | CloudWatch Logs delivery destination for access logs (from [`cloudfront_intercode_logging`](../cloudfront_intercode_logging)); no access logs when `null` | `null`           |

## Outputs

| Name                          | Description                                |
| ----------------------------- | ------------------------------------------ |
| `distribution_id`             | CloudFront distribution ID                 |
| `distribution_domain_name`    | Use as CNAME target for convention domains |
| `distribution_hosted_zone_id` | Use for Route 53 alias records             |
