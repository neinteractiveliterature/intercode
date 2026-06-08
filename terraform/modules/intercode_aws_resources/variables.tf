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
