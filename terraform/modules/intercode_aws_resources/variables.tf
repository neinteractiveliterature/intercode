variable "name" {
  description = "Prefix for SQS queue names and IAM resources (e.g. 'intercode_production')."
  type        = string
}

variable "s3_bucket_name" {
  description = "Name of the S3 bucket for uploads (e.g. 'intercode2-production')."
  type        = string
}

variable "inbox_bucket_name" {
  description = "Name of the S3 bucket for SES-received email (e.g. 'intercode-inbox')."
  type        = string
}

variable "sns_notification_endpoint" {
  description = "HTTPS URL that SES delivery notifications are POSTed to (e.g. 'https://www.neilhosting.net/sns_notifications')."
  type        = string
}

variable "alarm_email_destinations" {
  description = "Email addresses to notify when the CloudWatch queue-backup alarm fires."
  type        = set(string)
  default     = []
}
