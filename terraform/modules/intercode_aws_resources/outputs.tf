output "s3_bucket_name" {
  description = "Name of the uploads S3 bucket."
  value       = aws_s3_bucket.uploads.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the uploads S3 bucket."
  value       = aws_s3_bucket.uploads.arn
}

output "sqs_queue_urls" {
  description = "Map of queue name to SQS URL."
  value = {
    default     = aws_sqs_queue.default.url
    mailers     = aws_sqs_queue.mailers.url
    ahoy        = aws_sqs_queue.ahoy.url
    dead_letter = aws_sqs_queue.dead_letter.url
  }
}

output "sqs_queue_arns" {
  description = "Map of queue name to SQS ARN."
  value = {
    default     = aws_sqs_queue.default.arn
    mailers     = aws_sqs_queue.mailers.arn
    ahoy        = aws_sqs_queue.ahoy.arn
    dead_letter = aws_sqs_queue.dead_letter.arn
  }
}

output "alarm_sns_topic_arn" {
  description = "ARN of the SNS topic that receives CloudWatch alarm notifications."
  value       = aws_sns_topic.alarms.arn
}

output "iam_access_key_id" {
  description = "AWS access key ID for the app IAM user."
  value       = aws_iam_access_key.this.id
}

output "iam_access_key_secret" {
  description = "AWS secret access key for the app IAM user."
  value       = aws_iam_access_key.this.secret
  sensitive   = true
}
