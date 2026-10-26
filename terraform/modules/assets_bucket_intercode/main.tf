terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.81"
    }
  }
}

locals {
  github_role_enabled = var.github_repository != null
  github_oidc_provider_arn = (
    var.create_github_oidc_provider
    ? aws_iam_openid_connect_provider.github[0].arn
    : var.github_oidc_provider_arn
  )
}

# ---------------------------------------------------------------------------
# Bucket
# ---------------------------------------------------------------------------

resource "aws_s3_bucket" "assets" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_public_access_block" "assets" {
  bucket = aws_s3_bucket.assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Release assets are uploaded again by every release (see the README), so an
# object's age is the time since the last release that contained it.
resource "aws_s3_bucket_lifecycle_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id

  rule {
    id     = "expire-old-release-assets"
    status = "Enabled"

    filter {}

    expiration {
      days = var.retention_days
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }
  }
}

# The app's convention domains load module scripts cross-origin from the assets
# host, which needs the same header Rails sets on static files.
resource "aws_s3_bucket_cors_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id

  cors_rule {
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    allowed_headers = ["*"]
    max_age_seconds = 86400
  }
}

# ---------------------------------------------------------------------------
# CloudFront access
# ---------------------------------------------------------------------------

resource "aws_cloudfront_origin_access_control" "assets" {
  name                              = var.bucket_name
  description                       = "Access to the ${var.bucket_name} assets bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

data "aws_iam_policy_document" "cloudfront_read" {
  count = length(var.cloudfront_distribution_arns) > 0 ? 1 : 0

  statement {
    sid       = "CloudFrontRead"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.assets.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "ArnLike"
      variable = "AWS:SourceArn"
      values   = var.cloudfront_distribution_arns
    }
  }

  # Without s3:ListBucket, S3 answers a missing key with 403 instead of 404.
  statement {
    sid       = "CloudFrontList"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.assets.arn]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "ArnLike"
      variable = "AWS:SourceArn"
      values   = var.cloudfront_distribution_arns
    }
  }
}

resource "aws_s3_bucket_policy" "assets" {
  count = length(var.cloudfront_distribution_arns) > 0 ? 1 : 0

  bucket = aws_s3_bucket.assets.id
  policy = data.aws_iam_policy_document.cloudfront_read[0].json

  depends_on = [aws_s3_bucket_public_access_block.assets]
}

# ---------------------------------------------------------------------------
# Release upload role (GitHub Actions via OIDC)
# ---------------------------------------------------------------------------

resource "aws_iam_openid_connect_provider" "github" {
  count = local.github_role_enabled && var.create_github_oidc_provider ? 1 : 0

  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
}

data "aws_iam_policy_document" "github_assume_role" {
  count = local.github_role_enabled ? 1 : 0

  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [local.github_oidc_provider_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = coalesce(var.github_oidc_subjects, ["repo:${var.github_repository}:ref:refs/tags/*"])
    }
  }
}

resource "aws_iam_role" "release_upload" {
  count = local.github_role_enabled ? 1 : 0

  name               = "${var.bucket_name}-release-upload"
  assume_role_policy = data.aws_iam_policy_document.github_assume_role[0].json
}

data "aws_iam_policy_document" "release_upload" {
  count = local.github_role_enabled ? 1 : 0

  statement {
    actions   = ["s3:PutObject"]
    resources = ["${aws_s3_bucket.assets.arn}/*"]
  }

  statement {
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.assets.arn]
  }
}

resource "aws_iam_role_policy" "release_upload" {
  count = local.github_role_enabled ? 1 : 0

  name   = "upload-release-assets"
  role   = aws_iam_role.release_upload[0].id
  policy = data.aws_iam_policy_document.release_upload[0].json
}
