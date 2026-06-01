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
