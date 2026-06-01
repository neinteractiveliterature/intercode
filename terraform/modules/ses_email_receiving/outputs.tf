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

output "kms_key_arn" {
  description = "ARN of the KMS key used to encrypt emails in S3 (the AWS-managed SES key)."
  value       = "arn:aws:kms:${local.region}:${local.account_id}:alias/aws/ses"
}
