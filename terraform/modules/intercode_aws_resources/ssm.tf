locals {
  ssm_path_prefix = "/${var.name}"
}

resource "aws_ssm_parameter" "aws_access_key_id" {
  name  = "${local.ssm_path_prefix}/AWS_ACCESS_KEY_ID"
  type  = "SecureString"
  value = aws_iam_access_key.this.id
}

resource "aws_ssm_parameter" "aws_secret_access_key" {
  name  = "${local.ssm_path_prefix}/AWS_SECRET_ACCESS_KEY"
  type  = "SecureString"
  value = aws_iam_access_key.this.secret
}

resource "aws_ssm_parameter" "aws_s3_bucket" {
  name  = "${local.ssm_path_prefix}/AWS_S3_BUCKET"
  type  = "String"
  value = aws_s3_bucket.uploads.bucket
}

resource "aws_ssm_parameter" "aws_region" {
  name  = "${local.ssm_path_prefix}/AWS_REGION"
  type  = "String"
  value = local.region
}

resource "aws_ssm_parameter" "secrets" {
  for_each = nonsensitive(var.secrets)

  name  = "${local.ssm_path_prefix}/${each.key}"
  type  = "SecureString"
  value = each.value
}
