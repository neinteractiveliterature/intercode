output "iam_group_name" {
  description = "Name of the IAM group for the app. Pass to email-receiving modules so they can attach their own policies."
  value       = aws_iam_group.this.name
}

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

output "chamber_service" {
  description = "Value to set as CHAMBER_SERVICE in the app's environment. Chamber will load all SSM parameters under this path prefix at boot."
  value       = var.name
}

output "ssm_path_prefix" {
  description = "SSM Parameter Store path prefix where app secrets are stored (e.g. for use with aws ssm put-parameter for manually-managed secrets)."
  value       = "/${var.name}"
}

output "ssm_parameters_version" {
  description = "Opaque hash that changes whenever any SSM parameter managed by this module changes. Use as a trigger to restart services that load config at startup."
  value = sha256(jsonencode(merge(
    { for k, p in aws_ssm_parameter.params : k => p.version },
    { for k, p in aws_ssm_parameter.secrets : k => p.version },
  )))
}
