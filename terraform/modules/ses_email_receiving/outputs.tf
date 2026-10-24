output "inbox_bucket_name" {
  description = "Name of the SES inbox S3 bucket."
  value       = aws_s3_bucket.inbox.bucket
}

output "inbox_bucket_arn" {
  description = "ARN of the SES inbox S3 bucket."
  value       = aws_s3_bucket.inbox.arn
}

output "inbox_deliveries_sns_topic_arn" {
  description = "ARN of the SNS topic for SES delivery notifications."
  value       = aws_sns_topic.inbox_deliveries.arn
}


output "configuration_set_name" {
  description = "Name of the SES configuration set. Pass to intercode_aws_resources as ses_configuration_set so the app sends its email with it."
  value       = aws_ses_configuration_set.default.name
}
