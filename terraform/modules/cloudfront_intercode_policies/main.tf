# The cache and origin-request policies that cloudfront_intercode distributions use. They don't depend on the distribution,
# and an account can only hold a limited number of each, so a set can be shared by every distribution: create it once
# here and pass it to cloudfront_intercode as shared_policies. cloudfront_intercode creates its own set with this module
# when it isn't given one.
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

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

# Default behavior when the shell comes from the bucket. The key is the rewritten URI plus the `path` query parameter
# (set for crawlers only), and nothing else: S3 can't be sent the viewer's Host header, and the shell is identical for
# every domain. A short TTL keeps a new release's index.html from lingering; the hashed files it names stay in the
# bucket for much longer (see assets_bucket_intercode).
resource "aws_cloudfront_cache_policy" "static_shell" {
  count = var.static_shell_enabled ? 1 : 0

  name        = "${var.name}-static-shell"
  default_ttl = var.static_shell_ttl
  # CloudFront caps both the cache time and the stale-while-revalidate window at the maximum TTL, so this has to be
  # at least as long as the stale window the release gives index.html. The origin's own max-age still decides how
  # long a copy is fresh.
  max_ttl = coalesce(var.static_shell_max_ttl, var.static_shell_ttl)
  min_ttl = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config { cookie_behavior = "none" }
    headers_config { header_behavior = "none" }
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
