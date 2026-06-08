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
  description = "Map of secret name to value for manually-managed secrets (e.g. DATABASE_URL, SECRET_KEY_BASE). Written to SSM Parameter Store as SecureString and loaded by chamber at app boot."
  type        = map(string)
  sensitive   = true
  default     = {}
}
