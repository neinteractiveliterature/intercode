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
  rails_origin_id  = "rails"
  assets_origin_id = "assets"
}

# ---------------------------------------------------------------------------
# Cache / origin-request policies
# ---------------------------------------------------------------------------

# Forward all viewer headers, cookies, and query strings to the Rails origin.
resource "aws_cloudfront_origin_request_policy" "forward_all" {
  name = "${var.name}-forward-all"

  cookies_config { cookie_behavior = "all" }
  query_strings_config { query_string_behavior = "all" }
  headers_config { header_behavior = "allViewer" }
}

# /og-shell: forward Host + the `path` query param so each path caches
# separately per convention domain.
resource "aws_cloudfront_origin_request_policy" "og_shell" {
  name = "${var.name}-og-shell"

  cookies_config { cookie_behavior = "none" }

  headers_config {
    header_behavior = "whitelist"
    headers {
      items = ["Host"]
    }
  }

  query_strings_config {
    query_string_behavior = "whitelist"
    query_strings {
      items = ["path"]
    }
  }
}

resource "aws_cloudfront_cache_policy" "no_cache" {
  name        = "${var.name}-no-cache"
  default_ttl = 0
  max_ttl     = 0
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config { cookie_behavior = "none" }
    headers_config { header_behavior = "none" }
    query_strings_config { query_string_behavior = "none" }
    enable_accept_encoding_gzip   = false
    enable_accept_encoding_brotli = false
  }
}

# /cdn-spa-shell: cache keyed on Host so each convention gets its own entry.
resource "aws_cloudfront_cache_policy" "cdn_spa_shell" {
  name        = "${var.name}-cdn-spa-shell"
  default_ttl = var.cdn_spa_shell_ttl
  max_ttl     = var.cdn_spa_shell_ttl
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config { cookie_behavior = "none" }
    headers_config {
      header_behavior = "whitelist"
      headers {
        items = ["Host"]
      }
    }
    query_strings_config { query_string_behavior = "none" }
    enable_accept_encoding_gzip   = true
    enable_accept_encoding_brotli = true
  }
}

# /og-shell: cache keyed on Host + path query param.
resource "aws_cloudfront_cache_policy" "og_shell" {
  name        = "${var.name}-og-shell"
  default_ttl = var.og_shell_ttl
  max_ttl     = var.og_shell_ttl
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config { cookie_behavior = "none" }
    headers_config {
      header_behavior = "whitelist"
      headers {
        items = ["Host"]
      }
    }
    query_strings_config {
      query_string_behavior = "whitelist"
      query_strings {
        items = ["path"]
      }
    }
    enable_accept_encoding_gzip   = true
    enable_accept_encoding_brotli = true
  }
}

# Default behavior: the router function rewrites SPA routes to /cdn-spa-shell (browsers) or /og-shell?path=...
# (crawlers) before the cache lookup, so the cache is keyed on Host plus the `path` query parameter. Without `path`
# in the key every crawled page would share one /og-shell entry. TTLs follow what Rails sends, which is a day for
# /cdn-spa-shell and nothing for /og-shell.
resource "aws_cloudfront_cache_policy" "default_router" {
  name        = "${var.name}-default-router"
  default_ttl = var.cdn_spa_shell_ttl
  max_ttl     = var.cdn_spa_shell_ttl
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config { cookie_behavior = "none" }
    headers_config {
      header_behavior = "whitelist"
      headers {
        items = ["Host"]
      }
    }
    query_strings_config {
      query_string_behavior = "whitelist"
      query_strings {
        items = ["path"]
      }
    }
    enable_accept_encoding_gzip   = true
    enable_accept_encoding_brotli = true
  }
}

# Sends crawlers to /og-shell and everyone else to /cdn-spa-shell. This is a viewer-request function, which runs
# before the cache lookup on every request; the previous Lambda@Edge origin-request router only ran on a cache miss,
# so a crawler could be served a browser's cached generic shell.
resource "aws_cloudfront_function" "crawler_router" {
  name    = "${var.name}-og-router"
  comment = "Routes crawlers to /og-shell and everyone else to /cdn-spa-shell"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = file("${path.module}/crawler_router.js")
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
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # Assets origin (nginx serving /packs)
  origin {
    origin_id   = local.assets_origin_id
    domain_name = var.assets_origin_domain

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # /packs/* — immutable assets, long cache, served from assets origin.
  ordered_cache_behavior {
    path_pattern     = "/packs/*"
    target_origin_id = local.assets_origin_id
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    compress         = true

    # CachingOptimized managed policy
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"

    viewer_protocol_policy = "redirect-to-https"
  }

  # /oauth_session/* — cookie-exchange endpoints that need the refresh token cookie forwarded.
  ordered_cache_behavior {
    path_pattern           = "/oauth_session/*"
    target_origin_id       = local.rails_origin_id
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = aws_cloudfront_cache_policy.no_cache.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.forward_all.id
    viewer_protocol_policy = "redirect-to-https"
  }

  # No-cache pass-through behaviours for all non-shell Rails routes.
  dynamic "ordered_cache_behavior" {
    for_each = [
      # Auth / session
      "/users/*",
      "/oauth/*",
      "/authenticity_tokens",
      "/client_configuration",
      # App-server APIs
      "/graphql",
      "/graphiql",
      "/email_forwarders/*",
      "/sns_notifications",
      "/stripe_webhook/*",
      "/stripe_account/*",
      "/healthz",
      "/sitemap.xml",
      # Convention-scoped HTML routes
      "/reports/*",
      "/calendars/*",
      "/csv_exports/*",
      "/user_con_profiles/*",
      # Active Storage / uploads
      "/rails/active_storage/*",
      "/uploads/*",
    ]
    content {
      path_pattern           = ordered_cache_behavior.value
      target_origin_id       = local.rails_origin_id
      allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
      cached_methods         = ["GET", "HEAD"]
      compress               = true
      cache_policy_id        = aws_cloudfront_cache_policy.no_cache.id
      origin_request_policy_id = aws_cloudfront_origin_request_policy.forward_all.id
      viewer_protocol_policy = "redirect-to-https"
    }
  }

  # /cdn-spa-shell — lightweight SPA shell for regular CloudFront users.
  ordered_cache_behavior {
    path_pattern             = "/cdn-spa-shell"
    target_origin_id         = local.rails_origin_id
    allowed_methods          = ["GET", "HEAD"]
    cached_methods           = ["GET", "HEAD"]
    compress                 = true
    cache_policy_id          = aws_cloudfront_cache_policy.cdn_spa_shell.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.forward_all.id
    viewer_protocol_policy   = "redirect-to-https"
  }

  # /og-shell — per-resource OG shell for crawlers.
  ordered_cache_behavior {
    path_pattern             = "/og-shell"
    target_origin_id         = local.rails_origin_id
    allowed_methods          = ["GET", "HEAD"]
    cached_methods           = ["GET", "HEAD"]
    compress                 = true
    cache_policy_id          = aws_cloudfront_cache_policy.og_shell.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.og_shell.id
    viewer_protocol_policy   = "redirect-to-https"
  }

  # Default — all SPA routes. The router function rewrites to /cdn-spa-shell or /og-shell.
  default_cache_behavior {
    target_origin_id         = local.rails_origin_id
    allowed_methods          = ["GET", "HEAD"]
    cached_methods           = ["GET", "HEAD"]
    compress                 = true
    cache_policy_id          = aws_cloudfront_cache_policy.default_router.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.forward_all.id
    viewer_protocol_policy   = "redirect-to-https"

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
