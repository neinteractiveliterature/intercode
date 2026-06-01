# cloudfront_intercode Terraform module

Creates a CloudFront distribution in front of an Intercode Rails origin with:

- Long-TTL caching of `/packs/*` from the assets server
- No-cache pass-through for API/auth endpoints
- Crawler detection via a Lambda@Edge origin-request function:
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

Lambda@Edge functions must be deployed in `us-east-1`. This module requires a
provider alias named `aws.us_east_1` configured for that region. Pass it via
the `providers` map as shown above.

## Host header forwarding

Intercode uses the `Host` header to resolve the convention for each request.
The origin-request policies in this module forward the viewer's `Host` header
to the Rails origin, so multi-tenant routing works correctly behind CloudFront.

## Inputs

| Name                   | Description                                  | Default          |
| ---------------------- | -------------------------------------------- | ---------------- |
| `name`                 | Resource name prefix                         | —                |
| `rails_origin_domain`  | Rails app domain                             | —                |
| `assets_origin_domain` | Assets server domain                         | —                |
| `aliases`              | CloudFront CNAMEs                            | `[]`             |
| `acm_certificate_arn`  | ACM certificate ARN (us-east-1)              | `null`           |
| `price_class`          | CloudFront price class                       | `PriceClass_100` |
| `og_shell_ttl`         | TTL for `/og-shell` responses (seconds)      | `3600`           |
| `cdn_spa_shell_ttl`    | TTL for `/cdn-spa-shell` responses (seconds) | `86400`          |

## Outputs

| Name                          | Description                                |
| ----------------------------- | ------------------------------------------ |
| `distribution_id`             | CloudFront distribution ID                 |
| `distribution_domain_name`    | Use as CNAME target for convention domains |
| `distribution_hosted_zone_id` | Use for Route 53 alias records             |
