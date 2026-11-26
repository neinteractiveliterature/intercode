terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = ">= 5.0"
      configuration_aliases = [aws.us_east_1]
    }
  }
}

# ---------------------------------------------------------------------------
# Origins
# ---------------------------------------------------------------------------

locals {
  rails_origin_id        = "rails"
  static_shell_origin_id = "static-shell"

  # Every path that is routed by something other than the SPA fallback. See the README for what to edit.
  routing = jsondecode(file("${path.module}/routing.json"))
}

# ---------------------------------------------------------------------------
# Cache / origin-request policies
# ---------------------------------------------------------------------------

# An account can only hold a limited number of cache policies and origin request policies, and these don't depend on the
# distribution, so a set can be created once (see the cloudfront_intercode_policies module) and shared by passing
# shared_policies. Without it, this distribution gets a set of its own.
module "policies" {
  count  = var.shared_policies == null ? 1 : 0
  source = "../cloudfront_intercode_policies"

  name             = var.name
  og_shell_ttl     = var.og_shell_ttl
  static_shell_ttl = var.static_shell_ttl
}

locals {
  cache_policy_ids          = var.shared_policies == null ? one(module.policies[*].cache_policy_ids) : var.shared_policies.cache_policy_ids
  origin_request_policy_ids = var.shared_policies == null ? one(module.policies[*].origin_request_policy_ids) : var.shared_policies.origin_request_policy_ids
}

# The policies used to be resources of this module itself.
moved {
  from = aws_cloudfront_origin_request_policy.forward_all
  to   = module.policies[0].aws_cloudfront_origin_request_policy.forward_all
}

moved {
  from = aws_cloudfront_origin_request_policy.og_shell
  to   = module.policies[0].aws_cloudfront_origin_request_policy.og_shell
}

moved {
  from = aws_cloudfront_cache_policy.no_cache
  to   = module.policies[0].aws_cloudfront_cache_policy.no_cache
}

moved {
  from = aws_cloudfront_cache_policy.og_shell
  to   = module.policies[0].aws_cloudfront_cache_policy.og_shell
}

moved {
  from = aws_cloudfront_cache_policy.static_shell
  to   = module.policies[0].aws_cloudfront_cache_policy.static_shell
}

# Sends crawlers and Rails paths to Rails and everyone else to the static shell. This is a viewer-request function, which runs
# before the cache lookup on every request; the previous Lambda@Edge origin-request router only ran on a cache miss,
# so a crawler could be served a browser's cached generic shell.
resource "aws_cloudfront_function" "crawler_router" {
  name    = "${var.name}-og-router"
  comment = "Routes crawlers and Rails paths to Rails and everyone else to the static shell"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = file("${path.module}/static_shell_router.js")
}

# ---------------------------------------------------------------------------
# Distribution
# ---------------------------------------------------------------------------

resource "aws_cloudfront_distribution" "this" {
  enabled         = true
  is_ipv6_enabled = true
  price_class     = var.price_class
  aliases         = var.aliases
  comment         = var.name

  # Rails origin
  origin {
    origin_id   = local.rails_origin_id
    domain_name = var.rails_origin_domain

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "https-only"
      origin_ssl_protocols     = ["TLSv1.2"]
      origin_keepalive_timeout = var.rails_origin_keepalive_timeout
    }
  }

  # Static shell bucket (the frontend build). Access is by origin access control, so no custom origin config and no
  # Host header.
  origin {
    origin_id                = local.static_shell_origin_id
    domain_name              = var.static_shell_bucket_domain_name
    origin_access_control_id = var.static_shell_origin_access_control_id
  }

  # /assets/* — the build's hashed files, from the bucket. Same domain as the app, so no CORS needed.
  ordered_cache_behavior {
    path_pattern           = "/assets/*"
    target_origin_id       = local.static_shell_origin_id
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimized managed policy
    viewer_protocol_policy = "redirect-to-https"
  }

  # No-cache pass-through behaviours for all non-shell Rails routes, from routing.json (the one place to add a route).
  # /oauth_session/* needs the refresh token cookie forwarded, which forward_all does.
  dynamic "ordered_cache_behavior" {
    for_each = local.routing.rails_paths
    content {
      path_pattern               = ordered_cache_behavior.value
      target_origin_id           = local.rails_origin_id
      allowed_methods            = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
      cached_methods             = ["GET", "HEAD"]
      compress                   = true
      cache_policy_id            = local.cache_policy_ids.no_cache
      origin_request_policy_id   = local.origin_request_policy_ids.forward_all
      response_headers_policy_id = var.rails_response_headers_policy_id
      viewer_protocol_policy     = "redirect-to-https"
    }
  }

  # /og-shell — per-resource OG shell for crawlers.
  ordered_cache_behavior {
    path_pattern             = "/og-shell"
    target_origin_id         = local.rails_origin_id
    allowed_methods          = ["GET", "HEAD"]
    cached_methods           = ["GET", "HEAD"]
    compress                 = true
    cache_policy_id          = local.cache_policy_ids.og_shell
    origin_request_policy_id = local.origin_request_policy_ids.og_shell
    viewer_protocol_policy   = "redirect-to-https"
  }

  # Default — all SPA routes, served as /index.html from the bucket. The router function sends crawlers to /og-shell on
  # Rails instead.
  default_cache_behavior {
    target_origin_id = local.static_shell_origin_id
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    compress         = true
    # The bucket can't be sent the viewer's headers, so there is no origin request policy; the router passes Host to Rails
    cache_policy_id        = local.cache_policy_ids.static_shell
    viewer_protocol_policy = "redirect-to-https"

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.crawler_router.arn
    }
  }

  dynamic "viewer_certificate" {
    for_each = var.acm_certificate_arn != null ? [1] : []
    content {
      acm_certificate_arn      = var.acm_certificate_arn
      ssl_support_method       = "sni-only"
      minimum_protocol_version = "TLSv1.2_2021"
    }
  }

  dynamic "viewer_certificate" {
    for_each = var.acm_certificate_arn == null ? [1] : []
    content {
      cloudfront_default_certificate = true
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}
