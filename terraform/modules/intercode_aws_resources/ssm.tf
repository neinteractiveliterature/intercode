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

resource "aws_ssm_parameter" "fly_api_token" {
  count = var.fly_api_token != null ? 1 : 0
  name  = "${local.ssm_path_prefix}/FLY_API_TOKEN"
  type  = "SecureString"
  value = var.fly_api_token
}

resource "aws_ssm_parameter" "secrets" {
  for_each = toset(nonsensitive(keys(var.secrets)))

  name  = "${local.ssm_path_prefix}/${each.key}"
  type  = "SecureString"
  value = var.secrets[each.key]
}

resource "aws_ssm_parameter" "database_url" {
  name  = "${local.ssm_path_prefix}/DATABASE_URL"
  type  = "SecureString"
  value = var.database_url
}

resource "random_password" "secret_key_base" {
  count   = var.secret_key_base == null ? 1 : 0
  length  = 128
  special = false
}

resource "aws_ssm_parameter" "secret_key_base" {
  name  = "${local.ssm_path_prefix}/SECRET_KEY_BASE"
  type  = "SecureString"
  value = var.secret_key_base != null ? var.secret_key_base : random_password.secret_key_base[0].result
}

resource "tls_private_key" "openid_connect_signing_key" {
  count     = var.openid_connect_signing_key == null ? 1 : 0
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_ssm_parameter" "openid_connect_signing_key" {
  name  = "${local.ssm_path_prefix}/OPENID_CONNECT_SIGNING_KEY"
  type  = "SecureString"
  value = var.openid_connect_signing_key != null ? var.openid_connect_signing_key : tls_private_key.openid_connect_signing_key[0].private_key_pem
}
