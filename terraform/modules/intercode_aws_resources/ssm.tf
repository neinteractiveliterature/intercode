locals {
  ssm_path_prefix = "/${var.name}"

  _email_forwarders_api_token = (
    var.email_forwarders_api_token != null
    ? var.email_forwarders_api_token
    : random_password.email_forwarders_api_token[0].result
  )
  _secret_key_base = (
    var.secret_key_base != null
    ? var.secret_key_base
    : random_password.secret_key_base[0].result
  )
  _openid_connect_signing_key = (
    var.openid_connect_signing_key != null
    ? var.openid_connect_signing_key
    : tls_private_key.openid_connect_signing_key[0].private_key_pem
  )

  # Map of SSM parameter name → value for all module-managed parameters.
  # This map is sensitive (contains secrets); use nonsensitive(keys(...)) for for_each.
  _ssm_values = merge(
    {
      AWS_ACCESS_KEY_ID          = aws_iam_access_key.this.id
      AWS_SECRET_ACCESS_KEY      = aws_iam_access_key.this.secret
      AWS_S3_BUCKET              = aws_s3_bucket.uploads.bucket
      AWS_REGION                 = local.region
      EMAIL_FORWARDERS_API_TOKEN = local._email_forwarders_api_token
      DATABASE_URL               = var.database_url
      SECRET_KEY_BASE            = local._secret_key_base
      OPENID_CONNECT_SIGNING_KEY = local._openid_connect_signing_key
      DEFAULT_CURRENCY           = var.default_currency
    },
    var.fly_api_token != null ? { FLY_API_TOKEN = var.fly_api_token } : {},
    var.stripe != null ? {
      STRIPE_SECRET_KEY              = var.stripe.secret_key
      STRIPE_PUBLISHABLE_KEY         = var.stripe.publishable_key
      STRIPE_CONNECT_ENDPOINT_SECRET = var.stripe.connect_endpoint_secret
    } : {},
    var.recaptcha != null ? {
      RECAPTCHA_SECRET_KEY = var.recaptcha.secret_key
      RECAPTCHA_SITE_KEY   = var.recaptcha.site_key
    } : {},
    var.twilio != null ? {
      TWILIO_ACCOUNT_SID = var.twilio.account_sid
      TWILIO_AUTH_TOKEN  = var.twilio.auth_token
    } : {},
    var.twilio != null && var.twilio.sms_number != null ? { TWILIO_SMS_NUMBER = var.twilio.sms_number } : {},
    var.autoscale != null ? {
      AUTOSCALE_MIN_INSTANCES = tostring(var.autoscale.min_instances)
      AUTOSCALE_MAX_INSTANCES = tostring(var.autoscale.max_instances)
    } : {},
    var.assets_host != null ? { ASSETS_HOST = var.assets_host } : {},
    var.uploads_host != null ? { UPLOADS_HOST = var.uploads_host } : {},
    var.cloudwatch_log_group != null ? { CLOUDWATCH_LOG_GROUP = var.cloudwatch_log_group } : {},
    var.intercode_host != null ? { INTERCODE_HOST = var.intercode_host } : {},
    var.intercode_certs_no_wildcard_domains != null ? {
      INTERCODE_CERTS_NO_WILDCARD_DOMAINS = var.intercode_certs_no_wildcard_domains
    } : {},
  )

  # SSM parameter types by name — "String" or "SecureString".
  # Maintained in parallel with _ssm_values; never sensitive.
  _ssm_types = merge(
    {
      AWS_ACCESS_KEY_ID          = "SecureString"
      AWS_SECRET_ACCESS_KEY      = "SecureString"
      AWS_S3_BUCKET              = "String"
      AWS_REGION                 = "String"
      EMAIL_FORWARDERS_API_TOKEN = "SecureString"
      DATABASE_URL               = "SecureString"
      SECRET_KEY_BASE            = "SecureString"
      OPENID_CONNECT_SIGNING_KEY = "SecureString"
      DEFAULT_CURRENCY           = "String"
    },
    var.fly_api_token != null ? { FLY_API_TOKEN = "SecureString" } : {},
    var.stripe != null ? {
      STRIPE_SECRET_KEY              = "SecureString"
      STRIPE_PUBLISHABLE_KEY         = "SecureString"
      STRIPE_CONNECT_ENDPOINT_SECRET = "SecureString"
    } : {},
    var.recaptcha != null ? {
      RECAPTCHA_SECRET_KEY = "SecureString"
      RECAPTCHA_SITE_KEY   = "SecureString"
    } : {},
    var.twilio != null ? {
      TWILIO_ACCOUNT_SID = "SecureString"
      TWILIO_AUTH_TOKEN  = "SecureString"
    } : {},
    var.twilio != null && var.twilio.sms_number != null ? { TWILIO_SMS_NUMBER = "String" } : {},
    var.autoscale != null ? {
      AUTOSCALE_MIN_INSTANCES = "String"
      AUTOSCALE_MAX_INSTANCES = "String"
    } : {},
    var.assets_host != null ? { ASSETS_HOST = "String" } : {},
    var.uploads_host != null ? { UPLOADS_HOST = "String" } : {},
    var.cloudwatch_log_group != null ? { CLOUDWATCH_LOG_GROUP = "String" } : {},
    var.intercode_host != null ? { INTERCODE_HOST = "String" } : {},
    var.intercode_certs_no_wildcard_domains != null ? {
      INTERCODE_CERTS_NO_WILDCARD_DOMAINS = "String"
    } : {},
  )
}

