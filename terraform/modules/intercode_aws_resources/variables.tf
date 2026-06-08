variable "name" {
  description = "Prefix for SQS queue names and IAM resources (e.g. 'intercode_production')."
  type        = string
}

variable "s3_bucket_name" {
  description = "Name of the S3 bucket for uploads (e.g. 'intercode2-production')."
  type        = string
}

variable "alarm_email_destinations" {
  description = "Email addresses to notify when the CloudWatch queue-backup alarm fires."
  type        = set(string)
  default     = []
}

variable "secrets" {
  description = "Map of secret name to value for manually-managed secrets. Written to SSM Parameter Store as SecureString and loaded by chamber at app boot."
  type        = map(string)
  sensitive   = true
  default     = {}
}

variable "database_url" {
  description = "Full database connection URL (e.g. postgres://user:pass@host/db). Required — Intercode will not function without it."
  type        = string
  sensitive   = true
}

variable "secret_key_base" {
  description = "Rails SECRET_KEY_BASE. If null, a random 128-character value is generated."
  type        = string
  sensitive   = true
  default     = null
}

variable "openid_connect_signing_key" {
  description = "RSA private key PEM for OpenID Connect token signing. If null, a 4096-bit key is generated."
  type        = string
  sensitive   = true
  default     = null
}

variable "email_forwarders_api_token" {
  description = "Secret key used to authenticate email forwarding requests. If null, a random value is generated."
  type        = string
  sensitive   = true
  default     = null
}

variable "fly_api_token" {
  description = "Fly.io API token for runtime use (e.g. auto-scaling). Optional — not required for all deployments."
  type        = string
  sensitive   = true
  default     = null
}

variable "stripe" {
  description = "Stripe API credentials. If null, no Stripe SSM parameters are written."
  type = object({
    secret_key              = string
    publishable_key         = string
    connect_endpoint_secret = string
  })
  sensitive = true
  default   = null
}

variable "recaptcha" {
  description = "Google reCAPTCHA credentials. If null, no reCAPTCHA SSM parameters are written."
  type = object({
    secret_key = string
    site_key   = string
  })
  sensitive = true
  default   = null
}

variable "twilio" {
  description = "Twilio credentials. If null, no Twilio SSM parameters are written."
  type = object({
    account_sid = string
    auth_token  = string
  })
  sensitive = true
  default   = null
}

variable "autoscale" {
  description = "Fly.io auto-scaling configuration. If null, no autoscale SSM parameters are written."
  type = object({
    min_instances = number
    max_instances = number
  })
  default = null
}
