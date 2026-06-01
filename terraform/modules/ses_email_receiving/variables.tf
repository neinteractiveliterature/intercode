variable "name" {
  description = "Prefix for resource names (e.g. 'intercode_production')."
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

variable "iam_group_name" {
  description = "Name of the IAM group to attach the email-receiving policy to (from intercode_aws_resources.iam_group_name)."
  type        = string
}
