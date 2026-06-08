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

resource "random_password" "email_forwarders_api_token" {
  count   = var.email_forwarders_api_token == null ? 1 : 0
  length  = 128
  special = false
}

resource "aws_ssm_parameter" "email_forwarders_api_token" {
  name  = "${local.ssm_path_prefix}/EMAIL_FORWARDERS_API_TOKEN"
  type  = "SecureString"
  value = var.email_forwarders_api_token != null ? var.email_forwarders_api_token : random_password.email_forwarders_api_token[0].result
}

resource "aws_ssm_parameter" "fly_api_token" {
  count = var.fly_api_token != null ? 1 : 0
  name  = "${local.ssm_path_prefix}/FLY_API_TOKEN"
  type  = "SecureString"
  value = var.fly_api_token
}

resource "aws_ssm_parameter" "stripe_secret_key" {
  count = var.stripe != null ? 1 : 0
  name  = "${local.ssm_path_prefix}/STRIPE_SECRET_KEY"
  type  = "SecureString"
  value = var.stripe.secret_key
}

resource "aws_ssm_parameter" "stripe_publishable_key" {
  count = var.stripe != null ? 1 : 0
  name  = "${local.ssm_path_prefix}/STRIPE_PUBLISHABLE_KEY"
  type  = "SecureString"
  value = var.stripe.publishable_key
}

resource "aws_ssm_parameter" "stripe_connect_endpoint_secret" {
  count = var.stripe != null ? 1 : 0
  name  = "${local.ssm_path_prefix}/STRIPE_CONNECT_ENDPOINT_SECRET"
  type  = "SecureString"
  value = var.stripe.connect_endpoint_secret
}

resource "aws_ssm_parameter" "recaptcha_secret_key" {
  count = var.recaptcha != null ? 1 : 0
  name  = "${local.ssm_path_prefix}/RECAPTCHA_SECRET_KEY"
  type  = "SecureString"
  value = var.recaptcha.secret_key
}

resource "aws_ssm_parameter" "recaptcha_site_key" {
  count = var.recaptcha != null ? 1 : 0
  name  = "${local.ssm_path_prefix}/RECAPTCHA_SITE_KEY"
  type  = "SecureString"
  value = var.recaptcha.site_key
}

resource "aws_ssm_parameter" "twilio_account_sid" {
  count = var.twilio != null ? 1 : 0
  name  = "${local.ssm_path_prefix}/TWILIO_ACCOUNT_SID"
  type  = "SecureString"
  value = var.twilio.account_sid
}

resource "aws_ssm_parameter" "twilio_auth_token" {
  count = var.twilio != null ? 1 : 0
  name  = "${local.ssm_path_prefix}/TWILIO_AUTH_TOKEN"
  type  = "SecureString"
  value = var.twilio.auth_token
}

resource "aws_ssm_parameter" "twilio_sms_number" {
  count = var.twilio != null && var.twilio.sms_number != null ? 1 : 0
  name  = "${local.ssm_path_prefix}/TWILIO_SMS_NUMBER"
  type  = "String"
  value = var.twilio.sms_number
}

resource "aws_ssm_parameter" "intercode_host" {
  count = var.intercode_host != null ? 1 : 0
  name  = "${local.ssm_path_prefix}/INTERCODE_HOST"
  type  = "String"
  value = var.intercode_host
}

resource "aws_ssm_parameter" "intercode_certs_no_wildcard_domains" {
  count = var.intercode_certs_no_wildcard_domains != null ? 1 : 0
  name  = "${local.ssm_path_prefix}/INTERCODE_CERTS_NO_WILDCARD_DOMAINS"
  type  = "String"
  value = var.intercode_certs_no_wildcard_domains
}

resource "aws_ssm_parameter" "autoscale_min_instances" {
  count = var.autoscale != null ? 1 : 0
  name  = "${local.ssm_path_prefix}/AUTOSCALE_MIN_INSTANCES"
  type  = "String"
  value = tostring(var.autoscale.min_instances)
}

resource "aws_ssm_parameter" "autoscale_max_instances" {
  count = var.autoscale != null ? 1 : 0
  name  = "${local.ssm_path_prefix}/AUTOSCALE_MAX_INSTANCES"
  type  = "String"
  value = tostring(var.autoscale.max_instances)
}

resource "aws_ssm_parameter" "assets_host" {
  count = var.assets_host != null ? 1 : 0
  name  = "${local.ssm_path_prefix}/ASSETS_HOST"
  type  = "String"
  value = var.assets_host
}

resource "aws_ssm_parameter" "uploads_host" {
  count = var.uploads_host != null ? 1 : 0
  name  = "${local.ssm_path_prefix}/UPLOADS_HOST"
  type  = "String"
  value = var.uploads_host
}

resource "aws_ssm_parameter" "cloudwatch_log_group" {
  count = var.cloudwatch_log_group != null ? 1 : 0
  name  = "${local.ssm_path_prefix}/CLOUDWATCH_LOG_GROUP"
  type  = "String"
  value = var.cloudwatch_log_group
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