resource "random_password" "email_forwarders_api_token" {
  count   = var.email_forwarders_api_token == null ? 1 : 0
  length  = 128
  special = false
}

resource "random_password" "secret_key_base" {
  count   = var.secret_key_base == null ? 1 : 0
  length  = 128
  special = false
}

resource "tls_private_key" "openid_connect_signing_key" {
  count     = var.openid_connect_signing_key == null ? 1 : 0
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_ssm_parameter" "params" {
  for_each = toset(nonsensitive(keys(local._ssm_values)))

  name  = "${local.ssm_path_prefix}/${each.key}"
  type  = local._ssm_types[each.key]
  value = local._ssm_values[each.key]
}

# Freeform secrets map — written as SecureString, keyed by env var name.
resource "aws_ssm_parameter" "secrets" {
  for_each = toset(nonsensitive(keys(var.secrets)))

  name  = "${local.ssm_path_prefix}/${each.key}"
  type  = "SecureString"
  value = var.secrets[each.key]
}

# State migration: individual named resources → aws_ssm_parameter.params[key]
moved {
  from = aws_ssm_parameter.aws_access_key_id
  to   = aws_ssm_parameter.params["AWS_ACCESS_KEY_ID"]
}
moved {
  from = aws_ssm_parameter.aws_secret_access_key
  to   = aws_ssm_parameter.params["AWS_SECRET_ACCESS_KEY"]
}
moved {
  from = aws_ssm_parameter.aws_s3_bucket
  to   = aws_ssm_parameter.params["AWS_S3_BUCKET"]
}
moved {
  from = aws_ssm_parameter.aws_region
  to   = aws_ssm_parameter.params["AWS_REGION"]
}
moved {
  from = aws_ssm_parameter.email_forwarders_api_token
  to   = aws_ssm_parameter.params["EMAIL_FORWARDERS_API_TOKEN"]
}
moved {
  from = aws_ssm_parameter.database_url
  to   = aws_ssm_parameter.params["DATABASE_URL"]
}
moved {
  from = aws_ssm_parameter.secret_key_base
  to   = aws_ssm_parameter.params["SECRET_KEY_BASE"]
}
moved {
  from = aws_ssm_parameter.openid_connect_signing_key
  to   = aws_ssm_parameter.params["OPENID_CONNECT_SIGNING_KEY"]
}
moved {
  from = aws_ssm_parameter.default_currency
  to   = aws_ssm_parameter.params["DEFAULT_CURRENCY"]
}
moved {
  from = aws_ssm_parameter.fly_api_token[0]
  to   = aws_ssm_parameter.params["FLY_API_TOKEN"]
}
moved {
  from = aws_ssm_parameter.stripe_secret_key[0]
  to   = aws_ssm_parameter.params["STRIPE_SECRET_KEY"]
}
moved {
  from = aws_ssm_parameter.stripe_publishable_key[0]
  to   = aws_ssm_parameter.params["STRIPE_PUBLISHABLE_KEY"]
}
moved {
  from = aws_ssm_parameter.stripe_connect_endpoint_secret[0]
  to   = aws_ssm_parameter.params["STRIPE_CONNECT_ENDPOINT_SECRET"]
}
moved {
  from = aws_ssm_parameter.recaptcha_secret_key[0]
  to   = aws_ssm_parameter.params["RECAPTCHA_SECRET_KEY"]
}
moved {
  from = aws_ssm_parameter.recaptcha_site_key[0]
  to   = aws_ssm_parameter.params["RECAPTCHA_SITE_KEY"]
}
moved {
  from = aws_ssm_parameter.twilio_account_sid[0]
  to   = aws_ssm_parameter.params["TWILIO_ACCOUNT_SID"]
}
moved {
  from = aws_ssm_parameter.twilio_auth_token[0]
  to   = aws_ssm_parameter.params["TWILIO_AUTH_TOKEN"]
}
moved {
  from = aws_ssm_parameter.twilio_sms_number[0]
  to   = aws_ssm_parameter.params["TWILIO_SMS_NUMBER"]
}
moved {
  from = aws_ssm_parameter.autoscale_min_instances[0]
  to   = aws_ssm_parameter.params["AUTOSCALE_MIN_INSTANCES"]
}
moved {
  from = aws_ssm_parameter.autoscale_max_instances[0]
  to   = aws_ssm_parameter.params["AUTOSCALE_MAX_INSTANCES"]
}
moved {
  from = aws_ssm_parameter.assets_host[0]
  to   = aws_ssm_parameter.params["ASSETS_HOST"]
}
moved {
  from = aws_ssm_parameter.uploads_host[0]
  to   = aws_ssm_parameter.params["UPLOADS_HOST"]
}
moved {
  from = aws_ssm_parameter.cloudwatch_log_group[0]
  to   = aws_ssm_parameter.params["CLOUDWATCH_LOG_GROUP"]
}
moved {
  from = aws_ssm_parameter.intercode_host[0]
  to   = aws_ssm_parameter.params["INTERCODE_HOST"]
}
moved {
  from = aws_ssm_parameter.intercode_certs_no_wildcard_domains[0]
  to   = aws_ssm_parameter.params["INTERCODE_CERTS_NO_WILDCARD_DOMAINS"]
}
