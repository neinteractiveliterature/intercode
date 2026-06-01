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

variable "inbox_bucket_arn" {
  description = "ARN of the inbox S3 bucket. When provided, the IAM policy grants the app read/write access to it."
  type        = string
  default     = null
}

variable "inbox_sns_topic_arn" {
  description = "ARN of the inbox SNS topic. When provided, the IAM policy grants sns:ConfirmSubscription on it."
  type        = string
  default     = null
}

variable "kms_key_arn" {
  description = "ARN of the KMS key used for SES decryption. When provided, the IAM policy grants kms:Decrypt on it."
  type        = string
  default     = null
}
